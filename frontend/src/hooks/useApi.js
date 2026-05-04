import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService.js';

// Custom hook for API calls with loading and error handling
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dependencies.length > 0) {
      execute();
    }
  }, dependencies);

  return { data, loading, error, execute };
};

// Custom hook for paginated data
export const usePaginatedApi = (apiFunction, initialPage = 1) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(page);
      
      if (result.length === 0) {
        setHasMore(false);
      } else {
        setData(prev => [...prev, ...result]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    await loadMore();
  };

  return { data, loading, error, loadMore, refresh, hasMore };
};

// Custom hook for form submission
export const useFormApi = (apiFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await apiFunction(formData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return { loading, error, success, submit, reset };
};
