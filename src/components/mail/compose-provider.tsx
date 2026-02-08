"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { ComposeModal } from "./compose-modal";

/* ─── Types ──────────────────────────────────────────────────────────────────── */

interface Contact {
  id: string;
  name: string;
  email: string;
}

interface ComposeOptions {
  to?: Contact[];
  cc?: Contact[];
  bcc?: Contact[];
  subject?: string;
  bodyHtml?: string;
  threadId?: string;
  inReplyToEmailId?: string;
}

interface ComposeContextValue {
  openCompose: (options?: ComposeOptions) => void;
  openReply: (options: ComposeOptions) => void;
  openForward: (options: ComposeOptions) => void;
}

/* ─── Context ────────────────────────────────────────────────────────────────── */

const ComposeContext = createContext<ComposeContextValue | null>(null);

export function useCompose() {
  const ctx = useContext(ComposeContext);
  if (!ctx) throw new Error("useCompose must be used within ComposeProvider");
  return ctx;
}

/* ─── Provider ───────────────────────────────────────────────────────────────── */

export function ComposeProvider({
  children,
  defaultSignature,
}: {
  children: ReactNode;
  defaultSignature?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [composeOptions, setComposeOptions] = useState<ComposeOptions>({});

  const openCompose = useCallback((options?: ComposeOptions) => {
    setComposeOptions(options ?? {});
    setIsOpen(true);
  }, []);

  const openReply = useCallback((options: ComposeOptions) => {
    setComposeOptions(options);
    setIsOpen(true);
  }, []);

  const openForward = useCallback((options: ComposeOptions) => {
    setComposeOptions(options);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setComposeOptions({});
  }, []);

  return (
    <ComposeContext.Provider value={{ openCompose, openReply, openForward }}>
      {children}
      <ComposeModal
        open={isOpen}
        onClose={handleClose}
        defaultSignature={defaultSignature}
        initialState={composeOptions}
      />
    </ComposeContext.Provider>
  );
}
