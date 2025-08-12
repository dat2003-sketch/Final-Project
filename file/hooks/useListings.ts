import { useCallback, useEffect, useState } from 'react';
import { listingsService } from '../services/listings';

export function useListings(params?: { search?: string }) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listingsService.search(params);
      setListings(data);
    } finally {
      setLoading(false);
    }
  }, [params?.search]);

  const refetch = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await listingsService.search(params);
      setListings(data);
    } finally {
      setRefreshing(false);
    }
  }, [params?.search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { listings, loading, refreshing, refresh: refetch, refetch };
}

export function useListing(id: string) {
  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOne = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listingsService.get(id);
      setListing(data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { if (id) fetchOne(); }, [id, fetchOne]);

  return { listing, loading, refetch: fetchOne };
}

export function useUserListings(userId?: string) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMine = useCallback(async () => {
    if (!userId) { setListings([]); setLoading(false); return; }
    setLoading(true);
    try {
      const data = await listingsService.byUser(userId);
      setListings(data);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchMine(); }, [fetchMine]);

  return { listings, loading, refetch: fetchMine };
}
