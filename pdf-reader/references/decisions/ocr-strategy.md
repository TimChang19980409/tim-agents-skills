# OCR Strategy

## Decision

Choose whether auto OCR, forced OCR, or embedded-text-only extraction is the right strategy.

## Signals/constraints

- Scanned vs text PDF
- Need for full-page OCR coverage
- Language pack requirements and runtime cost

## Options

- Use auto OCR
- Use --ocr-all
- Use --no-ocr

## Recommendation rule

Default to auto OCR unless the PDF is clearly scanned or the user explicitly wants OCR disabled.

## Tradeoffs

- Forced OCR is more reliable on scans but slower.
- Auto OCR is cheaper but may miss edge pages.

## Verification

- State the chosen OCR mode and why the other modes fit less well.
