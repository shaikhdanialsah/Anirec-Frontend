import animeData from '../../anime_data.json';

export const handleSearchChange = (query, setSearchQuery, setShowClear, setSuggestions) => {
  setSearchQuery(query);
  setShowClear(query.length > 0); // Show clear button if there's text

  if (query) {
    // Normalize the search query by removing special characters but keep spaces and capital letters
    const normalizedQuery = query.replace(/:/g, '').toLowerCase().trim();

    // Split the query into individual words
    const queryWords = normalizedQuery.split(/\s+/);

    // Separate exact matches and partial matches
    const exactMatches = [];
    const partialMatches = [];

    animeData.forEach(anime => {
      // Normalize each title by removing colons and converting to lowercase for comparison
      const normalizedTitle = anime.title.replace(/:/g, '').toLowerCase().trim();

      // Check for exact match
      if (normalizedTitle === normalizedQuery) {
        exactMatches.push(anime);
      } else if (queryWords.every(word => normalizedTitle.includes(word))) {
        // Check for partial match
        partialMatches.push(anime);
      }
    });

    // Combine exact matches and partial matches, prioritizing exact matches
    const combinedSuggestions = [...exactMatches, ...partialMatches];

    if (combinedSuggestions.length > 0) {
      setSuggestions(combinedSuggestions.slice(0, 30));
    } else {
      setSuggestions([{ title: 'No results found' }]); // Set a message indicating no results were found
    }
  } else {
    setSuggestions([]);
  }
};
