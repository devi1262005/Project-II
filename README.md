# 📝 NoteVault Plus

## 🚀 Features

### ✅ Core Features

- **CRUD Operations**
  - Create: Add new notes with title and content.
  - Read: View all your notes or a specific note.
  - Update: Modify existing notes.
  - Delete: Remove unwanted notes.

- **User Authentication**
  - Email/Password based login system.
  - Sign up, Sign in, and Sign out functionality.
  - Only logged-in users can access and manage their notes.
  - Notes are private by default.

- **Encryption (AES)**
  - Each note's content is encrypted before storing in the database.
  - AES symmetric encryption implemented.
  - Keys are securely managed using per-user secret management in environment variables.

- **Public Notes**
  - Any note can be marked as "public".
  - Public notes generate a unique URL.
  - Read-only access for unauthenticated or other users.

- **AI-powered Features (Gemini API)**
  - **Summarize:** Condense long notes into concise summaries.
  - **Grammar Correct:** Correct grammatical errors in notes.
  - **Make Coherent:** Convert scribbled or fragmented notes into well-formed paragraphs.

- **Filters, Sorting & Labeling**
  - Filter notes by labels or keywords.
  - Sort by date created, last modified, or title.
  - Add and manage custom labels per note.

- **Clean & Minimal UI**
  - Clutter-free, simple, and intuitive interface.
  - Responsive and mobile-friendly design.

---

## 🧪 Unit Testing
- Tests cover:
  - CRUD logic
  - Auth workflows
  - Utility/encryption functions
  - AI enhancement helpers

