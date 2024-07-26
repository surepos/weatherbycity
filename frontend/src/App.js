import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';

function App() {
  const [cityName, setCityName] = useState('Busan');
  const [error, setError] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [time, setTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  useEffect(() => {
    const fetch = () => {
      setTimeout(() => {
        setLoading(false);
      }, 2550);
    };
    fetch();
  }, []);

  function handleChange(event) {
    setCityName(event.target.value);
  }

  const fetchWeather = async () => {
    try {
      const response = await axios.post('http://localhost:8080/search', {
        cityName,
      });
      setWeather(response.data.weather);
      setForecast(response.data.forecast);
      setTime(
        new Date(response.data.time.date + ' ' + response.data.time.time)
      );
      setError('');
      setCityName('');
    } catch (error) {
      setError('Failed to fetch data. Please try again.');
      console.error(error);
      setCityName('');
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  useEffect(() => {
    if (time) {
      const intervalId = setInterval(() => {
        setTime((prevTime) => new Date(prevTime.getTime() + 1000));
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [time]);

  async function handleSubmit(event) {
    event.preventDefault();
    await fetchWeather();
  }

  const formatDate = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options) + ' ' + formatAMPM(date);
  };

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    const strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    return strTime;
  };
  function dateToDayName(dt) {
    const date = new Date(dt);
    const dayOfWeekIndex = date.getDay();
    const dayName = daysOfWeek[dayOfWeekIndex];
    return dayName;
  }

  return loading ? (
    <Loader />
  ) : (
    <div className="App">
      <div className="contentContainer">
        <div className="sectionOne">
          <div className="cityInfo">
            <div className="cityName">{weather ? weather.city : cityName}</div>
            <div className="cityDate">{time ? formatDate(time) : ''}</div>
          </div>
          <div className="searchCity">
            <form className="searchSection" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter city name"
                name="cityName"
                value={cityName}
                onChange={handleChange}
              />
              <button type="submit">Search</button>
            </form>
            <div className="searchIcon">
              <img src="location.png" alt="Your-Location" />
            </div>
          </div>
        </div>
        <div className="sectionTwo">
          {weather && (
            <div className="degreeSection">
              <div className="degree">{Math.round(weather.temp - 273.15)}</div>
              <div className="degreeInfo">
                <div className="degreeSign">
                  °C <span>| °F</span>
                </div>
                <div>{weather.description || 'Partly cloudy'}</div>
              </div>
            </div>
          )}
          {weather && (
            <div className="weatherInfo">
              <div className="imageSection">
                <img src={`/${weather.description}.png`} alt="Cloud" />
              </div>

              <div className="moreWeather">
                <div className="feelsLike">
                  <span>
                    <img src="/travel.png" alt="" />
                  </span>{' '}
                  Feels like: {Math.round(weather.feels_like - 273.15)}°C
                </div>
                <div className="humidity">
                  <span>
                    <img src="humidity.png" alt="" />
                  </span>{' '}
                  Humidity: {weather.humidity}%
                </div>
                <div className="wind">
                  <span>
                    <img src="wind.png" alt="" />
                  </span>{' '}
                  Wind: {weather.wind_speed} km/h
                </div>
              </div>
            </div>
          )}
        </div>

        {forecast && (
          <div className="sectionThree">
            <div className="today">
              <div className="todayDate">Today</div>
              <div className="todayImg">
                <img src={`${weather.description}.png`} alt="Cloud" />
              </div>
              <div className="todayTemp">
                <div className="todayCent">
                  {Math.round(weather.temp - 273.15)}°C
                </div>
                <div>{weather.description}</div>
              </div>
            </div>
            {Object.keys(forecast).map((dayKey) => (
              <div className="today" key={dayKey}>
                <div className="todayDate">
                  {dateToDayName(forecast[dayKey].date)}
                </div>
                <div className="todayImg">
                  <img
                    src={`/${forecast[dayKey].description}.png`}
                    alt="Cloud"
                  />
                </div>
                <div className="todayTemp">
                  <div className="todayCent">
                    {Math.round(forecast[dayKey].temp - 273.15)}°C
                  </div>
                  <div>{forecast[dayKey].description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
