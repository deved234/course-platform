import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import NetworkBackground from "@/components/NetworkBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Learning Hub - Online Courses",
  description: "Learn from expert instructors, track progress, and grow your skills",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="flex min-h-screen flex-col bg-gradient-to-br from-zinc-50 via-white to-zinc-50 text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 dark:text-zinc-50">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          <CustomCursor />
          <BackgroundAnimation />
          <NetworkBackground />
          {children}
        </main>
        <footer className="mt-16 border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
            <p>© 2026 Learning Hub. Empowering learners worldwide. 🚀 all credit to Eng.david atef</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
