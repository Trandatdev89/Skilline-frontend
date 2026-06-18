import LevelStudent from '@/enums/LevelStudent.ts'
import type { ExpireUnit, PublishStatus } from '@/type/req/CourseReq.ts'

export interface CourseRes {
  id: number,
  title: string,
  level: LevelStudent,
  thumbnail_url: string,
  description: string,
  delete: boolean
  publishStatus: PublishStatus,
  expireUnit: ExpireUnit,
  accessDurationValue: number,
  createdAt: string,
  updatedAt: string,
  rate:number,
  priceOriginal:number,
  discount:number,
  priceDiscount:number,
  categoryId: number,

}