# VicThree Defence — Mock Tests

A free, timed, mobile-friendly mock-test site. One site hosts **many tests**.
Front-end on **GitHub Pages**, grading on a **Google Apps Script** backend so
answer keys never reach the browser.

```
victhree-cds-geo/
├── docs/                  ← GitHub Pages serves ONLY this folder (public)
│   ├── index.html         test picker (home page) — lists all tests
│   ├── home.js            renders the test cards from tests.json
│   ├── test.html          the quiz engine (opened as test.html?test=<id>)
│   ├── app.js             quiz logic; set CONFIG.BACKEND_URL here
│   ├── styles.css         navy/gold theme, mobile-first
│   ├── tests.json         the list of tests shown on the home page
│   ├── tests/
│   │   └── geo-01.json    a test's questions (no answers, safe to serve)
│   └── assets/            drop banner.png here for the header
├── Code.gs                Apps Script backend — ALL answer keys live here
├── answer_key.json        original key, GITIGNORED (never pushed)
├── .gitignore
└── README.md
```

> 🔒 **Why answer keys stay secret:** they live only inside `Code.gs`, which
> runs on Google's servers. They are never in `docs/`, never served, never
> pushed to GitHub. The browser only receives the score + explanations *after*
> a student submits.

---

## How the multi-test setup works

- `docs/index.html` reads **`docs/tests.json`** and shows one card per test.
- Clicking a card opens **`docs/test.html?test=<id>`**, which loads
  **`docs/tests/<id>.json`** (that test's questions).
- On submit, the page sends `{ testId, name, roll, answers }` to the backend.
- **`Code.gs`** looks up `ANSWER_KEYS["<id>"]`, grades, returns the result,
  and appends a row to your Google Sheet **with a Test column**.

The `id` is the single source of truth and must match in **three** places:
`tests.json`, the filename `tests/<id>.json`, and the key in `ANSWER_KEYS`.

---

## ➕ Adding a new test later (the routine)

Say the new test id is `polity-01`:

1. **Questions** — create `docs/tests/polity-01.json` (same shape as
   `geo-01.json`: `{ title, durationMin, questions:[{n, stem, subs, options, pyq}] }`).
2. **List it** — add an entry to `docs/tests.json`:
   ```json
   { "id": "polity-01", "title": "CDS Polity — Mock Test 1",
     "subject": "Polity", "durationMin": 60, "count": 50,
     "description": "Constitution, fundamental rights, polity PYQs." }
   ```
3. **Answer key** — add a block to `ANSWER_KEYS` in `Code.gs`:
   ```js
   "polity-01": {
     "1": { correct: "b", correctText: "...", exp: "..." },
     "2": { correct: "d", correctText: "...", exp: "..." }
   }
   ```
4. **Publish the site** — commit & push (front-end goes live in ~1 min):
   ```bash
   git add . && git commit -m "Add polity-01 test" && git push
   ```
5. **Update the backend** — in the Apps Script editor: **Deploy ▸ Manage
   deployments ▸ ✏️ edit ▸ Version: New version ▸ Deploy**. The `/exec` URL
   stays the same.

That's it — no new site, no new URL.

---

## First-time deploy (already done once, here for reference)

### A. Backend (Apps Script)
1. https://script.google.com → New project → paste **`Code.gs`** → Save.
2. *(Optional)* Run `setup` once and authorize → creates the results sheet.
3. **Deploy ▸ New deployment ▸ Web app**, *Execute as: Me*,
   *Who has access: Anyone* → Deploy → Authorize → copy the **/exec** URL.
4. Paste it into `docs/app.js` → `CONFIG.BACKEND_URL`.

### B. Site (GitHub Pages)
1. Push the repo to GitHub (public). Confirm `git status` does **not** list
   `answer_key.json` (it's gitignored).
2. **Settings ▸ Pages** → Source: *Deploy from a branch* → Branch `main`,
   Folder `/docs` → Save.
3. Live at `https://<username>.github.io/<repo>/`.

### C. Verify
- These must **404** (answer key not public):
  `…/answer_key.json` and `…/docs/answer_key.json`.
- Take a test, submit, confirm the score + explanations show and a new row
  appears in the **"VicThree — Mock Test Results"** sheet (with Test column).

---

## Results spreadsheet
Each submission appends a row to *"VicThree — Mock Test Results"* in your Drive:
**Timestamp · Test · Name · Roll · Score · Out of**. Filter or pivot by the
**Test** column to see results per test.

## Customising
- **Banner:** drop `docs/assets/banner.png` (wide, ~960×200) — replaces the
  text brand block automatically on every page.
- **Colours / timer / titles:** `:root` vars in `styles.css`; `durationMin` and
  `title` inside each `tests/<id>.json`.
