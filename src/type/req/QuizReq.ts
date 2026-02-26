export interface QuizReq {
  id: string | null,
  lectureId?: string | null,
  title: string | null
  desc: string | null
  timeLimit?: any,
  maxAttempt: number | null
}