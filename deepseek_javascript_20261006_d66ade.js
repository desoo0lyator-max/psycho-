/* =========================================================
   SelfEsteem Lab — логика теста
   ========================================================= */

const questions = [
  { q: "Как часто вы проверяете социальные сети в течение дня?",
    a: ["Пару раз в день", "Иногда", "Часто", "Каждый час", "Практически постоянно"] },

  { q: "Сравниваете ли вы свою внешность с людьми из ленты?",
    a: ["Никогда", "Редко", "Иногда", "Часто", "Постоянно"] },

  { q: "Как вы себя чувствуете, если публикация набрала мало лайков?",
    a: ["Не замечаю", "Почти не волнует", "Немного неприятно", "Расстраиваюсь", "Сильно расстраиваюсь, могу удалить пост"] },

  { q: "Бывает ли, что после просмотра ленты у вас портится настроение?",
    a: ["Никогда", "Редко", "Иногда", "Часто", "Почти всегда"] },

  { q: "Откладываете ли вы учёбу ради социальных сетей?",
    a: ["Никогда", "Редко", "Иногда", "Часто", "Постоянно"] },

  { q: "Трудно ли вам лечь спать вовремя из-за телефона?",
    a: ["Нет", "Редко", "Иногда", "Часто", "Каждую ночь"] },

  { q: "Сталкивались ли вы с неприятными комментариями или травлей в сети?",
    a: ["Нет", "Один раз", "Несколько раз", "Регулярно", "Постоянно"] },

  { q: "Считаете ли вы, что ваша жизнь скучнее, чем у других в соцсетях?",
    a: ["Нет, никогда", "Редко", "Иногда", "Часто", "Почти всегда"] },

  { q: "Испытываете ли вы тревогу, если не можете зайти в соцсети?",
    a: ["Нет", "Почти нет", "Иногда", "Да, заметную", "Очень сильную"] },

  { q: "Пытались ли вы сократить время в соцсетях и не смогли?",
    a: ["Не пробовал", "Получалось легко", "Иногда срываюсь", "Срываюсь часто", "Не могу сократить совсем"] },

  { q: "Мешает ли телефон вам общаться с друзьями и семьёй вживую?",
    a: ["Нет", "Редко", "Иногда", "Часто", "Постоянно"] },

  { q: "Ощущаете ли вы, что соцсети снижают вашу уверенность в себе?",
    a: ["Совсем нет", "Скорее нет", "Иногда", "Скорее да", "Определённо да"] }
];

let current = 0;
const answers = new Array(questions.length).fill(null);

/* ---------- Отрисовка вопросов ---------- */
const bodyEl = document.getElementById('quizBody');

questions.forEach((item, i) => {
  const div = document.createElement('div');
  div.className = 'question' + (i === 0 ? ' active' : '');
  div.dataset.index = i;

  const opts = item.a.map((text, j) => `
    <div class="option" data-q="${i}" data-score="${j}">
      <span class="radio"></span>
      <span>${text}</span>
      <span class="score">+${j}</span>
    </div>
  `).join('');

  div.innerHTML = `
    <div class="q-num">ВОПРОС ${i + 1} / ${questions.length}</div>
    <div class="q-text">${item.q}</div>
    <div class="options">${opts}</div>
  `;
  bodyEl.appendChild(div);
});

/* ---------- Логика ---------- */
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const barFill = document.getElementById('barFill');
const progressText = document.getElementById('progressText');
const progressPct = document.getElementById('progressPct');
const result = document.getElementById('result');
const quizNav = document.getElementById('quizNav');

bodyEl.addEventListener('click', e => {
  const opt = e.target.closest('.option');
  if (!opt) return;

  const qIndex = +opt.dataset.q;
  const score = +opt.dataset.score;

  answers[qIndex] = score;

  const parent = opt.closest('.options');
  parent.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
  opt.classList.add('selected');

  nextBtn.disabled = false;
});

function updateUI() {
  document.querySelectorAll('.question').forEach((q, i) => {
    q.classList.toggle('active', i === current);
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = answers[current] === null;

  nextBtn.textContent = (current === questions.length - 1)
    ? 'Показать результат ✓'
    : 'Далее →';

  const answered = answers.filter(a => a !== null).length;
  const pct = Math.round((answered / questions.length) * 100);
  barFill.style.width = pct + '%';
  progressText.textContent = `Вопрос ${current + 1} из ${questions.length}`;
  progressPct.textContent = pct + '%';
}

prevBtn.addEventListener('click', () => {
  if (current > 0) { current--; updateUI(); }
});

nextBtn.addEventListener('click', () => {
  if (answers[current] === null) return;

  if (current < questions.length - 1) {
    current++;
    updateUI();
  } else {
    showResult();
  }
});

/* ---------- Результат ---------- */
const levels = [
  {
    max: 12,
    color: '#4ddb9a',
    title: 'Минимальное влияние 👍',
    text: 'Социальные сети почти не задевают вашу самооценку. Вы используете их как инструмент, а не как источник подтверждения собственной ценности. Так держать!',
    tips: [
      'Продолжайте соблюдать текущий режим — он работает.',
      'Периодически проверяйте, не изменилось ли самочувствие.',
      'Помогайте одноклассникам, если замечаете у них признаки зависимости.'
    ]
  },
  {
    max: 24,
    color: '#ffb84d',
    title: 'Умеренное влияние ⚠',
    text: 'Соцсети уже заметно влияют на ваше настроение и самооценку. Это ещё не критично, но стоит взять ситуацию под контроль, пока она не усугубилась.',
    tips: [
      'Установите дневной лимит: 45–60 минут.',
      'Отпишитесь от аккаунтов, вызывающих чувство «я недостаточно хорош».',
      'Уберите телефон за час до сна.',
      'Заведите привычку: сначала домашнее задание — потом лента.'
    ]
  },
  {
    max: 36,
    color: '#ff8f4d',
    title: 'Высокое влияние 🔶',
    text: 'Социальные сети сильно влияют на вашу самооценку и эмоциональное состояние. Возможны тревожность, проблемы со сном и концентрацией. Это серьёзный сигнал.',
    tips: [
      'Сократите время в соцсетях до 30 минут в день.',
      'Отключите уведомления — проверяйте ленту по расписанию.',
      'Проведите «цифровой день» без соцсетей раз в неделю.',
      'Обсудите своё состояние с родителями или школьным психологом.',
      'Замените скроллинг на спорт, хобби или живые встречи.'
    ]
  },
  {
    max: 48,
    color: '#ff6b6b',
    title: 'Критическое влияние 🚨',
    text: 'Результат указывает на сильную зависимость от социальных сетей и серьёзное влияние на самооценку. Это не приговор, но с этим важно работать — желательно вместе со специалистом.',
    tips: [
      'Обязательно поговорите со школьным психологом или родителями.',
      'Временно удалите самые «токсичные» приложения с телефона.',
      'Включите строгий лимит времени через настройки устройства.',
      'Ведите дневник настроения: отмечайте, что вы чувствуете после ленты.',
      'Найдите оффлайн-занятие, которое даёт реальный результат и радость.',
      'Помните: лайки не измеряют вашу ценность как человека.'
    ]
  }
];

const scoreCircle = document.getElementById('scoreCircle');
const scoreVal = document.getElementById('scoreVal');
const resTitle = document.getElementById('resTitle');
const resText = document.getElementById('resText');
const resTips = document.getElementById('resTips');
const resTipsList = document.getElementById('resTipsList');
const lvlBar = document.getElementById('lvlBar');

function showResult() {
  const total = answers.reduce((s, v) => s + (v || 0), 0);
  const maxScore = questions.length * 4;
  const lvlIndex = levels.findIndex(l => total <= l.max);
  const lvl = levels[lvlIndex];

  document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
  quizNav.style.display = 'none';
  progressText.textContent = 'Тест завершён';
  progressPct.textContent = '100%';
  barFill.style.width = '100%';
  barFill.style.background = lvl.color;

  const pct = total / maxScore;
  const deg = Math.round(pct * 360);
  scoreCircle.style.background = `conic-gradient(${lvl.color} ${deg}deg, #1b2334 ${deg}deg)`;

  let shown = 0;
  const step = Math.max(1, Math.ceil(total / 28));
  const timer = setInterval(() => {
    shown += step;
    if (shown >= total) { shown = total; clearInterval(timer); }
    scoreVal.textContent = shown;
  }, 30);

  scoreVal.style.color = lvl.color;
  resTitle.textContent = lvl.title;
  resTitle.style.color = lvl.color;
  resText.textContent = lvl.text;

  resTipsList.innerHTML = lvl.tips.map(t => `<li>${t}</li>`).join('');
  resTips.style.display = 'block';

  lvlBar.querySelectorAll('span').forEach((el, i) => {
    el.classList.toggle('active', i === lvlIndex);
    el.style.color = levels[i].color;
  });

  result.classList.add('show');
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ---------- Перезапуск ---------- */
document.getElementById('restartBtn').addEventListener('click', () => {
  answers.fill(null);
  current = 0;

  document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
  result.classList.remove('show');
  quizNav.style.display = 'flex';
  barFill.style.background = 'linear-gradient(90deg,var(--accent),var(--accent-2))';
  scoreVal.style.color = '';

  updateUI();
  document.getElementById('quiz').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ---------- Инициализация ---------- */
updateUI();