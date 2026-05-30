import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { sampleCandidates, type SampleCandidate } from "./sample-data";

const OUTPUT_DIR = path.resolve(__dirname, "../../samples/resumes");

function renderResume(candidate: SampleCandidate, filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 56 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    stream.on("finish", () => resolve());
    stream.on("error", reject);

    // Header
    doc.fontSize(22).font("Helvetica-Bold").text(candidate.name);
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#555")
      .text(candidate.title)
      .moveDown(0.3);
    doc.fontSize(10).text(`${candidate.email}  ·  ${candidate.phone}`);
    doc.moveDown(0.6).fillColor("#000");
    doc
      .strokeColor("#dddddd")
      .lineWidth(0.5)
      .moveTo(56, doc.y)
      .lineTo(539, doc.y)
      .stroke();
    doc.moveDown(0.6);

    // Summary
    section(doc, "Summary");
    doc.fontSize(10).font("Helvetica").text(candidate.summary, { align: "left" });
    doc.moveDown(0.6);

    // Skills
    section(doc, "Skills");
    doc.fontSize(10).text(candidate.skills.join("  ·  "));
    doc.moveDown(0.6);

    // Experience
    section(doc, "Experience");
    candidate.experience.forEach((exp, i) => {
      doc.font("Helvetica-Bold").fontSize(11).text(`${exp.role} — ${exp.company}`);
      doc.font("Helvetica-Oblique").fontSize(9).fillColor("#666").text(exp.period);
      doc.moveDown(0.2).fillColor("#000").font("Helvetica").fontSize(10);
      exp.bullets.forEach((b) => doc.text(`• ${b}`));
      if (i !== candidate.experience.length - 1) doc.moveDown(0.4);
    });
    doc.moveDown(0.6);

    // Education
    section(doc, "Education");
    candidate.education.forEach((ed) => {
      doc.font("Helvetica-Bold").fontSize(11).text(ed.school);
      doc.font("Helvetica").fontSize(10).text(ed.degree);
      doc.font("Helvetica-Oblique").fontSize(9).fillColor("#666").text(ed.period);
      doc.fillColor("#000");
      doc.moveDown(0.2);
    });

    if (candidate.certifications && candidate.certifications.length) {
      doc.moveDown(0.3);
      section(doc, "Certifications");
      doc.fontSize(10).font("Helvetica");
      candidate.certifications.forEach((c) => doc.text(`• ${c}`));
    }

    doc.end();
  });
}

function section(doc: PDFKit.PDFDocument, title: string) {
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#111")
    .text(title.toUpperCase(), { characterSpacing: 1.2 })
    .moveDown(0.2)
    .fillColor("#000");
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const candidate of sampleCandidates) {
    const target = path.join(OUTPUT_DIR, candidate.filename);
    await renderResume(candidate, target);
    console.log(`  ✓ ${candidate.filename}`);
  }
  console.log(`\nGenerated ${sampleCandidates.length} resume PDFs at:`);
  console.log(`  ${OUTPUT_DIR}`);
  console.log("\nNext: upload these via the Resumes page in the UI.");
}

main().catch((err) => {
  console.error("Failed to generate resumes:", err);
  process.exit(1);
});
