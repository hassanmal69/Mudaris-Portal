function groupReactions(reactions) {
  const grouped = {};
  reactions?.forEach((r) => {
    if (!grouped[r.reaction_type]) grouped[r.reaction_type] = [];
    grouped[r.reaction_type].push(r.user_id);
  });
  return grouped;
}

const Reactions = ({ reactions, currentUserId, onReact }) => {
  const grouped = groupReactions(reactions);
  return (
    <div className="flex gap-1 mt-1 flex-wrap">
      {Object.entries(grouped).map(([emoji, userIds]) => {
        const reacted = userIds.includes(currentUserId);
        return (
          <button
            key={emoji}
            className={`px-2 py-1 rounded flex items-center gap-1 border text-sm ${reacted
                ? "bg-blue-100 border-blue-400"
                : "bg-gray-100 border-gray-300"
              }`}
            onClick={() =>{ console.log('emoji');
               onReact(emoji)}
            }
            title={reacted ? "Remove your reaction" : "React with this emoji"}
            type="button"
          >
            <span style={{ fontSize: "1.2em" }}>{emoji}</span>
            <span>{userIds.length}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Reactions;