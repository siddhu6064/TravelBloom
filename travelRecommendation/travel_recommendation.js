// Sample travel data (simulating the JSON API) with timezone information
const travelData = {
    countries: [
        {
            id: 1,
            name: "Australia",
            cities: [
                {
                    name: "Sydney, Australia",
                    imageUrl: "https://i.postimg.cc/gxX0hr6t/temp-Imagee-AG2f5.avif",
                    description: "A vibrant city known for its iconic landmarks like the Sydney Opera House and Sydney Harbour Bridge.",
                    timeZone: "Australia/Sydney"
                },
                {
                    name: "Melbourne, Australia",
                    imageUrl: "https://i.postimg.cc/QF2dJsQ8/Melburnian-Skyline-b.jpg",
                    description: "A cultural hub famous for its art, food, and diverse neighborhoods.",
                    timeZone: "Australia/Melbourne"
                }
            ]
        },
        {
            id: 2,
            name: "Japan",
            cities: [
                {
                    name: "Tokyo, Japan",
                    imageUrl: "https://i.postimg.cc/mPHbDq00/gettyimages-1390815938.avif",
                    description: "A bustling metropolis blending tradition and modernity, famous for its cherry blossoms and rich culture.",
                    timeZone: "Asia/Tokyo"
                },
                {
                    name: "Kyoto, Japan",
                    imageUrl: "https://i.postimg.cc/JDP8vWkB/map-of-kyoto-japan-travel-scaled-jpg.webp",
                    description: "Known for its historic temples, gardens, and traditional tea houses.",
                    timeZone: "Asia/Tokyo"
                }
            ]
        },
        {
            id: 3,
            name: "Brazil",
            cities: [
                {
                    name: "Rio de Janeiro, Brazil",
                    imageUrl: "https://i.postimg.cc/w34HkgzC/christ-the-redeemer-rio-1600x900-f50-50.webp",
                    description: "A lively city known for its stunning beaches, vibrant carnival celebrations, and iconic landmarks.",
                    timeZone: "America/Sao_Paulo"
                },
                {
                    name: "São Paulo, Brazil",
                    imageUrl: "https://i.postimg.cc/mtc4XJ2t/saopaulo.jpg",
                    description: "The financial hub with diverse culture, arts, and a vibrant nightlife.",
                    timeZone: "America/Sao_Paulo"
                }
            ]
        }
    ],
    temples: [
        {
            id: 1,
            name: "Angkor Wat, Cambodia",
            imageUrl: "https://i.postimg.cc/Q94LSk2Q/overview-complex-Angkor-Wat-Cambodia-jpg.webp",
            description: "A UNESCO World Heritage site and the largest religious monument in the world.",
            timeZone: "Asia/Phnom_Penh"
        },
        {
            id: 2,
            name: "Taj Mahal, India",
            imageUrl: "https://i.postimg.cc/3WNQNVGn/taj-mahal-agra-india-TAJ0217-9eab8f20d11d4391901867ed1ce222b8.jpg",
            description: "An iconic symbol of love and a masterpiece of Mughal architecture.",
            timeZone: "Asia/Kolkata"
        }
    ],
    beaches: [
        {
            id: 1,
            name: "Bora Bora, French Polynesia",
            imageUrl: "https://i.postimg.cc/8JC9Ff7j/leonardo-352069-179204733-160537.jpg",
            description: "An island known for its stunning turquoise waters and luxurious overwater bungalows.",
            timeZone: "Pacific/Tahiti"
        },
        {
            id: 2,
            name: "Copacabana Beach, Brazil",
            imageUrl: "https://i.postimg.cc/kR6HsrFC/thumbnail-23.jpg",
            description: "A famous beach in Rio de Janeiro, Brazil, with a vibrant atmosphere and scenic views.",
            timeZone: "America/Sao_Paulo"
        }
    ]
};

// Function to fetch data from JSON file (for future use)
async function fetchTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log('Travel data loaded from JSON:', data);
        return data;
    } catch (error) {
        console.log('Using local data instead:', error.message);
        return travelData;
    }
}

// Search function
function searchRecommendations() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) {
        console.error('Search input not found');
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }

    let results = [];
    
    // Search logic for different keywords
    if (searchTerm.includes('beach') || searchTerm.includes('beaches')) {
        results = travelData.beaches;
    } else if (searchTerm.includes('temple') || searchTerm.includes('temples')) {
        results = travelData.temples;
    } else if (searchTerm.includes('country') || searchTerm.includes('countries') || 
               searchTerm.includes('australia') || searchTerm.includes('japan') || 
               searchTerm.includes('brazil')) {
        // Flatten countries data
        travelData.countries.forEach(country => {
            results = results.concat(country.cities);
        });
    } else {
        // Search all categories for other terms
        results = [
            ...travelData.beaches,
            ...travelData.temples,
            ...travelData.countries.flatMap(country => country.cities)
        ].filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );
    }

    displayResults(results);
}

// Display search results
function displayResults(results) {
    const resultsContainer = document.getElementById('recommendationResults');
    const recommendationsSection = document.getElementById('recommendationsSection');
    
    if (!resultsContainer || !recommendationsSection) {
        console.error('Results containers not found');
        return;
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align: center; font-size: 1.2rem; color: #666;">No recommendations found. Try searching for "beach", "temple", or "country".</p>';
    } else {
        resultsContainer.innerHTML = results.map(item => {
            const currentTime = item.timeZone ? getCurrentTime(item.timeZone) : '';
            return `
                <div class="recommendation-item">
                    <img src="${item.imageUrl}" alt="${item.name}" />
                    <div class="recommendation-content">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        ${currentTime ? `<div class="time-info">Current local time: ${currentTime}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    recommendationsSection.classList.remove('hidden');
    
    // Scroll to results
    recommendationsSection.scrollIntoView({ behavior: 'smooth' });
}

// Get current time for timezone (Task 10 implementation)
function getCurrentTime(timeZone) {
    try {
        const options = { 
            timeZone: timeZone, 
            hour12: true, 
            hour: 'numeric', 
            minute: 'numeric', 
            second: 'numeric' 
        };
        const currentTime = new Date().toLocaleTimeString('en-US', options);
        console.log(`Current time in ${timeZone}:`, currentTime);
        return currentTime;
    } catch (error) {
        console.error('Error getting time for timezone:', timeZone, error);
        return 'Time not available';
    }
}

// Get current time for timezone
function getCurrentTime(timeZone) {
    try {
        const options = { 
            timeZone: timeZone, 
            hour12: true, 
            hour: 'numeric', 
            minute: 'numeric', 
            second: 'numeric' 
        };
        return new Date().toLocaleTimeString('en-US', options);
    } catch (error) {
        console.error('Error getting time for timezone:', timeZone, error);
        return 'Time not available';
    }
}

// Clear search results
function clearResults() {
    const searchInput = document.getElementById('searchInput');
    const recommendationsSection = document.getElementById('recommendationsSection');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (recommendationsSection) {
        recommendationsSection.classList.add('hidden');
    }
}

// Form submission
function submitForm(event) {
    if (event) {
        event.preventDefault();
    }
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (name && email && message) {
        alert('Thank you for your message! We will get back to you soon.');
        // Reset form
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';
    } else {
        alert('Please fill in all fields.');
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for search input (Enter key)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchRecommendations();
            }
        });
    }
    
    // Console log to verify data loading
    console.log('Travel recommendation website loaded');
    console.log('Available data:', travelData);
    
    // You can uncomment this line to load data from JSON file instead
    //fetchTravelData().then(data => console.log('Data loaded:', data));
});