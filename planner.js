/* planner.js - academic planner (add, complete, delete, filter, progress).
   The task list is an array of objects; every change re-renders the list. */

(function () {
  'use strict';

  var tasks = window.YY.loadTasks();
  var filter = 'all';

  var form = document.getElementById('taskForm');
  var titleInput = document.getElementById('tTitle');
  var titleField = document.getElementById('f-title');
  var titleError = document.getElementById('e-title');
  var listEl = document.getElementById('taskList');

  var SUBJECT_CLASS = { 'Web development': 'c-violet', 'Python': 'c-mint', 'C++': 'c-coral', 'Physics': 'c-sky', 'Electronics': 'c-sun', 'Other': 'c-pink' };
  var PRIORITY_COLOR = ['var(--mint)', 'var(--sun)', 'var(--coral)'];
  var PRIORITY_NAME = ['Low', 'Medium', 'High'];
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function formatDue(iso) {
    if (!iso) { return 'No due date'; }
    var p = iso.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  }

  function isOverdue(task) {
    return !task.done && task.due && task.due < window.YY.isoDate(new Date());
  }

  function visibleTasks() {
    return tasks
      .filter(function (t) { return filter === 'all' || (filter === 'done') === t.done; })
      .sort(function (a, b) {
        if (a.done !== b.done) { return a.done ? 1 : -1; }
        return (a.due || '9999') > (b.due || '9999') ? 1 : -1;
      });
  }

  function trashIcon() {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'ic');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#i-trash');
    svg.appendChild(use);
    return svg;
  }

  function buildTask(task) {
    var li = document.createElement('li');
    li.className = 'task' + (task.done ? ' done' : '');

    var check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'chk';
    check.checked = task.done;
    check.setAttribute('aria-label', 'Mark "' + task.title + '" as completed');
    check.addEventListener('change', function () { toggleTask(task.id, check.checked); });

    var text = document.createElement('div');
    text.className = 't';
    var title = document.createElement('b');
    title.textContent = task.title;

    var meta = document.createElement('div');
    meta.className = 'meta';
    var subject = document.createElement('span');
    subject.className = 'pill ' + (SUBJECT_CLASS[task.subject] || 'c-pink');
    subject.textContent = task.subject;
    var due = document.createElement('span');
    due.textContent = formatDue(task.due) + (isOverdue(task) ? ' (overdue)' : '');
    if (isOverdue(task)) { due.className = 'overdue'; }
    var prio = document.createElement('span');
    prio.style.cssText = 'display:inline-flex;align-items:center;gap:5px';
    var dot = document.createElement('i');
    dot.className = 'prio';
    dot.style.background = PRIORITY_COLOR[task.priority];
    prio.appendChild(dot);
    prio.appendChild(document.createTextNode(PRIORITY_NAME[task.priority]));
    meta.appendChild(subject); meta.appendChild(due); meta.appendChild(prio);
    text.appendChild(title); text.appendChild(meta);

    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'del';
    del.setAttribute('aria-label', 'Delete "' + task.title + '"');
    del.appendChild(trashIcon());
    del.addEventListener('click', function () {
      li.classList.add('gone');
      setTimeout(function () { removeTask(task.id); }, 220);
    });

    li.appendChild(check); li.appendChild(text); li.appendChild(del);
    return li;
  }

  function renderStats() {
    var total = tasks.length;
    var done = tasks.filter(function (t) { return t.done; }).length;
    var late = tasks.filter(isOverdue).length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    document.getElementById('nAll').textContent = total;
    document.getElementById('nDone').textContent = done;
    document.getElementById('nLate').textContent = late;
    document.getElementById('pPct').textContent = pct + '%';
    document.getElementById('pText').textContent = total ? done + ' of ' + total + ' tasks complete' : 'No tasks yet';
    document.getElementById('ringArc').style.strokeDashoffset = 314.16 * (1 - pct / 100);
  }

  function render() {
    listEl.textContent = '';
    var list = visibleTasks();
    if (!list.length) {
      var empty = document.createElement('li');
      empty.className = 'empty';
      empty.textContent = tasks.length ? 'Nothing here. Try another filter.' : 'No tasks yet. Add your first one above.';
      listEl.appendChild(empty);
    }
    list.forEach(function (t) { listEl.appendChild(buildTask(t)); });
    renderStats();
  }

  function addTask(title, subject, due, priority) {
    tasks.push({ id: Date.now(), title: title, subject: subject, due: due, priority: priority, done: false });
    window.YY.saveTasks(tasks);
    render();
  }

  function toggleTask(id, done) {
    tasks.forEach(function (t) { if (t.id === id) { t.done = done; } });
    window.YY.saveTasks(tasks);
    render();
  }

  function removeTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    window.YY.saveTasks(tasks);
    render();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var title = titleInput.value.trim();
    if (title.length < 3) {
      titleField.classList.add('bad');
      titleError.textContent = 'Enter a task with at least 3 characters.';
      titleInput.focus();
      return;
    }
    titleField.classList.remove('bad');
    titleError.textContent = '';
    addTask(title, document.getElementById('tSubject').value, document.getElementById('tDue').value, Number(document.getElementById('tPrio').value));
    titleInput.value = '';
    document.getElementById('tDue').value = '';
    window.YY.toast('Task added');
  });

  titleInput.addEventListener('input', function () {
    titleField.classList.remove('bad');
    titleError.textContent = '';
  });

  var filterBtns = document.querySelectorAll('[data-tf]');
  Array.prototype.forEach.call(filterBtns, function (b) {
    b.addEventListener('click', function () {
      filter = b.dataset.tf;
      Array.prototype.forEach.call(filterBtns, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      render();
    });
  });

  document.getElementById('clearDone').addEventListener('click', function () {
    var before = tasks.length;
    tasks = tasks.filter(function (t) { return !t.done; });
    window.YY.saveTasks(tasks);
    render();
    window.YY.toast(before === tasks.length ? 'No completed tasks to clear' : 'Completed tasks cleared');
  });

  render();
})();
