import './style.css'

const eventContainer = document.querySelector('#events-container');
const eventAmtToFetch = document.querySelector('#eventAmt');

const getRandomNumBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getMonth = (month) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month];
const getDayOfWeek = (weekday) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][weekday]
const isAM = (hour) => hour < 12;
const getHour = (hour) => (hour <= 12 ? hour : hour - 12);
const getMinute = (minute) => (minute === 0 ? '00' : minute);

function processDate(date) {
  const hour = getHour(date.getHours()) === 0
    ? false
    : getHour(date.getHours());
  const minute = getMinute(date.getMinutes());
  const timeSuffix = `<small>${isAM(date.getHours())
    ? `AM`
    : `PM`
    }</small>`
  const time = hour && `${hour}:${minute}${timeSuffix}`;

  return {
    month: getMonth(date.getMonth()),
    weekday: getDayOfWeek(date.getDay() - 2),
    time,
    date: date.getDate(),
  }
}

function mapEventObject(event) {
  const startDate = event.start.dateTime
    ? processDate(new Date(event.start.dateTime))
    : processDate(new Date(`${event.start.date}T00:00:00`))
  const endDate = event.end.dateTime
    ? processDate(new Date(event.end.dateTime))
    : processDate(new Date(`${event.end.date}T00:00:00`))
  let dateRange;
  if (startDate.date !== endDate.date) {
    dateRange = `${startDate.month} ${startDate.date}–${endDate.month} ${endDate.date}`
  } else if (!startDate.time) {
    dateRange = `${startDate.month} ${startDate.date}`;
  } else {
    dateRange = `${startDate.weekday}, ${startDate.time}–${endDate.time}`;
  }

  return {
    name: event.summary,
    description: event.description,
    location: event.location,
    start: startDate,
    end: endDate,
    dateRange,
    link: event.htmlLink,
  }
}

function createEvent(e, i) {


  return `<article>
          
  <a href="${e.description}" target="_blank"><div class="card">
          
       
              <p class="white text-xs text-center">${e.dateRange} - ${e.name},  ${e.location}</p>
            </div></a>
        </article>`
}

async function loadEvents(max = 200) {
  try {
    const endpoint = await fetch(`./.netlify/functions/calFetch?maxResults=${max}`);
    const data = await endpoint.json();
    const processedEvents = data.map(e => mapEventObject(e));
    eventContainer.innerHTML = processedEvents.map((event, i) => createEvent(event, i)).join('');
  } catch (e) {
    eventContainer.innerHTML = `<p class="text-center text-3xl">🙀 Something went wrong!</p>`
    console.log(e);
  }
}
loadEvents();

eventContainer.addEventListener('click', (e) => {
  if (e.target.hasAttribute('aria-expanded')) {
    e.target.setAttribute('aria-expanded', e.target.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
    e.target.querySelector('svg').classList.toggle('rotate-180');
    e.target.nextElementSibling.classList.toggle('hidden');
  }
})
eventAmtToFetch.addEventListener('change', (e) => loadEvents(eventAmtToFetch.value))