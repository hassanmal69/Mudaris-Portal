"use client";
import * as React from "react"
import { useHotkeys } from "react-hotkeys-hook"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Lib ---
import {
  findNodePosition,
  isNodeTypeSelected,
  isValidPosition,
} from "@/lib/tiptap-utils"

// --- Icons ---
import { SmilePlusIcon } from "@/components/tiptap-icons/smile-plus-icon"

export const EMOJI_TRIGGER_SHORTCUT_KEY = "mod+shift+e"

/**
 * Checks if emoji trigger can be added in the current editor state
 */
export function canAddEmojiTrigger(editor) {
  if (!editor || !editor.isEditable) return false
  if (isNodeTypeSelected(editor, ["image"])) return false

  return true
}

/**
 * Inserts a trigger in a block node at a specified position or after the current selection
 */
function insertTriggerInBlockNode(editor, trigger, node, nodePos) {
  if ((node !== undefined && node !== null) || isValidPosition(nodePos)) {
    const foundPos = findNodePosition({
      editor,
      node: node || undefined,
      nodePos: nodePos || undefined,
    })

    if (!foundPos) {
      return false
    }

    const isEmpty =
      foundPos.node.type.name === "paragraph" &&
      foundPos.node.content.size === 0
    const posAndNodeSize = foundPos.pos + foundPos.node.nodeSize

    return editor
      .chain()
      .insertContentAt(isEmpty ? foundPos.pos : posAndNodeSize, {
        type: "paragraph",
        content: [{ type: "text", text: trigger }],
      })
      .focus(isEmpty ? foundPos.pos + 2 : posAndNodeSize + trigger.length + 1)
      .run();
  }

  const { $from } = editor.state.selection

  return editor
    .chain()
    .insertContentAt($from.after(), {
      type: "paragraph",
      content: [{ type: "text", text: trigger }],
    })
    .focus()
    .run();
}

/**
 * Inserts a trigger in a text node at the current selection
 */
function insertTriggerInTextNode(editor, trigger, node, nodePos) {
  if ((node !== undefined && node !== null) || isValidPosition(nodePos)) {
    const foundPos = findNodePosition({
      editor,
      node: node || undefined,
      nodePos: nodePos || undefined,
    })

    if (!foundPos) {
      return false
    }

    const isEmpty =
      foundPos.node.type.name === "paragraph" &&
      foundPos.node.content.size === 0
    const posAndNodeSize = foundPos.pos + foundPos.node.nodeSize

    editor.view.dispatch(editor.view.state.tr
      .scrollIntoView()
      .insertText(
      trigger,
      isEmpty ? foundPos.pos : posAndNodeSize,
      isEmpty ? foundPos.pos : posAndNodeSize
    ))

    editor.commands.focus(isEmpty ? foundPos.pos + 2 : posAndNodeSize + trigger.length + 1)

    return true
  }

  const { $from } = editor.state.selection
  const currentNode = $from.node()
  const hasContentBefore =
    $from.parentOffset > 0 &&
    currentNode.textContent[$from.parentOffset - 1] !== " "

  return editor
    .chain()
    .insertContent({
      type: "text",
      text: hasContentBefore ? ` ${trigger}` : trigger,
    })
    .focus()
    .run();
}

/**
 * Adds an emoji trigger at the current selection or specified node position
 */
export function addEmojiTrigger(editor, trigger = ":", node, nodePos) {
  if (!editor || !editor.isEditable) return false
  if (!canAddEmojiTrigger(editor)) return false

  try {
    const { $from } = editor.state.selection
    const currentNode = $from.node()
    const isBlockNode = currentNode.isBlock && !currentNode.isTextblock

    if (isBlockNode) {
      return insertTriggerInBlockNode(editor, trigger, node, nodePos);
    }

    return insertTriggerInTextNode(editor, trigger, node, nodePos);
  } catch {
    return false
  }
}

/**
 * Determines if the emoji trigger button should be shown
 */
export function shouldShowButton(props) {
  const { editor, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canAddEmojiTrigger(editor);
  }

  return true
}

/**
 * Custom hook that provides emoji trigger functionality for Tiptap editor
 *
 * @example
 * ```tsx
 * // Simple usage - no params needed
 * function MySimpleEmojiTriggerButton() {
 *   const { isVisible, handleAddTrigger } = useEmojiTrigger()
 *
 *   if (!isVisible) return null
 *
 *   return <button onClick={handleAddTrigger}>Add Emoji</button>
 * }
 *
 * // Advanced usage with configuration
 * function MyAdvancedEmojiTriggerButton() {
 *   const { isVisible, handleAddTrigger, label } = useEmojiTrigger({
 *     editor: myEditor,
 *     trigger: "::",
 *     hideWhenUnavailable: true,
 *     onTriggerApplied: (trigger) => console.log('Trigger added:', trigger)
 *   })
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <MyButton
 *       onClick={handleAddTrigger}
 *       aria-label={label}
 *     >
 *       Add Emoji Trigger
 *     </MyButton>
 *   )
 * }
 * ```
 */
export function useEmojiTrigger(config) {
  const {
    editor: providedEditor,
    node,
    nodePos,
    trigger = ":",
    hideWhenUnavailable = false,
    onTriggerApplied,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = React.useState(true)
  const canAddTrigger = canAddEmojiTrigger(editor)

  React.useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    };
  }, [editor, hideWhenUnavailable])

  const handleAddTrigger = React.useCallback(() => {
    if (!editor) return false

    const success = addEmojiTrigger(editor, trigger, node, nodePos)
    if (success) {
      onTriggerApplied?.(trigger)
    }
    return success
  }, [editor, trigger, node, nodePos, onTriggerApplied])

  useHotkeys(EMOJI_TRIGGER_SHORTCUT_KEY, (event) => {
    event.preventDefault()
    handleAddTrigger()
  }, {
    enabled: isVisible && canAddTrigger,
    enableOnContentEditable: true,
    enableOnFormTags: true,
  })

  return {
    isVisible,
    handleAddTrigger,
    canAddTrigger,
    label: "Add emoji",
    shortcutKeys: EMOJI_TRIGGER_SHORTCUT_KEY,
    trigger,
    Icon: SmilePlusIcon,
  }
}
