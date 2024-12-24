import expandIcon from "../assets/expand-icon.png";
import screenLine from "../assets/screen-line.png";
import menuIcon from "../assets/menu-icon.png";
import arrowUpIcon from "../assets/arrow-up.png";
import Image from "next/image";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useStore } from "../StoreContext";

function ResultScreen({ trigger }) {
  const { storeSimulation } = useStore();

  const valueRef = useRef();
  const percentageRef = useRef();

  // Function to handle different triggers
  const getResultData = () => {
    switch (trigger) {
      case "Total Sales":
        return {
          header: "Total Sales",
          value: storeSimulation.totalSales,
          percentage: (storeSimulation.totalSales / (storeSimulation.totalSales + storeSimulation.totalRefunds)) * 100,
          difference: storeSimulation.totalSales * 0.12,
        };
      case "Total Orders":
        return {
          header: "Total Orders",
          value: storeSimulation.totalOrders,
          percentage: (storeSimulation.totalOrders / storeSimulation.visitors) * 100,
          difference: storeSimulation.totalOrders * 0.1,
        };
      case "Total Refunds":
        return {
          header: "Total Refunds",
          value: storeSimulation.totalRefunds,
          percentage: (storeSimulation.totalRefunds / (storeSimulation.totalSales + storeSimulation.totalRefunds)) * 100,
          difference: -storeSimulation.totalRefunds * 0.05,
        };
      case "Visitors":
        return {
          header: "Visitors",
          value: storeSimulation.visitors,
          percentage: (storeSimulation.totalOrders / storeSimulation.visitors) * 100,
          difference: storeSimulation.visitors * 0.1,
        };
      case "All Products":
        return {
          header: "All Products",
          value: storeSimulation.totalProducts,
          percentage: (storeSimulation.totalProducts / storeSimulation.initialProducts) * 100,
          difference: storeSimulation.totalProducts - storeSimulation.previousTotalProducts,
        };
      default:
        return {
          header: "Unknown",
          value: 0,
          percentage: 0,
          difference: 0,
        };
    }
  };

  const { header, value, percentage, difference } = getResultData();

  // Animate number updates using D3
  useEffect(() => {
    // Animate the value
    d3.select(valueRef.current)
      .transition()
      .duration(1000)
      .tween("text", function () {
        const interpolate = d3.interpolateNumber(+this.textContent.replace(/[^\d.]/g, ""), value);
        return function (t) {
          this.textContent = `$${Math.round(interpolate(t)).toLocaleString()}`;
        };
      });

    // Animate the percentage
    d3.select(percentageRef.current)
      .transition()
      .duration(1000)
      .tween("text", function () {
        const interpolate = d3.interpolateNumber(+this.textContent.replace(/[^\d.]/g, ""), percentage);
        return function (t) {
          this.textContent = `${interpolate(t).toFixed(2)}%`;
        };
      });
  }, [value, percentage]);

  return (
    <div className="content bg-[#40473A] w-[18vw]  rounded-md px-3 py-3 relative flex justify-between items-end">
      <section className="left-section w-[50%] space-y-1">
        <div className="header-expandicon-div flex justify-between items-center w-[100%]">
          <h6 className="text-[1vw] text-[#97A8A2]">{header}</h6>
          <span className="cursor-pointer">
            <Image src={expandIcon} alt="expandable icon" className="w-[0.8vw]" />
          </span>
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
            className="result relative text-right text-[1.3vw] pr-[1vw] py-[1vw] text-[#40473A] font-semibold"
            ref={valueRef}
          >
            ${value.toLocaleString()}
          </div>
        </div>
      </section>

      <section className="text-[#97A8A2] right-section w-[40%] flex flex-col space-y-3">
        <div className="date-div flex justify-between items-center border-[#97A8A2] border-2 px-3 rounded-sm">
          <span className="text-[1vw] h-fill">Today</span>
          <span className="cursor-pointer">
            <Image src={menuIcon} alt="menu icon" className="w-[1vw]" />
          </span>
        </div>

        <div className="percentage-div text-[1vw] text-[#8BB58D]">
          <div className="percent flex justify-between items-center">
            <span>
              <Image src={arrowUpIcon} alt="arrow icon" className="w-[0.8vw]" />
            </span>
            <span className="flex items-end text-end" ref={percentageRef}>
              {percentage.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="amount-div w-full text-[1vw] text-[#97A8A2] flex items-start">
          <span className="w-full text-end">{difference >= 0 ? `+${difference.toLocaleString()}` : difference.toLocaleString()}</span>
        </div>
      </section>
    </div>
  );
}

export default ResultScreen;
