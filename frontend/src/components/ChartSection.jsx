import {Chart} from "./Chart.jsx";
import {useEffect, useState} from "react";
import axios from "axios";

export function ChartSection({symbol}){

    const [data, setData] = useState([]);
    useEffect(() => {
        async function getKlines() {
            const res = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=100`);
            const formatted = res.data.map(candle => ({
                time: Math.floor(candle[0] / 1000),
                open: parseFloat(candle[1]),
                high: parseFloat(candle[2]),
                low: parseFloat(candle[3]),
                close: parseFloat(candle[4]),
            }));
            setData(formatted);
            const ws=new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_5m`)
            ws.onopen=()=>{
                ws.onmessage=(msg)=>{
                    const event=JSON.parse(msg.data).k

                    const newCandle = {
                        time: Math.floor(event.t / 1000),
                        open: parseFloat(event.o),
                        high: parseFloat(event.h),
                        low: parseFloat(event.l),
                        close: parseFloat(event.c)
                    };

                    setData(prevData => {
                        const last = prevData[prevData.length - 1];

                        // If it's the same time (still forming), replace it
                        if (last && last.time === newCandle.time) {
                            return [...prevData.slice(0, -1), newCandle];
                        } else {
                            return [...prevData, newCandle];
                        }
                    });

                }
            }
        }

        getKlines();

    }, [symbol]);
    return(
        <Chart data={data}/>
    )
}