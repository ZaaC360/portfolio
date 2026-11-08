import "lenis/dist/lenis.css";
import "./globals.css";

export const metadata = { title: "Portfolio" };

export default function RootLayout({ children }) {
  return (
    // is-loading: scroll stays locked while the loader (page.js) is up; Animations.js removes it
    <html lang="en" className="is-loading" suppressHydrationWarning>
      <head>
        {/* the title face is on the first screen (loader + hero): fetch it before CSS asks */}
        <link rel="preload" href="/font/NewTitle-Variable.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
