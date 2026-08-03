const SS = SpreadsheetApp.getActiveSpreadsheet();

const SHEET_KARYAWAN = "DATA BASE KARYAWAN";
const SHEET_ABSENSI = "ABSENSI";
const SHEET_SETTING = "SETTING";


//=====================================
// AMBIL SETTING
//=====================================

function getSetting() {

  const sh = SS.getSheetByName(SHEET_SETTING);

  const data = sh.getRange(2,1,sh.getLastRow()-1,2).getValues();

  let obj = {};

  data.forEach(function(r){

    obj[r[0]] = r[1];

  });

  return obj;

}


//=====================================
// SCAN QR
//=====================================

function scanQR(idStaff) {

  const db = SS.getSheetByName(SHEET_KARYAWAN);
  const absen = SS.getSheetByName(SHEET_ABSENSI);

  const karyawan = db.getRange(2,1,db.getLastRow()-1,2).getValues();

  let nama = "";

  // Cari ID
  for (let i = 0; i < karyawan.length; i++) {

    if (karyawan[i][0] == idStaff) {

      nama = karyawan[i][1];
      break;

    }

  }

  if (nama == "") {

    return {
      status:false,
      pesan:"QR Tidak Terdaftar"
    };

  }

  // Tanggal hari ini
  const hariIni = Utilities.formatDate(
    new Date(),
    "Asia/Jakarta",
    "dd/MM/yyyy"
  );

  // Hitung absensi hari ini
  const data = absen.getRange(2,1,Math.max(absen.getLastRow()-1,0),7).getValues();

  let jumlah = 0;

  data.forEach(function(r){

    if(r[0] == hariIni && r[2] == idStaff){

      jumlah++;

    }

  });

  // Sudah MASUK dan PULANG
  if(jumlah >= 2){

    return{

      status:false,

      pesan:"Anda sudah absen hari ini."

    };

  }

  // Tentukan status
  let statusAbsen = (jumlah == 0) ? "MASUK" : "PULANG";

  simpanAbsensi(idStaff,nama,statusAbsen);

  return{

    status:true,

    id:idStaff,

    nama:nama,

    statusAbsen:statusAbsen,

    pesan:"Absensi Berhasil"

  };

}
//=====================================
// SIMPAN ABSENSI
//=====================================

function simpanAbsensi(id,nama,statusAbsen){

  const sh = SS.getSheetByName(SHEET_ABSENSI);

  const now = new Date();

  sh.appendRow([

    Utilities.formatDate(now,"Asia/Jakarta","dd/MM/yyyy"),

    Utilities.formatDate(now,"Asia/Jakarta","HH:mm:ss"),

    id,

    nama,

    statusAbsen,

    "",

    "BERHASIL"

  ]);

}