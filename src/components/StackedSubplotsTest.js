import React from 'react';
import StackedSubplots from './StackedSubplots';

// Simple test data to verify the component works
const testData = [
  { date: new Date('2024-01-01'), metric1: 10, metric2: 20 },
  { date: new Date('2024-01-02'), metric1: 15, metric2: 25 },
  { date: new Date('2024-01-03'), metric1: 12, metric2: 18 },
  { date: new Date('2024-01-04'), metric1: 18, metric2: 30 },
  { date: new Date('2024-01-05'), metric1: 22, metric2: 35 }
];

const testMetrics = [
  { key: 'metric1', name: 'First Metric', color: '#3b82f6' },
  { key: 'metric2', name: 'Second Metric', color: '#ef4444' }
];

const StackedSubplotsTest = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Stacked Subplots Test</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Test Implementation</h3>
        <p className="text-gray-600 mb-4">
          This test verifies that Observable Plot creates stacked subplots with:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
          <li>Shared x-axis (time-based)</li>
          <li>Separate y-axis for each metric</li>
          <li>Point values displayed on each data point</li>
          <li>Interactive tooltips</li>
        </ul>
      </div>

      <StackedSubplots 
        title="Test Stacked Subplots"
        data={testData}
        metrics={testMetrics}
      />
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">✅ What you should see:</h4>
        <ul className="text-blue-700 space-y-1">
          <li>• Two separate subplots stacked vertically</li>
          <li>• Shared x-axis showing dates from Jan 1-5, 2024</li>
          <li>• Each subplot has its own y-axis scale</li>
          <li>• Values displayed on each data point</li>
          <li>• Hover over points to see tooltips</li>
        </ul>
      </div>
    </div>
  );
};

export default StackedSubplotsTest; 