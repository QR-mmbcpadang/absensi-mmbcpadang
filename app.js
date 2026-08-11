const GAS_URL = "https://script.google.com/macros/s/AKfycbyokn5uN2NyiHanuwjafc158puU5B6SMR2HBWu2sCsM1e5k4VGwv_8oLuwJtg1_wpF9/exec";

let lokasiAbsen = "";


//==================================================
// JAM DIGITAL
//==================================================

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


//==================================================
// STATUS
//==================================================

function setStatus(type,text){

    const el = document.getElementById("status");

    el.className = "status-box " + type;

    el.innerHTML = text;

}


//==================================================
// BEEP
//==================================================

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

                gain.gain.setValueAtTime(
                    1,
                    audio.currentTime
                );

                gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    audio.currentTime + 0.15
                );

                osc.stop(
                    audio.currentTime + 0.15
                );

            }catch(e){}

        },delay);

    }

    for(let i=0;i<jumlah;i++){

        bunyi(i*220);

    }

}


//==================================================
// TAMPIL BERHASIL
//==================================================

function tampilBerhasil(data){

    const hasil =
        document.getElementById("hasil");

    const scanner =
        document.getElementById("scannerArea");

    scanner.style.display = "none";

    document.getElementById("status")
        .style.display = "none";

    let icon = "🎉";

    let judul = "SELAMAT DATANG";

    let warna = "masuk";

    let pesan =
        "Semoga hari ini lancar dan semangat bekerja 😊";


    if(data.statusAbsen == "PULANG"){

        icon = "👋";

        judul = "SAMPAI JUMPA";

        warna = "pulang";

        pesan =
            "Terima kasih, hati-hati di perjalanan 😊";

    }


    hasil.innerHTML = `

        <div class="success-box ${warna}">

            <h1>${icon}</h1>

            <h2>${judul}</h2>

            <h3>✅ ${data.pesan}</h3>

            <p>
                <b>👤 ${data.nama}</b>
            </p>

            <p>
                🆔 ${data.id}
            </p>

            <p>
                🕒 ${new Date()
                    .toLocaleTimeString("id-ID")}
            </p>

            <p style="margin-top:15px">
                ${pesan}
            </p>

        </div>

    `;

}


//==================================================
// PILIH ABSEN KANTOR
//==================================================

document.getElementById("btnKantor").onclick = function(){

    lokasiAbsen = "KANTOR";

    document.getElementById(
        "pilihanLokasi"
    ).style.display = "none";

    const scanner =
        document.getElementById("scannerArea");

    document.getElementById(
        "loadingCamera"
    ).style.display = "block";


    setTimeout(function(){

        document.getElementById(
            "loadingCamera"
        ).style.display = "none";

        scanner.style.display = "block";

        scanner.classList.add("fadeShow");

        document.getElementById(
            "status"
        ).style.display = "block";

        startScanner();

    },500);

};


//==================================================
// PILIH ABSEN LAPANGAN
//==================================================

document.getElementById("btnLapangan").onclick = function(){

    lokasiAbsen = "LAPANGAN";

    document.getElementById(
        "pilihanLokasi"
    ).style.display = "none";

    const scanner =
        document.getElementById("scannerArea");

    document.getElementById(
        "loadingCamera"
    ).style.display = "block";


    setTimeout(function(){

        document.getElementById(
            "loadingCamera"
        ).style.display = "none";

        scanner.style.display = "block";

        scanner.classList.add("fadeShow");

        document.getElementById(
            "status"
        ).style.display = "block";

        startScanner();

    },500);

};


//==================================================
// HENTIKAN KAMERA / SCANNER
//==================================================

async function hentikanScanner(){

    try{

        if(
            typeof html5QrCode !== "undefined" &&
            html5QrCode
        ){

            try{

                await html5QrCode.stop();

            }catch(e){}

            try{

                await html5QrCode.clear();

            }catch(e){}

        }

    }catch(e){

        console.log(
            "Scanner sudah berhenti"
        );

    }

    if(
        typeof scanning !== "undefined"
    ){

        scanning = false;

    }

}


//==================================================
// TUTUP SELFIE
//==================================================

function hentikanSelfie(){

    try{

        if(
            typeof stream !== "undefined" &&
            stream
        ){

            stream
                .getTracks()
                .forEach(track => track.stop());

            stream = null;

        }

    }catch(e){}

    const selfie =
        document.getElementById("selfieArea");

    if(selfie){

        selfie.style.display = "none";

    }

}


//==================================================
// KEMBALI KE ABSENSI QR
//==================================================

async function bukaAbsensiQR(){

    await hentikanScanner();

    hentikanSelfie();


    // Sembunyikan halaman jadwal
    const jadwal =
        document.getElementById("jadwalPage");

    if(jadwal){

        jadwal.style.display = "none";

    }


    // Sembunyikan halaman log
    const log =
        document.getElementById("logPage");

    if(log){

        log.style.display = "none";

    }


    // Tampilkan halaman utama
    const container =
        document.querySelector(".container");

    if(container){

        container.style.display = "block";

    }


    // Reset hasil
    const hasil =
        document.getElementById("hasil");

    if(hasil){

        hasil.innerHTML = "";

    }


    // Reset pilihan lokasi
    const pilihan =
        document.getElementById("pilihanLokasi");

    if(pilihan){

        pilihan.style.display = "flex";

    }


    // Sembunyikan scanner
    const scanner =
        document.getElementById("scannerArea");

    if(scanner){

        scanner.style.display = "none";

    }


    const status =
        document.getElementById("status");

    if(status){

        status.style.display = "none";

    }


    // Aktifkan tab
    setTabAktif("tabAbsensi");


}


//==================================================
// BUKA JADWAL KERJA
//==================================================

async function bukaJadwal(){

    await hentikanScanner();

    hentikanSelfie();


    const container =
        document.querySelector(".container");

    if(container){

        container.style.display = "none";

    }


    const jadwal =
        document.getElementById("jadwalPage");

    if(!jadwal){

        return;

    }


    jadwal.style.display = "block";


    const isi =
        document.getElementById("isiJadwal");

    isi.innerHTML = `

        <div class="loadingData">

            <div class="loading-spinner"></div>

            <p>📅 Mengambil jadwal kerja...</p>

        </div>

    `;


    setTabAktif("tabJadwal");


    try{

        const res = await fetch(
            GAS_URL,
            {
                method:"POST",

                headers:{
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:JSON.stringify({

                    action:"getJadwal"

                })

            }
        );


        const hasil = await res.json();


        if(!hasil.status){

            isi.innerHTML = `

                <div class="error-box">

                    <h1>⚠️</h1>

                    <h2>
                        ${hasil.pesan}
                    </h2>

                </div>

            `;

            return;

        }


        renderJadwal(
            hasil.data,
            hasil.namaSheet
        );


    }catch(err){

        console.error(err);

        isi.innerHTML = `

            <div class="error-box">

                <h1>🔴</h1>

                <h2>
                    Gagal mengambil jadwal
                </h2>

                <p>
                    Silakan coba lagi.
                </p>

            </div>

        `;

    }

}


//==================================================
// RENDER JADWAL
//==================================================

function renderJadwal(
    data,
    namaSheet
){

    const isi =
        document.getElementById("isiJadwal");


    if(!data || data.length === 0){

        isi.innerHTML = `

            <div class="status-box warning">

                📅 Jadwal masih kosong

            </div>

        `;

        return;

    }


    let html = `

        <div class="pageHeader">

            <div class="pageIcon">
                📅
            </div>

            <div>

                <h1>
                    Jadwal Kerja
                </h1>

                <p>
                    ${namaSheet}
                </p>

            </div>

        </div>


        <div class="tableWrapper">

            <table class="dataTable jadwalTable">

                <tbody>
    `;


    data.forEach(function(row,index){

        html += "<tr>";


        row.forEach(function(cell){

            const tag =
                index === 0
                ? "th"
                : "td";


            let isiCell =
                cell === ""
                ? "-"
                : cell;


            html += `
                <${tag}>
                    ${isiCell}
                </${tag}>
            `;

        });


        html += "</tr>";

    });


    html += `

                </tbody>

            </table>

        </div>

        <div class="tableInfo">

            📌 Jadwal diambil langsung dari
            sheet <b>${namaSheet}</b>

        </div>

    `;


    isi.innerHTML = html;

}


//==================================================
// BUKA LOG HARIAN
//==================================================

async function bukaLogHarian(){

    await hentikanScanner();

    hentikanSelfie();


    const container =
        document.querySelector(".container");

    if(container){

        container.style.display = "none";

    }


    const log =
        document.getElementById("logPage");


    if(!log){

        return;

    }


    log.style.display = "block";


    const isi =
        document.getElementById("isiLogHarian");


    isi.innerHTML = `

        <div class="loadingData">

            <div class="loading-spinner"></div>

            <p>📋 Mengambil log absensi...</p>

        </div>

    `;


    setTabAktif("tabLog");


    try{

        const res = await fetch(
            GAS_URL,
            {
                method:"POST",

                headers:{
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:JSON.stringify({

                    action:"getLogHarian"

                })

            }
        );


        const hasil = await res.json();


        if(!hasil.status){

            isi.innerHTML = `

                <div class="error-box">

                    <h1>⚠️</h1>

                    <h2>
                        ${hasil.pesan}
                    </h2>

                </div>

            `;

            return;

        }


        renderLogHarian(
            hasil.data
        );


    }catch(err){

        console.error(err);

        isi.innerHTML = `

            <div class="error-box">

                <h1>🔴</h1>

                <h2>
                    Gagal mengambil log absensi
                </h2>

                <p>
                    Silakan coba lagi.
                </p>

            </div>

        `;

    }

}


//==================================================
// RENDER LOG HARIAN
//==================================================

function renderLogHarian(data){

    const isi =
        document.getElementById("isiLogHarian");


    if(!data || data.length === 0){

        isi.innerHTML = `

            <div class="status-box warning">

                📋 Belum ada data absensi

            </div>

        `;

        return;

    }


    let html = `

        <div class="pageHeader">

            <div class="pageIcon">
                📋
            </div>

            <div>

                <h1>
                    Log Harian
                </h1>

                <p>
                    Riwayat absensi karyawan
                </p>

            </div>

        </div>


        <div class="tableWrapper">

            <table class="dataTable logTable">

                <tbody>
    `;


    data.forEach(function(row,index){

        html += "<tr>";


        row.forEach(function(cell,colIndex){

            const tag =
                index === 0
                ? "th"
                : "td";


            let isiCell =
                cell === ""
                ? "-"
                : cell;


            // FOTO SELFIE
            // Kolom G = index 6
            if(
                index > 0 &&
                colIndex === 6 &&
                cell &&
                cell.includes("http")
            ){

                isiCell = `

                    <a
                        href="${cell}"
                        target="_blank"
                        class="fotoLink"
                    >
                        📷 Lihat Foto
                    </a>

                `;

            }


            // THUMBNAIL
            // Kolom H = index 7
            if(
                index > 0 &&
                colIndex === 7 &&
                cell &&
                cell.includes("IMAGE")
            ){

                isiCell = cell;

            }


            html += `

                <${tag}>

                    ${isiCell}

                </${tag}>

            `;

        });


        html += "</tr>";

    });


    html += `

                </tbody>

            </table>

        </div>

        <div class="tableInfo">

            📌 Menampilkan maksimal
            <b>200</b> data absensi terbaru.

        </div>

    `;


    isi.innerHTML = html;

}


//==================================================
// SET TAB AKTIF
//==================================================

function setTabAktif(id){

    document
        .querySelectorAll(".menuTab")
        .forEach(function(tab){

            tab.classList.remove(
                "menuTabAktif"
            );

        });


    const aktif =
        document.getElementById(id);


    if(aktif){

        aktif.classList.add(
            "menuTabAktif"
        );

    }

}


//==================================================
// BUAT 3 TAB NAVIGASI
//==================================================

function buatMenuTab(){

    const container =
        document.querySelector(".container");


    if(!container){

        return;

    }


    // Jangan buat dua kali
    if(
        document.getElementById("menuTab")
    ){

        return;

    }


    //================================================
    // MENU
    //================================================

    const menu =
        document.createElement("div");

    menu.id = "menuTab";

    menu.innerHTML = `

        <button
            id="tabAbsensi"
            class="menuTab menuTabAktif"
        >
            📷 Absensi QR
        </button>

        <button
            id="tabJadwal"
            class="menuTab"
        >
            📅 Jadwal Kerja
        </button>

        <button
            id="tabLog"
            class="menuTab"
        >
            📋 Log Harian
        </button>

    `;


    container.insertBefore(
        menu,
        container.firstChild
    );


    //================================================
    // HALAMAN JADWAL
    //================================================

    const jadwal =
        document.createElement("div");

    jadwal.id = "jadwalPage";

    jadwal.style.display = "none";

    jadwal.innerHTML = `

        <div id="isiJadwal"></div>

    `;


    //================================================
    // HALAMAN LOG
    //================================================

    const log =
        document.createElement("div");

    log.id = "logPage";

    log.style.display = "none";

    log.innerHTML = `

        <div id="isiLogHarian"></div>

    `;


    container.appendChild(jadwal);

    container.appendChild(log);


    //================================================
    // EVENT TAB ABSENSI
    //================================================

    document
        .getElementById("tabAbsensi")
        .addEventListener(
            "click",
            bukaAbsensiQR
        );


    //================================================
    // EVENT TAB JADWAL
    //================================================

    document
        .getElementById("tabJadwal")
        .addEventListener(
            "click",
            bukaJadwal
        );


    //================================================
    // EVENT TAB LOG
    //================================================

    document
        .getElementById("tabLog")
        .addEventListener(
            "click",
            bukaLogHarian
        );


}


//==================================================
// STYLE MENU & HALAMAN TAMBAHAN
//==================================================

function buatStyleMenu(){

    if(
        document.getElementById(
            "styleMenuTambahan"
        )
    ){

        return;

    }


    const style =
        document.createElement("style");

    style.id =
        "styleMenuTambahan";


    style.innerHTML = `

        /* =========================================
           MENU TAB
        ========================================= */

        #menuTab{

            display:flex;

            width:100%;

            gap:6px;

            margin-bottom:22px;

            padding:5px;

            background:#f1f5f9;

            border-radius:14px;

            box-shadow:
                0 3px 10px
                rgba(0,0,0,.08);

        }


        .menuTab{

            flex:1;

            border:none;

            background:transparent;

            color:#64748b;

            padding:13px 8px;

            border-radius:10px;

            font-size:15px;

            font-weight:bold;

            cursor:pointer;

            transition:.2s;

        }


        .menuTab:hover{

            background:#e2e8f0;

            color:#1565ff;

        }


        .menuTabAktif{

            background:#1565ff !important;

            color:#fff !important;

            box-shadow:
                0 4px 10px
                rgba(21,101,255,.25);

        }


        /* =========================================
           PAGE
        ========================================= */

        #jadwalPage,
        #logPage{

            width:100%;

            animation:
                fadePage .3s ease;

        }


        @keyframes fadePage{

            from{

                opacity:0;

                transform:
                    translateY(10px);

            }

            to{

                opacity:1;

                transform:
                    translateY(0);

            }

        }


        /* =========================================
           HEADER
        ========================================= */

        .pageHeader{

            display:flex;

            align-items:center;

            gap:15px;

            margin:10px 0 20px;

            padding:18px;

            background:
                linear-gradient(
                    135deg,
                    #eef6ff,
                    #f8fbff
                );

            border-radius:18px;

            text-align:left;

        }


        .pageIcon{

            width:55px;

            height:55px;

            display:flex;

            align-items:center;

            justify-content:center;

            background:#1565ff;

            color:#fff;

            border-radius:15px;

            font-size:28px;

            flex-shrink:0;

        }


        .pageHeader h1{

            margin:0;

            font-size:25px;

            color:#1565ff;

        }


        .pageHeader p{

            margin:4px 0 0;

            color:#64748b;

            font-size:14px;

        }


        /* =========================================
           TABLE
        ========================================= */

        .tableWrapper{

            width:100%;

            overflow-x:auto;

            border-radius:15px;

            border:1px solid #e2e8f0;

            box-shadow:
                0 4px 15px
                rgba(0,0,0,.08);

            background:#fff;

        }


        .dataTable{

            width:max-content;

            min-width:100%;

            border-collapse:collapse;

            font-size:13px;

        }


        .dataTable th{

            background:#1565ff;

            color:#fff;

            padding:11px 9px;

            border:1px solid
                rgba(255,255,255,.2);

            white-space:nowrap;

            position:sticky;

            top:0;

            z-index:2;

        }


        .dataTable td{

            padding:10px 9px;

            border:1px solid #e2e8f0;

            white-space:nowrap;

            text-align:center;

            color:#334155;

        }


        .dataTable tr:nth-child(even) td{

            background:#f8fafc;

        }


        .dataTable tr:hover td{

            background:#eef6ff;

        }


        /* =========================================
           INFO
        ========================================= */

        .tableInfo{

            margin-top:12px;

            padding:10px;

            background:#f8fafc;

            border-radius:10px;

            color:#64748b;

            font-size:13px;

        }


        /* =========================================
           LOADING DATA
        ========================================= */

        .loadingData{

            padding:35px 15px;

            text-align:center;

            color:#1565ff;

            font-weight:bold;

        }


        .loadingData .loading-spinner{

            margin-bottom:12px;

        }


        /* =========================================
           FOTO
        ========================================= */

        .fotoLink{

            display:inline-block;

            padding:6px 10px;

            border-radius:8px;

            background:#eef6ff;

            color:#1565ff;

            text-decoration:none;

            font-weight:bold;

        }


        .fotoLink:hover{

            background:#dbeafe;

        }


        /* =========================================
           MOBILE
        ========================================= */

        @media(max-width:600px){

            #menuTab{

                gap:3px;

            }


            .menuTab{

                font-size:12px;

                padding:12px 4px;

            }


            .pageHeader{

                padding:14px;

            }


            .pageHeader h1{

                font-size:21px;

            }


            .dataTable{

                font-size:12px;

            }


            .dataTable th,
            .dataTable td{

                padding:8px 7px;

            }

        }

    `;


    document.head.appendChild(style);

}


//==================================================
// INITIALIZE MENU
//==================================================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        buatStyleMenu();

        buatMenuTab();

    }
);


//==================================================
// LOADING SCREEN
//==================================================

window.addEventListener(
    "load",
    function(){

        setTimeout(function(){

            const loading =
                document.getElementById(
                    "loadingScreen"
                );

            if(loading){

                loading.style.display =
                    "none";

            }

        },800);

    }
);
