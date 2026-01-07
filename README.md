# SMT V — Demon Compendium

An interactive online compendium of **Shin Megami Tensei V** demons, built with **vanilla JavaScript**, focused on complex data manipulation, manual UI rendering, and scalable code organization.

---

## 📖 Languages

- [Português](#português)
- [English](#english)

---

# Português

## Sobre o projeto 📌

Após finalizar **Shin Megami Tensei V**, fiquei impressionado com o tamanho e a complexidade do compêndio de demônios do jogo.  
Isso me motivou a desenvolver uma versão **web interativa** do compêndio, com foco em **exploração de dados**, **usabilidade** e **treino de fundamentos de front-end**, evitando frameworks como React, Vue ou Angular.

O projeto consome dados da biblioteca **megaten** e transforma essas informações em uma interface rica, navegável, filtrável e ordenável.

---

## 👁️ Preview visual

![Visão geral do compêndio](github_images/visao_geral.png)

![Ordenação por colunas](github_images/filtros_de_colunas.png)

![Busca com imagem do demônio](github_images/pesquisa_com_imagem.png)

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
- **Bootstrap 5**
- **Font Awesome**
- **[megaten](https://github.com/Squiddleton/Megaten)**
- **HTML5 / CSS3**

> ⚠️ **Observação**  
> O Bootstrap é utilizado exclusivamente para **estilização e componentes visuais**.  
> Toda a lógica de estado é implementada manualmente em JavaScript.

---

## 🧠 Funcionalidades

- 📋 Listagem completa de demônios do SMT V
- 🔍 Busca dinâmica por nome
- 🔃 Ordenação por colunas
- 📑 Paginação
- 🧩 Tooltips informativos
- 👁️ Visualização de imagem via hover

---

## 🧱 Estrutura do projeto

```text
src/
├── main.js
├── style.css
public/
├── demons/
index.html
````

---

## 🧩 Arquitetura e fluxo de dados

```text
Mudança de estado
      ↓
update()
      ↓
ordenar → filtrar → paginar → renderizar
```

---

## 🗂️ Gerenciamento de estado

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

---

## 🚀 Possíveis melhorias

* Filtros avançados
* Modal detalhado
* Cache de imagens
* Tema claro/escuro

---

## 📄 Licença

Este projeto é apenas para fins educacionais.
Assets pertencem à Atlus.

---

# English

## About the project 📌

After finishing **Shin Megami Tensei V**, I was impressed by the size and complexity of the demon compendium.
That inspired me to build a **web-based interactive version**, focusing on **data exploration**, **usability**, and **front-end fundamentals**, without relying on frameworks.

---

## 🎯 Goals

* Practice **vanilla JavaScript**
* Work with **complex data structures**
* Build UIs **without frameworks**
* Ensure **maintainability**

---

## 🛠️ Technologies used

* **JavaScript (ES6+)**
* **Vite**
* **Bootstrap 5**
* **Font Awesome**
* **megaten**
* **HTML5 / CSS3**

---

## 📄 License

This project is for educational purposes only.
All data and assets belong to Atlus.
