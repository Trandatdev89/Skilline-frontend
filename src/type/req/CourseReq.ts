import type  LevelStudent  from '@/enums/LevelStudent.ts'

export type PublishStatus = 'DRAFT' | 'PUBLISHER' | 'ARCHIVED'
export type ExpireUnit = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'HOURS' | 'MINUTE'

export interface CourseReq {
  id: number | null
  title: string
  desc: string
  level: string
  price: number | null

  thumbnail: File | null
  thumbnailPreviewUrl: string | null

  categoryId: number | null
  discount: number | null
  rate: number

  publishStatus: string | null
  accessDurationValue: number | null
  accessDurationUnit: string | null
}