const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

/**
 * Helper to extract local file path from an uploads URL
 * @param {string} fileUrl e.g. http://localhost:5003/uploads/123-file.pdf
 * @returns {string|null} local absolute file path
 */
const getFilePathFromUrl = (fileUrl) => {
    if (!fileUrl) return null;
    const parts = fileUrl.split('/uploads/');
    if (parts.length > 1) {
        return path.join(__dirname, '../uploads', parts[1]);
    }
    // Fallback if URL is already a filename
    return path.join(__dirname, '../uploads', fileUrl);
};

/**
 * Compiles original PDF, overlays all texts and signatures, and generates the final flat PDF
 * @param {Object} document Document record from database
 * @returns {Promise<string>} Filename of the final PDF
 */
const compileFinalPdf = async (document) => {
    try {
        const originalPath = getFilePathFromUrl(document.original_file_url);
        if (!originalPath || !fs.existsSync(originalPath)) {
            throw new Error(`Original PDF file not found at path: ${originalPath}`);
        }

        // Read original file buffer
        const originalPdfBytes = fs.readFileSync(originalPath);
        const pdfDoc = await PDFDocument.load(originalPdfBytes);
        const pages = pdfDoc.getPages();
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Overlay fields
        const fields = document.fields || [];
        for (const field of fields) {
            if (field.page_number < 1 || field.page_number > pages.length) {
                console.warn(`Skipping field: page number ${field.page_number} is out of bounds (max ${pages.length})`);
                continue;
            }

            const page = pages[field.page_number - 1];
            const { width, height } = page.getSize();

            // Coordinate conversion from browser percent-space to PDF point-space
            const pdfX = (field.x_percent / 100) * width;
            const pdfWidth = (field.width_percent / 100) * width;
            const pdfHeight = (field.height_percent / 100) * height;
            // PDF has bottom-left origin, Browser has top-left origin
            const pdfY = height - ((field.y_percent / 100) * height) - pdfHeight;

            if (field.field_type === 'text') {
                // Overlay text
                const textValue = field.value || '';
                // Approximate vertical centering
                const fontSize = Math.max(6, Math.min(12, pdfHeight * 0.6));
                const textY = pdfY + (pdfHeight - fontSize) / 2;

                page.drawText(textValue, {
                    x: pdfX + 5, // 5px padding from left
                    y: textY,
                    size: fontSize,
                    font: helveticaFont,
                    color: rgb(0, 0, 0),
                });
            } else if ((field.field_type === 'user_signature' || field.field_type === 'admin_signature') && field.signature_data) {
                // Overlay signature image
                try {
                    // Extract base64 part
                    const sigDataParts = field.signature_data.split(';base64,');
                    const sigBase64 = sigDataParts.length > 1 ? sigDataParts[1] : sigDataParts[0];
                    const sigBuffer = Buffer.from(sigBase64, 'base64');
                    
                    const sigImage = await pdfDoc.embedPng(sigBuffer);
                    page.drawImage(sigImage, {
                        x: pdfX,
                        y: pdfY,
                        width: pdfWidth,
                        height: pdfHeight
                    });
                } catch (imgErr) {
                    console.error(`Failed to embed signature image for field ${field._id}:`, imgErr);
                }
            }
        }

        // Save compiled file
        const finalPdfBytes = await pdfDoc.save();
        const finalFilename = `completed-docu-${Date.now()}-${document._id}.pdf`;
        const finalPath = path.join(__dirname, '../uploads', finalFilename);
        
        // Ensure uploads directory exists
        const uploadDir = path.dirname(finalPath);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        fs.writeFileSync(finalPath, finalPdfBytes);
        return finalFilename;
    } catch (error) {
        console.error('Error in compileFinalPdf:', error);
        throw error;
    }
};

module.exports = {
    compileFinalPdf,
    getFilePathFromUrl
};
