"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdSearch, MdClose, MdTune, MdHistory } from "react-icons/md";

const RECENT_SEARCHES_KEY = "remail-recent-searches";
const MAX_RECENT = 6;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  const recent = getRecentSearches().filter((s) => s !== query);
  recent.unshift(query);
  localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT)),
  );
}

const QUICK_FILTERS = [
  { label: "Has attachment", query: "has:attachment" },
  { label: "Last 7 days", query: "newer_than:7d" },
  { label: "From me", query: "from:me" },
];

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocused) {
      setRecentSearches(getRecentSearches());
    }
  }, [isFocused]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isFocused) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isFocused]);

  const doSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (trimmed) {
        saveRecentSearch(trimmed);
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        setIsFocused(false);
        inputRef.current?.blur();
      }
    },
    [router],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      doSearch(query);
    },
    [query, doSearch],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  const handleFilterClick = useCallback(
    (filterQuery: string) => {
      setQuery(filterQuery);
      doSearch(filterQuery);
    },
    [doSearch],
  );

  const handleRecentClick = useCallback(
    (recent: string) => {
      setQuery(recent);
      doSearch(recent);
    },
    [doSearch],
  );

  const showDropdown = isFocused && (recentSearches.length > 0 || true);

  return (
    <div ref={containerRef} className="relative ml-2 mr-4 flex max-w-lg flex-1">
      {/* Search input bar — always in flow, animated bg/border/shadow */}
      <motion.div
        className="w-full overflow-hidden rounded-full"
        initial={false}
        animate={{
          backgroundColor: isFocused
            ? "var(--color-bg-primary)"
            : "var(--color-bg-tertiary)",
          boxShadow: isFocused
            ? "0 2px 8px rgba(0,0,0,0.12)"
            : "none",
        }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          border: "1px solid var(--color-border-default)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex w-full items-center gap-2.5 px-3 py-1.5">
            <button
              type="submit"
              className="shrink-0 text-[var(--color-text-secondary)]"
              aria-label="Search"
            >
              <MdSearch className="size-4" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search mail"
              className="w-full bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  type="button"
                  onClick={handleClear}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="shrink-0 rounded-full p-0.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
                  aria-label="Clear search"
                >
                  <MdClose className="size-4" />
                </motion.button>
              )}
            </AnimatePresence>
            <button
              type="button"
              className="shrink-0 rounded-full p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
              aria-label="Search options"
              title="Search options"
            >
              <MdTune className="size-4" />
            </button>
          </div>
        </form>
      </motion.div>

      {/* Dropdown — appears below the input */}
      <AnimatePresence>
        {showDropdown && isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-x-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] shadow-lg"
          >
            {/* Quick filter chips */}
            <div className="flex gap-2 px-4 py-3">
              {QUICK_FILTERS.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => handleFilterClick(filter.query)}
                  className="rounded-full bg-[var(--color-bg-tertiary)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-hover)]"
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="border-t border-[var(--color-border-subtle)] py-1">
                {recentSearches.map((recent) => (
                  <button
                    key={recent}
                    type="button"
                    onClick={() => handleRecentClick(recent)}
                    className="flex w-full items-center gap-4 px-5 py-2.5 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]"
                  >
                    <MdHistory className="size-5 shrink-0 text-[var(--color-text-tertiary)]" />
                    <span>{recent}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
