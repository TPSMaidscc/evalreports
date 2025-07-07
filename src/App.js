import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchDashboardData } from './services/googleSheets';

const Dashboard = () => {
  // Get yesterday's date as default
  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  };

  // Helper function to get META Quality icon color
  const getMetaQualityIcon = (qualityText) => {
    if (!qualityText) return null;
    
    const text = qualityText.toLowerCase();
    let colorClass = '';
    
    if (text.includes('high')) {
      colorClass = 'bg-green-500';
    } else if (text.includes('mid') || text.includes('medium')) {
      colorClass = 'bg-orange-500';
    } else if (text.includes('low')) {
      colorClass = 'bg-red-500';
    } else {
      return null;
    }
    
    return (
      <span className={`inline-block w-3 h-3 rounded-full ${colorClass} mr-2`}></span>
    );
  };

  // Helper function to render not available message
  const renderNotAvailable = (timeframe) => (
    <div className="text-center py-8 text-gray-500">
      <div className="text-4xl mb-2">⏳</div>
      <p className="text-sm">Data not available</p>
      <p className="text-xs">Needs {timeframe}</p>
    </div>
  );

  // Configuration for Today's snapshot fields
  const snapshotConfig = {
    'META Quality': {
      enabled: true,
      notAvailableText: 'Not available'
    },
    'LLM Model used': {
      enabled: true,
      notAvailableText: 'Not available'
    },
    'Cost': {
      enabled: true,
      notAvailableText: 'Not available'
    },
    '7-day CVR %': {
      enabled: false,
      notAvailableText: 'Not available'
    },
    'Total Number of Chats': {
      enabled: true,
      notAvailableText: 'Not available '
    },
    'Handling %': {
      enabled: true,
      notAvailableText: 'Not available'
    },
    'Agent intervention %': {
      enabled: true,
      notAvailableText: 'Not available'
    },
    'Repetition %': {
      enabled: true,
      notAvailableText: 'Not available'
    },
    'Avg Delay - Initial msg': {
      enabled: true,
      notAvailableText: 'Not available'
    },
    'Avg Delay - non-initial msg': {
      enabled: true,
      notAvailableText: 'Not available'
    },
    '% Engagement for closing & filler': {
      enabled: false,
      notAvailableText: 'Not available'
    },
    'Loss of interest': {
      enabled: false,
      notAvailableText: 'Not available'
    },
    'Rule Breaking': {
      enabled: false,
      notAvailableText: 'Not available'
    },
    'Sentiment Analysis': {
      enabled: false,
      notAvailableText: 'Not available'
    },
    'Transfers due to escalations': {
      enabled: false,
      notAvailableText: 'Not available'
    },
    'Transfers due to known flows': {
      enabled: false,
      notAvailableText: 'Not available'
    },
    'Wrong tool called': {
      enabled: true,
      notAvailableText: 'Not available'
    },
    'Missed to be called': {
      enabled: true,
      notAvailableText: 'Not available'
    },
    'Missing policy': {
      enabled: true,
      notAvailableText: 'Not available'
    },
    'Unclear policy': {
      enabled: true,
      notAvailableText: 'Not available'
    },
    '% chats shadowed': {
      enabled: true,
      notAvailableText: 'Not available'
    },
    'Reported issue': {
      enabled: true,
      notAvailableText: 'Not available'
    }
  };

  // Configuration for all dashboard sections
  const dashboardConfig = {
    conversionFunnel: {
      enabled: false,
      notAvailableText: 'Data not available',
      timeframe: '1 week'
    },
    lossOfInterestTable: {
      enabled: false,
      notAvailableText: 'Data not available',
      timeframe: '1 week'
    },
    trendlines: {
      cvrWithin7Days: {
        enabled: false,
        notAvailableText: 'Data not available',
        timeframe: '1 week'
      },
      lossOfInterest: {
        enabled: false,
        notAvailableText: 'Data not available',
        timeframe: '1 week'
      },
      chatsWithRepetition: {
        enabled: true,
        notAvailableText: 'Data not available',
        timeframe: '1 week'
      },
      averageDelays: {
        enabled: true,
        notAvailableText: 'Data not available',
        timeframe: '1 week'
      },
      sentimentAnalysis: {
        enabled: false,
        notAvailableText: 'Data not available',
        timeframe: '4 days'
      },
      toolsPerformance: {
        enabled: true,
        notAvailableText: 'Data not available',
        timeframe: '4 days'
      },
      rulesAndPolicy: {
        enabled: false,
        notAvailableText: 'Data not available',
        timeframe: '2 weeks'
      }
    }
  };

  // Helper function to render snapshot field value
  const renderSnapshotValue = (fieldName, value) => {
    const config = snapshotConfig[fieldName];
    if (!config || config.enabled) {
      // Show actual data
      if (fieldName === 'META Quality') {
        return (
          <span className="text-sm font-medium flex items-center">
            {getMetaQualityIcon(value)}
            {value || 'N/A'}
          </span>
        );
      }
      return <span className="text-sm font-medium">{value || 'N/A'}</span>;
    } else {
      // Show not available message
      return <span className="text-sm text-red-500">{config.notAvailableText}</span>;
    }
  };

  // Helper function to render dashboard sections
  const renderDashboardSection = (sectionKey, content) => {
    const config = dashboardConfig[sectionKey] || dashboardConfig.trendlines?.[sectionKey];
    if (!config || config.enabled) {
      return content;
    } else {
      return (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">⏳</div>
          <p className="text-sm">{config.notAvailableText}</p>
          <p className="text-xs">Needs {config.timeframe}</p>
        </div>
      );
    }
  };

  const [selectedDepartment, setSelectedDepartment] = useState('CC Sales');
  const [selectedDate, setSelectedDate] = useState(getYesterdayDate());
  const [dashboardData, setDashboardData] = useState({
    definitions: [],
    snapshot: {},
    funnel: [],
    lossOfInterest: [],
    trendlines: {
      cvrData: [],
      lossOfInterestData: [],
      repetitionData: [],
      delayData: [],
      sentimentData: [],
      toolsData: [],
      policyData: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize filters from URL parameters
  useEffect(() => {
    const getInitialFilters = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const departmentParam = urlParams.get('department');
      const dateParam = urlParams.get('date');
      
      return {
        department: departmentParam || 'CC Sales',
        date: dateParam || getYesterdayDate()
      };
    };
    
    const initialFilters = getInitialFilters();
    setSelectedDepartment(initialFilters.department);
    setSelectedDate(initialFilters.date);
  }, []);

  // Fetch dashboard data when department or date changes
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!selectedDepartment || !selectedDate) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchDashboardData(selectedDepartment, selectedDate);
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedDepartment, selectedDate]);

  // Update URL when filters change
  const updateURL = (department, date) => {
    const url = new URL(window.location);
    url.searchParams.set('department', department);
    url.searchParams.set('date', date);
    window.history.pushState({}, '', url);
  };

  // Handle department change
  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
    updateURL(department, selectedDate);
  };

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    updateURL(selectedDepartment, date);
  };

  const departments = [
    'MV Resolvers',
    'Doctors',
    'AT Filipina',
    'CC Sales',
    'Delighters',
    'CC Resolvers',
    'MV Sales',
    'MaidsAT African',
    'MaidsAT Ethiopian'
  ];

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getCurrentDate = () => {
    return formatDisplayDate(selectedDate);
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
              <p className="text-gray-600 mt-1">Comprehensive analytics and reporting</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedDepartment} 
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <input
                type="date"
                value={selectedDate}
                max={getYesterdayDate()}
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section 1: Department Name and Date */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedDepartment}</h2>
            <p className="text-lg text-gray-600">{getCurrentDate()}</p>
          </div>
        </div>

        {/* Section 2: Definitions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Definitions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eval</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formula</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action to be taken</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.definitions.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.eval}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.metric}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.formula}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Today's Snapshot */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{getCurrentDate()} – Today's snapshot</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Code-Based Evals */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Code-Based Evals</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">META Quality</span>
                  {renderSnapshotValue('META Quality', dashboardData.snapshot['META Quality'])}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">LLM Model used</span>
                  {renderSnapshotValue('LLM Model used', dashboardData.snapshot['LLM Model used'])}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cost</span>
                  {renderSnapshotValue('Cost', dashboardData.snapshot['Cost'])}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">7-day CVR %</span>
                  {renderSnapshotValue('7-day CVR %', dashboardData.snapshot['7-day CVR %'])}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Number of Chats</span>
                  {renderSnapshotValue('Total Number of Chats', dashboardData.snapshot['Total Number of Chats'])}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Handling %</span>
                  {renderSnapshotValue('Handling %', dashboardData.snapshot['Handling %'])}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Agent intervention %</span>
                  {renderSnapshotValue('Agent intervention %', dashboardData.snapshot['Agent intervention %'])}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Repetition %</span>
                  {renderSnapshotValue('Repetition %', dashboardData.snapshot['Repetition %'])}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Delay - Initial msg</span>
                  {renderSnapshotValue('Avg Delay - Initial msg', dashboardData.snapshot['Avg Delay - Initial msg'])}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Delay - non-initial msg</span>
                  {renderSnapshotValue('Avg Delay - non-initial msg', dashboardData.snapshot['Avg Delay - non-initial msg'])}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">% Engagement for closing & filler</span>
                  {renderSnapshotValue('% Engagement for closing & filler', dashboardData.snapshot['% Engagement for closing & filler'])}
                </div>
              </div>
            </div>

            {/* LLM As a Judge */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">LLM As a Judge</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Loss of interest</span>
                  {renderSnapshotValue('Loss of interest', dashboardData.snapshot['Loss of interest'])}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rule Breaking</span>
                  {renderSnapshotValue('Rule Breaking', dashboardData.snapshot['Rule Breaking'])}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sentiment Analysis</span>
                  {renderSnapshotValue('Sentiment Analysis', dashboardData.snapshot['Sentiment Analysis'])}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transfers due to escalations</span>
                  {renderSnapshotValue('Transfers due to escalations', dashboardData.snapshot['Transfers due to escalations'])}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transfers due to known flows</span>
                  {renderSnapshotValue('Transfers due to known flows', dashboardData.snapshot['Transfers due to known flows'])}
                </div>
                <div className="border-t pt-3 mt-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">Tools</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Wrong tool called</span>
                      {renderSnapshotValue('Wrong tool called', dashboardData.snapshot['Wrong tool called'])}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Missed to be called</span>
                      {renderSnapshotValue('Missed to be called', dashboardData.snapshot['Missed to be called'])}
                    </div>
                  </div>
                </div>
                <div className="border-t pt-3 mt-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">Policies</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Missing policy</span>
                      {renderSnapshotValue('Missing policy', dashboardData.snapshot['Missing policy'])}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Unclear policy</span>
                      {renderSnapshotValue('Unclear policy', dashboardData.snapshot['Unclear policy'])}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Human Annotation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Human Annotation</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">% chats shadowed</span>
                  {renderSnapshotValue('% chats shadowed', dashboardData.snapshot['% chats shadowed'])}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reported issue</span>
                  {renderSnapshotValue('Reported issue', dashboardData.snapshot['Reported issue'])}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Conversion Funnel */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{getCurrentDate()} – Conversion funnel</h3>
          {renderDashboardSection('conversionFunnel', 
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    {dashboardData.funnel.length > 0 && Object.keys(dashboardData.funnel[0]).map((key, index) => (
                      <th key={index} className="px-4 py-3 text-center text-sm font-medium">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.funnel.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3 text-sm text-center">{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 5: Loss of Interest */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{getCurrentDate()} – Loss of interest</h3>
          {renderDashboardSection('lossOfInterestTable',
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    {dashboardData.lossOfInterest.length > 0 && Object.keys(dashboardData.lossOfInterest[0]).map((key, index) => (
                      <th key={index} className="px-4 py-3 text-center text-sm font-medium">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.lossOfInterest.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3 text-sm text-center">{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 6-8: Trendlines */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{getCurrentDate()} – Trendlines</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* CVR within 7 days */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">% CVR within 7 days</h4>
              <div className="h-[300px] flex items-center justify-center">
                {renderDashboardSection('cvrWithin7Days',
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.trendlines.cvrData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="chats" stroke="#fbbf24" name="# chats" label={{ position: 'top' }} />
                      <Line type="monotone" dataKey="cvr" stroke="#f97316" name="% CVR" label={{ position: 'top' }} />
                      <Line type="monotone" dataKey="cvr7dma" stroke="#dc2626" name="% CVR 7DMA" label={{ position: 'top' }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Loss of Interest */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">% loss of interest</h4>
              <div className="h-[300px] flex items-center justify-center">
                {renderDashboardSection('lossOfInterest',
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.trendlines.lossOfInterestData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="lossInterest" stroke="#fbbf24" name="% loss interest" label={{ position: 'top' }} />
                      <Line type="monotone" dataKey="lossPricing" stroke="#f97316" name="% loss pricing" label={{ position: 'top' }} />
                      <Line type="monotone" dataKey="loss7dma" stroke="#dc2626" name="% loss 7DMA" label={{ position: 'top' }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chats with Repetition */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">% Chats with Repetition</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.trendlines.repetitionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="chatsRep" stroke="#fbbf24" name="% Chats Rep" label={{ position: 'top' }} />
                  <Line type="monotone" dataKey="chatsRep7dma" stroke="#f97316" name="% Chats Rep 7DMA" label={{ position: 'top' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Average Delays & 4-min msgs */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Average Delays & 4-min msgs</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.trendlines.delayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgDelayInit" stroke="#fbbf24" name="Avg delay init" label={{ position: 'top' }} />
                  <Line type="monotone" dataKey="avgDelayNon" stroke="#f97316" name="Avg delay non" label={{ position: 'top' }} />
                  <Line type="monotone" dataKey="init4m" stroke="#dc2626" name="Init ≥4 m" label={{ position: 'top' }} />
                  <Line type="monotone" dataKey="nonInit4m" stroke="#ec4899" name="Non-init ≥4 m" label={{ position: 'top' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment Analysis */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h4>
              <div className="h-[300px] flex items-center justify-center">
                {renderNotAvailable('4 days')}
              </div>
            </div>

            {/* Tools Performance */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Tools Performance</h4>
              <div className="h-[300px] flex items-center justify-center">
                {renderDashboardSection('toolsPerformance',
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.trendlines.toolsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="wrongTools" stroke="#fbbf24" name="% wrong tools" label={{ position: 'top' }} />
                      <Line type="monotone" dataKey="toolsMissed" stroke="#f97316" name="% tools missed" label={{ position: 'top' }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rules and Policy Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{getCurrentDate()} – Rules & Policy Performance</h3>
          <div className="h-[400px] flex items-center justify-center">
            {renderDashboardSection('rulesAndPolicy',
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dashboardData.trendlines.policyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ruleBreak" stroke="#fbbf24" name="% rule-break" label={{ position: 'top' }} />
                  <Line type="monotone" dataKey="missing" stroke="#f97316" name="% missing" label={{ position: 'top' }} />
                  <Line type="monotone" dataKey="unclear" stroke="#dc2626" name="% unclear" label={{ position: 'top' }} />
                  <Line type="monotone" dataKey="transfers" stroke="#ec4899" name="% transfers" label={{ position: 'top' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;