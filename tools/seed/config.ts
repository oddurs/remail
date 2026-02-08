import type { SeedConfig } from "./types";
import { ALL_CONTACTS } from "./data/contacts";
import { ALL_THREADS } from "./data/threads";
import { ALL_LABELS } from "./data/labels";
import { ALL_SIGNATURES } from "./data/signatures";

export function buildSeedConfig(): SeedConfig {
  return {
    contacts: ALL_CONTACTS,
    threads: ALL_THREADS,
    labels: ALL_LABELS,
    signatures: ALL_SIGNATURES,
  };
}
