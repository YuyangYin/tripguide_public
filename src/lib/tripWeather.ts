export interface TripWeatherLocation {
  dayId: string;
  date: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface TripWeatherForecast {
  dayId: string;
  date: string;
  location: string;
  weatherCode: number;
  description: string;
  temperatureMax: number;
  temperatureMin: number;
  apparentMax: number;
  apparentMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  windSpeedMax: number;
  windGustMax: number;
  clothingAdvice: string;
}

export interface TripWeatherSnapshot {
  fetchedDate: string;
  fetchedAt: string;
  source: 'Open-Meteo';
  forecasts: Record<string, TripWeatherForecast>;
}

export const TRIP_WEATHER_LOCATIONS: TripWeatherLocation[] = [
  { dayId: 'day-1', date: '2026-09-24', name: '北京', latitude: 39.9042, longitude: 116.4074 },
  { dayId: 'day-2', date: '2026-09-25', name: '巴塞罗那', latitude: 41.3874, longitude: 2.1686 },
  { dayId: 'day-3', date: '2026-09-26', name: '巴塞罗那', latitude: 41.3874, longitude: 2.1686 },
  { dayId: 'day-4', date: '2026-09-27', name: '米伦', latitude: 46.5592, longitude: 7.8926 },
  { dayId: 'day-5', date: '2026-09-28', name: '厄希嫩湖', latitude: 46.4985, longitude: 7.7268 },
  { dayId: 'day-6', date: '2026-09-29', name: 'Loen', latitude: 61.8711, longitude: 6.8494 },
  { dayId: 'day-7', date: '2026-09-30', name: '盖朗厄尔', latitude: 62.1015, longitude: 7.2052 },
  { dayId: 'day-8', date: '2026-10-01', name: 'Flåm', latitude: 60.8626, longitude: 7.114 },
  { dayId: 'day-9', date: '2026-10-02', name: '亨宁斯韦尔', latitude: 68.1535, longitude: 14.2014 },
  { dayId: 'day-10', date: '2026-10-03', name: 'Reine', latitude: 67.9324, longitude: 13.0896 },
  { dayId: 'day-11', date: '2026-10-04', name: 'Svolvær', latitude: 68.2343, longitude: 14.568 },
  { dayId: 'day-12', date: '2026-10-05', name: '斯德哥尔摩', latitude: 59.3293, longitude: 18.0686 },
  { dayId: 'day-13', date: '2026-10-06', name: '斯德哥尔摩', latitude: 59.3293, longitude: 18.0686 },
  { dayId: 'day-14', date: '2026-10-07', name: '香港', latitude: 22.3193, longitude: 114.1694 },
];

const WEATHER_CODE_LABELS: Record<number, string> = {
  0: '晴朗', 1: '大致晴朗', 2: '局部多云', 3: '阴天', 45: '有雾', 48: '雾凇',
  51: '小毛毛雨', 53: '毛毛雨', 55: '较强毛毛雨', 56: '轻微冻雨', 57: '较强冻雨',
  61: '小雨', 63: '中雨', 65: '大雨', 66: '轻微冻雨', 67: '较强冻雨',
  71: '小雪', 73: '中雪', 75: '大雪', 77: '米雪', 80: '小阵雨', 81: '阵雨',
  82: '强阵雨', 85: '小阵雪', 86: '强阵雪', 95: '雷雨', 96: '雷雨伴小冰雹', 99: '雷雨伴强冰雹',
};

export const getWeatherDescription = (code: number) => WEATHER_CODE_LABELS[code] || '天气待确认';

export function getClothingAdvice(input: Pick<TripWeatherForecast, 'apparentMax' | 'apparentMin' | 'precipitationProbability' | 'precipitationSum' | 'windGustMax'>) {
  const advice: string[] = [];
  if (input.apparentMax >= 28) advice.push('短袖、透气下装，注意防晒补水');
  else if (input.apparentMax >= 21) advice.push('短袖或薄长袖，早晚带轻薄外套');
  else if (input.apparentMax >= 15) advice.push('长袖打底配薄外套');
  else if (input.apparentMax >= 9) advice.push('长袖、抓绒或薄羽绒，建议分层穿');
  else advice.push('保暖内层、抓绒和羽绒/厚外套');

  if (input.apparentMin <= 8) advice.push('清晨夜间加保暖层');
  if (input.precipitationProbability >= 40 || input.precipitationSum >= 1) advice.push('带防水外套和防水鞋');
  if (input.windGustMax >= 50) advice.push('阵风较强，穿防风外层并避免松散帽饰');
  else if (input.windGustMax >= 35) advice.push('准备防风外套');
  return advice.join('；') + '。';
}

type DailyWeather = {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  precipitation_probability_max: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
};

interface OpenMeteoResponse { daily: DailyWeather }

const roundOne = (value: number) => Math.round(value * 10) / 10;

export const localDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export async function fetchTripWeatherSnapshot(now = new Date()): Promise<TripWeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: TRIP_WEATHER_LOCATIONS.map((location) => location.latitude).join(','),
    longitude: TRIP_WEATHER_LOCATIONS.map((location) => location.longitude).join(','),
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max',
    timezone: 'auto',
    forecast_days: '16',
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error(`天气接口返回 HTTP ${response.status}`);
  const raw = await response.json() as OpenMeteoResponse | OpenMeteoResponse[];
  const results = Array.isArray(raw) ? raw : [raw];
  const forecasts: Record<string, TripWeatherForecast> = {};

  TRIP_WEATHER_LOCATIONS.forEach((location, responseIndex) => {
    const daily = results[responseIndex]?.daily;
    const dateIndex = daily?.time.indexOf(location.date) ?? -1;
    if (!daily || dateIndex < 0) return;
    const forecast: TripWeatherForecast = {
      dayId: location.dayId,
      date: location.date,
      location: location.name,
      weatherCode: daily.weather_code[dateIndex],
      description: getWeatherDescription(daily.weather_code[dateIndex]),
      temperatureMax: roundOne(daily.temperature_2m_max[dateIndex]),
      temperatureMin: roundOne(daily.temperature_2m_min[dateIndex]),
      apparentMax: roundOne(daily.apparent_temperature_max[dateIndex]),
      apparentMin: roundOne(daily.apparent_temperature_min[dateIndex]),
      precipitationProbability: Math.round(daily.precipitation_probability_max[dateIndex]),
      precipitationSum: roundOne(daily.precipitation_sum[dateIndex]),
      windSpeedMax: roundOne(daily.wind_speed_10m_max[dateIndex]),
      windGustMax: roundOne(daily.wind_gusts_10m_max[dateIndex]),
      clothingAdvice: '',
    };
    forecast.clothingAdvice = getClothingAdvice(forecast);
    forecasts[location.dayId] = forecast;
  });

  if (Object.keys(forecasts).length === 0) throw new Error('预报日期不在天气接口可用范围内');
  return {
    fetchedDate: localDateKey(now),
    fetchedAt: now.toISOString(),
    source: 'Open-Meteo',
    forecasts,
  };
}

const seedForecast = (dayId: string, date: string, location: string, weatherCode: number, temperatureMax: number, temperatureMin: number, apparentMax: number, apparentMin: number, precipitationProbability: number, precipitationSum: number, windSpeedMax: number, windGustMax: number): TripWeatherForecast => {
  const forecast: TripWeatherForecast = { dayId, date, location, weatherCode, description: getWeatherDescription(weatherCode), temperatureMax, temperatureMin, apparentMax, apparentMin, precipitationProbability, precipitationSum, windSpeedMax, windGustMax, clothingAdvice: '' };
  forecast.clothingAdvice = getClothingAdvice(forecast);
  return forecast;
};

const SEEDED_FORECASTS = [
  seedForecast('day-1', '2026-09-24', '北京', 61, 26.1, 18.7, 29.2, 20.5, 88, 10.3, 11.4, 28.1),
  seedForecast('day-2', '2026-09-25', '巴塞罗那', 1, 30.1, 20.4, 31.9, 21.5, 0, 0, 11.2, 30.2),
  seedForecast('day-3', '2026-09-26', '巴塞罗那', 2, 26.8, 20.1, 30, 21.4, 0, 0, 11.8, 30.2),
  seedForecast('day-4', '2026-09-27', '米伦', 1, 20, 11.3, 18.8, 7.9, 3, 0, 8, 20.5),
  seedForecast('day-5', '2026-09-28', '厄希嫩湖', 3, 20.9, 10.4, 19.5, 7.7, 7, 0, 10.1, 28.4),
  seedForecast('day-6', '2026-09-29', 'Loen', 51, 14.6, 5.1, 13.3, 3.2, 47, 0.3, 5.5, 42.5),
  seedForecast('day-7', '2026-09-30', '盖朗厄尔', 53, 16.4, 10.4, 17.1, 8.6, 32, 11.4, 7.8, 44.3),
  seedForecast('day-8', '2026-10-01', 'Flåm', 51, 19, 14.5, 20.8, 15.1, 63, 1.5, 5.3, 50.4),
  seedForecast('day-9', '2026-10-02', '亨宁斯韦尔', 53, 11.8, 11.3, 10.9, 9.4, 51, 8.1, 15.9, 44.3),
  seedForecast('day-10', '2026-10-03', 'Reine', 51, 12.2, 10, 12.1, 7.5, 46, 3.3, 16.1, 48.6),
  seedForecast('day-11', '2026-10-04', 'Svolvær', 80, 11.5, 9.5, 10, 4.8, 49, 17.1, 31.8, 79.2),
  seedForecast('day-12', '2026-10-05', '斯德哥尔摩', 53, 15.4, 11.3, 13.2, 10.4, 20, 5.1, 14, 37.8),
  seedForecast('day-13', '2026-10-06', '斯德哥尔摩', 53, 13.9, 9.6, 11.1, 8.1, 20, 3.3, 11.5, 28.4),
  seedForecast('day-14', '2026-10-07', '香港', 51, 30.9, 24, 35.7, 28, 51, 1.5, 15.9, 42.5),
];

export const INITIAL_TRIP_WEATHER_SNAPSHOT: TripWeatherSnapshot = {
  fetchedDate: '2026-09-23',
  fetchedAt: '2026-09-23T09:00:00.000Z',
  source: 'Open-Meteo',
  forecasts: Object.fromEntries(SEEDED_FORECASTS.map((forecast) => [forecast.dayId, forecast])),
};
