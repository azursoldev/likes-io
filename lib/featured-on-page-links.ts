/**
 * Shared rules for Featured On “page links” (admin CMS + API + public component).
 * Wildcard pagePath values behave like “show on all routes” for visibility.
 */

export const FEATURED_ON_WILDCARD_PAGE_PATHS = new Set(['all', '__external__']);

export function isWildcardPagePath(pagePath: string | null | undefined): boolean {
  return !!pagePath && FEATURED_ON_WILDCARD_PAGE_PATHS.has(pagePath);
}

export type PageLinkInput = {
  pagePath?: string | null;
  link?: string | null;
  nofollow?: boolean;
};

export type PageLinkNormalized = {
  pagePath: string;
  link: string | null;
  nofollow: boolean;
};

/** Trim and persist; empty / “#” destination → null. Preserves __external__. */
export function normalizePageLinkForStorage(row: PageLinkInput): PageLinkNormalized {
  const p = (row.pagePath ?? '').trim();
  const pagePath = p || 'all';
  const raw = row.link != null ? String(row.link).trim() : '';
  const link = raw === '' || raw === '#' ? null : raw;
  return {
    pagePath,
    link,
    nofollow: Boolean(row.nofollow),
  };
}

export function normalizePageLinksArray(rows: PageLinkInput[]): PageLinkNormalized[] {
  return rows.map(normalizePageLinkForStorage);
}

/** Rules for each row (external URL rows, etc.). Empty array is OK (caller decides if that’s allowed). */
export function validatePageLinksForSave(rows: PageLinkNormalized[]): string | null {
  for (const row of rows) {
    if (row.pagePath === '__external__') {
      if (!row.link || !/^https?:\/\//i.test(row.link)) {
        return '“External URL (all pages)” rows need a full URL starting with https:// (or http://) in the destination field.';
      }
    }
  }
  return null;
}

/** For create / admin save: require at least one row. */
export function validatePageLinksRequired(rows: PageLinkNormalized[]): string | null {
  if (!rows.length) {
    return 'At least one page link is required.';
  }
  return validatePageLinksForSave(rows);
}
