import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./Components/sidebar";
import ReduxProvider from "./ReduxProvider";
import Providers from "./QueryClientProvider";
import LayoutWrapper from "./LayoutWrapper";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ReduxProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ReduxProvider>
        </Providers>
      </body>
    </html>
  );
}
