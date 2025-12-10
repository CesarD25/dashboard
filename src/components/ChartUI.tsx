import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

interface ChartUIProps {
  data?: OpenMeteoResponse | null | undefined;
}

function formatTimeLabel(ts: string) {
   if (!ts) return '';
   const d = new Date(ts);
   if (isNaN(d.getTime())) return ts; // fallback: return original
   const hours = String(d.getHours()).padStart(2, '0');
   const minutes = String(d.getMinutes()).padStart(2, '0');
   return `${hours}:${minutes}`;
}

function listas(data: OpenMeteoResponse | null | undefined) {
    if (!data) {
        return { temperature_2m: [], wind_speed_10m: [], time: [] } as const;
    }
    const temperature_2m = data.hourly.temperature_2m.slice(0, 15);
    const wind_speed_10m = data.hourly.wind_speed_10m.slice(0, 15);
    const time = data.hourly.time.slice(0, 15).map(t => formatTimeLabel(t));
    return { temperature_2m, wind_speed_10m, time } as const;
}

export default function ChartUI({ data }: ChartUIProps) {
   const list = listas(data);
   return (
      <>
         <Typography variant="h5" component="div">
            fecha vs temperatura (2m) & velocidad del viento (10m)
         </Typography>
         <LineChart
            height={300}
            series={[
               { data: list.temperature_2m, label: 'Temperatura (2m)'},
               { data: list.wind_speed_10m, label: 'Velocidad del viento (10m)' },
            ]}
            xAxis={[{ scaleType: 'point', data: list.time }]}
         />
      </>
   );
}