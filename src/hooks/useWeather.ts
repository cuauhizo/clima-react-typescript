import axios from 'axios';
import { z } from 'zod';
// import { object, string, number, Output, parse } from 'valibot';
import { SearchType } from '../Types';
import { useMemo, useState } from 'react';

// Type Guards o assertion
// function isWeatherResponse(weather: unknown) {
//   return (
//     Boolean(weather) &&
//     typeof weather === 'object' &&
//     typeof (weather as Weather).name === 'string' &&
//     typeof (weather as Weather).main.temp === 'number' &&
//     typeof (weather as Weather).main.temp_max === 'number' &&
//     typeof (weather as Weather).main.temp_min === 'number'
//   );
// }

// Zod
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
  }),
});
export type Weather = z.infer<typeof Weather>;

// Valibot
// const WeatherSchema = object({
//   name: string(),
//   main: object({
//     temp: number(),
//     temp_max: number(),
//     temp_min: number(),
//   }),
// });
// type Weather = Output<typeof WeatherSchema>;

const initialState = {
  name: '',
  main: {
    temp: 0,
    temp_max: 0,
    temp_min: 0,
  },
};

export default function useWeather() {
  const [weather, setWeather] = useState<Weather>(initialState);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchWeather = async (search: SearchType) => {
    // console.log('Consultando...');
    const APIkey = import.meta.env.VITE_API_KEY;
    setLoading(true);
    setWeather(initialState);
    try {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${APIkey}`;
      const { data } = await axios(geoUrl);
      // console.log(data);

      // Comprobar si existe
      if (!data[0]) {
        // console.log('Clima no encontrado');
        setNotFound(true);
        return;
      }

      const lat = data[0].lat;
      const lon = data[0].lon;
      // console.log(lat, lon);

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`;
      // console.log(weatherUrl);

      // Castear el type
      // const { data: weatherResult } = await axios<Weather>(weatherUrl);
      // console.log(weatherResult.main.temp);
      // console.log(weatherResult.name);

      // Type Guards o assertion
      // const { data: weatherResult } = await axios(weatherUrl);
      // const result = isWeatherResponse(weatherResult);
      // console.log(result);

      // Zod
      const { data: weatherResult } = await axios(weatherUrl);
      const result = Weather.safeParse(weatherResult);
      // console.log(result);
      if (result.success) {
        setWeather(result.data);
      } else {
        console.log('Respuesta mal formada ...');
      }

      // Valibot
      // const { data: weatherResult } = await axios(weatherUrl);
      // const result = parse(WeatherSchema, weatherResult);
      // if (result) {
      //   console.log(result.name);
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const hasWeatherData = useMemo(() => weather.name, [weather]);

  return {
    weather,
    loading,
    notFound,
    fetchWeather,
    hasWeatherData,
  };
}
