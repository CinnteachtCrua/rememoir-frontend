import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Play, Edit, Trash2, User, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { usePrompts, useAiSuggestedPrompts } from '../hooks/use-prompts'
import { useProjectStore } from '../store/project-store'
import { VoiceRecorder } from '../components/voice-recorder'

export function PromptsPage() {
  const { currentProject } = useProjectStore()
  const { data: prompts, isLoading: promptsLoading } = usePrompts(currentProject?.id || '')
  const { data: aiPrompts, isLoading: aiPromptsLoading } = useAiSuggestedPrompts(currentProject?.id || '')
  
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [isRecording, setIsRecording] = React.useState(false)
  const [recordingDuration, setRecordingDuration] = React.useState(0)
  const [recordingUrl, setRecordingUrl] = React.useState<string>()
  const [newPrompt, setNewPrompt] = React.useState('')

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

  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingDuration(0)
    // NOTE: Implement actual recording start
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setRecordingUrl('/audio/dummy-recording.mp3') // NOTE: Replace with actual recording URL
    // NOTE: Implement actual recording stop
  }

  const handleAddPrompt = () => {
    // NOTE: Implement API call to add prompt
    console.log('Adding prompt:', newPrompt, 'with recording:', recordingUrl)
    setIsAddModalOpen(false)
    setNewPrompt('')
    setRecordingUrl(undefined)
    setRecordingDuration(0)
  }

  const handleAddAiPrompt = (promptText: string) => {
    // NOTE: Implement API call to convert AI prompt to user prompt
    console.log('Adding AI prompt:', promptText)
  }

  if (promptsLoading || aiPromptsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Prompts</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Prompts</h1>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Prompt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Prompt</DialogTitle>
              <DialogDescription>
                Create a new prompt for your subject to answer, including a voice recording.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter your prompt here..."
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Voice Recording</Label>
                <VoiceRecorder
                  isRecording={isRecording}
                  onStartRecording={handleStartRecording}
                  onStopRecording={handleStopRecording}
                  recordingUrl={recordingUrl}
                  duration={recordingDuration}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPrompt} disabled={!newPrompt.trim() || !recordingUrl}>
                Add Prompt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Added Prompts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Added Prompts</h2>
          <Badge variant="secondary">
            {prompts?.length || 0} prompts
          </Badge>
        </div>

        {!prompts || prompts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No prompts yet</h3>
                <p className="text-gray-500 max-w-md">
                  Start by adding some prompts for your subject to answer. Each prompt should include a voice recording.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {prompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardDescription className="text-base text-gray-900 font-medium">
                          "{prompt.text}"
                        </CardDescription>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          Added by {prompt.addedByName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {prompt.voiceRecording && (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Play
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* AI Suggested Prompts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">AI Suggested Prompts</h2>
            <Sparkles className="h-5 w-5 text-purple-500" />
          </div>
          <Badge variant="secondary">
            {aiPrompts?.length || 0} suggestions
          </Badge>
        </div>

        {!aiPrompts || aiPrompts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="text-center space-y-2">
                <Sparkles className="h-8 w-8 text-purple-400 mx-auto" />
                <p className="text-gray-500">
                  AI will suggest personalized prompts based on your project details.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {aiPrompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow border-purple-200 bg-purple-50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardDescription className="text-base text-gray-900 font-medium">
                          "{prompt.text}"
                        </CardDescription>
                        <div className="flex items-center gap-1 text-sm text-purple-600">
                          <Sparkles className="h-4 w-4" />
                          AI Suggested
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Modify
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                        <Button size="sm" onClick={() => handleAddAiPrompt(prompt.text)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* NOTE: Edit and delete functionality needs to be implemented */}
      <div className="text-xs text-gray-400 text-center mt-8">
        Prompt editing, deletion, and voice recording playback need to be implemented
      </div>
    </div>
  )
}