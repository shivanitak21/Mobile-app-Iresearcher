import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Linking } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/theme';
import { Visualization } from '@/types';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryTooltip } from 'victory';
import Svg from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 80;

// Add pastel color palette at the top after imports
const pastelColors = [
  '#A3CEF1', // Light Blue
  '#FFB5E8', // Pink
  '#B5EAD7', // Mint
  '#FFDAC1', // Peach
  '#E2F0CB', // Light Green
  '#C7CEEA', // Lavender
  '#FFFACD', // Lemon
  '#FFD6E0', // Rose
  '#B5D8FA', // Sky
  '#F1CBFF', // Lilac
];

interface VisualizationRendererProps {
  visualization: Visualization;
}

export function VisualizationRenderer({ visualization }: VisualizationRendererProps) {
  const { state } = useApp();
  const theme = state.theme === 'light' ? lightTheme : darkTheme;

  const chartConfig = {
    backgroundColor: theme.colors.card,
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(107, 70, 193, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.colors.border,
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 13,
      fontWeight: '600',
      fill: theme.colors.text,
    },
  };

  const styles = StyleSheet.create({
    container: {
      marginTop: theme.spacing.md,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontFamily: 'Inter-SemiBold',
    },
    tableContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
      maxWidth: chartWidth,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    tableHeader: {
      backgroundColor: theme.colors.primary,
      flexDirection: 'row',
      paddingVertical: theme.spacing.md,
    },
    tableHeaderCell: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
      minWidth: 120,
    },
    tableHeaderText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },
    tableRowAlt: {
      backgroundColor: theme.colors.surface,
    },
    tableCell: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
      minWidth: 120,
      justifyContent: 'center',
    },
    tableCellText: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
      fontFamily: 'Inter-Regular',
    },
    chartContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      maxWidth: chartWidth,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    chartWrapper: {
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
    },
    noDataContainer: {
      padding: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
    },
    noDataText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      fontFamily: 'Inter-Medium',
    },
    noDataSubtext: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      textAlign: 'center',
      fontFamily: 'Inter-Regular',
    },
  });

  const renderTable = (data: any[]) => {
    if (!data || data.length === 0) return null;

    const headers = Object.keys(data[0]);
    const minTableWidth = headers.length * 140; // 140px per column

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={styles.tableContainer}
        contentContainerStyle={{ minWidth: minTableWidth }}
      >
        <View style={{ minWidth: minTableWidth }}>
          {/* Sticky Header Row */}
          <View style={styles.tableHeader}>
            {headers.map((header, index) => (
              <View key={index} style={styles.tableHeaderCell}>
                <Text style={styles.tableHeaderText}>
                  {header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1')}
                </Text>
              </View>
            ))}
          </View>
          {/* Scrollable Data Rows */}
          <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={true}>
            {data.map((row, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
                {headers.map((header, cellIndex) => (
                  <View key={cellIndex} style={styles.tableCell}>
                    <Text style={[styles.tableCellText, /^(https?:\/\/\S+)$/.test(row[header]) && {color: theme.colors.primary, textDecorationLine: 'underline'}]}
                      onPress={/^(https?:\/\/\S+)$/.test(row[header]) ? () => Linking.openURL(row[header]) : undefined}
                      suppressHighlighting={true}
                    >
                      {row[header]?.toString() || '-'}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
            <View style={{ height: 16 }} />
          </ScrollView>
        </View>
      </ScrollView>
    );
  };

  const renderChart = (data: any) => {
    if (!data || typeof data !== 'object') {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Chart Data Unavailable</Text>
        </View>
      );
    }

    // Support flexible chart data
    let chartData = data;
    // If data is an array of objects with category/value, convert to chart.js format
    if (Array.isArray(data) && data.length > 0 && data[0].category && data[0].value) {
      chartData = {
        labels: data.map((d: any) => d.category),
        datasets: [{ data: data.map((d: any) => d.value) }],
        type: 'bar',
        raw: data,
      };
    }

    if (chartData.type && (chartData.datasets || chartData.data)) {
      try {
        if (chartData.type === 'line' && chartData.datasets) {
          // Horizontal scroll if too many points
          const minPointWidth = 60;
          const chartDataLength = chartData.labels ? chartData.labels.length : (chartData.datasets[0]?.data.length || 1);
          const dynamicWidth = Math.max(chartWidth - 32, chartDataLength * minPointWidth);
          return (
            <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ width: chartWidth - 32 }}>
              <View style={{ width: dynamicWidth }}>
                <LineChart
                  data={{
                    ...chartData,
                    datasets: chartData.datasets.map((ds: any, i: number) => ({
                      ...ds,
                      color: (opacity = 1) => pastelColors[i % pastelColors.length] + (opacity === 1 ? '' : Math.floor(opacity * 255).toString(16)),
                    })),
                  }}
                  width={dynamicWidth}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => pastelColors[0] + (opacity === 1 ? '' : Math.floor(opacity * 255).toString(16)),
                    labelColor: (opacity = 1) => theme.colors.text,
                  }}
                  bezier
                  style={{ borderRadius: 8 }}
                  yAxisLabel={''}
                  yAxisSuffix={''}
                  formatYLabel={(v: string | number) => `${v}`}
                  formatXLabel={(v: string | number) => `${v}`}
                />
              </View>
            </ScrollView>
          );
        }

        if (chartData.type === 'bar' && chartData.datasets) {
          // Calculate dynamic width for bar chart
          const minBarWidth = 60; // Minimum width per bar
          const chartDataLength = chartData.labels ? chartData.labels.length : (chartData.datasets[0]?.data.length || 1);
          const dynamicWidth = Math.max(chartWidth - 32, chartDataLength * minBarWidth);
          // Prepare data for VictoryBar
          const barData = chartData.labels.map((label: string, i: number) => ({
            x: label,
            y: chartData.datasets[0].data[i],
            fill: pastelColors[i % pastelColors.length],
            label: `${label}\n${chartData.datasets[0].data[i]}`,
          }));
          return (
            <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ width: chartWidth - 32 }}>
              <Svg width={dynamicWidth} height={260}>
                <VictoryChart
                  width={dynamicWidth}
                  height={220}
                  theme={VictoryTheme.material}
                  domainPadding={{ x: 30, y: 20 }}
                  standalone={false}
                >
                  <VictoryAxis
                    style={{
                      tickLabels: {
                        angle: 30,
                        fontSize: 10,
                        padding: 10,
                        textAnchor: 'start',
                        fontFamily: 'Inter-Regular',
                      },
                    }}
                    tickFormat={(t) => t.length > 14 ? t.slice(0, 14) + '…' : t}
                  />
                  <VictoryAxis
                    dependentAxis
                    style={{
                      tickLabels: { fontSize: 10, fontFamily: 'Inter-Regular' },
                    }}
                  />
                  <VictoryBar
                    data={barData}
                    x="x"
                    y="y"
                    style={{
                      data: {
                        fill: ({ datum }) => datum.fill,
                        width: 28,
                      },
                      labels: { fontSize: 12, fontFamily: 'Inter-Regular' },
                    }}
                    labels={({ datum }) => `${datum.y}`}
                    labelComponent={<VictoryTooltip flyoutStyle={{ fill: '#fff' }} />}
                  />
                </VictoryChart>
              </Svg>
            </ScrollView>
          );
        }

        if (chartData.type === 'pie' && chartData.data) {
          // Assign pastel color to each slice
          const pieData = chartData.data.map((d: any, i: number) => ({
            ...d,
            color: pastelColors[i % pastelColors.length],
            legendFontColor: theme.colors.text,
            legendFontSize: 14,
          }));
          return (
            <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ width: chartWidth - 32 }}>
              <View style={{ width: chartWidth - 32 }}>
                <PieChart
                  data={pieData}
                  width={chartWidth - 32}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => pastelColors[0] + (opacity === 1 ? '' : Math.floor(opacity * 255).toString(16)),
                    labelColor: (opacity = 1) => theme.colors.text,
                  }}
                  accessor="value"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  style={{ borderRadius: 8 }}
                  hasLegend={true}
                />
              </View>
            </ScrollView>
          );
        }

        // Fallback for unknown chart format
        return (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>📈 Chart Data Detected</Text>
            <Text style={styles.noDataSubtext}>
              Type: {chartData.type || 'Unknown'}
            </Text>
            <Text style={styles.noDataSubtext}>
              Data points: {Array.isArray(chartData.datasets) ? chartData.datasets.length : 'N/A'}
            </Text>
          </View>
        );
      } catch (error) {
        return (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Chart Rendering Error</Text>
            <Text style={styles.noDataSubtext}>
              Unable to display chart data
            </Text>
          </View>
        );
      }
    }

    // If only chart_id is present, do not render anything
    return null;
  };

  const renderContent = () => {
    switch (visualization.type) {
      case 'table':
        return renderTable(visualization.data);
      case 'chart':
        return renderChart(visualization.data);
      default:
        return (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Unsupported Visualization</Text>
            <Text style={styles.noDataSubtext}>
              Type: {visualization.type}
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {visualization.title && (
        <Text style={styles.title}>{visualization.title}</Text>
      )}
      <View
      //  style={styles.chartContainer}
       >
        {renderContent()}
      </View>
    </View>
  );
}