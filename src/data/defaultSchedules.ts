import { ScheduleItem, SubjectConfig } from '../types';
import { getTodayStr, addDaysToStr } from '../utils/dateUtils';

export const DEFAULT_SUBJECTS: SubjectConfig[] = [
  {
    id: 'math',
    name: 'Mathematics & Calculus',
    color: '#2563eb',
    bgLight: 'bg-blue-50',
    textDark: 'text-blue-800',
    border: 'border-blue-200',
  },
  {
    id: 'cs',
    name: 'Computer Science & AI',
    color: '#0d9488',
    bgLight: 'bg-teal-50',
    textDark: 'text-teal-800',
    border: 'border-teal-200',
  },
  {
    id: 'physics',
    name: 'Physics & Mechanics',
    color: '#7c3aed',
    bgLight: 'bg-purple-50',
    textDark: 'text-purple-800',
    border: 'border-purple-200',
  },
  {
    id: 'lit',
    name: 'Literature & Philosophy',
    color: '#d97706',
    bgLight: 'bg-amber-50',
    textDark: 'text-amber-800',
    border: 'border-amber-200',
  },
  {
    id: 'history',
    name: 'World History & Civics',
    color: '#c05621',
    bgLight: 'bg-orange-50',
    textDark: 'text-orange-800',
    border: 'border-orange-200',
  },
  {
    id: 'chem',
    name: 'Organic Chemistry',
    color: '#059669',
    bgLight: 'bg-emerald-50',
    textDark: 'text-emerald-800',
    border: 'border-emerald-200',
  },
  {
    id: 'general',
    name: 'General Study & Review',
    color: '#4b5563',
    bgLight: 'bg-gray-100',
    textDark: 'text-gray-800',
    border: 'border-gray-200',
  },
];

export function getInitialSchedules(anchorDateStr: string = getTodayStr()): {
  schedules: Record<string, ScheduleItem[]>;
  letterNotes: Record<string, string>;
} {
  const yesterdayStr = addDaysToStr(anchorDateStr, -1);
  const todayStr = anchorDateStr;
  const tomorrowStr = addDaysToStr(anchorDateStr, 1);

  const schedules: Record<string, ScheduleItem[]> = {
    [yesterdayStr]: [
      {
        id: 'y-1',
        time: '08:30 AM - 10:00 AM',
        title: 'Linear Algebra Lecture: Matrix Transformations',
        subject: 'Mathematics & Calculus',
        type: 'lecture',
        room: 'Hall 302',
        instructor: 'Dr. Evelyn Vance',
        completed: true,
        priority: 'high',
        notes: 'Reviewed eigen-vectors and dot product properties.',
        durationMinutes: 90,
      },
      {
        id: 'y-2',
        time: '10:30 AM - 12:00 PM',
        title: 'Physics Lab: Simple Harmonic Motion',
        subject: 'Physics & Mechanics',
        type: 'lab',
        room: 'Lab B-14',
        instructor: 'Prof. Marcus Brody',
        completed: true,
        priority: 'medium',
        notes: 'Submitted pendulum motion dataset to online portal.',
        durationMinutes: 90,
      },
      {
        id: 'y-3',
        time: '02:00 PM - 04:00 PM',
        title: 'Algorithms & Complexity Study Session',
        subject: 'Computer Science & AI',
        type: 'study',
        room: 'Library Quiet Room 4',
        completed: true,
        priority: 'medium',
        notes: 'Solved 5 Dynamic Programming practice problems.',
        durationMinutes: 120,
      },
    ],
    [todayStr]: [
      {
        id: 't-1',
        time: '09:00 AM - 10:30 AM',
        title: 'Data Structures: Tree Traversal & Heaps',
        subject: 'Computer Science & AI',
        type: 'lecture',
        room: 'Auditorium A',
        instructor: 'Prof. Alan Turing',
        completed: true,
        priority: 'high',
        notes: 'Prepare notes for binary search tree balancing.',
        durationMinutes: 90,
      },
      {
        id: 't-2',
        time: '11:00 AM - 12:30 PM',
        title: 'Classical Physics: Thermodynamics Exam Prep',
        subject: 'Physics & Mechanics',
        type: 'exam',
        room: 'Science Wing 201',
        instructor: 'Dr. Evelyn Vance',
        completed: false,
        priority: 'high',
        notes: 'Focus on Carnot cycle efficiency formulas.',
        durationMinutes: 90,
      },
      {
        id: 't-3',
        time: '02:00 PM - 03:30 PM',
        title: 'Literature Seminar: Renaissance Poetry Analysis',
        subject: 'Literature & Philosophy',
        type: 'assignment',
        room: 'Humanities Hall 108',
        instructor: 'Prof. Clara Higgins',
        completed: false,
        priority: 'medium',
        notes: 'Bring annotated copy of Sonnet 18 essay draft.',
        durationMinutes: 90,
      },
      {
        id: 't-4',
        time: '04:00 PM - 05:30 PM',
        title: 'Library Study Group: Calculus Integration',
        subject: 'Mathematics & Calculus',
        type: 'study',
        room: 'Main Library Desk 12',
        completed: false,
        priority: 'low',
        notes: 'Review substitution method with study buddy.',
        durationMinutes: 90,
      },
    ],
    [tomorrowStr]: [
      {
        id: 'tm-1',
        time: '08:30 AM - 10:00 AM',
        title: 'World History: Modern Era Industrialization',
        subject: 'World History & Civics',
        type: 'lecture',
        room: 'History Room 204',
        instructor: 'Dr. Samuel Clemens',
        completed: false,
        priority: 'medium',
        notes: 'Read Chapters 8 & 9 before morning class.',
        durationMinutes: 90,
      },
      {
        id: 'tm-2',
        time: '10:30 AM - 12:30 PM',
        title: 'Organic Chemistry Reaction Mechanisms Lab',
        subject: 'Organic Chemistry',
        type: 'lab',
        room: 'Chemistry Lab C',
        instructor: 'Dr. Rosalind Franklin',
        completed: false,
        priority: 'high',
        notes: 'Wear lab coat and safety goggles!',
        durationMinutes: 120,
      },
      {
        id: 'tm-3',
        time: '03:00 PM - 05:00 PM',
        title: 'Term Project Research & Outline Writing',
        subject: 'General Study & Review',
        type: 'study',
        room: 'Home / Study Desk',
        completed: false,
        priority: 'high',
        notes: 'Finalize bibliography references in APA format.',
        durationMinutes: 120,
      },
    ],
  };

  const letterNotes: Record<string, string> = {
    [yesterdayStr]:
      "Dearest Scholar,\n\nYesterday was a solid day of academic progress. The physics lab yielded clean pendulum data, and the linear algebra concepts are clicking nicely. Remember that consistency beats intensity. Rest well!",
    [todayStr]:
      "Dear Scholar,\n\nWelcome to Present Day! Today is your key academic focus window. Stay disciplined through the thermodynamics exam prep and literature analysis. Check off completed items and use the empty slot below to capture late-afternoon study goals or revision tasks.\n\n'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.'",
    [tomorrowStr]:
      "Greetings Scholar,\n\nLooking ahead to tomorrow: prepare your Chemistry lab kit tonight and skim through History chapter 8. A smooth morning starts with an intentional schedule set in advance!",
  };

  return { schedules, letterNotes };
}
