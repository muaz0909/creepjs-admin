import React, { useEffect, useRef } from 'react';
import Chart from "chart.js";

const LineChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current && data) {
            const ctx = chartRef.current.getContext('2d');

            new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    // Add your line chart options here
                },
            });
        }
    }, [data]);

    return (
        <div>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default LineChart;
