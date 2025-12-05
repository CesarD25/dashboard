//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import { Grid } from '@mui/material';
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from "./components/SelectorUI";
import IndicatorUI from './components/IndicatorUI';
import useFetchData from './functions/useFetchData';

function App() {
  const { data, loading, error } = useFetchData();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Grid container spacing={5} justifyContent="center" alignItems="center">

      {/* Encabezado */}
      <Grid size={12} ><HeaderUI></HeaderUI></Grid>

      {/* Alertas */}
      <Grid size={12} container justifyContent="right" alignItems="center"><AlertUI description="No se preveen lluvias"/></Grid>

      {/* Selector */}
      <Grid size={{ xs: 12, md: 3 }}><SelectorUI/></Grid>

      {/* Indicadores */}
      <Grid container size={{ xs: 12, md: 9 }} >

        <Grid size={{ xs: 12, md: 3 }}>
          {data &&
            (<IndicatorUI
              title='Temperatura (2m)'
              description={`${data.current.temperature_2m} ${data.current_units.temperature_2m}`} />)
          }
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          {/* IndicatorUI con la Temperatura aparente en °C' */}
          {data &&
            (<IndicatorUI
              title='Temperatura aparente'
              description={`${data.current.apparent_temperature} ${data.current_units.apparent_temperature}`} />)
          }
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          {/* IndicatorUI con la Velocidad del viento en km/h' */}
          {data &&
            (<IndicatorUI
              title='Velocidad del viento'
              description={`${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`} />)
          }
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          {/* IndicatorUI con la Humedad relativa en %' */}
          {data &&
            (<IndicatorUI
              title='Humedad relativa'
              description={`${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}`} />)
          }
        </Grid>

      </Grid>

      {/* Gráfico */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "block"} }}>Elemento: Gráfico</Grid>

      {/* Tabla */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "block"} }}>Elemento: Tabla</Grid>

      {/* Información adicional */}
      <Grid size={{ xs: 12, md: 12 }}>Elemento: Información adicional</Grid>

    </Grid>
  )
}

export default App
