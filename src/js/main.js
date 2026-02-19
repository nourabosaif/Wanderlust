const Alllinks = document.querySelectorAll(".nav-section a");
const Allviews = document.querySelectorAll("section");

var header = [
  {
    name: "dashboard",
    subtitle: "Welcome back! Ready to plan your next adventure?",
  },
  {
    name: "holidays",
    subtitle: "Explore public holidays around the world",
  },
  {
    name: "events",
    subtitle: "Find concerts, sports, and entertainment",
  },
  {
    name: "weather",
    subtitle: "Check forecasts for any destination",
  },
  {
    name: "long-weekends",
    subtitle: "Find the perfect mini-trip opportunities",
  },
  {
    name: "currency",
    subtitle: "Convert currencies with live exchange rates",
  },
  {
    name: "sun-times",
    subtitle: "Check sunrise and sunset times worldwide",
  },
  {
    name: "my-plans",
    subtitle: "Your saved holidays and events",
  },
];

Alllinks.forEach((link) => {
  link.addEventListener("click", function () {
    Allviews.forEach((view) => {
      view.classList.remove("active");
    });
    Alllinks.forEach((l) => {
      l.classList.remove("active");
    });
    document
      .querySelector(`#${link.getAttribute("data-view")}-view`)
      .classList.add("active");
    let word = link.getAttribute("data-view");
    document.getElementById("page-title").innerHTML =
      word.charAt(0).toUpperCase() + word.slice(1);
    for (var i = 0; i < header.length; i++) {
      if (word === header[i].name) {
        document.getElementById("page-subtitle").innerHTML = header[i].subtitle;
      }
    }

    link.classList.add("active");
  });
});

document.getElementById("goToDashboard").addEventListener("click", function () {
  document.querySelector("#dashboard-view").classList.add("active");
  document.querySelector("#holidays-view").classList.remove("active");
  console.log("hiii");
});

//live time

function updateDateTime() {
  const now = new Date();

  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const optionsTwo = {
    weekday: "long",
    month: "short",
    day: "2-digit",
  };

  const formattedTwo = now.toLocaleString("en-US", optionsTwo);

  const formatted = now.toLocaleString("en-US", options);

  document.getElementById("current-datetime").textContent = formatted;
  document.querySelector(".weather-time").textContent = formattedTwo;
  document.getElementById("last-updated").textContent =
    `last updated: ${formattedTwo}`;
}
updateDateTime();

setInterval(updateDateTime, 60000);

getCountries();

let selectedYear = 2026;
document.getElementById("global-year").addEventListener("change", function () {
  selectedYear = this.value;
  console.log(selectedYear);
});
let selectedCountryCode;
document
  .getElementById("global-country")
  .addEventListener("change", function () {
    selectedCountryCode = this.value;
    if (this.value) {
      document
        .getElementById("selected-destination")
        .classList.remove("hidden");
    }
    getCities(selectedCountryCode);
  });

async function getCountries() {
  fetch("https://date.nager.at/api/v3/AvailableCountries")
    .then((response) => response.json())
    .then((data) => {
      displayCountries(data);
    });
}

function displayCountries(countries) {
  var cartona = `<option value="nothing" selected>Select a country</option>`;
  for (var i = 0; i < countries.length; i++) {
    cartona += `<option value="${countries[i].countryCode}">${countries[i].name}</option>`;
  }
  document.getElementById("global-country").innerHTML = cartona;
}
var dataCountry = [];
async function getCities(countryCode) {
  fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
    .then((response) => response.json())
    .then((data) => {
      dataCountry = data;
      displayCities(dataCountry);
      selectedDestination(dataCountry);
      getCountryTime(dataCountry);
      getCountriesEvents(countryCode, data[0].capital);
      getLatLon(data[0].capital);

      console.log(countryCode, data[0].capital);

      console.log(data);
    })
    .catch((error) => {
      console.error("Error fetching cities:", error);
      document.getElementById("global-city").innerHTML =
        '<option value="">Error loading capital</option>';
    });
}
var city = "";
function displayCities(data) {
  const cityDropdown = document.getElementById("global-city");
  const country = data[0];
  city = country.capital[0];
  if (country && country.capital && country.capital.length > 0) {
    cityDropdown.innerHTML = "";

    country.capital.forEach((capital) => {
      cityDropdown.innerHTML += `<option value="${capital}">${capital} (capital) </option>`;
    });
  } else {
    cityDropdown.innerHTML = '<option value="">No capital found</option>';
  }
}

function selectedDestination(data) {
  document
    .getElementById("selected-country-flag")
    .setAttribute("src", data[0].flags.png);
  document.getElementById("selected-country-name").innerHTML =
    data[0].name.common;
  document.getElementById("selected-city-name").innerHTML = data[0].capital;
}
const globalBtn = document.getElementById("global-search-btn");

globalBtn.addEventListener("click", function () {
  const selectedCountry = document.getElementById("global-country").value;

  if (
    !selectedCountry ||
    selectedCountry === "" ||
    selectedCountry === "nothing"
  ) {
    console.log("No country selected");

    Swal.fire({
      title: "<strong> <u>×</u></strong>",
      icon: "info",
      html: "Please select a <b>Country</b>,",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<i class="fa fa-thumbs-up"></i> Okay!',
      confirmButtonAriaLabel: "Thumbs up, great!",
    });
  } else {
    dashboardCountry(dataCountry);
    console.log("btn hi");

    document.querySelector(".country-info-placeholder").classList.add("hidden");
    document.querySelectorAll(".empty-state").forEach((el) => {
      el.classList.add("hidden");
    });

    document.getElementById("holidays-content").classList.remove("hidden");
    document.getElementById("nour").classList.remove("hidden");
    document.getElementById("events-content").classList.remove("hidden");
    document.getElementById("weather-content").classList.remove("hidden");
    document.getElementById("lw-content").classList.remove("hidden");
    document.getElementById("sun-times-content").classList.remove("hidden");

    getCountriesHolidays(selectedCountryCode, selectedYear);
    getCountriesLW(selectedCountryCode, selectedYear);
    getCountriesEvents(selectedCountryCode, city);

    Swal.fire({
      toast: true,
      position: "top",
      icon: "success",
      title: `Exploring ${dataCountry[0].name.common}`,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: "colored-toast",
      },
    });
  }
});

const closeBtn = document.getElementById("clear-selection-btn");

closeBtn.addEventListener("click", function () {
  document
    .querySelector(".country-info-placeholder")
    .classList.remove("hidden");
  document.getElementById("nour").classList.add("hidden");
  document.getElementById("selected-destination").classList.add("hidden");
  document.querySelector(".empty-state").classList.remove("hidden");
  document.getElementById("holidays-content").classList.add("hidden");
  document.getElementById("weather-content").classList.add("hidden");
  document.getElementById("lw-content").classList.add("hidden");
  document.getElementById("events-content").classList.add("hidden");
  document.getElementById("sun-times-content").classList.add("hidden");
  Swal.fire({
    toast: true,
    position: "top",
    icon: "info",
    title: "Selection cleared",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    showCloseButton: true,
    customClass: {
      popup: "custom-toast",
      icon: "custom-icon",
      title: "custom-title",
      closeButton: "custom-close",
    },
  });
});

async function getCountryTime(countryCode) {
  const response = await fetch(
    `https://restcountries.com/v3.1/alpha/${countryCode}`,
  );
  const data = await response.json();
  const country = data[0];

  const utcOffset = country.timezones[0];

  const offsetMatch = utcOffset.match(/UTC([+-])(\d{2}):(\d{2})/);
  const sign = offsetMatch[1] === "+" ? 1 : -1;
  const hours = parseInt(offsetMatch[2]);
  const minutes = parseInt(offsetMatch[3]);
  const totalOffsetMinutes = sign * (hours * 60 + minutes);

  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const localTime = new Date(utcTime + totalOffsetMinutes * 60000);

  const timeString = localTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return {
    time: timeString,
  };
}

async function dashboardCountry(data) {
  const timeData = await getCountryTime(data[0].cca2);

  const timeString = timeData.time;
  const currencies = data[0].currencies;
  const currencyCode = Object.keys(currencies)[0];
  const currency = currencies[currencyCode];
  const languages = data[0].languages;
  const languageCode = Object.keys(languages)[0];
  const languageName = languages[languageCode];

  const allViewHeaders = document.querySelectorAll(".view-header-selection");

  allViewHeaders.forEach((header) => {
    header.style.display = "flex";
  });
  const allSelectionFlags = document.querySelectorAll(".selection-flag");

  allSelectionFlags.forEach((header) => {
    header.src = data[0].flags.png;
  });
  const allFlags = document.querySelectorAll(".selection-flag");

  allFlags.forEach((header) => {
    header.style.display = "block";
  });

  const allBadges = document.querySelectorAll(".current-selection-badge span");

  allBadges.forEach((header) => {
    header.innerHTML = data[0].name.common;
  });
  const allCities = document.querySelectorAll(".selection-city");

  allCities.forEach((header) => {
    header.innerHTML = data[0].capital;
  });

  const allYears = document.querySelectorAll(".selection-year");

  allYears.forEach((header) => {
    header.innerHTML = selectedYear;
  });

  document.getElementById("nour").innerHTML = `
    
            <div id="dashboard-country-info" class="dashboard-country-info">
              
              <div class="dashboard-country-header">
                <img src=${data[0].flags.png} alt="Egypt" class="dashboard-country-flag">
                <div class="dashboard-country-title">
                  <h3>${data[0].name.common}</h3>
                  <p class="official-name">${data[0].name.official}</p>
                  <span class="region"><i class="fa-solid fa-location-dot"></i> ${data[0].region}•  ${data[0].subregion}</span>
                </div>
              </div>
              
              <div class="dashboard-local-time">
                <div class="local-time-display">
                  <i class="fa-solid fa-clock"></i>
                  <span class="local-time-value" id="country-local-time">${timeString}</span>
                  <span class="local-time-zone">${data[0].timezones}</span>
                </div>
              </div>
              
              <div class="dashboard-country-grid">
                <div class="dashboard-country-detail">
                  <i class="fa-solid fa-building-columns"></i>
                  <span class="label">Capital</span>
                  <span class="value">${data[0].capital}</span>
                </div>
                <div class="dashboard-country-detail">
                  <i class="fa-solid fa-users"></i>
                  <span class="label">Population</span>
                  <span class="value">${data[0].population}</span>
                </div>
                <div class="dashboard-country-detail">
                  <i class="fa-solid fa-ruler-combined"></i>
                  <span class="label">Area</span>
                  <span class="value">${data[0].area} km²</span>
                </div>
                <div class="dashboard-country-detail">
                  <i class="fa-solid fa-globe"></i>
                  <span class="label">Continent</span>
                  <span class="value">${data[0].continents}</span>
                </div>
                <div class="dashboard-country-detail">
                  <i class="fa-solid fa-phone"></i>
                  <span class="label">Calling Code</span>
                  <span class="value">${data[0].idd.root}${data[0].idd.suffixes}</span>
                </div>
                <div class="dashboard-country-detail">
                  <i class="fa-solid fa-car"></i>
                  <span class="label">Driving Side</span>
                  <span class="value">${data[0].car.side}</span>
                </div>
                <div class="dashboard-country-detail">
                  <i class="fa-solid fa-calendar-week"></i>
                  <span class="label">Week Starts</span>
                  <span class="value">${data[0].startOfWeek}</span>
                </div>
              </div>
              
              <div class="dashboard-country-extras">
                <div class="dashboard-country-extra">
                  <h4><i class="fa-solid fa-coins"></i> Currency</h4>
                  <div class="extra-tags">
                    <span class="extra-tag">${currency.name} (${currencyCode} ${currency.symbol})</span>
                  </div>
                </div>
                <div class="dashboard-country-extra">
                  <h4><i class="fa-solid fa-language"></i> Languages</h4>
                  <div class="extra-tags">
                    <span class="extra-tag">${languageName}</span>
                  </div>
                </div>
                <div class="dashboard-country-extra">
                  <h4><i class="fa-solid fa-map-location-dot"></i> Neighbors</h4>
                  <div class="extra-tags">
                    ${findBorders(data)}
                  </div>
                </div>
              </div>
              
              <div class="dashboard-country-actions">
                <a href="${data[0].maps.googleMaps}" target="_blank" class="btn-map-link">
                  <i class="fa-solid fa-map"></i> View on Google Maps
                </a>
              </div>
              
            </div>
    `;

  displayBorders();
}

function findBorders(data) {
  if (!data[0].borders || data[0].borders.length === 0) {
    return '<span class="extra-tag">No land borders</span>';
  }
  var cartona = ``;
  for (var i = 0; i < data[0].borders.length; i++) {
    cartona += `
  <span class="extra-tag border-tag">${data[0].borders[i]}</span>
  `;
  }

  return cartona;
}

function displayBorders() {
  const bordersBtn = document.querySelectorAll(".extra-tags span");
  for (var i = 0; i < bordersBtn.length; i++) {
    bordersBtn[i].addEventListener("click", function () {
      let countryCode = this.textContent;
      console.log(countryCode);

      getBorders(countryCode);
    });
  }
}

async function getBorders(countryCode) {
  fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
    .then((response) => response.json())
    .then((data) => {
      dashboardCountry(data);
    })
    .catch((error) => {
      console.error("Error fetching cities:", error);
      document.getElementById("global-city").innerHTML =
        '<option value="">Error loading capital</option>';
    });
}

async function getCountriesHolidays(countryCode, selectedYear) {
  fetch(
    `https://date.nager.at/api/v3/PublicHolidays/${selectedYear}/${countryCode}`,
  )
    .then((response) => response.json())
    .then((data) => {
      displayCountriesHolidays(data);
      console.log(data);
    });
}

function displayCountriesHolidays(data) {
  var cartona = ``;
  for (var i = 0; i < data.length; i++) {
    const dateString = data[i].date;
    const date = new Date(dateString);
    const dayOfWeekLong = date.toLocaleDateString("en-US", { weekday: "long" });
    const monthName = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.toLocaleDateString("en-US", { day: "2-digit" });
    cartona += `<div class="holiday-card">
              <div class="holiday-card-header">
                <div class="holiday-date-box"><span class="day">${day}</span><span class="month">${monthName}</span></div>
                <button class="holiday-action-btn"><i class="fa-regular fa-heart"></i></button>
              </div>
              <h3>${data[i].name}</h3>
              <p class="holiday-name">${data[i].localName}</p>
              <div class="holiday-card-footer">
                <span class="holiday-day-badge"><i class="fa-regular fa-calendar"></i> ${dayOfWeekLong}</span>
                <span class="holiday-type-badge">${data[i].types}</span>
              </div>
            </div>`;
  }

  document.getElementById("holidays-content").innerHTML = cartona;
}
async function getCountriesLW(countryCode, selectedYear) {
  fetch(
    `https://date.nager.at/api/v3/LongWeekend/${selectedYear}/${countryCode}`,
  )
    .then((response) => response.json())
    .then((data) => {
      displayCountriesLW(data);
      console.log(data);
    });
}
function displayCountriesLW(data) {
  var cartona = ``;
  for (var i = 0; i < data.length; i++) {
    const dateStart = data[i].startDate;
    const dateEnd = data[i].endDate;
    const dateS = new Date(dateStart);
    const dateE = new Date(dateEnd);

    const monthNameStart = dateS.toLocaleDateString("en-US", {
      month: "short",
    });
    const dayS = dateS.toLocaleDateString("en-US", { day: "2-digit" });

    const monthNameEnd = dateE.toLocaleDateString("en-US", { month: "short" });
    const dayE = dateE.toLocaleDateString("en-US", { day: "2-digit" });
    let daysHTML = ``;
    for (
      let date = new Date(dateS);
      date <= dateE;
      date.setDate(date.getDate() + 1)
    ) {
      const dayOfWeek = date
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();
      const dayNumber = String(date.getDate()).padStart(2, "0");

      daysHTML += `<div class="lw-day"><span class="name">${dayOfWeek}</span><span class="num">${dayNumber}</span></div>`;
    }
    cartona += ` <div class="lw-card">
              <div class="lw-card-header">
                <span class="lw-badge"><i class="fa-solid fa-calendar-days"></i> ${data[i].dayCount} Days</span>
                <button class="holiday-action-btn"><i class="fa-regular fa-heart"></i></button>
              </div>
              <h3>Long Weekend #${i + 1}</h3>
              <div class="lw-dates"><i class="fa-regular fa-calendar"></i>  ${monthNameStart} ${dayS} - ${monthNameEnd} ${dayE} , ${selectedYear}</div>
              <div class="lw-info-box ${data[i].bridgeDays == false ? `success` : `warning`}"> ${data[i].bridgeDays == false ? `<i class="fa-solid fa-check-circle"></i>No extra days off needed!` : `<i class="fa-regular fa-circle-xmark"></i>Requires taking a bridge day off `}</div>
              <div class="lw-days-visual">
                ${daysHTML}
              </div>
            </div>`;
  }

  document.getElementById("lw-content").innerHTML = cartona;
}

async function getCountriesEvents(countryCode, city) {
  fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?apikey=eo4nC93iFI9pMXDquWFvFrBHZtw4QT0j&city=${encodeURIComponent(city)}&countryCode=${countryCode}&size=20`,
  )
    .then((response) => response.json())
    .then((data) => {
      if (data._embedded && data._embedded.events) {
        displayCountriesEvents(data);
        document.querySelector(".view-header-content p").innerHTML =
          `Discover concerts, sports, theatre and more in ${city}`;
      } else {
        document.querySelector(".view-header-content p").innerHTML =
          `Discover concerts, sports, theatre and more in cities WorldWide`;
        document.getElementById("events-content").innerHTML =
          `<div class="empty-state">
        <div class="empty-icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-ticket" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ticket" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V160z"></path></svg></i></div>
        <h3>No Events Found</h3>
        <p>No events found for this location</p>
      </div>`;
      }
      console.log(data);
    });
}

function displayCountriesEvents(data) {
  let cartona = ``;
  for (var i = 0; i < data._embedded.events.length; i++) {
    const dateString = data._embedded.events[i].dates.start.localDate;
    const date = new Date(dateString);
    const monthName = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.toLocaleDateString("en-US", { day: "2-digit" });
    const year = date.toLocaleDateString("en-US", { year: "numeric" });
    const time = data._embedded.events[i].dates?.start?.localTime
      ? data._embedded.events[i].dates.start.localTime.slice(0, 5)
      : "";

    cartona += `<div class="event-card">
              <div class="event-card-image">
                <img src="${data._embedded.events[i].images[0].url}" class="event-card-image" alt="Jazz Night">
                <span class="event-card-category">${data._embedded.events[i].classifications[0].segment.name}</span>
                <button class="event-card-save"><i class="fa-regular fa-heart"></i></button>
              </div>
              <div class="event-card-body">
                <h3>${data._embedded.events[i].name}</h3>
                <div class="event-card-info">
                  <div><i class="fa-regular fa-calendar"></i>${monthName} ${day}, ${year}  at ${time}</div>
                  <div><i class="fa-solid fa-location-dot"></i>Cairo Opera House, Cairo</div>
                </div>
                <div class="event-card-footer">
                  <button class="btn-event"><i class="fa-regular fa-heart"></i> Save</button>
                  <a href="${data._embedded.events[i].url}"" class="btn-buy-ticket"><i class="fa-solid fa-ticket"></i> Buy Tickets</a>
                </div>
              </div>
            </div>`;
  }

  document.getElementById("events-content").innerHTML = cartona;
}
const formattedThree = new Date().toISOString().split("T")[0];
console.log(formattedThree);
async function getLatLon(city) {
  fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var cityLat = data.results[0].latitude;
      var cityLon = data.results[0].longitude;
      getWeather(cityLat, cityLon);
      getSunRise(cityLat, cityLon, formattedThree, city);

      document.getElementById("weather-view-header").innerHTML =
        `Check 7-day weather forecasts for ${city}`;
    });
}

async function getWeather(lat, lon) {
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`,
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayWeather(data);
    });
}

function getWeatherDescription(code) {
  // Clear / Clouds
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";

  // Fog
  if (code === 45) return "Fog";
  if (code === 48) return "Depositing rime fog";

  // Drizzle
  if (code === 51) return "Drizzle: light";
  if (code === 53) return "Drizzle: moderate";
  if (code === 55) return "Drizzle: dense";

  // Rain
  if (code === 61) return "Rain: slight";
  if (code === 63) return "Rain: moderate";
  if (code === 65) return "Rain: heavy";

  // Snow
  if (code === 71) return "Snow fall: slight";
  if (code === 73) return "Snow fall: moderate";
  if (code === 75) return "Snow fall: heavy";

  // Rain showers
  if (code === 80) return "Rain showers: slight";
  if (code === 81) return "Rain showers: moderate";
  if (code === 82) return "Rain showers: violent";

  // Thunderstorm
  if (code === 95) return "Thunderstorm: slight or moderate";
  if (code === 96) return "Thunderstorm with hail: slight";
  if (code === 99) return "Thunderstorm with hail: heavy";

  return "Unknown weather condition";
}

function displayWeather(data) {
  console.log("hiiiiiiiiiiiiiii");

  document.getElementById("weather-location").innerHTML = data.timezone;
  document.querySelector(".temp-value").innerHTML = Math.round(
    data.current.temperature_2m,
  );
  document.querySelector(".weather-feels").innerHTML =
    `Feels like ${Math.round(data.current.apparent_temperature)}°C`;
  document.getElementById("weather-current-wind").innerHTML =
    `${data.current.wind_speed_10m} km/h`;

  document.getElementById("weather-current-humidity").innerHTML =
    `${data.current.relative_humidity_2m}%`;
  document.querySelector(".detail-bar-fill").style.width =
    `${data.current.relative_humidity_2m}%`;
  document.getElementById("weather-current-uv").innerHTML =
    data.current.uv_index;
  //document.getElementById("weather-current-precipitation").innerHTML=getAverage(data.hourly.precipitation_probability);
  document.getElementById("conditionn").innerHTML =
    `${getWeatherDescription(data.current.weather_code)}`;
  console.log(getWeatherDescription(data.current.weather_code));
  if (data.current.weather_code == (0 | 1)) {
    document.querySelector(".weather-hero-card").classList.add("weather-sunny");
  } else {
    document
      .querySelector(".weather-hero-card")
      .classList.add("weather-cloudy");
  }
  console.log(document.querySelector(".weather-condition"));

  const temps = data.hourly.temperature_2m;

  const maxTemp = Math.round(Math.max(...temps));
  const minTemp = Math.round(Math.min(...temps));

  document.querySelector(".low").innerHTML =
    `<i class="fa-solid fa-arrow-down"></i>${minTemp}`;
  document.querySelector(".high").innerHTML =
    `<i class="fa-solid fa-arrow-up"></i>${maxTemp}`;

  document.getElementById("sunrise").innerHTML =
    data.daily.sunrise[0].split("T")[1];
  document.getElementById("sunset").innerHTML =
    data.daily.sunset[0].split("T")[1];

  const currentHourIndex = new Date().getHours();
  const currentTemp = Math.round(data.hourly.temperature_2m[currentHourIndex]);

  let cartona = ``;
  for (var i = currentHourIndex + 1; i < currentHourIndex + 24; i++) {
    console.log(i);
    cartona += ` <div class="hourly-item">
                  <span class="hourly-time">${formatHourTo12Hour(data.hourly.time[i])}</span>
                  <div class="hourly-icon"><i class="fa-solid fa-sun"></i></div>
                  <span class="hourly-temp">${Math.round(data.hourly.temperature_2m[i])}°</span>
                </div>
  `;
  }
  document.querySelector(".hourly-scroll").innerHTML =
    `<div class="hourly-item now">
                  <span class="hourly-time">Now</span>
                  <div class="hourly-icon"><i class="fa-solid fa-sun"></i></div>
                  <span class="hourly-temp" id="hourly-now">${currentTemp}°</span>
                </div>` + cartona;

  let cartonaa = ``;
  for (var i = 1; i < 7; i++) {
    cartonaa += `<div class="forecast-day">
                  <div class="forecast-day-name"><span class="day-label">${formatDayAndDate(data.daily.time[i]).dayOfWeek}</span><span class="day-date">${formatDayAndDate(data.daily.time[i]).dayMonth}</span></div>
                  <div class="forecast-icon"><i class="fa-solid fa-sun"></i></div>
                  <div class="forecast-temps"><span class="temp-max">${Math.round(data.daily.temperature_2m_max[i])}°</span><span class="temp-min">${Math.round(data.daily.temperature_2m_min[i])}°</span></div>
                  <div class="forecast-precip">${data.daily.precipitation_probability_max[i]}%</div>
                </div>`;
  }
  document.querySelector(".forecast-list").innerHTML =
    `<div class="forecast-day today">
                  <div class="forecast-day-name"><span class="day-label">Today</span><span class="day-date">25 Jan</span></div>
                  <div class="forecast-icon"><i class="fa-solid fa-sun"></i></div>
                  <div class="forecast-temps"><span class="temp-max">${Math.round(data.daily.temperature_2m_max[0])}°</span><span class="temp-min">${Math.round(data.daily.temperature_2m_min[0])}°</span></div>
                  <div class="forecast-precip">${data.daily.precipitation_probability_max[0]}%</div>
                </div>` + cartonaa;
}

function formatHourTo12Hour(timestamp) {
  const date = new Date(timestamp);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
}
function formatDayAndDate(dateString) {
  const date = new Date(dateString);
  const dayOfWeek = date
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });

  return {
    dayOfWeek: dayOfWeek,
    dayMonth: `${day} ${month}`,
  };
}

async function getSunRise(lat, lon, formattedThree, city) {
  fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=${formattedThree}&formatted=0`,
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displaySunrise(data, city);
    });
}
let cityy = "";
function displaySunrise(data, city) {
  const results = data.results;
  cityy = city;

  function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function formatDate(isoString) {
    const date = new Date(isoString);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const dayStr = date.toLocaleDateString("en-US", {
      weekday: "long",
    });
    return { date: dateStr, day: dayStr };
  }

  function formatDayLength(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  function calculateDaylightPercentage(dayLengthSeconds) {
    return ((dayLengthSeconds / 86400) * 100).toFixed(1);
  }

  function calculateDarkness(dayLengthSeconds) {
    const darknessSeconds = 86400 - dayLengthSeconds;
    const hours = Math.floor(darknessSeconds / 3600);
    const minutes = Math.floor((darknessSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  const dateInfo = formatDate(results.sunrise);
  const dayLengthSeconds = results.day_length;
  const daylightPercent = calculateDaylightPercentage(dayLengthSeconds);
  const darkness = calculateDarkness(dayLengthSeconds);
  const dayLengthFormatted = formatDayLength(dayLengthSeconds);

  const sunTimesHTML = `
    <div class="sun-main-card">
      <div class="sun-main-header">
        <div class="sun-location">
          <h2><i class="fa-solid fa-location-dot"></i> ${cityy}</h2>
          <p>Sun times for your selected location</p>
        </div>
        <div class="sun-date-display">
          <div class="date">${dateInfo.date}</div>
          <div class="day">${dateInfo.day}</div>
        </div>
      </div>
      
      <div class="sun-times-grid">
        <div class="sun-time-card dawn">
          <div class="icon"><i class="fa-solid fa-moon"></i></div>
          <div class="label">Dawn</div>
          <div class="time">${formatTime(results.civil_twilight_begin)}</div>
          <div class="sub-label">Civil Twilight</div>
        </div>
        <div class="sun-time-card sunrise">
          <div class="icon"><i class="fa-solid fa-sun"></i></div>
          <div class="label">Sunrise</div>
          <div class="time">${formatTime(results.sunrise)}</div>
          <div class="sub-label">Golden Hour Start</div>
        </div>
        <div class="sun-time-card noon">
          <div class="icon"><i class="fa-solid fa-sun"></i></div>
          <div class="label">Solar Noon</div>
          <div class="time">${formatTime(results.solar_noon)}</div>
          <div class="sub-label">Sun at Highest</div>
        </div>
        <div class="sun-time-card sunset">
          <div class="icon"><i class="fa-solid fa-sun"></i></div>
          <div class="label">Sunset</div>
          <div class="time">${formatTime(results.sunset)}</div>
          <div class="sub-label">Golden Hour End</div>
        </div>
        <div class="sun-time-card dusk">
          <div class="icon"><i class="fa-solid fa-moon"></i></div>
          <div class="label">Dusk</div>
          <div class="time">${formatTime(results.civil_twilight_end)}</div>
          <div class="sub-label">Civil Twilight</div>
        </div>
        <div class="sun-time-card daylight">
          <div class="icon"><i class="fa-solid fa-hourglass-half"></i></div>
          <div class="label">Day Length</div>
          <div class="time">${dayLengthFormatted}</div>
          <div class="sub-label">Total Daylight</div>
        </div>
      </div>
    </div>
    
    <div class="day-length-card">
      <h3><i class="fa-solid fa-chart-pie"></i> Daylight Distribution</h3>
      <div class="day-progress">
        <div class="day-progress-bar">
          <div class="day-progress-fill" style="width: ${daylightPercent}%"></div>
        </div>
      </div>
      <div class="day-length-stats">
        <div class="day-stat">
          <div class="value">${dayLengthFormatted}</div>
          <div class="label">Daylight</div>
        </div>
        <div class="day-stat">
          <div class="value">${daylightPercent}%</div>
          <div class="label">of 24 Hours</div>
        </div>
        <div class="day-stat">
          <div class="value">${darkness}</div>
          <div class="label">Darkness</div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("sun-times-content").innerHTML = sunTimesHTML;
}

getCurrenciesNames();
// currency

async function getCurrenciesNames() {
  fetch(`https://v6.exchangerate-api.com/v6/5033326fc32ba356e6039bdf/codes`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayCurrenciesName(data);
    });
}

function displayCurrenciesName(data) {
  const currencies = data.supported_codes;

  currencies.forEach((currency) => {
    const code = currency[0];
    const fullName = currency[1];

    document.getElementById("currency-from").innerHTML +=
      ` <option value="${code}" selected>${code} - ${fullName}</option>`;
    document.getElementById("currency-to").innerHTML +=
      ` <option value="${code}" selected>${code} - ${fullName}</option>`;
  });
}

// let currencyFrom;
// let currencyTo;
// let amount;
// document
//   .getElementById("currency-from")
//   .addEventListener("change", function () {
//     currencyFrom = this.value;
//     document.getElementById("currency-to").addEventListener("change", function () {
//       currencyTo = this.value;
//       document.getElementById("currency-amount").addEventListener("input", function () {
//         amount= this.value;
//         convertCurrency(currencyFrom, currencyTo ,amount);
//         console.log(currencyFrom, currencyTo,amount);
//         document.getElementById("amount-from").innerHTML = amount;

//       });
//     });

//   });
const convertBtn = document.getElementById("convert-btn");

convertBtn.addEventListener("click", function () {
  const currencyFrom = document.getElementById("currency-from").value;
  const currencyTo = document.getElementById("currency-to").value;
  const amount = document.getElementById("currency-amount").value;
  convertCurrency(currencyFrom, currencyTo, amount);
  document.getElementById("amount-from").innerHTML = amount;
  document.getElementById("currency-code-from").innerHTML = currencyFrom;
  document.getElementById("currency-code-to").innerHTML = currencyTo;
});

async function convertCurrency(currencyFrom, currencyTo, amount) {
  fetch(
    `https://v6.exchangerate-api.com/v6/5033326fc32ba356e6039bdf/pair/${currencyFrom}/${currencyTo}/${amount}`,
  )
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("conversion-amount").innerHTML =
        data.conversion_result.toFixed(2);
      document.getElementById("conv").innerHTML =
        `<p>1 ${currencyFrom} = ${data.conversion_rate.toFixed(2)} ${currencyTo}</p>`;
    });
}

updateQuickConvert();
makeQuickConvertClickable();
async function updateQuickConvert() {
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/5033326fc32ba356e6039bdf/latest/USD`,
    );
    const data = await response.json();

    const rates = data.conversion_rates;

    updateCurrencyCard("EUR", rates.EUR);
    updateCurrencyCard("GBP", rates.GBP);
    updateCurrencyCard("EGP", rates.EGP);
    updateCurrencyCard("AED", rates.AED);
    updateCurrencyCard("SAR", rates.SAR);
    updateCurrencyCard("JPY", rates.JPY);
    updateCurrencyCard("CAD", rates.CAD);
    updateCurrencyCard("INR", rates.INR);
  } catch (error) {
    console.error("Error fetching quick convert rates:", error);
  }
}

function updateCurrencyCard(currencyCode, rate) {
  const cards = document.querySelectorAll(".popular-currency-card");

  cards.forEach((card) => {
    const codeElement = card.querySelector(".code");

    if (codeElement && codeElement.textContent === currencyCode) {
      const rateElement = card.querySelector(".rate");
      if (rateElement) {
        rateElement.textContent = rate.toFixed(2);
      }
    }
  });
}

function makeQuickConvertClickable() {
  const cards = document.querySelectorAll(".popular-currency-card");

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      const currencyCode = card.querySelector(".code").textContent;

      document.getElementById("currency-from").value = "USD";
      document.getElementById("currency-to").value = currencyCode;

      const amount = document.getElementById("currency-amount").value || 100;

      convertCurrency("USD", currencyCode, amount);

      document.getElementById("amount-from").innerHTML = amount;
      document.getElementById("currency-code-from").innerHTML = "USD";
      document.getElementById("currency-code-to").innerHTML = currencyCode;

      document
        .querySelector(".currency-result")
        .scrollIntoView({ behavior: "smooth" });
    });

    card.style.cursor = "pointer";
  });
}



