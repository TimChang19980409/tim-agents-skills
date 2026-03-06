#!/usr/bin/env bun

import { extractText, getDocumentProxy, getMeta } from 'unpdf';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

declare const Bun: {
  file: (path: string) => {
    exists: () => Promise<boolean>;
    arrayBuffer: () => Promise<ArrayBuffer>;
    size: number;
  };
  spawnSync: (options: {
    cmd: string[];
    stdout?: 'pipe' | 'inherit' | 'ignore';
    stderr?: 'pipe' | 'inherit' | 'ignore';
  }) => {
    exitCode: number;
    stdout: Uint8Array;
    stderr: Uint8Array;
  };
};

declare const process: {
  argv: string[];
  cwd: () => string;
  exit: (code: number) => never;
  stdout: { write: (content: string) => void };
  stderr: { write: (content: string) => void };
};

type CliOptions = {
  filePath: string;
  pageSpec?: string;
  json: boolean;
  maxChars?: number;
  ocrMode: OcrMode;
  ocrLang: string;
  ocrMinChars: number;
  help: boolean;
};

type OcrMode = 'off' | 'auto' | 'all';
type PageSource = 'text' | 'ocr' | 'hybrid' | 'empty';

type ExtractedPage = {
  page: number;
  text: string;
  chars: number;
  source: PageSource;
};

type CliErrorType =
  | 'file-not-found'
  | 'password-protected'
  | 'invalid-pdf'
  | 'truncated-pdf'
  | 'usage'
  | 'unknown';

class UsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UsageError';
  }
}

const HELP_TEXT = `Usage:
  bun read-pdf.ts <file.pdf> [--pages <range>] [--json] [--max-chars <n>] [--ocr|--ocr-all|--no-ocr] [--ocr-lang <lang>] [--ocr-min-chars <n>] [--help]

Options:
  --pages <range>     頁碼範圍，支援: 1, 1-3, 1,3,5-7
  --json              以 JSON 輸出
  --max-chars <n>     每頁最多輸出字元數
  --ocr               自動 OCR：僅對低文字頁補 OCR（預設模式）
  --ocr-all           所有頁面皆執行 OCR，並補充到輸出
  --no-ocr            停用 OCR
  --ocr-lang <lang>   tesseract 語言包（預設: eng+chi_tra）
  --ocr-min-chars <n> 自動 OCR 啟動門檻（預設: 24）
  --help              顯示此說明
`;

function printHelp(): void {
  process.stdout.write(HELP_TEXT);
}

function parsePositiveInt(value: string, flagName: string): number {
  if (!/^\d+$/.test(value)) {
    throw new UsageError(`${flagName} 必須是正整數: ${value}`);
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new UsageError(`${flagName} 必須是大於 0 的整數: ${value}`);
  }
  return parsed;
}

function parseOcrMode(value: string): OcrMode {
  if (value === 'off' || value === 'auto' || value === 'all') {
    return value;
  }
  throw new UsageError(`--ocr 只支援 off|auto|all，目前為: ${value}`);
}

function parseArgs(argv: string[]): CliOptions {
  if (argv.includes('--help')) {
    return {
      filePath: '',
      json: false,
      ocrMode: 'auto',
      ocrLang: 'eng+chi_tra',
      ocrMinChars: 24,
      help: true,
    };
  }

  let filePath = '';
  let pageSpec: string | undefined;
  let json = false;
  let maxChars: number | undefined;
  let ocrMode: OcrMode = 'auto';
  let ocrLang = 'eng+chi_tra';
  let ocrMinChars = 24;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--json') {
      json = true;
      continue;
    }

    if (arg === '--pages' || arg.startsWith('--pages=')) {
      const value = arg.includes('=') ? arg.slice('--pages='.length) : argv[++i];
      if (!value) {
        throw new UsageError('--pages 需要指定頁碼範圍');
      }
      pageSpec = value;
      continue;
    }

    if (arg === '--max-chars' || arg.startsWith('--max-chars=')) {
      const value = arg.includes('=') ? arg.slice('--max-chars='.length) : argv[++i];
      if (!value) {
        throw new UsageError('--max-chars 需要指定數值');
      }
      maxChars = parsePositiveInt(value, '--max-chars');
      continue;
    }

    if (arg === '--ocr') {
      ocrMode = 'auto';
      continue;
    }

    if (arg.startsWith('--ocr=')) {
      const value = arg.slice('--ocr='.length);
      if (!value) {
        throw new UsageError('--ocr 需要指定 off|auto|all');
      }
      ocrMode = parseOcrMode(value);
      continue;
    }

    if (arg === '--ocr-all') {
      ocrMode = 'all';
      continue;
    }

    if (arg === '--no-ocr') {
      ocrMode = 'off';
      continue;
    }

    if (arg === '--ocr-lang' || arg.startsWith('--ocr-lang=')) {
      const value = arg.includes('=') ? arg.slice('--ocr-lang='.length) : argv[++i];
      if (!value?.trim()) {
        throw new UsageError('--ocr-lang 需要指定語言，例如 eng+chi_tra');
      }
      ocrLang = value.trim();
      continue;
    }

    if (arg === '--ocr-min-chars' || arg.startsWith('--ocr-min-chars=')) {
      const value = arg.includes('=') ? arg.slice('--ocr-min-chars='.length) : argv[++i];
      if (!value) {
        throw new UsageError('--ocr-min-chars 需要指定數值');
      }
      ocrMinChars = parsePositiveInt(value, '--ocr-min-chars');
      continue;
    }

    if (arg.startsWith('--')) {
      throw new UsageError(`不支援的參數: ${arg}`);
    }

    if (filePath) {
      throw new UsageError(`只允許一個 PDF 檔案路徑，目前多出: ${arg}`);
    }
    filePath = arg;
  }

  if (!filePath) {
    throw new UsageError('請提供 PDF 檔案路徑');
  }

  return {
    filePath,
    pageSpec,
    json,
    maxChars,
    ocrMode,
    ocrLang,
    ocrMinChars,
    help: false,
  };
}

function parsePageSpec(spec: string): number[] {
  const pages = new Set<number>();
  const parts = spec
    .split(',')
    .map(part => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    throw new UsageError('--pages 格式不可為空');
  }

  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      pages.add(parsePositiveInt(part, '--pages'));
      continue;
    }

    const rangeMatch = part.match(/^(\d+)-(\d+)$/);
    if (!rangeMatch) {
      throw new UsageError(`--pages 格式錯誤: ${part}`);
    }

    const start = parsePositiveInt(rangeMatch[1], '--pages');
    const end = parsePositiveInt(rangeMatch[2], '--pages');
    if (start > end) {
      throw new UsageError(`--pages 範圍起始不可大於結束: ${part}`);
    }

    for (let page = start; page <= end; page += 1) {
      pages.add(page);
    }
  }

  return [...pages].sort((a, b) => a - b);
}

function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[\t\f\v]+/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

type CommandResult = {
  ok: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
};

function decodeBytes(value: Uint8Array | undefined): string {
  return value ? new TextDecoder().decode(value) : '';
}

function runCommand(cmd: string[]): CommandResult {
  try {
    const result = Bun.spawnSync({
      cmd,
      stdout: 'pipe',
      stderr: 'pipe',
    });
    const exitCode = typeof result.exitCode === 'number' ? result.exitCode : 1;
    return {
      ok: exitCode === 0,
      exitCode,
      stdout: decodeBytes(result.stdout),
      stderr: decodeBytes(result.stderr),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      exitCode: 1,
      stdout: '',
      stderr: message,
    };
  }
}

function detectOcrSupport(): { available: boolean; missing: string[] } {
  const requiredCommands = ['pdftoppm', 'tesseract'];
  const missing = requiredCommands.filter(command => !runCommand(['which', command]).ok);
  return {
    available: missing.length === 0,
    missing,
  };
}

function shouldRunOcr(page: ExtractedPage, options: CliOptions): boolean {
  if (options.ocrMode === 'off') {
    return false;
  }
  if (options.ocrMode === 'all') {
    return true;
  }
  return page.chars < options.ocrMinChars;
}

function normalizeForCompare(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

function mergePageText(basePage: ExtractedPage, ocrText: string, mode: OcrMode): ExtractedPage {
  const cleanedOcr = cleanText(ocrText);
  if (!cleanedOcr) {
    return basePage;
  }

  if (!basePage.text) {
    return {
      ...basePage,
      text: cleanedOcr,
      chars: cleanedOcr.length,
      source: 'ocr',
    };
  }

  const baseNormalized = normalizeForCompare(basePage.text);
  const ocrNormalized = normalizeForCompare(cleanedOcr);
  if (baseNormalized && baseNormalized === ocrNormalized) {
    return basePage;
  }

  if (mode === 'auto') {
    if (cleanedOcr.length > basePage.text.length + 16) {
      return {
        ...basePage,
        text: cleanedOcr,
        chars: cleanedOcr.length,
        source: 'ocr',
      };
    }
    return basePage;
  }

  if (cleanedOcr.length <= Math.max(40, Math.floor(basePage.text.length * 0.3))) {
    return basePage;
  }

  const hybridText = `${basePage.text}\n\n[OCR supplement]\n${cleanedOcr}`;
  return {
    ...basePage,
    text: hybridText,
    chars: hybridText.length,
    source: 'hybrid',
  };
}

async function extractPageTextByOcr(absoluteFilePath: string, pageNumber: number, ocrLang: string): Promise<string> {
  const tempFolder = await mkdtemp(join(tmpdir(), 'pdf-reader-'));
  const outputPrefix = join(tempFolder, `page-${pageNumber}`);
  const outputImagePath = `${outputPrefix}.png`;

  try {
    const renderResult = runCommand([
      'pdftoppm',
      '-f',
      String(pageNumber),
      '-l',
      String(pageNumber),
      '-singlefile',
      '-r',
      '220',
      '-png',
      absoluteFilePath,
      outputPrefix,
    ]);
    if (!renderResult.ok) {
      const renderErrorMessage = cleanText(renderResult.stderr || renderResult.stdout) || 'unknown pdftoppm error';
      throw new Error(`OCR render failed on page ${pageNumber}: ${renderErrorMessage}`);
    }

    const ocrResult = runCommand(['tesseract', outputImagePath, 'stdout', '-l', ocrLang, '--psm', '6']);
    if (!ocrResult.ok) {
      const ocrErrorMessage = cleanText(ocrResult.stderr || ocrResult.stdout) || 'unknown tesseract error';
      throw new Error(`OCR parse failed on page ${pageNumber}: ${ocrErrorMessage}`);
    }

    return cleanText(ocrResult.stdout);
  } finally {
    await rm(tempFolder, { recursive: true, force: true });
  }
}

function applyMaxChars(pages: ExtractedPage[], maxChars?: number): { pages: ExtractedPage[]; truncatedPages: number } {
  if (!maxChars) {
    return { pages, truncatedPages: 0 };
  }

  let truncatedPages = 0;
  const nextPages = pages.map(page => {
    if (page.text.length <= maxChars) {
      return page;
    }
    truncatedPages += 1;
    const truncatedText = page.text.slice(0, maxChars);
    return {
      ...page,
      text: truncatedText,
      chars: truncatedText.length,
    };
  });

  return { pages: nextPages, truncatedPages };
}

async function extractPageTextByProxyApi(pdf: Awaited<ReturnType<typeof getDocumentProxy>>, pageNumber: number): Promise<string> {
  const page = await pdf.getPage(pageNumber);
  const content = await page.getTextContent();

  let raw = '';
  for (const item of content.items) {
    if (!('str' in item)) {
      continue;
    }
    raw += item.str;
    raw += item.hasEOL ? '\n' : ' ';
  }

  return cleanText(raw);
}

function renderTextOutput(pages: ExtractedPage[], totalPages: number, truncatedPages: number, maxChars?: number): string {
  let output = '';
  for (const page of pages) {
    const sourceLabel = page.source === 'text' || page.source === 'empty' ? '' : ` [${page.source}]`;
    output += `\n\n--- Page ${page.page}/${totalPages}${sourceLabel} ---\n\n${page.text}`;
  }

  if (truncatedPages > 0 && maxChars) {
    output += `\n\n[truncated pages: ${truncatedPages}, max chars per page: ${maxChars}]`;
  }

  return output.length > 0 ? `${output}\n` : '';
}

type JsonPayload = {
  metadata: {
    file: string;
    totalPages: number;
    extractedPages: number[];
    title: string | null;
    author: string | null;
  };
  pages: Array<{
    page: number;
    text: string;
    chars: number;
    source: PageSource;
  }>;
  stats: {
    totalChars: number;
    estimatedTokens: number;
    truncated: boolean;
    ocrMode: OcrMode;
    ocrAppliedPages: number;
    ocrUnavailable: boolean;
  };
};

function resolveMetadataValue(metadataObj: unknown, key: string): string | null {
  if (!metadataObj || typeof metadataObj !== 'object') {
    return null;
  }

  const typedObj = metadataObj as { get?: (field: string) => unknown };
  if (typeof typedObj.get !== 'function') {
    return null;
  }

  const value = typedObj.get(key);
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function getErrorInfo(error: unknown, filePath: string): { message: string; exitCode: number; type: CliErrorType } {
  const name = typeof error === 'object' && error && 'name' in error ? String((error as { name?: unknown }).name) : '';
  const message =
    typeof error === 'object' && error && 'message' in error
      ? String((error as { message?: unknown }).message)
      : '未知錯誤';
  const lowerMessage = message.toLowerCase();

  if (name === 'UsageError') {
    return { message, exitCode: 2, type: 'usage' };
  }

  if (name === 'PasswordException' || lowerMessage.includes('password')) {
    return { message: 'Error: PDF is password-protected', exitCode: 1, type: 'password-protected' };
  }

  if (name === 'MissingPDFException') {
    return { message: `Error: File not found: ${filePath}`, exitCode: 2, type: 'file-not-found' };
  }

  if (name === 'InvalidPDFException') {
    if (lowerMessage.includes('truncated') || lowerMessage.includes('end of file')) {
      return { message: 'Error: PDF appears truncated', exitCode: 1, type: 'truncated-pdf' };
    }
    return { message: 'Error: Invalid or corrupted PDF', exitCode: 1, type: 'invalid-pdf' };
  }

  if (lowerMessage.includes('truncated')) {
    return { message: 'Error: PDF appears truncated', exitCode: 1, type: 'truncated-pdf' };
  }

  return { message: `執行失敗: ${message}`, exitCode: 1, type: 'unknown' };
}

function toExtractedPage(page: number, text: string): ExtractedPage {
  const normalized = cleanText(text);
  return {
    page,
    text: normalized,
    chars: normalized.length,
    source: normalized.length > 0 ? 'text' : 'empty',
  };
}

function resolveAbsolutePath(pathValue: string): string {
  if (pathValue.startsWith('/')) {
    return pathValue;
  }

  const baseCwd = process.cwd().replace(/\\/g, '/').replace(/\/$/, '');
  const normalizedPath = pathValue.replace(/\\/g, '/');
  return `${baseCwd}/${normalizedPath}`;
}

function getLargeFileWarning(fileSizeBytes: number, filePath: string): string | null {
  const largeFileThresholdBytes = 50 * 1024 * 1024;
  if (fileSizeBytes <= largeFileThresholdBytes) {
    return null;
  }

  const sizeMb = (fileSizeBytes / (1024 * 1024)).toFixed(1);
  return `Warning: Large PDF file (>50MB): ${filePath} (${sizeMb} MB)`;
}

async function run(): Promise<number> {
  let pdf: Awaited<ReturnType<typeof getDocumentProxy>> | null = null;

  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      printHelp();
      return 0;
    }

    const absoluteFilePath = resolveAbsolutePath(options.filePath);
    const file = Bun.file(options.filePath);
    if (!(await file.exists())) {
      const missingError = new Error(`File not found: ${absoluteFilePath}`) as Error & { name: string };
      missingError.name = 'MissingPDFException';
      throw missingError;
    }

    const largeFileWarning = getLargeFileWarning(file.size, absoluteFilePath);
    if (largeFileWarning) {
      process.stderr.write(`${largeFileWarning}\n`);
    }

    const data = new Uint8Array(await file.arrayBuffer());
    pdf = await getDocumentProxy(data);

    const [metaResult, fullTextResult] = await Promise.all([
      getMeta(pdf),
      options.pageSpec ? Promise.resolve(null) : extractText(pdf, { mergePages: false }),
    ]);

    const title =
      (typeof metaResult.info?.Title === 'string' && metaResult.info.Title.trim()) ||
      resolveMetadataValue(metaResult.metadata, 'dc:title');
    const author =
      (typeof metaResult.info?.Author === 'string' && metaResult.info.Author.trim()) ||
      resolveMetadataValue(metaResult.metadata, 'dc:creator');

    const totalPages = pdf.numPages;

    let pages: ExtractedPage[] = [];
    if (options.pageSpec) {
      const selectedPages = parsePageSpec(options.pageSpec);
      const outOfRange = selectedPages.filter(page => page > totalPages);
      if (outOfRange.length > 0) {
        throw new UsageError(`--pages 超出範圍，PDF 總頁數 ${totalPages}，錯誤頁碼: ${outOfRange.join(',')}`);
      }

      pages = await Promise.all(
        selectedPages.map(async page => ({
          ...toExtractedPage(page, await extractPageTextByProxyApi(pdf!, page)),
        })),
      );
    } else {
      pages = (fullTextResult?.text ?? []).map((text, index) => toExtractedPage(index + 1, text));
    }

    let ocrAppliedPages = 0;
    let ocrUnavailable = false;
    const candidatePages = pages.filter(page => shouldRunOcr(page, options));
    if (candidatePages.length > 0 && options.ocrMode !== 'off') {
      const ocrSupport = detectOcrSupport();
      if (!ocrSupport.available) {
        ocrUnavailable = true;
        process.stderr.write(`Warning: OCR disabled; missing command(s): ${ocrSupport.missing.join(', ')}\n`);
        process.stderr.write('Install poppler + tesseract to enable scanned/image PDF extraction.\n');
      } else {
        for (let i = 0; i < pages.length; i += 1) {
          const page = pages[i];
          if (!shouldRunOcr(page, options)) {
            continue;
          }

          try {
            const ocrText = await extractPageTextByOcr(absoluteFilePath, page.page, options.ocrLang);
            const mergedPage = mergePageText(page, ocrText, options.ocrMode);
            if ((mergedPage.source === 'ocr' || mergedPage.source === 'hybrid') && mergedPage.text !== page.text) {
              ocrAppliedPages += 1;
            }
            pages[i] = mergedPage;
          } catch (ocrError) {
            const message = ocrError instanceof Error ? ocrError.message : String(ocrError);
            process.stderr.write(`Warning: OCR failed on page ${page.page}: ${message}\n`);
          }
        }
      }
    }

    const truncated = applyMaxChars(pages, options.maxChars);
    const totalChars = truncated.pages.reduce((sum, page) => sum + page.chars, 0);
    const truncatedAnyPage = truncated.truncatedPages > 0;

    if (options.json) {
      const payload: JsonPayload = {
        metadata: {
          file: absoluteFilePath,
          totalPages,
          extractedPages: truncated.pages.map(page => page.page),
          title: typeof title === 'string' && title.length > 0 ? title : null,
          author: typeof author === 'string' && author.length > 0 ? author : null,
        },
        pages: truncated.pages,
        stats: {
          totalChars,
          estimatedTokens: Math.ceil(totalChars / 4),
          truncated: truncatedAnyPage,
          ocrMode: options.ocrMode,
          ocrAppliedPages,
          ocrUnavailable,
        },
      };
      process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
      return 0;
    }

    const textOutput = renderTextOutput(truncated.pages, totalPages, truncated.truncatedPages, options.maxChars);
    process.stdout.write(textOutput);
    return 0;
  } catch (error) {
    const errorInfo = getErrorInfo(error, resolveAbsolutePath(process.argv[2] ?? ''));
    process.stderr.write(`${errorInfo.message}\n`);

    if (errorInfo.type === 'usage') {
      process.stderr.write('\n');
      printHelp();
    }

    return errorInfo.exitCode;
  } finally {
    if (pdf) {
      await pdf.destroy();
    }
  }
}

const exitCode = await run();
process.exit(exitCode);
