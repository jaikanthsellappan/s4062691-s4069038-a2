import React from "react";
import { Html, Head, Main, NextScript } from "next/document";

// This custom Document is used to define the overall HTML structure of the app.
// It wraps around all the pages and helps include shared meta or scripts globally.
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        {/* This is where the main app content will be injected */}
        <Main />
        {/* Next.js-specific scripts needed for client-side functionality */}
        <NextScript />
      </body>
    </Html>
  );
}
