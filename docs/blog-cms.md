# Blog CMS — Feature Documentation

> Internal content management system for publishing articles and blog posts.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Admin Authentication](#admin-authentication)
- [Content Editing](#content-editing)
- [Image Upload Pipeline](#image-upload-pipeline)
- [File Structure](#file-structure)
- [Gotchas & Notes](#gotchas--notes)

---

## Overview

The Blog CMS lives at `/blog` (public) and `/blog/admin` (authenticated). Admins can create, edit, duplicate, publish/unpublish, and delete posts. Public users see only published posts, enforced via Row Level Security.

### Features

| Feature | Description |
|---------|-------------|
| **Rich text editor** | BlockNote-based block editor storing content as JSONB |
| **Cover images** | Direct upload to Supabase Storage with magic-byte validation |
| **Publish toggle** | Draft/published workflow with `published_at` timestamp |
| **Slug management** | Auto-generated slugs with manual override, unique constraint enforced |
| **Post duplication** | Clone any post (without cover image to avoid deletion bugs) |
| **RLS enforcement** | Public can only `SELECT` published posts; admins have full access |

---

## Architecture

```
                  ┌─────────────────┐
                  │  Supabase Auth   │
                  └────────┬────────┘
                           │ session check
                           ▼
              ┌──────────────────────┐
              │  /blog/admin/layout  │ ← Server Component
              │  AuthGuard (client)  │ ← Redirects to /blog/admin/login if no session
              └──────────┬──────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   Admin Dashboard   Post Editor    Post Edit
   /blog/admin       /blog/admin/new  /blog/admin/[id]/edit
          │              │              │
          ▼              ▼              ▼
      Server Actions (actions.ts)
      → createPost / updatePost / deletePost / duplicatePost / togglePublished
          │
          ▼
   Supabase (service role client)
   ┌───────────┐      ┌──────────────────┐
   │   posts   │      │  blog-images     │
   │  (table)  │      │  (storage bucket)│
   └───────────┘      └──────────────────┘
          │
          ▼
   Public Blog (/blog, /blog/[slug])
   → Server Component queries published=true posts
```

---

## Database Schema

```sql
CREATE TABLE posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  title           text NOT NULL,
  excerpt         text,
  content         jsonb NOT NULL DEFAULT '{}',
  cover_image_url text,
  published       boolean DEFAULT false,
  published_at    timestamptz,
  created_at      timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public can only view published posts
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (published = true);

-- Authenticated (Admin) full access
CREATE POLICY "Authenticated full access" ON posts
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
```

Schema file: `app/blog/schema.sql`

---

## Admin Authentication

- Login at `/blog/admin/login` using Supabase email/password auth.
- The admin layout (`app/blog/admin/layout.tsx`) checks the session server-side and wraps children in `AuthGuard`.
- `AuthGuard` is a client component that redirects to the login page if no valid session exists.
- All server actions verify `auth.getUser()` before performing writes (create, delete, duplicate, togglePublish).
- **Dev credentials**: `user@email.com` / `pass123` (see `CONTRIBUTING.md`).

---

## Content Editing

Posts are authored using `@blocknote/react`, a block-based rich text editor.

- Content is serialized as **structured JSON** (not raw HTML) and stored in the `content` jsonb column.
- The editor supports headings, paragraphs, lists, images (inline upload), code blocks, and more.
- `BlockNoteRenderer` on the public side converts the stored JSON back into rendered HTML.
- `CustomRenderer` handles any project-specific block types.

---

## Image Upload Pipeline

Cover images and inline editor images follow this flow:

1. **Client**: User selects a file via the post form.
2. **Server Action**: `uploadBlogImageAction` validates auth, then calls `uploadBlogImage`.
3. **Validation** (`lib/blog-upload.ts`):
   - File type must be `jpeg`, `png`, `webp`, or `gif`.
   - Max size: **5 MB**.
   - **Magic bytes check**: reads the first 4 bytes of the file to verify the actual format matches the declared MIME type.
4. **Upload**: File is uploaded to the `blog-images` Supabase Storage bucket with a sanitized, randomized filename (`{timestamp}-{uuid}.{ext}`).
5. **Cleanup**: When a post is deleted, its cover image is removed from the storage bucket.

---

## File Structure

```
app/blog/
  page.tsx                    # Public blog listing (Server Component)
  schema.sql                  # Database schema
  [slug]/
    page.tsx                  # Individual post page (SSR)
  admin/
    actions.ts                # Server Actions (CRUD, auth, image upload)
    layout.tsx                # Auth-guarded admin layout
    page.tsx                  # Admin dashboard (post list + actions)
    login/
      page.tsx                # Login form
    new/
      page.tsx                # Create new post
    [id]/edit/
      page.tsx                # Edit existing post

components/custom/blog/
  AdminPostActions.tsx        # Delete / Duplicate / Publish toggle buttons
  AuthGuard.tsx               # Client-side session redirect
  BlockNoteEditor.tsx         # BlockNote editor wrapper
  BlockNoteRenderer.tsx       # JSON → HTML renderer for public view
  CustomRenderer.tsx          # Custom block type handlers
  PostCard.tsx                # Blog list card component
  PostForm.tsx                # Create/Edit form with cover image upload
  SignOutButton.tsx           # Admin sign-out trigger
  SlugInput.tsx               # Auto-slug generator from title
  TableOfContents.tsx         # Dynamic TOC for post pages

lib/
  blog-upload.ts              # Image validation + Supabase Storage upload
```

---

## Gotchas & Notes

- **Content is JSONB, not HTML** — the `content` column stores BlockNote's JSON structure. Parsing it as plain text will not work; always use `BlockNoteRenderer`.

- **Duplicate posts intentionally drop the cover image** — when duplicating, `cover_image_url` is set to `null` to avoid a bug where deleting the duplicate would also delete the original's image from storage (both posts would reference the same storage file).

- **`published_at` is set only once** — toggling a post from draft to published sets `published_at`. Unpublishing and re-publishing does NOT reset the date, preserving the original publish timestamp.

- **Auth uses two Supabase clients** — the admin layout uses `createClient()` (cookie-based, per-request) to check the session. Write operations in `actions.ts` use `createServiceClient()` (service role key) to bypass RLS for admin operations. The RLS policies are designed so that public read access works with the anon key.

- **Supabase Storage bucket `blog-images` must exist** — it's not created by the schema SQL. Create it manually in the Supabase Dashboard under Storage → Create new bucket → name: `blog-images`, public: yes.
