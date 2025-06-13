import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Mic, Play, Square, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { VoiceRecorder } from '../components/voice-recorder'
import { useParams } from 'react-router-dom'

// NOTE: This would come from API based on session ID
const mockSessionData = {
  id: 'session-1',
  projectId: 'project-1',
  subjectName: 'Margaret Johnson',
  prompts: [
    {
      id: 'prompt-1',
      text: 'What was your favorite family tradition growing up?',
      addedByName: 'Sarah Johnson',
      voiceRecording: '/audio/prompt-1.mp3'
    },
    {
      id: 'prompt-2', 
      text: 'Tell me about a time when you felt really proud of something you accomplished.',
      addedByName: 'Michael Johnson',
      voiceRecording: '/audio/prompt-2.mp3'
    }
  ]
}

const storyStyles = [
  { value: 'first-person', label: 'First Person', description: 'I went to the store...' },
  { value: 'third-person', label: 'Third Person', description: 'She went to the store...' },
  { value: 'transcript', label: 'Clean Transcript', description: 'Exactly as spoken, cleaned up' }
]

export function SessionsPage() {
  const { sessionId } = useParams()
  const [currentStep, setCurrentStep] = React.useState(0) // 0: prompts, 1: recording, 2: follow-up 1, 3: follow-up 2, 4: style, 5: review
  const [selectedPrompt, setSelectedPrompt] = React.useState<any>(null)
  const [currentPromptIndex, setCurrentPromptIndex] = React.useState(0)
  const [isRecording, setIsRecording] = React.useState(false)
  const [recordingDuration, setRecordingDuration] = React.useState(0)
  const [answers, setAnswers] = React.useState<any[]>([])
  const [selectedStyle, setSelectedStyle] = React.useState<string>('')
  const [generatedStory, setGeneratedStory] = React.useState('')

  // NOTE: Replace with actual recording implementation
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const handleAnswerPrompt = (prompt: any) => {
    setSelectedPrompt(prompt)
    setCurrentStep(1)
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingDuration(0)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    // NOTE: Process recording and move to next step
    setTimeout(() => {
      setCurrentStep(2) // Move to first follow-up
    }, 1000)
  }

  const handleSubmitAnswer = () => {
    // NOTE: Save answer and generate follow-up question
    const newAnswer = {
      promptId: selectedPrompt.id,
      recording: '/audio/dummy-answer.mp3',
      transcription: 'This is a dummy transcription of the user\'s answer.'
    }
    setAnswers([...answers, newAnswer])
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleStyleSelection = (style: string) => {
    setSelectedStyle(style)
    // NOTE: Generate story with selected style
    setGeneratedStory(`This is a generated story in ${style} style based on the user's recordings. The actual implementation would use AI to create a compelling narrative from the transcribed audio.`)
    setCurrentStep(5)
  }

  const handleFinishStory = () => {
    // NOTE: Save final story and redirect
    console.log('Finishing story with:', { selectedStyle, generatedStory })
  }

  const swipeToNextPrompt = () => {
    if (currentPromptIndex < mockSessionData.prompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1)
    }
  }

  const swipeToPrevPrompt = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(currentPromptIndex - 1)
    }
  }

  const currentPrompt = mockSessionData.prompts[currentPromptIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {/* Step 0: Prompt Selection */}
          {currentStep === 0 && (
            <motion.div
              key="prompts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Hi {mockSessionData.subjectName}! 👋
                </h1>
                <p className="text-gray-600">
                  Swipe through the prompts and choose one to answer.
                </p>
              </div>

              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary">
                    {currentPromptIndex + 1} of {mockSessionData.prompts.length}
                  </Badge>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">
                    "{currentPrompt.text}"
                  </CardTitle>
                  <CardDescription>
                    Asked by {currentPrompt.addedByName}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // NOTE: Play voice recording
                      console.log('Playing:', currentPrompt.voiceRecording)
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Listen to Prompt
                  </Button>

                  <Button
                    className="w-full"
                    onClick={() => handleAnswerPrompt(currentPrompt)}
                  >
                    Answer This Prompt
                  </Button>
                </CardContent>

                {/* Swipe Navigation */}
                <div className="flex items-center justify-between p-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={swipeToPrevPrompt}
                    disabled={currentPromptIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {mockSessionData.prompts.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentPromptIndex ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={swipeToNextPrompt}
                    disabled={currentPromptIndex === mockSessionData.prompts.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 1: Recording Answer */}
          {currentStep === 1 && (
            <motion.div
              key="recording"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Tell Your Story
                </h2>
                <p className="text-gray-600">
                  "{selectedPrompt?.text}"
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <VoiceRecorder
                    isRecording={isRecording}
                    onStartRecording={handleStartRecording}
                    onStopRecording={handleStopRecording}
                    duration={recordingDuration}
                  />
                </CardContent>
              </Card>

              {!isRecording && !isRecording && (
                <div className="flex justify-center">
                  <Button onClick={handleSubmitAnswer}>
                    Continue
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Steps 2-3: Follow-up Questions */}
          {(currentStep === 2 || currentStep === 3) && (
            <motion.div
              key={`followup-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Follow-up Question {currentStep - 1}
                </h2>
                <p className="text-gray-600">
                  "Can you tell me more about how that made you feel?"
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This question was generated based on your previous answer.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <VoiceRecorder
                    isRecording={isRecording}
                    onStartRecording={handleStartRecording}
                    onStopRecording={handleStopRecording}
                    duration={recordingDuration}
                  />
                </CardContent>
              </Card>

              {!isRecording && (
                <div className="flex justify-center">
                  <Button onClick={handleSubmitAnswer}>
                    Continue
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 4: Style Selection */}
          {currentStep === 4 && (
            <motion.div
              key="style"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Choose Your Story Style
                </h2>
                <p className="text-gray-600">
                  How would you like your story to be written?
                </p>
              </div>

              <div className="space-y-4">
                {storyStyles.map((style) => (
                  <motion.div
                    key={style.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-colors ${
                        selectedStyle === style.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleStyleSelection(style.value)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{style.label}</CardTitle>
                        <CardDescription>{style.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 5: Story Review */}
          {currentStep === 5 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Your Story
                </h2>
                <p className="text-gray-600">
                  Review your story and make any changes needed.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {generatedStory}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex-1">
                  <Mic className="h-4 w-4 mr-2" />
                  Make Changes
                </Button>
                <Button onClick={handleFinishStory} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Story Complete
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NOTE: Session functionality needs full implementation */}
        <div className="text-xs text-gray-400 text-center mt-8">
          Session recording, transcription, AI follow-up generation, and story creation need implementation
        </div>
      </div>
    </div>
  )
}