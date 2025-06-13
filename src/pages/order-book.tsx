import React from 'react'
import { motion } from 'framer-motion'
import { Book, Check, X, GripVertical, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { useStories } from '../hooks/use-stories'
import { useProjectStore } from '../store/project-store'
import { formatDate } from '../lib/utils'

export function OrderBookPage() {
  const { currentProject } = useProjectStore()
  const { data: stories, isLoading } = useStories(currentProject?.id || '')
  const [storyOrder, setStoryOrder] = React.useState<string[]>([])

  React.useEffect(() => {
    if (stories) {
      setStoryOrder(stories.sort((a, b) => a.order - b.order).map(s => s.id))
    }
  }, [stories])

  const includedStories = stories?.filter(s => s.includeInBook) || []
  const excludedStories = stories?.filter(s => !s.includeInBook) || []

  const handleToggleStoryInclusion = (storyId: string) => {
    // NOTE: Implement API call to toggle story inclusion
    console.log('Toggling story inclusion:', storyId)
  }

  const handleReorderStories = (dragIndex: number, hoverIndex: number) => {
    // NOTE: Implement drag and drop reordering
    console.log('Reordering stories:', dragIndex, hoverIndex)
  }

  const handleOrderBook = () => {
    // NOTE: Implement book ordering flow
    console.log('Ordering book with stories:', includedStories.map(s => s.id))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Book</h1>
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

  if (!stories || stories.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Book</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Book className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No stories to include</h3>
              <p className="text-gray-500 max-w-md">
                You need at least one completed story before you can order a book.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order Book</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {includedStories.length} stories included
          </div>
          <Button onClick={handleOrderBook} disabled={includedStories.length === 0}>
            <Package className="h-4 w-4 mr-2" />
            Order Book
          </Button>
        </div>
      </div>

      {/* Book Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Book Preview
            </CardTitle>
            <p className="text-sm text-gray-600">
              Your book will include {includedStories.length} stories in the order shown below
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-600">{includedStories.length}</p>
                <p className="text-sm text-gray-600">Stories</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600">
                  ~{Math.ceil(includedStories.length * 2.5)}
                </p>
                <p className="text-sm text-gray-600">Pages</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-purple-600">Hardcover</p>
                <p className="text-sm text-gray-600">Binding</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-orange-600">Free</p>
                <p className="text-sm text-gray-600">First Book</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Included Stories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Stories in Book</span>
              <Badge variant="success">{includedStories.length} included</Badge>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Drag to reorder stories. The first story will appear first in the book.
            </p>
          </CardHeader>
          <CardContent>
            {includedStories.length === 0 ? (
              <div className="text-center py-8">
                <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No stories included in book yet</p>
                <p className="text-sm text-gray-400">
                  Click "Include in Book" on stories below to add them
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {includedStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="cursor-move">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-700">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{story.title}</h4>
                      <p className="text-sm text-gray-600">
                        Created {formatDate(story.createdAt)} • By {story.promptedBy}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStoryInclusion(story.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Excluded Stories */}
      {excludedStories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Excluded Stories</span>
                <Badge variant="secondary">{excludedStories.length} excluded</Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">
                These stories won't be included in your book, but you can add them anytime.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {excludedStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{story.title}</h4>
                      <p className="text-sm text-gray-600">
                        Created {formatDate(story.createdAt)} • By {story.promptedBy}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStoryInclusion(story.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Include
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* NOTE: Book ordering and story reordering functionality needs implementation */}
      <div className="text-xs text-gray-400 text-center">
        Book ordering flow, drag-and-drop reordering, and payment integration need to be implemented
      </div>
    </div>
  )
}