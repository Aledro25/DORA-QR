// Funzione per generare il QR code
function generateQRCode() {
    const url = document.getElementById("url").value;
    const size = parseInt(document.getElementById("size").value) || 250;
    const ecl = document.getElementById("ecl").value;

    const qrCodeContainer = document.getElementById("qrCodeResult");

    // Rimuove qualsiasi canvas precedente
    qrCodeContainer.innerHTML = "";

    // Crea un nuovo canvas e verifica che sia un elemento valido
    const canvas = document.createElement("canvas");
    if (!(canvas instanceof HTMLCanvasElement)) {
        console.error("Errore nella creazione dell'elemento canvas.");
        return;
    }
    qrCodeContainer.appendChild(canvas);

    // Genera il QR code
    QRCode.toCanvas(canvas, url, {
        width: size,
        errorCorrectionLevel: ecl
    }, function (error) {
        if (error) {
            console.error("Errore nella generazione del QR Code:", error);
        } else {
            document.getElementById("downloadSection").style.display = "block";
            console.log("QR Code generato con successo.");
        }
    });
}

// Funzione per scaricare il QR code nel formato scelto
function downloadQRCode() {
    const format = document.getElementById("format").value;
    const canvas = document.getElementById("qrCodeResult").querySelector("canvas");

    if (!canvas) {
        console.error("Nessun QR Code trovato. Genera il codice prima di scaricare.");
        return;
    }

    if (format === "pdf") {
        // Scarica il QR Code in formato PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 15, 40, 180, 180);
        pdf.save("QRCode.pdf");
    } else if (format === "svg") {
        // Scarica il QR Code in formato SVG
        const svgData = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
                <image href="${canvas.toDataURL("image/png")}" width="100%" height="100%"/>
            </svg>`;
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "QRCode.svg";
        link.click();
        URL.revokeObjectURL(url);
    } else {
        // Scarica il QR Code in formato JPEG o PNG
        const link = document.createElement("a");
        link.download = `QRCode.${format}`;
        link.href = canvas.toDataURL(`image/${format === "jpeg" ? "jpeg" : "png"}`);
        link.click();
    }
}
