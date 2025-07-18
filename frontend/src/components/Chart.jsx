import React, { useRef, useEffect } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';

export function Chart({ data, width = 650, height = 300 }) {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current && chartContainerRef.current) {
            const chart = createChart(chartContainerRef.current, {
                width: typeof width === 'string' ? chartContainerRef.current.clientWidth : width,
                height,
                layout: {
                    backgroundColor: '#ffffff',
                    textColor: '#333',
                },
                grid: {
                    vertLines: { color: '#eee' },
                    horzLines: { color: '#eee' },
                },
                crosshair: {
                    mode: CrosshairMode.Normal,
                },
                rightPriceScale: { borderColor: '#ccc' },
                timeScale: { borderColor: '#ccc' },
            });

            const candlestickSeries = chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
                borderVisible: false,
            });

            chartRef.current = chart;
            seriesRef.current = candlestickSeries;

            if (data?.length) {
                candlestickSeries.setData(data);
            }
        }

        // Update chart data on data change
        if (seriesRef.current && data?.length) {
            seriesRef.current.setData(data);
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
                seriesRef.current = null;
            }
        };
    }, [data, width, height]);

    return (
        <div
            ref={chartContainerRef}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: `${height}px`,
            }}
            className="mt-1 border rounded border-gray-800"
        />
    );
}
