const questions = JSON.parse(document.getElementById('questions-data').textContent);
const scholarshipSelect = document.getElementById('scholarship-select');
const activeQuestionsContainer = document.getElementById('active-questions-container');
const comingSoonContainer = document.getElementById('coming-soon-container');
const comingSoonTitle = document.getElementById('coming-soon-title');
const comingSoonDesc = document.getElementById('coming-soon-desc');
const btnSwitchChevening = document.getElementById('btn-switch-chevening');

const select = document.getElementById('question-select');
const promptEcho = document.getElementById('prompt-echo');
const essayText = document.getElementById('essay-text');
const wordCountEl = document.getElementById('word-count');
const wordLimitNote = document.getElementById('word-limit-note');
const submitBtn = document.getElementById('submit-btn');
const marginEmpty = document.getElementById('margin-empty');
const marginResults = document.getElementById('margin-results');

const SCHOLARSHIP_DESCS = {
  mastercard: {
    name: "Mastercard Foundation Scholars Program",
    desc: "Developing transformative leaders across Africa with a focus on community giveback and transformative leadership.",
  },
  daad: {
    name: "DAAD Scholarships (Germany)",
    desc: "Development-related postgraduate courses (EPOS) funded by the German Academic Exchange Service.",
  },
  commonwealth: {
    name: "Commonwealth Scholarship",
    desc: "For talented individuals from Commonwealth nations to gain skills required for sustainable development impact.",
  },
  fulbright: {
    name: "Fulbright Foreign Student Program",
    desc: "US Department of State flagship international exchange program for graduate study and research.",
  },
  erasmus: {
    name: "Erasmus Mundus Joint Masters",
    desc: "High-level integrated European master degree programs across international universities.",
  },
};

function handleScholarshipChange() {
  const key = scholarshipSelect.value;
  if (key === 'chevening') {
    activeQuestionsContainer.style.display = 'block';
    comingSoonContainer.style.display = 'none';
  } else {
    activeQuestionsContainer.style.display = 'none';
    comingSoonContainer.style.display = 'block';
    const info = SCHOLARSHIP_DESCS[key] || { name: "Scholarship", desc: "This rubric is being prepared." };
    comingSoonTitle.textContent = `${info.name} — Coming Soon`;
    comingSoonDesc.textContent = `${info.desc} The reading committee rubric for this scholarship is currently being calibrated.`;
  }
}

if (scholarshipSelect) {
  scholarshipSelect.addEventListener('change', handleScholarshipChange);
}

if (btnSwitchChevening) {
  btnSwitchChevening.addEventListener('click', () => {
    scholarshipSelect.value = 'chevening';
    handleScholarshipChange();
  });
}

function currentQuestion() {
  return questions.find(q => q.key === select.value) || questions[0];
}

function updatePromptEcho() {
  const q = currentQuestion();
  if (!q) return;
  promptEcho.textContent = q.prompt;
  wordLimitNote.textContent = `limit: ${q.word_limit} words`;
  updateWordCount();
}

function updateWordCount() {
  const words = essayText.value.trim().split(/\s+/).filter(Boolean).length;
  const q = currentQuestion();
  const limit = q ? q.word_limit : 500;
  wordCountEl.textContent = `${words} words`;
  wordCountEl.className = words > limit ? 'over-limit' : '';
}

if (select) select.addEventListener('change', updatePromptEcho);
if (essayText) essayText.addEventListener('input', updateWordCount);
updatePromptEcho();

function render(data) {
  marginEmpty.hidden = true;
  marginResults.hidden = false;

  const wcLine = data.within_word_limit
    ? `${data.word_count} / ${data.word_limit} words — within limit`
    : `${data.word_count} / ${data.word_limit} words — OVER LIMIT`;
  const wcClass = data.within_word_limit ? '' : 'over-limit';

  let html = `
    <div class="stamp-wrap">
      <div class="stamp">
        <span class="stamp-score">${data.overall_score}</span>
        <span class="stamp-of">OUT OF 10</span>
      </div>
      <div class="stamp-meta">
        <div class="panel-line">Reading panel verdict</div>
        <div class="wc-line ${wcClass}">${wcLine}</div>
      </div>
    </div>

    <div class="section-heading">Assessment grid</div>
    <table class="grid-table">
      <tbody>
        ${data.criteria.map(c => `
          <tr>
            <td class="crit-name">${c.name}</td>
            <td class="crit-score">${c.score}/5</td>
            <td class="crit-note">${c.note}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="section-heading">Fix first</div>
    <ul class="suggestions">
      ${data.top_suggestions.map(s => `<li>${s}</li>`).join('')}
    </ul>
  `;

  if (data.line_notes && data.line_notes.length) {
    html += `<div class="section-heading">Margin notes</div>`;
    html += data.line_notes.map(n => `
      <div class="line-note">
        <span class="quote">"${n.quote}"</span>
        <span class="note">${n.note}</span>
      </div>
    `).join('');
  }

  marginResults.innerHTML = html;
}

function renderError(msg) {
  marginEmpty.hidden = true;
  marginResults.hidden = false;
  marginResults.innerHTML = `<div class="error-box">${msg}</div>`;
}

if (submitBtn) {
  submitBtn.addEventListener('click', async () => {
    const essay = essayText.value.trim();
    if (!essay) {
      renderError('Paste an essay first.');
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = 'Reading...';
    marginEmpty.hidden = true;
    marginResults.hidden = false;
    marginResults.innerHTML = `<p style="color: var(--paper-dim, var(--ink-soft)); font-style: italic;">Reading your essay against the rubric...</p>`;

    try {
      const payload = {
        scholarship_key: scholarshipSelect ? scholarshipSelect.value : 'chevening',
        question_key: select.value,
        essay_text: essay,
        user_id: window.currentUser ? window.currentUser.id : null
      };

      const res = await fetch('/api/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        renderError(data.error || 'Something went wrong.');
      } else {
        render(data);
      }
    } catch (e) {
      renderError('Could not reach the server: ' + e.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit for reading';
    }
  });
}
