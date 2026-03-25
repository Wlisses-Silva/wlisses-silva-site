const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function extractText() {
    const data = new Uint8Array(fs.readFileSync('CV_Wlisses_Silva.pdf'));
    const doc = await pdfjsLib.getDocument({ data }).promise;
    let fullText = '';
    
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const lines = [];
        let lastY = null;
        let currentLine = '';
        
        for (const item of content.items) {
            const y = Math.round(item.transform[5]);
            if (lastY !== null && Math.abs(y - lastY) > 5) {
                lines.push(currentLine);
                currentLine = item.str;
            } else {
                currentLine += (currentLine ? ' ' : '') + item.str;
            }
            lastY = y;
        }
        if (currentLine) lines.push(currentLine);
        fullText += `=== PAGINA ${i} ===\n${lines.join('\n')}\n\n`;
    }
    
    fs.writeFileSync('cv_text.txt', fullText, 'utf8');
    console.log(fullText);
}

extractText().catch(err => console.error('ERRO:', err.message));
