import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, User, Gift, Calendar, Clock, MapPin, Phone, GraduationCap, Briefcase, Heart, Users, Target } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import type { SetupFormData } from '../types'

const setupSchema = z.object({
  projectType: z.enum(['personal', 'gifted']),
  subjectName: z.string().min(1, 'Name is required'),
  age: z.number().min(1).max(150).optional(),
  phoneNumber: z.string().optional(),
  currentAddress: z.string().optional(),
  birthPlace: z.string().optional(),
  education: z.string().optional(),
  career: z.string().optional(),
  familyInformation: z.string().optional(),
  majorLifeEvents: z.string().optional(),
  valuesAndBeliefs: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  startDate: z.string().min(1, 'Start date is required'),
  time: z.string().min(1, 'Time is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  recipientEmail: z.string().email().optional(),
}).refine((data) => {
  if (data.projectType === 'gifted' && !data.recipientEmail) {
    return false
  }
  return true
}, {
  message: "Recipient email is required for gifted memoirs",
  path: ["recipientEmail"],
})

const steps = [
  { id: 'type', title: 'Memoir Type', description: 'Who is this memoir for?' },
  { id: 'profile', title: 'Profile', description: 'Tell us about yourself' },
  { id: 'scheduling', title: 'Scheduling', description: 'Set up story scheduling' },
  { id: 'review', title: 'Review', description: 'Review & complete project setup' }
]

const frequencies = [
  { 
    value: 'weekly', 
    label: 'Weekly', 
    description: 'Perfect for consistent progress',
    icon: Calendar
  },
  { 
    value: 'monthly', 
    label: 'Monthly', 
    description: 'Gentle, comfortable pace',
    icon: Calendar
  },
  { 
    value: 'daily', 
    label: 'Daily', 
    description: 'For the enthusiastic storyteller',
    icon: Calendar
  }
]

const timezones = [
  'America/New_York',
  'America/Chicago', 
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo'
]

export function ProjectSetupPage() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const navigate = useNavigate()
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      timezone: 'America/Chicago'
    }
  })

  const watchedValues = watch()

  const onSubmit = (data: SetupFormData) => {
    // NOTE: Implement API call to save project setup
    console.log('Project setup data:', data)
    navigate('/stories')
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return watchedValues.projectType
      case 1:
        return watchedValues.subjectName
      case 2:
        return watchedValues.frequency && watchedValues.time && watchedValues.timezone && watchedValues.startDate
      default:
        return true
    }
  }

  const getStepProgress = () => ((currentStep + 1) / steps.length) * 100

  const isPersonal = watchedValues.projectType === 'personal'
  const isGifted = watchedValues.projectType === 'gifted'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {/* Modal Container with proper sizing and margins */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-xl border-0 overflow-hidden">
          {/* Header */}
          <CardHeader className="bg-white">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Set Up Your Project</CardTitle>
              <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getStepProgress()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 1: Project Type */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">Who is this memoir for?</h2>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                        Choose whether you'll be sharing your own stories or creating a memoir for someone special.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <label className="cursor-pointer">
                          <input
                            type="radio"
                            value="personal"
                            {...register('projectType')}
                            className="sr-only"
                          />
                          <div className={`p-6 border-2 rounded-lg text-center transition-all duration-200 ${
                            isPersonal
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}>
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Memoir</h3>
                            <p className="text-sm text-gray-600">
                              I want to record and preserve my own life stories and experiences.
                            </p>
                          </div>
                        </label>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <label className="cursor-pointer">
                          <input
                            type="radio"
                            value="gifted"
                            {...register('projectType')}
                            className="sr-only"
                          />
                          <div className={`p-6 border-2 rounded-lg text-center transition-all duration-200 ${
                            isGifted
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}>
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                              <Gift className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gifted Memoir</h3>
                            <p className="text-sm text-gray-600">
                              I want to create a memoir for someone special - a parent, grandparent, or loved one.
                            </p>
                          </div>
                        </label>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* Step 2: Profile Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        {isPersonal ? 'Tell us about yourself' : 'Tell us about them'}
                      </h2>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                        This information helps us create more personalized and meaningful story prompts.
                      </p>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-4">
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="subjectName">Full Name</Label>
                          <Input
                            id="subjectName"
                            {...register('subjectName')}
                            placeholder={isPersonal ? "Your full name" : "Their full name"}
                          />
                          {errors.subjectName && (
                            <p className="text-sm text-red-600">{errors.subjectName.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            {...register('age', { valueAsNumber: true })}
                            placeholder="Age"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            {...register('phoneNumber')}
                            placeholder="Phone number for story prompts"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentAddress">Current Address</Label>
                          <Input
                            id="currentAddress"
                            {...register('currentAddress')}
                            placeholder="City, State"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthPlace">
                          Where did {isPersonal ? 'you' : 'they'} grow up?
                        </Label>
                        <Input
                          id="birthPlace"
                          {...register('birthPlace')}
                          placeholder="Birth place or childhood home"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="education">Education</Label>
                          <Input
                            id="education"
                            {...register('education')}
                            placeholder="Schools attended, degrees"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="career">Occupation/Career</Label>
                          <Input
                            id="career"
                            {...register('career')}
                            placeholder="Primary occupation or career"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="familyInformation">Family Information</Label>
                        <Textarea
                          id="familyInformation"
                          {...register('familyInformation')}
                          rows={3}
                          placeholder="Spouse, children, parents, siblings..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="majorLifeEvents">Important Life Events</Label>
                        <Textarea
                          id="majorLifeEvents"
                          {...register('majorLifeEvents')}
                          rows={3}
                          placeholder="Significant milestones, achievements, challenges..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="valuesAndBeliefs">Values & Beliefs</Label>
                        <Textarea
                          id="valuesAndBeliefs"
                          {...register('valuesAndBeliefs')}
                          rows={3}
                          placeholder="What matters most? Core values, beliefs, life philosophy..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Scheduling */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">Set Up Story Scheduling</h2>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                        Choose how often you would like to receive story prompts.
                      </p>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-6">
                      {/* Frequency Selection */}
                      <div className="space-y-4">
                        <Label className="text-base font-medium">How often should we send story prompts?</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {frequencies.map((freq) => {
                            const isSelected = watchedValues.frequency === freq.value
                            return (
                              <motion.div
                                key={freq.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <label className="cursor-pointer">
                                  <input
                                    type="radio"
                                    value={freq.value}
                                    {...register('frequency')}
                                    className="sr-only"
                                  />
                                  <div className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                  }`}>
                                    <h3 className="font-semibold text-gray-900 mb-1">{freq.label}</h3>
                                    <p className="text-sm text-gray-600">{freq.description}</p>
                                  </div>
                                </label>
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Date and Time */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            {...register('startDate')}
                            min={new Date().toISOString().split('T')[0]}
                            placeholder="dd/mm/yyyy"
                          />
                          {errors.startDate && (
                            <p className="text-sm text-red-600">{errors.startDate.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="time">Preferred Time</Label>
                          <Input
                            id="time"
                            type="time"
                            {...register('time')}
                            placeholder="--:--"
                          />
                          {errors.time && (
                            <p className="text-sm text-red-600">{errors.time.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Recipient Email for Gifted Memoirs */}
                      {isGifted && (
                        <div className="space-y-2">
                          <Label htmlFor="recipientEmail">Recipient Email</Label>
                          <Input
                            id="recipientEmail"
                            type="email"
                            {...register('recipientEmail')}
                            placeholder="Where should prompts be sent?"
                          />
                          {errors.recipientEmail && (
                            <p className="text-sm text-red-600">{errors.recipientEmail.message}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Complete */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">Review & Complete Project Setup</h2>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                        Everything looks good! Ready to start creating beautiful memoir stories?
                      </p>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-4">
                      {/* Memoir Type */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Memoir Type</h3>
                        <p className="text-gray-700">
                          {isPersonal ? 'Personal Memoir' : 'Gifted Memoir'}
                        </p>
                      </div>

                      {/* Memoir Writer */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Memoir Writer</h3>
                        <div className="text-gray-700">
                          <p className="font-medium">{watchedValues.subjectName}</p>
                          {watchedValues.age && <p>• Age: {watchedValues.age}</p>}
                          {watchedValues.currentAddress && <p>• Current Address: {watchedValues.currentAddress}</p>}
                          {watchedValues.career && <p>• Career: {watchedValues.career}</p>}
                        </div>
                      </div>

                      {/* Schedule */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Schedule</h3>
                        <p className="text-gray-700">
                          {frequencies.find(f => f.value === watchedValues.frequency)?.label} prompts starting {watchedValues.startDate} at {watchedValues.time}
                        </p>
                        {watchedValues.recipientEmail && (
                          <p className="text-gray-600 mt-1">
                            Sent to: {watchedValues.recipientEmail}
                          </p>
                        )}
                      </div>

                      {/* What happens next */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-3">What happens next?</h4>
                        <ul className="space-y-1 text-sm text-blue-800">
                          <li>• Your memoir project will be created</li>
                          <li>• {isPersonal ? 'You' : 'They'} will receive the first story prompt via SMS</li>
                          <li>• Family members can collaborate by adding prompts</li>
                          <li>• Stories will be saved in your digital gallery</li>
                          <li>• Order a beautiful printed book when ready</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {currentStep === steps.length - 1 ? (
                  <Button type="submit" className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Complete Setup
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}