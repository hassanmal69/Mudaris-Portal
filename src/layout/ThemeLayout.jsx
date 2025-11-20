import React from "react";
import { Outlet } from "react-router-dom";

const ThemeLayout = () => {
  return (
    <section className=" bg-(--background) overflow-hidden">
      <Outlet />
    </section>
  );
};

export default ThemeLayout;
