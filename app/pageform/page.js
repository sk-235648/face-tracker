"use client";

import Script from "next/script";

export default function PaperformDemo() {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.Paperform?.popup) {
      window.Paperform.popup("great-minds-ai-bootcamp-2025");
    } else {
      console.warn("Paperform popup function is not available yet.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-6">Paperform Popup Demo</h1>
      <p className="mb-4">Click the button below to open your Paperform form.</p>

      <button
        onClick={handleClick}
        className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 text-lg"
      >
        Open Form
      </button>

      <Script
        src="https://paperform.co/__embed.min.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
