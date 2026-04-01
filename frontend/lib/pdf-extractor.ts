/**
 * Client-Side PDF Text Extractor
 * Uses pdfjs-dist to extract text from PDF files directly in the browser
 * This avoids sending raw PDF buffers to the server, preventing corruption issues
 *
 * Worker is served locally from /public/pdf.worker.min.mjs (no CDN dependency).
 *
 * NOTE: pdfjs-dist is loaded via dynamic import() inside each function.
 * This prevents the "DOMMatrix is not defined" SSR error caused by pdfjs
 * calling `new DOMMatrix()` at module-evaluation time in Node.js.
 */

/** Lazily import pdfjs-dist and configure the worker — safe to call only client-side. */
async function getPdfjsLib() {
  const pdfjsLib = await import('pdfjs-dist');
  if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }
  return pdfjsLib;
}

/**
 * Extract text from a PDF file.
 * @param file - The PDF file to extract text from.
 * @returns Promise resolving to the extracted text as a string.
 * @throws Error if the PDF cannot be read or has no extractable text.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  // Log file metadata upfront for debugging.
  const fileSizeKB = (file.size / 1024).toFixed(1);
  console.log(`📂 PDF extraction started — file: "${file.name}", size: ${fileSizeKB} KB`);

  try {
    // Dynamically load pdfjs-dist (avoids DOMMatrix SSR crash).
    const pdfjsLib = await getPdfjsLib();

    // Convert file to ArrayBuffer.
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document via the local worker.
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    if (!pdf || pdf.numPages === 0) {
      throw new Error('PDF file is empty or invalid');
    }

    console.log(`📄 PDF loaded: ${pdf.numPages} page(s)`);

    // Extract text from all pages sequentially to keep progress order correct.
    const texts: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine all text items; handle both TextItem and TextMarkedContent types.
      const pageText = textContent.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');

      const trimmed = pageText.trim();
      console.log(`  ✔ Page ${pageNum}/${pdf.numPages} — ${trimmed.length} chars`);
      texts.push(trimmed);
    }

    // Concatenate non-empty page texts with newline separators.
    const fullText = texts.filter(t => t.length > 0).join('\n\n');

    if (!fullText || fullText.trim().length === 0) {
      // Graceful fallback instead of a hard throw — callers can still handle the empty string.
      console.warn(
        '⚠️ No text could be extracted from this PDF. ' +
        'It may be a scanned image, an image-only PDF, or a protected file. ' +
        'Please use a text-based PDF or manually paste your resume content.'
      );
      return (
        '[No text could be extracted from this PDF. ' +
        'It appears to be a scanned image or protected file. ' +
        'Please upload a text-based PDF or paste your resume content manually.]'
      );
    }

    console.log(
      `✅ Extraction complete — ${pdf.numPages} page(s) processed, ` +
      `${fullText.length} characters extracted`
    );

    return fullText;
  } catch (error) {
    console.error('❌ Error extracting text from PDF:', error);

    // Re-throw structured errors; wrap unknown ones.
    if (error instanceof Error) {
      throw new Error(`Failed to extract PDF text: ${error.message}`);
    }

    throw new Error(
      'Failed to extract text from PDF. ' +
      'Please ensure the file is a valid, text-based PDF.'
    );
  }
}

/**
 * Validate a PDF file before extraction
 * @param file - The file to validate
 * @returns Object with validation result and optional error message
 */
export function validatePdfFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'Please upload a PDF file' };
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }
  
  // Check minimum size (at least 1KB to avoid empty files)
  if (file.size < 1024) {
    return { valid: false, error: 'File appears to be empty' };
  }
  
  return { valid: true };
}

/**
 * Extract text with a per-page progress callback.
 * Useful for showing loading states in the UI.
 * @param file      - The PDF file.
 * @param onProgress - Called with (currentPage, totalPages) after each page.
 * @returns Promise resolving to the extracted text.
 */
export async function extractTextWithProgress(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<string> {
  const fileSizeKB = (file.size / 1024).toFixed(1);
  console.log(`📂 PDF extraction (with progress) — file: "${file.name}", size: ${fileSizeKB} KB`);

  try {
    // Dynamically load pdfjs-dist (avoids DOMMatrix SSR crash).
    const pdfjsLib = await getPdfjsLib();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    if (!pdf || pdf.numPages === 0) {
      throw new Error('PDF file is empty or invalid');
    }

    console.log(`📄 PDF loaded: ${pdf.numPages} page(s)`);

    const texts: string[] = [];

    // Process pages sequentially so progress callbacks are ordered.
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');

      const trimmed = pageText.trim();
      console.log(`  ✔ Page ${pageNum}/${pdf.numPages} — ${trimmed.length} chars`);
      texts.push(trimmed);

      if (onProgress) {
        onProgress(pageNum, pdf.numPages);
      }
    }

    const fullText = texts.filter(t => t.length > 0).join('\n\n');

    if (!fullText || fullText.trim().length === 0) {
      console.warn(
        '⚠️ No text could be extracted from this PDF. ' +
        'It may be a scanned image, an image-only PDF, or a protected file.'
      );
      return (
        '[No text could be extracted from this PDF. ' +
        'It appears to be a scanned image or protected file. ' +
        'Please upload a text-based PDF or paste your resume content manually.]'
      );
    }

    console.log(
      `✅ Extraction complete — ${pdf.numPages} page(s) processed, ` +
      `${fullText.length} characters extracted`
    );

    return fullText;
  } catch (error) {
    console.error('❌ Error extracting text from PDF:', error);

    if (error instanceof Error) {
      throw new Error(`Failed to extract PDF text: ${error.message}`);
    }

    throw new Error('Failed to extract text from PDF');
  }
}
