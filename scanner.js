let html5QrCode = null;
let scanning = false;

document.addEventListener("DOMContentLoaded", () => {
    startScanner();
});

//==================================
// START SCANNER
//==================================
async function startScanner(){

    if(scanning) return;

    scanning = true;

    document.getElementById("hasil").innerHTML = "";

    document.getElementById("scannerArea").style.display = "block";

    setStatus("warning","🟡 Menunggu Scan");

    try{

        html5QrCode = new Html5Qrcode("reader");

        const cameras = await Html5Qrcode.getCameras();

        if(cameras.length==0){

            setStatus("error","🔴 Kamera tidak ditemukan");

            return;

        }

        const cameraId = cameras[cameras.length-1].id;

        await html5QrCode.start(
            cameraId,
            {
                fps:10,
                qrbox:{width:250,height:250}
            },
            onScanSuccess,
            ()=>{}
        );

    }catch(err){

        console.error(err);

        setStatus("error","🔴 Tidak dapat membuka kamera");

    }

}

//==================================
// QR BERHASIL DIBACA
//==================================
function onScanSuccess(qr){

    if(!scanning) return;

    scanning=false;
    setStatus("warning","🟡 Sedang Memproses...");

    html5QrCode.stop().then(()=>{

    fetch(
        GAS_URL +
        "?action=scan&id=" +
        encodeURIComponent(qr)
    )
    .then(res => res.json())
    .then(showResult)
    .catch(err => {
        console.error(err);
        setStatus("error","🔴 Gagal terhubung ke server");
    });

});

}

//==================================
// TAMPILKAN HASIL
//==================================
function showResult(res){

    document.getElementById("scannerArea").style.display = "none";

    let html = "";

    if(res.status){

        // Bunyi
        if(res.statusAbsen == "MASUK"){
            beep(1);
        }else{
            beep(2);
        }

        let icon = "";
        let judul = "";
        let pesan = "";

        if(res.statusAbsen == "MASUK"){
            icon = "👋";
            judul = "Selamat Datang";
            pesan = "Semoga harimu menyenangkan 😊";
        }else{
            icon = "🌙";
            judul = "Sampai Jumpa";
            pesan = "Hati-hati di jalan 🚗";
        }

        const jam = new Date().toLocaleTimeString("id-ID");

        html = `
<div class="success-box ${res.statusAbsen.toLowerCase()}">
    <h1>${icon}</h1>
    <h2>${judul}</h2>
    <h3>${res.nama}</h3>
    <p><b>${res.statusAbsen}</b> • ${jam}</p>
    <p>${pesan}</p>
</div>
`;

    }else{

        html = `
<div class="error-box">
    <h1>⚠️</h1>
    <h2>${res.pesan}</h2>
</div>
`;

    }

    document.getElementById("hasil").innerHTML = html;

    setTimeout(()=>{
        document.getElementById("hasil").innerHTML = "";
        startScanner();
    },5000);

}
//==================================
// BEEP
//==================================
function beep(jumlah = 1){

    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    for(let i=0;i<jumlah;i++){

        setTimeout(()=>{

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = "sine";
            osc.frequency.value = 900;

            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

            osc.start();
            osc.stop(ctx.currentTime + 0.12);

        }, i * 180);

    }

}
