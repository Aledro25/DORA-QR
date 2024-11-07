let generatedQRCode = ''; // Memorizza il codice QR generato (URL)

function generateQRCode() {
    const url = document.getElementById("url").value.trim();  // Rimuovi gli spazi prima e dopo
    const size = parseInt(document.getElementById("size").value) || 250;
    const ecl = document.getElementById("ecl").value;

    // Log dell'input URL per il controllo
    console.log("Input URL:", url);

    // Verifica se l'URL è troppo lungo per essere gestito da un QR Code
    const maxQRCodeDataLength = 2953;  // Limite di dati per un QR code al livello di correzione H (Higher)
    
    if (url.length > maxQRCodeDataLength) {
        alert('The URL is too long to be stored in a QR Code.');
        return;
    }

    // Genera il QR Code come URL Data (PNG/JPEG)
    QRCode.toDataURL(url, {
        width: size,
        errorCorrectionLevel: ecl
    }, function (err, url) {
        if (err) {
            console.error(err);
            return;
        }
        generatedQRCode = url;
        document.getElementById("qrCodeResult").innerHTML = `<img src="${url}" alt="QR Code">`;
        document.getElementById("downloadSection").style.display = 'block';
    });
}

function downloadQRCode() {
    if (!generatedQRCode) {
        alert('Please generate a QR code first.');
        return;
    }

    const format = document.getElementById("format").value;
    let link = document.createElement('a');

    if (format === 'pdf') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.addImage(generatedQRCode, 'JPEG', 10, 10, 180, 180);
        link.href = doc.output('bloburl');
        link.download = 'qr_code.pdf';
        link.click();
    } else {
        link.href = generatedQRCode;
        link.download = `qr_code.${format}`;
        link.click();
    }
}
