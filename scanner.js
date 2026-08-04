let html5QrCode = null;
let scanning = false;
let currentQR = "";
let stream = null;
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
async function onScanSuccess(qr){

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

    document.getElementById("selfieArea").style.display = "block";

    stream = await navigator.mediaDevices.getUserMedia({

        video:{
            facingMode:"user"
        }

    });

    document.getElementById("video").srcObject = stream;

}
document.getElementById("btnSelfie").onclick = async function(){

    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video,0,0);

    const foto = canvas.toDataURL("image/jpeg",0.8);

    stream.getTracks().forEach(track=>track.stop());

    document.getElementById("selfieArea").style.display = "none";

    setStatus("warning","⏳ Mengirim Data...");

    fetch(GAS_URL,{
        method:"POST",
        body:JSON.stringify({
            action:"scan",
            id:currentQR,
            foto:foto
        })
    })
    .then(r=>r.json())
    .then(showResult)
    .catch(err=>{
        console.log(err);
        setStatus("error","Gagal kirim");
        startScanner();
    });

}
