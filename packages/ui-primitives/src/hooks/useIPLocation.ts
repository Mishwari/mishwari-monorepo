import { useState, useEffect } from 'react';

interface IPLocationData {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

interface UseIPLocationReturn {
  location: IPLocationData | null;
  loading: boolean;
  error: string | null;
}

export const useIPLocation = (): UseIPLocationReturn => {
  const [location, setLocation] = useState<IPLocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIPLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Failed to fetch location');
        
        const data = await response.json();
        setLocation({
          country: data.country_name,
          region: data.region,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchIPLocation();
  }, []);

  return { location, loading, error };
};
