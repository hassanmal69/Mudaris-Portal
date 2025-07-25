import * as React from "react"

// --- Lib ---
import { parseShortcutKeys } from "@/lib/tiptap-utils"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

import {
  EMOJI_TRIGGER_SHORTCUT_KEY,
  useEmojiTrigger,
} from "@/components/tiptap-ui/emoji-trigger-button"

import { Button } from "@/components/tiptap-ui-primitive/button"
import { Badge } from "@/components/tiptap-ui-primitive/badge"

export function EmojiTriggerShortcutBadge({
  shortcutKeys = EMOJI_TRIGGER_SHORTCUT_KEY
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for adding emoji trigger in a Tiptap editor.
 *
 * For custom button implementations, use the `useEmojiTrigger` hook instead.
 */
export const EmojiTriggerButton = React.forwardRef((
  {
    editor: providedEditor,
    node,
    nodePos,
    text,
    trigger = ":",
    hideWhenUnavailable = false,
    onTriggerApplied,
    showShortcut = false,
    onClick,
    children,
    ...buttonProps
  },
  ref
) => {
  const { editor } = useTiptapEditor(providedEditor)
  const {
    isVisible,
    canAddTrigger,
    handleAddTrigger,
    label,
    shortcutKeys,
    Icon,
  } = useEmojiTrigger({
    editor,
    node,
    nodePos,
    trigger,
    hideWhenUnavailable,
    onTriggerApplied,
  })

  const handleClick = React.useCallback((event) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    handleAddTrigger()
  }, [handleAddTrigger, onClick])

  if (!isVisible) {
    return null
  }

  return (
    <Button
      type="button"
      data-style="ghost"
      role="button"
      tabIndex={-1}
      disabled={!canAddTrigger}
      data-disabled={!canAddTrigger}
      aria-label={label}
      tooltip="Add emoji"
      onClick={handleClick}
      {...buttonProps}
      ref={ref}>
      {children ?? (
        <>
          <Icon className="tiptap-button-icon" />
          {text && <span className="tiptap-button-text">{text}</span>}
          {showShortcut && (
            <EmojiTriggerShortcutBadge shortcutKeys={shortcutKeys} />
          )}
        </>
      )}
    </Button>
  );
})

EmojiTriggerButton.displayName = "EmojiTriggerButton"
