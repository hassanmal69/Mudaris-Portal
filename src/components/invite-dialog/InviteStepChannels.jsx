import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const InviteStepChannels = ({
  channels,
  setChannels,
  suggestedChannels,
  onCopyLink,
  onBack,
  onSend,
}) => {
  const [search, setSearch] = useState("");

  const handleToggle = (channel) => {
    if (channels.includes(channel)) {
      setChannels(channels.filter((c) => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  const filteredSuggested = suggestedChannels.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
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
                key={channel}
                type="button"
                className={`px-2 py-1 rounded text-xs border ${
                  channels.includes(channel)
                    ? "bg-[#556cd6] text-white border-[#556cd6]"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
                onClick={() => handleToggle(channel)}
                aria-pressed={channels.includes(channel)}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search channels"
          className="mt-2"
        />
      </div>
      <div className="flex gap-2 justify-between">
        <Button type="button" variant="secondary" onClick={onCopyLink}>
          Copy link
        </Button>
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onSend}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default InviteStepChannels;
