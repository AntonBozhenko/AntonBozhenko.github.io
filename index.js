let name = document.querySelector("#name"),
  secondName = document.querySelector("#secondName"),
  email = document.querySelector("#email"),
  btn = document.querySelector(".btn"),
  users = document.querySelector(".users"),
  clear = document.querySelector(".clear");
birth = document.querySelector(".birth");
patronymic = document.querySelector(".patronymic");
phaze = document.querySelector("#phaze");
group = document.querySelector(".group");

// Объект для localStorage
let storage = JSON.parse(localStorage.getItem("users")) || {};

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      console.log("Карта USERS обновилась");
      setListeners();
    }
  });
});

observer.observe(users, {
  childList: true,
});

btn.addEventListener("click", getData);
clear.addEventListener("click", clearLocalStorage);

function getData(e) {
  e.preventDefault();
  const data = {};

  data.name = name.value || "";
  data.secondName = secondName.value || "";
  data.patronymic = patronymic.value || "";
  data.birth = birth.value || "";
  data.phaze = phaze.value || "";
  data.group = group.value || "";
  data.email = email.value || "";

  const key = data.email;
  if (storage[key]) {
    storage[key].name = data.name;
    storage[key].secondName = data.secondName;
    storage[key].patronymic = data.patronymic;
    storage[key].birth = data.birth;
    storage[key].phaze = data.phaze;
    storage[key].group = data.group;
  } else {
    let select = Object.entries(storage);
    for (let i = 0; i < select.length; i++) {
      if (
        select[i][1].name === data.name &&
        select[i][1].secondName === data.secondName &&
        select[i][1].patronymic === data.patronymic
      ) {
        delete storage[select[i][0]];
      }
    }
    storage[key] = data;
  }

  localStorage.setItem("users", JSON.stringify(storage));

  rerenderCard(JSON.parse(localStorage.getItem("users")));

  name.value = "";
  secondName.value = "";
  patronymic.value = "";
  birth.value = "";
  phaze.value = "";
  group.value = "";
  email.value = "";

  return data;
}

function createCard({
  name,
  secondName,
  patronymic,
  birth,
  phaze,
  group,
  email,
}) {
  return `
        <div data-out=${email} class="user-outer">
            <div class="user-info">
                <p>${secondName}</p>
                <p>${name}</p>
                <p>${patronymic}</p>
                <p>${birth}</p>
                <p>${phaze}</p>
                <p>${group}</p>
                <p>${email}</p>
            </div>
            <div class="menu">
                <button data-delete=${email} class="delete">Удалить пользователя</button>
                <button data-change=${email} class="change">Перенести данные в форму</button>
            </div>
        </div>
    `;
}

function rerenderCard(storage) {
  users.innerHTML = "";

  /*
    storage имеет структуру
    storage = {
        email1: {
            name: '',
            secondName: '',
            email: ''
        },
        email2: {
            name: '',
            secondName: '',
            email: '',
        }
    }
     */

  /*
    Object.etries переводит объект в массив
    Object.etries(storage) ===>>>> [
            ['email1', {name: '', secondName: '', email: ''}],
            ['email2', {name: '', secondName: '', email: ''}]
        ]
     */

  Object.entries(storage).forEach((user) => {
    // user = ['email1', {name: '', secondName: '', email: ''}]
    const [email, userData] = user;
    console.log("USER  === ", user);
    console.log("EMAIL === ", email);
    console.log("DATA  === ", userData);

    const div = document.createElement("div");
    div.className = "user";
    div.innerHTML = createCard(userData);
    users.append(div);
  });
}

function setListeners() {
  const del = document.querySelectorAll(".delete");
  const change = document.querySelectorAll(".change");
  let clicked;

  del.forEach((n) => {
    n.addEventListener("click", () => {
      console.log("УДАЛИТЬ кнопка");
      console.log("=== NODE:", n);
      clicked = n.getAttribute("data-delete");
      const outer = document.querySelector(`[data-out="${clicked}"]`);
      console.log("=== outer", outer);
      localStorage.removeItem("erg");
      outer.parentElement.remove();
      delete storage[clicked];
      localStorage.setItem("users", JSON.stringify(storage));
    });
  });

  change.forEach((n) => {
    n.addEventListener("click", () => {
      console.log("=== ПРИМЕНИТЬ кнопка");
      clicked = n.getAttribute("data-change");
      name.value = storage[clicked].name;
      secondName.value = storage[clicked].secondName;
      patronymic.value = storage[clicked].patronymic;
      birth.value = storage[clicked].birth;
      phaze.value = storage[clicked].phaze;
      group.value = storage[clicked].group;
      email.value = storage[clicked].email;
    });
  });
}

function clearLocalStorage() {
  window.location.reload();
  localStorage.removeItem("users");
}

function show(el) {
  el.style.display = "block";
}

function hide(el) {
  el.style.display = "none";
}

// После перезагрузки страницы подтягиваем данные из localStorage
window.onload = rerenderCard(JSON.parse(localStorage.getItem("users")));
