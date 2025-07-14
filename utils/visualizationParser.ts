import { Visualization } from '@/types';

export function parseVisualizationsFromMarkdown(text: string, rawLines?: string[]): Visualization[] {
  const visualizations: Visualization[] = [];
  
  // Parse markdown tables
  const tableRegex = /\|(.+)\|[\r\n]+\|[-\s|:]+\|[\r\n]+((?:\|.+\|[\r\n]*)+)/g;
  let tableMatch;
  
  while ((tableMatch = tableRegex.exec(text)) !== null) {
    const headerRow = tableMatch[1].split('|').map(cell => cell.trim()).filter(cell => cell);
    const dataRows = tableMatch[2].split('\n').filter(row => row.trim() && row.includes('|'));
    
    const tableData = dataRows.map(row => {
      const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
      const rowData: any = {};
      headerRow.forEach((header, index) => {
        rowData[header] = cells[index] || '';
      });
      return rowData;
    });
    
    if (tableData.length > 0) {
      visualizations.push({
        type: 'table',
        data: tableData,
        title: 'Data Table'
      });
    }
  }
  
  // Parse chart references (chart_id patterns)
  const chartIdRegex = /chart_id[:\s]*([a-zA-Z0-9_-]+)/gi;
  let chartMatch;
  
  while ((chartMatch = chartIdRegex.exec(text)) !== null) {
    visualizations.push({
      type: 'chart',
      data: { chart_id: chartMatch[1] },
      title: 'Chart Visualization'
    });
  }
  
  // Parse JSON chart data blocks
  const chartJsonRegex = /```(?:json|chart)\s*\n([\s\S]*?)\n```/gi;
  let chartJsonMatch;
  
  while ((chartJsonMatch = chartJsonRegex.exec(text)) !== null) {
    try {
      const chartData = JSON.parse(chartJsonMatch[1]);
      if (chartData.type && (chartData.data || chartData.datasets)) {
        visualizations.push({
          type: 'chart',
          data: chartData,
          title: chartData.title || 'Chart'
        });
      }
    } catch (e) {
      // Skip invalid JSON
    }
  }

  // Parse chart data from tool_start/tool_end blocks in rawLines
  if (rawLines && Array.isArray(rawLines)) {
    for (const line of rawLines) {
      try {
        const obj = JSON.parse(line);
        if ((obj.type === 'tool_start' || obj.type === 'tool_end') && obj.input && obj.tool && obj.tool.startsWith('generate_')) {
          const input = obj.input;
          // PIE CHART: If input.data is array of {category, value}
          if (obj.tool.includes('pie') && Array.isArray(input.data) && input.data[0]?.category && input.data[0]?.value) {
            visualizations.push({
              type: 'chart',
              data: {
                type: 'pie',
                data: input.data.map((d: any) => ({ name: d.category, value: d.value, color: undefined })),
                title: input.title || 'Pie Chart',
              },
              title: input.title || 'Pie Chart',
            });
          }
          // BAR CHART: If input.data is array of {category, value}
          else if (obj.tool.includes('bar') && Array.isArray(input.data) && input.data[0]?.category && input.data[0]?.value) {
            visualizations.push({
              type: 'chart',
              data: {
                type: 'bar',
                labels: input.data.map((d: any) => d.category),
                datasets: [{ data: input.data.map((d: any) => d.value) }],
                title: input.title || 'Bar Chart',
              },
              title: input.title || 'Bar Chart',
            });
          }
          // LINE CHART: If input.data is array of {category, value}
          else if (obj.tool.includes('line') && Array.isArray(input.data) && input.data[0]?.category && input.data[0]?.value) {
            visualizations.push({
              type: 'chart',
              data: {
                type: 'line',
                labels: input.data.map((d: any) => d.category),
                datasets: [{ data: input.data.map((d: any) => d.value) }],
                title: input.title || 'Line Chart',
              },
              title: input.title || 'Line Chart',
            });
          }
        }
      } catch (e) {
        // Not a JSON line
      }
    }
  }
  
  // Parse inline chart objects
  const inlineChartRegex = /\{[\s\S]*?"type":\s*"(?:chart|line|bar|pie)"[\s\S]*?\}/gi;
  let inlineChartMatch;
  
  while ((inlineChartMatch = inlineChartRegex.exec(text)) !== null) {
    try {
      const chartData = JSON.parse(inlineChartMatch[0]);
      if (chartData.type && (chartData.data || chartData.datasets)) {
        visualizations.push({
          type: 'chart',
          data: chartData,
          title: chartData.title || 'Chart'
        });
      }
    } catch (e) {
      // Skip invalid JSON
    }
  }
  
  return visualizations;
}

export function extractChartIds(text: string): string[] {
  const chartIds: string[] = [];
  const chartIdRegex = /chart_id[:\s]*([a-zA-Z0-9_-]+)/gi;
  let match;
  
  while ((match = chartIdRegex.exec(text)) !== null) {
    chartIds.push(match[1]);
  }
  
  return chartIds;
}

export function cleanMarkdownText(text: string): string {
  return text
    // Remove XML-like tags
    .replace(/<\/?response_factual>/g, '')
    .replace(/<\/?response_[^>]*>/g, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    // Fix markdown formatting
    .replace(/\*\*([^*]+)\*\*/g, '**$1**')
    .replace(/\*([^*]+)\*/g, '*$1*')
    // Ensure proper line breaks for lists
    .replace(/\n-/g, '\n\n-')
    .replace(/\n\*/g, '\n\n*')
    .replace(/\n\d+\./g, '\n\n$&')
    .replace(/(`|>\s*)?((\[(\d+)\])+)(`)?/g, '$2');
}