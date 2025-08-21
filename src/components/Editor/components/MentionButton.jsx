export default function MentionButton({ editor }) {
  return (
    <button
      type="button"
      title="mention"
      onClick={() => {
        if (!editor) return;
        const { from, to } = editor.state.selection;
        editor.view.dispatch(editor.state.tr.insertText("@", from, to));
        editor.commands.focus();
      }}
    >
      <span role="img" aria-label="mention">
        @
      </span>
    </button>
  );
}
