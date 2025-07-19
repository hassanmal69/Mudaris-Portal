import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const CreateWorkspace = ({ onClose }) => {
  const [workspaceName, setWorkspaceName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Workspace Name:', workspaceName);
    onClose(); 
  };

  return (
    <div className="fixed pointer-events-auto inset-0 z-130 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-white/30 backdrop-blur-lg shadow-xl border border-white/20 text-gray-900">

        {/* Content */}
        <h2 className="text-2xl font-bold mb-4 text-center text-[#4d3763]">
          Create New Workspace
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="workspaceName" className="block text-sm font-medium mb-1">
              Workspace Name
            </label>
            <input
              type="text"
              id="workspaceName"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/60 text-gray-900 placeholder-gray-500 outline-none border border-gray-300 focus:ring-2 focus:ring-[#4d3763]"
              placeholder="e.g. Marketing Team"
            />
          </div>

          <Button type="submit" className="w-full bg-[#4d3763] text-white hover:bg-[#3b2a50]">
            Create Workspace
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspace;
