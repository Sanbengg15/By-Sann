import {
    db,
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot
} from "./firebase.js";

window.sendRSVP = async function () {

    const nama = document.getElementById("nama")?.value.trim();
    const jumlahTetamu = document.getElementById("jumlahTetamu")?.value;
    const kehadiran = document.getElementById("kehadiran")?.value;

    if (!nama) {
        alert("Sila masukkan nama.");
        return;
    }

    try {

        await addDoc(collection(db, "rsvp"), {
            nama,
            jumlahTetamu: Number(jumlahTetamu || 0),
            kehadiran,
            createdAt: serverTimestamp()
        });

        alert("Terima kasih. RSVP berjaya dihantar.");

        document.getElementById("nama").value = "";
        document.getElementById("jumlahTetamu").value = "";
        document.getElementById("kehadiran").selectedIndex = 0;

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

};

const rsvpRef = collection(db, "rsvp");

onSnapshot(rsvpRef, (snapshot) => {

    let hadir = 0;
    let tidakHadir = 0;
    let jumlahTetamu = 0;
    let respon = snapshot.size;

    snapshot.forEach(doc => {

        const data = doc.data();

        const bil = Number(data.jumlahTetamu || 0);

        jumlahTetamu += bil;

        if(data.kehadiran === "Hadir"){
            hadir += bil;
        }else{
            tidakHadir += bil;
        }

    });

    document.getElementById("responCount").textContent = respon;
    document.getElementById("hadirCount").textContent = hadir;
    document.getElementById("tidakHadirCount").textContent = tidakHadir;
    document.getElementById("jumlahTetamuCount").textContent = jumlahTetamu;

});