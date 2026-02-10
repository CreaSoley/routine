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
