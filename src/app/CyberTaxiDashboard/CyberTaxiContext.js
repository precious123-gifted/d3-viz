// import React, { createContext, useContext, useState, useEffect } from "react";

// // Create the Context
// const StoreContext = createContext();

// // Custom hook to use the StoreContext
// export const useStore = () => {
//   return useContext(StoreContext);
// };

// // Provider Component
// export const StoreProvider = ({ children }) => {
  
//   const [storeSimulation, setStoreSimulation] = useState({
//     totalSales: 100000.08,
//     totalOrders: 1500,
//     totalRefunds: 200,
//     visitors: 2500,
//     totalProducts: 3000,
//     initialProducts: 1000,
//     previousTotalProducts: 320,
//   });

//   useEffect(() => {
//     const getRandomInRange = (min, max) =>
//       Math.floor(Math.random() * (max - min + 1)) + min;

//     const updateSimulation = () => {
//       setStoreSimulation((prev) => {
//         const salesIncrement = getRandomInRange(1000, 5000);
//         let newTotalSales = prev.totalSales + salesIncrement;

//         if (newTotalSales >= 1e7) {
//           newTotalSales = parseFloat((prev.totalSales * 0.12).toFixed(2));
//         }

//         const ordersIncrement = getRandomInRange(3, 12);
//         const visitorsIncrement = getRandomInRange(3, 15);
//         const isRefundTime = Math.random() < 0.01;
//         const refundsIncrement = isRefundTime ? getRandomInRange(0, 3) : 0;
//         const newTotalProducts = prev.totalProducts - ordersIncrement;
//         const restockedProducts =
//           newTotalProducts < 100 ? newTotalProducts + 200 : newTotalProducts;

//         return {
//           ...prev,
//           totalSales: newTotalSales,
//           totalOrders: prev.totalOrders + ordersIncrement,
//           totalRefunds: prev.totalRefunds + refundsIncrement,
//           visitors: prev.visitors + visitorsIncrement,
//           previousTotalProducts: prev.totalProducts,
//           totalProducts: restockedProducts,
//         };
//       });
//     };

//     const simulationInterval = setInterval(updateSimulation, 2000);
//     return () => clearInterval(simulationInterval);
//   }, []);

//   return (
//     <StoreContext.Provider value={{ storeSimulation, setStoreSimulation }}>
//       {children}
//     </StoreContext.Provider>
//   );
// };
