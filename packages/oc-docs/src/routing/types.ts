import type { OpenCollection } from '@opencollection/types';
import type { Item as OpenCollectionItem } from '@opencollection/types/collection/item';

export type PageType =
  | 'overview'
  | 'environments'
  | 'folder'
  | 'request';

/** A single breadcrumb hop: a folder above the current node. */
export interface BreadcrumbSegment {
  name: string;
  slug: string;
}

/**
 * A resolved node in the navigation model. `item` is null for the built-in
 * pseudo-pages (overview, environments). `slug` is the full path-based,
 * uuid-free identifier; the overview slug is the empty string ('' -> `#/`).
 */
export interface NavEntry {
  slug: string;
  type: PageType;
  name: string;
  item: OpenCollectionItem | null;
  /** Folder chain strictly above this node (excludes self & the overview crumb). */
  ancestors: BreadcrumbSegment[];
  /** Depth in the item tree (0 = top level). Built-ins are -1. */
  depth: number;
  /** HTTP method, for request entries only. */
  method?: string;
}

/** A prev/next neighbour in the ordered sequence. */
export interface SeqNeighbor {
  slug: string;
  name: string;
  type: PageType;
  method?: string;
}

/**
 * The full navigation model for a collection: the ordered DFS sequence (used
 * for prev/next) plus a slug -> entry lookup (used for resolution).
 */
export interface NavModel {
  ordered: NavEntry[];
  bySlug: Map<string, NavEntry>;
}

/** What every page component receives. */
export interface PageProps {
  node: NavEntry;
  prev?: SeqNeighbor;
  next?: SeqNeighbor;
  collection: OpenCollection;
  onOpenPlayground?: () => void;
}
