// AppRouter.tsx
import React from "react";
import 
import Dashboard from "./StoreDashoard/Dashboard";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Define your routes */}
        <Route path="/" element={<Navigate to="/store-dashboard" />} />
        <Route path="/store-dashboard" element={<Dashboard/>} />
        <Route path="/cyber-truck-dashboard" element={<CyberTruckDashboard />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
