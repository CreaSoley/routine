let fatigueMode=false

const days=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"]

const routines={
lundi:[
{time:"09:00",label:"🎓 Formation Mediatic",type:"cerveau",week:"pair"},
{time:"11:00",label:"🧹 Sols",type:"menage",week:"all"},
{time:"14:00",label:"🥋 Sport",type:"sport",week:"all"}
],
mardi:[
{time:"09:00",label:"🎨 Créatif",type:"cerveau",week:"all"},
{time:"11:00",label:"🧹 Salle de bain",type:"menage",week:"all"},
{time:"14:00",label:"🎨 Créatif libre",type:"cerveau",week:"all"}
],
mercredi:[
{time:"09:00",label:"💻 Codage",type:"cerveau",week:"all"},
{time:"11:00",label:"🧹 Cuisine",type:"menage",week:"all"},
{time:"11:30",label:"🎓 Formation",type:"cerveau",week:"impair"}
],
jeudi:[
{time:"09:00",label:"🎓 Formation",type:"cerveau",week:"pair"},
{time:"11:00",label:"🧹 Linge",type:"menage",week:"all"},
{time:"14:00",label:"🎨 Créatif doux",type:"cerveau",week:"all"}
],
vendredi:[
{time:"09:00",label:"🗂️ Secrétariat",type:"cerveau",week:"all"},
{time:"11:00",label:"🧹 Bazar",type:"menage",week:"all"},
{time:"14:00",label:"🎉 OFF",type:"sport",week:"all"}
]
}

let exceptions=JSON.parse(localStorage.getItem("exceptions")||"{}")

const routineList=document.getElementById("routineList")
const daySelect=document.getElementById("daySelect")
const dateSelect=document.getElementById("dateSelect")
const btnFatigue=document.getElementById("btnFatigue")
const btnPlanning=document.getElementById("btnPlanning")
const planning8=document.getElementById("planning8")

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

let list=[...(routines[day]||[])]

const weekType=getWeekType(date)

list=list.filter(r=>!r.week||r.week==="all"||r.week===weekType)

const key=date.toISOString().slice(0,10)

if(exceptions[key]){
list=[...list,...exceptions[key]]
}

return{day,list}
}

function renderDayFromDate(date){

const data=routinesForDate(date)

routineList.innerHTML=""

let list=data.list

if(fatigueMode) list=list.slice(0,1)

list.forEach((item)=>{

const card=document.createElement("div")

card.className=`routine-card routine-${item.type}`

card.innerHTML=`
<div class="routine-left">
<div class="routine-time">${item.time}</div>
<div class="routine-label">${item.label}</div>
</div>
`

routineList.appendChild(card)

})

}

dateSelect.addEventListener("change",()=>{

const d=new Date(dateSelect.value)

renderDayFromDate(d)

})

btnFatigue.addEventListener("click",()=>{

fatigueMode=!fatigueMode

btnFatigue.textContent=fatigueMode?"😴 Mode normal":"🔋 Mode fatigue"

renderDayFromDate(new Date(dateSelect.value||new Date()))

})

function generatePlanning(start,weeks=8){

planning8.innerHTML=""

planning8.style.display="block"

routineList.style.display="none"

for(let i=0;i<weeks*7;i++){

const d=new Date(start)

d.setDate(d.getDate()+i)

const data=routinesForDate(d)

const block=document.createElement("div")

block.style.marginBottom="16px"

block.innerHTML=`<b>${d.toLocaleDateString()} (${data.day})</b>`

data.list.forEach(r=>{

const div=document.createElement("div")

div.textContent=`${r.time} ${r.label}`

block.appendChild(div)

})

planning8.appendChild(block)

}

}

btnPlanning.addEventListener("click",()=>{

generatePlanning(new Date(),8)

})

document.getElementById("btnAuto").addEventListener("click",()=>{

const today=new Date()

dateSelect.value=today.toISOString().slice(0,10)

renderDayFromDate(today)

})

const today=new Date()

dateSelect.value=today.toISOString().slice(0,10)

renderDayFromDate(today)
