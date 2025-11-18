import { computePosition, flip, shift } from "@floating-ui/dom";
import { posToDOMRect, ReactRenderer } from "@tiptap/react";
import { MentionList } from "./MentionList.jsx";
import {
  selectWorkspaceMembers,
  fetchWorkspaceMembers,
} from "@/redux/features/workspaceMembers/WorkspaceMembersSlice.js";
import { store } from "@/redux/app/store.js";

const updatePosition = (editor, element) => {
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(
        editor.view,
        editor.state.selection.from,
        editor.state.selection.to
      ),
  };

  computePosition(virtualElement, element, {
    placement: "bottom-start",
    strategy: "absolute",
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = "max-content";
    element.style.position = strategy;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  });
};

export default {
  // asynchronous suggestion
  items: async ({ query, editor }) => {
    try {
      const workspaceId = editor.options.workspaceId;

      // Fetch from Redux (with caching)
      let members = selectWorkspaceMembers(workspaceId)(store.getState());
      if (!members.length) {
        await store.dispatch(fetchWorkspaceMembers(workspaceId));
        members = selectWorkspaceMembers(workspaceId)(store.getState());
      }
      console.log("members bhi check lazmi hain", members);
      // members shape: [{ user_id, profiles: { id, full_name, avatar_url } }]
      const filteredMembers = members
        .filter((m) => m.user_profiles && m.user_profiles.full_name)
        .map((m) => ({
          id: m.user_id,
          label: m.user_profiles.full_name,
          avatar: m.user_profiles.avatar_url,
          email: m.user_profiles.email,
        }))
        .filter((user) =>
          query ? user.label.toLowerCase().includes(query.toLowerCase()) : true
        )
        .slice(0, 5);
      return filteredMembers;
    } catch (error) {
      console.error("Mention items error:", error);
      return [];
    }
  },

  render: () => {
    let reactRenderer;

    return {
      onStart: (props) => {
        if (!props.clientRect) {
          return;
        }

        reactRenderer = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        reactRenderer.element.style.position = "absolute";

        document.body.appendChild(reactRenderer.element);

        updatePosition(props.editor, reactRenderer.element);
      },

      onUpdate(props) {
        reactRenderer.updateProps(props);

        if (!props.clientRect) {
          return;
        }
        updatePosition(props.editor, reactRenderer.element);
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          reactRenderer.destroy();
          reactRenderer.element.remove();

          return true;
        }

        return reactRenderer.ref?.onKeyDown(props);
      },

      onExit() {
        reactRenderer.destroy();
        reactRenderer.element.remove();
      },
    };
  },
};
