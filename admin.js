import {
db,
collection,
getDocs,
query,
orderBy,
onSnapshot,
doc,
deleteDoc
} from "./firebase.js";

/* =========================
ELEMENT
========================= */

const totalRSVP=document.getElementById("totalRSVP");
const totalGuest=document.getElementById("totalGuest");
const totalWish=document.getElementById("totalWish");
const totalAttend=document.getElementById("totalAttend");
const totalAbsent=document.getElementById("totalAbsent");

const rsvpList=document.getElementById("rsvpList");
const wishList=document.getElementById("wishList");

const loginPage=document.getElementById("loginPage");
const dashboard=document.getElementById("dashboard");
const loginBtn=document.getElementById("loginBtn");
const password=document.getElementById("password");

const logoutBtn=document.getElementById("logoutBtn");
const exportBtn=document.getElementById("exportBtn");

const ADMIN_PASSWORD="Sanbengg15";

function openDashboard(){

loginPage.style.display="none";

dashboard.style.display="block";

}

if(localStorage.getItem("adminLogin")==="true"){

openDashboard();

}

loginBtn.addEventListener("click",()=>{

if(password.value===ADMIN_PASSWORD){

localStorage.setItem("adminLogin","true");

openDashboard();

}else{

alert("Password salah.");

}

});

/* =========================
RSVP
========================= */

const rsvpQuery=query(
collection(db,"rsvp"),
orderBy("createdAt","desc")
);

onSnapshot(rsvpQuery,(snapshot)=>{

rsvpList.innerHTML="";

let guest=0;
let attend=0;
let absent=0;

totalRSVP.textContent=snapshot.size;

snapshot.forEach((item)=>{

const data=item.data();
if(data.hadir==="Hadir"){
    attend++;
}else{
    absent++;
}

guest+=Number(data.jumlah||0);

const card=document.createElement("div");

card.className="listCard";

card.innerHTML=`

<h3>${data.nama}</h3>

<p><strong>Status:</strong> ${data.hadir}</p>

<p><strong>Tetamu:</strong> ${data.jumlah}</p>

<button
class="deleteBtn"
onclick="deleteRSVP('${item.id}')">

Padam

</button>

`;

rsvpList.appendChild(card);

});

totalGuest.textContent=guest;
totalAttend.textContent=attend;
totalAbsent.textContent=absent;

});

/* =========================
UCAPAN
========================= */

const wishQuery=query(
collection(db,"wishes"),
orderBy("createdAt","desc")
);

onSnapshot(wishQuery,(snapshot)=>{

wishList.innerHTML="";

totalWish.textContent=snapshot.size;

snapshot.forEach((item)=>{

const data=item.data();

const card=document.createElement("div");

card.className="listCard";

card.innerHTML=`

<h3>${data.nama}</h3>

<p>${data.ucapan}</p>

<p>❤️ ${data.likes||0}</p>

<button
class="deleteBtn"
onclick="deleteWish('${item.id}')">

Padam

</button>

`;

wishList.appendChild(card);

});

});

/* =========================
DELETE RSVP
========================= */

window.deleteRSVP=async(id)=>{

if(!confirm("Padam RSVP ini?")) return;

await deleteDoc(
doc(db,"rsvp",id)
);

};

/* =========================
DELETE WISH
========================= */

window.deleteWish=async(id)=>{

if(!confirm("Padam ucapan ini?")) return;

await deleteDoc(
doc(db,"wishes",id)
);

};

logoutBtn.addEventListener("click",()=>{

localStorage.removeItem("adminLogin");

location.reload();

});

exportBtn.addEventListener("click", async()=>{

const snapshot=await getDocs(collection(db,"rsvp"));

const data=[];

snapshot.forEach((doc)=>{

const item=doc.data();

data.push({

Nama:item.nama,
Telefon:item.telefon,
Status:item.hadir,
Tetamu:item.jumlah

});

});

const worksheet=XLSX.utils.json_to_sheet(data);

const workbook=XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
workbook,
worksheet,
"RSVP"
);

XLSX.writeFile(
workbook,
"RSVP_Tetamu.xlsx"
);

});