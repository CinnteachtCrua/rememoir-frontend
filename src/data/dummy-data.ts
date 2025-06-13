import type { User, Project, Story, Prompt, Collaborator } from '../types'

// NOTE: This is dummy data - replace with real API calls
export const currentUser: User = {
  id: 'user-1',
  email: 'sarah@example.com',
  name: 'Sarah Johnson',
  createdAt: new Date('2024-01-15')
}

export const projects: Project[] = [
  {
    id: 'project-1',
    name: "Mom's Life Story",
    ownerId: 'user-1',
    subject: {
      name: 'Margaret Johnson',
      birthPlace: 'Chicago, Illinois',
      education: 'Northwestern University - English Literature',
      career: 'High School English Teacher (35 years)',
      majorLifeEvents: ['Marriage to Robert (1965)', 'Birth of three children', 'Published poetry collection', 'Retirement celebration'],
      relationship: 'family'
    },
    scheduling: {
      frequency: 'weekly',
      dayOfWeek: 2, // Tuesday
      time: '14:00',
      timezone: 'America/Chicago',
      recipientEmail: 'margaret.johnson@email.com',
      startDate: new Date('2024-02-01')
    },
    isSetup: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'project-2',
    name: "Grandpa's War Stories",
    ownerId: 'user-1',
    subject: {
      name: 'William Thompson',
      birthPlace: 'Portland, Oregon',
      relationship: 'family'
    },
    scheduling: {
      frequency: 'biweekly',
      dayOfWeek: 5,
      time: '10:00',
      timezone: 'America/Los_Angeles',
      recipientEmail: 'bill.thompson@email.com',
      startDate: new Date('2024-03-01')
    },
    isSetup: false,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  }
]

export const stories: Story[] = [
  {
    id: 'story-1',
    projectId: 'project-1',
    title: 'The Day I Met Your Father',
    content: `It was a crisp autumn day in 1964 when I first laid eyes on Robert. I was working at the campus library, trying to balance my studies with a part-time job. He walked in looking completely lost, holding a crumpled piece of paper with what I later learned was a completely wrong call number for a book he needed for his engineering project.

"Excuse me," he said, his voice barely above a whisper, "I think I'm in the wrong section... or maybe the wrong building entirely." His sheepish smile and the way he ran his hand through his hair made my heart skip a beat. I couldn't help but laugh at his predicament.

I offered to help him find the book, and what should have been a five-minute interaction turned into an hour-long conversation about everything from literature to his dreams of building bridges. When he finally asked if I'd like to get coffee sometime, I said yes before he even finished the question.

That coffee date turned into dinner, which turned into long walks around campus, which eventually turned into fifty-eight years of marriage. Sometimes I wonder if he deliberately wrote down the wrong call number that day, but he swears it was an honest mistake. Either way, I'm grateful for that moment of confusion that brought us together.`,
    originalRecording: '/audio/story-1-recording.mp3', // NOTE: Replace with actual audio URL
    promptedBy: 'Sarah Johnson',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-29'),
    includeInBook: true,
    order: 1,
    style: 'first-person'
  },
  {
    id: 'story-2',
    projectId: 'project-1',
    title: 'Teaching Through the Decades',
    content: `When I started teaching in 1968, the world was changing rapidly, and the classroom was no exception. I remember walking into Roosevelt High School for the first time, carrying a worn leather satchel filled with lesson plans and hope. The students were challenging, but in the best possible way – they questioned everything, wanted to understand not just what they were reading, but why it mattered.

Over the years, I watched education evolve. We went from chalkboards to whiteboards to smart boards. Students went from passing handwritten notes to texting under their desks. But one thing never changed: that magical moment when a student's face lights up because they finally understand a concept, or when they discover a book that speaks to their soul.

I taught thousands of students over thirty-five years, and I like to think I learned as much from them as they did from me. They taught me about resilience, creativity, and the importance of adapting to change. Some of my former students are now teachers themselves, and nothing makes me prouder than knowing I played a small part in shaping the next generation of educators.`,
    originalRecording: '/audio/story-2-recording.mp3', // NOTE: Replace with actual audio URL
    promptedBy: 'Michael Johnson',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    includeInBook: true,
    order: 2,
    style: 'first-person'
  }
]

export const prompts: Prompt[] = [
  {
    id: 'prompt-1',
    projectId: 'project-1',
    text: 'What was your favorite family tradition growing up?',
    addedBy: 'user-1',
    addedByName: 'Sarah Johnson',
    voiceRecording: '/audio/prompt-1.mp3', // NOTE: Replace with actual audio URL
    isAiSuggested: false,
    isUsed: false,
    createdAt: new Date('2024-02-01')
  },
  {
    id: 'prompt-2',
    projectId: 'project-1',
    text: 'Tell me about a time when you felt really proud of something you accomplished.',
    addedBy: 'collab-1',
    addedByName: 'Michael Johnson',
    voiceRecording: '/audio/prompt-2.mp3', // NOTE: Replace with actual audio URL
    isAiSuggested: false,
    isUsed: false,
    createdAt: new Date('2024-02-03')
  }
]

export const aiSuggestedPrompts: Prompt[] = [
  {
    id: 'ai-prompt-1',
    projectId: 'project-1',
    text: 'What was the most challenging period of your teaching career and how did you overcome it?',
    addedBy: 'ai',
    addedByName: 'AI Assistant',
    isAiSuggested: true,
    isUsed: false,
    createdAt: new Date('2024-02-10')
  },
  {
    id: 'ai-prompt-2',
    projectId: 'project-1',
    text: 'Describe a student who made a lasting impact on your life.',
    addedBy: 'ai',
    addedByName: 'AI Assistant',
    isAiSuggested: true,
    isUsed: false,
    createdAt: new Date('2024-02-10')
  }
]

export const collaborators: Collaborator[] = [
  {
    id: 'collab-1',
    projectId: 'project-1',
    userId: 'user-2',
    email: 'michael.johnson@email.com',
    name: 'Michael Johnson',
    status: 'active',
    invitedAt: new Date('2024-01-22'),
    joinedAt: new Date('2024-01-23')
  },
  {
    id: 'collab-2',
    projectId: 'project-1',
    userId: 'user-3',
    email: 'lisa.johnson@email.com',
    name: 'Lisa Johnson',
    status: 'pending',
    invitedAt: new Date('2024-02-01')
  }
]