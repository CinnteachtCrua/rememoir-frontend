import React from 'react'
import { motion } from 'framer-motion'
import { Mic, Square, Play, Pause } from 'lucide-react'
import { Button } from './ui/button'

interface VoiceRecorderProps {
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  recordingUrl?: string
  onPlayback?: () => void
  isPlaying?: boolean
  duration?: number
}

export function VoiceRecorder({
  isRecording,
  onStartRecording,
  onStopRecording,
  recordingUrl,
  onPlayback,
  isPlaying = false,
  duration = 0
}: VoiceRecorderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg">
      {/* Recording Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={isRecording ? "destructive" : "default"}
          size="lg"
          className="w-16 h-16 rounded-full"
          onClick={isRecording ? onStopRecording : onStartRecording}
        >
          {isRecording ? (
            <Square className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
      </motion.div>

      {/* Recording Status */}
      <div className="text-center">
        {isRecording ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-red-600"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-red-600 rounded-full"
            />
            <span className="text-sm font-medium">Recording... {formatTime(duration)}</span>
          </motion.div>
        ) : recordingUrl ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Recording complete</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onPlayback}
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play'} Recording
            </Button>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Click to start recording</p>
        )}
      </div>

      {/* NOTE: Actual voice recording implementation needed */}
      <div className="text-xs text-gray-400 text-center">
        Voice recording functionality needs to be implemented with MediaRecorder API
      </div>
    </div>
  )
}