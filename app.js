let fatigueMode=false

const days=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"]

/* programmation de base semaine A / B */

let routines={
lundi:[
{time:"08:00",label:"🧹 Ménage",type:"menage",week:"all"},
{time:"09:00",label:"🥋 Arts Martiaux",type:"sport",week:"all"},
{time:"09:30",label:"🤸 Aérobic",type:"sport",week:"all"},
{time:"10:20",label:"💻 Programmation",type:"cerveau",week:"all"},
{time:"14:00",label:"📚 Formation Bibliothèque",type:"cerveau",week:"pair"},
{time:"14:00",label:"🧏 LSF + Rangement Bureau",type:"cerveau",week:"impair"},
{time:"16:15",label:"🧘 Pilates",type:"sport",week:"all"}
],

mardi:[
{time:"08:00",label:"🧹 Ménage",type:"menage",week:"all"},
{time:"09:00",label:"🥋 Arts Martiaux",type:"sport",week:"all"},
{time:"09:30",label:"🤸 Aérobic",type:"sport",week:"all"},
{time:"10:20",label:"💻 Programmation",type:"cerveau",week:"all"},
{time:"14:00",label:"🎓 Formation",type:"cerveau",week:"all"},
{time:"16:15",label:"🧘 Pilates",type:"sport",week:"all"}
],

mercredi:[
{time:"11:00",label:"🧺 Lessive tapis cochons d’inde",type:"menage",week:"all"},
{time:"11:30",label:"📚 Formation Bibliothèque",type:"cerveau",week:"all"}
],

jeudi:[
{time:"14:00",label:"💻 Programmation",type:"cerveau",week:"pair"},
{time:"14:00",label:"🎨 Art Journal",type:"cerveau",week:"impair"}
],

vendredi:[
{time:"14:00",label:"🎨 Peinture",type:"cerveau",week:"pair"},
{time:"14:00",label:"📚 Formation Bibliothèque",type:"cerveau",week:"impair"}
]
}

/* stockage */

let exceptions=JSON.parse(localStorage.getItem("exceptions")||"{}")
let formationThemes=JSON.parse(localStorage.getItem("formationThemes")||"{}")

/* DOM */

const routineList=document.getElementById("routineList")
const daySelect=document.getElementById("daySelect")
const dateSelect=document.getElementById("dateSelect")

/* calcul semaine */

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

/* routines pour une date */

function routinesForDate(date){

const day=days[date.getDay()]
const weekType=getWeekType(date)

let list=(routines[day]||[]).filter(r=>{
return r.week==="all"||r.week===weekType
})

const key=date.toISOString().slice(0,10)

if(exceptions[key]){

list=[...list,...exceptions[key]]

}

return list

}

/* affichage */

function renderDay(date){

const day=days[date.getDay()]

daySelect.value=day

routineList.innerHTML=""

let list=routinesForDate(date)

if(fatigueMode){
list=list.slice(0,1)
}

list.forEach((item)=>{

const card=document.createElement("div")

card.className=`routine-card routine-${item.type}`

let label=item.label

/* thème formation */

if(label.includes("Formation")){

const key=date.toISOString().slice(0,10)

if(formationThemes[key]){

label+=`<br><small>${formationThemes[key]}</small>`

}

}

card.innerHTML=`

<div class="routine-left">
<div class="routine-time">${item.time}</div>
<div class="routine-label">${label}</div>
</div>

`

routineList.appendChild(card)

})

}

/* choix date */

dateSelect.addEventListener("change",()=>{

const d=new Date(dateSelect.value)

renderDay(d)

})

/* aujourd'hui */

document.getElementById("btnToday").addEventListener("click",()=>{

const today=new Date()

dateSelect.value=today.toISOString().slice(0,10)

renderDay(today)

})

/* fatigue */

document.getElementById("btnFatigue").addEventListener("click",()=>{

fatigueMode=!fatigueMode

renderDay(new Date(dateSelect.value))

})

/* thème formation */

document.getElementById("btnTheme").addEventListener("click",()=>{

const date=dateSelect.value

if(!date){
alert("Choisis une date")
return
}

const theme=prompt("Thème de la formation")

if(!theme)return

formationThemes[date]=theme

localStorage.setItem("formationThemes",JSON.stringify(formationThemes))

renderDay(new Date(date))

})

/* exception */

document.getElementById("btnException").addEventListener("click",()=>{

const date=dateSelect.value

if(!date){
alert("Choisis une date")
return
}

const label=prompt("Activité exceptionnelle")

if(!label)return

if(!exceptions[date])exceptions[date]=[]

exceptions[date].push({
time:"09:00",
label:label,
type:"cerveau"
})

localStorage.setItem("exceptions",JSON.stringify(exceptions))

renderDay(new Date(date))

})

/* démarrage */

const today=new Date()

dateSelect.value=today.toISOString().slice(0,10)

renderDay(today)
