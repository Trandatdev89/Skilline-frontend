import LevelStudent from '@/enums/LevelStudent.ts'

export interface CourseReq {
  id: number | null
  title: string
  level: LevelStudent
  desc: string
  price: number | null
  discount: number | null
  categoryId: number | null
  rate: number
  // Presigned upload: lưu assetId trả về từ server sau khi upload ảnh lên S3
  assetId: string | null
  // Chỉ dùng để preview UI, không gửi lên server
  thumbnailFile: File | null
  // URL preview khi edit (ảnh hiện tại từ server)
  thumbnailPreviewUrl: string | null
}