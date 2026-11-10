import "lenis/dist/lenis.css";
import "./globals.css";
import CursorDot from "./CursorDot";

export const metadata = { title: "Portfolio" };

export default function RootLayout({ children }) {
  return (
    // is-loading: scroll stays locked while the loader (page.js) is up; Animations.js removes it
    <html lang="en" className="is-loading" suppressHydrationWarning>
      <head>
        {/* the title face is on the first screen (loader + hero): fetch it before CSS asks */}
        <link rel="preload" href="/font/NewTitle-Variable.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        {/* the home intro plays once per tab: hide its loader before first paint on later visits */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("intro-seen")==="1")document.documentElement.classList.add("intro-seen")}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
        <CursorDot />
      </body>
    </html>
  );
}
