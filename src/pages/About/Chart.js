import React from "react";
import { Bar } from "react-chartjs-2";
import { Container } from "react-bootstrap";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const HorizontalBarChart = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 }); // Trigger when 20% of the section is visible

  const data = {
    labels: ["Product A", "Product B", "Product C", "Product D", "Product E"],
    datasets: [
      {
        label: "Sales ($)",
        data: inView ? [300, 500, 700, 400, 600] : [0, 0, 0, 0, 0], // Animate from 0 when in view
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y", // Switch the axis to horizontal
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1500, // Duration of the animation (1.5 seconds)
    },
  };

  return (
    <Container ref={ref}>
      <motion.h2
        style={{ color: "whitesmoke", paddingLeft: "10px", paddingBottom: "20px", paddingTop: "20px" }}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ delay: 0.2 }}
      >
        <strong>Did you know</strong>
      </motion.h2>
      <div
        style={{ maxWidth: "750px", margin: "0 auto" }}
        variants={{
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 },
        }}
        transition={{ delay: 0.2 }}
      >
        <Bar data={data} options={options} />
      </div>
    </Container>
  );
};

export default HorizontalBarChart;
