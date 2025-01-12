import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import background from './Assets/background.svg';
import Image from 'next/image';
import useSound from 'use-sound';
import Head from 'next/head';
import { Feature, FeatureCollection } from 'geojson';


// Haversine formula to calculate the distance between two lat/long points
const haversineDistance = (coords1: [number, number], coords2: [number, number]): number => {
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;

  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};


export default function Dashboard() {
  const mapRef = useRef(null);
  const barchartRef = useRef(null);
  const [destination, setDestination] = useState({
    coords: [11.5820, 48.1351], // Munich, Bavaria, Germany
    name: 'Munich, Bavaria',
  });
  const [trips, setTrips] = useState(4); // Initialize trips to 4
  const [canceled, setCanceled] = useState(0);
  const [earnings, setEarnings] = useState(900); // Initialize earnings
  const [isMapActive, setIsMapActive] = useState(true); // State to track which link is active
  const [isDashboardActive, setIsDashboardActive] = useState(false); // State to track which link is active

  const bonus = 80;
  const tips = 40;
  useEffect(() => {
    if (!isMapActive) return; // Don't load map if it's not active
  
    const width = (window.innerWidth * 96) / 100; // 96% of window width
    const height = (window.innerHeight * 45) / 100;
  
    const svg = d3
      .select(mapRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  
    const projection = d3.geoMercator().scale(190).translate([width / 2, height / 1.8]);
    const path = d3.geoPath().projection(projection);
  
    const zoom:any = d3
      .zoom()
      .scaleExtent([1, 10]) // Allow scaling between 1x and 10x
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      });
  
    svg.call(zoom);
  
    const g = svg.append('g');
  
    d3.json('https://d3js.org/world-110m.v1.json').then((data:any) => {
      const countries = topojson.feature(data, data.objects.countries).features;
  
      g.selectAll('path')
      .data(countries)
      .enter()
      .append('path')
      .attr('d', (d: topojson.Feature) => path(d))  // Call path(d) to get the path string
      .attr('fill', '#306FC7')
      .attr('stroke', '#080614')
      .attr('stroke-width', 0.5)
      .on('mouseover', function () {
        d3.select(this).attr('fill', '#4482D9');
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', '#306FC7');
      });
    
      // Add car marker
      const car = g
        .append('circle')
        .attr('r', 5)
        .attr('fill', '#72A2E5');
  
      const route = [
        [2.3522, 48.8566], // Paris
        [12.4964, 41.9028], // Rome
        [13.405, 52.52], // Berlin
        destination.coords, // Current destination
      ];
  
      const carPosition = projection(route[0]);
      car.attr('cx', carPosition![0]).attr('cy', carPosition![1]);
  
      // Slight zoom to car on load
      svg.transition()
        .duration(1500) // Adjust the duration of the zoom effect
        .call(
          zoom.transform,
          d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(2) // Slight zoom
            .translate(-carPosition![0], -carPosition![1])
        );
  
      // Add destination marker
      const triangleSize = 10;
      const drawDestinationMarker = () => {
        g.selectAll('polygon').remove(); // Remove existing marker
        g.selectAll('text').remove(); // Remove existing text
  
        g.append('polygon')
          .attr('points', function () {
            const [x, y] = projection(destination.coords);
            return [
              [x, y - triangleSize].join(','), // Top
              [x - triangleSize, y + triangleSize].join(','), // Bottom Left
              [x + triangleSize, y + triangleSize].join(','), // Bottom Right
            ].join(' ');
          })
          .attr('fill', '#72A2E5')
          .attr('stroke', '#306FC7')
          .attr('stroke-width', 1);
  
        g.append('text')
          .attr('x', projection(destination.coords)[0] + 15)
          .attr('y', projection(destination.coords)[1] - 10)
          .attr('fill', '#72A2E5')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .text(destination.name);
      };
  
      drawDestinationMarker();
  
      // Car movement simulation
      const moveCar = (route, index = 0) => {
        if (index < route.length - 1) {
          const start = projection(route[index]);
          const end = projection(route[index + 1]);
  
          d3.select(car.node())
            .transition()
            .duration(30000) // Adjust speed
            .attrTween('cx', () => d3.interpolate(start![0], end![0]))
            .attrTween('cy', () => d3.interpolate(start![1], end![1]))
            .on('end', () => moveCar(route, index + 1));
        } else {
          // Calculate earnings after trip finishes
          const distance = haversineDistance(route[0], route[route.length - 1]);
          const price = distance * 2;
          setEarnings((prevEarnings) => prevEarnings + price + bonus + tips);
  
          setTrips((prevTrips) => prevTrips + 1); // Increment trips
          setCanceled(Math.floor(Math.random() * 10)); // Simulate canceled trips
  
          // Assign a new destination
          setDestination({
            coords: [Math.random() * 10 + 47, Math.random() * 10 + 10],
            name: `New Destination ${Math.floor(Math.random() * 1000)}`,
          });
        }
      };
  
      // Draw route line
      const routeLine = d3
        .line()
        .x((d) => projection(d)![0])
        .y((d) => projection(d)![1])
        .curve(d3.curveLinear);
  
      g.append('path')
        .datum(route)
        .attr('d', routeLine)
        .attr('stroke', '#72A2E5')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('class', 'route');
  
      moveCar(route); // Start the car movement
    });
  
    return () => {
      svg.remove();
    };
  }, [destination, isMapActive]);
  
  

  useEffect(() => {
    if (!isDashboardActive) return; // Only load bar chart when the dashboard is active
  
    const data = [
      { label: 'January', revenue: 500 },
      { label: 'February', revenue: 700 },
      { label: 'March', revenue: 300 },
      { label: 'April', revenue: 400 },
      { label: 'May', revenue: 800 },
    ];
  
    const width = (window.innerWidth * 96) / 100; // 96% of window width
    const height = (window.innerHeight * 45) / 100; ;

    const margin = { top: 50, right: 30, bottom: 50, left: 40 };
  
    const svg = d3
      .select(barchartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  
    // Add title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .attr('fill', '#306FC7')
      .text('Revenue Growth');
  
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.6);
  
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.revenue)])
      .nice()
      .range([height - margin.bottom, margin.top]);
  
    const xAxis = (g:any) =>
      g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');
  
    const yAxis = (g) =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call((g) => g.select('.domain').remove());
  
    svg
      .append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d) => x(d.label))
      .attr('y', y(0)) // Start at the base of the chart for animation
      .attr('height', 0) // Start with no height for animation
      .attr('width', x.bandwidth())
      .attr('fill', '#306FC7')
      .on('mouseover', function () {
        d3.select(this).attr('fill', '#4482D9');
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', '#306FC7');
      })
      .transition() // Animate the bars
      .duration(1000)
      .attr('y', (d) => y(d.revenue))
      .attr('height', (d) => y(0) - y(d.revenue));
  
    // Add values above bars
    svg
      .append('g')
      .selectAll('text')
      .data(data)
      .join('text')
      .attr('x', (d) => x(d.label)! + x.bandwidth() / 2)
      .attr('y', (d) => y(d.revenue) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#306FC7')
      .attr('font-size', '14px')
      .text((d) => `$${d.revenue}`);
  
    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);
  
    return () => {
      d3.select(barchartRef.current).select('svg').remove();
    };
  }, [isDashboardActive]);
  
  
  const labels = ['Earnings', 'Trips', 'Debit', 'Bonus', 'Tips', 'Canceled']; // Define labels

  const [playSound] = useSound('/click.mp3', {
    volume: 2.0,
    playbackRate: 2.1, // Increase speed (1.5x faster)
    preload: true,
  });
  
  return (
    <>

<Head>
<link href="https://fonts.googleapis.com/css2?family=Jersey+25&display=swap" rel="stylesheet"/>
      </Head>

    <style jsx global>{`
  * {
    cursor: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"%3E%3Cpath fill="none" stroke="%23306FC7" stroke-width="2" d="M5,18h26M18,5l13,13-13,13M18,5l-13,13,13,13"/%3E%3C/svg%3E') 12 12, auto;
  }

  .custom-pointer:hover {
    cursor: pointer;
  }

  .map-link:hover,
  .dashboard-link:hover {
    background-color: #4482d9;
    color: #080614;
  }
  .active-link {
    border: 2px solid #306FC7;
  }

  /* Apply hover effects to the screen divs */
  .screen:hover {
    background-color: #4482d9; /* Blue background on hover */
    color: #080614; /* Dark text on hover */
    transition: all 0.3s ease; /* Smooth transition */
  }

.jersey-25-regular {
  font-family: "Jersey 25", serif;
  font-weight: 400;
  font-style: normal;
}


`}</style>

      <div  className="content jersey-25-regular  overflow-hidden w-[100vw] h-[100vh] bg-[#080614] flex flex-col items-center  text-[#306FC7] relative">
        <section className="top-section flex justify-center">
          <Image
            src={background}
            alt="background image"
            layout="contain"
            quality={100}
            className="absolute z-[2] mt-[-2vw]"
          />

          <div className="content absolute z-[3] w-[96%] flex justify-between">
            <section className="flex flex-col custom-pointer">
              <p className="text-[4.5vw] portrait:text-[9vw]">Cyber Taxi</p>
              <p className="text-[1.6vw] portrait:text-[4vw]">Trip Analysis and Performance</p>

              <section className="screen-section mt-5 portrait:mt-[12vw] portrait:sm:mt-[12vw] grid grid-cols-3 w-[24vw] gap-y-8 portrait:gap-y-5 portrait:gap-x-[36vw]">
  {labels.map((label, index) => (
    <div key={index} className="screen-div custom-pointer">
      <div className="label text-[1vw] portrait:text-[4vw] mb-2">{label}</div>
      <div
        className="screen text-[#4F87D6] bg-[#306FC7] pl-1 bg-opacity-[63%] h-[3vw] w-[6vw] portrait:w-[24vw] portrait:h-[9vw]  rounded-sm text-[1.4vw]  portrait:text-[4vw] flex items-center justify-start overflow-hidden whitespace-nowrap text-ellipsis"
        title={label === 'Trips' ? trips : label === 'Canceled' ? canceled : label === 'Earnings' ? `$${earnings.toFixed(2)}` : label === 'Bonus' ? `$${bonus}` : `$${tips}`}
      >
        {label === 'Trips'
          ? trips
          : label === 'Canceled'
          ? canceled
          : label === 'Earnings'
          ? `$${earnings.toFixed(2)}`
          : label === 'Bonus'
          ? `$${bonus}`
          : `$${tips}`}
      </div>
    </div>
  ))}
</section>

            </section>
            <div className="navigations-div pt-11 portrait:pt-4 space-y-3 h-[21.7vw]  w-[24vw] bg-[#4F87D6] bg-opacity-25 flex flex-col text-[#306FC7] text-[1.4vw] portrait:text-[4vw]">
              <div
                onClick={() => {
                    playSound()
                  setIsMapActive(true);
                  setIsDashboardActive(false);
                }}
                className={`map-link custom-pointer pl-3 w-full h-[3vw] portrait:h-[6vw] bg-[#306FC7] bg-opacity-[12%] flex items-center   ${isMapActive ? 'active-link' : ''}`}
              >
                Map
              </div>
              <div
                onClick={() => {
                    playSound()
                  setIsMapActive(false);
                  setIsDashboardActive(true);
                }}
                className={`dashboard-link custom-pointer pl-3 w-full h-[3vw] portrait:h-[6vw] bg-[#306FC7] bg-opacity-[12%] flex items-center   ${!isMapActive ? 'active-link' : ''}`}
              >
                Dashboard
              </div>
            </div>
          </div>
        </section>

        <section className="bottom-section w-[96%] flex justify-center mt-[24vw] portrait:mt-[80vw] portrait:sm:mt-[70vw] overflow-hidden">
          {isMapActive && (
            <div
              className="map-viz w-full  portrait:h-[100vw] portrait:sm:h-[60vw] border border-[#306FC7] rounded-lg custom-pointer"
              ref={mapRef}
            ></div>
          )}
          {isDashboardActive && (
            <div
              className="barchat-viz w-full h-[21vw] portrait:h-[100vw] portrait:sm:h-[60vw] border border-[#306FC7] rounded-lg custom-pointer"
              ref={barchartRef}
            ></div>
          )}
        </section>
      </div>
    </>
  );
}
