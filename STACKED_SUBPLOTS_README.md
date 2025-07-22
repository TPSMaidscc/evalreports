# Stacked Subplots with Observable Plot

This dashboard now uses **Observable Plot** to create stacked subplots with shared x-axis, replacing the previous multi-line charts. This provides better data visualization for comparing multiple metrics over time.

## Features

✅ **Stacked Subplots**: Each metric gets its own subplot with dedicated y-axis  
✅ **Shared X-Axis**: All subplots share the same time axis for easy comparison  
✅ **Point Values**: Y values are displayed on each data point  
✅ **Interactive Tooltips**: Hover over points to see exact values  
✅ **Responsive Design**: Charts adapt to different screen sizes  
✅ **PDF Export**: All subplots are included in PDF reports  

## What Changed

### Before (Multi-line Charts)
- Multiple metrics shown as different colored lines on the same chart
- Single y-axis made it difficult to compare metrics with different scales
- Cluttered appearance when many lines were present

### After (Stacked Subplots)
- Each metric has its own subplot with dedicated y-axis
- Shared x-axis allows easy time-based comparison
- Cleaner, more readable visualization
- Values displayed directly on data points

## Technical Implementation

### Observable Plot
We use **Observable Plot** instead of Chart.js or other libraries because:
- Built-in faceting support for subplots
- Excellent shared axis capabilities
- Modern, performant rendering
- Great TypeScript support

### Component Structure

```javascript
import StackedSubplots, { createChartData } from './components/StackedSubplots';

// Usage example
<StackedSubplots 
  title="Cost Analysis"
  data={dashboardData.trendlines.costData}
  metrics={[
    { key: 'dailyCost', name: 'Daily Cost ($)', color: '#3b82f6' },
    { key: 'last30DaysCost', name: 'Last 30 Days Cost ($)', color: '#ef4444' }
  ]}
/>
```

### Data Format
Each metric requires:
- `key`: The property name in your data
- `name`: Display name for the subplot
- `color`: Color for the line and points

## Customization

### Adding New Metrics
To add new metrics to existing charts, update the `createChartData` function in `StackedSubplots.js`:

```javascript
case 'newChartType':
  return {
    data: dashboardData.trendlines.newData,
    metrics: [
      { key: 'metric1', name: 'First Metric', color: '#color1' },
      { key: 'metric2', name: 'Second Metric', color: '#color2' }
    ]
  };
```

### Styling
Modify the plot configuration in the `StackedSubplots` component:
- `height`: Adjust height per subplot (currently 120px per metric)
- `marginLeft/Right`: Adjust margins for labels
- `fontSize`: Change text size for labels and values

### Point Labels
To show/hide point values, modify the `Plot.text` mark in the component.

## Browser Compatibility

Observable Plot works in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance

Observable Plot is highly optimized for:
- Large datasets (thousands of points)
- Smooth animations
- Responsive interactions
- Memory efficiency

## Migration Notes

If you need to revert to the old multi-line charts:
1. Comment out the new `StackedSubplots` components
2. Uncomment the original `ResponsiveContainer` with `LineChart` components
3. Update the PDF export function to use the old element IDs

## Future Enhancements

Possible improvements:
- Zoom/pan synchronization across subplots
- Brush selection for time ranges
- Animated transitions between data updates
- Export individual subplots
- Custom axis formatters per metric 