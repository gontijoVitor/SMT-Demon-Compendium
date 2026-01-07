/**
 * SMT V – Demons Compendium
 * ------------------------------------------------------------
 * Main application logic responsible for:
 * - Data loading
 * - State management
 * - Search, sorting and pagination
 * - Dynamic table rendering
 * - Tooltips and UI interactions
 *
 * Tech stack:
 * - JavaScript (Vanilla)
 * - Bootstrap (UI + tooltips)
 * - Font Awesome (icons)
 * - megaten library (data source)
 */

import { Demon } from 'megaten'

/* ============================================================
   APPLICATION STATE
============================================================ */

/**
 * Holds all demons loaded from the megaten library
 */
let demonData = []

/**
 * Pagination and filtering state
 */
let currentPage = 1
let pageSize = 25
let searchQuery = ''

/**
 * Table column order (left → right)
 * This array controls the final visual layout
 */
const columnOrder = [
  'image',
  'name',
  'race',
  'level',
  'arcana',
  'lore',
  'affinities',
  'details'
]

/**
 * Columns that can be toggled on/off by the user
 */
const toggleableColumns = new Set([
  'name',
  'race',
  'level',
  'arcana'
])

/**
 * Currently visible columns
 */
const visibleColumns = new Set([...toggleableColumns])

/**
 * Sorting state
 */
let sortState = {
  column: null,
  direction: 'asc'
}

/* ============================================================
   HELPER FUNCTIONS
============================================================ */

/**
 * Escapes HTML to prevent layout breaking or XSS
 */
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Resolves demon image path
 */
function getDemonImage(demon) {
  if (!demon.devName) return '/demons/unknown.png'
  return `/demons/${demon.devName}.png`
}

/**
 * Formats key-value objects (affinities, resistances, etc.)
 */
function formatKeyValue(obj = {}) {
  if (!obj || Object.keys(obj).length === 0) return 'No data'

  return Object.entries(obj)
    .map(([key, value]) => `<strong>${key}</strong>: ${value}`)
    .join('<br>')
}

/**
 * Formats stat blocks
 */
function formatStats(stats = {}) {
  if (!stats || Object.keys(stats).length === 0) return 'No stats data'

  return Object.entries(stats)
    .map(([key, value]) => `<strong>${key.toUpperCase()}</strong>: ${value}`)
    .join('<br>')
}

/**
 * Formats demon alignment
 */
function formatAlignment(alignment) {
  if (!alignment) return '-'
  return `${alignment.moral} / ${alignment.ethical}`
}

/* ============================================================
   SEARCH / FILTERING
============================================================ */

/**
 * Filters demons by search query
 */
function filterBySearch(data) {
  if (!searchQuery) return data

  const q = searchQuery.toLowerCase()

  return data.filter(demon =>
    demon.name?.toLowerCase().includes(q) ||
    demon.race?.toLowerCase().includes(q) ||
    demon.arcana?.toLowerCase().includes(q)
  )
}

/* ============================================================
   COLUMN CONFIGURATION
============================================================ */

/**
 * Centralized column rendering configuration
 * Each column controls:
 * - Label
 * - How the cell content is rendered
 */
const columnConfig = {
  image: {
    label: '',
    render: demon => `
      <i class="fa-solid fa-eye icon-inline"
         data-bs-toggle="tooltip"
         data-bs-html="true"
         data-bs-custom-class="demon-image-tooltip"
         data-bs-title="
           <div style='width:300px;height:300px;display:flex;align-items:center;justify-content:center;background:#000'>
             <img
               src='${getDemonImage(demon)}'
               alt='${escapeHtml(demon.name)}'
               style='max-width:250px;max-height:250px;object-fit:contain'
               onerror='this.src=&quot;/demons/unknown.png&quot;'
             >
           </div>
         ">
      </i>
    `
  },

  name: { label: 'Name', render: d => d.name },
  race: { label: 'Race', render: d => d.race },
  level: { label: 'Level', render: d => d.level },
  arcana: { label: 'Arcana', render: d => d.arcana ?? '-' },

  lore: {
    label: 'Lore',
    render: d => `
      <i class="fa-solid fa-book icon-inline"
         data-bs-toggle="tooltip"
         data-bs-html="true"
         data-bs-title="
           ${escapeHtml(d.lore || 'No lore available')}
           <hr class='my-1'>
           <strong>Alignment:</strong> ${formatAlignment(d.alignment)}<br>
           <strong>Origin:</strong> ${d.origin ?? '-'}
         ">
      </i>
    `
  },

  affinities: {
    label: 'Affinities',
    render: d => `
      <i class="fa-solid fa-bolt icon-inline"
         data-bs-toggle="tooltip"
         data-bs-html="true"
         data-bs-title="
           <u>Skill Potentials</u><br>
           ${formatKeyValue(d.affinities?.skillPotential)}
           <hr class='my-1'>
           <u>Resistances</u><br>
           ${formatKeyValue(d.resistances)}
         ">
      </i>
    `
  },

  details: {
    label: 'Details',
    render: d => `
      <i class="fa-solid fa-circle-info icon-inline"
         data-bs-toggle="tooltip"
         data-bs-html="true"
         data-bs-title="
           <strong>HP:</strong> ${d.hp ?? '-'}<br>
           <strong>MP:</strong> ${d.mp ?? '-'}
           <hr class='my-1'>
           <u>Stats</u><br>
           ${formatStats(d.stats)}
           <hr class='my-1'>
           <strong>Inherit:</strong> ${d.affinities?.inherit ?? '-'}
         ">
      </i>
    `
  }
}

/* ============================================================
   SORTING
============================================================ */

function handleSort(column) {
  if (!visibleColumns.has(column)) return

  if (sortState.column === column) {
    sortState.direction =
      sortState.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortState.column = column
    sortState.direction = 'asc'
  }

  currentPage = 1
  update()
}

function sortDemons(data) {
  if (!sortState.column) return data

  const { column, direction } = sortState

  return [...data].sort((a, b) => {
    const A = a[column] ?? ''
    const B = b[column] ?? ''

    if (typeof A === 'string') {
      return direction === 'asc'
        ? A.localeCompare(B)
        : B.localeCompare(A)
    }

    return direction === 'asc' ? A - B : B - A
  })
}

/* ============================================================
   PAGINATION
============================================================ */

function paginate(data) {
  if (pageSize === 'all') return data
  const start = (currentPage - 1) * pageSize
  return data.slice(start, start + pageSize)
}

function renderPagination(totalItems) {
  const ul = document.getElementById('pagination')
  ul.innerHTML = ''

  if (pageSize === 'all') return

  const totalPages = Math.ceil(totalItems / pageSize)

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li')
    li.className = `page-item ${i === currentPage ? 'active' : ''}`

    const btn = document.createElement('button')
    btn.className = 'page-link bg-dark text-light border-secondary'
    btn.textContent = i
    btn.onclick = () => {
      currentPage = i
      update()
    }

    li.appendChild(btn)
    ul.appendChild(li)
  }
}

/* ============================================================
   TABLE RENDERING
============================================================ */

function shouldRenderColumn(col) {
  return !toggleableColumns.has(col) || visibleColumns.has(col)
}

function renderTable(data) {
  const thead = document.getElementById('table-head')
  const tbody = document.getElementById('table-body')

  thead.innerHTML = ''
  tbody.innerHTML = ''

  // HEADER
  columnOrder.forEach(col => {
    if (!shouldRenderColumn(col)) return

    const th = document.createElement('th')

    if (visibleColumns.has(col)) {
      const icon =
        sortState.column === col
          ? sortState.direction === 'asc'
            ? 'fa-sort-up'
            : 'fa-sort-down'
          : 'fa-sort'

      th.innerHTML = `${columnConfig[col].label} <i class="fa-solid ${icon} ms-1"></i>`
      th.style.cursor = 'pointer'
      th.onclick = () => handleSort(col)
    } else {
      th.textContent = columnConfig[col].label
    }

    thead.appendChild(th)
  })

  // BODY
  data.forEach(demon => {
    const tr = document.createElement('tr')

    columnOrder.forEach(col => {
      if (!shouldRenderColumn(col)) return

      const td = document.createElement('td')
      const content = columnConfig[col].render(demon)

      content.includes('<')
        ? (td.innerHTML = content)
        : (td.textContent = content)

      tr.appendChild(td)
    })

    tbody.appendChild(tr)
  })

  // Bootstrap tooltips
  document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach(el => new bootstrap.Tooltip(el))
}

/* ============================================================
   COLUMN VISIBILITY FILTERS
============================================================ */

function initColumnFilters() {
  const container = document.getElementById('column-filters')

  container.querySelectorAll('input[type="checkbox"]').forEach(input => {
    const col = input.value
    input.checked = visibleColumns.has(col)

    input.addEventListener('change', () => {
      input.checked
        ? visibleColumns.add(col)
        : visibleColumns.delete(col)

      if (sortState.column === col) sortState.column = null
      update()
    })
  })
}

/* ============================================================
   UPDATE PIPELINE
============================================================ */

function update() {
  let data = filterBySearch(demonData)
  data = sortDemons(data)

  renderTable(paginate(data))
  renderPagination(data.length)
}

/* ============================================================
   INITIALIZATION
============================================================ */

function init() {
  demonData = Demon.array
    .filter(d => d.game === 'smt5')
    .sort((a, b) => a.level - b.level)

  document.getElementById('status')?.classList.add('d-none')

  // Search input
  const searchInput = document.getElementById('search-input')
  let debounceTimer

  searchInput.addEventListener('input', e => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      searchQuery = e.target.value.trim()
      currentPage = 1
      update()
    }, 200)
  })

  // Page size selector
  document.getElementById('page-size').addEventListener('change', e => {
    pageSize = e.target.value === 'all' ? 'all' : Number(e.target.value)
    currentPage = 1
    update()
  })

  initColumnFilters()
  update()
}

init()
