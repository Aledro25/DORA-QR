let generatedQRCode = ''; // Memorizza il codice QR generato (URL)
let qrCodeSVG = ''; // Memorizza il codice QR SVG

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
        document.getElementById("downloadSection").style.display = 'block'; // Mostra la sezione per il download
    });
}

function downloadQRCode() {
    const format = document.getElementById("format").value;
    const qrCodeCanvas = document.createElement('canvas');
    const context = qrCodeCanvas.getContext('2d');
    const img = new Image();
    img.src = generatedQRCode;
    
    img.onload = function() {
        qrCodeCanvas.width = img.width;
        qrCodeCanvas.height = img.height;
        context.drawImage(img, 0, 0);
        
        if (format === 'jpeg') {
            const dataUrl = qrCodeCanvas.toDataURL('image/jpeg');
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'qrcode.jpeg';
            a.click();
        } else if (format === 'png') {
            const dataUrl = qrCodeCanvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'qrcode.png';
            a.click();
        } else if (format === 'pdf') {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.addImage(qrCodeCanvas, 'JPEG', 10, 10, 180, 180);
            doc.save('qrcode.pdf');
        }
    };
}

function resetForm() {
    document.getElementById("url").value = "";
    document.getElementById("size").value = 250;
    document.getElementById("ecl").value = "M";
    document.getElementById("qrCodeResult").innerHTML = ""; // Rimuovi il QR code generato
    document.getElementById("downloadSection").style.display = 'none'; // Nascondi la sezione di download
}
