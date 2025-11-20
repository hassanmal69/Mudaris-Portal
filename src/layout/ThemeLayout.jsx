import React from "react";
import { Outlet } from "react-router-dom";

const ThemeLayout = () => {
  return (
    <section className="min-h-screen w-full relative overflow-hidden">
      <div className="relative z-10">
        <Outlet />
      </div>
    </section>
  );
};

export default ThemeLayout;
