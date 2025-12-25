import { useSelector } from "react-redux";

export function useIsAdmin() {
  const userRole = useSelector(
    (state) => state.auth.user?.user_metadata?.user_role
  );
  return userRole === "admin";
}
// mentionColors.js
export const mentionColors = [
  "#16a34a", // green
  "#2563eb", // blue
  "#9333ea", // purple
  "#ea580c", // orange
  "#dc2626", // red
  "#0d9488", // teal
];

export const getRandomMentionColor = () =>
  mentionColors[Math.floor(Math.random() * mentionColors.length)];
