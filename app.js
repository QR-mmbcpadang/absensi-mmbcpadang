const GAS_URL = "https://script.google.com/macros/s/AKfycbyokn5uN2NyiHanuwjafc158puU5B6SMR2HBWu2sCsM1e5k4VGwv_8oLuwJtg1_wpF9/exec";
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

function beep(jumlah = 1){

    function bunyi(delay){

        setTimeout(()=>{

            try{

                const audio = new AudioContext();

                const osc = audio.createOscillator();

                const gain = audio.createGain();

                osc.connect(gain);

                gain.connect(audio.destination);

                osc.frequency.value = 900;

                osc.start();

                gain.gain.setValueAtTime(1,audio.currentTime);

                gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    audio.currentTime + 0.15
                );

                osc.stop(audio.currentTime + 0.15);

            }catch(e){}

        },delay);

    }

    for(let i=0;i<jumlah;i++){

        bunyi(i*220);

    }

}
function tampilBerhasil(data){

    const status = document.getElementById("status");

    let judul = "🎉 Selamat Datang";
    let pesan = "Semoga hari ini lancar dan semangat bekerja 😊";

    if(data.statusAbsen == "PULANG"){
        judul = "👋 Sampai Jumpa";
        pesan = "Terima kasih, hati-hati di perjalanan 😊";
    }

    status.className = "success-box " + data.statusAbsen.toLowerCase();

    status.innerHTML = `
        <h1>${judul}</h1>

        <h2>✅ ${data.pesan}</h2>

        <h3>👤 ${data.nama}</h3>

        <p>🆔 ${data.id}</p>

        <p>🕒 ${new Date().toLocaleTimeString('id-ID')}</p>

        <p style="margin-top:15px;">
            ${pesan}
        </p>
    `;
}
function tampilBerhasil(data){

    const hasil = document.getElementById("hasil");

    let icon = "🎉";
    let judul = "SELAMAT DATANG";
    let warna = "masuk";
    let pesan = "Semoga hari ini lancar dan semangat bekerja 😊";

    if(data.statusAbsen == "PULANG"){
        icon = "👋";
        judul = "SAMPAI JUMPA";
        warna = "pulang";
        pesan = "Terima kasih, hati-hati di perjalanan 😊";
    }

    hasil.innerHTML = `
        <div class="success-box ${warna}">
            <h1>${icon}</h1>
            <h2>${judul}</h2>
            <h3>✅ ${data.pesan}</h3>

            <p><b>👤 ${data.nama}</b></p>
            <p>🆔 ${data.id}</p>
            <p>🕒 ${new Date().toLocaleTimeString("id-ID")}</p>

            <p style="margin-top:15px">${pesan}</p>
        </div>
    `;
}
