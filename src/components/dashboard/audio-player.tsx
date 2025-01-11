"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface AudioPlayerProps {
  bookFile: string
  title: string
}

export function AudioPlayer({ bookFile, title }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const handlePlay = async () => {
    try {
      if (audio && audioUrl) {
        audio.play()
        setIsPlaying(true)
        return
      }

      setIsLoading(true)
      
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfUrl: bookFile,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || "Failed to convert text to speech")
      }

      const { audioData } = await response.json()
      
      if (!audioData) {
        throw new Error("No audio data received")
      }

      console.log("Received audio data length:", audioData.length)
      
      // Convert base64 to blob
      const byteCharacters = atob(audioData)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: "audio/mp3" })
      
      // Create object URL
      const url = URL.createObjectURL(blob)
      console.log("Created audio URL:", url)
      
      // Create new audio element
      const newAudio = new Audio(url)
      
      // Add error handling for audio loading
      newAudio.onerror = (e) => {
        console.error("Audio loading error:", e)
        toast.error("Error loading audio file")
      }

      // Wait for audio to be loaded
      await new Promise((resolve, reject) => {
        newAudio.oncanplaythrough = resolve
        newAudio.onerror = reject
        newAudio.load()
      })

      setAudioUrl(url)
      setAudio(newAudio)
      
      newAudio.onended = () => {
        setIsPlaying(false)
      }

      await newAudio.play()
      setIsPlaying(true)

    } catch (error) {
      console.error("Error playing audio:", error)
      toast.error(error instanceof Error ? error.message : "Failed to play audio. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePause = () => {
    if (audio) {
      audio.pause()
      setIsPlaying(false)
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [audio, audioUrl])

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={isPlaying ? handlePause : handlePlay}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isPlaying ? (
        <Pause className="mr-2 h-4 w-4" />
      ) : (
        <Play className="mr-2 h-4 w-4" />
      )}
      {isPlaying ? "Pause Audio" : "Play Audio"}
    </Button>
  )
}
