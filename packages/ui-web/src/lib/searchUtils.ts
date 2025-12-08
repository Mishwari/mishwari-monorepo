export const normalizeArabic = (text: string) => {
  return text
    .replace(/[ًٌٍَُِّْ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ىئ]/g, 'ي')
    .replace(/ة/g, 'ه')
    .toLowerCase();
};

export const filterByArabicSearch = <T extends { city: string }>(
  items: T[],
  searchQuery: string
): T[] => {
  if (!searchQuery.trim()) return items;

  const normalizedQuery = normalizeArabic(searchQuery.trim());

  return items.filter((item) => {
    const normalizedCity = normalizeArabic(item.city);
    const cityWords = normalizedCity.split(/\s+/);

    if (normalizedQuery.length === 1) {
      return cityWords[0]?.startsWith(normalizedQuery);
    }

    return (
      cityWords.some((word) => word.startsWith(normalizedQuery)) ||
      normalizedCity.includes(normalizedQuery)
    );
  });
};
