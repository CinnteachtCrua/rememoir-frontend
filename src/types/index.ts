export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface Project {
  id: string
  name: string
  ownerId: string
  subject: Subject
  scheduling: Scheduling
  isSetup: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Subject {
  name: string
  age?: number
  phoneNumber?: string
  currentAddress?: string
  birthPlace?: string
  education?: string
  career?: string
  familyInformation?: string
  majorLifeEvents?: string[]
  valuesAndBeliefs?: string
  relationship: 'self' | 'family' | 'friend' | 'other'
}

export interface Scheduling {
  frequency: 'daily' | 'weekly' | 'monthly'
  dayOfWeek?: number // 0-6 (Sunday-Saturday) - only for weekly
  time: string // HH:MM format
  timezone: string
  recipientEmail: string
  startDate: Date
}

export interface Story {
  id: string
  projectId: string
  title: string
  content: string
  originalRecording: string // URL to audio file
  promptedBy: string
  createdAt: Date
  updatedAt: Date
  includeInBook: boolean
  order: number
  style: 'first-person' | 'third-person' | 'transcript'
}

export interface Prompt {
  id: string
  projectId: string
  text: string
  addedBy: string
  addedByName: string
  voiceRecording?: string // URL to audio file
  isAiSuggested: boolean
  isUsed: boolean
  createdAt: Date
}

export interface Collaborator {
  id: string
  projectId: string
  userId: string
  email: string
  name: string
  status: 'pending' | 'active'
  invitedAt: Date
  joinedAt?: Date
}

export interface SessionData {
  id: string
  projectId: string
  prompts: Prompt[]
  currentStep: number
  answers: SessionAnswer[]
}

export interface SessionAnswer {
  promptId: string
  recording: string
  transcription: string
  followUpQuestions: string[]
  followUpAnswers: string[]
}

// New types for enhanced setup form
export interface SetupFormData {
  projectType: 'personal' | 'gifted'
  subjectName: string
  age?: number
  phoneNumber?: string
  currentAddress?: string
  birthPlace?: string
  education?: string
  career?: string
  familyInformation?: string
  majorLifeEvents?: string
  valuesAndBeliefs?: string
  frequency: 'daily' | 'weekly' | 'monthly'
  startDate: string
  time: string
  timezone: string
  recipientEmail?: string // Only for gifted memoirs
}