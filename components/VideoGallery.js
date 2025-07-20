"use client"

import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"

export default function VideoGallery({ refresh }) {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    loadVideos()
  }, [refresh]) // reload when refresh prop changes

  const loadVideos = () => {
    const request = indexedDB.open("videoDB", 1)
    request.onsuccess = e => {
      const db = e.target.result
      const tx = db.transaction("videos", "readonly")
      const store = tx.objectStore("videos")
      const getAll = store.getAll()

      getAll.onsuccess = () => {
        const urls = getAll.result.map(blob => URL.createObjectURL(blob))
        setVideos(urls)
      }
    }
  }

  const deleteVideo = index => {
    const request = indexedDB.open("videoDB", 1)
    request.onsuccess = e => {
      const db = e.target.result
      const tx = db.transaction("videos", "readwrite")
      const store = tx.objectStore("videos")

      let i = 0
      store.openCursor().onsuccess = e => {
        const cursor = e.target.result
        if (cursor) {
          if (i === index) {
            cursor.delete()
            loadVideos()
            return
          }
          i++
          cursor.continue()
        }
      }
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {videos.map((url, i) => (
        <div key={i} className="relative group">
          <video
            controls
            src={url}
            className="rounded-lg shadow-md w-full aspect-video object-cover border border-gray-300"
          />
          <button
            onClick={() => deleteVideo(i)}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      ))}
    </div>
  )
}
