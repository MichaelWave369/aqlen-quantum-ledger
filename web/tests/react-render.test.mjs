import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("AQLEN React console renders, not just builds", async () => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
  });
  try {
    const { default: App } = await vite.ssrLoadModule("/src/App.jsx");
    const html = renderToStaticMarkup(React.createElement(App));
    assert.match(html, /Trace the error/);
    assert.match(html, /Receipt graph|Follow the chain of evidence/);
    assert.match(html, /research and intelligence architecture/i, "global claim-boundary text must be visible");
    assert.match(html, /AQLEN/);
  } finally {
    await vite.close();
  }
});
