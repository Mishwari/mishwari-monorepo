import { useState, useEffect } from 'react';

interface GPSLocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  city?: string;
  cityAr?: string;
  country?: string;
}

interface UseGPSLocationReturn {
  location: GPSLocationData | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
}

export const useGPSLocation = (autoRequest = false): UseGPSLocationReturn => {
  const [location, setLocation] = useState<GPSLocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCityName = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ar`
      );
      const data = await response.json();
      return {
        cityAr: data.address?.city || data.address?.town || data.address?.village || data.address?.state,
        country: data.address?.country,
      };
    } catch {
      return { cityAr: undefined, country: undefined };
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        
        const cityData = await fetchCityName(coords.latitude, coords.longitude);
        
        setLocation({
          ...coords,
          ...cityData,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (autoRequest) {
      requestLocation();
    }
  }, [autoRequest]);

  return { location, loading, error, requestLocation };
};
