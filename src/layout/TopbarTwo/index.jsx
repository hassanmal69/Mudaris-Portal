import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import Profile from "@/pages/profile";
import { useParams } from "react-router-dom";
import { Calendar, Globe, Lock, Search, Siren } from "lucide-react";
import Members from "../topbar/members/index.jsx";
import { Link as MoizChain, Megaphone } from "lucide-react";
import "../topbar/topbar.css";
import { Notifications } from "../topbar/notification/index.jsx";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PersonIcon } from "@radix-ui/react-icons";
const TopbarTwo = ({ name, desc }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 860);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 860);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <section
      className="top-0 w-full bg-(--background) z-20 py-3 border border-(--border) md:px-6 shadow-2xl flex items-center justify-between topbar-container"
      style={{ minHeight: "56px" }}
    >
      {isMobile && (
        <div className="p-2">
          <SidebarTrigger className="text-white border border-white rounded p-2">
            <span>☰</span>
          </SidebarTrigger>
        </div>
      )}

      <div className="flex text-white flex-col min-w-0">
        <span className="flex gap-2">
          {name === "LecturesLink" ? (
            <MoizChain className="w-5" />
          ) : name === "Announcements" ? (
            <Megaphone className="w-5" />
          ) : (
            name === "Economic Calender" && <Calendar className="w-5" />
          )}
          <h2 className="text-(--foreground) text-[18px] font-medium flex gap-1 items-center">
            {name}
          </h2>
        </span>

        <p className="text-[12px] text-(--accent-foreground)">{desc}</p>
      </div>

      <div className="flex items-center gap-2 min-h-0 ">
        <Notifications />
        <Profile />
      </div>
    </section>
  );
};

export default TopbarTwo;
