// Funzione per generare il QR code
function generateQRCode() {
    const url = document.getElementById("url").value;
    const size = parseInt(document.getElementById("size").value) || 250;
    const ecl = document.getElementById("ecl").value;

    const qrCodeContainer = document.getElementById("qrCodeResult");

    // Rimuove qualsiasi canvas precedente
    qrCodeContainer.innerHTML = "";

    // Crea un nuovo canvas e lo aggiunge al container
    const canvas = document.createElement("canvas");
    qrCodeContainer.appendChild(canvas);

    QRCode.toCanvas(canvas, url, {
        width: size,
        errorCorrectionLevel: ecl
    }, function (error) {
        if (error) {
            console.error(error);
        } else {
            document.getElementById("downloadSection").style.display = "block";
            console.log("QR Code generated successfully.");
        }
    });
}

// Funzione per scaricare il QR code nel formato scelto
function downloadQRCode() {
    const format = document.getElementById("format").value;
    const canvas = document.getElementById("qrCodeResult").querySelector("canvas");

    if (format === "pdf") {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 15, 40, 180, 180);
        pdf.save("QRCode.pdf");
    } else if (format === "svg") {
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
        const link = document.createElement("a");
        link.download = `QRCode.${format}`;
        link.href = canvas.toDataURL(`image/${format === "jpeg" ? "jpeg" : "png"}`);
        link.click();
    }
}
