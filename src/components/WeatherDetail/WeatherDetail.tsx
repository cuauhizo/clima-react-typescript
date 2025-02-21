import { Weather } from '../../hooks/useWeather';
import { formaterTemperature } from '../../utils';
import styles from './WeatherDetail.module.css';

type WeatherDetailProps = {
  weather: Weather;
};

export default function WeatherDetail({ weather }: WeatherDetailProps) {
  return (
    <div className={styles.container}>
      <h2>Clima de: {weather.name}</h2>
      <p className={styles.current}>{formaterTemperature(weather.main.temp)}&deg;C</p>
      <div className={styles.temperatures}>
        <p>
          Max: <span>{formaterTemperature(weather.main.temp_max)}&deg;C</span>
        </p>
        <p>
          Min: <span>{formaterTemperature(weather.main.temp_min)}&deg;C</span>
        </p>
      </div>
    </div>
  );
}
