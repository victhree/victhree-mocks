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

  hide($("startScreen"));
  show($("quizScreen"));

  buildPalette();
  renderQuestion();
  startTimer();
}

/* ============================================================
   TIMER
   ============================================================ */
function startTimer() {
  updateTimerDisplay();
  state.timerId = setInterval(() => {
    state.remaining--;
    updateTimerDisplay();

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
function renderQuestion() {
  const q = state.questions[state.current];
  if (!q) return;

  $("progressLabel").textContent = `${state.current + 1} / ${state.questions.length}`;
  $("qNum").textContent = q.n;
  $("qStem").textContent = q.stem;

  // PYQ tag
  const tag = $("pyqTag");
  if (q.pyq) {
    tag.textContent = "Previous Year — " + q.pyq;
    show(tag);
  } else {
    hide(tag);
  }

  // Sub-statements
  const subs = $("qSubs");
  subs.innerHTML = "";
  (q.subs || []).forEach((line) => {
    const li = document.createElement("li");
    li.textContent = line;
    subs.appendChild(li);
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

  // Nav button states
  $("prevBtn").disabled = state.current === 0;
  $("nextBtn").disabled = state.current === state.questions.length - 1;

  updatePaletteHighlight();
}

function selectOption(qNum, letter) {
  state.answers[qNum] = letter;
  renderQuestion();
  refreshCounts();
}

function clearChoice() {
  const q = state.questions[state.current];
  delete state.answers[q.n];
  renderQuestion();
  refreshCounts();
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
    b.classList.toggle("current", idx === state.current);
  });
}

function refreshCounts() {
  const answered = Object.keys(state.answers).length;
  const total = state.questions.length;
  $("answeredCount").textContent = answered;
  $("remainingCount").textContent = total - answered;
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
    /* IMPORTANT (CORS): we send Content-Type "text/plain" so the browser
       treats this as a "simple request" and does NOT fire a CORS preflight,
       which Apps Script cannot answer. The body is still JSON text that the
       script parses with JSON.parse(e.postData.contents). */
    const res = await fetch(CONFIG.BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (data && data.ok === false) throw new Error(data.error || "Grading failed");
    hide($("overlay"));
    showResults(data);
  } catch (err) {
    hide($("overlay"));
    console.error(err);
    alert(
      "Could not reach the grading server. Please check your internet connection.\n\n" +
      "Your answers are still saved on this page — you may try Submit again."
    );
    state.submitted = false; // allow retry
  }
}

function showResults(data) {
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

  $("resName").textContent = state.name;
  $("scoreVal").textContent = data.total != null ? data.total : right;
  $("scoreMax").textContent = max;
  $("rightCount").textContent = right;
  $("wrongCount").textContent = wrong;
  $("skipCount").textContent = skip;

  // Per-question review (joined with local question text)
  const byNum = {};
  state.questions.forEach((q) => (byNum[q.n] = q));

  const review = $("review");
  review.innerHTML = "";
  results.forEach((r) => {
    const q = byNum[r.n] || {};
    const status = r.chosen == null ? "skipped" : r.isCorrect ? "correct" : "wrong";
    const badgeText = status === "correct" ? "Correct" : status === "wrong" ? "Wrong" : "Not attempted";

    const chosenText = r.chosen ? optText(q, r.chosen) : "—";
    const correctText = r.correctText || (r.correct ? optText(q, r.correct) : "");

    const card = document.createElement("div");
    card.className = `card rev-card ${status}`;
    card.innerHTML = `
      <div class="rev-head">
        <p class="rev-q">Q${r.n}. ${escapeHtml(q.stem || "")}</p>
        <span class="rev-badge badge-${status}">${badgeText}</span>
      </div>
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
      ${q.pyq ? `<div class="rev-pyq">Previous Year — ${escapeHtml(q.pyq)}</div>` : ""}
    `;
    review.appendChild(card);
  });
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
    if (state.current > 0) { state.current--; renderQuestion(); }
  });
  $("nextBtn").addEventListener("click", () => {
    if (state.current < state.questions.length - 1) { state.current++; renderQuestion(); }
  });
  $("clearBtn").addEventListener("click", clearChoice);
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
