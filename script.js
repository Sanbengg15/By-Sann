import {
db,
collection,
addDoc,
getDocs,
doc,
updateDoc,
increment,
serverTimestamp,
onSnapshot,
query,
orderBy
} from "./firebase.js";

/* =========================
ELEMENT
========================= */

const cover=document.getElementById("cover");
const envelope=document.getElementById("envelope");
console.log(envelope);

const loader=document.getElementById("loader");
const website=document.getElementById("website");

const music=document.getElementById("music");
const musicBtn=document.getElementById("musicBtn");

const bottomNav=document.getElementById("bottomNav");

const dateBtn=document.getElementById("dateBtn");
const locationBtn=document.getElementById("locationBtn");
const contactBtn=document.getElementById("contactBtn");
const rsvpBtn=document.getElementById("rsvpBtn");
const wishBtn=document.getElementById("wishBtn");
const shareBtn=document.getElementById("shareBtn");

const sheet=document.getElementById("bottomSheet");
const overlay=document.getElementById("sheetOverlay");
const sheetContent=document.getElementById("sheetContent");

/* =========================
OPEN INVITATION
========================= */

envelope.addEventListener("click",()=>{

envelope.classList.add("opening");

music.play().catch(()=>{});

setTimeout(()=>{

cover.style.display="none";
loader.style.display="flex";

},500);

setTimeout(()=>{

loader.style.display="none";
website.style.display="block";

bottomNav.style.display="flex";

musicBtn.style.display="flex";

musicBtn.classList.add("playing");

window.scrollTo(0,0);

},1800);

});

/* =========================
MUSIC
========================= */

musicBtn.addEventListener("click",()=>{

if(music.paused){

music.play();

musicBtn.classList.add("playing");

}else{

music.pause();

musicBtn.classList.remove("playing");

}

});

/* =========================
COUNTDOWN
========================= */

const weddingDate=new Date("2026-09-19T08:30:00").getTime();

const days=document.getElementById("days");
const hours=document.getElementById("hours");
const minutes=document.getElementById("minutes");
const seconds=document.getElementById("seconds");

function updateCountdown(){

const now=new Date().getTime();

const distance=weddingDate-now;

if(distance<=0){

days.textContent="00";
hours.textContent="00";
minutes.textContent="00";
seconds.textContent="00";

return;

}

days.textContent=String(Math.floor(distance/86400000)).padStart(2,"0");

hours.textContent=String(Math.floor((distance%86400000)/3600000)).padStart(2,"0");

minutes.textContent=String(Math.floor((distance%3600000)/60000)).padStart(2,"0");

seconds.textContent=String(Math.floor((distance%60000)/1000)).padStart(2,"0");

}

updateCountdown();

setInterval(updateCountdown,1000);

/* =========================
BOTTOM SHEET
========================= */

function openSheet(html){

sheetContent.innerHTML=html;

sheet.classList.add("show");

overlay.classList.add("show");

}

function closeSheet(){

sheet.classList.remove("show");

overlay.classList.remove("show");

}

overlay.addEventListener("click",closeSheet);

/* =========================
TARIKH
========================= */

dateBtn.addEventListener("click",()=>{

openSheet(`

<h2>📅 Tarikh Majlis</h2>

<div class="sheetCard">

<h3>Majlis Perkahwinan</h3>

<p>
19 September 2026<br>
Sabtu 
07 Rabiulakhir 1448H
</p>

</div>

<div class="sheetCard">

<h3>Atur Cara Majlis</h3>

<p>
08:30 pagi - 01:00 petang<br>
</p>

</div>

`);

});

/* =========================
LOKASI
========================= */

locationBtn.addEventListener("click",()=>{

openSheet(`

<h2>📍 Lokasi Majlis</h2>

<div class="sheetCard">

<img
src="images/maps.jpg"
class="mapPreview"
alt="Lokasi Majlis"
onclick="window.open('https://maps.app.goo.gl/1fEtowKYvUUdVZw68?g_st=ic','_blank')">

<p style="margin-top:15px;">
Dewan Masjid Al-Muhtahdin, Saratok, Sarawak.
</p>

<button
class="sheetBtn"
onclick="window.open('https://maps.app.goo.gl/1fEtowKYvUUdVZw68?g_st=ic','_blank')">

🗺️ Google Maps

</button>

<button
class="sheetBtn"
style="margin-top:10px;"
onclick="window.open('https://waze.com/ul/hw2r1vsgkw','_blank')">

🚗 Waze

</button>

</div>

`);

});

/* =========================
HUBUNGI
========================= */

contactBtn.addEventListener("click",()=>{

openSheet(`

<h2>📞 Hubungi</h2>

<div class="sheetGrid">

<div class="sheetCard">

<h3>Bapa Pengantin</h3>

<button
class="sheetBtn"
onclick="window.open('https://wa.me/60198942309')">

WhatsApp

</button>

</div>

<div class="sheetCard">

<h3>Mama Pengantin</h3>

<button
class="sheetBtn"
onclick="window.open('https://wa.me/60138298454')">

WhatsApp

</button>

</div>

<div class="sheetCard">

<h3>Kakak Pengantin</h3>

<button
class="sheetBtn"
onclick="window.open('https://wa.me/60198482320')">

WhatsApp

</button>

</div>

</div>

`);

});

/* =========================
RSVP
========================= */

rsvpBtn.addEventListener("click",()=>{

openSheet(`

<h2>📝 RSVP</h2>

<input
id="nama"
class="sheetInput"
placeholder="Nama">

<input
id="jumlah"
class="sheetInput"
type="number"
placeholder="Bilangan Tetamu">

<select
id="hadir"
class="sheetInput">

<option value="Hadir">Hadir</option>

<option value="Tidak Hadir">Tidak Hadir</option>

</select>

<button
class="sheetBtn"
onclick="window.sendRSVP()">
Hantar RSVP
</button>

`);

});

/* =========================
UCAPAN
========================= */

wishBtn.addEventListener("click",()=>{

openSheet(`

<h2>💌 Ucapan</h2>

<input
id="wishName"
class="sheetInput"
placeholder="Nama">

<textarea
id="wishText"
class="sheetTextarea"
placeholder="Tulis ucapan..."></textarea>

<button
class="sheetBtn"
onclick="sendWish()">

Hantar Ucapan

</button>

<div id="wishList"></div>

`);

});

/* =========================
KONGSI
========================= */

shareBtn.addEventListener("click",async()=>{

if(navigator.share){

await navigator.share({

title:"Jemputan Perkahwinan",

text:"Anda Dijemput ❤️",

url:window.location.href

});

}else{

navigator.clipboard.writeText(window.location.href);

alert("Pautan berjaya disalin.");

}

});

/* =========================
FIREBASE RSVP
========================= */

window.sendRSVP = async function(){

    const nama=document.getElementById("nama").value.trim();
    const jumlah=document.getElementById("jumlah").value.trim();
    const hadir=document.getElementById("hadir").value;

    if(!nama){
        alert("Sila masukkan nama.");
        return;
    }

    try{

        await addDoc(collection(db,"rsvp"),{
            nama,
            jumlah:Number(jumlah||0),
            hadir,
            createdAt:serverTimestamp()
        });

        alert("RSVP berjaya dihantar.");

        closeSheet();

    }catch(e){

        console.error(e);

        alert(e.code + "\n" + e.message);

    }

};
/* =========================
FIREBASE UCAPAN
========================= */

window.sendWish = async function(){

const nama=document.getElementById("wishName").value.trim();
const ucapan=document.getElementById("wishText").value.trim();

if(!nama||!ucapan){
alert("Sila lengkapkan maklumat.");
return;
}

try{

await addDoc(collection(db,"wishes"),{

nama,
ucapan,
likes:0,
createdAt:serverTimestamp()

});

document.getElementById("wishName").value="";
document.getElementById("wishText").value="";

}catch(e){

console.error(e);

alert("Ucapan gagal dihantar.");

}

};

/* =========================
LOAD UCAPAN (REALTIME)
========================= */

const wishQuery=query(
collection(db,"wishes"),
orderBy("createdAt","desc")
);

onSnapshot(wishQuery,(snapshot)=>{

const list=document.getElementById("wishList");

if(!list) return;

list.innerHTML="";

snapshot.forEach((item)=>{

const data=item.data();

const div=document.createElement("div");

div.className="sheetCard";

div.innerHTML=`

<h3>${data.nama}</h3>

<p>${data.ucapan}</p>

<button
class="sheetBtn"
onclick="likeWish('${item.id}')">

❤️ ${data.likes||0}

</button>

`;

list.appendChild(div);

});

});

/* =========================
LIKE UCAPAN
========================= */

window.likeWish=async function(id){

await updateDoc(
doc(db,"wishes",id),
{
likes:increment(1)
}
);

};

/* =========================
FADE ANIMATION
========================= */

const observer=new IntersectionObserver((entries)=>{

entries.forEach((entry)=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{
threshold:0.15
});

document.querySelectorAll(".fade-section").forEach((el)=>{

observer.observe(el);

});

/* =========================
DISABLE IMAGE DRAG
========================= */

document.querySelectorAll("img").forEach((img)=>{

img.setAttribute("draggable","false");

});

/* =========================
DISABLE RIGHT CLICK
========================= */

document.addEventListener("contextmenu",(e)=>{

e.preventDefault();

});

console.log("SCRIPT HABIS LOADED");
console.log(window.sendRSVP);