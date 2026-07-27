import {
    db,
    collection,
    addDoc,
    serverTimestamp
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