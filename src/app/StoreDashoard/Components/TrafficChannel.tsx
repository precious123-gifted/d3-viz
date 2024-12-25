import Image from 'next/image';
import menuIcon from "../assets/menu-icon.png";
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function TrafficChannel() {
  const [directTraffic, setDirectTraffic] = useState(98);
  const [organicTraffic, setOrganicTraffic] = useState(78);
  const [referralTraffic, setReferralTraffic] = useState(60);
  


  const [dataSet, setDataSet] = useState([]);
  const [topChannels, setTopChannels] = useState([
    { name: 'Direct', value: directTraffic, color: '#697F9B' },
    { name: 'Organic', value: organicTraffic, color: '#809485' },
    { name: 'Referral', value: referralTraffic, color: '#8D8A99' }
  ]);

  const chartContainer = useRef(null);

  useEffect(() => {
    // Function to update the traffic channel values
    const interval = setInterval(() => {
      const newDirectTraffic = Math.max(0, Math.min(100, directTraffic + (Math.random() - 0.5) * 5));
      const newOrganicTraffic = Math.max(0, Math.min(100, organicTraffic + (Math.random() - 0.5) * 5));
      const newReferralTraffic = Math.max(0, Math.min(100, referralTraffic + (Math.random() - 0.5) * 5));

      // Calculate the total sum
      const total = newDirectTraffic + newOrganicTraffic + newReferralTraffic;

      // Normalize the values so that they sum to 100%
      const normalizedDirect = (newDirectTraffic / total) * 100;
      const normalizedOrganic = (newOrganicTraffic / total) * 100;
      const normalizedReferral = (newReferralTraffic / total) * 100;

      // Set new traffic values
      setDirectTraffic(normalizedDirect);
      setOrganicTraffic(normalizedOrganic);
      setReferralTraffic(normalizedReferral);

      // Update data set with normalized values
      setDataSet(prev => {
        const newData = [...prev];
        if (newData.length > 10) {
          newData.shift(); // Keep only the last 10 values
        }
        return [...newData, { time: new Date(), direct: normalizedDirect, organic: normalizedOrganic, referral: normalizedReferral }];
      });

      // Sort the channels by traffic value and update the order
      setTopChannels([
        { name: 'Direct', value: normalizedDirect, color: '#697F9B' },
        { name: 'Organic', value: normalizedOrganic, color: '#809485' },
        { name: 'Referral', value: normalizedReferral, color: '#8D8A99' }
      ].sort((a, b) => b.value - a.value)); // Sorting by value, highest first
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [directTraffic, organicTraffic, referralTraffic]);

  useEffect(() => {
    if (dataSet.length > 0) {
      const width = window.innerWidth * 0.4;
      const height = window.innerHeight * 0.15;

      const margin = {
        top: window.innerHeight * 0.02,
        right: window.innerWidth * 0.09,
        bottom: window.innerHeight * 0.09,
        left: window.innerWidth * 0.09,
      };

      const svg = d3
        .select(chartContainer.current)
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

      // X-axis scale based on time
      const x = d3
        .scaleTime()
        .domain(d3.extent(dataSet, (d) => d.time)) // Use the time in the dataset
        .range([0, width]);

      // Y-axis scale for percentage (domain fixed from 0 to 100)
      const y = d3
        .scaleLinear()
        .domain([0, 100]) // Set the Y-axis from 0 to 100% (this ensures no values exceed 100%)
        .range([height, 0]);

      // X-axis rendering with time formatting (HH:mm:ss)
      const xAxisFormat = d3.timeFormat('%H:%M:%S'); // Format time as HH:mm:ss
      chart
        .selectAll(".x-axis")
        .data([null])
        .join("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(xAxisFormat).ticks(d3.timeSecond.every(1))); // Format ticks to show time every second

      // Y-axis rendering with percentage formatting and limiting to 7 ticks
      chart
        .selectAll(".y-axis")
        .data([null])
        .join("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).tickValues([0, 100]).ticks(7)
          .tickFormat(d3.format(".0f")) // Add percentage symbol
          .tickFormat((d) => `${d}%`)) // Add percentage symbol
        .select(".domain") // Remove the line of the Y-axis
        .remove();

      // Line for direct traffic
      const line = d3
        .line()
        .x((d) => x(d.time))
        .y((d) => y(d.direct));

      chart
        .selectAll(".direct-line")
        .data([dataSet])
        .join("path")
        .attr("class", "direct-line")
        .attr("fill", "none")
        .attr("stroke", "#697F9B")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Line for organic traffic
      const lineOrganic = d3
        .line()
        .x((d) => x(d.time))
        .y((d) => y(d.organic));

      chart
        .selectAll(".organic-line")
        .data([dataSet])
        .join("path")
        .attr("class", "organic-line")
        .attr("fill", "none")
        .attr("stroke", "#809485")
        .attr("stroke-width", 2)
        .attr("d", lineOrganic);

      // Line for referral traffic
      const lineReferral = d3
        .line()
        .x((d) => x(d.time))
        .y((d) => y(d.referral));

      chart
        .selectAll(".referral-line")
        .data([dataSet])
        .join("path")
        .attr("class", "referral-line")
        .attr("fill", "none")
        .attr("stroke", "#8D8A99")
        .attr("stroke-width", 2)
        .attr("d", lineReferral);
    }
  }, [dataSet]);

  return (
    <div className="content w-[78.6vw] h-[24.7vh] bg-[#40473A] rounded-md p-3 text-[#97A8A2] flex justify-between">
      <section className="legends flex flex-col space-y-3">
  <span className="text-[1vw] mb-1">Traffic Channels</span>
  <div className="direct flex items-center space-x-3">
    <div className="direct-box rounded-sm h-4 w-4 bg-[#697F9B]"></div>
    <span style={{ color: '#697F9B' }}>Direct</span>
  </div>
  <div className="organic flex items-center space-x-3">
    <div className="organic-box rounded-sm h-4 w-4 bg-[#809485]"></div>
    <span style={{ color: '#809485' }}>Organic</span>
  </div>
  <div className="referral flex items-center space-x-3">
    <div className="referral-box rounded-sm h-4 w-4 bg-[#8D8A99]"></div>
    <span style={{ color: '#8D8A99' }}>Referral</span>
  </div>
</section>


      <section className="d3-line-chart-div flex flex-col w-[60%] items-center">
        <div className="date-div w-[11%] flex justify-between ml-[35vw] items-center border-[#97A8A2] border-2 px-3 rounded-sm">
          <span className="text-[0.8vw] h-fill">Today</span>
          <span className="cursor-pointer">
            <Image src={menuIcon} alt="menu icon" className="w-[1vw]" />
          </span>
        </div>
        <div className="d3-line-chart-container" ref={chartContainer}></div>
      </section>

      <section className="top-channels flex flex-col space-y-3">
  <span className="text-[1vw] mb-1">Top Channel</span>
  {topChannels.map((channel, index) => (
    <div key={index} className={`channel-${index + 1} flex items-center space-x-3`}>
      <div
        className="channel-box rounded-sm h-4 w-4"
        style={{ backgroundColor: channel.color }}
      ></div>
      <span className="text-[0.9vw]" style={{ color: channel.color }}>
        {`${channel.name}: ${channel.value.toFixed(0)}%`}
      </span>
    </div>
  ))}
</section>

    </div>
  );
}
