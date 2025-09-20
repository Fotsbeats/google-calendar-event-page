// Replace these with your actual values
const CALENDAR_ID = 'fotsbeats@gmail.com';
const API_KEY = 'AIzaSyCZlvhvhxnmUzBfK5Vq21Fv-o9nIKZdpZA';

async function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    
    try {
        // Get date from 2 weeks ago
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const timeMin = twoWeeksAgo.toISOString();
        
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime&maxResults=20`;
        
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
            // Use inline style to ensure white color shows
            eventDiv.style.color = '#ffffff';
            eventDiv.style.fontSize = '0.75rem';
            eventDiv.style.paddingBottom = '0.5rem';
            eventDiv.style.textAlign = 'center';
            
            // Handle date formatting - display in EST
            let startDate;
            if (event.start.date) {
                // All-day event - parse as local date to avoid timezone shift
                const [year, month, day] = event.start.date.split('-');
                startDate = new Date(year, month - 1, day);
            } else {
                // Timed event - convert to EST
                startDate = new Date(event.start.dateTime);
            }
            
            // Format date as M/D/YY
            const month = startDate.getMonth() + 1;
            const day = startDate.getDate();
            const year = startDate.getFullYear().toString().slice(-2);
            const formattedDate = `${month}/${day}/${year}`;
            
            // Get event name
            const eventName = event.summary || 'Untitled Event';
            
            // Get location
            const location = event.location || '';
            
            // Build the display string: "9/20/25 - The Ivy - Huntington, NY"
            eventDiv.innerHTML = `${formattedDate} - <strong>${eventName}</strong>${location ? ' - ' + location : ''}`;
            
            eventsContainer.appendChild(eventDiv);
        });
        
    } catch (error) {
        console.error('Error loading events:', error);
        eventsContainer.innerHTML = `<p class="text-white text-center">Error loading events: ${error.message}</p>`;
    }
}

// Load events when the page loads
loadEvents();
