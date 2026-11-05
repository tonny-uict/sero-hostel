(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Settings you may want to change ---- */
  const WHATSAPP_NUMBER = '256785862735';          // number the WhatsApp buttons open
  const MAP_DEFAULT = 'Banda, Kampala, Uganda';    // replace with the exact address or "lat,lng" once confirmed
  /* ----------------------------------------- */

  const waLink = text => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  const mapEmbed = q => `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
  const mapOpen = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

  /* ---- Header: solid after scrolling, mobile menu ---- */
  const hd = $('#hd'), menuBtn = $('#menuBtn'), nav = $('#nav');
  const onScroll = () => hd.classList.toggle('is-solid', scrollY > 40);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    hd.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---- Mobile dock appears once the hero is out of view ---- */
  const dock = $('#dock'), hero = $('.hero');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => dock.classList.toggle('is-on', !en.isIntersecting), { threshold: 0.1 }).observe(hero);
  }

  /* ---- Tabs helper (arrow-key support) ---- */
  const tabKeys = (tabs, activate) => tabs.forEach((t, i) => t.addEventListener('keydown', e => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = tabs[(i + d + tabs.length) % tabs.length];
    n.focus();
    activate(n);
  }));
  const selectTab = (tabs, active) => tabs.forEach(t => {
    const on = t === active;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
  });

  /* ---- Rooms ---- */
  const ROOMS = {
    single: {
      title: 'Single room', text: 'Your own room, your own space.',
      feats: ['Wooden bed', 'Tiled floor', 'Hooks along the wall'],
      cta: 'Ask about a single room', plan: 'single',
      imgs: [{ base: 'room-single', big: 1536, w: 1536, h: 1024, alt: 'A single room with a wooden bed and tiled floor' }]
    },
    double: {
      title: 'Double room', text: 'Two beds in one room.',
      feats: ['Two wooden beds', 'Tiled floor', 'Hooks along the wall'],
      cta: 'Ask about a double room', plan: 'double',
      imgs: [{ base: 'room-double-v3', big: 1600, w: 1600, h: 900, alt: 'A double room with two wooden beds and a tiled floor' }]
    },
    bath: {
      title: 'Bathrooms', text: 'Tiled and bright, with running water.',
      feats: ['Tiled walls and floor', 'Window for daylight', 'Tap and towel rail'],
      cta: 'Plan your stay', plan: 'unsure',
      imgs: [
        { base: 'bath-a-v3', big: 1199, w: 1199, h: 1312, alt: 'Tiled bathroom with a squat toilet, tap and barred window' },
        { base: 'bath-b-v3', big: 1199, w: 1199, h: 1312, alt: 'Second tiled bathroom with a squat toilet, tap and towel rail' }
      ]
    }
  };
  const viewer = $('#viewer'), vImg = $('#viewerImg'), vNext = $('#viewerNext');
  const roomTabs = $$('[data-room]');
  let roomKey = 'single', roomIdx = 0;

  const paintImage = im => {
    const ar = Math.min(1.8, Math.max(1, im.w / im.h));
    viewer.style.setProperty('--ar', ar.toFixed(3));
    const load = () => {
      vImg.srcset = `images/${im.base}-800.webp 800w, images/${im.base}-${im.big}.webp ${im.big}w`;
      vImg.src = `images/${im.base}-${im.big}.webp`;
      vImg.width = im.w; vImg.height = im.h; vImg.alt = im.alt;
      requestAnimationFrame(() => vImg.classList.remove('is-out'));
    };
    if (reduce) return load();
    vImg.classList.add('is-out');
    setTimeout(load, 200);
  };

  const showRoom = (key, idx = 0, swap = true) => {
    const r = ROOMS[key];
    roomKey = key; roomIdx = idx;
    $('#roomTitle').textContent = r.title;
    $('#roomText').textContent = r.text;
    $('#roomFeats').innerHTML = r.feats.map(f => `<li>${f}</li>`).join('');
    $('#roomCta').textContent = r.cta;
    $('#roomPanel').setAttribute('aria-labelledby', `tab-${key}`);
    vNext.hidden = r.imgs.length < 2;
    if (swap) paintImage(r.imgs[idx]);
  };
  const activateRoom = tab => { selectTab(roomTabs, tab); showRoom(tab.dataset.room); };
  roomTabs.forEach(t => t.addEventListener('click', () => activateRoom(t)));
  tabKeys(roomTabs, activateRoom);
  vNext.addEventListener('click', () => {
    const n = (roomIdx + 1) % ROOMS[roomKey].imgs.length;
    showRoom(roomKey, n);
  });

  /* ---- Look around ---- */
  const stage = $('#stage'), cap = $('#cap');
  const sceneTabs = $$('[data-scene].tab'), scenes = $$('.scene');
  const capDefault = ['Tap a dot', 'Each one tells you something about the place.'];
  const setCap = (t, s) => {
    cap.innerHTML = `<b></b><span></span>`;
    $('b', cap).textContent = t; $('span', cap).textContent = s;
    cap.classList.remove('is-swap'); void cap.offsetWidth; cap.classList.add('is-swap');
  };
  const centreStage = () => { stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2; };
  const showScene = tab => {
    selectTab(sceneTabs, tab);
    scenes.forEach(s => { s.hidden = s.dataset.scene !== tab.dataset.scene; });
    $$('.pin').forEach(p => p.setAttribute('aria-pressed', 'false'));
    setCap(...capDefault);
    centreStage();
  };
  sceneTabs.forEach(t => t.addEventListener('click', () => showScene(t)));
  tabKeys(sceneTabs, showScene);
  $$('.pin').forEach(p => {
    p.setAttribute('aria-pressed', 'false');
    p.setAttribute('aria-label', p.dataset.title);
    p.addEventListener('click', () => {
      stage.classList.add('is-touched');
      $$('.pin').forEach(x => x.setAttribute('aria-pressed', String(x === p)));
      setCap(p.dataset.title, p.dataset.text);
    });
  });
  addEventListener('load', centreStage);

  /* ---- Plan your stay ---- */
  const form = $('#planForm'), bubble = $('#bubble'), bubbleText = $('#bubbleText'), send = $('#send');
  const move = $('#move');
  const now = new Date();
  const monthOpts = [['', 'Not sure yet']];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const label = d.toLocaleString('en-GB', { month: 'long' }) + (d.getFullYear() !== now.getFullYear() ? ' ' + d.getFullYear() : '');
    monthOpts.push([label, label]);
  }
  move.innerHTML = monthOpts.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');

  const QUIPS = {
    single: 'Your own door, your own quiet.',
    double: 'Bring a friend. Or make one.',
    unsure: 'No problem. Ask about both.'
  };
  const buildMessage = () => {
    const v = n => (form.elements[n].value || '').trim();
    const room = { single: 'a single room', double: 'a double room', unsure: 'a room' }[v('room')];
    const stay = v('stay') === 'month' ? 'by the month' : 'per semester';
    const when = v('move') ? `, moving in around ${v('move')}` : '';
    const where = v('school') ? ` I'll be at ${v('school')}.` : '';
    const who = v('name') ? ` This is ${v('name')}.` : '';
    return `Hello SERO Hostel & Rental.${who} I'm looking for ${room} ${stay}${when}.${where} Is one available, and what are the rates?`;
  };
  let typingTimer;
  const renderMessage = () => {
    const msg = buildMessage();
    send.href = waLink(msg);
    $('#quip').textContent = QUIPS[form.elements.room.value];
    clearTimeout(typingTimer);
    if (reduce) { bubbleText.textContent = msg; return; }
    bubble.classList.add('is-typing');
    typingTimer = setTimeout(() => { bubbleText.textContent = msg; bubble.classList.remove('is-typing'); }, 420);
  };
  form.addEventListener('input', renderMessage);
  form.addEventListener('submit', e => e.preventDefault());
  bubbleText.textContent = buildMessage();
  send.href = waLink(buildMessage());

  $('#roomCta').addEventListener('click', () => {
    const val = ROOMS[roomKey].plan;
    const radio = form.querySelector(`input[name="room"][value="${val}"]`);
    radio.checked = true;
    renderMessage();
    $('#plan').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ---- Dock WhatsApp uses the same number ---- */
  $('#dockWa').href = waLink('Hello SERO Hostel & Rental, I\'d like to ask about a room.');

  /* ---- Map ---- */
  const frame = $('#mapFrame'), open = $('#mapOpen'), chips = $$('#mapChips .chip-btn');
  const setMap = q => { frame.src = mapEmbed(q); open.href = mapOpen(q); };
  chips[0].dataset.q = MAP_DEFAULT;
  setMap(MAP_DEFAULT);
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.setAttribute('aria-pressed', String(x === c)));
    setMap(c.dataset.q);
  }));

  /* ---- Copy numbers ---- */
  const toast = $('#toast');
  let toastTimer;
  const say = msg => {
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('is-on'), 1800);
  };
  $$('.copy').forEach(b => b.addEventListener('click', async () => {
    const num = b.dataset.copy;
    try { await navigator.clipboard.writeText(num); }
    catch {
      const t = document.createElement('textarea'); t.value = num; document.body.append(t); t.select();
      try { document.execCommand('copy'); } catch {} t.remove();
    }
    say('Number copied');
  }));

  $('#year').textContent = new Date().getFullYear();
})();
