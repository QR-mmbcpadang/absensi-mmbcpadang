let html5QrCode = null;
let scanning = false;
let currentQR = "";
let stream = null;
// document.addEventListener("DOMContentLoaded", () => {
//     testSelfie();
// });

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
console.log(cameras);
        const cameraId = cameras[cameras.length-1].id;
console.log("START SCANNER");
        await html5QrCode.start(
    cameraId,
    {
        fps: 10,
        qrbox: { width: 250, height: 250 }
    },
    (decodedText) => {
        console.log("QR TERBACA =", decodedText);
        onScanSuccess(decodedText);
    },
    (err) => {}
);

    }catch(err){

    console.error(err);

    setStatus("error","🔴 Gagal terhubung ke server");

    setTimeout(()=>{
        startScanner();
    },2000);

}

}

//==================================
// QR BERHASIL DIBACA
//==================================
async function onScanSuccess(qr){
    console.log("QR TERBACA:", qr);

    if(!scanning) return;

    scanning = false;

    currentQR = qr;

    setStatus("warning","📸 Ambil Selfie");

    await html5QrCode.stop();

    document.getElementById("scannerArea").style.display = "none";

    bukaSelfie();
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
async function bukaSelfie(){

    document.getElementById("scannerArea").style.display = "none";
    document.getElementById("selfieArea").style.display = "block";
document.getElementById("selfieArea").scrollIntoView({
    behavior: "smooth",
    block: "start"
});
    stream = await navigator.mediaDevices.getUserMedia({

        video:{
            facingMode:"user"
        }

    });

    document.getElementById("video").srcObject = stream;

}
//==================================
// AMBIL SELFIE
//==================================
document.getElementById("btnSelfie").addEventListener("click", async ()=>{
};
    console.log("BUTTON DIKLIK");

    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
        );

// ===== WATERMARK =====
const tinggiBox = 110;

ctx.fillStyle = "rgba(0,0,0,0.65)";
ctx.fillRect(
    0,
    canvas.height - tinggiBox,
    canvas.width,
    tinggiBox
);

ctx.fillStyle = "#ffffff";

ctx.font = "bold 26px Arial";
ctx.fillText(
    "MMBC PADANG",
    20,
    canvas.height - 70
);

ctx.font = "22px Arial";
ctx.fillText(
    window.dataAbsen.nama,
    20,
    canvas.height - 40
);

ctx.fillText(
    window.dataAbsen.id,
    20,
    canvas.height - 10
);

const sekarang = new Date();

ctx.textAlign = "right";

ctx.fillText(
    sekarang.toLocaleDateString("id-ID"),
    canvas.width - 20,
    canvas.height - 40
);

ctx.fillText(
    sekarang.toLocaleTimeString("id-ID"),
    canvas.width - 20,
    canvas.height - 10
);

ctx.textAlign = "left";

    const foto = canvas.toDataURL("image/jpeg",0.7);
    // Matikan kamera
if (stream) {
    stream.getTracks().forEach(track => track.stop());
}

    document.getElementById("selfieArea").style.display = "none";

    setStatus("warning","⏳ Mengirim Absensi...");

    try{
        
console.log("SEBELUM FETCH");
const res = await fetch(GAS_URL, {
    method: "POST",
    headers: {
        "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
        action: "scan",
        id: currentQR,
        foto: foto
    })
});
console.log("SESUDAH FETCH");
console.log("Status =", res.status);
console.log("Type =", res.type);
console.log("URL =", res.url);

const hasil = await res.json();
console.log(hasil);

if (hasil.status) {

    tampilBerhasil(hasil);
window.dataAbsen = hasil;
    setTimeout(() => {

        document.getElementById("hasil").innerHTML = "";

        document.getElementById("scannerArea").style.display = "block";

        setStatus("warning","🟡 Menunggu Scan");

    },3000);

} else {

    setStatus("error","❌ " + hasil.pesan);

}

    }catch(err){

        console.error(err);

        setStatus("error","🔴 Gagal terhubung ke server");

        setTimeout(()=>{
            startScanner();
        },2000);

    }

});
document.addEventListener("DOMContentLoaded", () => {
    startScanner();
});
