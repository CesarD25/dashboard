import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

function combineArrays(arrLabels: Array<string>, arrValues1: Array<number>, arrValues2: Array<number>) {
   return arrLabels.map((label, index) => ({
      id: index,
      label: label,
      value1: arrValues1[index],
      value2: arrValues2[index]
   }));
}

interface TableUIProps {
  data?: OpenMeteoResponse | null;
}

function formatTimeLabel(ts?: string) {
   if (!ts) return '';
   const d = new Date(ts);
   if (isNaN(d.getTime())) return ts;
   const hours = String(d.getHours()).padStart(2, '0');
   const minutes = String(d.getMinutes()).padStart(2, '0');
   return `${hours}:${minutes}`;
}

function listas(data: OpenMeteoResponse | null | undefined): [string[], number[], number[]] {
   if (!data) {
      return [[], [], []];
   }
   const temperature_2m = data.hourly.temperature_2m.slice(0,15);
   const wind_speed_10m = data.hourly.wind_speed_10m.slice(0,15);
   const time = data.hourly.time.slice(0,15).map(t => formatTimeLabel(t));
   return [time, temperature_2m, wind_speed_10m];
}

const columns: GridColDef[] = [
   { field: 'id', headerName: 'ID', width: 50 },
   {
      field: 'label',
      headerName: 'Fecha (Hoy)',
      width: 125,
   },
   {
      field: 'value1',
      headerName: 'Temperatura (2m)',
      width: 130,
   },
   {
      field: 'value2',
      headerName: 'Velocidad viento (10m)',
      width: 165,
   },
   {
      field: 'resumen',
      headerName: 'Resumen',
      description: 'No es posible ordenar u ocultar esta columna.',
      sortable: false,
      hideable: false,
      width: 125,
      valueGetter: (_, row) => `${row.label || ''} ${row.value1 || ''} ${row.value2 || ''}`,
   },
];


export default function TableUI({ data }: TableUIProps) {

   const [time, temperature_2m, wind_speed_10m] = listas(data);
   const rows = combineArrays(time, temperature_2m, wind_speed_10m);

   return (
      <Box sx={{ height: 350, width: '100%' }}>
         <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
               pagination: {
                  paginationModel: {
                     pageSize: 5,
                  },
               },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
         />
      </Box>
   );
}