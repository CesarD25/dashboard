import { useEffect, useState, useCallback } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

interface DataState {
    loading: boolean;
    data: OpenMeteoResponse | null;
    error: string | null;
}

export default function useFetchData() { 
    const URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m';

    const [dataState, setDataState] = useState<DataState>({
        loading: true,
        data: null,
        error: null
    });

    const handleFetch = useCallback(async () => {
        try {
            const response = await fetch(URL);
            
            if (!response.ok) throw new Error(response.statusText);
            
            const json = await response.json();
            
            setDataState(prev => ({
                ...prev,
                loading: false,
                data: json
            }));
        } catch (error) {
            setDataState(prev => ({
                ...prev,
                loading: false,
                error: (error as Error).message
            }));
        }
    }, []);

    useEffect(() => { 
        if (!dataState.data) handleFetch();
    }, [handleFetch, dataState.data]); 

    return { ...dataState };
}