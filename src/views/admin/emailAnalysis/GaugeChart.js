import React from "react";
import Chart from "react-apexcharts";

const GaugeChart = ({ value, total, onClick }) => {
  const options = {
    chart: {
      type: "radialBar",
      height: 350,
      events: {
        // Call the onClick prop if it is passed in
        click: (event, chartContext, config) => {
          if (onClick) {
            onClick(event, chartContext, config);
          }
        },
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,
        track: {
          background: "#e7e7e7",
          strokeWidth: "97%",
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
          },
          value: {
            show: true,
            formatter: () => `${value}`, // Show raw number instead of percentage
            fontSize: "36px", // Make the number big
            fontWeight: "bold",
            color: "#FF4560", // Set the color to red
            offsetY: 10, // Adjust position
          },
          total: {
            show: true,
            label: `${value} / ${total}`, // Show the full fraction inside the graph
            fontSize: "18px",
            color: "#FFFFFF", // Set the color to white
            formatter: () => `${value} / ${total}`, // Display value/total inside the graph
          },
        },
      },
    },
    fill: {
        colors: ["#FF4560"], // Red color for the filled portion
      },
    stroke: {
      lineCap: "round",
    },
    labels: ["Score"],
  };

  const series = [(value / total) * 100];

  return (
    <div style={{ textAlign: "center" }}>
      <Chart options={options} series={series} type="radialBar" height={350} />
      <div style={{ marginTop: "-30px", color: "#FFFFFF", fontSize: "16px" }}>
        Vendors' Score
      </div>
      
    </div>
  );
};

export default GaugeChart;
