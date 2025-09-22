import { Input } from "@/components/ui/input";
import React, { useState } from "react";

const AddavatarInWS = ({ state, setState }) => {
  const [preview, setPreview] = useState(state.avatarUrl || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setState((prev) => ({
          ...prev,
          avatarUrl: reader.result,
          avatarFile: file,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setState((prev) => ({ ...prev, avatarUrl: "", avatarFile: null }));
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-black gap-4">
      <h2 className="text-lg font-semibold">Add avatar for workspace</h2>

      <Input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Workspace Avatar Preview"
            className="w-32 h-32 rounded-full object-cover border"
          />
        </div>
      )}
    </div>
  );
};

export default AddavatarInWS;
