import type { ApiResponse } from '@/type/ApiResponse.ts'
import { httpApi } from '@/utils/httpApi.ts'

export type AssetType = 'IMAGE' | 'VIDEO'

export interface InitUploadRequest {
  assetType: AssetType
  originalFileName: string
  mimeType: string
  sizeBytes: number
}

export interface InitUploadResponse {
  assetId: string
  objectKey: string
  uploadUrl: string
}

export interface MediaAssetResponse {
  assetId: string
  assetType: AssetType
  publicUrl: string | null
  mimeType: string
  sizeBytes: number
  uploadStatus: string
  processStatus: string
  durationSeconds: number | null
}

class MediaApi {
  /**
   * Bước 1: Lấy presigned URL từ server
   */
  async initUpload(request: InitUploadRequest): Promise<ApiResponse<InitUploadResponse>> {
    return await httpApi.post('/api/media/upload/init', request)
  }

  /**
   * Bước 2: Upload file thẳng lên S3 bằng presigned URL.
   * Dùng XMLHttpRequest để có progress callback.
   * KHÔNG set Content-Type header — S3 presigned URL đã ký sẵn content-type,
   * nếu set thêm sẽ làm chữ ký không khớp → lỗi CORS/403.
   */
  uploadToS3(uploadUrl: string, file: File, onProgress?: (percent: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open('PUT', uploadUrl)

      // S3 presigned URL đã bao gồm content-type trong chữ ký
      // Không được set thêm bất kỳ header nào khác
      xhr.setRequestHeader('Content-Type', file.type)

      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded * 100) / event.total)
            onProgress(percent)
          }
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
        } else {
          reject(new Error(`S3 upload thất bại: HTTP ${xhr.status}`))
        }
      }

      xhr.onerror = () => reject(new Error('Lỗi kết nối khi upload lên S3'))
      xhr.ontimeout = () => reject(new Error('Upload timeout'))

      xhr.send(file)
    })
  }

  /**
   * Bước 3: Xác nhận đã upload xong để server bắt đầu xử lý (transcode HLS, ...)
   */
  async confirmUpload(assetId: string): Promise<ApiResponse<MediaAssetResponse>> {
    return await httpApi.post('/api/media/upload/confirm', { assetId })
  }

  /**
   * Lấy thông tin asset (dùng để poll trạng thái xử lý video)
   */
  async getAsset(assetId: string): Promise<ApiResponse<MediaAssetResponse>> {
    return await httpApi.get(`/api/media/${assetId}`)
  }

  /**
   * Helper: Upload hoàn chỉnh 3 bước, trả về assetId
   */
  async uploadFile(
    file: File,
    assetType: AssetType,
    onProgress?: (percent: number) => void
  ): Promise<string> {
    // Bước 1: Lấy presigned URL
    const initRes = await this.initUpload({
      assetType,
      originalFileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size
    })

    if (initRes.code !== 200 || !initRes.data) {
      throw new Error(initRes.message || 'Không thể khởi tạo upload')
    }

    const { assetId, uploadUrl } = initRes.data

    // Bước 2: Upload file lên S3
    await this.uploadToS3(uploadUrl, file, onProgress)

    // Bước 3: Confirm upload
    const confirmRes = await this.confirmUpload(assetId)
    if (confirmRes.code !== 200) {
      throw new Error(confirmRes.message || 'Không thể xác nhận upload')
    }

    return assetId
  }
}

export default new MediaApi();