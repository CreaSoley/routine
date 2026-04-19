const calendar=document.getElementById("calendar")

const days=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"]

let routines=JSON.parse(localStorage.getItem("routinesData")||`{
"lundi":[
{"time":"09:00","label":"🎓 Formation","type":"cerveau","week":"pair"},
{"time":"11:00","label":"🧹 Sols","type":"menage","week":"all"}
],
"mardi":[
{"time":"09:00","label":"🎨 Créatif","type":"cerveau","week":"all"}
],
"mercredi":[
{"time":"09:00","label":"💻 Codage","type":"cerveau","week":"all"}
],
"jeudi":[
{"time":"09:00","label":"🎓 Formation","type":"cerveau","week":"impair"}
],
"vendredi":[
{"time":"09:00","label":"🗂️ Secrétariat","type":"cerveau","week":"all"}
]
}`)

let exceptions=JSON.parse(localStorage.getItem("exceptions")||"{}")

function getWeekNumber(date){

const d=new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()))
const dayNum=d.getUTCDay()||7
d.setUTCDate(d.getUTCDate()+4-dayNum)
const yearStart=new Date(Date.UTC(d.getUTCFullYear(),0,1))

return Math.ceil((((d-yearStart)/86400000)+1)/7)

}

function getWeekType(date){

return getWeekNumber(date)%2===0?"pair":"impair"

}

function routinesForDate(date){

const day=days[date.getDay()]
const weekType=getWeekType(date)

let list=[...(routines[day]||[])]

list=list.filter(r=>r.week==="all"||r.week===weekType)

const key=date.toISOString().slice(0,10)

if(exceptions[key]){

list=[...list,...exceptions[key]]

}

return list

}

function renderCalendar(){

calendar.innerHTML=""

const start=new Date()

for(let i=0;i<56;i++){

const date=new Date(start)
date.setDate(start.getDate()+i)

const div=document.createElement("div")

div.className="day"

if(date.toDateString()===new Date().toDateString()){
div.classList.add("today")
}

const header=document.createElement("div")
header.className="day-header"

header.textContent=date.toLocaleDateString("fr-FR",{
weekday:"short",
day:"numeric",
month:"short"
})

div.appendChild(header)

const list=routinesForDate(date)

list.forEach(r=>{

const e=document.createElement("div")
e.className="event event-"+r.type

e.textContent=r.time+" "+r.label

div.appendChild(e)

})

div.addEventListener("click",()=>editDay(date))

calendar.appendChild(div)

}

}

function editDay(date){

const label=prompt("Nouvelle activité exceptionnelle")

if(!label)return

const key=date.toISOString().slice(0,10)

if(!exceptions[key])exceptions[key]=[]

exceptions[key].push({
time:"09:00",
label:label,
type:"cerveau"
})

localStorage.setItem("exceptions",JSON.stringify(exceptions))

renderCalendar()

}

document.getElementById("btnAddException").addEventListener("click",()=>{

const date=prompt("Date exception (AAAA-MM-JJ)")

if(!date)return

const label=prompt("Nom activité")

if(!label)return

if(!exceptions[date])exceptions[date]=[]

exceptions[date].push({
time:"09:00",
label:label,
type:"cerveau"
})

localStorage.setItem("exceptions",JSON.stringify(exceptions))

renderCalendar()

})

document.getElementById("btnToday").addEventListener("click",()=>{

window.scrollTo({top:0,behavior:"smooth"})

})

renderCalendar()
