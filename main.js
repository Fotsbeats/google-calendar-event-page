// Replace these with your actual values
const CALENDAR_ID = 'fotsbeats@gmail.com';
const API_KEY = 'AIzaSyCZlvhvhxnmUzBfK5Vq21Fv-o9nIKZdpZA';

async function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    
    try {
        const now = new Date().toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${now}&singleEvents=true&orderBy=startTime&maxResults=10`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to load events');
        }
        
        eventsContainer.innerHTML = '';
        
        if (!data.items || data.items.length === 0) {
            eventsContainer.innerHTML = '<p class="text-white text-center">No upcoming events</p>';
            return;
        }
        
        data.items.forEach(event => {
            const eventDiv = document.createElement('p');
            eventDiv.className = 'text-white text-xs font-bold pb-2 text-center';
            
            // Handle date formatting - fixes timezone issue for all-day events
            let startDate;
            if (event.start.date) {
                // All-day event - parse as local date to avoid timezone shift
                const [year, month, day] = event.start.date.split('-');
                startDate = new Date(year, month - 1, day);
            } else {
                // Timed event
                startDate = new Date(event.start.dateTime);
            }
            
            const options = { weekday: 'long', month: 'numeric', day: 'numeric' };
            const formattedDate = startDate.toLocaleDateString('en-US', options);
            
            // Get event name
            const eventName = event.summary || 'Untitled Event';
            
            // Get location
            const location = event.location || '';
            
            // Build the display string: "Saturday 9/20 The Ivy, Huntington NY"
            eventDiv.textContent = `${formattedDate} ${eventName}${location ? ', ' + location : ''}`;
            
            eventsContainer.appendChild(eventDiv);
        });
        
    } catch (error) {
        console.error('Error loading events:', error);
        eventsContainer.innerHTML = `<p class="text-white text-center">Error loading events: ${error.message}</p>`;
    }
}

// Load events when the page loads
loadEvents();
