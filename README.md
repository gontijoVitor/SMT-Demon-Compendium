# SMT V — Demon Compendium

An interactive online compendium of **Shin Megami Tensei V** demons, built with **vanilla JavaScript**, focused on complex data manipulation, manual UI rendering, and scalable code organization.

---

## 📖 Languages

- 🇧🇷 [Português](#portugues)
- 🇺🇸 [English](#english)

---

# 🇧🇷 Português

## Sobre o projeto 📌

Após finalizar **Shin Megami Tensei V**, fiquei impressionado com o tamanho e a complexidade do compêndio de demônios do jogo.  
Isso me motivou a desenvolver uma versão **web interativa** do compêndio, com foco em **exploração de dados**, **usabilidade** e **treino de fundamentos de front-end**, evitando frameworks como React, Vue ou Angular.

O projeto consome dados da biblioteca **megaten** e transforma essas informações em uma interface rica, navegável, filtrável e ordenável.

---

## 🎯 Objetivos

- Praticar **JavaScript puro** com controle total de estado
- Trabalhar com **estruturas de dados complexas**
- Criar interfaces interativas **sem frameworks de front-end**
- Organizar código pensando em **manutenção e escalabilidade**
- Simular desafios reais de aplicações com grandes volumes de dados

---

## 🛠️ Tecnologias utilizadas

- **JavaScript (ES6+)**
- **Vite** — ambiente de desenvolvimento e build
- **Bootstrap 5** — layout, grid system e tooltips
- **Font Awesome** — ícones
- **[megaten](https://github.com/Squiddleton/Megaten)** — fonte de dados dos demônios
- **HTML5 / CSS3**

> ⚠️ **Observação**  
> O Bootstrap é utilizado exclusivamente para **estilização e componentes visuais**.  
> Toda a lógica de estado, filtros, ordenação, paginação e renderização é implementada manualmente em JavaScript.

---

## 🧠 Funcionalidades

- 📋 Listagem completa de demônios do SMT V
- 🔍 Busca dinâmica por nome (case-insensitive)
- 🔃 Ordenação por colunas (nome, raça, nível e arcano)
- 📑 Paginação com seleção de resultados por página
- 🧩 Tooltips informativos contendo:
  - Lore
  - Alignment e Origin
  - Skill Potentials
  - Resistances
  - HP, MP, Stats e Inheritance
- 👁️ Visualização da imagem do demônio via hover
- 🧼 Layout centralizado e consistente

---

## 🧱 Estrutura do projeto

```text
src/
├── main.js              # Lógica principal da aplicação
├── style.css            # Estilos customizados
public/
├── demons/              # Imagens dos demônios
index.html               # Estrutura base da aplicação
````

---

## 🧩 Arquitetura e fluxo de dados

O projeto segue um fluxo previsível de atualização da interface:

```text
Mudança de estado
      ↓
update()
      ↓
ordenar → filtrar → paginar → renderizar
```

Esse fluxo garante consistência visual e evita efeitos colaterais.

---

## 🗂️ Gerenciamento de estado

O estado global da aplicação é controlado manualmente:

```js
let demonData = []
let currentPage = 1
let pageSize = 25

let sortState = {
  column: null,
  direction: 'asc'
}

let searchQuery = ''
```

Toda a UI é derivada exclusivamente dessas variáveis.

---

## 🔁 Pipeline de atualização

A função central da aplicação é:

```js
function update() {
  const filtered = filterDemons(demonData)
  const sorted = sortDemons(filtered)
  const paged = paginate(sorted)

  renderTable(paged)
  renderPagination(sorted.length)
}
```

Ela garante que qualquer alteração de estado:

* Gere uma UI consistente
* Não mutile os dados originais
* Não gere estados duplicados

---

## 📊 Renderização manual da tabela

* Cabeçalho gerado dinamicamente
* Ícones de ordenação sincronizados com o estado
* Linhas renderizadas via `columnConfig`
* Tooltips reinicializados após cada render

Esse processo simula o funcionamento interno de frameworks modernos, porém de forma explícita.

---

## 🔎 Busca e filtros

* Busca por nome **em tempo real**
* Case-insensitive
* Integrada à ordenação e paginação
* Os dados originais nunca são alterados

---

## 🖼️ Imagens dos demônios

* Carregamento dinâmico com base no `devName`
* Fallback automático para imagem padrão
* Resolução fixa para evitar quebra de layout
* Exibição via tooltip para manter a tabela limpa

---

## 🧠 Principais aprendizados

* Controle total de estado sem frameworks
* Manipulação segura de HTML dinâmico
* Separação clara de responsabilidades
* Criação de UI reativa sem Virtual DOM
* Importância de pipelines previsíveis
* Uso consciente de bibliotecas externas

---

## 🚀 Possíveis melhorias futuras

* Filtros avançados (raça, arcano, alinhamento)
* Modal detalhado ao invés de tooltip
* Cache de imagens
* Layout mobile-first
* Tema claro/escuro

---

## 📸 Preview

> *(Adicionar screenshots ou GIFs da aplicação)*

---

## 📄 Licença

Este projeto é apenas para fins educacionais.
Todos os dados e assets pertencem à Atlus.

---

# 🇺🇸 English

## About the project 📌

After finishing **Shin Megami Tensei V**, I was impressed by the size and complexity of the demon compendium.
That inspired me to build a **web-based interactive version**, focusing on **data exploration**, **usability**, and **front-end fundamentals**, without relying on frameworks such as React, Vue, or Angular.

The application consumes data from the **megaten** library and turns it into a searchable, sortable, and paginated interface.

---

## 🎯 Goals

* Practice **vanilla JavaScript** with full control over state
* Work with **complex data structures**
* Build interactive UIs **without front-end frameworks**
* Organize code for **maintainability and scalability**
* Simulate real-world large dataset challenges

---

## 🛠️ Technologies used

* **JavaScript (ES6+)**
* **Vite**
* **Bootstrap 5**
* **Font Awesome**
* **[megaten](https://github.com/Squiddleton/Megaten)**
* **HTML5 / CSS3**

> ⚠️ **Note**
> Bootstrap is used only for **styling and UI components**.
> All application logic is implemented manually in JavaScript.

---

## 🧠 Features

* 📋 Complete SMT V demon list
* 🔍 Real-time name search
* 🔃 Column sorting
* 📑 Pagination with configurable page size
* 🧩 Informational tooltips
* 👁️ Demon image preview on hover

---

## 📄 License

This project is for educational purposes only.
All data and assets belong to Atlus.
