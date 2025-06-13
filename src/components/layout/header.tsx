import React from 'react'
import { Menu, AlertTriangle } from 'lucide-react'
import { Button } from '../ui/button'
import { useProjectStore } from '../../store/project-store'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { currentProject } = useProjectStore()

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold text-gray-900 hidden sm:block">
            Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* User profile would go here */}
          <div className="text-sm text-gray-600">
            Welcome, Sarah
          </div>
        </div>
      </div>

      {/* Project Setup Warning Banner */}
      {currentProject && !currentProject.isSetup && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Project Setup Required
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Your project "{currentProject.name}" needs to be completed before you can start collecting stories.
              </p>
            </div>
            <Link to="/setup">
              <Button variant="outline" size="sm">
                Complete Setup
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  )
}