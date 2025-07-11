import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/theme';
import { Visualization } from '@/types';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 80;

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
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        style={styles.tableContainer}
        contentContainerStyle={{ minWidth: '100%' }}
      >
        <View style={{ minWidth: chartWidth }}>
          <View style={styles.tableHeader}>
            {headers.map((header, index) => (
              <View key={index} style={styles.tableHeaderCell}>
                <Text style={styles.tableHeaderText} numberOfLines={2}>
                  {header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1')}
                </Text>
              </View>
            ))}
          </View>
          {data.map((row, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
              {headers.map((header, cellIndex) => (
                <View key={cellIndex} style={styles.tableCell}>
                  <Text style={styles.tableCellText} numberOfLines={3}>
                    {row[header]?.toString() || '-'}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderChart = (data: any) => {
    if (!data || typeof data !== 'object') {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Chart Data Unavailable</Text>
          <Text style={styles.noDataSubtext}>
            Chart ID: {data?.chart_id || 'Unknown'}
          </Text>
        </View>
      );
    }

    // Handle different chart data formats
    if (data.chart_id) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>📊 Chart Available</Text>
          <Text style={styles.noDataSubtext}>
            Chart ID: {data.chart_id}
          </Text>
          <Text style={styles.noDataSubtext}>
            Interactive chart will be rendered here
          </Text>
        </View>
      );
    }

    // Try to render actual chart data
    try {
      if (data.type === 'line' && data.datasets) {
        return (
          <View style={styles.chartWrapper}>
            <LineChart
              data={data}
              width={chartWidth - 32}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{ borderRadius: 8 }}
            />
          </View>
        );
      }

      if (data.type === 'bar' && data.datasets) {
        return (
          <View style={styles.chartWrapper}>
            <BarChart
              data={data}
              width={chartWidth - 32}
              height={220}
              chartConfig={chartConfig}
              style={{ borderRadius: 8 }}
            />
          </View>
        );
      }

      if (data.type === 'pie' && data.data) {
        return (
          <View style={styles.chartWrapper}>
            <PieChart
              data={data.data}
              width={chartWidth - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              style={{ borderRadius: 8 }}
            />
          </View>
        );
      }

      // Fallback for unknown chart format
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>📈 Chart Data Detected</Text>
          <Text style={styles.noDataSubtext}>
            Type: {data.type || 'Unknown'}
          </Text>
          <Text style={styles.noDataSubtext}>
            Data points: {Array.isArray(data.datasets) ? data.datasets.length : 'N/A'}
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
      <View style={styles.chartContainer}>
        {renderContent()}
      </View>
    </View>
  );
}