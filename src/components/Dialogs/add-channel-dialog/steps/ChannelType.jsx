import React from "react";
import { Button } from "@/components/ui/button";
import { Globe, Lock, Users } from "lucide-react";
const ChannelType = ({ state, setState }) => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-2">
      <Button
        type="button"
        className={`
          w-[48%]
          ${
            state.visibility === "public"
              ? "bg-(--primary) text-(--primary-foreground) hover:bg-(--secondary)"
              : "text-(--primary-foreground)"
          }
        `}
        onClick={() => setState({ ...state, visibility: "public" })}
        aria-pressed={state.visibility === "public"}
      >
        <Users className="w-4 h-4 mr-2" />
        Public
      </Button>
      <Button
        type="button"
        className={`flex-1 bg-(--muted)
          ${state.visibility === "private" ? "bg-(--primary)" : ""}
        hover:bg-(--secondary) text-(--secondary-foreground)`}
        onClick={() => setState({ ...state, visibility: "private" })}
        aria-pressed={state.visibility === "private"}
      >
        <Lock className="w-4 h-4 mr-2" />
        Private
      </Button>
    </div>
    <p className="text-xs text-gray-500">
      Public channels are visible to everyone. Private channels are invite-only.
    </p>
  </div>
);

export default ChannelType;
