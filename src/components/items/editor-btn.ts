export const editorBtn = (active: boolean) => ({
  variant: "editor" as const,
  size: "editor" as const,
  "data-state": active ? "active" : "inactive",
});
