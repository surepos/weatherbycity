import axios from 'axios';
import * as cheerio from 'cheerio';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/search', async (req, res) => {
    try {
        const cityName = req.body.cityName;

       
        const [weatherResponse, timeResponse, weatherForecast] = await Promise.all([
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.WEATHER_API_KEY}`),
            axios.get(`https://api.ipgeolocation.io/timezone?apiKey=${process.env.TIME_DATE_API_KEY}&location=${cityName}`),
            axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${process.env.WEATHER_API_KEY}`),
        ]);

        const weatherData = {
            temp: weatherResponse.data.main.temp,
            feels_like: weatherResponse.data.main.feels_like,
            humidity: weatherResponse.data.main.humidity,
            wind_speed: weatherResponse.data.wind.speed,
            description: weatherResponse.data.weather[0].description,
            city: weatherResponse.data.name,
           
        };
        const timeData = {
            time: timeResponse.data.time_12,
            date: timeResponse.data.date_time_txt.split(' ').slice(0, 4).join(' '),
        }

       const forecastData = {
        dayOne:{
            temp: weatherForecast.data.list[8].main.temp,
            description: weatherForecast.data.list[8].weather[0].description,
            date:weatherForecast.data.list[8].dt_txt
        },
        dayTwo:{
            temp: weatherForecast.data.list[16].main.temp,
            description: weatherForecast.data.list[16].weather[0].description,
            date:weatherForecast.data.list[16].dt_txt
        },
        dayThree:{
            temp: weatherForecast.data.list[24].main.temp,
            description: weatherForecast.data.list[24].weather[0].description,
            date:weatherForecast.data.list[24].dt_txt
        },
        dayFour:{
            temp: weatherForecast.data.list[32].main.temp,
            description: weatherForecast.data.list[32].weather[0].description,
            date:weatherForecast.data.list[32].dt_txt
        }
       }

        const responseData = {
            weather: weatherData,
            time: timeData,
            forecast: forecastData
        };
        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.listen(8080, () => {
    console.log('Server Running....');
});
