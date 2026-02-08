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
import { MdRemove, MdOpenInFull, MdClose, MdUndo, MdRedo, MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdFormatColorText, MdFormatAlignLeft, MdFormatListBulleted, MdFormatListNumbered, MdFormatIndentDecrease, MdFormatIndentIncrease, MdFormatClear, MdExpandMore, MdTextFormat, MdAttachFile, MdInsertLink, MdSentimentSatisfiedAlt, MdInsertPhoto, MdMoreHoriz, MdDelete } from "react-icons/md";

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
          <div className="rounded-t-lg bg-white px-4 py-3 shadow-2xl border border-zinc-300 border-b-0 dark:bg-zinc-900 dark:border-zinc-700">
            <span className="text-sm text-zinc-900 dark:text-zinc-100">
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
            "fixed bottom-0 right-6 z-[var(--z-compose)] flex flex-col rounded-t-lg border border-b-0 border-zinc-300 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900",
            minimized ? "w-72" : "w-[580px]",
          )}
        >
          {/* Header */}
          <div
            className="flex shrink-0 cursor-pointer items-center justify-between rounded-t-lg bg-zinc-800 px-3 py-[9px] dark:bg-zinc-950"
            onClick={() => setMinimized(!minimized)}
          >
            <span className="text-[13px] font-medium text-zinc-100 truncate pr-4">
              {state.subject || "New Message"}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimized(!minimized);
                }}
                className="rounded p-1 text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-colors"
                aria-label={minimized ? "Expand" : "Minimize"}
              >
                <MdRemove className="size-3.5" />
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="rounded p-1 text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-colors"
                aria-label="Full screen"
              >
                <MdOpenInFull className="size-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDiscard();
                }}
                className="rounded p-1 text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <MdClose className="size-3.5" />
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
                <div className="border-b border-zinc-200 dark:border-zinc-700/60">
                  <RecipientField
                    label="To"
                    contacts={state.to}
                    onChange={(to) => {
                      setState((prev) => ({ ...prev, to }));
                      scheduleSave();
                    }}
                    suffix={
                      <div className="flex gap-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                        {!showCc && (
                          <button
                            onClick={() => setShowCc(true)}
                            className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                          >
                            Cc
                          </button>
                        )}
                        {!showBcc && (
                          <button
                            onClick={() => setShowBcc(true)}
                            className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                          >
                            Bcc
                          </button>
                        )}
                      </div>
                    }
                  />
                  {showCc && (
                    <div className="border-t border-zinc-100 dark:border-zinc-800">
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
                    <div className="border-t border-zinc-100 dark:border-zinc-800">
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
                <div className="border-b border-zinc-200 dark:border-zinc-700/60">
                  <input
                    type="text"
                    placeholder="Subject"
                    value={state.subject}
                    onChange={(e) => {
                      setState((prev) => ({ ...prev, subject: e.target.value }));
                      scheduleSave();
                    }}
                    className="w-full bg-transparent px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
                  />
                </div>

                {/* Body editor */}
                <div
                  ref={bodyRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleBodyInput}
                  className="min-h-[320px] max-h-[480px] flex-1 overflow-y-auto px-4 py-3 text-sm leading-relaxed text-zinc-800 outline-none dark:text-zinc-200 [&_a]:text-blue-600 [&_a]:underline dark:[&_a]:text-blue-400"
                  dangerouslySetInnerHTML={{ __html: state.bodyHtml }}
                />

                {/* Formatting toolbar */}
                <div className="flex shrink-0 items-center gap-0.5 border-t border-zinc-200 bg-zinc-50/80 px-2 py-1 dark:border-zinc-700/60 dark:bg-zinc-800/40">
                  <FormatButton title="Undo" onClick={() => document.execCommand("undo")}>
                    <MdUndo className="size-3.5" />
                  </FormatButton>
                  <FormatButton title="Redo" onClick={() => document.execCommand("redo")}>
                    <MdRedo className="size-3.5" />
                  </FormatButton>

                  <div className="mx-1.5 h-4 w-px bg-zinc-300 dark:bg-zinc-600" />

                  <FormatButton title="Bold" onClick={() => document.execCommand("bold")}>
                    <MdFormatBold className="size-3.5" />
                  </FormatButton>
                  <FormatButton title="Italic" onClick={() => document.execCommand("italic")}>
                    <MdFormatItalic className="size-3.5" />
                  </FormatButton>
                  <FormatButton title="Underline" onClick={() => document.execCommand("underline")}>
                    <MdFormatUnderlined className="size-3.5" />
                  </FormatButton>

                  <div className="mx-1.5 h-4 w-px bg-zinc-300 dark:bg-zinc-600" />

                  <FormatButton title="Text color" onClick={() => {}}>
                    <MdFormatColorText className="size-3.5" />
                  </FormatButton>

                  <div className="mx-1.5 h-4 w-px bg-zinc-300 dark:bg-zinc-600" />

                  <FormatButton title="Align" onClick={() => {}}>
                    <MdFormatAlignLeft className="size-3.5" />
                  </FormatButton>

                  <div className="mx-1.5 h-4 w-px bg-zinc-300 dark:bg-zinc-600" />

                  <FormatButton title="Bulleted list" onClick={() => document.execCommand("insertUnorderedList")}>
                    <MdFormatListBulleted className="size-3.5" />
                  </FormatButton>
                  <FormatButton title="Numbered list" onClick={() => document.execCommand("insertOrderedList")}>
                    <MdFormatListNumbered className="size-3.5" />
                  </FormatButton>

                  <div className="mx-1.5 h-4 w-px bg-zinc-300 dark:bg-zinc-600" />

                  <FormatButton title="Indent less" onClick={() => document.execCommand("outdent")}>
                    <MdFormatIndentDecrease className="size-3.5" />
                  </FormatButton>
                  <FormatButton title="Indent more" onClick={() => document.execCommand("indent")}>
                    <MdFormatIndentIncrease className="size-3.5" />
                  </FormatButton>

                  <div className="mx-1.5 h-4 w-px bg-zinc-300 dark:bg-zinc-600" />

                  <FormatButton title="Remove formatting" onClick={() => document.execCommand("removeFormat")}>
                    <MdFormatClear className="size-3.5" />
                  </FormatButton>
                </div>

                {/* Bottom action bar */}
                <div className="flex shrink-0 items-center gap-1 bg-zinc-50/50 px-3 py-2 dark:bg-zinc-800/30">
                  {/* Send button */}
                  <button
                    onClick={handleSend}
                    disabled={isSending || state.to.length === 0}
                    className={cn(
                      "rounded-full px-6 py-[7px] text-[13px] font-semibold tracking-wide transition-all",
                      state.to.length === 0 || isSending
                        ? "bg-zinc-200 text-zinc-400 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-500"
                        : "bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)] hover:shadow-md active:scale-[0.98]",
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
                        ? "text-zinc-300 cursor-not-allowed dark:text-zinc-600"
                        : "text-zinc-500 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700",
                    )}
                    aria-label="Send options"
                  >
                    <MdExpandMore className="size-3.5" />
                  </button>

                  <div className="mx-1 h-5 w-px bg-zinc-200 dark:bg-zinc-700" />

                  {/* Action icons */}
                  <div className="flex items-center gap-0.5">
                    <BottomBarButton title="Formatting options">
                      <MdTextFormat className="size-4" />
                    </BottomBarButton>
                    <BottomBarButton title="Attach files">
                      <MdAttachFile className="size-4" />
                    </BottomBarButton>
                    <BottomBarButton title="Insert link">
                      <MdInsertLink className="size-4" />
                    </BottomBarButton>
                    <BottomBarButton title="Insert emoji">
                      <MdSentimentSatisfiedAlt className="size-4" />
                    </BottomBarButton>
                    <BottomBarButton title="Insert photo">
                      <MdInsertPhoto className="size-4" />
                    </BottomBarButton>
                    <BottomBarButton title="More options">
                      <MdMoreHoriz className="size-4" />
                    </BottomBarButton>
                  </div>

                  <div className="flex-1" />

                  {isSaving && (
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                      Saving...
                    </span>
                  )}

                  {/* Discard */}
                  <button
                    onClick={handleDiscard}
                    className="rounded p-1.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 transition-colors dark:text-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                    title="Discard draft"
                    aria-label="Discard draft"
                  >
                    <MdDelete className="size-4" />
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
      <span className="shrink-0 py-0.5 text-sm text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      <div className="flex flex-1 flex-wrap items-center gap-1.5">
        {contacts.map((contact) => (
          <span
            key={contact.email}
            className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {contact.name || contact.email}
            <button
              onClick={() => removeContact(contact.email)}
              className="ml-0.5 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
              aria-label={`Remove ${contact.name || contact.email}`}
            >
              <MdClose className="size-2.5" />
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
          className="min-w-[120px] flex-1 bg-transparent py-0.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          placeholder={contacts.length === 0 ? "Recipients" : ""}
        />
      </div>
      {suffix}

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute left-12 top-full z-[var(--z-dropdown)] mt-1 w-80 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
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
                  ? "bg-zinc-100 dark:bg-zinc-800"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60",
              )}
            >
              {contact.avatarUrl ? (
                <img src={contact.avatarUrl} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                  {contact.name}
                </div>
                <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
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
      className="rounded p-1.5 text-zinc-500 hover:bg-zinc-200/70 hover:text-zinc-700 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
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
      className="rounded-full p-[6px] text-zinc-500 hover:bg-zinc-200/80 hover:text-zinc-700 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
    >
      {children}
    </button>
  );
}
