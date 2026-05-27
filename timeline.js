// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════
let state = {
  trips: [],
  activeId: null,
  pendingDayIdx: null,
  selectedTpl: null,
};

// ── TEMPLATES ──────────────────────────────────
const TEMPLATES = [
  {
    id: "rio",
    emoji: "🏖️",
    name: "Rio de Janeiro",
    days: 5,
    data: [
      {
        label: "Chegada e Copacabana",
        activities: [
          {
            type: "hotel",
            name: "Check-in no hotel",
            time: "14:00",
            cost: 450,
            note: "Confirmar reserva antes",
          },
          {
            type: "atracao",
            name: "Praia de Copacabana",
            time: "16:00",
            cost: 0,
            note: "",
          },
          {
            type: "restaurante",
            name: "Jantar no Adega Perola",
            time: "19:30",
            cost: 80,
            note: "",
          },
        ],
      },
      {
        label: "Cristo & Santa Teresa",
        activities: [
          {
            type: "transporte",
            name: "Trem do Corcovado",
            time: "09:00",
            cost: 84,
            note: "Comprar ingresso online",
          },
          {
            type: "atracao",
            name: "Cristo Redentor",
            time: "10:30",
            cost: 0,
            note: "Vista incrível de manhã",
          },
          {
            type: "atracao",
            name: "Bairro de Santa Teresa",
            time: "14:00",
            cost: 0,
            note: "",
          },
          {
            type: "restaurante",
            name: "Bar do Mineiro",
            time: "12:30",
            cost: 60,
            note: "",
          },
        ],
      },
      {
        label: "Ipanema & Lagoa",
        activities: [
          {
            type: "atracao",
            name: "Praia de Ipanema",
            time: "09:00",
            cost: 0,
            note: "",
          },
          {
            type: "restaurante",
            name: "Almoço no Celeiro",
            time: "13:00",
            cost: 70,
            note: "",
          },
          {
            type: "atracao",
            name: "Lagoa Rodrigo de Freitas",
            time: "16:00",
            cost: 0,
            note: "",
          },
          {
            type: "atracao",
            name: "Pôr do sol no Arpoador",
            time: "17:30",
            cost: 0,
            note: "",
          },
        ],
      },
      {
        label: "Pão de Açúcar & Lapa",
        activities: [
          {
            type: "atracao",
            name: "Bondinho Pão de Açúcar",
            time: "10:00",
            cost: 130,
            note: "Pegar cedo para evitar fila",
          },
          {
            type: "restaurante",
            name: "Almoço em Botafogo",
            time: "13:00",
            cost: 65,
            note: "",
          },
          {
            type: "atracao",
            name: "Lapa — Arcos e vida noturna",
            time: "21:00",
            cost: 0,
            note: "",
          },
        ],
      },
      {
        label: "Dia livre & Partida",
        activities: [
          {
            type: "atracao",
            name: "Parque Laje ou MASP",
            time: "10:00",
            cost: 0,
            note: "Opcional",
          },
          {
            type: "transporte",
            name: "Transfer para o aeroporto",
            time: "15:00",
            cost: 80,
            note: "Confirmar horário",
          },
        ],
      },
    ],
  },
  {
    id: "nordeste",
    emoji: "🌊",
    name: "Nordeste",
    days: 7,
    data: [
      {
        label: "Fortaleza — chegada",
        activities: [
          {
            type: "hotel",
            name: "Check-in Fortaleza",
            time: "14:00",
            cost: 280,
            note: "",
          },
          {
            type: "atracao",
            name: "Praia do Futuro",
            time: "16:00",
            cost: 0,
            note: "",
          },
          {
            type: "restaurante",
            name: "Coco Bambu",
            time: "19:00",
            cost: 90,
            note: "",
          },
        ],
      },
      {
        label: "Jericoacoara — saída",
        activities: [
          {
            type: "transporte",
            name: "Transfer Fortaleza → Jeri",
            time: "07:00",
            cost: 150,
            note: "4h de viagem",
          },
          {
            type: "hotel",
            name: "Pousada em Jeri",
            time: "12:00",
            cost: 350,
            note: "",
          },
          {
            type: "atracao",
            name: "Duna do Pôr do Sol",
            time: "17:00",
            cost: 0,
            note: "Imperdível",
          },
        ],
      },
      {
        label: "Lagoa Azul & Lagoa do Paraíso",
        activities: [
          {
            type: "atracao",
            name: "Lagoa Azul (kite)",
            time: "09:00",
            cost: 40,
            note: "",
          },
          {
            type: "atracao",
            name: "Lagoa do Paraíso",
            time: "14:00",
            cost: 20,
            note: "",
          },
          {
            type: "restaurante",
            name: "Jantar à beira-mar",
            time: "19:30",
            cost: 80,
            note: "",
          },
        ],
      },
      {
        label: "Passeio de buggy",
        activities: [
          {
            type: "atracao",
            name: "Buggy nas dunas",
            time: "08:30",
            cost: 120,
            note: "Contratar guia local",
          },
          {
            type: "livre",
            name: "Tarde livre na praia",
            time: "14:00",
            cost: 0,
            note: "",
          },
        ],
      },
      {
        label: "Lençóis Maranhenses",
        activities: [
          {
            type: "transporte",
            name: "Voo ou ônibus para Barreirinhas",
            time: "06:00",
            cost: 380,
            note: "",
          },
          {
            type: "atracao",
            name: "Parque Nacional Lençóis Maranhenses",
            time: "14:00",
            cost: 50,
            note: "Época de lagoas: Jan-Jul",
          },
        ],
      },
      {
        label: "Exploração nos lençóis",
        activities: [
          {
            type: "atracao",
            name: "Lagoa Bonita (trekking)",
            time: "06:00",
            cost: 80,
            note: "Sair bem cedo",
          },
          {
            type: "atracao",
            name: "Lagoa Azul Lençóis",
            time: "11:00",
            cost: 0,
            note: "",
          },
          {
            type: "restaurante",
            name: "Jantar em Barreirinhas",
            time: "19:00",
            cost: 60,
            note: "",
          },
        ],
      },
      {
        label: "Retorno",
        activities: [
          {
            type: "transporte",
            name: "Voo de volta",
            time: "10:00",
            cost: 320,
            note: "",
          },
        ],
      },
    ],
  },
  {
    id: "gramado",
    emoji: "⛷️",
    name: "Serra Gaúcha",
    days: 4,
    data: [
      {
        label: "Chegada em Gramado",
        activities: [
          {
            type: "transporte",
            name: "Chegada de Porto Alegre",
            time: "12:00",
            cost: 80,
            note: "2h de carro",
          },
          {
            type: "hotel",
            name: "Check-in",
            time: "14:00",
            cost: 400,
            note: "",
          },
          {
            type: "atracao",
            name: "Rua Coberta — compras",
            time: "16:00",
            cost: 0,
            note: "",
          },
          {
            type: "restaurante",
            name: "Fondue no Villa Bella",
            time: "19:00",
            cost: 120,
            note: "",
          },
        ],
      },
      {
        label: "Canela & Parque do Caracol",
        activities: [
          {
            type: "atracao",
            name: "Parque do Caracol — Cascata",
            time: "09:00",
            cost: 30,
            note: "Incrível no inverno",
          },
          {
            type: "atracao",
            name: "Vale do Quilombo",
            time: "13:00",
            cost: 0,
            note: "",
          },
          {
            type: "restaurante",
            name: "Almoço em Canela",
            time: "12:30",
            cost: 60,
            note: "",
          },
          {
            type: "atracao",
            name: "Catedral de Pedra",
            time: "15:00",
            cost: 0,
            note: "",
          },
        ],
      },
      {
        label: "Bento Gonçalves — vinho",
        activities: [
          {
            type: "transporte",
            name: "Trem Maria Fumaça",
            time: "09:00",
            cost: 80,
            note: "Reservar com antecedência!",
          },
          {
            type: "atracao",
            name: "Rota do Vinho",
            time: "13:00",
            cost: 100,
            note: "Visita a vinícolas",
          },
          {
            type: "restaurante",
            name: "Jantar com ragu e polenta",
            time: "19:30",
            cost: 90,
            note: "",
          },
        ],
      },
      {
        label: "Dia livre & Retorno",
        activities: [
          {
            type: "atracao",
            name: "Mini Mundo Gramado",
            time: "09:30",
            cost: 45,
            note: "",
          },
          {
            type: "transporte",
            name: "Retorno para Porto Alegre",
            time: "15:00",
            cost: 80,
            note: "",
          },
        ],
      },
    ],
  },
  {
    id: "zero",
    emoji: "✏️",
    name: "Do zero",
    days: 3,
    data: [],
  },
];

// ══════════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════════
function uid() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

function showToast(msg, icon = "✅") {
  const el = document.getElementById("toast");
  el.innerHTML = icon + " " + msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2200);
}

function openModal(id) {
  document.getElementById(id).classList.add("open");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

function getTrip() {
  return state.trips.find((t) => t.id === state.activeId);
}

function calcBudget(trip) {
  let total = 0,
    hotel = 0,
    food = 0,
    transport = 0,
    atracoes = 0;
  (trip.days || []).forEach((d) => {
    (d.activities || []).forEach((a) => {
      const c = parseFloat(a.cost) || 0;
      total += c;
      if (a.type === "hotel") hotel += c;
      else if (a.type === "restaurante") food += c;
      else if (a.type === "transporte") transport += c;
      else atracoes += c;
    });
  });
  return { total, hotel, food, transport, atracoes };
}

function fmtCurrency(v) {
  return (
    "R$ " +
    parseFloat(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })
  );
}

function fmtDate(iso, offset) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

const TYPE_ICONS = {
  hotel: "🏨",
  restaurante: "🍽️",
  atracao: "🏛️",
  transporte: "🚗",
  livre: "⭐",
};
const TYPE_LABELS = {
  hotel: "Hotel",
  restaurante: "Restaurante",
  atracao: "Atração",
  transporte: "Transporte",
  livre: "Livre",
};

// ══════════════════════════════════════════════
// RENDER
// ══════════════════════════════════════════════
function renderSidebar() {
  const el = document.getElementById("sidebar-list");
  if (!state.trips.length) {
    el.innerHTML =
      '<div style="padding:20px 8px;text-align:center;color:rgba(143,163,184,.5);font-size:13px;font-weight:600">Nenhum roteiro ainda</div>';
    return;
  }
  el.innerHTML = state.trips
    .map(
      (t) => `
    <div class="trip-card ${t.id === state.activeId ? "active" : ""}" onclick="selectTrip('${t.id}')">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div class="trip-card-name">${t.name}</div>
      </div>
      <div class="trip-card-meta">
        <span class="trip-card-badge ${t.fromTpl ? "badge-template" : "badge-custom"}">${t.fromTpl ? "Template" : "Personalizado"}</span>
        <span>·</span>
        <span>${t.days.length} dias</span>
      </div>
      ${t.startDate ? `<div class="trip-card-days">📅 ${fmtDate(t.startDate, 0)} → ${fmtDate(t.startDate, t.days.length - 1)}</div>` : ""}
    </div>
  `,
    )
    .join("");
}

function renderEditor() {
  const main = document.getElementById("main-area");
  const trip = getTrip();
  if (!trip) {
    main.innerHTML = `<div class="empty-state" id="empty-state">
      <div class="empty-icon">🗺️</div>
      <div class="empty-title">Nenhum roteiro selecionado</div>
      <div class="empty-sub">Crie um novo roteiro ou selecione um da lista para começar a planejar sua viagem.</div>
      <button class="btn-toolbar primary" style="margin-top:8px" onclick="openNewModal()">Criar meu primeiro roteiro</button>
    </div>`;
    return;
  }

  const budget = calcBudget(trip);
  const totalActs = trip.days.reduce((s, d) => s + d.activities.length, 0);
  const budgetGoal = parseFloat(trip.budgetGoal) || 0;
  const pct = budgetGoal
    ? Math.min(100, Math.round((budget.total / budgetGoal) * 100))
    : 0;

  main.innerHTML = `
    <!-- TOOLBAR -->
    <div class="toolbar">
      <div class="toolbar-left">
        <input class="trip-name-input" value="${escHtml(trip.name)}" placeholder="Nome do roteiro"
          oninput="updateTripName(this.value)" />
      </div>
      <div class="toolbar-right">
        <button class="btn-toolbar" onclick="exportTrip()">📋 Exportar</button>
        <button class="btn-toolbar danger" onclick="deleteTrip()">🗑️ Excluir</button>
        <button class="btn-toolbar primary" onclick="showToast('Salvo!','💾')">💾 Salvar</button>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="timeline-wrap">
      <!-- TIMELINE -->
      <div class="timeline" id="timeline">
        ${trip.days.map((day, di) => renderDay(day, di, trip)).join("")}
        <button class="btn-add-day" onclick="addDay()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Adicionar dia
        </button>
      </div>

      <!-- SIDE PANEL -->
      <div class="side-panel">
        <!-- Datas -->
        <div class="panel-card">
          <div class="panel-card-title">Datas da viagem</div>
          <div class="date-label">Início</div>
          <input class="date-input" type="date" value="${trip.startDate || ""}" oninput="updateTripDate('start', this.value)" style="margin-bottom:10px"/>
          <div class="date-label">Meta de orçamento (R$)</div>
          <input class="date-input" type="number" placeholder="Ex: 3000" value="${trip.budgetGoal || ""}" oninput="updateBudgetGoal(this.value)" />
        </div>

        <!-- Orçamento -->
        <div class="panel-card">
          <div class="panel-card-title">Resumo financeiro</div>
          <div class="budget-row"><span class="budget-label">🏨 Hospedagem</span><span class="budget-val">${fmtCurrency(budget.hotel)}</span></div>
          <div class="budget-row"><span class="budget-label">🍽️ Alimentação</span><span class="budget-val">${fmtCurrency(budget.food)}</span></div>
          <div class="budget-row"><span class="budget-label">🚗 Transporte</span><span class="budget-val">${fmtCurrency(budget.transport)}</span></div>
          <div class="budget-row"><span class="budget-label">🏛️ Atrações</span><span class="budget-val">${fmtCurrency(budget.atracoes)}</span></div>
          <div class="budget-row budget-total-row"><span class="budget-label">Total</span><span class="budget-val">${fmtCurrency(budget.total)}</span></div>
          ${
            budgetGoal
              ? `
            <div class="progress-wrap">
              <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
              <div class="progress-label"><span>${pct}% da meta</span><span>${fmtCurrency(budgetGoal)}</span></div>
            </div>`
              : ""
          }
        </div>

        <!-- Estatísticas -->
        <div class="panel-card">
          <div class="panel-card-title">Estatísticas</div>
          <div class="stat-grid">
            <div class="stat-box"><div class="stat-val">${trip.days.length}</div><div class="stat-label">Dias</div></div>
            <div class="stat-box"><div class="stat-val">${totalActs}</div><div class="stat-label">Atividades</div></div>
            <div class="stat-box"><div class="stat-val">${trip.days.filter((d) => d.activities.some((a) => a.type === "hotel")).length}</div><div class="stat-label">Noites hotel</div></div>
            <div class="stat-box"><div class="stat-val">${trip.days.filter((d) => d.activities.some((a) => a.type === "restaurante")).length}</div><div class="stat-label">Refeições</div></div>
          </div>
        </div>
      </div>
    </div>
  `;

  initDayDrag();
  initActivityDrag();
}

function renderDay(day, di, trip) {
  const date = trip.startDate ? fmtDate(trip.startDate, di) : `Dia ${di + 1}`;
  return `
    <div class="day-block" id="day-${day.id}" data-day-id="${day.id}" draggable="true">
      <div class="day-header">
        <div class="day-dot" title="Arraste para reordenar">D${di + 1}</div>
        <div class="day-info">
          <input class="day-label-input" value="${escHtml(day.label)}" placeholder="Nome do dia"
            oninput="updateDayLabel('${day.id}', this.value)" />
          <div class="day-date">${date}</div>
        </div>
        <div class="day-actions">
          <button class="icon-btn" onclick="duplicateDay('${day.id}')" title="Duplicar">⧉</button>
          <button class="icon-btn del" onclick="deleteDay('${day.id}')" title="Remover dia">✕</button>
        </div>
      </div>
      <div class="activities" id="acts-${day.id}">
        ${day.activities.map((a, ai) => renderActivity(a, ai, day.id)).join("")}
        <button class="btn-add-activity" onclick="openAddActivity('${day.id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Adicionar atividade
        </button>
      </div>
    </div>
  `;
}

function renderActivity(a, ai, dayId) {
  return `
    <div class="activity-item" id="act-${a.id}" data-act-id="${a.id}" data-day-id="${dayId}" draggable="true">
      <div class="act-icon ${a.type}" title="${TYPE_LABELS[a.type]}">${TYPE_ICONS[a.type]}</div>
      <div class="act-body">
        <input class="act-name-input" value="${escHtml(a.name)}" placeholder="Nome da atividade"
          oninput="updateActivity('${dayId}','${a.id}','name',this.value)" />
        <div class="act-meta">
          <input class="act-time-input" type="time" value="${a.time || ""}"
            oninput="updateActivity('${dayId}','${a.id}','time',this.value)" />
          <span class="act-type-badge type-${a.type}">${TYPE_LABELS[a.type]}</span>
          <input class="act-cost-input" type="number" placeholder="R$" value="${a.cost || ""}" min="0"
            oninput="updateActivity('${dayId}','${a.id}','cost',this.value)" />
        </div>
        <textarea class="act-note-input" rows="1" placeholder="Observação..."
          oninput="updateActivity('${dayId}','${a.id}','note',this.value);autoResize(this)">${escHtml(a.note || "")}</textarea>
      </div>
      <button class="act-del" onclick="deleteActivity('${dayId}','${a.id}')" title="Remover">✕</button>
    </div>
  `;
}

function escHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function autoResize(el) {
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

// ══════════════════════════════════════════════
// ACTIONS
// ══════════════════════════════════════════════
function selectTrip(id) {
  state.activeId = id;
  renderSidebar();
  renderEditor();
}

function openNewModal() {
  renderTemplates();
  state.selectedTpl = null;
  document.getElementById("new-trip-name").value = "";
  document.getElementById("new-trip-days").value = "5";
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("new-trip-start").value = today;
  openModal("modal-new");
}

function renderTemplates() {
  document.getElementById("tpl-grid").innerHTML = TEMPLATES.map(
    (t) => `
    <div class="tpl-card" data-tpl="${t.id}" onclick="chooseTpl('${t.id}',this)">
      <span class="tpl-emoji">${t.emoji}</span>
      <div class="tpl-name">${t.name}</div>
      <div class="tpl-days">${t.id === "zero" ? "Criar do zero" : t.days + " dias"}</div>
    </div>
  `,
  ).join("");
}

function chooseTpl(id, el) {
  document
    .querySelectorAll(".tpl-card")
    .forEach((c) => c.classList.remove("sel"));
  el.classList.add("sel");
  state.selectedTpl = id;
  const tpl = TEMPLATES.find((t) => t.id === id);
  if (tpl && tpl.id !== "zero") {
    document.getElementById("new-trip-name").value = "Roteiro " + tpl.name;
    document.getElementById("new-trip-days").value = tpl.days;
  }
}

function createTrip() {
  const name = document.getElementById("new-trip-name").value.trim();
  if (!name) {
    showToast("Dê um nome ao roteiro!", "⚠️");
    return;
  }
  const numDays = parseInt(document.getElementById("new-trip-days").value) || 5;
  const startDate = document.getElementById("new-trip-start").value;
  const tpl = state.selectedTpl
    ? TEMPLATES.find((t) => t.id === state.selectedTpl)
    : null;

  let days = [];
  if (tpl && tpl.data.length) {
    days = tpl.data.slice(0, numDays).map((d) => ({
      id: uid(),
      label: d.label,
      activities: d.activities.map((a) => ({ ...a, id: uid() })),
    }));
    // preenche dias extras se pediu mais do que o template tem
    for (let i = days.length; i < numDays; i++) {
      days.push({ id: uid(), label: `Dia ${i + 1}`, activities: [] });
    }
  } else {
    for (let i = 0; i < numDays; i++) {
      days.push({ id: uid(), label: `Dia ${i + 1}`, activities: [] });
    }
  }

  const trip = {
    id: uid(),
    name,
    days,
    startDate,
    budgetGoal: "",
    fromTpl: !!tpl && tpl.id !== "zero",
  };
  state.trips.unshift(trip);
  state.activeId = trip.id;
  closeModal("modal-new");
  renderSidebar();
  renderEditor();
  showToast(`Roteiro "${name}" criado!`, "✈️");
}

function deleteTrip() {
  if (!confirm("Excluir este roteiro?")) return;
  state.trips = state.trips.filter((t) => t.id !== state.activeId);
  state.activeId = state.trips[0]?.id || null;
  renderSidebar();
  renderEditor();
  showToast("Roteiro excluído", "🗑️");
}

function updateTripName(val) {
  const t = getTrip();
  if (!t) return;
  t.name = val;
  renderSidebar();
}

function updateTripDate(field, val) {
  const t = getTrip();
  if (!t) return;
  t[field === "start" ? "startDate" : "endDate"] = val;
  renderEditor();
}

function updateBudgetGoal(val) {
  const t = getTrip();
  if (!t) return;
  t.budgetGoal = val;
  // atualiza painel sem re-render completo
  renderEditor();
}

// ── DIAS ──
function addDay() {
  const t = getTrip();
  if (!t) return;
  t.days.push({ id: uid(), label: `Dia ${t.days.length + 1}`, activities: [] });
  renderEditor();
  showToast("Dia adicionado", "📅");
}

function deleteDay(dayId) {
  const t = getTrip();
  if (!t) return;
  if (t.days.length === 1) {
    showToast("Deve ter ao menos 1 dia", "⚠️");
    return;
  }
  t.days = t.days.filter((d) => d.id !== dayId);
  renderEditor();
  showToast("Dia removido", "🗑️");
}

function duplicateDay(dayId) {
  const t = getTrip();
  if (!t) return;
  const idx = t.days.findIndex((d) => d.id === dayId);
  if (idx < 0) return;
  const orig = t.days[idx];
  const copy = {
    id: uid(),
    label: orig.label + " (cópia)",
    activities: orig.activities.map((a) => ({ ...a, id: uid() })),
  };
  t.days.splice(idx + 1, 0, copy);
  renderEditor();
  showToast("Dia duplicado", "⧉");
}

function updateDayLabel(dayId, val) {
  const t = getTrip();
  if (!t) return;
  const d = t.days.find((d) => d.id === dayId);
  if (!d) return;
  d.label = val;
}

// ── ATIVIDADES ──
let _pendingDayId = null;

function openAddActivity(dayId) {
  _pendingDayId = dayId;
  document.getElementById("act-name-inp").value = "";
  document.getElementById("act-time-inp").value = "09:00";
  document.getElementById("act-cost-inp").value = "";
  document.getElementById("act-note-inp").value = "";
  document
    .querySelectorAll(".type-opt")
    .forEach((o) => o.classList.remove("sel"));
  document.querySelector('.type-opt[data-type="atracao"]').classList.add("sel");
  openModal("modal-activity");
  setTimeout(() => document.getElementById("act-name-inp").focus(), 200);
}

function selectType(el) {
  document
    .querySelectorAll(".type-opt")
    .forEach((o) => o.classList.remove("sel"));
  el.classList.add("sel");
}

function confirmAddActivity() {
  const name = document.getElementById("act-name-inp").value.trim();
  if (!name) {
    showToast("Dê um nome à atividade!", "⚠️");
    return;
  }
  const type = document.querySelector(".type-opt.sel")?.dataset.type || "livre";
  const time = document.getElementById("act-time-inp").value;
  const cost = parseFloat(document.getElementById("act-cost-inp").value) || 0;
  const note = document.getElementById("act-note-inp").value.trim();

  const t = getTrip();
  if (!t) return;
  const d = t.days.find((d) => d.id === _pendingDayId);
  if (!d) return;
  d.activities.push({ id: uid(), type, name, time, cost, note });
  closeModal("modal-activity");
  renderEditor();
  showToast("Atividade adicionada!", TYPE_ICONS[type]);
}

function deleteActivity(dayId, actId) {
  const t = getTrip();
  if (!t) return;
  const d = t.days.find((d) => d.id === dayId);
  if (!d) return;
  d.activities = d.activities.filter((a) => a.id !== actId);
  renderEditor();
}

function updateActivity(dayId, actId, field, val) {
  const t = getTrip();
  if (!t) return;
  const d = t.days.find((d) => d.id === dayId);
  if (!d) return;
  const a = d.activities.find((a) => a.id === actId);
  if (!a) return;
  a[field] = field === "cost" ? parseFloat(val) || 0 : val;
  if (field === "cost") {
    // atualiza painel de budget sem re-render
    refreshBudgetPanel();
  }
}

function refreshBudgetPanel() {
  const trip = getTrip();
  if (!trip) return;
  const budget = calcBudget(trip);
  // não faz re-render completo — atualiza só os valores
  const rows = document.querySelectorAll(".budget-val");
  if (rows.length >= 5) {
    rows[0].textContent = fmtCurrency(budget.hotel);
    rows[1].textContent = fmtCurrency(budget.food);
    rows[2].textContent = fmtCurrency(budget.transport);
    rows[3].textContent = fmtCurrency(budget.atracoes);
    rows[4].textContent = fmtCurrency(budget.total);
  }
}

// ── EXPORT ──
function exportTrip() {
  const trip = getTrip();
  if (!trip) return;
  let txt = `# ${trip.name}\n`;
  if (trip.startDate) txt += `Data de início: ${fmtDate(trip.startDate, 0)}\n`;
  txt += `\n`;
  trip.days.forEach((d, i) => {
    txt += `## Dia ${i + 1} — ${d.label}\n`;
    d.activities.forEach((a) => {
      txt += `  [${a.time || "--:--"}] ${TYPE_ICONS[a.type]} ${a.name}`;
      if (a.cost) txt += ` — R$ ${a.cost}`;
      if (a.note) txt += `\n    → ${a.note}`;
      txt += "\n";
    });
    txt += "\n";
  });
  const budget = calcBudget(trip);
  txt += `---\nTotal estimado: ${fmtCurrency(budget.total)}\n`;
  const blob = new Blob([txt], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = trip.name.replace(/\s+/g, "_") + ".txt";
  a.click();
  URL.revokeObjectURL(url);
  showToast("Roteiro exportado!", "📋");
}

// ══════════════════════════════════════════════
// DRAG & DROP — DIAS
// ══════════════════════════════════════════════
let dragDayId = null;

function initDayDrag() {
  document.querySelectorAll(".day-block").forEach((el) => {
    el.addEventListener("dragstart", (e) => {
      dragDayId = el.dataset.dayId;
      el.style.opacity = ".4";
      e.dataTransfer.effectAllowed = "move";
    });
    el.addEventListener("dragend", () => {
      el.style.opacity = "";
      dragDayId = null;
      document
        .querySelectorAll(".day-dot")
        .forEach((d) => d.classList.remove("drag-over"));
    });
    el.querySelector(".day-dot").addEventListener("dragover", (e) => {
      e.preventDefault();
      el.querySelector(".day-dot").classList.add("drag-over");
    });
    el.querySelector(".day-dot").addEventListener("dragleave", () => {
      el.querySelector(".day-dot").classList.remove("drag-over");
    });
    el.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!dragDayId || dragDayId === el.dataset.dayId) return;
      const trip = getTrip();
      if (!trip) return;
      const fromIdx = trip.days.findIndex((d) => d.id === dragDayId);
      const toIdx = trip.days.findIndex((d) => d.id === el.dataset.dayId);
      if (fromIdx < 0 || toIdx < 0) return;
      const [moved] = trip.days.splice(fromIdx, 1);
      trip.days.splice(toIdx, 0, moved);
      renderEditor();
      showToast("Dia reordenado!", "↕️");
    });
  });
}

// ══════════════════════════════════════════════
// DRAG & DROP — ATIVIDADES
// ══════════════════════════════════════════════
let dragActId = null,
  dragActDayId = null;

function initActivityDrag() {
  document.querySelectorAll(".activity-item").forEach((el) => {
    el.addEventListener("dragstart", (e) => {
      dragActId = el.dataset.actId;
      dragActDayId = el.dataset.dayId;
      el.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
    });
    el.addEventListener("dragend", () => {
      el.classList.remove("dragging");
      dragActId = dragActDayId = null;
      document
        .querySelectorAll(".activity-item")
        .forEach((a) => a.classList.remove("drag-over-activity"));
    });
    el.addEventListener("dragover", (e) => {
      e.preventDefault();
      el.classList.add("drag-over-activity");
    });
    el.addEventListener("dragleave", () =>
      el.classList.remove("drag-over-activity"),
    );
    el.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!dragActId || dragActId === el.dataset.actId) return;
      const trip = getTrip();
      if (!trip) return;
      const fromDay = trip.days.find((d) => d.id === dragActDayId);
      const toDay = trip.days.find((d) => d.id === el.dataset.dayId);
      if (!fromDay || !toDay) return;
      const fromIdx = fromDay.activities.findIndex((a) => a.id === dragActId);
      const toIdx = toDay.activities.findIndex(
        (a) => a.id === el.dataset.actId,
      );
      const [moved] = fromDay.activities.splice(fromIdx, 1);
      toDay.activities.splice(toIdx, 0, moved);
      renderEditor();
      showToast("Atividade movida!", "↕️");
    });
  });
}

// ══════════════════════════════════════════════
// INIT — carrega roteiro de exemplo
// ══════════════════════════════════════════════
(function init() {
  // Popula com o template do Rio como exemplo inicial
  const tpl = TEMPLATES[0];
  const today = new Date().toISOString().split("T")[0];
  const trip = {
    id: uid(),
    name: "Roteiro Rio de Janeiro",
    fromTpl: true,
    startDate: today,
    budgetGoal: "3000",
    days: tpl.data.map((d) => ({
      id: uid(),
      label: d.label,
      activities: d.activities.map((a) => ({ ...a, id: uid() })),
    })),
  };
  state.trips.push(trip);
  state.activeId = trip.id;
  renderSidebar();
  renderEditor();
})();
