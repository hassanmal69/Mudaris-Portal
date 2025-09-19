import "./MentionList.scss";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const MentionList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item.id, label: item.label });
    }
  };
  const fallbackColors = [
    "bg-rose-200",
    "bg-sky-200",
    "bg-emerald-200",
    "bg-amber-200",
    "bg-violet-200",
    "bg-fuchsia-200",
  ];
  const getUserFallback = (name, idx) => {
    // pick a color based on user id or index
    const color = fallbackColors[idx % fallbackColors.length];

    return (
      <Avatar className="w-7 h-7 border-2 border-white rounded-sm flex items-center justify-center">
        <AvatarFallback
          className={`text-[#333]  text-sm rounded-none font-semibold ${color}`}
        >
          {name?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  };
  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="dropdown-menu z-50">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={
              index === selectedIndex ? "is-selected mention-items" : ""
            }
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="flex gap-1 items-center ">
              {item.avatar_url ? (
                <Avatar className="w-5 h-5">
                  <AvatarImage src={item.avatar_url} alt={item.full_name} />
                </Avatar>
              ) : (
                getUserFallback(item.label, index)
              )}
              <div className="flex flex-col gap-0">
                <h2 className="font-bold text-[#eee]">{item.label}</h2>
                <p className="text-[#ddd] text-[9px] ">{item.email}</p>
              </div>
            </div>
          </button>
        ))
      ) : (
        <div className="item">No result</div>
      )}
    </div>
  );
});
