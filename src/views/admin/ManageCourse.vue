<template>
  <div class="course">
    <div class="course__add" style="display: flex;align-items: center;justify-content: space-between;margin: 25px 0">
      <el-select
          v-model="categoryIdSelected"
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
          @visible-change="handleVisibleChange"
          placeholder="Choose tags for your article"
          style="width: 240px"
      >
        <el-option
            v-for="item in listCategory"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        />
      </el-select>
      <el-button @click="handleShowCreateCourse">
        Add Multiple Course
      </el-button>
    </div>
    <div class="course__table">
      <DataTable
          ref="dataTable"
          :get-data-function="getListCourse"
      >
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="title" label="Tiêu đề" />
        <el-table-column prop="level" label="Cấp độ" />
        <el-table-column prop="publishStatus" label="Trạng thái">
          <template #default="scope">
            <el-tag :type="scope.row.publishStatus === 'PUBLISHER' ? 'success' : 'warning'">
              {{ scope.row.publishStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priceOriginal" label="Giá gốc">
          <template #default="scope">
            {{ scope.row.priceOriginal?.toLocaleString('vi-VN') }}đ
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="Giảm giá">
          <template #default="scope">
            {{ scope.row.discount }}%
          </template>
        </el-table-column>
        <el-table-column prop="priceDiscount" label="Giá sau giảm">
          <template #default="scope">
            {{ scope.row.priceDiscount?.toLocaleString('vi-VN') }}đ
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="Đánh giá" />
        <el-table-column prop="categoryId" label="Danh mục" />
        <el-table-column prop="thumbnail_url" label="Ảnh">
          <template #default="scope">
            <el-image
                v-if="scope.row.thumbnail_url"
                style="width: 50px; height: 50px"
                :src="scope.row.thumbnail_url"
                fit="cover"
            >
              <template #error>
                <div style="display:flex;align-items:center;justify-content:center;height:100%">
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column prop="accessDurationValue" label="Thời hạn">
          <template #default="scope">
            {{ scope.row.accessDurationValue }} {{ scope.row.expireUnit }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Ngày tạo" />
        <el-table-column prop="updatedAt" label="Ngày cập nhật" />
        <el-table-column label="Hành động" fixed="right" width="80">
          <template #default="scope">
            <el-button @click="updateCourse(scope.row)">
              <el-icon>
                <RefreshLeft />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </DataTable>
    </div>
  </div>
  <CreateDialog ref="createDialog"
                v-loading="loading"
                :title="'Tạo mới khóa học'"
                text-btn-ok="Lưu"
                :type-action="TypeAction.CREATE"
                @create="handleCreateCourse">
    <FormSaveCourse v-model="course" ref="formSaveCourse" />
  </CreateDialog>
</template>

<script setup lang="ts">
  import { nextTick, onMounted, reactive, ref, watch } from 'vue'
  import DataTable from '@/components/datatable/DataTable.vue'
  import CreateDialog from '@/components/dialog/common/CreateDialog.vue'
  import LevelStudent from '@/enums/LevelStudent.ts'
  import CourseApi from '@/api/CourseApi.ts'
  import { Picture, RefreshLeft } from '@element-plus/icons-vue'
  import useCourse from '@/composable/useCourse.ts'
  import useCategory from '@/composable/useCategory.ts'
  import { TypeAction } from '@/enums/TypeAction.ts'
  import FormSaveCourse from '@/components/form/FormSaveCourse.vue'
  import type { CourseReq } from '@/type/req/CourseReq.ts'
  import { useRoute } from 'vue-router'


  const dataTable = ref<InstanceType<typeof DataTable> | null>()
  const createDialog = ref()

  const loading = ref(false)
  const { listCourse, saveCourse } = useCourse()
  const { listCategory, getListCategory } = useCategory()
  const categoryIdSelected = ref<number>()
  const selectDropdown = ref<HTMLElement | null>(null)
  const formSaveCourse = ref()
  const route = useRoute()
  const isEdit = ref(false)

  const course = reactive<CourseReq>({
    id: null,
    title: '',
    desc: '',
    level: LevelStudent.BEGINNER,
    price: null,
    assetId: null,
    thumbnailFile: null,
    thumbnailPreviewUrl: null,
    categoryId: null,
    discount: null,
    rate: 5,
    publishStatus: null,
    accessDurationValue: null,
    accessDurationUnit: null
  })

  const updateCourse = (row: any) => {
    isEdit.value = true
    course.id = row.id
    course.desc = row.description
    course.price = row.priceOriginal
    course.title = row.title
    course.level = row.level
    course.categoryId = row.categoryId
    course.rate = row.rate
    course.discount = Number(row.discount)
    course.publishStatus = row.publishStatus ?? null
    course.accessDurationValue = row.accessDurationValue ?? null
    course.accessDurationUnit = row.expireUnit ?? null
    course.thumbnailPreviewUrl = row.thumbnail_url ?? null
    course.assetId = row.thumbnailAssetId ?? null
    course.thumbnailFile = null
    createDialog.value?.show()
  }

  function handleShowCreateCourse() {
    createDialog.value?.show()
  }

  const handleCreateCourse = async () => {

    const isValid = formSaveCourse.value?.validate()
    if (!isValid) {
      return
    }
    loading.value = true

    try {
      // Gửi JSON thay vì FormData — backend nhận assetId, không nhận file trực tiếp nữa
      await saveCourse({
        id: course.id ?? undefined,
        title: course.title,
        description: course.desc,
        level: course.level,
        price: course.price,
        categoryId: course.categoryId,
        rate: course.rate,
        discount: course.discount,
        assetId: course.assetId ?? undefined,
        publishStatus: course.publishStatus ?? undefined,
        accessDurationValue: course.accessDurationValue ?? undefined,
        accessDurationUnit: course.accessDurationUnit ?? undefined
      })
      formSaveCourse.value?.resetFields()
      createDialog.value?.hide()
      dataTable.value?.reload(dataTable.value?.request)
      resetData()
    } catch (e) {
      console.log(e)
    }

    loading.value = false
  }

  const getListCourse = async (pageRequest: any) => {
    return await CourseApi.getListCourses(pageRequest)
  }

  const handleScroll = async (e: Event) => {
    const ev = e.target as HTMLElement
    if (ev.scrollTop + ev.clientHeight >= ev.scrollHeight - 20) {
      await getListCategory()
    }
  }

  const handleVisibleChange = async (visible: boolean) => {
    if (visible) {
      await nextTick()
      // Tìm dropdown element
      const dropdown = document.querySelector('.el-select-dropdown__wrap')
      if (dropdown) {
        selectDropdown.value = dropdown as HTMLElement
        dropdown.addEventListener('scroll', handleScroll, { passive: true })
      }
    } else {
      // Remove listener khi đóng dropdown
      if (selectDropdown.value) {
        selectDropdown.value.removeEventListener('scroll', handleScroll)
      }
    }
  }

  const resetData = () => {
    course.id = null
    course.title = ''
    course.desc = ''
    course.level = LevelStudent.BEGINNER
    course.price = null
    course.assetId = null
    course.thumbnailFile = null
    course.thumbnailPreviewUrl = null
    course.categoryId = null
    course.discount = null
    course.rate = 5
    course.publishStatus = null
    course.accessDurationValue = null
    course.accessDurationUnit = null
  }

  watch(() => categoryIdSelected.value, (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      if (dataTable.value?.request) {
        dataTable.value.request.categoryId = newValue
        dataTable.value.reload(dataTable.value.request)
      }
    }
  })

  watch(() => route.query.keyword, (newKeyword) => {
    if (newKeyword !== undefined) {
      dataTable.value?.reload({
        page: 1,
        size: 10,
        keyword: newKeyword as string
      })
    }
  }, { immediate: true })

  onMounted(async () => {
    await getListCategory()
  })
</script>


<style scoped lang="scss">

</style>