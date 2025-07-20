"use client";
import { useState } from "react";
import { Video, GalleryHorizontal } from "lucide-react";
import FaceRecorder from "@/components/FaceRecorder";
import VideoGallery from "@/components/VideoGallery";

export default function Home() {
  const [view, setView] = useState("recorder");
  const [refreshGallery, setRefreshGallery] = useState(false);

  const handleVideoSaved = () => {
    setRefreshGallery(prev => !prev);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">
        🎥 Face Tracker App
      </h1>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setView("recorder")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
            view === "recorder"
              ? "bg-purple-600 border-purple-400"
              : "border-gray-600"
          } hover:bg-purple-700 transition`}
        >
          <Video size={18} /> Recorder
        </button>

        <button
          onClick={() => setView("gallery")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
            view === "gallery"
              ? "bg-purple-600 border-purple-400"
              : "border-gray-600"
          } hover:bg-purple-700 transition`}
        >
          <GalleryHorizontal size={18} /> Video Gallery
        </button>
      </div>

      <div className="w-full max-w-4xl">
        {view === "recorder" ? (
          <FaceRecorder onVideoSaved={handleVideoSaved} />
        ) : (
          <VideoGallery refresh={refreshGallery} />
        )}
      </div>
    </main>
  );
}
