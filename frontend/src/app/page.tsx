"use client";

import LoginPage from "./login/page";

export default function Home() {
  return (
    <main className="min-h-screen bg-black overflow-hidden">
      {/* Forced Root Render to break Vercel Redirect Loops v4.0.0 */}
      <LoginPage />
    </main>
  );
}
