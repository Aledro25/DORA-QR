function generateQRCode() {
    const url = document.getElementById("url").value;
    const size = parseInt(document.getElementById("size").value) || 250;
    const ecl = document.getElementById("ecl").value;

    QRCode.toDataURL(url, {
        width: size,
        errorCorrectionLevel: ecl
    }, function (err, url) {
        if (err) {
            console.error(err);
            return;
        }
        document.getElementById("qrCodeResult").innerHTML = `<img src="${url}" alt="QR Code">`;
    });
}
