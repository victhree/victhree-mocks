# VicThree Defence — CDS Geography Mock Test

A free, timed, mobile-friendly mock-test site for CDS Geography prep.
Front-end on **GitHub Pages**, grading on a **Google Apps Script** backend so
the answer key never reaches the browser.

```
victhree-cds-geo/
├── docs/                ← GitHub Pages serves ONLY this folder (public)
│   ├── index.html
│   ├── styles.css
│   ├── app.js           ← set CONFIG.BACKEND_URL here
│   ├── questions.json   ← no answers, safe to serve
│   └── assets/          ← drop banner.png here for the header
├── Code.gs              ← Apps Script backend (answer key embedded inside)
├── answer_key.json      ← source-of-truth, GITIGNORED (never pushed)
├── .gitignore
└── README.md
```

> 🔒 **Why the answer key stays secret:** it is outside `docs/` (so Pages never
> serves it), it is gitignored (so it never reaches GitHub), and grading uses
> the copy embedded inside `Code.gs`, which only runs on Google's servers.

---

## Part A — Deploy the Apps Script backend

1. Go to **https://script.google.com** → **New project**.
2. Delete the starter code, then paste in the entire contents of **`Code.gs`**.
3. Click **Save** (💾) and name the project, e.g. *VicThree CDS Grader*.
4. *(Optional)* In the function dropdown choose **`setup`** → **Run**. Approve
   the authorization prompt. This creates the results spreadsheet
   *"VicThree CDS — Mock Test Results"* in your Google Drive up front.
5. Click **Deploy ▸ New deployment**.
   - **Select type** → ⚙ → **Web app**
   - **Execute as:** *Me*
   - **Who has access:** **Anyone**
   - **Deploy** → **Authorize access** → allow permissions.
6. Copy the **Web app URL** (it ends in `/exec`).
   Test it: open the URL in a browser — you should see
   `{"ok":true,"message":"VicThree CDS grader is running...."}`.

> Whenever you edit `Code.gs` later, go to **Deploy ▸ Manage deployments ▸**
> ✏️ edit ▸ **Version: New version ▸ Deploy** so changes go live. The `/exec`
> URL stays the same.

### Where submissions are logged
Each submission appends a row — **Timestamp, Name, Roll, Score, Out of** — to the
*Submissions* tab of *"VicThree CDS — Mock Test Results"* in your Drive.

---

## Part B — Connect the site to the backend

1. Open **`docs/app.js`**.
2. Paste your `/exec` URL into the config at the top:
   ```js
   const CONFIG = {
     BACKEND_URL: "https://script.google.com/macros/s/AKfyc..../exec",
   };
   ```
3. Save.

> If you leave the placeholder, the test still runs but shows an
> "offline / grading unavailable" message instead of a score.

---

## Part C — Put the repo on GitHub & enable Pages

1. Create a new repository on GitHub (e.g. `victhree-cds-geo`), **public**
   (Pages is free for public repos).
2. From this folder, push it up:
   ```bash
   git init
   git add .
   git commit -m "VicThree CDS Geography mock test"
   git branch -M main
   git remote add origin https://github.com/<your-username>/victhree-cds-geo.git
   git push -u origin main
   ```
   `answer_key.json` is gitignored, so confirm it is **not** listed by
   `git status` before committing.
3. On GitHub: **Settings ▸ Pages**.
   - **Source:** *Deploy from a branch*
   - **Branch:** `main`  **Folder:** `/docs` → **Save**.
4. Wait ~1 minute. Your site goes live at:
   `https://<your-username>.github.io/victhree-cds-geo/`

---

## Part D — Verify end-to-end

1. Open the live URL on a phone and a laptop.
2. Confirm the answer key is unreachable — these must **404 / fail**:
   - `https://<you>.github.io/victhree-cds-geo/answer_key.json`
   - `https://<you>.github.io/victhree-cds-geo/docs/answer_key.json`
3. Take the test, submit, and check the score + explanations appear, and a new
   row shows up in the results spreadsheet.

---

## Customising

- **Banner:** drop an image at `docs/assets/banner.png` (wide, ~960×200). It
  replaces the text brand block automatically.
- **Questions:** edit `docs/questions.json`. If you add/remove questions, update
  `ANSWER_KEY` in `Code.gs` to match (keys are question numbers as strings) and
  redeploy a new version.
- **Timer / title:** controlled by `durationMin` and `title` in `questions.json`.
- **Colours:** edit the `:root` variables at the top of `docs/styles.css`.
