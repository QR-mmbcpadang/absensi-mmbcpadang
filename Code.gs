//=====================================
// ABSENSI QR MMBC PADANG
//=====================================

function doGet() {

  return HtmlService
    .createTemplateFromFile("Index")
    .evaluate()
    .setTitle("ABSENSI QR MMBC")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

}

// Include HTML
function include(file) {

  return HtmlService
    .createHtmlOutputFromFile(file)
    .getContent();

}