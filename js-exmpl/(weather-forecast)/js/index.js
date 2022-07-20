let weather = {
  api: "8f9cb5f0a8123b810b77b511d29acd0b",
  currentLat: null,
  currentLon: null,


  fetchWeather: function (city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.api}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        this.currentLat = data.coord.lat;
        this.currentLon = data.coord.lon;
        this.displayWeather(data);
        this.fetchWeatherDaily()
      });
  },

  fetchWeatherDaily: function () {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${this.currentLat}&lon=${this.currentLon}&exclude=houtly,minutely&units=metric&appid=${this.api}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        fiveDaysEl(data)
        getHourInfo(data);
      })
  },



  displayWeather: function (data) {
    getCurrentInfo(data)
    displayEl()
  },

  getCurrentCity: function (latitude, longitude) {
    fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${this.api}`)
      .then((response) => response.json())
      .then((data) => {
        weather.fetchWeather(data[0].name);
        console.log(data[0].name);
      })
  },

  getHourly: function (date) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.currentLat}&lon=${this.currentLon}&exclude=current&units=metric&limit=5&appid=${this.api}`)
      .then(response => response.json())
      .then((data) => {
        let result = data.hourly.filter(hour => moment(hour.dt * 1000).format("DD.MM.YYYY") === date);
        display (result)
        console.log(result);
      })
  }

};


// SEARCH
document.querySelector(".search-form").addEventListener("submit", function (event) {
  event.preventDefault();
  weather.fetchWeather(document.querySelector(".search-bar").value);
});

// Текущая геопизиция
navigator.geolocation.getCurrentPosition((success) => {
  let { latitude, longitude } = success.coords;
  weather.getCurrentCity(latitude, longitude);
});


function setText(element, text) { 
  document.querySelector(element).textContent = text;
}


function getCurrentInfo(data) {
  const { name, weather, main, sys, dt } = data;
  let time = moment().format("DD.MM.YYYY");
  setText(".city", `Current Weather ${name}`);
  setText(".date-time", time);
  document.querySelector(".icon").src =
    `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
  setText(".description", weather[0].description)
  setText(".temp",main.temp + "°C")
  setText(".real-feel","Real Feel: " + main.feels_like + "°C")
  setText(".sunrise","Sunrise: " + window.moment(sys.sunrise * 1000).format('HH:mm A'))
  setText(".sunset","Sunset: " + window.moment(sys.sunset * 1000).format('HH:mm A'))
  setText(".duration","Duration: " + window.moment(dt * 1000).format('HH:mm') + " hr")
}

function getHourInfo(data) {
  let weatherForecastEl = document.getElementById('daily-weather');

  let otherDayForcast = ''
  data.hourly.forEach((hour) => {
    data.hourly.splice(5);
    const { weather, wind_speed, feels_like, dt, temp } = hour;
    otherDayForcast += `            
            <div class="block-two d-f">  
              <div class="d-f">
                  <div class="date-t">
                        <p> ${window.moment(dt * 1000).format('HH A')}</p>
                  </div>  
                  <div class="icon-t">
                    <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="" class="icon" />
                  </div>  
              </div>             

              <div class="">
                <div class="desc">
                  <h5>${weather[0].description}</h5> 
                </div>
                <div class="temp-t">
                 <h5>${temp}</h5>  
                </div>
                <div class="real-temp">
                  <h5>${feels_like}</h5> 
                </div>
                <div class="speed">
                  <h5>${wind_speed} SE</h5> 
                </div>
              </div>          
            </div>
            `;
  })


  weatherForecastEl.innerHTML = otherDayForcast;
}

function fiveDaysEl(data) {
  const weatherForecastEl = document.getElementById('cards');
  let otherDay = ''
  const hourly = document.querySelector(".For-hourly");
  data.daily.forEach((day, i) => {
    data.daily.splice(5);
    if (i === 0) {
      otherDay += `
      <div class="cart" data-cart="${i}" data-date="${window.moment(day.dt * 1000.).format('DD.MM.YYYY')}">      
        <div class="block d-f">            
          <div class="">
            <h3> Today  </h3>
          </div> 
          <div>      
            <h5>${window.moment(day.dt * 1000.).format('Do MMM')}</h5>
          </div>
          <div>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="" class="icon" />
          </div>  
          <div>
            <h5>${day.temp.day}</h5>
          </div>                    
          <div>
            <p>${day.weather[0].description}</p>
          </div>                         
        </div>  
      </div>
      `
       hourly.style.display = 'block';
       weather.getHourly(moment().format('DD.MM.YYYY'))
    } else {
      otherDay += `
      <div class="cart" data-cart="${i}" data-date="${window.moment(day.dt * 1000.).format('DD.MM.YYYY')}">      
        <div class="block d-f">            
          <div class="">
            <h3>${window.moment(day.dt * 1000).format('ddd')}</h3>
          </div> 
          <div>      
            <h5>${window.moment(day.dt * 1000.).format('Do MMM ')}</h5>
          </div>
          <div>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="" class="icon" />
          </div>  
          <div>
            <h5>${day.temp.day}</h5>
          </div>                    
          <div>
            <p>${day.weather[0].description}</p>
          </div>                         
        </div>  
      </div>
      `
    }
  })
  weatherForecastEl.innerHTML = otherDay;
  

  
  
  document.querySelector('.second-page').addEventListener('click', (e) =>{
    if(e.target.closest('.cart').hasAttribute('data-date')){
      weather.getHourly(e.target.closest('.cart').getAttribute('data-date'))
    }
  })
 
}


function display (result){
  let weatherForecastEl = document.getElementById('hourly-weather');
  let weatherForecast = document.getElementById('block-two');
    let otherHourForcast = ''
    let otherHour = ''
    result.forEach((hour) => {
    result.splice(5);
    const { weather, wind_speed, feels_like, dt, temp } = hour;
    otherHourForcast += ` 
               
            <div class="block-two d-f">  
              <div class="d-f">
                  <div class="date-t">
                        <p> ${window.moment(dt * 1000).format('HH A')}</p>
                  </div>  
                  <div class="icon-t">
                    <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="" class="icon" />
                  </div>  
              </div>             

              <div class="">
                <div class="desc">
                  <h5>${weather[0].description}</h5> 
                </div>
                <div class="temp-t">
                 <h5>${temp}</h5>  
                </div>
                <div class="real-temp">
                  <h5>${feels_like}</h5> 
                </div>
                <div class="speed">
                  <h5>${wind_speed} SE</h5> 
                </div>
              </div>          
            </div>
            `;
  })


  weatherForecastEl.innerHTML = otherHourForcast;
  result.forEach((hour) => {
    result.splice(1);
    const { dt } = hour;
    otherHour+= `<h3>${window.moment(dt * 1000).format('ddd')}</h3>` 
  }) 
  weatherForecast.innerHTML = otherHour;

  }


function displayEl() {
   const FirstPage = document.querySelector(".first-page")
  const SecondPage = document.querySelector(".second-page")
  const SideNav = document.querySelector(".sidenav")
  let first = document.getElementById("first")
  let second = document.getElementById("second")

  SideNav.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-td')) {
      first.classList.add("active");
      second.classList.remove("active");
      SecondPage.style.display = 'none';
      FirstPage.style.display = 'Block';
    } else if (e.target.hasAttribute('data-five-days')) {
      second.classList.add("active");
      first.classList.remove("active");
      FirstPage.style.display = 'none';
      SecondPage.style.display = 'block';
    }
  })

}