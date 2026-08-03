//==============================
// JAM DIGITAL
//==============================

function updateClock(){

    const now = new Date();

    const hari = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
    ];

    const bulan = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ];

    const tanggal =
        hari[now.getDay()] + ", " +
        now.getDate() + " " +
        bulan[now.getMonth()] + " " +
        now.getFullYear();

    const jam =
        now.toLocaleTimeString("id-ID");

    document.getElementById("tanggal").innerHTML = tanggal;
    document.getElementById("jam").innerHTML = jam;

}

setInterval(updateClock,1000);
updateClock();


//==============================
// STATUS
//==============================

function setStatus(type,text){

    const el = document.getElementById("status");

    el.className = "status-box " + type;

    el.innerHTML = text;

}


//==============================
// BEEP
//==============================

function beep(){

    try{

        const audio = new AudioContext();

        const osc = audio.createOscillator();

        const gain = audio.createGain();

        osc.connect(gain);

        gain.connect(audio.destination);

        osc.frequency.value = 900;

        osc.start();

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            audio.currentTime + 0.20
        );

        osc.stop(audio.currentTime + 0.20);

    }catch(e){}

}
