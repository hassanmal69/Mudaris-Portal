import React from "react";
import { Outlet } from "react-router-dom";

const ThemeLayout = ({ children }) => {
  return (
    <section className="min-h-screen w-full relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 w-full h-full pointer-events-none"
        // style={{
        //   background:
        //     "radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b092b 100%)",
        // }}
      />
      <div className="relative z-10">
        <Outlet />
      </div>
    </section>
  );
};

export default ThemeLayout;
