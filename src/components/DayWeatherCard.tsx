import { CloudRain, Sunrise, Sunset, Thermometer, Wind } from 'lucide-react';
import { formatLocalClock, type TripWeatherForecast } from '../lib/tripWeather';

const weatherEmoji = (code: number) => {
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 71 && code <= 77 || code >= 85 && code <= 86) return '🌨️';
  if (code >= 95) return '⛈️';
  return '🌧️';
};

export function CompactDayWeather({ forecast }: { forecast: TripWeatherForecast }) {
  return <><span className="rounded-md bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-black text-sky-600 dark:text-sky-300">{weatherEmoji(forecast.weatherCode)} {forecast.temperatureMin}–{forecast.temperatureMax}°C · 雨 {forecast.precipitationProbability}%</span><span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-black text-amber-600 dark:text-amber-300">🌇 日落 {formatLocalClock(forecast.sunset)}</span></>;
}

export default function DayWeatherCard({ forecast, fetchedDate }: { forecast: TripWeatherForecast; fetchedDate: string }) {
  return (
    <div className="rounded-xl border border-sky-400/20 bg-sky-400/5 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black text-sky-600 dark:text-sky-300">{weatherEmoji(forecast.weatherCode)} {forecast.location} · {forecast.description}</p>
          <p className="mt-1 text-[9px] text-stone-400">预报日期：{forecast.date} · 数据抓取日期：{fetchedDate}</p>
        </div>
        <p className="shrink-0 text-sm font-black text-stone-800 dark:text-white">{forecast.temperatureMin}–{forecast.temperatureMax}°C</p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5 text-[9px] font-bold text-stone-600 dark:text-stone-300 sm:grid-cols-4">
        <div className="rounded-lg bg-white/55 px-2 py-1.5 dark:bg-stone-950/25"><Thermometer className="mb-1 h-3 w-3 text-orange-500" />体感 {forecast.apparentMin}–{forecast.apparentMax}°C</div>
        <div className="rounded-lg bg-white/55 px-2 py-1.5 dark:bg-stone-950/25"><CloudRain className="mb-1 h-3 w-3 text-sky-500" />降雨 {forecast.precipitationProbability}% · {forecast.precipitationSum}mm</div>
        <div className="rounded-lg bg-white/55 px-2 py-1.5 dark:bg-stone-950/25"><Wind className="mb-1 h-3 w-3 text-cyan-500" />风 {forecast.windSpeedMax} · 阵风 {forecast.windGustMax}km/h</div>
        <div className="rounded-lg bg-amber-500/10 px-2 py-1.5 text-amber-800 dark:text-amber-200"><div className="mb-1 flex items-center gap-1"><Sunrise className="h-3 w-3" />日出 {formatLocalClock(forecast.sunrise)}</div><div className="flex items-center gap-1"><Sunset className="h-3 w-3" />日落 {formatLocalClock(forecast.sunset)}</div></div>
      </div>
      {forecast.sunsetArrivalTime && <p className="mt-2 rounded-lg bg-amber-500/10 px-2.5 py-2 text-[10px] font-bold leading-relaxed text-amber-800 dark:text-amber-200"><span>日落安排：</span>当地时间 {formatLocalClock(forecast.sunset)} 日落，拍照建议最迟 {forecast.sunsetArrivalTime} 到达机位。</p>}
      <p className="mt-2 rounded-lg bg-white/50 px-2.5 py-2 text-[10px] font-bold leading-relaxed text-stone-700 dark:bg-stone-950/25 dark:text-stone-200"><span className="text-sky-600 dark:text-sky-300">穿衣建议：</span>{forecast.clothingAdvice}</p>
    </div>
  );
}
