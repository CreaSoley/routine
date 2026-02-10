let fatigueMode = false;

const routines = {
  lundi: [
    { time: "09:00", label: "🎓 Formation Mediatic", type: "cerveau" },
    { time: "11:00", label: "🧹 Sols", type: "menage" },
    { time: "14:00", label: "🥋 Sport / Tai Jitsu", type: "sport" },
  ],
  mardi: [
    { time: "09:00", label: "🎨 Créatif", type: "cerveau" },
    { time: "11:00", label: "🧹 Salle de bain", type: "menage" },
    { time: "14:00", label: "🎨 Créatif libre", type: "cerveau" },
  ],
  mercredi: [
    { time: "09:00", label: "💻 Codage", type: "cerveau" },
    { time: "11:00", label: "🧹 Cuisine", type: "menage" },
    { time: "11:30", label: "🎓 Formation Mediatic", type: "cerveau" },
  ],
  jeudi: [
    { time: "09:00", label: "🎓 Formation Mediatic", type: "cerveau" },
    { time: "11:00", label: "🧹 Linge", type: "menage" },
    { time: "14:00", label: "🎨 Créatif doux", type: "cerveau" },
  ],
  vendredi: [
    { time: "09:00", label: "🗂️ Secrétariat / Créatif", type: "cerveau" },
    { time: "11:00", label: "🧹 Bazar + poubelles", type: "menage" },
    { time: "14:00", label: "🎉 Plaisir / OFF", type: "sport" },
  ],
};

const routineList = document.getElementById("routineList");
const daySelect = document.getElementById("daySelect");
const btnFatigue = document.getElementById("btnFatigue");
const btnNotif = document.getElementById("btnNotif");
const saved = localStorage.getItem("routinesData");
if(saved){
  Object.assign(routines, JSON.parse(saved));
}

function keyFor(day, idx){
  return `done-${day}-${idx}`;
}
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(() => console.log("✅ Service Worker enregistré"))
      .catch(err => console.error("❌ SW error", err));
  });
}

function renderDay(day){
  routineList.innerHTML = "";
  const list = fatigueMode ? routines[day].slice(0, 1) : routines[day];

  list.forEach((item, idx) => {
    const doneKey = keyFor(day, idx);
    const isDone = localStorage.getItem(doneKey) === "1";

    const card = document.createElement("div");
    card.className = `routine-card routine-${item.type} ${isDone ? "done" : ""}`;

    card.innerHTML = `
      <div class="routine-left">
        <div class="routine-time">${item.time}</div>
        <div class="routine-label">${item.label}</div>
      </div>
      <label class="routine-done">
        <input type="checkbox" ${isDone ? "checked" : ""}/>
        fait
      </label>
    `;

    const checkbox = card.querySelector("input");
    checkbox.addEventListener("change", () => {
      localStorage.setItem(doneKey, checkbox.checked ? "1" : "0");
      card.classList.toggle("done", checkbox.checked);
    });

    routineList.appendChild(card);
  });
}

daySelect.addEventListener("change", e => renderDay(e.target.value));

btnFatigue.addEventListener("click", () => {
  fatigueMode = !fatigueMode;
  btnFatigue.textContent = fatigueMode ? "😴 Mode normal" : "🔋 Mode fatigue";
  renderDay(daySelect.value);
});

btnNotif.addEventListener("click", async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    alert("Rappels activés !");
  }
});

// auto jour courant
const days = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
const today = days[new Date().getDay()];
if (routines[today]) {
  daySelect.value = today;
  renderDay(today);
} else {
  renderDay("lundi");
}
window.addEventListener("offline", () => {
  alert("🌙 Tu es hors connexion – Ceralune reste dispo !");
});
const btnEdit = document.getElementById("btnEdit");
const editModal = document.getElementById("editModal");
const btnCloseEdit = document.getElementById("btnCloseEdit");
const routineEditor = document.getElementById("routineEditor");
const daySelectEdit = document.getElementById("daySelectEdit");
const btnAddRoutine = document.getElementById("btnAddRoutine");
const btnSaveEdit = document.getElementById("btnSaveEdit");

// ouvrir/fermer modal
btnEdit.addEventListener("click", () => {
  editModal.style.display = "flex";
  loadEditor(daySelectEdit.value);
});
btnCloseEdit.addEventListener("click", () => editModal.style.display = "none");

// charger les routines dans l'éditeur
function loadEditor(day) {
  routineEditor.innerHTML = "";
  const list = routines[day] || [];
  list.forEach((item, idx) => {
    addRoutineRow(item.time, item.label, item.type, idx);
  });
}

// ajouter une ligne dans l'éditeur
function addRoutineRow(time="", label="", type="cerveau", idx=null) {
  const div = document.createElement("div");
  div.className = "routine-edit-row";
  div.draggable = true;  // rendre draggable
  div.innerHTML = `
    <input type="time" value="${time}" class="edit-time"/>
    <input type="text" value="${label}" placeholder="Label" class="edit-label"/>
    <select class="edit-type">
      <option value="cerveau" ${type==="cerveau"?"selected":""}>Administratif</option>
       <option value="cerveau" ${type==="cerveau"?"selected":""}>Formation</option>
      <option value="menage" ${type==="menage"?"selected":""}>Ménage</option>
      <option value="sport" ${type==="sport"?"selected":""}>Sport</option>
      <option value="sport" ${type==="sport"?"selected":""}>Création</option>
    </select>
    <button class="btn btn-surprise btn-delete">❌</button>
    <hr/>
  `;
  routineEditor.appendChild(div);

  // suppression
  div.querySelector(".btn-delete").addEventListener("click", () => div.remove());

  // --- Drag & Drop ---
  div.addEventListener("dragstart", e => {
    div.classList.add("dragging");
  });

  div.addEventListener("dragend", e => {
    div.classList.remove("dragging");
  });
}

// gestion du drop sur le conteneur
routineEditor.addEventListener("dragover", e => {
  e.preventDefault();
  const afterElement = getDragAfterElement(routineEditor, e.clientY);
  const dragging = routineEditor.querySelector(".dragging");
  if(afterElement == null){
    routineEditor.appendChild(dragging);
  } else {
    routineEditor.insertBefore(dragging, afterElement);
  }
});

// helper pour savoir où insérer
function getDragAfterElement(container, y){
  const draggableElements = [...container.querySelectorAll(".routine-edit-row:not(.dragging)")];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height/2;
    if(offset < 0 && offset > closest.offset){
      return {offset: offset, element: child};
    } else {
      return closest;
    }
  }, {offset: Number.NEGATIVE_INFINITY}).element;
}
