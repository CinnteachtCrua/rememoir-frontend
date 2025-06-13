import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  MessageSquare, 
  Settings, 
  ShoppingCart, 
  ChevronDown,
  Plus,
  Menu,
  X
} from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { useProjectStore } from '../../store/project-store'
import { useProjects } from '../../hooks/use-projects'

const navigation = [
  { name: 'Stories', href: '/stories', icon: BookOpen },
  { name: 'Prompts', href: '/prompts', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Order Book', href: '/order', icon: ShoppingCart },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation()
  const { currentProject, setCurrentProject } = useProjectStore()
  const { data: projects, isLoading } = useProjects()
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = React.useState(false)

  React.useEffect(() => {
    if (projects && projects.length > 0 && !currentProject) {
      setCurrentProject(projects[0])
    }
  }, [projects, currentProject, setCurrentProject])

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  }

  const overlayVariants = {
    open: { opacity: 1, display: 'block' },
    closed: { opacity: 0, transitionEnd: { display: 'none' } }
  }

  return (
    <>
      {/* Mobile overlay */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={overlayVariants}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onToggle}
      />

      {/* Sidebar */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 shadow-lg",
          "lg:relative lg:translate-x-0 lg:shadow-none"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Rememoir</h1>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onToggle}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Project Selector */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Button
                variant="outline"
                className="w-full justify-between text-left"
                onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                disabled={isLoading}
              >
                <span className="truncate">
                  {isLoading ? 'Loading...' : currentProject?.name || 'Select Project'}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>

              {isProjectDropdownOpen && projects && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10"
                >
                  <div className="py-1">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                        onClick={() => {
                          setCurrentProject(project)
                          setIsProjectDropdownOpen(false)
                        }}
                      >
                        <span className="font-medium">{project.name}</span>
                        {!project.isSetup && (
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </button>
                    ))}
                    <div className="border-t border-gray-200 mt-1 pt-1">
                      <button
                        className="w-full px-3 py-2 text-left text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                        onClick={() => {
                          // NOTE: Implement create new project flow
                          console.log('Create new project')
                          setIsProjectDropdownOpen(false)
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Create New Project
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => {
                    // Close mobile sidebar when navigating
                    if (window.innerWidth < 1024) {
                      onToggle()
                    }
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>Current Project:</p>
              <p className="font-medium text-gray-900 truncate">
                {currentProject?.name || 'No project selected'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}