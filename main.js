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
            eventsContainer.innerHTML = '<p class="white text-center">No upcoming events</p>';
            return;
        }
        
        // Create a list of events
        const eventsList = document.createElement('ul');
        eventsList.className = 'events-list';
        
        data.items.forEach(event => {
            const li = document.createElement('li');
            li.className = 'event-item';
            
            // Format the date
            const startDate = new Date(event.start.dateTime || event.start.date);
            const options = { weekday: 'long', month: 'numeric', day: 'numeric' };
            const formattedDate = startDate.toLocaleDateString('en-US', options);
            
            // Get event name
            const eventName = event.summary || 'Untitled Event';
            
            // Get location
            const location = event.location || '';
            
            // Build the display string: "Saturday 9/20 The Ivy, Huntington NY"
            li.textContent = `${formattedDate} ${eventName}${location ? ', ' + location : ''}`;
            
            eventsList.appendChild(li);
        });
        
        eventsContainer.appendChild(eventsList);
        
    } catch (error) {
        console.error('Error loading events:', error);
        eventsContainer.innerHTML = `<p class="white text-center">Error loading events: ${error.message}</p>`;
    }
}

// Load events when the page loads
loadEvents();
