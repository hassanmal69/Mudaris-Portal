import { computePosition, flip, shift } from "@floating-ui/dom";
import { posToDOMRect, ReactRenderer } from "@tiptap/react";
import { MentionList } from "./MentionList.jsx";
import { supabase } from "@/services/supabaseClient.js";
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

      const { data, error } = await supabase
        .from("workspace_members")
        .select(
          `
        profiles: user_id(
        id, full_name
        )
        `
        )
        .eq("workspace_id", workspaceId);

      // for debigging
      const items = (data || [])
        .map((m) => ({
          id: m.profiles.id,
          label: m.profiles.full_name,
        }))

        .filter((user) => {
          if (!query) return [];

          user.label.toLowerCase().includes(query.toLowerCase());
        })
        .slice(0, 5);

      if (error) {
        console.error("Error fetching mention items:", error);
        return [];
      }

      return (data || [])
        .filter((m) => m.profiles && m.profiles.full_name) // ensure safe
        .map((m) => ({
          id: m.profiles.id,
          label: m.profiles.full_name,
          avatar: m.profiles.avatar_url,
        }))
        .filter((user) =>
          user.label.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);
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
