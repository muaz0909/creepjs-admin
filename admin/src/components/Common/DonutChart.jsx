import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';

const DonutChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current && data) {
            const ctx = chartRef.current.getContext('2d');

            new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: {
                    cutoutPercentage: 50,
                },
            });
        }
    }, [data]);

    return (
        <div >
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default DonutChart;
