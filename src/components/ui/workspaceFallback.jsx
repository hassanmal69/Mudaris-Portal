import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fallbackColors } from "@/constants/fallbackColors";
const WorkspaceFallback = React.memo(({ name, _idx }) => {
  const color = fallbackColors[_idx % fallbackColors.length];
  return (
    <Avatar
      className={`w-16 h-16 rounded-sm  flex items-center justify-center`}
    >
      <AvatarFallback
        className={`text-[#2b092b] ${color} rounded-none text-xl font-bold`}
      >
        {name?.[0]?.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
});

export default WorkspaceFallback;
