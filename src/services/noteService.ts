// src/services/noteService.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { Note, NoteTag } from '../types/note';

const API_BASE = 'https://notehub-public.goit.study/api';
const token = import.meta.env.VITE_NOTEHUB_TOKEN as string | undefined;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

type ApiNote = {
  _id?: string;
  id?: string;
  title: string;
  content?: string;
  tag: NoteTag;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
  [k: string]: unknown;
};

interface ApiNotesEnvelope {
  page: number;
  perPage: number;
  totalPages?: number;
  totalItems?: number;
  notes?: ApiNote[];
  items?: ApiNote[];
  results?: ApiNote[];
}

export interface FetchNotesResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  notes: Note[];
}

function coalesceDate(...vals: Array<string | undefined>): string {
  for (const v of vals) if (typeof v === 'string' && v) return v;
  return new Date(0).toISOString();
}

function normalizeNote(n: ApiNote): Note {
  const id = n.id ?? n._id ?? '';
  const createdAt = coalesceDate(n.createdAt, n.created_at);
  const updatedAt = coalesceDate(n.updatedAt, n.updated_at, createdAt);

  const normalized: Note = {
    id,
    title: n.title,
    content: n.content ?? '',
    tag: n.tag,
    createdAt,
    updatedAt,
  };

  return normalized;
}

function normalizeFetchResponse(raw: unknown): FetchNotesResponse {
  const src = (raw as any)?.data ?? (raw as any);

  const items: ApiNote[] =
    (src?.notes as ApiNote[]) ??
    (src?.items as ApiNote[]) ??
    (src?.results as ApiNote[]) ??
    [];

  const notes = items.map(normalizeNote);

  const page = Number(src?.page ?? 1);
  const perPage = Number(src?.perPage ?? 12);
  const totalItems = Number(src?.totalItems ?? notes.length);
  const totalPages = Number(
    src?.totalPages ?? Math.max(1, Math.ceil(totalItems / perPage))
  );

  return { page, perPage, totalPages, totalItems, notes };
}

export async function fetchNotes(
  { page = 1, perPage = 12, search = '' }: FetchNotesParams = {}
): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = { page, perPage };
  if (search.trim()) params.search = search.trim();

  const res: AxiosResponse<ApiNotesEnvelope> = await api.get<ApiNotesEnvelope>('/notes', {
    params,
  });
  return normalizeFetchResponse(res.data);
}

export interface CreateNoteParams {
  title: string;
  content?: string;
  tag: NoteTag;
}

type CreateNoteResponse = { note: ApiNote } | ApiNote;

export async function createNote(input: CreateNoteParams): Promise<Note> {
  const res: AxiosResponse<CreateNoteResponse> = await api.post<CreateNoteResponse>(
    '/notes',
    input
  );
  const payload = (res.data as any)?.note ?? res.data;
  return normalizeNote(payload as ApiNote);
}

type DeleteNoteResponse = { id: string } & Partial<Note>;

export async function deleteNote(id: string): Promise<DeleteNoteResponse> {
  const res: AxiosResponse<DeleteNoteResponse> = await api.delete<DeleteNoteResponse>(
    `/notes/${id}`
  );
  return (res.data ?? { id }) as DeleteNoteResponse;
}
