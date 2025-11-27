import React from "react";
export const ChannelStepIndicator = ({ step, steps }) => (
  <div className="flex items-center gap-2 mb-2">
    {steps.map((label, idx) => (
      <React.Fragment key={label}>
        <div
          className={`w-2 h-2 rounded-full ${
            step >= idx ? "bg-(--chart-1)" : "bg-(--muted)"
          }`}
        ></div>
        {idx < steps.length - 1 && (
          <div className="flex-1 h-0.5 bg-(--secondary)" />
        )}
      </React.Fragment>
    ))}
  </div>
);
