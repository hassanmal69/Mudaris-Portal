import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Toolbar from "./components/toolbar/Toolbar.jsx";
import { Send } from "lucide-react";
import { clearValue } from "@/redux/features/ui/fileSlice.js";
import { supabase } from "@/services/supabaseClient.js";
import { useCallback, useEffect } from "react";
import useEditorActions from "./common.js";
export default function TextEditor({ editor, toolbarStyles }) {
  const { handleSubmit } = useEditorActions(editor);

  return (
    <div className="control-group relative border-b border-(--border)">
      <Toolbar editor={editor} toolbarStyles={toolbarStyles} />
      <button
        className="kumar relative z-40
        transition-colors duration-300 delay-150
      "
        onClick={handleSubmit}
      >
        <Send
          className=" w-5 h-5 text-(--secondary-foreground) hover:text-(--success)
        transition-colors duration-300 delay-150
        "
        />
      </button>
    </div>
  );
}
