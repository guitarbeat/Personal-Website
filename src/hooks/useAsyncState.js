import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook for managing async operations with loading and error states
 * @param {any} initialData - Initial data value
 * @returns {Object} - State and handlers for async operations
 */
export const useAsyncState = (initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const startLoading = () => {
    setLoading(true);
    setError(null);
  };

  const setSuccess = (newData) => {
    setData(newData);
    setLoading(false);
    setError(null);
  };

  const setErrorState = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const reset = () => {
    setData(initialData);
    setLoading(true);
    setError(null);
  };

  return {
    data,
    loading,
    error,
    setData,
    setLoading,
    setError: setErrorState,
    startLoading,
    setSuccess,
    reset,
  };
};

/**
 * Custom hook specifically for data fetching operations
 * @param {Function} fetchFunction - Async function to fetch data
 * @param {any} initialData - Initial data value
 * @param {Array} dependencies - Dependencies for the fetch operation
 * @returns {Object} - State and refetch function
 */
export const useFetch = (
  fetchFunction,
  initialData = null,
  dependencies = [],
) => {
  const asyncState = useAsyncState(initialData);

  const fetchData = useCallback(async () => {
    asyncState.startLoading();
    try {
      const result = await fetchFunction();
      asyncState.setSuccess(result);
    } catch (err) {
      asyncState.setError(err.message || "An error occurred");
    }
  }, [
    fetchFunction,
    asyncState.startLoading,
    asyncState.setSuccess,
    asyncState.setError,
  ]);

  // Auto-fetch on mount and dependency changes
  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return {
    ...asyncState,
    refetch: fetchData,
  };
};
