const Books = [];
let books = Books;
const RENDER_EVENT = "render-book";

const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.querySelector("form");
  const search = document.querySelector(".search-book");

  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
    resetForm();
  });
  if (isStorageExist()) {
    loadDataFormStorage();
  }
  search.addEventListener("submit", (e) => {
    e.preventDefault();
    document.dispatchEvent(new Event(RENDER_EVENT));
  });
});

function searchBook() {
  const query = document.querySelector("#query").value;
  if (query) {
    books = Books.filter((book) => {
      let title = book.title.toLowerCase();
      return title.includes(query.toLowerCase());
    });
  } else {
    books = Books;
  }
}

function addBook() {
  const ID = generateId();
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const year = document.querySelector("#year").value;
  const isComplete = document.querySelector("#isComplete").checked;

  const bookObject = generateBookObject(ID, title, author, year, isComplete);

  Books.unshift(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateBookObject(ID, title, author, year, isComplete) {
  return { ID, title, author, year, isComplete };
}

document.addEventListener(RENDER_EVENT, () => {
  books = Books;
  const inComplete = document.querySelector(".incomplete");
  const isComplete = document.querySelector(".iscomplete");

  inComplete.innerHTML = "";
  isComplete.innerHTML = "";

  searchBook();

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      isComplete.append(bookElement);
    } else {
      inComplete.append(bookElement);
    }
  }
  saveData();
});

function makeBook(book) {
  const article = document.createElement("article");
  article.classList.add("card");

  const div = document.createElement("div");
  const judulBuku = document.createElement("h3");
  const penulisBuku = document.createElement("p");
  const tahun = document.createElement("p");

  judulBuku.innerText = book.title;
  penulisBuku.innerText = "Penulis: " + book.author;
  tahun.innerText = "Tahun: " + book.year;

  div.append(judulBuku, penulisBuku, tahun);

  const action = document.createElement("div");
  const actionBtn = document.createElement("button");
  const removeBtn = document.createElement("button");

  if (book.isComplete) {
    actionBtn.innerText = "Belum selesai dibaca";
  } else {
    actionBtn.innerText = "Selesai dibaca";
  }

  actionBtn.addEventListener("click", () => {
    moveBook(book);
  });

  removeBtn.innerText = "Hapus buku";

  removeBtn.addEventListener("click", () => {
    showDialog(book, article);
  });

  action.classList.add("action");
  actionBtn.classList.add("action-btn");
  removeBtn.classList.add("remove-btn");

  action.append(actionBtn, removeBtn);
  article.append(div, action);

  return article;
}

function showDialog(book, article) {
  const dialog = document.createElement("section");
  dialog.classList.add("dialog");
  const dialogArticle = document.createElement("article");
  const dialogTitle = document.createElement("h2");
  const dialogContent = document.createElement("p");

  dialogTitle.innerText = book.title;
  dialogContent.innerText = "Apakah anda yakin ingin menghapus buku ini?";

  dialogArticle.append(dialogTitle, dialogContent);

  dialog.append(dialogArticle);

  const action = document.createElement("div");
  action.classList.add("action");

  const tidak = document.createElement("button");
  const yakin = document.createElement("button");

  tidak.innerText = "Tidak";
  yakin.innerText = "Yakin";

  tidak.classList.add("action-btn");
  yakin.classList.add("remove-btn");

  action.append(tidak, yakin);
  dialog.append(action);

  article.style.position = "relative";
  article.append(dialog);

  dialog.style.display = "block";

  tidak.addEventListener("click", () => {
    dialog.style.display = "none";
  });
  yakin.addEventListener("click", () => {
    removeBook(book);
  });
}

function moveBook(book) {
  if (book.isComplete) {
    book.isComplete = false;
  } else {
    book.isComplete = true;
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBook(book) {
  let index = Books.indexOf(book);
  Books.splice(index, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function resetForm() {
  const title = document.querySelector("#title");
  const author = document.querySelector("#author");
  const year = document.querySelector("#year");
  const isComplete = document.querySelector("#isComplete");

  title.value = "";
  author.value = "";
  year.value = "";
  isComplete.checked = false;

  const query = document.querySelector("#query");
  query.value = "";
  books = Books;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(Books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFormStorage() {
  const selializeData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(selializeData);
  if (data) {
    for (const book of data) {
      Books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}
