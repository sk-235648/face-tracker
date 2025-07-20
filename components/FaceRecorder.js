"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { motion } from "framer-motion";

export default function FaceRecorder({ onVideoSaved }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const [recording, setRecording] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    async function loadModels() {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      setIsModelLoaded(true);
    }

    loadModels();
  }, []);

  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
  
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
          };
        }
  
        // 👇 Setup offscreen canvas for merged video + overlay
        const video = document.createElement("video");
        video.srcObject = stream;
        video.muted = true;
        await video.play();
  
        const offscreenCanvas = document.createElement("canvas");
        const ctx = offscreenCanvas.getContext("2d");
  
        const drawToOffscreen = () => {
          if (!video.videoWidth || !video.videoHeight) {
            requestAnimationFrame(drawToOffscreen);
            return;
          }
  
          offscreenCanvas.width = video.videoWidth;
          offscreenCanvas.height = video.videoHeight;
  
          ctx.drawImage(video, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
  
          if (canvasRef.current) {
            ctx.drawImage(canvasRef.current, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
          }
  
          requestAnimationFrame(drawToOffscreen);
        };
        drawToOffscreen();
  
        // 👇 Use offscreen canvas stream for recording
        const mergedStream = offscreenCanvas.captureStream(30); // 30 FPS
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length) {
          mergedStream.addTrack(audioTracks[0]);
        }
  
        const recorder = new MediaRecorder(mergedStream);
        mediaRecorderRef.current = recorder;
  
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunksRef.current.push(e.data);
        };
  
        recorder.onstop = () => {
          console.log("Recording stopped. Saving...");
          saveRecording();
        };
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
  
    initCamera();
  }, []);
  

  useEffect(() => {
    let animationFrame;

    const detectFaces = async () => {
      if (!videoRef.current || !canvasRef.current || !isModelLoaded) return;

      const video = videoRef.current;
      if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
        animationFrame = requestAnimationFrame(detectFaces);
        return;
      }

      try {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };

        canvas.width = displaySize.width;
        canvas.height = displaySize.height;

        faceapi.matchDimensions(canvas, displaySize);

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );

          resizedDetections.forEach((detection) => {
            const box = detection.detection.box;
            ctx.strokeStyle = "#00ff00";
            ctx.lineWidth = 2;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            const drawPath = (points, closePath = false) => {
              ctx.beginPath();
              ctx.moveTo(points[0].x, points[0].y);
              for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
              }
              if (closePath) ctx.closePath();
              ctx.stroke();
            };
            
            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 1;
            
            const points = detection.landmarks.positions;
            
            // Draw each facial feature
            drawPath(points.slice(0, 17)); // Jaw
            drawPath(points.slice(17, 22)); // Right eyebrow
            drawPath(points.slice(22, 27)); // Left eyebrow
            drawPath(points.slice(27, 31)); // Nose bridge
            drawPath(points.slice(31, 36)); // Nose bottom
            drawPath(points.slice(36, 42), true); // Right eye
            drawPath(points.slice(42, 48), true); // Left eye
            drawPath(points.slice(48, 60), true); // Outer lip
            drawPath(points.slice(60, 68), true); // Inner lip
            
          });
        }
      } catch (err) {
        console.error("Face detection error:", err);
      }

      animationFrame = requestAnimationFrame(detectFaces);
    };

    detectFaces();
    return () => cancelAnimationFrame(animationFrame);
  }, [isModelLoaded]);

  const startRecording = () => {
    if (mediaRecorderRef.current) {
      recordedChunksRef.current = [];
      mediaRecorderRef.current.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const saveRecording = () => {
    const chunks = recordedChunksRef.current;
    if (chunks.length === 0) {
      console.warn("No video data to save.");
      return;
    }

    const blob = new Blob(chunks, { type: "video/webm" });
    const request = indexedDB.open("videoDB", 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      db.createObjectStore("videos", { autoIncrement: true });
    };

    request.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction("videos", "readwrite");
      const store = tx.objectStore("videos");
      store.add(blob);

      tx.oncomplete = () => {
        console.log("Video saved.");
        if (onVideoSaved) onVideoSaved();
      };
    };

    request.onerror = (e) => {
      console.error("Failed to save video:", e.target.error);
    };
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.video
        ref={videoRef}
        className="w-full max-w-xl rounded"
        autoPlay
        playsInline
        muted
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      />

      <motion.canvas
        ref={canvasRef}
        className="absolute w-full max-w-xl h-auto pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      />

      <motion.div
        className="flex gap-4 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {!recording ? (
          <motion.button
            onClick={startRecording}
            className="bg-green-600 px-4 py-2 rounded text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Recording
          </motion.button>
        ) : (
          <motion.button
            onClick={stopRecording}
            className="bg-red-600 px-4 py-2 rounded text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Stop Recording
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
