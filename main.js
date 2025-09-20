// Replace these with your actual values
const CALENDAR_ID = 'fotsbeats@gmail.com';
const API_KEY = 'AIzaSyCZlvhvhxnmUzBfK5Vq21Fv-o9nIKZdpZA';

async function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    
    try {
        // Get date from 1 week ago
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const timeMin = oneWeekAgo.toISOString();
        
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime&maxResults=30`;
        
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
        
        // Create wrapper for left-aligned content within centered container
        const wrapper = document.createElement('div');
        wrapper.style.display = 'inline-block';
        wrapper.style.textAlign = 'left';
        
        data.items.forEach(event => {
            const eventDiv = document.createElement('p');
            // Use inline style to ensure white color shows
            eventDiv.style.color = '#ffffff';
            eventDiv.style.fontSize = '0.75rem';
            eventDiv.style.paddingBottom = '0.5rem';
            
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
            
            // Format date as M/D (without year)
            const month = startDate.getMonth() + 1;
            const day = startDate.getDate();
            const formattedDate = `${month}/${day}`;
            
            // Get event name
            const eventName = event.summary || 'Untitled Event';
            
            // Get and format location
            let location = event.location || '';
            if (location) {
                // Remove ", USA" from the end
                location = location.replace(/, USA$/i, '');
                // Replace "NYC" with "New York, NY"
                if (location.trim() === 'NYC') {
                    location = 'New York, NY';
                }
            }
            
            // Build the date and location parts
            let displayText = `${formattedDate} - `;
            
            // Create event name element (link or plain text)
            if (event.description) {
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const urls = event.description.match(urlRegex);
                if (urls && urls.length > 0) {
                    // Create clickable link
                    const link = document.createElement('a');
                    link.href = urls[0];
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.style.color = '#ffffff';
                    link.style.textDecoration = 'none';
                    
                    const strong = document.createElement('strong');
                    strong.textContent = eventName;
                    link.appendChild(strong);
                    
                    eventDiv.innerHTML = displayText;
                    eventDiv.appendChild(link);
                } else {
                    // No link - just bold text
                    eventDiv.innerHTML = `${displayText}<strong>${eventName}</strong>`;
                }
            } else {
                // No description - just bold text
                eventDiv.innerHTML = `${displayText}<strong>${eventName}</strong>`;
            }
            
            // Add location if exists
            if (location) {
                const locationText = document.createTextNode(` - ${location}`);
                eventDiv.appendChild(locationText);
            }
            
            wrapper.appendChild(eventDiv);
        });
        
        eventsContainer.appendChild(wrapper);
        
        eventsContainer.appendChild(wrapper);
        
    } catch (error) {
        console.error('Error loading events:', error);
        eventsContainer.innerHTML = `<p class="text-white text-center">Error loading events: ${error.message}</p>`;
    }
}

// Load events when the page loads
loadEvents();
