const STORAGE_KEYS = {
  items: 'findback-items-v1',
  last: 'findback-last-v1',
  match: 'findback-match-v1'
};

const seedItems = [
  {
    id: 'seed-found-01', type: 'found', title: '黑色 AirPods Pro', location: '图书馆三楼自习区', date: '2026-11-26', time: '13:40',
    description: '白色充电盒，盒盖内侧有一枚小小的蓝色贴纸。', contact: '校园私信', image: '', createdAt: '刚刚'
  },
  {
    id: 'seed-lost-01', type: 'lost', title: '深蓝色帆布包', location: '南区食堂二楼', date: '2026-11-25', time: '18:20',
    description: '包内有水杯和几本专业课教材，右侧有橙色挂件。', contact: '138****2048', image: '', createdAt: '昨天'
  },
  {
    id: 'seed-found-02', type: 'found', title: '校园卡 · 林同学', location: '体育馆入口', date: '2026-11-24', time: '09:15',
    description: '卡面完好，姓名为林同学，拾到后已妥善保管。', contact: '校园私信', image: '', createdAt: '2天前'
  },
  {
    id: 'seed-lost-02', type: 'lost', title: '银色保温杯', location: '明德楼 204', date: '2026-11-23', time: '15:00',
    description: '杯身有绿色山脉图案，底部贴着白色姓名贴。', contact: '139****7812', image: '', createdAt: '3天前'
  }
];

const state = {
  items: readStorage(STORAGE_KEYS.items, seedItems),
  last: readStorage(STORAGE_KEYS.last, null),
  matches: readStorage(STORAGE_KEYS.match, null),
  listFilter: 'all',
  listKeyword: '',
  formImage: ''
};

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode fallback */ }
}

function icon(name, size = 18) {
  const paths = {
    mark: '<path d="M5 17.5 6.4 4.7 13 2.5l5.6 2.2L17 17.5l-5.1 2.1L5 17.5Z"/><path d="m8 9 3 1 3.7-1.5M7.4 13l3.2 1.1 4-1.6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    list: '<path d="M5 6h14M5 12h14M5 18h14"/>',
    spark: '<path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3ZM19 16l.5 2 2 .5-2 .5-.5 2-.5-2-2-.5 2-.5.5-2Z"/>',
    box: '<path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
    pin: '<path d="M19 10.2c0 4.6-7 10.3-7 10.3S5 14.8 5 10.2a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.2"/>',
    user: '<circle cx="12" cy="8" r="3"/><path d="M5 20c.8-3.2 3.1-5 7-5s6.2 1.8 7 5"/>',
    image: '<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="9" r="1.3"/><path d="m4 16 4-4 3 3 2-2 7 6"/>',
    upload: '<path d="M12 15V4M8 8l4-4 4 4M5 14v4h14v-4"/>',
    arrow: '<path d="M5 12h13M13 7l5 5-5 5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 4 4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    close: '<path d="m7 7 10 10M17 7 7 17"/>',
    chevron: '<path d="m9 6 6 6-6 6"/>',
    phone: '<path d="M7 4h3l1.1 3.1-1.8 1.6a14 14 0 0 0 4 4l1.6-1.8L18 12v3c0 1.1-.9 2-2 2A12 12 0 0 1 5 6c0-1.1.9-2 2-2Z"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.8-4L3 10M3 5v5h5M4 13a8 8 0 0 0 14.8 4L21 14m0 5v-5h-5"/>',
    message: '<path d="M4 5h16v11H8l-4 4V5Z"/><path d="M8 9h8M8 12h5"/>',
    warning: '<path d="m12 4 8 15H4L12 4Z"/><path d="M12 9v4M12 16h.01"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.info}</svg>`;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function formatDate(dateString) {
  if (!dateString) return '时间待补充';
  const [year, month, day] = dateString.split('-');
  return `${year}.${month}.${day}`;
}

function typeLabel(type) { return type === 'found' ? '我拾到了' : '我弄丢了'; }
function typeShort(type) { return type === 'found' ? '拾物' : '失物'; }
function routeTo(path) { history.pushState({}, '', path); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

function header() {
  const path = window.location.pathname;
  return `<header class="site-header">
    <a href="/publish" data-route class="brand" aria-label="FindBack 首页">
      <span class="brand-mark">${icon('mark', 20)}</span><span>FindBack <span class="brand-sub">校园互助站</span></span>
    </a>
    <nav class="nav-links" aria-label="主导航">
      <a href="/publish" data-route class="nav-link ${path === '/publish' || path === '/' ? 'active' : ''}">${icon('plus', 16)}<span>发布信息</span></a>
      <a href="/list" data-route class="nav-link ${path === '/list' ? 'active' : ''}">${icon('list', 16)}<span>信息列表</span></a>
      <a href="/matches" data-route class="nav-link ${path === '/matches' ? 'active' : ''}">${icon('spark', 16)}<span>匹配结果</span></a>
    </nav>
    <div class="header-help">${icon('lock', 15)} 仅用于校园内部互助</div>
  </header>`;
}

function pageIntro(kicker, title, lead, action = '') {
  return `<div class="page-intro"><div><div class="page-kicker">${kicker}</div><h1 class="page-title">${title}</h1><p class="page-lead">${lead}</p></div>${action ? `<div class="intro-action">${action}</div>` : ''}</div>`;
}

function flowRail(active = 1) {
  const steps = [['发布', '/publish'], ['浏览', '/list'], ['智能匹配', '/matches']];
  return `<div class="flow-rail">${steps.map(([label, path], index) => `<a href="${path}" data-route class="flow-step ${active === index + 1 ? 'active' : ''} ${active > index + 1 ? 'done' : ''}"><span class="flow-dot">${active > index + 1 ? icon('check', 12) : index + 1}</span>${label}</a>${index < steps.length - 1 ? '<span class="flow-line"></span>' : ''}`).join('')}</div>`;
}

function placeholderPhoto(label = '暂无图片', cls = '') {
  return `<div class="item-photo placeholder ${cls}"><div class="placeholder-content">${icon('image', 26)}<span>${label}</span></div></div>`;
}
function photoMarkup(item, type = 'item') {
  if (item?.image) return `<div class="${type}-photo"><img src="${item.image}" alt="${escapeHtml(item.title)}" /></div>`;
  if (type === 'item') return placeholderPhoto(typeShort(item?.type || 'lost'));
  return `<div class="${type}-photo placeholder">${icon('image', 25)}</div>`;
}

function publishPage() {
  const today = new Date().toISOString().slice(0, 10);
  return `<main class="page">
    ${pageIntro('01 / 03 · 发布信息', '让线索，<em>回到它该去的地方</em>。', '描述得越清楚，越容易被同学认领。发布后，FindBack 会根据物品、地点和描述为你生成相似线索。')}
    ${flowRail(1)}
    <div class="publish-layout">
      <form class="card form-card" id="publish-form">
        <div class="form-heading"><div><h2>发布一条新信息</h2><p>内容会保存于本机浏览器，仅用于本次演示。</p></div><div class="required-note"><b>*</b> 必填</div></div>
        <section class="form-section"><h3 class="form-section-title">信息类型 <span>先告诉我们发生了什么</span></h3>
          <div class="type-options">
            <div class="type-option"><input id="type-lost" type="radio" name="type" value="lost" checked /><label for="type-lost"><span class="option-icon">${icon('search', 18)}</span><span class="option-copy"><b>我弄丢了</b><small>发布失物线索</small></span></label></div>
            <div class="type-option"><input id="type-found" type="radio" name="type" value="found" /><label for="type-found"><span class="option-icon">${icon('box', 18)}</span><span class="option-copy"><b>我拾到了</b><small>帮助物品回家</small></span></label></div>
          </div>
        </section>
        <section class="form-section"><h3 class="form-section-title">物品信息 <span>越具体，匹配越准确</span></h3>
          <div class="form-grid">
            <label class="field"><span class="field-label">物品名称 <b class="star">*</b></span><input class="field-control" name="title" maxlength="40" placeholder="例如：黑色 AirPods Pro" required /></label>
            <label class="field"><span class="field-label">发生地点 <b class="star">*</b></span><input class="field-control" name="location" maxlength="60" placeholder="例如：图书馆三楼自习区" required /></label>
            <label class="field"><span class="field-label">发生日期 <b class="star">*</b></span><input class="field-control" type="date" name="date" value="${today}" required /></label>
            <label class="field"><span class="field-label">大致时间</span><input class="field-control" type="time" name="time" value="12:00" /></label>
            <label class="field full"><span class="field-label">特征描述 <b class="star">*</b></span><textarea class="field-control" name="description" id="description" maxlength="240" placeholder="颜色、品牌、贴纸、包内物品等，都可以成为匹配线索。" required></textarea><span class="char-row"><span id="char-count">0</span> / 240</span></label>
          </div>
        </section>
        <section class="form-section"><h3 class="form-section-title">上传图片 <span>可选，支持 JPG / PNG，5MB 以内</span></h3>
          <label class="upload-box" id="upload-box" for="image-input"><input id="image-input" type="file" accept="image/png,image/jpeg,image/webp" /><span class="upload-copy"><span class="upload-icon">${icon('upload', 20)}</span><span><b>点击选择图片</b><small>也可以将图片拖拽到这里</small></span></span><span class="upload-preview" id="upload-preview"><img alt="上传预览" /><button class="remove-image" type="button" data-action="remove-image" aria-label="移除图片">${icon('close', 15)}</button></span></label>
        </section>
        <section class="form-section"><h3 class="form-section-title">联系方式 <span>仅对匹配到的同学可见</span></h3>
          <div class="form-grid"><label class="field full"><span class="field-label">联系方式 <b class="star">*</b></span><input class="field-control" name="contact" maxlength="60" placeholder="手机号、微信号或“校园私信”" required /></label></div>
          <div class="privacy-note">${icon('lock', 14)} 发布后可在本机继续查看；请勿填写身份证、银行卡等敏感信息。</div>
        </section>
        <div class="form-actions"><button type="button" class="btn btn-quiet" data-action="clear-form">清空内容</button><button type="submit" class="btn btn-primary">发布并生成匹配 ${icon('arrow', 16)}</button></div>
      </form>
      <aside class="side-stack">
        <div class="card side-card ai-panel"><h3>${icon('spark', 16)} AI 匹配会做什么？</h3><p>发布完成后，系统会在已有信息中寻找地点、关键词和类型相近的线索。</p><div class="ai-steps"><div class="ai-step"><span class="step-number">01</span><span><b>提取线索</b><small>识别物品与地点关键词</small></span></div><div class="ai-step"><span class="step-number">02</span><span><b>交叉比对</b><small>与失物 / 拾物信息进行匹配</small></span></div><div class="ai-step"><span class="step-number">03</span><span><b>给出建议</b><small>展示相似度与联系方向</small></span></div></div></div>
        <div class="card side-card"><h3>让匹配更顺利</h3><div class="tips-list"><div class="tip">${icon('check', 14)} 写清楚物品的颜色、品牌和独特标记。</div><div class="tip">${icon('check', 14)} 地点尽量具体到楼栋、楼层或区域。</div><div class="tip">${icon('check', 14)} 如果拾到物品，留下可联系到你的方式。</div></div></div>
      </aside>
    </div>
  </main>`;
}

function itemCard(item) {
  return `<article class="item-card"><div class="item-photo-wrap">${item.image ? `<div class="item-photo"><img src="${item.image}" alt="${escapeHtml(item.title)}" /></div>` : placeholderPhoto(typeShort(item.type))}<span class="photo-tag ${item.type}">${item.type === 'found' ? icon('box', 11) : icon('search', 11)} ${typeLabel(item.type)}</span></div><div class="item-body"><h3>${escapeHtml(item.title)}</h3><p class="item-desc">${escapeHtml(item.description)}</p><div class="item-meta"><span class="meta-line">${icon('pin', 14)}${escapeHtml(item.location)}</span><span class="meta-line">${icon('clock', 14)}${formatDate(item.date)} ${item.time || ''}</span></div><div class="item-footer"><span class="item-date">${escapeHtml(item.createdAt || '刚刚')}</span><button class="item-action" data-action="view-item" data-id="${escapeHtml(item.id)}">查看匹配 ${icon('chevron', 13)}</button></div></div></article>`;
}

function listPage() {
  const filtered = state.items.filter((item) => {
    const typeMatch = state.listFilter === 'all' || item.type === state.listFilter;
    const keyword = state.listKeyword.trim().toLowerCase();
    const text = `${item.title} ${item.location} ${item.description}`.toLowerCase();
    return typeMatch && (!keyword || text.includes(keyword));
  });
  const list = filtered.length ? `<div class="item-grid">${filtered.map(itemCard).join('')}</div>` : `<div class="empty-state"><div><span class="empty-icon">${icon('search', 24)}</span><h3>还没有找到相关线索</h3><p>试试换一个关键词，或发布一条新信息，让线索继续流动。</p><a href="/publish" data-route class="btn btn-primary">发布新信息 ${icon('arrow', 15)}</a></div></div>`;
  return `<main class="page">${pageIntro('02 / 03 · 信息列表', '所有线索，<em>在这里相遇</em>。', '浏览校园里的失物与拾物信息，筛选关键词，看看有没有一条线索正在等你。', `<a href="/publish" data-route class="btn btn-primary">${icon('plus', 16)} 发布信息</a>`)}${flowRail(2)}<div class="card list-toolbar"><div class="filter-tabs"><button class="filter-tab ${state.listFilter === 'all' ? 'active' : ''}" data-filter="all">全部 <span>${state.items.length}</span></button><button class="filter-tab ${state.listFilter === 'lost' ? 'active' : ''}" data-filter="lost">失物 <span>${state.items.filter(i => i.type === 'lost').length}</span></button><button class="filter-tab ${state.listFilter === 'found' ? 'active' : ''}" data-filter="found">拾物 <span>${state.items.filter(i => i.type === 'found').length}</span></button></div><label class="search-box">${icon('search', 16)}<input id="list-search" value="${escapeHtml(state.listKeyword)}" placeholder="搜索物品、地点或描述" /></label></div><div class="results-meta"><span>共 <b>${filtered.length}</b> 条线索</span><span>最近更新 · 本机演示数据</span></div>${list}</main>`;
}

function buildMatches(source) {
  const candidates = state.items.filter((item) => item.id !== source.id && item.type !== source.type);
  const sourceWords = `${source.title} ${source.location} ${source.description}`.toLowerCase().split(/[^a-z0-9\u4e00-\u9fa5]+/).filter((word) => word.length > 1);
  return candidates.slice(0, 5).map((candidate, index) => {
    const target = `${candidate.title} ${candidate.location} ${candidate.description}`.toLowerCase();
    const shared = sourceWords.filter((word) => target.includes(word));
    const locationShared = source.location && candidate.location && (source.location.includes(candidate.location) || candidate.location.includes(source.location));
    let score = 62 - index * 4 + shared.length * 7 + (locationShared ? 12 : 0);
    score = Math.max(48, Math.min(97, score));
    const reasons = [];
    if (locationShared) reasons.push('地点线索相近');
    if (shared.length) reasons.push(`关键词「${shared.slice(0, 2).join('、')}」重合`);
    if (!reasons.length) reasons.push('物品类型互补，建议优先联系确认');
    return { item: candidate, score, reason: reasons.join(' · ') };
  }).sort((a, b) => b.score - a.score);
}

function sourceCard(item) {
  return `<aside class="card source-card"><div class="source-card-label">本次发布</div>${item.image ? `<div class="source-preview"><img src="${item.image}" alt="${escapeHtml(item.title)}" /></div>` : `<div class="source-preview placeholder">${icon('image', 25)}</div>`}<h4>${escapeHtml(item.title)}</h4><div class="source-details"><span class="source-detail">${icon('pin', 14)} ${escapeHtml(item.location)}</span><span class="source-detail">${icon('clock', 14)} ${formatDate(item.date)} ${item.time || ''}</span><span class="source-detail">${icon('user', 14)} ${escapeHtml(item.contact)}</span></div></aside>`;
}

function matchCard(match) {
  const item = match.item;
  return `<article class="match-card"><div>${item.image ? `<div class="match-photo"><img src="${item.image}" alt="${escapeHtml(item.title)}" /></div>` : `<div class="match-photo placeholder">${icon('image', 25)}</div>`}</div><div><h4>${escapeHtml(item.title)}</h4><div class="match-card-meta"><span>${icon('pin', 13)}${escapeHtml(item.location)}</span><span>${icon('clock', 13)}${formatDate(item.date)}</span></div><p class="match-reason">${escapeHtml(match.reason)}</p></div><div class="similarity"><span class="similarity-ring" style="--score:${match.score * 3.6}deg" data-score="${match.score}%"></span><small>相似度</small></div></article>`;
}

function matchesPage() {
  const source = state.last;
  if (!source) return `<main class="page">${pageIntro('03 / 03 · 匹配结果', '让 AI 帮你，<em>缩小寻找范围</em>。', '发布一条信息后，系统会根据已有线索生成相似度排序和联系建议。')}${flowRail(3)}<div class="empty-state"><div><span class="empty-icon">${icon('spark', 24)}</span><h3>还没有待匹配的信息</h3><p>先发布一条失物或拾物信息，AI 会马上帮你找相似线索。</p><a href="/publish" data-route class="btn btn-primary">去发布信息 ${icon('arrow', 15)}</a></div></div></main>`;
  const matches = state.matches || buildMatches(source);
  const matchList = matches.length ? matches.map(matchCard).join('') : `<div class="empty-state"><div><span class="empty-icon">${icon('search', 24)}</span><h3>暂时没有直接匹配</h3><p>扩大描述范围或继续等待新的线索，也可以先去信息列表浏览。</p><a href="/list" data-route class="btn btn-secondary">浏览全部线索</a></div></div>`;
  return `<main class="page">${pageIntro('03 / 03 · 匹配结果', '让 AI 帮你，<em>缩小寻找范围</em>。', '系统已根据物品类型、地点和描述完成第一轮模拟匹配。相似度越高，越值得优先确认。')}${flowRail(3)}<section class="match-hero"><div class="match-hero-copy"><div class="eyebrow">${icon('spark', 13)} AI MATCHING / SIMULATION</div><h2>找到 ${matches.length} 条可能相关线索</h2><p>这是基于本机演示数据的模拟结果。建议联系前先核对物品细节，确认无误后再约定归还方式。</p></div><span class="pulse-badge">匹配已完成</span></section><div class="match-layout">${sourceCard(source)}<section class="matches-panel"><div class="matches-panel-head"><div><h3>推荐匹配</h3><p>按相似度从高到低排序</p></div><button class="btn btn-quiet" data-action="refresh-matches">${icon('refresh', 14)} 重新计算</button></div><div class="match-list">${matchList}</div><div class="match-actions"><a href="/list" data-route class="btn btn-secondary">去信息列表</a><a href="/publish" data-route class="btn btn-primary">继续发布 ${icon('plus', 15)}</a></div></section></div></main>`;
}

function render() {
  const path = window.location.pathname;
  const page = path === '/list' ? listPage() : path === '/matches' ? matchesPage() : publishPage();
  document.querySelector('#app').innerHTML = `${header()}${page}`;
  bindPageEvents();
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  toast.innerHTML = `${icon(type === 'error' ? 'warning' : 'check', 17)}<span>${escapeHtml(message)}</span>`;
  document.querySelector('#toast-region').appendChild(toast);
  window.setTimeout(() => toast.remove(), 3200);
}

function clearForm() {
  const form = document.querySelector('#publish-form');
  if (!form) return;
  form.reset();
  form.querySelector('[name="date"]').value = new Date().toISOString().slice(0, 10);
  state.formImage = '';
  const box = document.querySelector('#upload-box');
  box.classList.remove('has-image');
  document.querySelector('#upload-preview img').src = '';
  document.querySelector('#char-count').textContent = '0';
}

function bindPageEvents() {
  const form = document.querySelector('#publish-form');
  if (form) {
    const description = document.querySelector('#description');
    description.addEventListener('input', () => { document.querySelector('#char-count').textContent = description.value.length; });
    document.querySelector('#image-input').addEventListener('change', handleImageChange);
    form.addEventListener('submit', handleSubmit);
  }
  const search = document.querySelector('#list-search');
  if (search) search.addEventListener('input', (event) => { state.listKeyword = event.target.value; render(); const input = document.querySelector('#list-search'); input.focus(); input.setSelectionRange(state.listKeyword.length, state.listKeyword.length); });
  document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => { state.listFilter = button.dataset.filter; render(); }));
}

function handleImageChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { showToast('图片格式需为 JPG、PNG 或 WEBP。', 'error'); event.target.value = ''; return; }
  if (file.size > 5 * 1024 * 1024) { showToast('图片大小不能超过 5MB。', 'error'); event.target.value = ''; return; }
  const reader = new FileReader();
  reader.onload = () => { state.formImage = reader.result; document.querySelector('#upload-preview img').src = reader.result; document.querySelector('#upload-box').classList.add('has-image'); showToast('图片已添加，可以继续填写信息。'); };
  reader.readAsDataURL(file);
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const item = { id: `item-${Date.now()}`, type: data.get('type'), title: String(data.get('title')).trim(), location: String(data.get('location')).trim(), date: data.get('date'), time: data.get('time'), description: String(data.get('description')).trim(), contact: String(data.get('contact')).trim(), image: state.formImage, createdAt: '刚刚' };
  if (!item.title || !item.location || !item.date || !item.description || !item.contact) { showToast('请补全带 * 的必填信息。', 'error'); return; }
  state.items = [item, ...state.items];
  state.last = item;
  state.matches = buildMatches(item);
  writeStorage(STORAGE_KEYS.items, state.items);
  writeStorage(STORAGE_KEYS.last, state.last);
  writeStorage(STORAGE_KEYS.match, state.matches);
  routeTo('/matches');
  showToast('发布成功，已生成匹配结果。');
}

window.addEventListener('popstate', render);
document.addEventListener('click', (event) => {
  const route = event.target.closest('[data-route]');
  if (route) { event.preventDefault(); routeTo(route.getAttribute('href')); return; }
  const action = event.target.closest('[data-action]');
  if (!action) return;
  if (action.dataset.action === 'remove-image') { event.preventDefault(); event.stopPropagation(); state.formImage = ''; document.querySelector('#upload-box')?.classList.remove('has-image'); const input = document.querySelector('#image-input'); if (input) input.value = ''; }
  if (action.dataset.action === 'clear-form') { clearForm(); showToast('已清空当前填写内容。'); }
  if (action.dataset.action === 'view-item') { const item = state.items.find((candidate) => candidate.id === action.dataset.id); if (item) { state.last = item; state.matches = buildMatches(item); writeStorage(STORAGE_KEYS.last, item); writeStorage(STORAGE_KEYS.match, state.matches); routeTo('/matches'); } }
  if (action.dataset.action === 'refresh-matches' && state.last) { state.matches = buildMatches(state.last); writeStorage(STORAGE_KEYS.match, state.matches); render(); showToast('已根据最新线索重新计算。'); }
});

render();
