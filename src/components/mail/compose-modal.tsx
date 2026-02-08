"use client";

import { useState, useRef, useCallback, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  sendEmail,
  saveDraft,
  discardDraft,
  searchContacts,
} from "@/lib/actions/email";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

/* ─── Types ──────────────────────────────────────────────────────────────────── */

interface Contact {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface ComposeState {
  to: Contact[];
  cc: Contact[];
  bcc: Contact[];
  subject: string;
  bodyHtml: string;
  draftId?: string;
  threadId?: string;
  inReplyToEmailId?: string;
}

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
  defaultSignature?: string;
  initialState?: Partial<ComposeState>;
}

/* ─── Component ──────────────────────────────────────────────────────────────── */

export function ComposeModal({
  open,
  onClose,
  defaultSignature,
  initialState,
}: ComposeModalProps) {
  const [state, setState] = useState<ComposeState>({
    to: [],
    cc: [],
    bcc: [],
    subject: "",
    bodyHtml: defaultSignature
      ? `<br><br><div class="signature">${defaultSignature}</div>`
      : "",
    ...initialState,
  });

  const [showCc, setShowCc] = useState((initialState?.cc?.length ?? 0) > 0);
  const [showBcc, setShowBcc] = useState((initialState?.bcc?.length ?? 0) > 0);
  const [minimized, setMinimized] = useState(false);
  const [isSending, startSendTransition] = useTransition();
  const [isSaving, startSaveTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const { showToast } = useToast();
  const bodyRef = useRef<HTMLDivElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset state when initialState changes (new compose)
  useEffect(() => {
    if (open) {
      setState({
        to: [],
        cc: [],
        bcc: [],
        subject: "",
        bodyHtml: defaultSignature
          ? `<br><br><div class="signature">${defaultSignature}</div>`
          : "",
        ...initialState,
      });
      setSent(false);
      setMinimized(false);
      setShowCc((initialState?.cc?.length ?? 0) > 0);
      setShowBcc((initialState?.bcc?.length ?? 0) > 0);
    }
  }, [open, initialState, defaultSignature]);

  // Auto-save draft every 3 seconds after changes
  const scheduleSave = useCallback(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      const hasContent =
        state.to.length > 0 ||
        state.subject.trim() !== "" ||
        state.bodyHtml.replace(/<[^>]*>/g, "").trim() !== "";

      if (hasContent) {
        startSaveTransition(async () => {
          try {
            const result = await saveDraft({
              to: state.to.map((c) => c.email),
              cc: state.cc.map((c) => c.email),
              bcc: state.bcc.map((c) => c.email),
              subject: state.subject,
              bodyHtml: state.bodyHtml,
              draftId: state.draftId,
              threadId: state.threadId,
            });
            if (result.draftId && !state.draftId) {
              setState((prev) => ({
                ...prev,
                draftId: result.draftId,
                threadId: result.threadId,
              }));
            }
          } catch (err) {
            console.error("Auto-save failed:", err);
          }
        });
      }
    }, 3000);
  }, [state]);

  const handleSend = useCallback(() => {
    if (state.to.length === 0) return;

    startSendTransition(async () => {
      try {
        // If there's a draft, discard it first
        if (state.draftId) {
          await discardDraft(state.draftId);
        }

        await sendEmail({
          to: state.to.map((c) => c.email),
          cc: state.cc.map((c) => c.email),
          bcc: state.bcc.map((c) => c.email),
          subject: state.subject || "(no subject)",
          bodyHtml: state.bodyHtml,
          threadId: state.threadId,
          inReplyToEmailId: state.inReplyToEmailId,
        });

        setSent(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch {
        showToast({ message: "Failed to send message" });
      }
    });
  }, [state, onClose, showToast]);

  const handleDiscard = useCallback(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    if (state.draftId) {
      startSaveTransition(async () => {
        try {
          await discardDraft(state.draftId!);
        } catch (err) {
          console.error("Discard draft failed:", err);
        }
      });
    }
    onClose();
  }, [state.draftId, onClose]);

  const handleBodyInput = useCallback(() => {
    if (bodyRef.current) {
      const html = bodyRef.current.innerHTML;
      setState((prev) => ({ ...prev, bodyHtml: html }));
      scheduleSave();
    }
  }, [scheduleSave]);

  return (
    <AnimatePresence mode="wait">
      {open && sent && (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-0 right-6 z-[var(--z-compose)] w-[560px]"
        >
          <div className="rounded-t-lg bg-white px-4 py-3 shadow-2xl border border-gray-300 border-b-0 dark:bg-gray-900 dark:border-gray-700">
            <span className="text-sm text-gray-900 dark:text-gray-100">
              Message sent.
            </span>
          </div>
        </motion.div>
      )}

      {open && !sent && (
        <motion.div
          key="compose"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className={cn(
            "fixed bottom-0 right-6 z-[var(--z-compose)] flex flex-col rounded-t-lg border border-b-0 border-gray-300 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900",
            minimized ? "w-72" : "w-[580px]",
          )}
        >
          {/* Header */}
          <div
            className="flex shrink-0 cursor-pointer items-center justify-between rounded-t-lg bg-gray-800 px-3 py-[9px] dark:bg-gray-950"
            onClick={() => setMinimized(!minimized)}
          >
            <span className="text-[13px] font-medium text-gray-100 truncate pr-4">
              {state.subject || "New Message"}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimized(!minimized);
                }}
                className="rounded p-1 text-gray-400 hover:text-gray-200 hover:bg-white/10 transition-colors"
                aria-label={minimized ? "Expand" : "Minimize"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                </svg>
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="rounded p-1 text-gray-400 hover:text-gray-200 hover:bg-white/10 transition-colors"
                aria-label="Full screen"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" x2="14" y1="3" y2="10" />
                  <line x1="3" x2="10" y1="21" y2="14" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDiscard();
                }}
                className="rounded p-1 text-gray-400 hover:text-gray-200 hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body — hidden when minimized */}
          <AnimatePresence initial={false}>
            {!minimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{ overflow: "hidden" }}
              >
                {/* Recipients */}
                <div className="border-b border-gray-200 dark:border-gray-700/60">
                  <RecipientField
                    label="To"
                    contacts={state.to}
                    onChange={(to) => {
                      setState((prev) => ({ ...prev, to }));
                      scheduleSave();
                    }}
                    suffix={
                      <div className="flex gap-2 text-xs font-medium text-gray-400 dark:text-gray-500">
                        {!showCc && (
                          <button
                            onClick={() => setShowCc(true)}
                            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            Cc
                          </button>
                        )}
                        {!showBcc && (
                          <button
                            onClick={() => setShowBcc(true)}
                            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            Bcc
                          </button>
                        )}
                      </div>
                    }
                  />
                  {showCc && (
                    <div className="border-t border-gray-100 dark:border-gray-800">
                      <RecipientField
                        label="Cc"
                        contacts={state.cc}
                        onChange={(cc) => {
                          setState((prev) => ({ ...prev, cc }));
                          scheduleSave();
                        }}
                      />
                    </div>
                  )}
                  {showBcc && (
                    <div className="border-t border-gray-100 dark:border-gray-800">
                      <RecipientField
                        label="Bcc"
                        contacts={state.bcc}
                        onChange={(bcc) => {
                          setState((prev) => ({ ...prev, bcc }));
                          scheduleSave();
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Subject */}
                <div className="border-b border-gray-200 dark:border-gray-700/60">
                  <input
                    type="text"
                    placeholder="Subject"
                    value={state.subject}
                    onChange={(e) => {
                      setState((prev) => ({ ...prev, subject: e.target.value }));
                      scheduleSave();
                    }}
                    className="w-full bg-transparent px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
                  />
                </div>

                {/* Body editor */}
                <div
                  ref={bodyRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleBodyInput}
                  className="min-h-[320px] max-h-[480px] flex-1 overflow-y-auto px-4 py-3 text-sm leading-relaxed text-gray-800 outline-none dark:text-gray-200 [&_a]:text-blue-600 [&_a]:underline dark:[&_a]:text-blue-400"
                  dangerouslySetInnerHTML={{ __html: state.bodyHtml }}
                />

                {/* Formatting toolbar */}
                <div className="flex shrink-0 items-center gap-0.5 border-t border-gray-200 bg-gray-50/80 px-2 py-1 dark:border-gray-700/60 dark:bg-gray-800/40">
                  <FormatButton title="Undo" onClick={() => document.execCommand("undo")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                    </svg>
                  </FormatButton>
                  <FormatButton title="Redo" onClick={() => document.execCommand("redo")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
                    </svg>
                  </FormatButton>

                  <div className="mx-1.5 h-4 w-px bg-gray-300 dark:bg-gray-600" />

                  <FormatButton title="Bold" onClick={() => document.execCommand("bold")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                    </svg>
                  </FormatButton>
                  <FormatButton title="Italic" onClick={() => document.execCommand("italic")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" x2="10" y1="4" y2="4" /><line x1="14" x2="5" y1="20" y2="20" /><line x1="15" x2="9" y1="4" y2="20" />
                    </svg>
                  </FormatButton>
                  <FormatButton title="Underline" onClick={() => document.execCommand("underline")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" x2="20" y1="20" y2="20" />
                    </svg>
                  </FormatButton>

                  <div className="mx-1.5 h-4 w-px bg-gray-300 dark:bg-gray-600" />

                  <FormatButton title="Text color" onClick={() => {}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 20h16" /><path d="m8 4 4 12 4-12" />
                    </svg>
                  </FormatButton>

                  <div className="mx-1.5 h-4 w-px bg-gray-300 dark:bg-gray-600" />

                  <FormatButton title="Align" onClick={() => {}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="21" x2="3" y1="6" y2="6" /><line x1="15" x2="3" y1="12" y2="12" /><line x1="17" x2="3" y1="18" y2="18" />
                    </svg>
                  </FormatButton>

                  <div className="mx-1.5 h-4 w-px bg-gray-300 dark:bg-gray-600" />

                  <FormatButton title="Bulleted list" onClick={() => document.execCommand("insertUnorderedList")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" />
                      <line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" />
                    </svg>
                  </FormatButton>
                  <FormatButton title="Numbered list" onClick={() => document.execCommand("insertOrderedList")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="10" x2="21" y1="6" y2="6" /><line x1="10" x2="21" y1="12" y2="12" /><line x1="10" x2="21" y1="18" y2="18" />
                      <path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                    </svg>
                  </FormatButton>

                  <div className="mx-1.5 h-4 w-px bg-gray-300 dark:bg-gray-600" />

                  <FormatButton title="Indent less" onClick={() => document.execCommand("outdent")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="7 8 3 12 7 16" /><line x1="21" x2="11" y1="12" y2="12" /><line x1="21" x2="11" y1="6" y2="6" /><line x1="21" x2="11" y1="18" y2="18" />
                    </svg>
                  </FormatButton>
                  <FormatButton title="Indent more" onClick={() => document.execCommand("indent")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 8 7 12 3 16" /><line x1="21" x2="11" y1="12" y2="12" /><line x1="21" x2="11" y1="6" y2="6" /><line x1="21" x2="11" y1="18" y2="18" />
                    </svg>
                  </FormatButton>

                  <div className="mx-1.5 h-4 w-px bg-gray-300 dark:bg-gray-600" />

                  <FormatButton title="Remove formatting" onClick={() => document.execCommand("removeFormat")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m7 21 4-9" /><path d="M3 3h12l-2.5 6" /><line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  </FormatButton>
                </div>

                {/* Bottom action bar */}
                <div className="flex shrink-0 items-center gap-1 bg-gray-50/50 px-3 py-2 dark:bg-gray-800/30">
                  {/* Send button */}
                  <button
                    onClick={handleSend}
                    disabled={isSending || state.to.length === 0}
                    className={cn(
                      "rounded-full px-6 py-[7px] text-[13px] font-semibold tracking-wide transition-all",
                      state.to.length === 0 || isSending
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                        : "bg-[#0b57d0] text-white hover:bg-[#0842a0] hover:shadow-md active:scale-[0.98] dark:bg-[#a8c7fa] dark:text-[#062e6f] dark:hover:bg-[#93b2e5]",
                    )}
                  >
                    {isSending ? "Sending..." : "Send"}
                  </button>

                  {/* Send options chevron */}
                  <button
                    disabled={isSending || state.to.length === 0}
                    className={cn(
                      "rounded-full p-1.5 transition-colors",
                      state.to.length === 0 || isSending
                        ? "text-gray-300 cursor-not-allowed dark:text-gray-600"
                        : "text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700",
                    )}
                    aria-label="Send options"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <div className="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-700" />

                  {/* Action icons */}
                  <div className="flex items-center gap-0.5">
                    <BottomBarButton title="Formatting options">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" x2="15" y1="20" y2="20" /><line x1="12" x2="12" y1="4" y2="20" />
                      </svg>
                    </BottomBarButton>
                    <BottomBarButton title="Attach files">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                    </BottomBarButton>
                    <BottomBarButton title="Insert link">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                    </BottomBarButton>
                    <BottomBarButton title="Insert emoji">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" x2="9.01" y1="9" y2="9" /><line x1="15" x2="15.01" y1="9" y2="9" />
                      </svg>
                    </BottomBarButton>
                    <BottomBarButton title="Insert photo">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </BottomBarButton>
                    <BottomBarButton title="More options">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
                      </svg>
                    </BottomBarButton>
                  </div>

                  <div className="flex-1" />

                  {isSaving && (
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                      Saving...
                    </span>
                  )}

                  {/* Discard */}
                  <button
                    onClick={handleDiscard}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    title="Discard draft"
                    aria-label="Discard draft"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Recipient Field ────────────────────────────────────────────────────────── */

function RecipientField({
  label,
  contacts,
  onChange,
  suffix,
}: {
  label: string;
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
  suffix?: React.ReactNode;
}) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Contact[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((query: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (query.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimer.current = setTimeout(async () => {
      try {
        const results = await searchContacts(query);
        setSuggestions(results.map((r) => ({ ...r, avatarUrl: r.avatar_url })));
        setShowSuggestions(results.length > 0);
        setSelectedIndex(0);
      } catch {
        setSuggestions([]);
      }
    }, 200);
  }, []);

  const addContact = useCallback(
    (contact: Contact) => {
      if (!contacts.find((c) => c.email === contact.email)) {
        onChange([...contacts, contact]);
      }
      setInputValue("");
      setSuggestions([]);
      setShowSuggestions(false);
      inputRef.current?.focus();
    },
    [contacts, onChange],
  );

  const addFromInput = useCallback(() => {
    const email = inputValue.trim();
    if (!email) return;

    // Basic email validation
    if (email.includes("@")) {
      const name = email.split("@")[0].replace(/[._-]/g, " ");
      addContact({
        id: email,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
      });
    }
  }, [inputValue, addContact]);

  const removeContact = useCallback(
    (email: string) => {
      onChange(contacts.filter((c) => c.email !== email));
    },
    [contacts, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Tab" || e.key === ",") {
        e.preventDefault();
        if (showSuggestions && suggestions.length > 0) {
          addContact(suggestions[selectedIndex]);
        } else {
          addFromInput();
        }
      } else if (
        e.key === "Backspace" &&
        inputValue === "" &&
        contacts.length > 0
      ) {
        removeContact(contacts[contacts.length - 1].email);
      } else if (e.key === "ArrowDown" && showSuggestions) {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp" && showSuggestions) {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    },
    [
      showSuggestions,
      suggestions,
      selectedIndex,
      addContact,
      addFromInput,
      inputValue,
      contacts,
      removeContact,
    ],
  );

  return (
    <div className="relative flex items-start gap-1 px-4 py-2">
      <span className="shrink-0 py-0.5 text-sm text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <div className="flex flex-1 flex-wrap items-center gap-1.5">
        {contacts.map((contact) => (
          <span
            key={contact.email}
            className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            {contact.name || contact.email}
            <button
              onClick={() => removeContact(contact.email)}
              className="ml-0.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              aria-label={`Remove ${contact.name || contact.email}`}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleSearch(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setTimeout(() => {
              setShowSuggestions(false);
              addFromInput();
            }, 200);
          }}
          className="min-w-[120px] flex-1 bg-transparent py-0.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
          placeholder={contacts.length === 0 ? "Recipients" : ""}
        />
      </div>
      {suffix}

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute left-12 top-full z-[var(--z-dropdown)] mt-1 w-80 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {suggestions.map((contact, index) => (
            <button
              key={contact.id}
              onMouseDown={(e) => {
                e.preventDefault();
                addContact(contact);
              }}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors",
                index === selectedIndex
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800/60",
              )}
            >
              {contact.avatarUrl ? (
                <img src={contact.avatarUrl} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-gray-900 dark:text-gray-100">
                  {contact.name}
                </div>
                <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {contact.email}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Toolbar Buttons ─────────────────────────────────────────────────────── */

function FormatButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="rounded p-1.5 text-gray-500 hover:bg-gray-200/70 hover:text-gray-700 transition-colors dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
    >
      {children}
    </button>
  );
}

function BottomBarButton({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className="rounded-full p-[6px] text-gray-500 hover:bg-gray-200/80 hover:text-gray-700 transition-colors dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
    >
      {children}
    </button>
  );
}
