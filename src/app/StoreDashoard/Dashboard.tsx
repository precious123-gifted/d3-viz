"use client"

import ResultScreen from "./Hooks/ResultScreen";
import SideBar from "./Components/SideBar";
import ChartScreen from "./Components/ChartScreen";
import TrafficChannel from "./Components/TrafficChannel";
import { useEffect, useState } from "react";
import {StoreProvider} from "./StoreContext"



export default function Dashboard() {


  


  const [storeSimulation, setStoreSimulation] = useState({
    totalSales: 100000.08,
    totalOrders: 1500,
    totalRefunds: 200,
    visitors: 2500,
    totalProducts: 3000,
    initialProducts: 1000,
    previousTotalProducts: 320,
  });

  
 
  

  useEffect(() => {
    // prompt("The values shown in this Dashboard is a result of a simulation i created")
    const getRandomInRange = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const updateSimulation = () => {
      setStoreSimulation((prev) => {
        const salesIncrement = getRandomInRange(1000, 5000);

        let newTotalSales = prev.totalSales + salesIncrement;
        if (newTotalSales >= 1e7) {
          newTotalSales = parseFloat((prev.totalSales * 0.12).toFixed(2));
        }

        const ordersIncrement = getRandomInRange(3, 12);
        const visitorsIncrement = getRandomInRange(3, 15);
        const isRefundTime = Math.random() < 0.01;
        const refundsIncrement = isRefundTime ? getRandomInRange(0, 3) : 0;

        const newTotalProducts = prev.totalProducts - ordersIncrement;
        const restockedProducts =
          newTotalProducts < 100 ? newTotalProducts + 200 : newTotalProducts;

        return {
          ...prev,
          totalSales: newTotalSales,
          totalOrders: prev.totalOrders + ordersIncrement,
          totalRefunds: prev.totalRefunds + refundsIncrement,
          visitors: prev.visitors + visitorsIncrement,
          previousTotalProducts: prev.totalProducts,
          totalProducts: restockedProducts,

        };
      });
    };

    const simulationInterval = setInterval(updateSimulation, 2000);
    return () => clearInterval(simulationInterval);
  }, []);



    return (
      <StoreProvider>
         <div style={{ textAlign: "center", marginTop: "50px" }} className="landscape:hidden ">
        <h1>This dashboard only works in landscape mode (laptops and desktops).</h1>
        <p>Please rotate your device or switch to a larger screen.</p>
      </div>
      <div className="  bg-[#B7C8C2] h-screen w-screen px-3 py-3 overflow-hidden portrait:hidden">
<section className="top-section   flex justify-between mb-10">
<ResultScreen trigger="Total Sales" storeSimulation={storeSimulation} />
      <ResultScreen trigger="Total Orders" storeSimulation={storeSimulation} />
      <ResultScreen trigger="Total Refunds" storeSimulation={storeSimulation} />
      <ResultScreen trigger="Visitors" storeSimulation={storeSimulation} />
      <ResultScreen trigger="All Products" storeSimulation={storeSimulation} />
  

</section>

<section className="side-bar flex">
<SideBar/>

<div className="chartScreen-trafficChannel-div flex flex-col">
<ChartScreen/>
<TrafficChannel/>

</div>



</section>

      
       
      </div>
      </StoreProvider>
    );
  }