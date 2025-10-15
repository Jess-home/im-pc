<template>
  <div class="login-page">
    <img
      src="/static/theme/default/logo.png"
      class="page-logo"
    />
    <div class="page-form">
      <el-input
        v-model="form.username"
        class="page-form_input"
        placeholder="请输入用户名"
      ></el-input>
      <el-input
        v-model="form.password"
        class="page-form_input"
        type="password"
        placeholder="请输入密码"
      ></el-input>
      <div
        class="page-form_btn"
        :loading="loading"
        @click="handleLogin"
      >立即登录</div>
      <div
        class="page-form_tip"
        @click="fetchLogin(false)"
      >
        <span>游客登录</span>
      </div>
    </div>
    <div
      class="page-footer"
      @click="goReg"
    >还没有账号？点此注册</div>
  </div>
</template>

<script>
import { login } from '@/api'
export default {
  data () {
    return {
      loading: false,
      form: {
        username: '',
        password: '',
        client_id: ''
      }
    }
  },
  computed: {
    checkIn () {
      return this.form.password != '' && this.form.username != '' && this.form.password.length > 5;
    }
  },
  methods: {
    handleLogin () {
      if (!this.checkIn) {
        this.$message.error('请输入正确格式的账号密码')
        return false
      }
      this.loading = true
      this.fetchLogin(true)
      /* uni.navigateTo({
       url:"frozen"
      }) */

    },
    fetchLogin (usePassword = false) {
      this.form.client_id = localStorage.getItem('client_id');
      console.log(usePassword)
      login(usePassword ? this.form : {
        username: '',
        password: '',
        client_id: ''
      }, usePassword).then(res => {
        this.loading = false
        window.localStorage.setItem('token', res.data.token)
        this.$router.push({ path: '/chat' })
        this.$forceUpdate()
      }).catch(e => {
        this.loading = false
      })
    },
    goReg () {
      this.$router.push({ path: '/reg' })
    }
  }
}
</script>

<style lang="less" scoped>
.login-page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .page-logo {
    width: 120px;
    height: 120px;
    margin-bottom: 60px;
  }
  .page-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80%;
    &_input {
      width: 300px;
      display: block;
      font-size: 16px;
      overflow: hidden;
      margin-bottom: 20px;
      /deep/ .el-input__inner {
        border-radius: 16px;
        background-color: #e2f5fc;
        border: none;
      }
    }
    &_btn {
      cursor: pointer;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      text-align: center;
      width: 300px;
      border-radius: 16px;
      background-color: #6dcef7;
      color: #fff;
    }
    &_tip {
      font-size: 14px;
      text-align: right;
      color: #a7b6d0;
      width: 300px;
      margin-top: 8px;
      span {
        padding: 0 12px;
        float: right;
        cursor: pointer;
      }
    }
  }
  .page-footer {
    margin-top: 40px;
    color: #a7b6d0;
    cursor: pointer;
  }
}
</style>
