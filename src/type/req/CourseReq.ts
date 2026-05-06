import type  LevelStudent  from '@/enums/LevelStudent.ts'

export type PublishStatus = 'DRAFT' | 'PUBLISHER' | 'ARCHIVED'
export type ExpireUnit = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'HOURS' | 'MINUTE'

export interface CourseReq {
  id: number | null
  title: string
  desc: string
  level: LevelStudent
  price: number | null
  discount: number | null
  categoryId: number | null
  rate: number
  // Các field mới tương ứng BE
  publishStatus: PublishStatus | null
  accessDurationValue: number | null
  accessDurationUnit: ExpireUnit | null
  // Presigned upload
  assetId: string | null
  thumbnailFile: File | null
  thumbnailPreviewUrl: string | null
}