// custom user fallback component
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fallbackColors } from "@/constants/fallbackColors";
const UserFallback = React.memo(({ name, _idx }) => {
  const color = fallbackColors[_idx % fallbackColors.length];
  return (
    <Avatar className="w-7 h-7 border-2 border-white rounded-sm flex items-center justify-center">
      <AvatarFallback
        className={`text-[#2b092b]  text-sm rounded-none font-semibold ${color}`}
      >
        {name?.[0]?.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}, []);

export default UserFallback;
