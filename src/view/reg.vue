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
        :placeholder="$t('qing_shu_ru_yong_hu_ming_bu_xiao_yu_5_wei')"
      ></el-input>
      <el-input
        v-model="form.password"
        class="page-form_input"
        type="password"
        :placeholder="$t('qing_shu_ru_mi_ma_bu_xiao_yu_5_wei')"
      ></el-input>
      <div
        :class="`page-form_btn ${checkIn ? '' : 'disabled'}`"
        :loading="loading"
        @click="handleLogin"
      >{{$t('li_ji_zhu_ce')}}</div>
    </div>
    <div
      class="page-footer"
      @click="goLogin"
    >{{$t('yi_you_zhang_hao_dian_ci_qu_deng_lu')}}</div>
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
        this.$message.error(this.$t('qing_shu_ru_zheng_que_ge_shi_de_zhang_hao_mi_ma'))
        return false
      }
      if (!(/^\w{1,20}$/.test(this.form.username))) {
        this.$message.error(this.$t('mi_liao_hao_zhi_neng_bao_kuo_xia_hua_xian_shu_zi_zi_mu_,_bing_qie_bu_neng_chao_guo_20_ge'))
        return;
      }
      if (!(/^\w{1,20}$/.test(this.form.password))) {
        this.$message.error(this.$t('mi_ma_zhi_neng_bao_kuo_xia_hua_xian_shu_zi_zi_mu_,_chang_du_6-20_wei'))
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
