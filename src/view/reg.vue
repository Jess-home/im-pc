<template>
  <div class="login-page">
    <img
      src="/static/theme/default/login.png"
      class="page-logo"
    />
    <div class="page-form">
      <el-input
        v-model="form.username"
        class="page-form_input"
        placeholder="请输入用户名，不小于5位"
      ></el-input>
      <el-input
        v-model="form.password"
        class="page-form_input"
        type="password"
        placeholder="请输入密码，不小于5位"
      ></el-input>
      <div
        :class="`page-form_btn ${checkIn ? '' : 'disabled'}`"
        :loading="loading"
        @click="handleLogin"
      >立即注册</div>
    </div>
    <div
      class="page-footer"
      @click="goLogin"
    >已有账号，点此去登录</div>
  </div>
</template>

<script>
import { getStore, setStore } from '@/utils/store'
import { reg } from '@/api'
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
      return this.form.password != '' && this.form.username != '' && this.form.password.length > 5 && this.form.username.length > 5;
    }
  },
  methods: {
    handleLogin () {
      if (!this.checkIn) {
        this.$message.error('请输入正确格式的账号密码')
        return false
      }
      if (!(/^\w{1,20}$/.test(this.form.username))) {
        this.$message.error('密聊号只能包括下划线、数字、字母,并且不能超过20个')
        return;
      }
      if (!(/^\w{1,20}$/.test(this.form.password))) {
        this.$message.error('密码只能包括下划线、数字、字母,长度6-20位')
        return;
      }
      this.loading = true
      this.fetchLogin(true)
    },
    fetchLogin (usePassword = false) {
      this.form.client_id = localStorage.getItem('client_id');
      console.log(usePassword)
      reg(this.form, usePassword).then(res => {
        this.loading = false
        window.localStorage.setItem('token', res.data.token)
        this.$router.push({ path: '/chat' })
        this.$forceUpdate()
      }).catch(e => {
        this.loading = false
      })
    },
    goLogin () {
      this.$router.push({ path: '/login' })
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
      background-color: #ff65a3;
      color: #fff;
      &.disabled {
        color: rgba(0, 0, 0, 0.3);
        background-color: #f7f7f7;
      }
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
