import type { ExpireUnit } from '@/type/req/CourseReq.ts'

export interface QuizReq {
  id: number | null
  lectureId: string | null
  title: string
  desc: string
  maxAttempt: number | null
  timeLimit: number | null
  timeUnit: ExpireUnit | null
}