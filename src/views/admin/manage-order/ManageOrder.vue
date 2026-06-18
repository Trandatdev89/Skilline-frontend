<template>
  <div class="order">
    <div class="order__table">
      <DataTable
          ref="dataTable"
          :get-data-function="getDataOrder"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="fullname" label="Người tạo đơn" />
        <el-table-column prop="username" label="Tài khoản" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="phone" label="Số điện thoại" />
        <el-table-column prop="address" label="Địa chỉ" />
        <el-table-column prop="totalPrice" label="Tổng tiền">
          <template #default="scope">
            {{ scope.row.totalPrice?.toLocaleString('vi-VN') }}đ
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Trạng thái thanh toán">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'PAID' ? 'success' : scope.row.status === 'PENDING' ? 'warning' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Ngày tạo đơn" />
        <el-table-column label="Hành động" fixed="right" width="120">
          <template #default="scope">
            <el-tooltip
                v-for="menu in MenuActionOrder"
                :key="menu.key"
                class="box-item"
                effect="dark"
                :content="menu.tooltip"
                placement="top">
              <el-button @click="handleShowDialog(scope.row, menu.type)">
                <component :is="menu.icon" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </DataTable>
    </div>
  </div>

  <CreateDialog ref="createDialog"
                :title="'Xem thong tin'"
                text-btn-ok="Lưu"
                :type-action="TypeAction.READ">
    <Component :is="componentDetail"/>
  </CreateDialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import DataTable from '@/components/datatable/DataTable.vue'
  import orderApi from '@/api/OrderApi.ts'
  import { MenuActionOrder } from '@/common/MenuActionOrder.ts'
  import { TypeAction } from '@/enums/TypeAction.ts'
  import CreateDialog from '@/components/dialog/common/CreateDialog.vue'
  import ManageCourse from '@/views/admin/manage-course/ManageCourse.vue'

  const dataTable = ref()
  const componentDetail = ref();
  const createDialog = ref<InstanceType<typeof CreateDialog> | null>(null)

  const handleShowDialog = (row: any,type:string) => {
    switch (type){
      case "detailOrder":
        componentDetail.value = ManageCourse;
        break;
      case "paymentOrder":
        componentDetail.value = null;
        break;
    }
    createDialog.value?.show()
  }

  const getDataOrder = async (pageRequest: any) => {
    return await orderApi.getOrders(pageRequest)
  }


</script>


<style scoped lang="scss">

</style>