import { useState } from "react";
import { Paperclip } from "lucide-react";
import { addValue } from "@/redux/features/ui/fileSlice";
import { useDispatch } from "react-redux";

export default function FileUploader({ toolbarStyles }) {
  const [preview, setPreview] = useState("");
  let filePath = "";
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      const fileName = file.name;
      console.log(file);
      if (file.type.startsWith("image/")) {
        filePath = `pictures/sent/${fileName}`;
      } else if (file.type.startsWith("video/")) {
        filePath = `video/recorded/${fileName}`;
      } else if (file.type === "application/pdf") {
        filePath = `pdf/${fileName}`;
      }
      dispatch(
        addValue({
          fileLink: previewUrl,
          file: file,
          fileType: file.type,
          filePath: filePath,
        })
      );
    }
  };
  return (
    <div className="flex items-center space-x-2">
      <input
        onChange={handleChange}
        type="file"
        id="fileInput"
        hidden
        accept="image/*,video/mp4,application/pdf"
      />

      <label htmlFor="fileInput">
        <Paperclip
          className="
          text-(--primary-foreground)
        
        h-4 w-4"
          style={toolbarStyles}
        />
      </label>
    </div>
  );
}
