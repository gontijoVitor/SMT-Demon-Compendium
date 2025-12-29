import { Demon } from 'megaten'

/* ============================================================
   STATE
============================================================ */

let demonData = []
let currentPage = 1
let pageSize = 25

const columnOrder = ['name', 'race', 'level', 'arcana']
const visibleColumns = new Set(columnOrder)

let sortState = {
  column: null,
  direction: 'asc'
}

/* ============================================================
   COLUMN CONFIG
============================================================ */

const columnConfig = {
  name: { label: 'Name', render: d => d.name },
  race: { label: 'Race', render: d => d.race },
  level: { label: 'Level', render: d => d.level },
  arcana: { label: 'Arcana', render: d => d.arcana ?? '-' }
}

/* ============================================================
   SORT
============================================================ */

function handleSort(column) {
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

function renderPagination(total) {
  const ul = document.getElementById('pagination')
  ul.innerHTML = ''

  if (pageSize === 'all') return

  const pages = Math.ceil(total / pageSize)

  for (let i = 1; i <= pages; i++) {
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
   TABLE
============================================================ */

function renderTable(data) {
  const thead = document.getElementById('table-head')
  const tbody = document.getElementById('table-body')

  thead.innerHTML = ''
  tbody.innerHTML = ''

  columnOrder
    .filter(col => visibleColumns.has(col))
    .forEach(col => {
      const th = document.createElement('th')
      th.style.cursor = 'pointer'

      const icon =
        sortState.column === col
          ? sortState.direction === 'asc'
            ? 'fa-sort-up'
            : 'fa-sort-down'
          : 'fa-sort'

      th.innerHTML = `
        ${columnConfig[col].label}
        <i class="fa-solid ${icon} ms-1 text-secondary"></i>
      `

      th.onclick = () => handleSort(col)
      thead.appendChild(th)
    })

  data.forEach(demon => {
    const tr = document.createElement('tr')

    columnOrder
      .filter(col => visibleColumns.has(col))
      .forEach(col => {
        const td = document.createElement('td')
        td.textContent = columnConfig[col].render(demon)
        tr.appendChild(td)
      })

    tbody.appendChild(tr)
  })
}

/* ============================================================
   UPDATE PIPELINE
============================================================ */

function update() {
  const sorted = sortDemons(demonData)
  const paged = paginate(sorted)

  renderTable(paged)
  renderPagination(sorted.length)
}

/* ============================================================
   EVENTS
============================================================ */

document.getElementById('column-filters').addEventListener('change', e => {
  if (!e.target.value) return

  e.target.checked
    ? visibleColumns.add(e.target.value)
    : visibleColumns.delete(e.target.value)

  update()
})

document.getElementById('page-size').addEventListener('change', e => {
  pageSize = e.target.value === 'all' ? 'all' : Number(e.target.value)
  currentPage = 1
  update()
})

/* ============================================================
   INIT
============================================================ */

function init() {
  demonData = Demon.array
    .filter(d => d.game === 'smt5')
    .sort((a, b) => a.level - b.level)

  document.getElementById('status').classList.add('d-none')
  update()
}

init()
