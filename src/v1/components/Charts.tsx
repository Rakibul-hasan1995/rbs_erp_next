'use client'
import { ApexOptions } from "apexcharts";
import React from "react";
import { useThemeContext } from "../context/themeContext";
import dynamic from "next/dynamic";
const DynamicApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  chartOptions?: ApexOptions
}

const ChartComponent: React.FC<Props> = ({ chartOptions }) => {

  const { isDarkMode } = useThemeContext()

  const options: ApexOptions = {
    stroke: {
      curve: "smooth",
      width: 3,
    },
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      background: undefined,
      sparkline: {
        enabled: true,
      },
      height: 100
    },
    tooltip: {
      y: {
        formatter: undefined,
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
    },
    grid: {
      show: false
    },
    theme: {
      mode: isDarkMode ? "dark" : 'light',
      palette: 'palette1',
      monochrome: {
        enabled: false,
        color: '#255aee',
        // shadeTo: isDarkMode ? "dark" : 'light',
        shadeIntensity: 0.65
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    ...chartOptions
  }

  return (
    <DynamicApexCharts
      options={options}
      series={options.series}
      type={options?.chart?.type}
      height={options.chart?.height}
    />

  );
};

export default ChartComponent;






