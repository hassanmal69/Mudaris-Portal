import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchPinnedMessages } from "@/features/messages/pin/pinSlice";
const PinnedMessages = ({ channelId, userId }) => {
  const dispatch = useDispatch();
  const pinnedState = useSelector((state) => state.pinnedMessages);
  const { items, loading } = pinnedState || {};
  useEffect(() => {
    dispatch(fetchPinnedMessages(channelId));
  }, [channelId, dispatch]);

  console.log("items", { items });
  return (
    <section>
      {loading && <p>Loading...</p>}

      {items.map((m, _i) => (
        <div key={_i} className="relative">
          <div
            key={m?.id}
            className="text-[#c7c7c7]"
            dangerouslySetInnerHTML={{ __html: m.messages.content }}
          />
        </div>
      ))}
    </section>
  );
};

export default PinnedMessages;
