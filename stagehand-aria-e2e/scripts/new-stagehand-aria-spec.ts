#!/usr/bin/env bun
const template = String.raw`import 'dotenv/config';
import { test, expect, type Locator } from '@playwright/test';
import { chromium, type CDPSession, type Page } from 'playwright-core';
import { Stagehand } from '@browserbasehq/stagehand';

const LAYOUT_STYLES = [
  'display',
  'position',
  'width',
  'height',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'gap',
  'row-gap',
  'column-gap',
  'flex-direction',
  'justify-content',
  'align-items',
  'grid-template-columns',
  'grid-template-rows',
  'font-size',
  'font-weight',
  'line-height',
  'text-align',
  'color',
  'background-color',
  'opacity',
  'z-index',
] as const;

type DomSnapshotPayload = {
  documents: Array<{
    documentURL?: number;
    title?: number;
    nodes: {
      parentIndex: number[];
      nodeName: number[];
      attributes?: number[][];
    };
    layout: {
      nodeIndex: number[];
      styles: number[][];
      bounds: number[][];
      text?: number[];
      paintOrders?: number[];
    };
  }>;
  strings: string[];
};

type ScopedLayoutSnapshot = {
  url: string | null;
  title: string | null;
  root: {
    nodeName: string;
    attributes: Record<string, string>;
  };
  nodes: Array<{
    nodeName: string;
    text: string | null;
    bounds: number[];
    paintOrder: number | null;
    attributes: Record<string, string>;
    styles: Record<string, string>;
  }>;
};

function readString(strings: string[], index: number | undefined): string | null {
  if (index === undefined || index < 0) {
    return null;
  }

  return strings[index] ?? null;
}

function extractAttributes(strings: string[], raw: number[] | undefined): Record<string, string> {
  if (!raw) {
    return {};
  }

  const attributes: Record<string, string> = {};
  for (let index = 0; index < raw.length; index += 2) {
    const name = readString(strings, raw[index]);
    const value = readString(strings, raw[index + 1]);
    if (name && value !== null) {
      attributes[name] = value;
    }
  }

  return attributes;
}

function collectSubtree(parentIndex: number[], rootIndex: number): Set<number> {
  const subtree = new Set<number>([rootIndex]);

  for (let nodeIndex = 0; nodeIndex < parentIndex.length; nodeIndex += 1) {
    let current = nodeIndex;
    while (current >= 0) {
      if (current === rootIndex) {
        subtree.add(nodeIndex);
        break;
      }
      current = parentIndex[current] ?? -1;
    }
  }

  return subtree;
}

function normalizeBounds(bounds: number[] | undefined): number[] {
  return (bounds ?? []).map((value) => Number(value.toFixed(1)));
}

async function withSnapshotRoot<T>(locator: Locator, run: (rootValue: string) => Promise<T>): Promise<T> {
  const rootValue = 'layout-' + crypto.randomUUID();

  await locator.evaluate((node, marker) => {
    node.setAttribute('data-layout-snapshot-root', marker);
  }, rootValue);

  try {
    return await run(rootValue);
  } finally {
    await locator.evaluate((node) => {
      node.removeAttribute('data-layout-snapshot-root');
    });
  }
}

async function captureLayoutSnapshot(page: Page, rootValue: string): Promise<ScopedLayoutSnapshot> {
  const session: CDPSession = await page.context().newCDPSession(page);

  try {
    const snapshot = (await session.send('DOMSnapshot.captureSnapshot', {
      computedStyles: [...LAYOUT_STYLES],
      includeDOMRects: true,
      includePaintOrder: true,
    })) as DomSnapshotPayload;

    for (const document of snapshot.documents) {
      const rootNodeIndex = document.nodes.nodeName.findIndex((_, nodeIndex) => {
        const attributes = extractAttributes(snapshot.strings, document.nodes.attributes?.[nodeIndex]);
        return attributes['data-layout-snapshot-root'] === rootValue;
      });

      if (rootNodeIndex === -1) {
        continue;
      }

      const subtree = collectSubtree(document.nodes.parentIndex, rootNodeIndex);
      const rootAttributes = extractAttributes(snapshot.strings, document.nodes.attributes?.[rootNodeIndex]);

      const nodes = document.layout.nodeIndex
        .map((nodeIndex, layoutIndex) => {
          if (!subtree.has(nodeIndex)) {
            return null;
          }

          const styleIndexes = document.layout.styles[layoutIndex] ?? [];
          const styles = Object.fromEntries(
            LAYOUT_STYLES.map((styleName, styleIndex) => [
              styleName,
              readString(snapshot.strings, styleIndexes[styleIndex]) ?? '',
            ]),
          );

          return {
            nodeName: readString(snapshot.strings, document.nodes.nodeName[nodeIndex]) ?? 'UNKNOWN',
            text: readString(snapshot.strings, document.layout.text?.[layoutIndex]),
            bounds: normalizeBounds(document.layout.bounds[layoutIndex]),
            paintOrder: document.layout.paintOrders?.[layoutIndex] ?? null,
            attributes: extractAttributes(snapshot.strings, document.nodes.attributes?.[nodeIndex]),
            styles,
          };
        })
        .filter((node): node is ScopedLayoutSnapshot['nodes'][number] => node !== null);

      return {
        url: readString(snapshot.strings, document.documentURL),
        title: readString(snapshot.strings, document.title),
        root: {
          nodeName: readString(snapshot.strings, document.nodes.nodeName[rootNodeIndex]) ?? 'UNKNOWN',
          attributes: rootAttributes,
        },
        nodes,
      };
    }

    throw new Error('Could not find tagged layout snapshot root in DOMSnapshot output.');
  } finally {
    await session.detach();
  }
}

test('stagehand semantic and layout behavior', async () => {
  const stagehand = new Stagehand({
    env: process.env.BROWSERBASE_API_KEY ? 'BROWSERBASE' : 'LOCAL',
    model: 'openai/gpt-5',
  });

  await stagehand.init();

  const browser = await chromium.connectOverCDP(stagehand.connectURL());
  const context = browser.contexts()[0];
  const page = context.pages()[0] ?? await context.newPage();

  try {
    await page.goto('https://example.com');
    await stagehand.act('open the sign in flow', { page });

    const main = page.getByRole('main');

    await expect(main).toMatchAriaSnapshot({
      name: 'main.aria.yml',
    });

    const layoutSnapshot = await withSnapshotRoot(main, (rootValue) =>
      captureLayoutSnapshot(page, rootValue),
    );

    await expect(JSON.stringify(layoutSnapshot, null, 2)).toMatchSnapshot('main.layout.json');
  } finally {
    await browser.close();
    await stagehand.close();
  }
});
`;

process.stdout.write(`${template}\n`);
