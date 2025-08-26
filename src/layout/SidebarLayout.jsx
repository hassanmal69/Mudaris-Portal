import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar";
import SidebarMenu from "./sidebar";

const SidebarLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="h-full">
          <SidebarMenu />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default SidebarLayout;
