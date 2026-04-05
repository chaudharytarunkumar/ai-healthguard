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
    // Add a tiny delay to ensure all animations (e.g., Recharts) are finished
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate canvas from element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution for better quality
      useCORS: true,
      logging: false,
      backgroundColor: null, // Allow the current theme colors to be captured
      removeContainer: true,
    });

    const imgData = canvas.toDataURL("image/png");
    
    // A4 dimensions in mm
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate image dimensions to fit page width
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Remaining pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
