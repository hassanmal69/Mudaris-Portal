import { Button } from "@/components/ui/button";

export default function MentionButton({ editor }) {
  return (
    <Button
      type="button"
      title="mention"
      onClick={() => {
        if (!editor) return;
        const { from, to } = editor.state.selection;
        editor.view.dispatch(editor.state.tr.insertText("@", from, to));
        editor.commands.focus();
      }}
    >
      <span
        role="img"
        aria-label="mention"
        className={"text-[18px] p-0 text-(--primary-foreground)"}
      >
        @
      </span>
    </Button>
  );
}
