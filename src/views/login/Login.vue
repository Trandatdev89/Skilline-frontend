<template>
  <div class="login">
    <div class="login__wrap">
      <div class="login__title">Login</div>
      <div class="login__form">
        <el-form
            ref="ruleFormRef"
            style="max-width: 600px"
            :model="dataForm"
            status-icon
            :rules="ruleForm"
            label-position="top"
            label-width="auto"
            class="demo-ruleForm"
            v-loading="loading"
        >
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Username" prop="username">
                <el-input v-model="dataForm.username" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Password" prop="password">
                <el-input v-model="dataForm.password" type="password" autocomplete="off" />
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
  </div>
</template>

<script setup lang="ts">

  import { onBeforeMount, onMounted, reactive, ref } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import AuthenticationApi from '@/api/AuthenticationApi.ts'
  import useAuthentication from '@/stores/Authentication.ts'
  import AlertService from '@/service/AlertService.ts'
  import useRedirect from '@/composable/useRedirect.ts'
  import FingerprintJS from '@fingerprintjs/fingerprintjs'

  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<FormRules>({
    username: [
      { required: true, message: 'username is require', trigger: 'blur' }
    ],
    password: [
      { required: true, message: 'password is require', trigger: 'blur' }
    ]
  })
  const loading = ref<boolean>(false)
  const authentication = useAuthentication()
  const redirect = useRedirect()
  const fpPromise = FingerprintJS.load()
  const dataForm = reactive({
    username: '',
    password: '',
    deviceFingerprint: ''
  })

  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) {
      return
    }

    formEl.validate(async (isValid) => {
      if (isValid) {
        try {
          loading.value = true

          const fp = await fpPromise
          const result = await fp.get()
          dataForm.deviceFingerprint = result.visitorId
          const res = await AuthenticationApi.login(dataForm)

          if (res.code === 200) {
            authentication.setAuthToken(res.data)
            redirectAfterLogin()
            localStorage.setItem('deviceFingerprint', dataForm.deviceFingerprint)
            AlertService.success('Login Success!', res.message)
          } else {
            AlertService.error('Login Fail!', res.message)
          }
        } catch (error: any) {
          console.error('Login error:', error)
          const errorMessage = error?.response?.data?.message || error?.message || 'Please try again!'
          AlertService.error('Login Fail!', errorMessage)
        } finally {
          loading.value = false
        }
      }
    })
  }

  const redirectAfterLogin = () => {
    redirect.handleRedirect()
  }

  onMounted(async () => {
    const res = await authentication.isAuthentication()
    if (res) {
      redirectAfterLogin()
    }

  })

  onBeforeMount(async () => {
    await AuthenticationApi.getCsrfToken()
  })

</script>

<style scoped lang="scss">
  .login {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 600px;
    margin: 50px auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;

    &__title {
      text-align: center;
      margin: 20px 0;
      font-size: 20px;
      font-weight: 600;
    }

    &__warp {
      display: flex;
      align-items: center;
      flex-direction: column;
    }
  }

  .login-with-google-btn {
    transition: background-color 0.3s,
    box-shadow 0.3s;

    padding: 12px 16px 12px 42px;
    border: none;
    border-radius: 3px;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04),
    0 1px 1px rgba(0, 0, 0, 0.25);

    color: #757575;
    font-size: 14px;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans',
    'Droid Sans', 'Helvetica Neue', sans-serif;

    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
    background-color: white;
    background-repeat: no-repeat;
    background-position: 12px 11px;
  }
</style>
