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

function openSheet(html) {

    sheetContent.innerHTML = html;

    sheet.classList.add("show");
    overlay.classList.add("show");

}

function closeSheet() {

    sheet.classList.remove("show");
    overlay.classList.remove("show");

}

overlay.addEventListener("click", closeSheet);


/* =========================
TARIKH
========================= */

dateBtn.addEventListener("click", () => {

    openSheet(`

<h2>📅 Tarikh Majlis</h2>

<div class="sheetCard">

<h3>Majlis Perkahwinan</h3>

<p>
19 September 2026<br>
Sabtu<br>
07 Rabiulakhir 1448H
</p>

</div>

<div class="sheetCard">

<h3>Atur Cara</h3>

<p>
08:30 pagi – 01:00 petang
</p>

</div>

`);

});


/* =========================
LOKASI
========================= */

locationBtn.addEventListener("click", () => {

    openSheet(`

<h2>📍 Lokasi Majlis</h2>

<div class="sheetCard">

<img
src="images/maps.jpg"
class="mapPreview"
alt="Lokasi Majlis">

<p style="margin-top:15px;">
Dewan Masjid Al-Muhtahdin,
Saratok, Sarawak.
</p>

<button
class="sheetBtn"
id="googleMapBtn">

🗺️ Google Maps

</button>

<button
class="sheetBtn"
style="margin-top:10px;"
id="wazeBtn">

🚗 Waze

</button>

</div>

`);

    document
        .getElementById("googleMapBtn")
        .addEventListener("click", () => {

            window.open(
                "https://maps.app.goo.gl/1fEtowKYvUUdVZw68?g_st=ic",
                "_blank"
            );

        });

    document
        .getElementById("wazeBtn")
        .addEventListener("click", () => {

            window.open(
                "https://waze.com/ul/hw2r1vsgkw",
                "_blank"
            );

        });

});

/* =========================
RSVP
========================= */

rsvpBtn.addEventListener("click", () => {

    openSheet(`

<h2>📝 RSVP</h2>

<input
id="nama"
class="sheetInput"
placeholder="Nama">

<input
id="jumlahTetamu"
class="sheetInput"
type="number"
min="0"
placeholder="Bilangan Tetamu Yang Hadir">

<select
id="kehadiran"
class="sheetInput">

<option value="Hadir">Hadir</option>
<option value="Tidak Hadir">Tidak Hadir</option>

</select>

<button
id="sendRSVPBtn"
class="sheetBtn">

Hantar RSVP

</button>

<hr>

<div class="rsvp-summary">

<h3>📊 Statistik Kehadiran</h3>

<div class="rsvp-card">
<span>👨‍👩‍👧‍👦 Jumlah Respon</span>
<strong id="responCount">0</strong>
</div>

<div class="rsvp-card">
<span>👥 Jumlah Tetamu Hadir</span>
<strong id="jumlahTetamuCount">0</strong>
</div>

</div>

`);

    const namaInput = document.getElementById("nama");
    const jumlahInput = document.getElementById("jumlahTetamu");
    const hadirSelect = document.getElementById("kehadiran");
    const submitBtn = document.getElementById("sendRSVPBtn");

    hadirSelect.addEventListener("change", () => {

        if (hadirSelect.value === "Tidak Hadir") {

            jumlahInput.value = 0;
            jumlahInput.disabled = true;

        } else {

            jumlahInput.disabled = false;

            if (jumlahInput.value == 0) {
                jumlahInput.value = "";
            }

        }

    });

    submitBtn.addEventListener("click", async () => {

        const nama = namaInput.value.trim();
        const jumlahTetamu = Number(jumlahInput.value || 0);
        const kehadiran = hadirSelect.value;

        if (!nama) {
            alert("Sila masukkan nama.");
            return;
        }

        if (kehadiran === "Hadir" && jumlahTetamu <= 0) {
            alert("Sila masukkan bilangan tetamu.");
            return;
        }

        try {

            await addDoc(collection(db, "rsvp"), {

                nama,
                jumlahTetamu,
                kehadiran,
                createdAt: serverTimestamp()

            });

            alert("Terima kasih. RSVP berjaya dihantar.");

            namaInput.value = "";
            jumlahInput.value = "";
            hadirSelect.selectedIndex = 0;

        } catch (err) {

            console.error(err);
            alert(err.message);

        }

});   // tamat submitBtn.addEventListener

});   // <<< TAMBAH BARIS INI (tamat rsvpBtn.addEventListener)

/* =========================
REALTIME RSVP
========================= */

const rsvpRef = collection(db, "rsvp");

onSnapshot(rsvpRef, (snapshot) => {

    let respon = snapshot.size;
    let jumlahTetamu = 0;

    snapshot.forEach((doc) => {

        const data = doc.data();

        if (data.kehadiran === "Hadir") {
            jumlahTetamu += Number(data.jumlahTetamu || 0);
        }

    });

    const responCount = document.getElementById("responCount");
    const jumlahTetamuCount = document.getElementById("jumlahTetamuCount");

    if (responCount) {
        responCount.textContent = respon;
    }

    if (jumlahTetamuCount) {
        jumlahTetamuCount.textContent = jumlahTetamu;
    }

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