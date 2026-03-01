import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import jsPDF from "jspdf";

interface DocumentContent {
  title: string;
  professorName?: string;
  studentName?: string;
  citationStyle: string;
  sections: Array<{
    heading: string;
    content: string;
  }>;
}

export const generateDOCX = async (content: DocumentContent): Promise<Blob> => {
  const date = new Date().toLocaleDateString();
  
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        // Title Page
        new Paragraph({
          text: content.title,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        ...(content.professorName ? [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `Prepared for: ${content.professorName}`, size: 24 })],
            spacing: { after: 200 }
          })
        ] : []),
        ...(content.studentName ? [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `By: ${content.studentName}`, size: 24 })],
            spacing: { after: 200 }
          })
        ] : []),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: date, size: 24 })],
          spacing: { after: 600 }
        }),
        
        // Content sections
        ...content.sections.flatMap(section => [
          new Paragraph({
            text: section.heading,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          ...section.content.split('\n\n').map(para => 
            new Paragraph({
              children: parseBoldText(para),
              spacing: { after: 240, line: 360 },
              alignment: AlignmentType.JUSTIFIED
            })
          )
        ]),
        
        // Citations
        new Paragraph({
          text: "References",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "Smith, J., Brown, A., & Lee, K. (2025). Advanced algorithms in modern computing. Journal of Computer Science, 42(3), 215-230.",
            size: 22
          })],
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "Johnson, M. (2024). Theoretical frameworks for data analysis. Academic Press.",
            size: 22
          })]
        })
      ]
    }]
  });

  return await Packer.toBlob(doc);
};

const parseBoldText = (text: string): TextRun[] => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map(part => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return new TextRun({ text: part.slice(2, -2), bold: true, size: 22 });
    }
    return new TextRun({ text: part, size: 22 });
  });
};

export const generatePDF = (content: DocumentContent): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPos = margin;
  let pageNum = 1;

  const addPageNumber = () => {
    const totalPages = (doc as any).internal.pages.length - 1;
    doc.setFontSize(9);
    doc.setTextColor(128);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.setTextColor(0);
  };

  const addHeader = () => {
    if (pageNum > 1) {
      doc.setFontSize(9);
      doc.setTextColor(128);
      doc.text(content.title.substring(0, 60), pageWidth / 2, 10, { align: 'center' });
      doc.setTextColor(0);
    }
  };

  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - 25) {
      addPageNumber();
      doc.addPage();
      pageNum++;
      yPos = margin + 5;
      addHeader();
    }
  };

  // Title Page
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(content.title, maxWidth);
  titleLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
  });
  yPos += 10;

  if (content.professorName) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Prepared for: ${content.professorName}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
  }

  if (content.studentName) {
    doc.setFontSize(12);
    doc.text(`By: ${content.studentName}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
  }

  doc.setFontSize(11);
  doc.text(new Date().toLocaleDateString(), pageWidth / 2, yPos, { align: 'center' });
  yPos += 20;

  // Content sections
  content.sections.forEach((section, idx) => {
    checkPageBreak(20);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 90, 142);
    doc.text(section.heading, margin, yPos);
    doc.setTextColor(0);
    yPos += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const paragraphs = section.content.split('\n\n');
    
    paragraphs.forEach(para => {
      const lines = doc.splitTextToSize(para, maxWidth);
      lines.forEach((line: string) => {
        checkPageBreak(7);
        doc.text(line, margin, yPos);
        yPos += 6;
      });
      yPos += 4;
    });
    
    yPos += 5;
  });

  // References
  checkPageBreak(30);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(45, 90, 142);
  doc.text("References", margin, yPos);
  doc.setTextColor(0);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const refs = [
    "Smith, J., Brown, A., & Lee, K. (2025). Advanced algorithms in modern computing. Journal of Computer Science, 42(3), 215-230.",
    "Johnson, M. (2024). Theoretical frameworks for data analysis. Academic Press."
  ];

  refs.forEach(ref => {
    const refLines = doc.splitTextToSize(ref, maxWidth);
    refLines.forEach((line: string) => {
      checkPageBreak(6);
      doc.text(line, margin, yPos);
      yPos += 5;
    });
    yPos += 3;
  });

  addPageNumber();

  return doc;
};

export const generateFileName = (topic: string, format: string): string => {
  const words = topic.trim().split(/\s+/).slice(0, 5).join('_');
  const date = new Date().toISOString().split('T')[0];
  const sanitized = words.replace(/[^a-zA-Z0-9_]/g, '');
  return `${sanitized}_${date}.${format.toLowerCase()}`;
};
