let generatedQRCode = ''; // Memorizza il codice QR generato (URL)
let qrCodeSVG = ''; // Memorizza il codice QR SVG

// Funzione per validare l'URL
function isValidURL(url) {
    try {
        new URL(url);  // Tenta di creare un oggetto URL
        return true;
    } catch (_) {
        return false;
    }
}

// Funzione per abilitare o disabilitare il pulsante di generazione in base alla validità dell'URL
function validateURLInput() {
    const url = document.getElementById("url").value.trim();
    const isValid = isValidURL(url);

    // Se l'URL non è valido, disabilita il pulsante
    if (!isValid) {
        document.getElementById("generateButton").disabled = true; // Disabilita il pulsante
    } else {
        document.getElementById("generateButton").disabled = false; // Abilita il pulsante
    }
}

// Aggiungi l'evento di ascolto sull'input URL
document.getElementById("url").addEventListener("input", validateURLInput);

// Funzione per generare il QR Code
function generateQRCode() {
    const url = document.getElementById("url").value.trim();  // Rimuovi gli spazi prima e dopo
    const size = parseInt(document.getElementById("size").value) || 250;
    const ecl = document.getElementById("ecl").value;

    // Verifica se l'URL è troppo lungo per essere gestito da un QR Code
    const maxQRCodeDataLength = 2953;  // Limite di dati per un QR code al livello di correzione H (Highest)
    
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

        // Chiama la funzione per raccogliere i dati dell'URL
        collectURLData(url);
    });
}

// Funzione per raccogliere i dati dell'URL per Google Tag Manager
function collectURLData(url) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: 'qrCodeGenerated',
        url: url
    });
}

// Funzione per scaricare il QR Code
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
        
        let dataUrl;
        if (format === 'jpeg') {
            dataUrl = qrCodeCanvas.toDataURL('image/jpeg');
            downloadImage(dataUrl, 'qrcode.jpeg');
        } else if (format === 'png') {
            dataUrl = qrCodeCanvas.toDataURL('image/png');
            downloadImage(dataUrl, 'qrcode.png');
        } else if (format === 'pdf') {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.addImage(qrCodeCanvas.toDataURL('image/jpeg'), 'JPEG', 10, 10, 180, 180);
            doc.save('qrcode.pdf');
        }
    };
}

// Funzione per scaricare l'immagine
function downloadImage(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
}

// Funzione per ripristinare il modulo
function resetForm() {
    document.getElementById("url").value = "";
    document.getElementById("size").value = 250;
    document.getElementById("ecl").value = "M";
    document.getElementById("qrCodeResult").innerHTML = ""; // Rimuovi il QR code generato
    document.getElementById("downloadSection").style.display = 'none'; // Nascondi la sezione di download
    document.getElementById("generateButton").disabled = true; // Disabilita il pulsante di generazione all'inizio
}