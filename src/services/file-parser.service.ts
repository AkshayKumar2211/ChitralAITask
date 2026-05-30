import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import WordExtractor from "word-extractor";
import { ApiError } from "../utils/api-error";
import { FileType } from "../generated/prisma/client";

export interface ParsedFile {
  text: string;
  fileType: FileType;
}

const MIME_TO_TYPE: Record<string, FileType> = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
};

export function detectFileType(mimetype: string): FileType {
  const type = MIME_TO_TYPE[mimetype];
  if (!type) throw new ApiError(400, `Unsupported file type: ${mimetype}`);
  return type;
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const result = await parser.getText();
  return (result.text || "").trim();
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return (result.value || "").trim();
}

const wordExtractor = new WordExtractor();

async function extractDocText(buffer: Buffer): Promise<string> {
  const doc = await wordExtractor.extract(buffer);
  return (doc.getBody() || "").trim();
}

export async function parseResumeBuffer(
  buffer: Buffer,
  mimetype: string
): Promise<ParsedFile> {
  const fileType = detectFileType(mimetype);

  if (fileType === "PDF") return { text: await extractPdfText(buffer), fileType };
  if (fileType === "DOCX") return { text: await extractDocxText(buffer), fileType };
  if (fileType === "DOC") return { text: await extractDocText(buffer), fileType };

  throw new ApiError(400, `Unsupported file type: ${fileType}`);
}
