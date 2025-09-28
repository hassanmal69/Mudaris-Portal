import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Channelinvitation = ({
  channels,
  setChannels,
  suggestedChannels,
  onBack,
  onSend,
}) => {
  const [search, setSearch] = useState("");
  const handleToggle = (channel) => {
    if (channels.includes(channel.id)) {
      setChannels(channels.filter((c) => c !== channel.id));
    } else {
      setChannels([...channels, channel.id]);
    }
  };
  const filteredSuggested = suggestedChannels.filter(
    (c) =>
      c.visibility === "private" &&
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-1">
          Add to team channels (optional)
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Make sure your teammates are in the right conversation from the
          get-go.
        </p>
        <div className="mb-2">
          <span className="block text-xs font-medium mb-1">
            Suggested channels
          </span>
          <div className="flex flex-wrap gap-2">
            {filteredSuggested.map((channel) => (
              <button
                key={channel.id}
                type="button"
                className={`px-2 py-1 rounded text-xs border ${
                  channels.includes(channel.id)
                    ? "bg-[#556cd6] text-white border-[#556cd6]"
                    : " text-gray-400 border-[#111]"
                }`}
                onClick={() => handleToggle(channel)}
                aria-pressed={channels.includes(channel.id)}
              >
                {channel.name}
              </button>
            ))}
          </div>
        </div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search channels"
          className="mt-2 outline-none border-[#111]"
        />
      </div>
      <div className="flex gap-2 justify-between">
        <Button type="button" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          className="bg-green-950 hover:bg-green-900"
          onClick={onSend}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Channelinvitation;
