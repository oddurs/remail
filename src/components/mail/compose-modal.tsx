"use client";

import { useState, useRef, useCallback, useEffect, useTransition } from "react";
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

  if (!open) return null;

  if (sent) {
    return (
      <div className="fixed bottom-0 right-6 z-[var(--z-compose)] w-[560px]">
        <div className="rounded-t-[var(--radius-md)] bg-[var(--color-bg-elevated)] px-4 py-3 shadow-[var(--shadow-xl)] border border-[var(--color-border-default)] border-b-0">
          <span className="text-sm text-[var(--color-text-primary)]">
            Message sent.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 right-6 z-[var(--z-compose)] flex flex-col rounded-t-[var(--radius-md)] border border-b-0 border-[var(--color-border-default)] bg-[var(--color-compose-bg)] shadow-[var(--shadow-xl)]",
        minimized ? "w-72" : "w-[560px]",
      )}
    >
      {/* Header */}
      <div
        className="flex shrink-0 cursor-pointer items-center justify-between rounded-t-[var(--radius-md)] bg-[var(--color-compose-header)] px-4 py-3"
        onClick={() => setMinimized(!minimized)}
      >
        <span className="text-sm font-medium text-white truncate">
          {state.subject || "New Message"}
        </span>
        <div className="flex items-center gap-0.5">
          {/* Minimize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMinimized(!minimized);
            }}
            className="rounded-[var(--radius-full)] p-1 text-white/80 hover:bg-white/10"
            aria-label={minimized ? "Expand" : "Minimize"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
            </svg>
          </button>
          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDiscard();
            }}
            className="rounded-[var(--radius-full)] p-1 text-white/80 hover:bg-white/10"
            aria-label="Close"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body — hidden when minimized */}
      {!minimized && (
        <>
          {/* Recipients */}
          <div className="border-b border-[var(--color-border-subtle)]">
            <RecipientField
              label="To"
              contacts={state.to}
              onChange={(to) => {
                setState((prev) => ({ ...prev, to }));
                scheduleSave();
              }}
              suffix={
                <div className="flex gap-1 text-xs text-[var(--color-text-tertiary)]">
                  {!showCc && (
                    <button
                      onClick={() => setShowCc(true)}
                      className="hover:text-[var(--color-text-secondary)]"
                    >
                      Cc
                    </button>
                  )}
                  {!showBcc && (
                    <button
                      onClick={() => setShowBcc(true)}
                      className="hover:text-[var(--color-text-secondary)]"
                    >
                      Bcc
                    </button>
                  )}
                </div>
              }
            />
            {showCc && (
              <RecipientField
                label="Cc"
                contacts={state.cc}
                onChange={(cc) => {
                  setState((prev) => ({ ...prev, cc }));
                  scheduleSave();
                }}
              />
            )}
            {showBcc && (
              <RecipientField
                label="Bcc"
                contacts={state.bcc}
                onChange={(bcc) => {
                  setState((prev) => ({ ...prev, bcc }));
                  scheduleSave();
                }}
              />
            )}
          </div>

          {/* Subject */}
          <div className="border-b border-[var(--color-border-subtle)]">
            <input
              type="text"
              placeholder="Subject"
              value={state.subject}
              onChange={(e) => {
                setState((prev) => ({ ...prev, subject: e.target.value }));
                scheduleSave();
              }}
              className="w-full bg-transparent px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none"
            />
          </div>

          {/* Body editor */}
          <div
            ref={bodyRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleBodyInput}
            className="min-h-[200px] max-h-[400px] flex-1 overflow-y-auto px-4 py-3 text-sm leading-relaxed text-[var(--color-text-primary)] outline-none [&_a]:text-[var(--color-accent-primary)] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: state.bodyHtml }}
          />

          {/* Toolbar */}
          <div className="flex shrink-0 items-center gap-1 border-t border-[var(--color-border-subtle)] px-3 py-2">
            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={isSending || state.to.length === 0}
              className={cn(
                "rounded-[var(--radius-full)] px-5 py-1.5 text-sm font-medium transition-[var(--transition-fast)]",
                state.to.length === 0 || isSending
                  ? "bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] cursor-not-allowed"
                  : "bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]",
              )}
            >
              {isSending ? "Sending..." : "Send"}
            </button>

            {/* Formatting toolbar */}
            <div className="flex items-center gap-0.5 ml-1">
              <FormatButton
                title="Bold"
                onClick={() => document.execCommand("bold")}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                  <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                </svg>
              </FormatButton>
              <FormatButton
                title="Italic"
                onClick={() => document.execCommand("italic")}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" x2="10" y1="4" y2="4" />
                  <line x1="14" x2="5" y1="20" y2="20" />
                  <line x1="15" x2="9" y1="4" y2="20" />
                </svg>
              </FormatButton>
              <FormatButton
                title="Underline"
                onClick={() => document.execCommand("underline")}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 4v6a6 6 0 0 0 12 0V4" />
                  <line x1="4" x2="20" y1="20" y2="20" />
                </svg>
              </FormatButton>
              <FormatButton
                title="Bulleted list"
                onClick={() => document.execCommand("insertUnorderedList")}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" x2="21" y1="6" y2="6" />
                  <line x1="8" x2="21" y1="12" y2="12" />
                  <line x1="8" x2="21" y1="18" y2="18" />
                  <line x1="3" x2="3.01" y1="6" y2="6" />
                  <line x1="3" x2="3.01" y1="12" y2="12" />
                  <line x1="3" x2="3.01" y1="18" y2="18" />
                </svg>
              </FormatButton>
              <FormatButton
                title="Numbered list"
                onClick={() => document.execCommand("insertOrderedList")}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="10" x2="21" y1="6" y2="6" />
                  <line x1="10" x2="21" y1="12" y2="12" />
                  <line x1="10" x2="21" y1="18" y2="18" />
                  <path d="M4 6h1v4" />
                  <path d="M4 10h2" />
                  <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                </svg>
              </FormatButton>
            </div>

            <div className="flex-1" />

            {/* Saving indicator */}
            {isSaving && (
              <span className="text-xs text-[var(--color-text-tertiary)]">
                Saving...
              </span>
            )}

            {/* Delete draft */}
            <button
              onClick={handleDiscard}
              className="rounded-[var(--radius-full)] p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
              title="Discard draft"
              aria-label="Discard draft"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
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
        setSuggestions(results);
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
    <div className="relative flex items-start gap-1 px-4 py-1.5">
      <span className="shrink-0 py-0.5 text-sm text-[var(--color-text-tertiary)]">
        {label}
      </span>
      <div className="flex flex-1 flex-wrap items-center gap-1">
        {contacts.map((contact) => (
          <span
            key={contact.email}
            className="flex items-center gap-1 rounded-[var(--radius-full)] bg-[var(--color-bg-tertiary)] px-2 py-0.5 text-xs text-[var(--color-text-primary)]"
          >
            {contact.name || contact.email}
            <button
              onClick={() => removeContact(contact.email)}
              className="ml-0.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
              aria-label={`Remove ${contact.name || contact.email}`}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
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
            // Delay to allow click on suggestion
            setTimeout(() => {
              setShowSuggestions(false);
              addFromInput();
            }, 200);
          }}
          className="min-w-[120px] flex-1 bg-transparent py-0.5 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
          placeholder={contacts.length === 0 ? "Recipients" : ""}
        />
      </div>
      {suffix}

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute left-12 top-full z-[var(--z-dropdown)] mt-1 w-80 rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] py-1 shadow-[var(--shadow-lg)]">
          {suggestions.map((contact, index) => (
            <button
              key={contact.id}
              onMouseDown={(e) => {
                e.preventDefault();
                addContact(contact);
              }}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-[var(--transition-fast)]",
                index === selectedIndex
                  ? "bg-[var(--color-bg-hover)]"
                  : "hover:bg-[var(--color-bg-hover)]",
              )}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-bg-tertiary)] text-xs font-medium text-[var(--color-text-secondary)]">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-[var(--color-text-primary)]">
                  {contact.name}
                </div>
                <div className="truncate text-xs text-[var(--color-text-tertiary)]">
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

/* ─── Format Button ──────────────────────────────────────────────────────────── */

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
        e.preventDefault(); // Prevent focus loss from contentEditable
        onClick();
      }}
      className="rounded-[var(--radius-xs)] p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
    >
      {children}
    </button>
  );
}
