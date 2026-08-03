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

    beep();

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

});   // <- ini yang hilang

}      // <- penutup fungsi onScanSuccess

//==================================
// TAMPILKAN HASIL
//==================================
function showResult(res){

    document.getElementById("scannerArea").style.display="none";

    let html="";

    if(res.status){

        html=`
        <div class="success-box">
            <h1>✅</h1>
            <h2>${res.statusAbsen}</h2>
            <h3>${res.nama}</h3>
            <p>Absensi berhasil direkam.</p>
        </div>
        `;

    }else{

        html=`
        <div class="error-box">
            <h1>❌</h1>
            <h2>${res.pesan}</h2>
        </div>
        `;

    }

    document.getElementById("hasil").innerHTML=html;

    setTimeout(()=>{

        document.getElementById("hasil").innerHTML="";

        startScanner();

    },5000);

}
