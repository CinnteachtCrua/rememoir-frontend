import React from 'react'
import { motion } from 'framer-motion'
import { User, Clock, Users, Plus, Trash2, Mail, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { useProjectStore } from '../store/project-store'
import { collaborators } from '../data/dummy-data'
import { cn } from '../lib/utils'

const timezones = [
  'America/New_York',
  'America/Chicago', 
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo'
]

const frequencies = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' }
]

const daysOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]

const settingsSections = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    description: 'Subject information'
  },
  {
    id: 'scheduling',
    label: 'Scheduling',
    icon: Calendar,
    description: 'Prompt timing'
  },
  {
    id: 'collaborators',
    label: 'Collaborators',
    icon: Users,
    description: 'Team members'
  }
]

export function SettingsPage() {
  const { currentProject } = useProjectStore()
  const [activeSection, setActiveSection] = React.useState('profile')
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false)
  const [inviteEmail, setInviteEmail] = React.useState('')
  const [profileData, setProfileData] = React.useState(currentProject?.subject || {})
  const [schedulingData, setSchedulingData] = React.useState(currentProject?.scheduling || {})

  // NOTE: Replace with actual API calls
  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData)
  }

  const handleSaveScheduling = () => {
    console.log('Saving scheduling:', schedulingData)
  }

  const handleInviteCollaborator = () => {
    console.log('Inviting collaborator:', inviteEmail)
    setIsInviteModalOpen(false)
    setInviteEmail('')
  }

  const handleRemoveCollaborator = (collaboratorId: string) => {
    console.log('Removing collaborator:', collaboratorId)
  }

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please select a project to view settings.</p>
      </div>
    )
  }

  const renderProfileSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <p className="text-sm text-gray-600">
            Information about the person this memoir is for
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Subject Name</Label>
              <Input
                id="name"
                value={profileData.name || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthPlace">Birth Place</Label>
              <Input
                id="birthPlace"
                value={profileData.birthPlace || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, birthPlace: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              value={profileData.education || ''}
              onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="career">Career</Label>
            <Input
              id="career"
              value={profileData.career || ''}
              onChange={(e) => setProfileData(prev => ({ ...prev, career: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="majorEvents">Major Life Events</Label>
            <Textarea
              id="majorEvents"
              rows={4}
              value={profileData.majorLifeEvents?.join('\n') || ''}
              onChange={(e) => setProfileData(prev => ({ 
                ...prev, 
                majorLifeEvents: e.target.value.split('\n').filter(event => event.trim()) 
              }))}
              placeholder="Enter each major life event on a new line"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveProfile}>
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderSchedulingSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scheduling
          </CardTitle>
          <p className="text-sm text-gray-600">
            When and how often prompts are sent to your subject
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={schedulingData.frequency}
                onValueChange={(value) => setSchedulingData(prev => ({ ...prev, frequency: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">Day of Week</Label>
              <Select
                value={schedulingData.dayOfWeek?.toString()}
                onValueChange={(value) => setSchedulingData(prev => ({ ...prev, dayOfWeek: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              <Input
                id="time"
                type="time"
                value={schedulingData.time || ''}
                onChange={(e) => setSchedulingData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={schedulingData.timezone}
                onValueChange={(value) => setSchedulingData(prev => ({ ...prev, timezone: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientEmail">Recipient Email</Label>
            <Input
              id="recipientEmail"
              type="email"
              value={schedulingData.recipientEmail || ''}
              onChange={(e) => setSchedulingData(prev => ({ ...prev, recipientEmail: e.target.value }))}
              placeholder="Subject's email address"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveScheduling}>
              Save Scheduling
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderCollaboratorsSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Collaborators
              </CardTitle>
              <p className="text-sm text-gray-600">
                People who can add prompts and view stories
              </p>
            </div>
            <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Collaborator</DialogTitle>
                  <DialogDescription>
                    Invite someone to collaborate on this memoir project.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="inviteEmail">Email Address</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInviteCollaborator} disabled={!inviteEmail.trim()}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invite
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collaborators.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No collaborators yet</p>
                <p className="text-sm text-gray-400">
                  Invite family and friends to help create this memoir
                </p>
              </div>
            ) : (
              collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{collaborator.name}</p>
                      <p className="text-sm text-gray-600">{collaborator.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={collaborator.status === 'active' ? 'success' : 'warning'}>
                      {collaborator.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection()
      case 'scheduling':
        return renderSchedulingSection()
      case 'collaborators':
        return renderCollaboratorsSection()
      default:
        return renderProfileSection()
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your project settings and preferences
        </p>
      </div>

      {/* Top Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {settingsSections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.label}</span>
                <span className="sm:hidden">{section.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      {renderActiveSection()}

      {/* NOTE: API integration needed */}
      <div className="text-xs text-gray-400 text-center">
        Settings save functionality and collaborator management need API integration
      </div>
    </div>
  )
}