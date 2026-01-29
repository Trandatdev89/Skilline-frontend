export interface RequestParam {
  page: number,
  size: number,
  keyword?: string,
  sort?: string | null,
  courseId?:number,
  lectureId?:string,
  categoryId?:number | null,
  search?:string|null
}