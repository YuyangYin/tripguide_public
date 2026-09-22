type StatusFn = (msg: string) => void;

const readPdfText = async (file: File, onStatus?: StatusFn): Promise<string> => {
  onStatus?.('正在读取 PDF 文字…');
  const pdfjs = await import('pdfjs-dist');
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const maxPages = Math.min(pdf.numPages, 5);
  const chunks: string[] = [];

  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    chunks.push(pageText);
  }

  const text = chunks.join('\n').replace(/\s+/g, ' ').trim();
  if (text.length >= 24) return text;

  onStatus?.('PDF 无可选文字，改为识别页面…');
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return text;
  await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  return recognizeImage(canvas, onStatus);
};

const recognizeImage = async (image: File | HTMLCanvasElement, onStatus?: StatusFn): Promise<string> => {
  onStatus?.('正在本机识别图片文字…');
  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('eng+chi_sim', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && typeof m.progress === 'number') {
        onStatus?.(`正在本机识别图片文字 ${Math.round(m.progress * 100)}%`);
      }
    },
  });
  try {
    const { data } = await worker.recognize(image);
    return (data.text || '').trim();
  } finally {
    await worker.terminate();
  }
};

export async function extractDocumentText(file: File, onStatus?: StatusFn): Promise<string> {
  if (!file) return '';

  if (file.type.startsWith('text/') || /\.(txt|csv)$/i.test(file.name)) {
    onStatus?.('正在读取文本文件…');
    return (await file.text()).trim();
  }

  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
    return readPdfText(file, onStatus);
  }

  if (file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp|heic)$/i.test(file.name)) {
    return recognizeImage(file, onStatus);
  }

  try {
    return recognizeImage(file, onStatus);
  } catch {
    return '';
  }
}
