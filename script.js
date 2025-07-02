const Timer = {
  elements: {
    timer: null,
    timerState: null,
    timerContainer: null,
    historyList: null,
    scrambleText: null,
    eventSelect: null,
    sectionSelect: null,
    wcaInspection: null,
    showNumbering: null,
    autoScramble: null,
    darkMode: null
  },

  state: {
    interval: null,
    preparing: false,
    timing: false,
    history: [],
    solveCounter: 0,
    inspectionTime: 15,
    isInspecting: false,
    inspectionInterval: null,
    inspectionStartTime: 0
  },

  scramblers: {
    '2x2': () => {
      const moves = ['R', 'U', 'F', 'L', "R'", "U'", "F'", "L'", 'R2', 'U2', 'F2', 'L2'];
      let scramble = [];
      let lastMove = '';
      for (let i = 0; i < 9; i++) {
        let move;
        do {
          move = moves[Math.floor(Math.random() * moves.length)];
        } while (move[0] === lastMove[0]);
        lastMove = move;
        scramble.push(move);
      }
      return scramble.join(' ');
    },

    '3x3': () => {
      const moves = ['R', 'L', 'U', 'D', 'F', 'B', "R'", "L'", "U'", "D'", "F'", "B'", 'R2', 'L2', 'U2', 'D2', 'F2', 'B2'];
      let scramble = [];
      let lastFace = '';
      for (let i = 0; i < 20; i++) {
        let move;
        do {
          move = moves[Math.floor(Math.random() * moves.length)];
        } while (move[0] === lastFace);
        scramble.push(move);
        lastFace = move[0];
      }
      return scramble.join(' ');
    },

    '4x4': () => {
      const moves = ['R', 'L', 'U', 'D', 'F', 'B', "R'", "L'", "U'", "D'", "F'", "B'", 'R2', 'L2', 'U2', 'D2', 'F2', 'B2'];
      const wideMoves = ['Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw', "Rw'", "Lw'", "Uw'", "Dw'", "Fw'", "Bw'", 'Rw2', 'Lw2', 'Uw2', 'Dw2', 'Fw2', 'Bw2'];
      let scramble = [];
      let lastFace = '';

      // First part: regular moves
      for (let i = 0; i < 20; i++) {
        let move;
        do {
          move = moves[Math.floor(Math.random() * moves.length)];
        } while (move[0] === lastFace);
        scramble.push(move);
        lastFace = move[0];
      }

      // Second part: wide moves
      for (let i = 0; i < 20; i++) {
        let move = wideMoves[Math.floor(Math.random() * wideMoves.length)];
        scramble.push(move);
      }
      return scramble.join(' ');
    },

    '5x5': () => Timer.generateWithMoves([
      'R', 'L', 'U', 'D', 'F', 'B', "R'", "L'", "U'", "D'", "F'", "B'", 'R2', 'L2', 'U2', 'D2', 'F2', 'B2',
      'Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw', "Rw'", "Lw'", "Uw'", "Dw'", "Fw'", "Bw'", 'Rw2', 'Lw2', 'Uw2', 'Dw2', 'Fw2', 'Bw2',
      '3Rw', '3Lw', '3Uw', '3Dw', '3Fw', '3Bw', "3Rw'", "3Lw'", "3Uw'", "3Dw'", "3Fw'", "3Bw'", '3Rw2', '3Lw2', '3Uw2', '3Dw2', '3Fw2', '3Bw2'
    ], 60),

    '6x6': () => Timer.generateWithMoves([
      'R', 'L', 'U', 'D', 'F', 'B', "R'", "L'", "U'", "D'", "F'", "B'", 'R2', 'L2', 'U2', 'D2', 'F2', 'B2',
      'Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw', "Rw'", "Lw'", "Uw'", "Dw'", "Fw'", "Bw'", 'Rw2', 'Lw2', 'Uw2', 'Dw2', 'Fw2', 'Bw2',
      '3Rw', '3Lw', '3Uw', '3Dw', '3Fw', '3Bw', "3Rw'", "3Lw'", "3Uw'", "3Dw'", "3Fw'", "3Bw'", '3Rw2', '3Lw2', '3Uw2', '3Dw2', '3Fw2', '3Bw2'
    ], 80),

    '7x7': () => Timer.generateWithMoves([
      'R', 'L', 'U', 'D', 'F', 'B', "R'", "L'", "U'", "D'", "F'", "B'", 'R2', 'L2', 'U2', 'D2', 'F2', 'B2',
      'Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw', "Rw'", "Lw'", "Uw'", "Dw'", "Fw'", "Bw'", 'Rw2', 'Lw2', 'Uw2', 'Dw2', 'Fw2', 'Bw2',
      '3Rw', '3Lw', '3Uw', '3Dw', '3Fw', '3Bw', "3Rw'", "3Lw'", "3Uw'", "3Dw'", "3Fw'", "3Bw'", '3Rw2', '3Lw2', '3Uw2', '3Dw2', '3Fw2', '3Bw2',
      '3Dw', '3Bw', '3Lw', '3Rw', '3Fw', '3Uw'
    ], 100),

    'skewb': () => Timer.generateWithMoves(['R', 'L', 'U', 'B', "R'", "L'", "U'", "B'"], 9),

    'megaminx': () => {
      let scramble = [];
      for (let i = 0; i < 7; i++) {
        const moves = ['R++ D++', 'R++ D--', 'R-- D++', 'R-- D--'];
        for (let j = 0; j < 5; j++) {
          scramble.push(moves[Math.floor(Math.random() * moves.length)]);
        }
        scramble.push('U');
      }
      return scramble.join(' ');
    },

    'pyraminx': () => {
      const moves = ['L', 'R', 'U', 'B', "L'", "R'", "U'", "B'"];
      const tips = ['l', 'r', 'u', 'b', "l'", "r'", "u'", "b'"];
      let scramble = [];

      // Add tips (0-2 for each tip)
      for (let i = 0; i < 4; i++) {
        if (Math.random() < 0.75) {
          scramble.push(tips[Math.floor(Math.random() * tips.length)]);
        }
      }

      // Add regular moves
      for (let i = 0; i < 8; i++) {
        scramble.push(moves[Math.floor(Math.random() * moves.length)]);
      }
      return scramble.join(' ');
    },

    'square-1': () => {
      let scramble = [];
      for (let i = 0; i < 12; i++) {
        const top = Math.floor(Math.random() * 7) - 3;
        const bottom = Math.floor(Math.random() * 7) - 3;
        scramble.push(`(${top},${bottom})`);
        if (i < 11) scramble.push('/');
      }
      return scramble.join(' ');
    },

    'clock': () => {
      const moves = ['UR', 'DR', 'DL', 'UL', 'U', 'R', 'D', 'L', 'ALL'];
      let scramble = [];

      // First face
      for (let i = 0; i < 9; i++) {
        const move = moves[i];
        const amount = Math.floor(Math.random() * 12) - 5;
        scramble.push(`${move}${amount > 0 ? '+' : ''}${amount}`);
      }

      // Flip
      scramble.push('y2');

      // Second face
      for (let i = 0; i < 4; i++) {
        const move = moves[i];
        const amount = Math.floor(Math.random() * 12) - 5;
        scramble.push(`${move}${amount > 0 ? '+' : ''}${amount}`);
      }

      return scramble.join(' ');
    }
  },

  generateWithMoves(moves, length) {
    let scramble = [];
    let lastAxis = '';
    for (let i = 0; i < length; i++) {
      let move;
      do {
        move = moves[Math.floor(Math.random() * moves.length)];
        const currentAxis = move[0];
        if (currentAxis === lastAxis) continue;
        lastAxis = currentAxis;
        break;
      } while (true);
      scramble.push(move);
    }
    return scramble.join(' ');
  }, init() {
    this.initElements();
    this.setupEventListeners();
    this.loadSettings();
    this.updateScramble();
    this.setInitialTheme();
  },

  initElements() {
    this.elements = {
      timer: document.getElementById('timer'),
      timerState: document.querySelector('.timer-state'),
      timerContainer: document.getElementById('timer-container'),
      historyList: document.getElementById('history-list'),
      scrambleText: document.getElementById('scramble-text'),
      eventSelect: document.getElementById('cube-event'),

      wcaInspection: document.getElementById('wcaInspection'),
      showNumbering: document.getElementById('show-numbering'),
      autoScramble: document.getElementById('auto-scramble'),
      darkMode: document.getElementById('darkModeToggle')
    };
  },

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && document.activeElement === document.body) {
        e.preventDefault();
        if (!this.state.timing) {
          this.startPreparing();
        }
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.code === 'Space' && document.activeElement === document.body) {
        e.preventDefault();
        this.stopOrStart();
      }
    });

    this.elements.timerContainer.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (!this.state.timing) {
        this.startPreparing();
      }
    });

    this.elements.timerContainer.addEventListener('mouseup', (e) => {
      e.preventDefault();
      this.stopOrStart();
    });

    this.elements.eventSelect.addEventListener('change', () => {
      this.updateScramble();
      this.saveSettings();
    });

    this.elements.darkMode.addEventListener('change', () => {
      document.body.classList.toggle('dark-theme', this.elements.darkMode.checked);
      this.saveSettings();
    });

    this.elements.wcaInspection.addEventListener('change', () => this.saveSettings());
    this.elements.showNumbering.addEventListener('change', () => {
      this.updateNumbering();
      this.saveSettings();
    });
    this.elements.autoScramble.addEventListener('change', () => this.saveSettings());

    // Clear history button
    document.getElementById('clear-history').addEventListener('click', () => {
      document.getElementById('confirmation-modal').style.display = 'flex';
    });

    document.getElementById('cancel-clear').addEventListener('click', () => {
      document.getElementById('confirmation-modal').style.display = 'none';
    });

    document.getElementById('confirm-clear').addEventListener('click', () => {
      this.state.history = [];
      this.state.solveCounter = 0;
      this.elements.historyList.innerHTML = '';
      this.updateStats();
      this.saveSettings();
      document.getElementById('confirmation-modal').style.display = 'none';
    });

    // Export history button
    document.getElementById('export-history').addEventListener('click', () => {
      const data = JSON.stringify(this.state.history.map(solve => ({
        time: solve.time,
        date: solve.date,
        event: solve.event
      })), null, 2);

      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'twistytime-history.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    // New scramble button
    document.getElementById('new-scramble').addEventListener('click', () => {
      this.updateScramble();
    });
  },

  startPreparing() {
    if (!this.state.timing && !this.state.preparing && !this.state.isInspecting) {
      if (this.elements.wcaInspection.checked) {
        this.startInspection();
      } else {
        this.state.preparing = true;
        this.elements.timerState.textContent = 'Set';
        this.elements.timer.style.color = '#0f0';
        this.elements.timerContainer.classList.add('preparing');
      }
    }
  },

  startInspection() {
    this.state.isInspecting = true;
    this.state.inspectionStartTime = Date.now();
    this.elements.timer.style.color = '#ff0';
    this.elements.timer.textContent = '15';
    this.elements.timerState.textContent = 'Inspection';

    this.state.inspectionInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.state.inspectionStartTime) / 1000);
      const remaining = 15 - elapsed;

      if (remaining >= 0) {
        this.elements.timer.textContent = remaining.toString();
        if (remaining <= 8) {
          this.elements.timer.style.color = '#f00';
        }
      } else if (remaining < -2) {
        clearInterval(this.state.inspectionInterval);
        this.elements.timer.textContent = 'DNF';
        this.state.isInspecting = false;
        setTimeout(() => {
          this.elements.timer.textContent = '0.000';
          this.elements.timer.style.color = '';
          this.elements.timerState.textContent = 'Ready';
        }, 2000);
      }
    }, 100);
  }, stopOrStart() {
    if (this.state.timing) {
      clearInterval(this.state.interval);
      const endTime = performance.now();
      const duration = ((endTime - this.state.startTime) / 1000).toFixed(3);
      this.state.solveCounter++;

      if (this.state.inspectionStartTime > 0) {
        const inspectionDuration = (this.state.startTime - this.state.inspectionStartTime) / 1000;
        if (inspectionDuration > 15 && inspectionDuration <= 17) {
          this.addToHistory((parseFloat(duration) + 2).toFixed(3));
        } else {
          this.addToHistory(duration);
        }
        this.state.inspectionStartTime = 0;
      } else {
        this.addToHistory(duration);
      }

      document.body.classList.remove('timing-active');
      this.elements.timerState.textContent = 'Ready';
      this.elements.timer.style.color = '';
      this.elements.timerContainer.classList.remove('timing');
      this.state.timing = false;

      if (this.elements.autoScramble.checked) {
        this.updateScramble();
      }
      this.saveSettings();
    } else if (this.state.preparing || this.state.isInspecting) {
      if (this.state.isInspecting) {
        clearInterval(this.state.inspectionInterval);
        this.state.isInspecting = false;
      }
      this.state.startTime = performance.now();
      this.elements.timerState.textContent = 'Timing...';
      this.elements.timer.style.color = '';
      this.elements.timerContainer.classList.remove('preparing');
      this.elements.timerContainer.classList.add('timing');
      document.body.classList.add('timing-active');
      this.state.interval = setInterval(() => {
        const time = ((performance.now() - this.state.startTime) / 1000).toFixed(3);
        this.elements.timer.textContent = time;
      }, 10);
      this.state.timing = true;
      this.state.preparing = false;
    }
  },

  updateScramble() {
    const currentEvent = this.elements.eventSelect.value;
    const scramble = this.generateScramble(currentEvent);
    this.elements.scrambleText.textContent = scramble;
  },

  generateScramble(event) {
    const scrambler = this.scramblers[event] || this.scramblers['3x3'];
    return scrambler();
  },

  addToHistory(time) {
    const solveData = {
      time: parseFloat(time),
      number: this.state.solveCounter,
      date: new Date(), event: this.elements.eventSelect.value
    };
    this.state.history.unshift(solveData);
    this.addHistoryItemToDOM(solveData);
    this.updateStats();
  }, addHistoryItemToDOM(solveData) {
    const item = document.createElement('div');
    item.className = 'history-item';

    const numberSpan = document.createElement('span');
    numberSpan.className = 'solve-number';
    numberSpan.textContent = `#${solveData.number}`;
    numberSpan.style.display = this.elements.showNumbering.checked ? 'block' : 'none';

    const timeSpan = document.createElement('span');
    timeSpan.className = 'solve-time';
    timeSpan.textContent = solveData.time.toFixed(3);
    if (solveData.isDNF) timeSpan.classList.add('dnf');
    if (solveData.isPlus2) timeSpan.classList.add('plus2');

    // Check if this is a best or worst time
    if (this.state.history.length > 0) {
      const times = this.state.history.map(solve => solve.time);
      const bestTime = Math.min(...times);
      const worstTime = Math.max(...times);
      if (solveData.time === bestTime) item.classList.add('best-solve');
      if (solveData.time === worstTime) item.classList.add('worst-solve');
    }

    const dateSpan = document.createElement('span');
    dateSpan.className = 'solve-date';
    dateSpan.textContent = `${solveData.event} ${solveData.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (solveData.comment) {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'solve-comment';
      commentDiv.textContent = solveData.comment;
      dateSpan.appendChild(commentDiv);
    }

    const menuBtn = document.createElement('button');
    menuBtn.className = 'solve-menu-btn';
    menuBtn.textContent = '⋮';
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const menu = this.createSolveMenu(solveData, item);
      // Close any other open menus
      document.querySelectorAll('.solve-menu').forEach(m => m !== menu && m.remove());

      // Position the menu
      const rect = menuBtn.getBoundingClientRect();
      menu.style.top = rect.bottom + 'px';
      menu.style.left = rect.left + 'px';
      menu.style.display = 'block';

      // Close menu when clicking outside
      const closeMenu = (e) => {
        if (!menu.contains(e.target) && e.target !== menuBtn) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      };
      document.addEventListener('click', closeMenu);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => {
      const index = this.state.history.indexOf(solveData);
      if (index > -1) {
        this.state.history.splice(index, 1);
        item.remove();
        this.updateStats();
        this.saveSettings();
      }
    });

    item.appendChild(numberSpan);
    item.appendChild(timeSpan);
    item.appendChild(dateSpan);
    item.appendChild(menuBtn);
    item.appendChild(deleteBtn);
    this.elements.historyList.prepend(item);
  }, updateStats() {
    document.getElementById('ao5').textContent = this.getAverage(5);
    document.getElementById('ao12').textContent = this.getAverage(12);
    if (this.state.history.length > 0) {
      const times = this.state.history.map(solve => solve.time);
      const bestTime = Math.min(...times);
      const worstTime = Math.max(...times);
      document.getElementById('best-time').textContent = bestTime.toFixed(3);
      document.getElementById('worst-time').textContent = worstTime.toFixed(3);

      // Update highlighting for all history items
      this.elements.historyList.querySelectorAll('.history-item').forEach(item => {
        item.classList.remove('best-solve', 'worst-solve');
        const timeEl = item.querySelector('.solve-time');
        const time = parseFloat(timeEl.textContent);
        if (time === bestTime) item.classList.add('best-solve');
        if (time === worstTime) item.classList.add('worst-solve');
      });
    } else {
      document.getElementById('best-time').textContent = '-';
      document.getElementById('worst-time').textContent = '-';
    }
  }, getAverage(n) {
    if (this.state.history.length < n) return '-';
    const solves = this.state.history.slice(0, n);

    // If too many DNFs, return DNF
    const dnfCount = solves.filter(solve => solve.isDNF).length;
    if (dnfCount > Math.ceil(n * 0.2)) return 'DNF';

    const times = solves.map(solve => solve.isDNF ? Infinity : solve.time);
    const min = Math.min(...times);
    const max = Math.max(...times);

    // For Ao5 and larger, remove best and worst times
    let sum = 0;
    let count = 0;
    if (n >= 5) {
      times.forEach(time => {
        if (time !== min && time !== max) {
          sum += time;
          count++;
        }
      });
    } else {
      sum = times.reduce((a, b) => a + b, 0);
      count = n;
    }

    return (sum / count).toFixed(3);
  },

  updateNumbering() {
    const show = this.elements.showNumbering.checked;
    this.elements.historyList.querySelectorAll('.solve-number').forEach(el => {
      el.style.display = show ? 'block' : 'none';
    });
  }, saveSettings() {
    try {
      const data = {
        darkMode: this.elements.darkMode.checked,
        showNumbering: this.elements.showNumbering.checked,
        autoScramble: this.elements.autoScramble.checked,
        wcaInspection: this.elements.wcaInspection.checked,
        currentEvent: this.elements.eventSelect.value,
        solveCounter: this.state.solveCounter,
        solveHistory: this.state.history.map(solve => ({
          time: solve.time,
          number: solve.number,
          date: solve.date.toISOString(),
          event: solve.event,
          isDNF: solve.isDNF || false,
          isPlus2: solve.isPlus2 || false,
          comment: solve.comment || ''
        }))
      };
      localStorage.setItem('cubeTimerData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  loadSettings() {
    try {
      const saved = localStorage.getItem('cubeTimerData');
      if (saved) {
        const data = JSON.parse(saved);

        this.elements.darkMode.checked = data.darkMode === true;
        document.body.classList.toggle('dark-theme', data.darkMode === true);

        this.elements.showNumbering.checked = data.showNumbering !== false;
        this.elements.autoScramble.checked = data.autoScramble !== false;
        this.elements.wcaInspection.checked = data.wcaInspection === true;

        if (data.currentEvent) {
          this.elements.eventSelect.value = data.currentEvent;
        }
        if (Array.isArray(data.solveHistory)) {
          this.state.solveCounter = data.solveCounter || 0; this.state.history = data.solveHistory.map(solve => ({
            time: solve.time,
            number: solve.number,
            date: new Date(solve.date),
            event: solve.event || '3x3',
            isDNF: solve.isDNF || false,
            isPlus2: solve.isPlus2 || false,
            comment: solve.comment || ''
          }));

          this.elements.historyList.innerHTML = '';
          this.state.history.forEach(solveData => this.addHistoryItemToDOM(solveData));
          this.updateStats();
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      localStorage.removeItem('cubeTimerData');
    }
  }, setInitialTheme() {
    document.querySelector('header').style.backgroundColor = '#121212';
    document.querySelectorAll('button').forEach(btn => {
      if (!btn.classList.contains('delete-btn') && !btn.classList.contains('clear-btn')) {
        btn.style.backgroundColor = '#121212';
        btn.style.color = '#fff';
        btn.style.borderColor = '#121212';
      }
    });
    document.querySelectorAll('.slider').forEach(slider => {
      slider.style.backgroundColor = '#121212';
    });
  },

  createSolveMenu(solveData, itemElement) {
    const menu = document.createElement('div');
    menu.className = 'solve-menu';
    document.body.appendChild(menu);

    const createMenuItem = (text, onClick) => {
      const item = document.createElement('div');
      item.className = 'solve-menu-item';
      item.textContent = text;
      item.addEventListener('click', onClick);
      menu.appendChild(item);
    };

    createMenuItem(solveData.isDNF ? 'Remove DNF' : 'DNF', () => {
      solveData.isDNF = !solveData.isDNF;
      const timeSpan = itemElement.querySelector('.solve-time');
      timeSpan.classList.toggle('dnf');
      this.saveSettings();
      this.updateStats();
      menu.remove();
    });

    createMenuItem(solveData.isPlus2 ? 'Remove +2' : '+2', () => {
      solveData.isPlus2 = !solveData.isPlus2;
      if (solveData.isPlus2) {
        solveData.time += 2;
      } else {
        solveData.time -= 2;
      }
      const timeSpan = itemElement.querySelector('.solve-time');
      timeSpan.textContent = solveData.time.toFixed(3);
      timeSpan.classList.toggle('plus2');
      this.saveSettings();
      this.updateStats();
      menu.remove();
    });

    createMenuItem(solveData.comment ? 'Edit Comment' : 'Add Comment', () => {
      const comment = prompt('Enter comment:', solveData.comment || '');
      if (comment !== null) {
        solveData.comment = comment.trim();
        let commentDiv = itemElement.querySelector('.solve-comment');
        if (solveData.comment) {
          if (!commentDiv) {
            commentDiv = document.createElement('div');
            commentDiv.className = 'solve-comment';
            itemElement.querySelector('.solve-date').appendChild(commentDiv);
          }
          commentDiv.textContent = solveData.comment;
        } else if (commentDiv) {
          commentDiv.remove();
        }
        this.saveSettings();
      }
      menu.remove();
    });

    return menu;
  }
};


// Initialize timer when page loads
document.addEventListener('DOMContentLoaded', () => Timer.init());
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('SW registered:', reg))
      .catch(err => console.error('SW failed:', err));
  });
}
const screenshotBtn = document.getElementById("screenshot-btn");

  screenshotBtn.addEventListener("click", () => {
    alert("It will only take the screenshot of the visible part of the page, not the full page. If you want to take a full page screenshot, use the browser's built-in screenshot feature.");
    screenshotBtn.style.visibility = "hidden"; // hide button

    const target = document.getElementById("screenshot-target");

    setTimeout(() => {
      html2canvas(target, {
        useCORS: true,
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight
      }).then(canvas => {
        const link = document.createElement("a");
        link.download = "full-page-screenshot.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        screenshotBtn.style.visibility = "visible"; // restore button
      }).catch(err => {
        console.error("Screenshot failed:", err);
        alert("Screenshot failed. See console.");
        screenshotBtn.style.visibility = "visible";
      });
    }, 100);
  });


