// src/services/noteService.ts
import axios, { AxiosInstance } from 'axios';
import type { Note, NoteTag } from '../types/note';

const API_BASE = 'https://notehub-public.goit.study/api';

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unified response shapes
export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  notes: Note[];
}

function normalizeFetchResponse(raw: any): FetchNotesResponse {
  // Try to support several common shapes
  const page = raw.page ?? raw.meta?.page ?? 1;
  const perPage = raw.perPage ?? raw.meta?.perPage ?? raw.limit ?? 12;
  const totalPages = raw.totalPages ?? raw.meta?.totalPages ?? Math.max(1, Math.ceil((raw.totalItems ?? raw.count ?? 0) / perPage));
  const totalItems = raw.totalItems ?? raw.meta?.totalItems ?? raw.count ?? (Array.isArray(raw.results || raw.items || raw.data) ? (raw.results || raw.items || raw.data).length : 0);
  const list = raw.results ?? raw.items ?? raw.data ?? raw.notes ?? [];
  return { page, perPage, totalPages, totalItems, notes: list as Note[] };
}

export async function fetchNotes({ page = 1, perPage = 12, search = '' }: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const params: Record<string, any> = { page, perPage };
  if (search.trim()) params.search = search.trim();
  const { data } = await api.get('/notes', { params });
  return normalizeFetchResponse(data);
}

export interface CreateNoteParams {
  title: string;
  content?: string;
  tag: NoteTag;
}

export async function createNote(input: CreateNoteParams): Promise<Note> {
  const { data } = await api.post('/notes', input);
  // Some APIs wrap created entity; support both
  return (data.note ?? data) as Note;
}

export async function deleteNote(id: string): Promise<{ id: string } & Partial<Note>> {
  const { data } = await api.delete(`/notes/${id}`);
  return (data ?? { id }) as any;
}
