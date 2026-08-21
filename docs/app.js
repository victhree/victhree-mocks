/* ============================================================
   VicThree Defence — Mock Test (quiz engine)
   Front-end logic. Contains NO answers — grading is server-side.
   Loads tests/<id>.json based on the ?test=<id> URL parameter.
   ============================================================ */

/* ---------- CONFIG ----------
   Paste your deployed Google Apps Script web-app URL here.
   It looks like: https://script.google.com/macros/s/AKfyc.../exec
   Until you set this, the test runs in OFFLINE mode (no grading). */
const CONFIG = {
  BACKEND_URL: "https://script.google.com/macros/s/AKfycbzUGUtE-pPBXSaO7TSYitP3jOjmaeK6x-QApKnV1rVxBYYNGJuaOQad3-w5zpD9M-RgYA/exec",
};
/* ----------------------------- */

const LETTERS = ["a", "b", "c", "d"];

const state = {
  testId: null,      // which test (from ?test=...)
  quiz: null,        // loaded test JSON
  questions: [],
  current: 0,        // index into questions[]
  answers: {},       // { questionNumber: "a"|"b"|"c"|"d" }
  marked: {},        // { questionNumber: true }  (flagged for review)
  guesses: {},       // { questionNumber: true }  (student flagged it a guess)
  name: "",
  durationSec: 60 * 60,
  remaining: 60 * 60,
  timerId: null,
  warned: false,
  submitted: false,
};

/* ---------- tiny DOM helpers ---------- */
const $ = (id) => document.getElementById(id);
const show = (el) => el.removeAttribute("hidden");
const hide = (el) => el.setAttribute("hidden", "");

/* A "full mock" is any test whose JSON defines a `scoring` block — it gets
   weighted marks + negative marking, the Guess-Answer checkbox, and the
   subject-wise report. Single-subject tests have no scoring block and behave
   exactly as before (1 mark each, no negative, no guess UI). */
function isFullMock() { return !!(state.quiz && state.quiz.scoring); }

/* ---------- Auto-save / resume (localStorage, per test) ---------- */
function stateKey() { return "v3quiz:" + (state.testId || "unknown"); }
function saveState() {
  try {
    localStorage.setItem(stateKey(), JSON.stringify({
      name: state.name,
      answers: state.answers,
      marked: state.marked,
      guesses: state.guesses,
      current: state.current,
      remaining: state.remaining,
      warned: state.warned,
      ts: Date.now(),
    }));
  } catch (e) { /* storage unavailable (private mode/quota) — ignore */ }
}
function loadState() {
  try { return JSON.parse(localStorage.getItem(stateKey()) || "null"); }
  catch (e) { return null; }
}
function clearState() {
  try { localStorage.removeItem(stateKey()); } catch (e) { /* ignore */ }
}

/* Last graded result is kept separately so it survives a refresh/close and the
   student can reopen their score + full answer review any time. */
function resultKey() { return "v3result:" + (state.testId || "unknown"); }
function saveResult(data) {
  try {
    localStorage.setItem(resultKey(), JSON.stringify({
      name: state.name,
      data: data,
      ts: Date.now(),
    }));
  } catch (e) { /* storage unavailable — ignore */ }
}
function loadResult() {
  try { return JSON.parse(localStorage.getItem(resultKey()) || "null"); }
  catch (e) { return null; }
}

/* Read ?test=<id> from the URL. */
function getTestId() {
  const params = new URLSearchParams(window.location.search);
  const id = (params.get("test") || "").trim();
  // allow only safe filename characters (no path traversal)
  return /^[A-Za-z0-9_-]+$/.test(id) ? id : "";
}

/* ============================================================
   LOAD QUESTIONS
   ============================================================ */
async function loadQuiz() {
  state.testId = getTestId();

  // No/invalid test id → send the student back to the test list.
  if (!state.testId) {
    window.location.replace("index.html");
    return;
  }

  try {
    const res = await fetch("tests/" + state.testId + ".json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    state.quiz = data;
    state.questions = data.questions || [];
    state.durationSec = (data.durationMin || 60) * 60;
    state.remaining = state.durationSec;

    // Fill start-screen meta
    $("quizTitle").textContent = data.title || "Mock Test";
    document.title = (data.title || "Mock Test") + " — VicThree Defence";
    $("qCount").textContent = state.questions.length;
    $("durLabel").textContent = data.durationMin || 60;
    $("scoreMax").textContent = state.questions.length;
    $("remainingCount").textContent = state.questions.length;

    if (isFullMock()) {
      const neg = state.quiz.scoring.negativeFraction;
      const negLabel = Math.abs(neg - 1 / 3) < 0.02 ? "1/3" : neg;
      $("metaScoring").textContent =
        state.quiz.scoring.totalMarks + " marks · " + negLabel + " negative marking · auto-submit at time-up";
    }

    offerResume();
    offerLastResult();
    applyAccessWindow();
  } catch (err) {
    $("startError").textContent =
      'Could not load this test ("' + state.testId + '"). It may not exist. Go back to the test list and try again.';
    show($("startError"));
    $("startBtn").disabled = true;
    console.error(err);
  }
}

/* ============================================================
   START
   ============================================================ */
function startTest() {
  const name = $("nameInput").value.trim();
  if (!name) {
    $("startError").textContent = "Please enter your name.";
    show($("startError"));
    return;
  }
  hide($("startError"));
  state.name = name;

  hide($("resumeBox"));
  hide($("startScreen"));
  show($("quizScreen"));

  buildPalette();
  renderQuestion();
  startTimer();
  saveState();
}

/* If a started, unfinished attempt exists for this test, offer to resume it. */
function offerResume() {
  const saved = loadState();
  if (!saved || typeof saved.remaining !== "number") return;
  if (saved.remaining <= 0 || saved.remaining >= state.durationSec) { return; }
  const answered = saved.answers ? Object.keys(saved.answers).length : 0;
  const m = Math.floor(saved.remaining / 60), s = saved.remaining % 60;
  $("resumeInfo").textContent =
    `${answered} answered · ${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} left`;
  show($("resumeBox"));
}

function resumeTest() {
  const saved = loadState();
  if (!saved) { startFresh(); return; }
  state.name = saved.name || "Student";
  state.answers = saved.answers || {};
  state.marked = saved.marked || {};
  state.guesses = saved.guesses || {};
  state.current = saved.current || 0;
  state.remaining = (typeof saved.remaining === "number") ? saved.remaining : state.durationSec;
  state.warned = !!saved.warned;

  hide($("resumeBox"));
  hide($("startScreen"));
  show($("quizScreen"));

  buildPalette();
  renderQuestion();
  if (state.remaining <= 300) { $("timer").classList.add("warn"); }
  startTimer();
}

function startFresh() {
  clearState();
  hide($("resumeBox"));
}

/* If a graded result was saved for this test, offer to reopen it. */
function offerLastResult() {
  const saved = loadResult();
  if (!saved || !saved.data) return;
  const d = saved.data;
  const score = (d.total != null ? d.total : "—") + "/" + (d.max || state.questions.length);
  let dateStr = "";
  if (saved.ts) {
    const dt = new Date(saved.ts);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    dateStr = dt.getDate() + " " + months[dt.getMonth()] + " " + dt.getFullYear();
  }
  $("lastResultDate").textContent = dateStr;
  $("lastResultScore").textContent = score;
  show($("lastResultBox"));
}

function viewLastResult() {
  const saved = loadResult();
  if (!saved || !saved.data) return;
  state.name = saved.name || "Student";
  showResults(saved.data, true);
}

/* Timed access window. The test JSON may carry:
   "window": { "start": "2026-08-22T10:00", "end": "2026-08-22T12:00",
               "timingsLabel": "10:00 AM – 12:00 PM", "dateLabel": "22 August 2026" }
   Times are interpreted in IST (UTC+5:30). Outside the window the start form is
   replaced by a message; inside it, everything works normally. No window = always open. */
function applyAccessWindow() {
  const w = state.quiz && state.quiz.window;
  if (!w || !w.start || !w.end) return; // always open

  const startMs = Date.parse(w.start + ":00+05:30");
  const endMs = Date.parse(w.end + ":00+05:30");
  const now = Date.now();
  if (isNaN(startMs) || isNaN(endMs)) return; // bad config → don't lock anyone out

  const timings = w.timingsLabel || "";
  const dateLabel = w.dateLabel || "";
  const line = "Test timings: " + timings + (dateLabel ? " · " + dateLabel : "");

  let msg = "";
  if (now < startMs) {
    msg =
      '<p class="gate-line">' + line + "</p>" +
      '<p class="gate-note">This test has not opened yet. Please come back during the test window.</p>';
  } else if (now > endMs) {
    msg =
      '<p class="gate-line">' + line + "</p>" +
      '<p class="gate-note">Sorry, you are late. You cannot attempt this test.</p>';
  } else {
    return; // inside the window → open
  }

  const gate = $("startGate");
  gate.innerHTML = msg;
  show(gate);
  hide($("startBody"));
}

/* ============================================================
   TIMER
   ============================================================ */
function startTimer() {
  updateTimerDisplay();
  state.timerId = setInterval(() => {
    state.remaining--;
    updateTimerDisplay();
    saveState();

    // 5-minute warning
    if (state.remaining <= 300 && !state.warned) {
      state.warned = true;
      $("timer").classList.add("warn");
      alert("⚠ 5 minutes remaining. The test will auto-submit at 00:00.");
    }
    if (state.remaining <= 0) {
      clearInterval(state.timerId);
      submitTest(true); // auto-submit
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(state.remaining / 60);
  const s = state.remaining % 60;
  $("timer").textContent =
    String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

/* ============================================================
   QUESTION RENDERING
   ============================================================ */
// Split a single line like "1. A  2. B  3. C" into ["1. A","2. B","3. C"].
// Only triggers when the line starts with a single-digit item and contains
// another single-digit item marker (so years/decimals and match-rows are safe).
function splitNumberedRun(line) {
  const t = (line || "").trim();
  if (/^[1-9]\.\s/.test(t) && /\s[1-9]\.\s/.test(t)) {
    return t.split(/\s+(?=[1-9]\.\s)/).map((s) => s.trim()).filter(Boolean);
  }
  return [t];
}

function renderQuestion() {
  const q = state.questions[state.current];
  if (!q) return;

  $("progressLabel").textContent = `${state.current + 1} / ${state.questions.length}`;
  $("qNum").textContent = q.n;
  // Stem + sub-statements.
  // For "Statement I / Statement II" questions, show BOTH statements as
  // normal-weight lines (don't bold Statement I as the stem).
  let stemText = q.stem || "";
  let subLines = (q.subs || []).slice();
  if (/^\s*statement\s+i\b/i.test(stemText)) {
    subLines = [stemText].concat(subLines);
    stemText = "";
  }
  $("qStem").textContent = stemText;
  $("qStem").style.display = stemText ? "" : "none";

  // (PYQ tag intentionally NOT shown during the quiz — it appears only in
  //  the answer/explanation review on the results page.)

  // Sub-statements (split any "1. .. 2. .. 3. .." run onto separate lines)
  const subs = $("qSubs");
  subs.innerHTML = "";
  subLines.forEach((line) => {
    splitNumberedRun(line).forEach((piece) => {
      const li = document.createElement("li");
      li.textContent = piece;
      subs.appendChild(li);
    });
  });

  // Options
  const wrap = $("qOptions");
  wrap.innerHTML = "";
  q.options.forEach((opt, i) => {
    const letter = LETTERS[i];
    const div = document.createElement("div");
    div.className = "option" + (state.answers[q.n] === letter ? " selected" : "");
    div.innerHTML = `<span class="letter">${letter}</span><span class="opt-text"></span>`;
    div.querySelector(".opt-text").textContent = opt;
    div.addEventListener("click", () => selectOption(q.n, letter));
    wrap.appendChild(div);
  });

  // Mark-for-review button state
  const isMarked = state.marked[q.n] != null;
  const mb = $("markBtn");
  if (mb) {
    mb.classList.toggle("active", isMarked);
    mb.textContent = isMarked ? "★ Marked for review" : "☆ Mark for review";
  }

  // Nav button states
  $("prevBtn").disabled = state.current === 0;
  $("nextBtn").disabled = state.current === state.questions.length - 1;

  // Guess-Answer checkbox (full mocks only)
  const gw = $("guessWrap");
  if (isFullMock()) {
    show(gw);
    $("guessBox").checked = !!state.guesses[q.n];
  } else {
    hide(gw);
  }

  updatePaletteHighlight();
}

function toggleGuess() {
  const q = state.questions[state.current];
  if (!q) return;
  if ($("guessBox").checked) state.guesses[q.n] = true;
  else delete state.guesses[q.n];
  saveState();
}

function toggleMark() {
  const q = state.questions[state.current];
  if (!q) return;
  if (state.marked[q.n]) delete state.marked[q.n];
  else state.marked[q.n] = true;
  renderQuestion();
  refreshCounts();
  saveState();
}

function selectOption(qNum, letter) {
  state.answers[qNum] = letter;
  renderQuestion();
  refreshCounts();
  saveState();
}

function clearChoice() {
  const q = state.questions[state.current];
  delete state.answers[q.n];
  renderQuestion();
  refreshCounts();
  saveState();
}

/* ============================================================
   PALETTE
   ============================================================ */
function buildPalette() {
  const pal = $("palette");
  pal.innerHTML = "";
  state.questions.forEach((q, idx) => {
    const b = document.createElement("button");
    b.className = "pal-btn";
    b.textContent = q.n;
    b.dataset.idx = idx;
    b.addEventListener("click", () => {
      state.current = idx;
      renderQuestion();
      saveState();
    });
    pal.appendChild(b);
  });
  refreshCounts();
}

function updatePaletteHighlight() {
  const buttons = $("palette").querySelectorAll(".pal-btn");
  buttons.forEach((b) => {
    const idx = Number(b.dataset.idx);
    const q = state.questions[idx];
    b.classList.toggle("answered", state.answers[q.n] != null);
    b.classList.toggle("marked", state.marked[q.n] != null);
    b.classList.toggle("current", idx === state.current);
  });
}

function refreshCounts() {
  const answered = Object.keys(state.answers).length;
  const total = state.questions.length;
  $("answeredCount").textContent = answered;
  $("remainingCount").textContent = total - answered;
  const mc = $("markedCount");
  if (mc) mc.textContent = Object.keys(state.marked).length;
  updatePaletteHighlight();
}

/* ============================================================
   SUBMIT  +  RESULTS
   ============================================================ */
async function submitTest(auto = false) {
  if (state.submitted) return;

  const answeredCount = Object.keys(state.answers).length;
  if (!auto) {
    const unanswered = state.questions.length - answeredCount;
    const msg =
      unanswered > 0
        ? `You have ${unanswered} unanswered question(s). Submit anyway?`
        : "Submit your test for grading?";
    if (!confirm(msg)) return;
  }

  state.submitted = true;
  clearInterval(state.timerId);
  show($("overlay"));
  $("overlayMsg").textContent = auto ? "Time up — submitting…" : "Submitting your answers…";

  const payload = {
    testId: state.testId,
    name: state.name,
    answers: state.answers,
  };

  // OFFLINE fallback if no backend configured
  if (!CONFIG.BACKEND_URL || CONFIG.BACKEND_URL.startsWith("PASTE_")) {
    hide($("overlay"));
    alert(
      "Backend URL not configured. Your answers were recorded locally but cannot be graded.\n" +
      "Set CONFIG.BACKEND_URL in app.js to enable server-side grading."
    );
    showResults({
      total: 0,
      max: state.questions.length,
      results: state.questions.map((q) => ({
        n: q.n,
        chosen: state.answers[q.n] || null,
        correct: null,
        isCorrect: false,
        correctText: "(grading unavailable in offline mode)",
        exp: "",
      })),
    });
    return;
  }

  try {
    const data = await postWithRetry(CONFIG.BACKEND_URL, JSON.stringify(payload));
    hide($("overlay"));
    showResults(data);
  } catch (err) {
    hide($("overlay"));
    console.error(err);
    alert(
      "Could not reach the grading server after several tries. Please check your internet connection.\n\n" +
      "Your answers are still saved on this page — you may press Submit again."
    );
    state.submitted = false; // allow manual retry
  }
}

/* POST to the Apps Script backend with auto-retry + per-attempt timeout.
   Apps Script can be slow / return a transient error on a cold start; retries
   almost always succeed within a couple of seconds.
   NOTE (CORS): Content-Type "text/plain" keeps this a "simple request" so the
   browser skips the preflight Apps Script can't answer. The body is still JSON
   that the script reads via JSON.parse(e.postData.contents). */
async function postWithRetry(url, body, tries = 4, timeoutMs = 15000) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: body,
        redirect: "follow",
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const txt = await res.text();
      const data = JSON.parse(txt); // throws if a transient HTML error page came back
      if (data && data.ok === false) throw new Error(data.error || "Grading failed");
      return data;
    } catch (e) {
      clearTimeout(timer);
      lastErr = e;
      if (i < tries - 1) {
        $("overlayMsg").textContent = `Submitting your answers… (retry ${i + 2}/${tries})`;
        await new Promise((r) => setTimeout(r, 1200));
      }
    }
  }
  throw lastErr;
}

function showResults(data, fromSaved) {
  clearState(); // attempt finished — drop saved progress
  if (!fromSaved) saveResult(data); // keep the graded result so it survives refresh/close
  hide($("startScreen"));
  hide($("resumeBox"));
  hide($("lastResultBox"));
  hide($("quizScreen"));
  show($("resultsScreen"));
  window.scrollTo(0, 0);

  const results = data.results || [];
  const max = data.max || state.questions.length;
  let right = 0, wrong = 0, skip = 0;

  results.forEach((r) => {
    if (r.chosen == null) skip++;
    else if (r.isCorrect) right++;
    else wrong++;
  });

  const scoreNum = data.total != null ? data.total : right;
  $("resName").textContent = state.name;
  const scored = isFullMock() && data.marks != null;
  if (scored) {
    $("scoreVal").textContent = fmtMarks(data.marks);
    $("scoreMax").textContent = data.marksMax;
    const negLabel = state.quiz.scoring && Math.abs(state.quiz.scoring.negativeFraction - 1 / 3) < 0.02
      ? "1/3" : (state.quiz.scoring ? state.quiz.scoring.negativeFraction : "");
    $("scoreNote").textContent =
      "Marks after " + negLabel + " negative marking · " + right + " right, " + wrong + " wrong";
    show($("scoreNote"));
  } else {
    $("scoreVal").textContent = scoreNum;
    $("scoreMax").textContent = max;
    hide($("scoreNote"));
  }
  $("rightCount").textContent = right;
  $("wrongCount").textContent = wrong;
  $("skipCount").textContent = skip;

  const attempted = right + wrong;
  const accuracy = attempted > 0 ? Math.round((right / attempted) * 100) : 0;
  $("accuracyVal").textContent = accuracy + "%";

  // Map question number -> question (for text + topic)
  const byNum = {};
  state.questions.forEach((q) => (byNum[q.n] = q));

  buildReport(results, byNum,
    scored ? fmtMarks(data.marks) : scoreNum,
    scored ? data.marksMax : max,
    right, attempted, accuracy);

  const review = $("review");
  review.innerHTML = "";
  results.forEach((r) => {
    const q = byNum[r.n] || {};
    const status = r.chosen == null ? "skipped" : r.isCorrect ? "correct" : "wrong";
    const badgeText = status === "correct" ? "Correct" : status === "wrong" ? "Wrong" : "Not attempted";

    const chosenText = r.chosen ? optText(q, r.chosen) : "—";
    const correctText = r.correctText || (r.correct ? optText(q, r.correct) : "");

    // Full question exactly as it was asked: stem + numbered statements + options.
    // (Same "Statement I / II" handling as the quiz screen.)
    let stemText = q.stem || "";
    let subLines = (q.subs || []).slice();
    if (/^\s*statement\s+i\b/i.test(stemText)) {
      subLines = [stemText].concat(subLines);
      stemText = "";
    }
    const subsHtml = subLines
      .flatMap((line) => splitNumberedRun(line))
      .map((piece) => `<li>${escapeHtml(piece)}</li>`)
      .join("");

    const optsHtml = (q.options || [])
      .map((opt, i) => {
        const letter = LETTERS[i];
        const isCorrect = r.correct && letter === r.correct;
        const isChosenWrong = r.chosen && letter === r.chosen && !r.isCorrect;
        const cls = isCorrect ? "rev-opt is-correct" : isChosenWrong ? "rev-opt is-wrong" : "rev-opt";
        return `<li class="${cls}"><span class="rev-opt-letter">${letter.toUpperCase()}</span><span>${escapeHtml(opt)}</span></li>`;
      })
      .join("");

    // PYQ tag shown WITH the question (top of the card), not after the solution.
    const pyqHtml = q.pyq ? `<span class="rev-pyq">Previous Year — ${escapeHtml(q.pyq)}</span>` : "";

    const card = document.createElement("div");
    card.className = `card rev-card ${status}`;
    card.innerHTML = `
      <div class="rev-head">
        <p class="rev-q">Q${r.n}. ${escapeHtml(stemText)} ${pyqHtml}</p>
        <span class="rev-badge badge-${status}">${badgeText}</span>
      </div>
      ${subsHtml ? `<ul class="rev-subs">${subsHtml}</ul>` : ""}
      ${optsHtml ? `<ul class="rev-opts">${optsHtml}</ul>` : ""}
      <p class="rev-line"><span class="lbl">Your answer:</span>
        <span class="${status === "correct" ? "ans-right" : status === "wrong" ? "ans-wrong" : ""}">
          ${r.chosen ? r.chosen.toUpperCase() + ") " + escapeHtml(chosenText) : "Not attempted"}
        </span></p>
      ${
        status !== "correct" && r.correct
          ? `<p class="rev-line"><span class="lbl">Correct answer:</span>
               <span class="ans-right">${r.correct.toUpperCase()}) ${escapeHtml(correctText)}</span></p>`
          : ""
      }
      ${r.exp ? `<div class="rev-exp">${escapeHtml(r.exp)}</div>` : ""}
    `;
    review.appendChild(card);
  });
}

/* ---------- Detailed performance report ---------- */
function fmtMMSS(sec) {
  sec = Math.max(0, Math.round(sec));
  const m = Math.floor(sec / 60), s = sec % 60;
  return m + ":" + String(s).padStart(2, "0");
}
function fmtAvg(sec) {
  sec = Math.round(sec);
  if (sec < 60) return sec + "s";
  return Math.floor(sec / 60) + "m " + (sec % 60) + "s";
}
function fmtMarks(m) {
  const v = Math.round(m * 100) / 100;
  return Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

/* Subject-wise performance + guess accuracy (full mocks only). */
function renderSubjectReport(results, byNum) {
  const subs = {};
  const order = [];
  let gTotal = 0, gRight = 0;
  results.forEach((r) => {
    const q = byNum[r.n] || {};
    const name = q.subject || q.topic || "Other";
    if (!subs[name]) { subs[name] = { att: 0, right: 0, wrong: 0, gTot: 0, gRight: 0 }; order.push(name); }
    const s = subs[name];
    if (r.chosen != null) { s.att++; if (r.isCorrect) s.right++; else s.wrong++; }
    if (state.guesses[r.n]) {
      s.gTot++; gTotal++;
      if (r.isCorrect) { s.gRight++; gRight++; }
    }
  });
  const tbody = $("subjectRows");
  tbody.innerHTML = "";
  order.forEach((name) => {
    const s = subs[name];
    const acc = s.att ? Math.round((s.right / s.att) * 100) : 0;
    const tr = document.createElement("tr");
    tr.innerHTML =
      `<td class="subj-name">${escapeHtml(name)}</td>` +
      `<td>${s.att}</td><td class="c-right">${s.right}</td><td class="c-wrong">${s.wrong}</td>` +
      `<td>${acc}%</td><td>${s.gRight}/${s.gTot}</td>`;
    tbody.appendChild(tr);
  });
  $("guessSummary").textContent = gTotal
    ? `Guesses: ${gRight} of ${gTotal} guessed answers were correct (${Math.round((gRight / gTotal) * 100)}% of guesses).`
    : "You did not flag any answer as a guess.";
}

function renderTopicBars(results, byNum) {
  const wrap = $("topicBars");
  const topics = {};
  let any = false;
  results.forEach((r) => {
    const q = byNum[r.n] || {};
    const name = q.topic || "Other";
    if (q.topic) any = true;
    if (!topics[name]) topics[name] = { total: 0, correct: 0 };
    topics[name].total++;
    if (r.isCorrect) topics[name].correct++;
  });
  const rows = Object.keys(topics).map((name) => {
    const t = topics[name];
    const pct = t.total ? Math.round((t.correct / t.total) * 100) : 0;
    return { name, total: t.total, correct: t.correct, pct };
  }).sort((a, b) => a.pct - b.pct || b.total - a.total); // weakest first

  if (wrap) {
    wrap.innerHTML = "";
    rows.forEach((row) => {
      const band = row.pct >= 75 ? "good" : row.pct >= 40 ? "mid" : "low";
      const div = document.createElement("div");
      div.className = "topic-row";
      div.innerHTML = `
        <div class="topic-head">
          <span class="topic-name">${escapeHtml(row.name)}</span>
          <span class="topic-score">${row.correct}/${row.total} · ${row.pct}%</span>
        </div>
        <div class="topic-track"><div class="topic-fill ${band}" style="width:${row.pct}%"></div></div>`;
      wrap.appendChild(div);
    });
  }
  return any ? rows : [];
}

function buildReport(results, byNum, score, max, right, attempted, accuracy) {
  $("reportTitle").textContent = (state.quiz && state.quiz.title) ? state.quiz.title : "Performance Report";
  $("reportName").textContent = state.name || "Student";
  $("reportDate").textContent = new Date().toLocaleString(undefined, {
    day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit",
  });
  $("reportScore").textContent = score + "/" + max;
  $("reportAccuracy").textContent = accuracy + "%";

  const timeTaken = Math.max(0, state.durationSec - state.remaining);
  $("reportTime").textContent = fmtMMSS(timeTaken) + " / " + fmtMMSS(state.durationSec);
  $("reportAvg").textContent = attempted > 0 ? fmtAvg(timeTaken / attempted) : "—";

  // Full mocks show the richer subject-wise table (with guess stats) instead of
  // the single-subject topic bars.
  if (isFullMock()) {
    hide($("topicSection"));
    show($("subjectSection"));
    renderSubjectReport(results, byNum);
  } else {
    show($("topicSection"));
    hide($("subjectSection"));
  }

  // Topic bars (sorted weakest-first) + highlights
  const rows = renderTopicBars(results, byNum);
  const hl = $("reportHighlights");
  hl.innerHTML = "";
  if (rows.length) {
    const strongest = rows[rows.length - 1]; // highest pct
    const weakest = rows[0];                  // lowest pct
    const s = document.createElement("div");
    s.className = "report-hl strong";
    s.textContent = `Strongest: ${strongest.name} (${strongest.pct}%)`;
    hl.appendChild(s);
    if (rows.length > 1) {
      const w = document.createElement("div");
      w.className = "report-hl weak";
      w.textContent = `Revise first: ${weakest.name} (${weakest.pct}%)`;
      hl.appendChild(w);
    }
  }
}

function optText(q, letter) {
  const i = LETTERS.indexOf(letter);
  return q.options && q.options[i] ? q.options[i] : "";
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/* ============================================================
   WIRING
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {
  loadQuiz();

  $("startBtn").addEventListener("click", startTest);
  $("nameInput").addEventListener("keydown", (e) => { if (e.key === "Enter") startTest(); });

  $("prevBtn").addEventListener("click", () => {
    if (state.current > 0) { state.current--; renderQuestion(); saveState(); }
  });
  $("nextBtn").addEventListener("click", () => {
    if (state.current < state.questions.length - 1) { state.current++; renderQuestion(); saveState(); }
  });
  $("clearBtn").addEventListener("click", clearChoice);
  $("markBtn").addEventListener("click", toggleMark);
  $("guessBox").addEventListener("change", toggleGuess);
  $("resumeBtn").addEventListener("click", resumeTest);
  $("freshBtn").addEventListener("click", startFresh);
  $("viewLastBtn").addEventListener("click", viewLastResult);

  $("reportToggle").addEventListener("click", () => {
    const panel = $("reportPanel");
    if (panel.hasAttribute("hidden")) {
      show(panel);
      $("reportToggle").textContent = "Hide Detailed Performance Report ▴";
    } else {
      hide(panel);
      $("reportToggle").textContent = "View Detailed Performance Report ▾";
    }
  });

  $("downloadReport").addEventListener("click", () => {
    const node = $("reportCapture");
    if (typeof html2canvas !== "function") {
      alert("Couldn't load the image library — check your connection and try again.");
      return;
    }
    html2canvas(node, { scale: 2, backgroundColor: "#ffffff", useCORS: true })
      .then((canvas) => {
        const safe = (state.name || "student").replace(/[^a-z0-9]+/gi, "_");
        const link = document.createElement("a");
        link.download = "VicThree_" + (state.testId || "test") + "_" + safe + ".png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      })
      .catch((err) => { console.error(err); alert("Sorry, couldn't generate the image."); });
  });
  $("submitBtn").addEventListener("click", () => submitTest(false));
  $("restartBtn").addEventListener("click", () => location.reload());

  // Warn before leaving mid-test
  window.addEventListener("beforeunload", (e) => {
    if (state.timerId && !state.submitted) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
});
