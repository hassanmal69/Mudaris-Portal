import React from "react";

const WorkspaceStepIndicator = ({ step, steps }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      {steps.map((label, idx) => (
        <React.Fragment key={label}>
          <div
            className={`w-2 h-2 rounded-full ${
              step >= idx ? "bg-[#556cd6]" : "bg-gray-300"
            }`}
          ></div>
          {idx < steps.length - 1 && (
            <div className="flex-1 h-0.5 bg-gray-200" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WorkspaceStepIndicator;
