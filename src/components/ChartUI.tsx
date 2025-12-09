import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

interface ChartUIProps {
  data: OpenMeteoResponse | null;
}

function listas(data: OpenMeteoResponse | null | undefined) {
    if (!data) {
        return { temperature_2m: [], wind_speed_10m: [], time: [] };
    }
    let temperature_2m=data.hourly.temperature_2m.slice(0,7)   ;
    let wind_speed_10m=data.hourly.wind_speed_10m.slice(0,7);
    let time=data.hourly.time.slice(0,7);
    return {temperature_2m, wind_speed_10m, time};
}

export default function ChartUI({ data }: ChartUIProps) {
   return (
      <>
         <Typography variant="h5" component="div">
            fecha vs temperatura (2m) & velocidad del viento (10m)
         </Typography>
         <LineChart
            height={300}
            series={[
               { data: listas(data).temperature_2m, label: 'Temperatura (2m)'},
               { data: listas(data).wind_speed_10m, label: 'Velocidad del viento (10m)' },
            ]}
            xAxis={[{ scaleType: 'point', data: listas(data).time }]}
         />
      </>
   );
}