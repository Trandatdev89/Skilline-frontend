<template>
  <section class="h-100" style="margin: 120px 0">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col">
          <div class="card card-registration my-4">
            <div class="row" style="display: flex;align-items: stretch;gap: 30px;height: 600px">
              <div class="col-xl-6">
                <div class="card-body p-md-5 text-black">
                  <h3 class="mb-5 text-uppercase" style="text-align: center;">Đăng ký</h3>

                  <el-form ref="ruleFormRef" style="max-width: 600px" :model="data" status-icon :rules="rules"
                           label-position="top" label-width="auto" class="demo-ruleForm" v-loading="loading">
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="Username" prop="username">
                          <el-input v-model="data.username" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="Password" prop="password">
                          <el-input v-model="data.password" type="password" autocomplete="off" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="Fullname" prop="fullname">
                          <el-input v-model="data.fullname" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="Phone" prop="phone">
                          <el-input v-model="data.phone" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="Email" prop="email">
                          <el-input v-model="data.email" type="email" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="Address" prop="address">
                          <el-input v-model="data.address" />
                        </el-form-item>
                      </el-col>

                      <el-col :span="24">
                        <el-form-item>
                          <el-button style="width: 100%" type="primary" @click="submitForm(ruleFormRef)">
                            Submit
                          </el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>

                </div>
              </div>
              <div style="width: calc(100%/2 - 10px);height: auto">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp"
                     alt="Sample photo" class="img-fluid"
                     style="width: 100%;height: 100%;object-fit: cover;border-radius: 8px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { FormInstance } from 'element-plus'
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import AuthenticationApi from '@/api/AuthenticationApi.ts'
  import AlertService from '@/service/AlertService.ts'
  import { RoleType } from '@/enums/RoleType.ts'

  const ruleFormRef = ref<FormInstance>()
  const data = reactive<any>({
    username: '',
    password: '',
    fullname: '',
    phone: '',
    email: '',
    address: '',
    role:RoleType.USER
  });

  const router = useRouter()
  const loading = ref<boolean>(false)
  const rules = reactive<any>({
    username: [
      { required: true, message: 'Please input Username', trigger: 'blur' },
      { min: 3, max: 12, message: 'Length should be 3 to 5', trigger: 'blur' }
    ],
    password: [{ required: true, message: 'Please input Password', trigger: 'blur' }],
    phone: [
      { required: true, message: 'Please input phone', trigger: 'blur' },
      { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ', trigger: 'blur' }
    ],
    email: [
      { required: true, message: 'Please input email', trigger: 'blur' },
      { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
    ],
    address: [
      { required: true, message: 'Please input Address', trigger: 'blur' }
    ],
    fullname: [
      { required: true, message: 'Please input fullname', trigger: 'blur' }
    ]
  })

  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) {
      return
    }

    formEl.validate(async (valid) => {
      if (valid) {
        try {
          loading.value = true
          const result = await AuthenticationApi.register(data)
          console.log('Response:', result)

          if (result.code === 200) {
            AlertService.success('Thanh cong', 'Xac thuc tai khoan qua email!')
            router.push('/login')
          } else {
            AlertService.error('That bai', result.message)
          }
        } catch (error: any) {
          console.error('Register error:', error)
          const errorMessage = error?.response?.data?.message || error?.message || 'Vui long thu lai!'
          AlertService.error('That bai', errorMessage)
        } finally {
          loading.value = false
        }
      } else {
        AlertService.error('That bai', 'Validation that bai')
      }
    })
  }

</script>

<style lang="scss" scoped>
  .card-registration .select-input.form-control[readonly]:not([disabled]) {
    font-size: 1rem;
    line-height: 2.15;
    padding-left: .75em;
    padding-right: .75em;
  }

  .card-registration .select-arrow {
    top: 13px;
  }
</style>
