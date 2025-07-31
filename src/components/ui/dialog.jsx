import * as React from "react";

const DialogContext = React.createContext({ onOpenChange: () => {} });

export function Dialog({ open, onOpenChange, children }) {
  return open ? (
    <DialogContext.Provider value={{ onOpenChange }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div
          className="fixed inset-0 z-40"
          aria-hidden="true"
          onClick={() => onOpenChange(false)}
        />
        <div
          className="relative z-50 w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  ) : null;
}

export function DialogContent({ className = "", children }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return (
    <h2 className="text-lg text-[#556cd6] font-semibold leading-tight">
      {children}
    </h2>
  );
}

export function DialogClose({ asChild = false, children }) {
  const { onOpenChange } = React.useContext(DialogContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        if (children.props.onClick) children.props.onClick(e);
        onOpenChange(false);
      },
    });
  }
  return (
    <button
      type="button"
      className="absolute right-2 top-2 text-gray-400 hover:text-gray-700"
      aria-label="Close"
      onClick={() => onOpenChange(false)}
    >
      ×
    </button>
  );
}
