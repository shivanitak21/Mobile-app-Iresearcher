import { Visualization } from '@/types';

export function parseVisualizationsFromMarkdown(text: string): Visualization[] {
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
    .replace(/\n\d+\./g, '\n\n$&');
}