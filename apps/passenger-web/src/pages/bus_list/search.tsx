import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { tripsApi } from '@mishwari/api';

export default function SearchPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const query = router.query.q as string;
    if (!query) {
      router.replace('/');
      return;
    }

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
      
      // Pattern 2: "X إلى Y" or "X to Y" (without من/from)
      const cityToCityPattern = /(\S+)\s+(إلى|الى|to)\s+(\S+)/i;
      const cityToCityMatch = normalized.match(cityToCityPattern);
      if (cityToCityMatch) {
        fromCity = cityToCityMatch[1];
        toCity = cityToCityMatch[3];
        return { from: fromCity, to: toCity, explicit: true };
      }
      
      // Pattern 3: "من X" or "from X"
      const fromPattern = /(من|from)\s+(\S+)/i;
      const fromMatch = normalized.match(fromPattern);
      if (fromMatch) {
        fromCity = fromMatch[2];
        return { from: fromCity, explicit: true };
      }
      
      // Pattern 4: "إلى X" or "to X"
      const toPattern = /(إلى|الى|to)\s+(\S+)/i;
      const toMatch = normalized.match(toPattern);
      if (toMatch) {
        toCity = toMatch[2];
        return { to: toCity, explicit: true };
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
      
      // If explicit direction (has keywords), redirect immediately
      if (parsed.explicit) {
        if (parsed.from && parsed.to) {
          router.replace(`/bus_list?from=${encodeURIComponent(parsed.from)}&to=${encodeURIComponent(parsed.to)}`);
        } else if (parsed.from) {
          router.replace(`/bus_list?from=${encodeURIComponent(parsed.from)}`);
        } else if (parsed.to) {
          router.replace(`/bus_list?to=${encodeURIComponent(parsed.to)}`);
        }
        return;
      }

      // Ambiguous case: check backend to determine FROM vs TO
      if (parsed.city) {
        setChecking(true);
        try {
          // Check both directions
          const [fromResults, toResults] = await Promise.all([
            tripsApi.search({ from: parsed.city }).catch(() => ({ data: [] })),
            tripsApi.search({ to: parsed.city }).catch(() => ({ data: [] }))
          ]);

          const fromCount = fromResults.data?.length || 0;
          const toCount = toResults.data?.length || 0;

          // Redirect based on which has more trips
          if (toCount > fromCount) {
            router.replace(`/bus_list?to=${encodeURIComponent(parsed.city)}`);
          } else {
            router.replace(`/bus_list?from=${encodeURIComponent(parsed.city)}`);
          }
        } catch (error) {
          // Fallback to FROM on error
          router.replace(`/bus_list?from=${encodeURIComponent(parsed.city)}`);
        }
      } else {
        router.replace('/');
      }
    };

    handleSearch();
  }, [router.isReady, router.query.q]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-slate-600 font-bold">
          {checking ? 'جاري التحقق من الرحلات...' : 'جاري البحث...'}
        </p>
      </div>
    </div>
  );
}
