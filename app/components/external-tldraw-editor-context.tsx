import { createContext, useContext } from "react";
import { Editor } from "tldraw";

export const ExternalTldrawEditorContext = createContext<
  { editor: Editor } | undefined
>(undefined);

export function useExternalTldrawEditor() {
  const ctx = useContext(ExternalTldrawEditorContext);

  if (!ctx) {
    throw new Error(
      "useExternalTldrawEditor must be used within a ExternalTldrawEditorProvider"
    );
  }
  return ctx;
}

export function ExternalTldrawEditorProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: { editor: Editor };
}) {
  return (
    <ExternalTldrawEditorContext value={value}>
      {children}
    </ExternalTldrawEditorContext>
  );
}
