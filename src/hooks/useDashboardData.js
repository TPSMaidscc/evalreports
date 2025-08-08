import { useState, useEffect, useRef } from 'react';
import { fetchDashboardData } from '../services/googleSheets';
import { getYesterdayDate, mapDepartmentForDataFetch, getDepartmentsForDate } from '../utils/helpers';
import { dashboardConfig } from '../utils/constants';

export const useDashboardData = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    definitions: [],
    snapshot: {},
    funnel: [],
    lossOfInterest: { headers: [], data: [] },
    trendlines: {
      cvrData: [],
      lossOfInterestData: [],
      repetitionData: [],
      delayData: [],
      sentimentData: [],
      toolsData: [],
      policyData: [],
      costData: [],
      botHandledData: []
    },
    ruleBreaking: {
      overallViolations: [],
      ruleBreakdown: []
    },
    transferIntervention: [],
    policyEscalation: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const loadingRef = useRef(null); // Track current loading request

  // Initialize filters from URL parameters - SINGLE useEffect that handles everything
  useEffect(() => {
    const initializeAndLoadData = async () => {
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const departmentParam = urlParams.get('department');
      const dateParam = urlParams.get('date');
      
      let finalDepartment = departmentParam || 'CC Sales';
      const finalDate = dateParam || getYesterdayDate();
      
      // Validate department for the selected date
      const validDepartments = getDepartmentsForDate(finalDate);
      if (!validDepartments.includes(finalDepartment)) {
        // If department is invalid, use default fallback
        finalDepartment = 'CC Sales'; // Default fallback
      }
      
      console.log(`INITIALIZING: Department=${finalDepartment}, Date=${finalDate}`);
      
      // Set state synchronously
      setSelectedDepartment(finalDepartment);
      setSelectedDate(finalDate);
      setIsInitialized(true);
      
      // Clear any previous loading state
      if (loadingRef.current) {
        console.log(`Cancelling any previous request: ${loadingRef.current}`);
      }
      
      const requestKey = `${finalDepartment}-${finalDate}`;
      loadingRef.current = requestKey;
      
      setIsLoadingData(true);
      setLoading(true);
      setError(null);
      
      // Clear previous data
      setDashboardData({
        definitions: [],
        snapshot: {},
        funnel: [],
        lossOfInterest: { headers: [], data: [] },
        trendlines: {
          cvrData: [],
          lossOfInterestData: [],
          repetitionData: [],
          delayData: [],
          sentimentData: [],
          toolsData: [],
          policyData: [],
          costData: []
        },
        ruleBreaking: {
          overallViolations: [],
          ruleBreakdown: []
        }
      });
      
      console.log(`LOADING DATA: Starting data load for: ${requestKey}`);
      
      try {
        // Small delay to ensure all state updates are processed
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Double-check we're still loading the right data
        if (loadingRef.current !== requestKey) {
          console.log(`Request ${requestKey} was superseded`);
          return;
        }
        
        const mappedDepartment = mapDepartmentForDataFetch(finalDepartment, finalDate);
        const data = await fetchDashboardData(mappedDepartment, finalDate, dashboardConfig);
        
        // Final check before updating state
        if (loadingRef.current !== requestKey) {
          console.log(`Request ${requestKey} was cancelled after fetch`);
          return;
        }
        
        console.log(`DATA LOADED: Successfully loaded for: ${requestKey}`);
        console.log('Dashboard snapshot data keys:', Object.keys(data.snapshot || {}));
        console.log('Dashboard snapshot data:', data.snapshot);
        console.log('Dashboard funnel data for', finalDepartment, ':', data.funnel);
        console.log('Dashboard funnel data length:', data.funnel ? data.funnel.length : 'undefined');
        
        setDashboardData(data);
      } catch (err) {
        if (loadingRef.current === requestKey) {
          setError(err.message);
          console.error('Error loading dashboard data:', err);
        }
      } finally {
        if (loadingRef.current === requestKey) {
          setLoading(false);
          setIsLoadingData(false);
          loadingRef.current = null;
        }
      }
    };
    
    initializeAndLoadData();
  }, []); // Run only once on mount

  // Handle manual department/date changes (after initialization)
  useEffect(() => {
    // Skip if this is the initial load (not initialized yet or no values)
    if (!isInitialized || !selectedDepartment || !selectedDate) {
      return;
    }
    
    const requestKey = `${selectedDepartment}-${selectedDate}`;
    
    // Skip if this is the same data we just loaded
    if (loadingRef.current === requestKey) {
      console.log(`Skipping duplicate request for: ${requestKey}`);
      return;
    }
    
    console.log(`MANUAL CHANGE: Loading data for: ${requestKey}`);
    
    // Cancel any existing request
    if (loadingRef.current) {
      console.log(`Cancelling previous request: ${loadingRef.current}`);
    }
    
    loadingRef.current = requestKey;
    setIsLoadingData(true);
    setLoading(true);
    setError(null);
    
    // Clear previous data
    setDashboardData({
      definitions: [],
      snapshot: {},
      funnel: [],
      lossOfInterest: { headers: [], data: [] },
      trendlines: {
        cvrData: [],
        lossOfInterestData: [],
        repetitionData: [],
        delayData: [],
        sentimentData: [],
        toolsData: [],
        policyData: [],
        costData: []
      },
      ruleBreaking: {
        overallViolations: [],
        ruleBreakdown: []
      }
    });
    
    const loadDashboardData = async () => {
      try {
        if (loadingRef.current !== requestKey) {
          console.log(`Request ${requestKey} was cancelled`);
          return;
        }
        
        const mappedDepartment = mapDepartmentForDataFetch(selectedDepartment, selectedDate);
        const data = await fetchDashboardData(mappedDepartment, selectedDate, dashboardConfig);
        
        if (loadingRef.current !== requestKey) {
          console.log(`Request ${requestKey} was cancelled after fetch`);
          return;
        }
        
        console.log(`MANUAL DATA LOADED: Successfully loaded for: ${requestKey}`);
        setDashboardData(data);
      } catch (err) {
        if (loadingRef.current === requestKey) {
          setError(err.message);
          console.error('Error loading dashboard data:', err);
        }
      } finally {
        if (loadingRef.current === requestKey) {
          setLoading(false);
          setIsLoadingData(false);
          loadingRef.current = null;
        }
      }
    };

    const timeoutId = setTimeout(loadDashboardData, 100);
    
    return () => {
      clearTimeout(timeoutId);
      if (loadingRef.current === requestKey) {
        loadingRef.current = null;
        setIsLoadingData(false);
      }
    };
  }, [selectedDepartment, selectedDate, isInitialized]);

  return {
    selectedDepartment,
    setSelectedDepartment,
    selectedDate,
    setSelectedDate,
    isInitialized,
    dashboardData,
    loading,
    error,
    isLoadingData
  };
}; 