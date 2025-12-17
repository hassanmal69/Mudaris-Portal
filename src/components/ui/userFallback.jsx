// custom user fallback component
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fallbackColors } from "@/constants/fallbackColors";
const UserFallback = React.memo(({ name, _idx, cn, avatarCn }) => {
  const color = fallbackColors[_idx % fallbackColors.length];
  return (
    <Avatar
      className={`w-7 h-7 border-2 rounded-md border-(--border) flex items-center justify-center ${cn}`}
    >
      <AvatarFallback
        className={`text-(-${color})  text-sm  font-semibold ${color} ${avatarCn}`}
      >
        {name?.[0]?.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
});

export default UserFallback;
