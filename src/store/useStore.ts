import { create } from 'zustand';
import type {
  Theme,
  Locale,
  Role,
  AutonomyLevel,
  ChatMessage,
  Artifact,
  LedgerEntry,
  SurfaceKind,
  LoadState,
} from '../lib/types';
import { routeIntent } from '../data/assistant';

let idc = 0;
export const uid = (p = 'id') => `${p}-${Date.now().toString(36)}-${idc++}`;

const nowLabel = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

interface Toast {
  id: string;
  text: string;
  undoId?: string; // ledger entry to undo
}

interface EvidencePanel {
  title: string;
  subtitle?: string;
  mentionIds: string[];
}

interface ExpandedSurface {
  id: string;
  kind: SurfaceKind;
  title: string;
  payload?: Record<string, unknown>;
}

interface State {
  // chrome
  theme: Theme;
  locale: Locale;
  role: Role;
  autonomy: AutonomyLevel;
  leftOpen: boolean;
  rightOpen: boolean;
  commandOpen: boolean;

  // flow
  onboarded: boolean;
  sampleData: boolean;

  // conversation
  messages: ChatMessage[];
  busy: boolean;

  // surfaces & overlays
  expanded: ExpandedSurface | null;
  evidence: EvidencePanel | null;
  settingsOpen: boolean;

  // delegation
  ledger: LedgerEntry[];
  toasts: Toast[];

  // actions — chrome
  toggleTheme: () => void;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  setRole: (r: Role) => void;
  setAutonomy: (a: AutonomyLevel) => void;
  setLeft: (v: boolean) => void;
  setRight: (v: boolean) => void;
  setCommand: (v: boolean) => void;
  setSettings: (v: boolean) => void;

  // actions — flow
  completeOnboarding: (sample: boolean) => void;

  // actions — conversation
  send: (text: string) => void;
  pushAssistant: (msg: Omit<ChatMessage, 'id' | 'author' | 'time'>) => void;

  // actions — surfaces
  openSurface: (kind: SurfaceKind, title: string, payload?: Record<string, unknown>) => void;
  closeSurface: () => void;
  openEvidence: (p: EvidencePanel) => void;
  closeEvidence: () => void;

  // actions — delegation
  addLedger: (e: Omit<LedgerEntry, 'id' | 'time'>) => string;
  approveLedger: (id: string) => void;
  undoLedger: (id: string) => void;
  pushToast: (text: string, undoId?: string) => void;
  dismissToast: (id: string) => void;
}

const greeting = (): ChatMessage => ({
  id: uid('m'),
  author: 'assistant',
  textKey: 'onb.done',
  time: nowLabel(),
  artifact: { id: uid('a'), kind: 'briefing', title: 'brief.title' },
});

export const useStore = create<State>((set, get) => ({
  theme: 'dark',
  locale: 'en',
  role: 'analyst',
  autonomy: 1,
  leftOpen: true,
  rightOpen: true,
  commandOpen: false,

  onboarded: false,
  sampleData: false,

  messages: [],
  busy: false,

  expanded: null,
  evidence: null,
  settingsOpen: false,

  ledger: [],
  toasts: [],

  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  setLocale: (locale) => set({ locale }),
  toggleLocale: () => set((s) => ({ locale: s.locale === 'en' ? 'es' : 'en' })),
  setRole: (role) => set({ role }),
  setAutonomy: (autonomy) => set({ autonomy }),
  setLeft: (leftOpen) => set({ leftOpen }),
  setRight: (rightOpen) => set({ rightOpen }),
  setCommand: (commandOpen) => set({ commandOpen }),
  setSettings: (settingsOpen) => set({ settingsOpen }),

  completeOnboarding: (sample) =>
    set({ onboarded: true, sampleData: sample, messages: [greeting()] }),

  send: (text) => {
    const userMsg: ChatMessage = {
      id: uid('m'),
      author: 'user',
      text,
      time: nowLabel(),
    };
    // optimistic thinking message
    const thinkingId = uid('m');
    set((s) => ({
      messages: [
        ...s.messages,
        userMsg,
        { id: thinkingId, author: 'assistant', pending: true, time: nowLabel() },
      ],
      busy: true,
    }));

    const reply = routeIntent(text, get().autonomy, get().locale);
    window.setTimeout(() => {
      set((s) => ({
        busy: false,
        messages: s.messages.map((m) =>
          m.id === thinkingId
            ? {
                id: thinkingId,
                author: 'assistant',
                time: nowLabel(),
                text: reply.text,
                textKey: reply.textKey,
                artifact: reply.artifact,
                proposal: reply.proposal,
              }
            : m
        ),
      }));
    }, 850);
  },

  pushAssistant: (msg) =>
    set((s) => ({
      messages: [...s.messages, { ...msg, id: uid('m'), author: 'assistant', time: nowLabel() }],
    })),

  openSurface: (kind, title, payload) =>
    set({ expanded: { id: uid('surf'), kind, title, payload } }),
  closeSurface: () => set({ expanded: null }),
  openEvidence: (evidence) => set({ evidence }),
  closeEvidence: () => set({ evidence: null }),

  addLedger: (e) => {
    const id = uid('led');
    set((s) => ({ ledger: [{ ...e, id, time: nowLabel() }, ...s.ledger] }));
    return id;
  },
  approveLedger: (id) =>
    set((s) => ({
      ledger: s.ledger.map((e) =>
        e.id === id ? { ...e, status: 'approved' } : e
      ),
    })),
  undoLedger: (id) =>
    set((s) => ({
      ledger: s.ledger.map((e) =>
        e.id === id ? { ...e, status: 'undone', undone: true } : e
      ),
    })),
  pushToast: (text, undoId) => {
    const id = uid('toast');
    set((s) => ({ toasts: [...s.toasts, { id, text, undoId }] }));
    window.setTimeout(() => get().dismissToast(id), 5200);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// re-export for convenience
export type { Artifact, LoadState };
