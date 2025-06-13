import React from 'react'
import { motion } from 'framer-motion'
import { Play, Edit, Calendar, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { useStories } from '../hooks/use-stories'
import { useProjectStore } from '../store/project-store'
import { formatDate } from '../lib/utils'

export function StoriesPage() {
  const { currentProject } = useProjectStore()
  const { data: stories, isLoading } = useStories(currentProject?.id || '')

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Stories</h1>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Stories</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No stories yet</h3>
              <p className="text-gray-500 max-w-md">
                Stories will appear here once your subject starts answering prompts. 
                Make sure your project is set up and prompts are ready to go!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Stories</h1>
        <div className="text-sm text-gray-600">
          {stories.length} {stories.length === 1 ? 'story' : 'stories'}
        </div>
      </div>

      <div className="grid gap-6">
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{story.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Prompted by {story.promptedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(story.createdAt)}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant={story.includeInBook ? "success" : "secondary"}>
                    {story.includeInBook ? "In Book" : "Excluded"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed line-clamp-4">
                    {story.content}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Play Recording
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Story
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Style: {story.style.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* NOTE: Story editing modal would be implemented here */}
      <div className="text-xs text-gray-400 text-center mt-8">
        Story editing functionality and audio playback need to be implemented
      </div>
    </div>
  )
}