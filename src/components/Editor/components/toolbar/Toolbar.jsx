import React from "react";
import FileUploader from "@/components/Editor/components/toolbar/files";
import { toolbarButtons } from "../../config/toolbarButtons";
import EmojiButton from "../EmojiButton.jsx";
import MentionButton from "../MentionButton.jsx";
import AudioRecording from "@/components/Editor/components/toolbar/audio";
import VideoRecording from "@/components/Editor/components/toolbar/video";
import { Button } from "@/components/ui/button";
export default function Toolbar({ editor, toolbarStyles }) {
  if (!editor) return null;

  return (
    <div className="toolbar flex flex-wrap justify-between">
      <div className="flex items-center gap-1">
        {toolbarButtons.map(
          ({ name, icon: Icon, action, isActive, canRun }, index) => (
            <React.Fragment key={name}>
              <Button
                variant={"ghost"}
                onClick={() => action(editor)}
                disabled={canRun && !canRun(editor)}
                className={isActive && isActive(editor) ? "is-active" : ""}
                title={name}
              >
                <Icon style={toolbarStyles} />
              </Button>

              {index === 2 && (
                <div className="h-6 w-px bg-(--border) mx-2"></div>
              )}
            </React.Fragment>
          )
        )}
      </div>

      {/* <EmojiButton editor={editor} toolbarStyles={toolbarStyles} /> */}
      <div className="flex items-center gap-0 mx-3">
        <MentionButton editor={editor} toolbarStyles={toolbarStyles} />
        <AudioRecording toolbarStyles={toolbarStyles} />
        <FileUploader toolbarStyles={toolbarStyles} />
      </div>
    </div>
  );
}
