import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Captures a DOM element and downloads it as a PDF.
 * @param elementId The ID of the HTML element to capture.
 * @param filename The name of the downloaded PDF file.
 */
export async function downloadResultAsPDF(elementId: string, filename: string = "AiHealthGuard_Report.pdf") {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found.`);
    return;
  }

  try {
    // Generate canvas from element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff", // Ensure white background for PDF if needed, or null for transparent
    });

    const imgData = canvas.toDataURL("image/png");
    
    // Calculate PDF dimensions (A4)
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Handle multi-page if content is too long
    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
