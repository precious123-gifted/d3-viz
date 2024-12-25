"use client";

import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import Image from "next/image";
import menuIcon from "../assets/menu-icon.png";
import screenLine from "../assets/screen-line.png";
import { useStore } from "../StoreContext";

export default function ChartScreen() {
  const barChartContainer = useRef(null);
  const revenueTextRef = useRef(null); // Reference for the revenue text
  const { storeSimulation } = useStore();
  const { totalSales } = storeSimulation;

  const [dataSet, setDataSet] = useState(
    Array.from({ length: 7 }, (_, i) => ({
      time: new Date(Date.now() - (6 - i) * 20000),
      revenue: totalSales * 0.1 * (Math.random() + 0.9),
    }))
  );

  const [isMounted, setIsMounted] = useState(false);
  const previousDataRef = useRef(dataSet);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataSet((prevData) => {
        const newTime = new Date();
        const newRevenue = totalSales * 0.1 * (Math.random() + 0.9);

        previousDataRef.current = prevData; // Store previous data before updating
        return [...prevData.slice(1), { time: newTime, revenue: newRevenue }];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalSales]);

  useEffect(() => {
    if (!isMounted) return;

    const width = window.innerWidth * 0.6;
    const height = window.innerHeight * 0.25;

    const margin = {
      top: window.innerHeight * 0.02,
      right: window.innerWidth * 0.09,
      bottom: window.innerHeight * 0.09,
      left: window.innerWidth * 0.09,
    };

    const svg = d3
      .select(barChartContainer.current)
      .selectAll("svg")
      .data([null])
      .join("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const chart = svg
      .selectAll("g")
      .data([null])
      .join("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(dataSet.map((d) => d.time.toISOString()))
      .range([0, width])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(dataSet, (d) => d.revenue) || 0])
      .nice()
      .range([height, 0]);

    chart
      .selectAll(".x-axis")
      .data([null])
      .join("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat((d) => new Date(d).toLocaleTimeString()))
      .selectAll("text")
      .attr("transform", "rotate(0)")
      .style("text-anchor", "center");

    chart
      .selectAll(".y-axis")
      .data([null])
      .join("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));

    const getColor = (currentIndex) => {
      const currentRevenue = dataSet[currentIndex]?.revenue;
      const previousRevenue =
        previousDataRef.current[currentIndex]?.revenue ?? currentRevenue;

      return currentRevenue >= previousRevenue ? "#809485" : "#949081"; // Increase: green, Decrease: red
    };

    const bars = chart.selectAll(".bar").data(dataSet, (d) => d.time.toISOString());

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.time.toISOString()))
      .attr("y", y(0))
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", (_, i) => getColor(i))
      .merge(bars)
      .transition()
      .duration(500)
      .attr("x", (d) => x(d.time.toISOString()))
      .attr("y", (d) => y(d.revenue))
      .attr("height", (d) => height - y(d.revenue))
      .attr("fill", (_, i) => getColor(i));

    bars
      .exit()
      .transition()
      .duration(500)
      .attr("y", y(0))
      .attr("height", 0)
      .remove();

    // Add or update labels
    const labels = chart
      .selectAll(".bar-label")
      .data(dataSet, (d) => d.time.toISOString());

    labels
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => x(d.time.toISOString()) + x.bandwidth() / 2)
      .attr("y", y(0))
      .attr("dy", "-0.5em") // Position above the bar
      .attr("text-anchor", "middle")
      .attr("fill", (_, i) => getColor(i)) // Match the bar color
      .text((d) => `$${d.revenue.toFixed(2)}`)
      .merge(labels)
      .transition()
      .duration(500)
      .attr("x", (d) => x(d.time.toISOString()) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.revenue))
      .attr("fill", (_, i) => getColor(i)) // Match the bar color
      .text((d) => `$${d.revenue.toFixed(2)}`);

    labels.exit().transition().duration(500).attr("y", y(0)).remove();
  }, [dataSet, isMounted]);

  useEffect(() => {
    if (!revenueTextRef.current) return;

    const currentRevenue = dataSet[dataSet.length - 1]?.revenue || 0;

    d3.select(revenueTextRef.current)
      .transition()
      .duration(500)
      .tween("text", function () {
        const i = d3.interpolateNumber(
          parseFloat(this.textContent.replace("$", "")) || 0,
          currentRevenue
        );
        return function (t) {
          this.textContent = `$${i(t).toFixed(2)}`;
        };
      });
  }, [dataSet]);


  if (!isMounted) return null;
  

  return (
    <div className="content relative w-[78.6vw] h-[45vh] text-[#97A8A2] bg-[#40473A] rounded-md p-3 mb-10 flex flex-col">
      <section className="header-section flex justify-between">
        <div className="legends flex flex-col space-y-3">
          <div className="increment flex items-center space-x-3">
            <div className="increment-box rounded-sm h-4 w-4 bg-[#809485]"></div>
            <span>Increase</span>
          </div>
          <div className="decrement flex items-center space-x-3">
            <div className="decrement-box rounded-sm h-4 w-4 bg-[#949081]"></div>
            <span>Decrease</span>
          </div>
        </div>
        <div className="header-text text-[2vw]">Today's Revenue Growth</div>
        <div className="category-total-div space-y-3">
          <div className="category-div flex justify-between space-x-6 items-center border-[#97A8A2] border-2 px-3 rounded-sm">
            <span className="text-[0.8vw] h-fill">Real-Time</span>
            <span className="cursor-pointer">
              <Image src={menuIcon} alt="menu icon" className="w-[1vw]" />
            </span>
          </div>
          <div className="total-div">
            <div className="header-expandicon-div flex justify-between items-center w-[100%]">
              <h6 className="text-[0.8vw] text-[#97A8A2]">Current Revenue</h6>
            </div>
            <div className="screen bg-[#B1C7BF] w-[100%] rounded-sm relative">
              <Image
                src={screenLine}
                alt="Background"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="shadow-2xl"
              />
              <div
                ref={revenueTextRef} // Reference for the revenue text
                className="result relative text-right text-[1vw] px-[1vw] py-[1vw] text-[#40473A] font-semibold"
              >
                $0.00
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        ref={barChartContainer}
        className="d3-bar-chart-container relative flex justify-center"
      ></section>
    </div>
  );
}
