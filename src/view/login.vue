<template>
  <div class="login-container">
    

    <div style="display:flex;justify-content: center;margin: auto;height: 600px;width: 1200px;border-radius: 40px;">
      <div class="banner">
      <el-carousel class="image-banner" arrow="never" trigger="click">
        <el-carousel-item
          v-for="(item, index) in banner"
          :key="index"
          class="banner-item"
        >
          <div class="image-item">
            <img :src="item" alt="" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="login-form">
      <div style="display: flex;flex-direction: row-reverse;margin-right: 50px;margin-top: -70px;">
        <LanguageSwitcher />
      </div>
      
      <div class="login-content">
        <div class="login-tab">
          <div
            class="tab-item"
            :class="tab_active == 0 ? 'active' : ''"
            @click="tab_active = 0"
          >
            {{$t('mi_ma_deng_lu')}}
          </div>
          <div
            class="tab-item"
            :class="tab_active == 1 ? 'active' : ''"
            @click="tab_active = 1"
          >
            {{$t('zhang_hao_zhu_ce')}}
          </div>
        </div>
        <div v-if="tab_active == 0" class="login-item">
          <div class="input-item">
            <img src="../assets/images/login/user.png" />
            <input
              v-model="form.username"
              class="login-input"
              :placeholder="$t('qing_shu_ru_yong_hu_ming_/_shou_ji_hao_ma')"
            />
          </div>
          <div class="input-item">
            <img src="../assets/images/login/password.png" />
            <input
              v-model="form.password"
              :type="show_pwd ? 'text' : 'password'"
              class="login-input"
              :placeholder="$t('qing_shu_ru_mi_ma')"
            />
            <img
              v-if="show_pwd"
              src="../assets/images/login/eye.png"
              @click="show_pwd = !show_pwd"
            />
            <img
              v-if="!show_pwd"
              src="../assets/images/login/no_eye.png"
              @click="show_pwd = !show_pwd"
            />
          </div>
          <div class="tips">{{ tips_msg }}</div>
          <div class="login-btn" @click="handleLogin">{{$t('deng_lu')}}</div>
          <!-- <div class="youke-login" @click="fetchLogin(false)">
            <span>{{$t('you_ke_deng_lu')}}</span>
          </div> -->
          <a href="" class="xieyi">
            <span>{{$t('shi_yong_ji_dai_biao_tong_yi')}}</span>
            《{{$t('shi_yong_tiao_kuan_he_yin_si_zheng_ce')}}</a
          >
        </div>
        <div v-if="tab_active == 1 && !next" class="login-item">
          <div class="input-item">
            <img src="../assets/images/login/user.png" />
            <input
              v-model="reg_form.username"
              class="login-input"
              :placeholder="$t('qing_shu_ru_yong_hu_ming_/_shou_ji_hao_ma')"
            />
          </div>
          <div class="input-item">
            <img src="../assets/images/login/password.png" />
            <input
              v-model="reg_form.password"
              :type="show_pwd ? 'text' : 'password'"
              class="login-input"
              :placeholder="$t('qing_she_zhi_mi_ma_,_bu_xiao_yu_5_wei')"
            />
            <img
              v-if="show_pwd"
              src="../assets/images/login/eye.png"
              @click="show_pwd = !show_pwd"
            />
            <img
              v-if="!show_pwd"
              src="../assets/images/login/no_eye.png"
              @click="show_pwd = !show_pwd"
            />
          </div>
          <div class="tips">{{ tips_msg2 }}</div>
          <div class="login-btn" @click="nextStep">{{$t('zhu_ce')}}</div>
        </div>
        <div v-if="tab_active == 1 && next" class="login-item">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatar"
          >
            <img
              v-if="avatar"
              style="width: 80px; height: 80px"
              :src="avatar"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="input-item">
            <img src="../assets/images/login/user.png" />
            <input
              v-model="reg_form.nickname"
              class="login-input"
              :placeholder="$t('qing_she_zhi_yong_hu_ni_cheng_,_bu_xiao_yu_5_wei')"
            />
          </div>
          <div class="sex-item">
            <div
              class="sex-box"
              :class="{ 'sex-active': reg_form.sex == 0 }"
              @click="reg_form.sex = 0"
            >
              <span>{{$t('nan')}}</span>
              <img src="../assets/images/login/man.png" />
            </div>
            <div
              class="sex-box"
              :class="{ 'sex-active': reg_form.sex == 1 }"
              @click="reg_form.sex = 1"
            >
              <span>{{$t('nv')}}</span>
              <img src="../assets/images/login/woman.png" />
            </div>
          </div>

          <div class="step-btn" @click="lastStep">{{$t('shang_yi_bu')}}</div>
          <div class="login-btn" @click="nextStep">{{$t('wan_cheng_zhu_ce')}}</div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { login, regPhoto, reg, updatePhoto } from '@/api';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { mapActions } from 'vuex';
export default {
  components: {
    LanguageSwitcher
  },
  data () {
    return {
      loading: false,
      form: {
        username: '',
        password: '',
        client_id: ''
      },
      banner: [
        require('../assets/images/login/loginbag.jpg'),
        // require('../assets/images/login/10005.png'),
        // require('../assets/images/login/10006.png'),
        // require('../assets/images/login/10007.png'),
        // require('../assets/images/login/10008.png')
      ],
      tab_active: 0,
      show_pwd: false,
      tips_msg: '',
      tips_msg2: '',
      reg_form: {
        username: '',
        nickname: '',
        password: '',
        client_id: '',
        type: 'REGISTER',
        mobileCode: 0,
        sex: 1
      },
      next: false,
      avatar: require('../assets/images/login/avatar.png'),
      new_avatar: ''
    };
  },
  computed: {
    checkIn () {
      return (
        this.form.password != '' &&
        this.form.username != '' &&
        this.form.password.length > 5
      );
    },
    checkIn2 () {
      return (
        this.reg_form.password != '' &&
        this.reg_form.username != '' &&
        this.reg_form.password.length > 5
      );
    }
  },
  methods: {
    lastStep () {
      this.next = false;
    },
    // 上传头像
    handleAvatar (file) {
      regPhoto({
        file: file.raw,
        username: this.reg_form.username
      }).then((res) => {
        console.log('res', res);
        let url = window.URL || window.webkitURL;
        this.avatar = url.createObjectURL(file.raw);
        this.new_avatar = url.createObjectURL(file.raw);
        // updatePhoto().then((data) => {
        //   let url = window.URL || window.webkitURL;
        //   console.log("data", data);
        //   this.avatar = url.createObjectURL(file.raw);
        //   this.new_avatar = url.createObjectURL(file.raw);
        // });
      });
    },
	
	
    // 注册第一步
    handleReg () {
      if (!this.checkIn2) {
        this.tips_msg2 = this.$t('qing_shu_ru_zheng_que_ge_shi_de_zhang_hao_mi_ma');
        return false;
      }
      if (!/^\w{1,20}$/.test(this.reg_form.username)) {
        this.tips_msg2 = this.$t('mi_liao_hao_zhi_neng_bao_kuo_xia_hua_xian_shu_zi_zi_mu_,_bing_qie_bu_neng_chao_guo_20_ge');
        return;
      }
      if (!/^\w{1,20}$/.test(this.reg_form.password)) {
        this.tips_msg2 = this.$t('mi_ma_zhi_neng_bao_kuo_xia_hua_xian_shu_zi_zi_mu_,_chang_du_6-20_wei');
        return;
      }
      // this.loading = true;
      this.next = true;
    },
    // 完成注册
    nextStep () {
      if (!this.reg_form.username || this.reg_form.username.length < 6) {
        this.$message.error(this.$t('qing_shu_ru_zheng_que_de_ni_cheng'));
        return;
      }
      // if (!this.new_avatar) {
      //   this.$message.error('请上传用户头像');
      //   return;
      // }
	 
	 
	  
	   
	   if (this.loading) {
	     return;
	   }
	   this.loading = true
      this.fetchReg(true);
    },
    fetchReg (usePassword = false) {
		
	
		
		
		
      this.reg_form.client_id = localStorage.getItem('client_id') || '';
      console.log(usePassword);
      reg(this.reg_form, usePassword)
        .then((res) => {
			this.$message.success(res.msg)
          this.loading = false;
          window.localStorage.setItem('token', res.data.token);
          this.$router.push({ path: '/chat' });
          this.$forceUpdate();
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    handleLogin () {
      if (!this.checkIn) {
        this.tips_msg = this.$t('qing_shu_ru_zheng_que_ge_shi_de_zhang_hao_mi_ma');
        return false;
      }
      this.loading = true;
      this.fetchLogin(true);
      /* uni.navigateTo({
       url:"frozen"
      }) */
    },
    fetchLogin (usePassword = false) {
      this.form.client_id = localStorage.getItem('client_id') || '';
      console.log(usePassword);
      login(
        usePassword
          ? this.form
          : {
            username: '',
            password: '',
            client_id: ''
          },
        usePassword
      )
        .then((res) => {
			this.$message.success(res.msg)
          console.log(this.$t('res_deng_lu'), res);
          this.loading = false;
          window.localStorage.setItem('token', res.data.token);
          this.$router.push({ path: '/chat' });
          this.$forceUpdate();
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    goReg () {
      this.$router.push({ path: '/reg' });
    }
  }
};
</script>

<style lang="less" scoped>
.avatar-uploader {
  margin: 20px auto;
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 20px 0;
}
.sex-item {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  box-sizing: border-box;
  width: 250px;
}

.sex-box {
  height: 40px;
  width: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background: #efefef;
  cursor: pointer;

  span {
    font-size: 14px;
    color: #aaa;
    margin-right: 10px;
  }

  img {
    width: 20px;
    height: 20px;
  }
}

.sex-active {
  background-color: #598fef;

  span {
    color: #fff;
  }
}
.banner {
  flex: 1;
  width: 65%;
  .image-banner {
    height: 600px;
    width: 100%;
    .banner-item {
      height: 600px;
      width: 100%;
    }
    .image-item {
      width: 100%;
          height: 600px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 100%;
            height: 600px;
            border-radius: 40px 0px 0px 40px;
      }
    }
  }
}
.login-form {
  border-radius: 0px 40px 40px 0px;
  background-color: #fff;
  width: 35%;
  box-sizing: border-box;
  flex-shrink: 0;
  padding-top: 8vh;
  // background: url("../assets/images/login/10013.png") no-repeat 40px 40px;
  background-size: 220px 220px;
  .login-content {
    margin-left: 75px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .youke-login {
      height: 40px;
      line-height: 40px;
      color: #3b8aff;
      font-size: 14px;
      text-align: right;
      width: 250px;
      span {
        cursor: pointer;
        margin-right: 20px;
      }
    }
    .tips {
      color: red;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      width: 250px;
    }
    .xieyi {
      margin-top: 60px;
      text-decoration: none;
      color: #3b8aff;
      font-size: 13px;
      width: 250px;
      display: block;
      text-align: center;
      span {
        color: #666;
      }
    }
    .login-btn {
      width: 250px;
      height: 42px;
      line-height: 42px;
      border-radius: 25px;
      margin-top: 20px;
      text-align: center;
      cursor: pointer;
      background: linear-gradient(134deg, #44baf8, #3596fc);
      box-shadow: 0 2px 6px #8dbff8;
      color: #fff;
    }
    .login-btn:active {
      box-shadow: 0 0 0 transparent;
    }
    .step-btn {
      width: 250px;
      height: 42px;
      line-height: 42px;
      border-radius: 25px;
      margin-top: 7px;
      text-align: center;
      cursor: pointer;
      background: #eeeeee;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      color: #666;
    }
    .step-btn:active {
      box-shadow: 0 0 0 transparent;
    }
    .login-item {
      .input-item {
        height: 44px;
        width: 250px;
        box-sizing: border-box;
        border-radius: 22px;
        background: #e1efff;
        padding: 0 16px;
        position: relative;
        display: flex;
        align-items: center;
        width: 250px;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        img {
          width: 18px;
          height: 18px;
          margin-right: 10px;
          cursor: pointer;
        }
        .login-input {
          border: none;
          outline: none;
          background: none;
          flex: 1;
          font-size: 14px;
        }
      }
    }
    .login-tab {
      font-size: 20px;
      color: #999;
      width: 250px;
      display: flex;
      margin-bottom: 4.8vh;
      align-items: center;
      height: 30px;
      justify-content: space-around;
      .tab-item {
        color: #999999;
        cursor: pointer;
      }
      .active {
        color: #3b8aff;
        position: relative;
      }
      .active::after {
        content: "";
        position: absolute;
        bottom: -14px;
        height: 2px;
        background: #3b8aff;
        width: 60px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
.login-container {
  width: 100%;
  height: 100%;
  background: url("../assets/images/login/10012.png") no-repeat;
  background-blend-mode: overlay; /* 混合模式 */
  background-size: cover;
  display: flex;
  position: fixed;
}
.login-container::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00c3ff42; /* 半透明白色遮罩 */
  z-index: -1; /* 确保遮罩在内容后面 */
}
</style>
