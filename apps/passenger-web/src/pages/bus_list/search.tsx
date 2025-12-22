import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { tripsApi } from '@mishwari/api';
import { useGPSLocation } from '@mishwari/ui-primitives';

export default function SearchPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [searchCity, setSearchCity] = useState<string>('');
  const { location: gpsLocation, loading: gpsLoading, error: gpsError } = useGPSLocation(true); // Auto-request GPS
  const [searchType, setSearchType] = useState<'from' | 'to' | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const query = router.query.q as string;
    if (!query) {
      router.replace('/');
      return;
    }

    // Extract city name for display
    const extractCity = (q: string) => {
      const normalized = q.trim();
      const cities = ['صنعاء', 'عدن', 'تعز', 'مأرب', 'الحديدة', 'إب', 'ذمار', 'المكلا', 'سيئون'];
      const found = cities.find(city => normalized.includes(city));
      return found || normalized.split(/\s+/)[0];
    };
    setSearchCity(extractCity(query));

    // Wait for GPS to finish loading before proceeding (or if error occurred)
    // Skip GPS for "from" searches
    if (gpsLoading && searchType !== 'from') return;

    // Parse the search query
    const parseQuery = (q: string) => {
      const normalized = q.trim().toLowerCase();
      
      // Common city names in Arabic and English
      const cities = ['صنعاء', 'عدن', 'تعز', 'مأرب', 'الحديدة', 'إب', 'ذمار', 'المكلا', 'سيئون', 
                      'sanaa', 'aden', 'taiz', 'marib', 'hodeidah', 'ibb', 'dhamar', 'mukalla', 'seiyun'];
      
      // Keywords for "from"
      const fromKeywords = ['من', 'from', 'starting', 'departure'];
      // Keywords for "to"
      const toKeywords = ['إلى', 'الى', 'to', 'destination', 'arriving'];
      
      let fromCity = null;
      let toCity = null;
      
      // Pattern 1: "من X إلى Y" or "from X to Y"
      const fromToPattern = /(من|from)\s+(\S+)\s+(إلى|الى|to)\s+(\S+)/i;
      const fromToMatch = normalized.match(fromToPattern);
      if (fromToMatch) {
        fromCity = fromToMatch[2];
        toCity = fromToMatch[4];
        return { from: fromCity, to: toCity, explicit: true };
      }
      
      // Pattern 2: "من X" or "from X"
      const fromPattern = /(من|from)\s+(.+)/i;
      const fromMatch = normalized.match(fromPattern);
      if (fromMatch) {
        const wordsAfter = fromMatch[2].split(/\s+/).filter(w => w.length > 2);
        if (wordsAfter.length > 0) {
          return { from: wordsAfter, explicit: true, multipleWords: true };
        }
      }
      
      // Pattern 3: "إلى X" or "to X" - extract all words after keyword
      const toPattern = /(إلى|الى|to)\s+(.+)/i;
      const toMatch = normalized.match(toPattern);
      if (toMatch) {
        const wordsAfter = toMatch[2].split(/\s+/).filter(w => w.length > 2);
        if (wordsAfter.length > 0) {
          return { to: wordsAfter, explicit: true, multipleWords: true };
        }
      }
      
      // Pattern 4: "X إلى Y" or "X to Y" (without من/from) - only if no keyword at start
      const cityToCityPattern = /(\S+)\s+(إلى|الى|to)\s+(\S+)/i;
      const cityToCityMatch = normalized.match(cityToCityPattern);
      if (cityToCityMatch) {
        fromCity = cityToCityMatch[1];
        toCity = cityToCityMatch[3];
        return { from: fromCity, to: toCity, explicit: true };
      }
      
      // Pattern 5: Just a city name (ambiguous - need to check backend)
      const foundCity = cities.find(city => normalized.includes(city));
      if (foundCity) {
        return { city: foundCity, explicit: false };
      }
      
      // Pattern 6: Two words separated by space (assume from-to)
      const words = normalized.split(/\s+/).filter(w => w.length > 2);
      if (words.length === 2) {
        return { from: words[0], to: words[1], explicit: true };
      }
      
      // Default: ambiguous single word
      return { city: normalized, explicit: false };
    };

    const handleSearch = async () => {
      const parsed = parseQuery(query);
      
      // Set search type for GPS handling
      if (parsed.from && !parsed.to) {
        setSearchType('from');
      } else if (parsed.to) {
        setSearchType('to');
      }
      
      // Validate cities exist before redirecting
      const validateCity = async (cityName: string, type: 'from' | 'to' = 'to'): Promise<boolean> => {
        try {
          const result = await tripsApi.search(type === 'from' ? { from: cityName } : { to: cityName });
          return result && result.length > 0;
        } catch {
          return false;
        }
      };
      
      // If explicit direction (has keywords), validate and redirect
      if (parsed.explicit) {
        setChecking(true);
        try {
          if (parsed.from && parsed.to) {
            // Handle multiple words in from/to
            let fromCity = parsed.from;
            let toCity = parsed.to;
            
            if (parsed.multipleWords) {
              if (Array.isArray(parsed.from)) {
                for (const word of parsed.from) {
                  if (await validateCity(word, 'from')) {
                    fromCity = word;
                    break;
                  }
                }
              }
              if (Array.isArray(parsed.to)) {
                for (const word of parsed.to) {
                  if (await validateCity(word, 'to')) {
                    toCity = word;
                    break;
                  }
                }
              }
            }
            
            const [fromValid, toValid] = await Promise.all([
              typeof fromCity === 'string' ? validateCity(fromCity, 'from') : Promise.resolve(false),
              typeof toCity === 'string' ? validateCity(toCity, 'to') : Promise.resolve(false)
            ]);
            
            if (!fromValid || !toValid) {
              router.replace(`/?error=invalid_city&city=${encodeURIComponent(!fromValid ? (typeof fromCity === 'string' ? fromCity : parsed.from[0]) : (typeof toCity === 'string' ? toCity : parsed.to[0]))}`);
              return;
            }
            router.replace(`/bus_list?from=${encodeURIComponent(fromCity as string)}&to=${encodeURIComponent(toCity as string)}`);
          } else if (parsed.from) {
            // Handle multiple words case
            if (parsed.multipleWords && Array.isArray(parsed.from)) {
              for (const word of parsed.from) {
                const isValid = await validateCity(word, 'from');
                if (isValid) {
                  router.replace(`/bus_list?from=${encodeURIComponent(word)}`);
                  return;
                }
              }
              router.replace(`/?error=invalid_city&city=${encodeURIComponent(parsed.from[0])}`);
              return;
            }
            
            const fromValid = await validateCity(parsed.from as string, 'from');
            if (!fromValid) {
              router.replace(`/?error=invalid_city&city=${encodeURIComponent(parsed.from as string)}`);
              return;
            }
            router.replace(`/bus_list?from=${encodeURIComponent(parsed.from as string)}`);
          } else if (parsed.to) {
            // Handle multiple words case
            let validCity = null;
            if (parsed.multipleWords && Array.isArray(parsed.to)) {
              // Try each word until we find a valid city
              for (const word of parsed.to) {
                const isValid = await validateCity(word, 'to');
                if (isValid) {
                  validCity = word;
                  break;
                }
              }
              if (!validCity) {
                router.replace(`/?error=invalid_city&city=${encodeURIComponent(parsed.to[0])}`);
                return;
              }
            } else {
              const toValid = await validateCity(parsed.to as string, 'to');
              if (!toValid) {
                router.replace(`/?error=invalid_city&city=${encodeURIComponent(parsed.to as string)}`);
                return;
              }
              validCity = parsed.to as string;
            }
            
            // Check if GPS is available for explicit "to" searches
            if (gpsLocation?.latitude && gpsLocation?.longitude) {
              router.replace(`/bus_list?to=${encodeURIComponent(validCity)}&user_lat=${gpsLocation.latitude}&user_lon=${gpsLocation.longitude}`);
            } else {
              router.replace(`/bus_list?to=${encodeURIComponent(validCity)}`);
            }
          }
        } catch (error) {
          router.replace('/');
        }
        return;
      }

      // Ambiguous case: check backend to determine FROM vs TO
      if (parsed.city) {
        setChecking(true);
        try {
          // Validate city exists in backend first
          const cityValidation = await tripsApi.search({ to: parsed.city });
          
          // If city doesn't exist or no trips, redirect to homepage
          if (!cityValidation || cityValidation.length === 0) {
            router.replace(`/?error=no_trips&city=${encodeURIComponent(parsed.city)}`);
            return;
          }
          
          // If we have GPS, try nearest city search first
          if (gpsLocation?.latitude && gpsLocation?.longitude) {
            console.log('GPS Search - Coords:', gpsLocation.latitude, gpsLocation.longitude, 'To:', parsed.city);
            const gpsResults = await tripsApi.search({
              to: parsed.city,
              user_lat: gpsLocation.latitude.toString(),
              user_lon: gpsLocation.longitude.toString()
            });

            console.log('GPS Search Results:', gpsResults.length);
            // Always redirect with GPS params if GPS is available, even if no results
            router.replace(`/bus_list?to=${encodeURIComponent(parsed.city)}&user_lat=${gpsLocation.latitude}&user_lon=${gpsLocation.longitude}`);
            return;
          } else {
            console.log('No GPS available - gpsLocation:', gpsLocation);
          }

          // Fallback: Show trips to destination
          router.replace(`/bus_list?to=${encodeURIComponent(parsed.city)}`);
        } catch (error) {
          // Fallback to showing destination trips
          router.replace(`/bus_list?to=${encodeURIComponent(parsed.city)}`);
        }
      } else {
        router.replace('/');
      }
    };

    handleSearch();
  }, [router.isReady, router.query.q, gpsLoading, gpsLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
        {gpsLoading && searchType !== 'from' ? (
          <>
            <p className="text-slate-800 font-bold text-xl mb-2">
              🗺️ جاري تحديد موقعك
            </p>
            <p className="text-slate-600 text-sm mb-3">
              للعثور على أقرب رحلة متاحة إلى <span className="font-bold text-primary">{searchCity}</span>
            </p>
            <p className="text-amber-600 text-xs bg-amber-50 border border-amber-200 rounded-lg py-2 px-3 inline-block">
              ⚠️ يرجى السماح بالوصول إلى موقعك عند ظهور النافذة المنبثقة
            </p>
          </>
        ) : gpsError ? (
          <>
            <p className="text-slate-800 font-bold text-xl mb-2">
              🔍 جاري البحث عن الرحلات
            </p>
            <p className="text-slate-600 text-sm mb-2">
              نبحث عن الرحلات المتاحة إلى <span className="font-bold text-primary">{searchCity}</span>
            </p>
            <p className="text-slate-500 text-xs">
              📍 تعذر الوصول للموقع - سنعرض جميع الرحلات المتاحة
            </p>
          </>
        ) : checking ? (
          <>
            <p className="text-slate-800 font-bold text-xl mb-2">
              🔍 جاري البحث عن الرحلات
            </p>
            <p className="text-slate-600 text-sm">
              {searchType === 'from' ? (
                <>نبحث عن الرحلات من <span className="font-bold text-primary">{searchCity}</span></>
              ) : (
                <>نبحث عن أفضل الرحلات المتاحة إلى <span className="font-bold text-primary">{searchCity}</span></>
              )}
            </p>
          </>
        ) : (
          <p className="text-slate-800 font-bold text-xl">جاري المعالجة...</p>
        )}
      </div>
    </div>
  );
}
