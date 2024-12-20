
// Responsive settings for carousel
export const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1400 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 1399, min: 1001 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1000, min: 781 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 780, min: 411 },
      items: 2
    },
    small: {
      breakpoint: { max: 410, min: 0 },
      items: 1
    }
};

// Function to trim the anime description based on screen width
export function getAnimeDescription(animeDescription, screenWidth) {
    if (screenWidth >= 410 && screenWidth < 780) {
        return animeDescription.length > 60
            ? animeDescription.substring(0, 60) + '...'
            : animeDescription;
    } else if (animeDescription.length > 100) {
        return animeDescription.substring(0, 100) + '...';
    } else {
        return animeDescription;
    }
}
