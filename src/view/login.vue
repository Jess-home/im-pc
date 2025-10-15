<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-content">
        <div class="login-tab">
          <div
            class="tab-item"
            :class="tab_active == 0 ? 'active' : ''"
            @click="tab_active = 0"
          >
            密码登录
          </div>
          <div
            class="tab-item"
            :class="tab_active == 1 ? 'active' : ''"
            @click="tab_active = 1"
          >
            账号注册
          </div>
        </div>
        <div v-if="tab_active == 0" class="login-item">
          <div class="input-item">
            <img src="../assets/images/login/user.png" />
            <input
              v-model="form.username"
              class="login-input"
              placeholder="请输入用户名/手机号码"
            />
          </div>
          <div class="input-item">
            <img src="../assets/images/login/password.png" />
            <input
              v-model="form.password"
              :type="show_pwd ? 'text' : 'password'"
              class="login-input"
              placeholder="请输入密码"
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
          <div class="login-btn" @click="handleLogin">登录</div>
          <div class="youke-login" @click="fetchLogin(false)">
            <span>游客登录</span>
          </div>
          <a href="http://45.113.110.66/privacy/index.html" class="xieyi">
            <span>使用即代表同意</span>
            《使用条款和隐私政策》</a
          >
        </div>
        <div v-if="tab_active == 1 && !next" class="login-item">
          <div class="input-item">
            <img src="../assets/images/login/user.png" />
            <input
              v-model="reg_form.username"
              class="login-input"
              placeholder="请输入用户名/手机号码"
            />
          </div>
          <div class="input-item">
            <img src="../assets/images/login/password.png" />
            <input
              v-model="reg_form.password"
              :type="show_pwd ? 'text' : 'password'"
              class="login-input"
              placeholder="请设置密码,不小于5位"
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
          <div class="login-btn" @click="handleReg">下一步</div>
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
              placeholder="请设置用户昵称,不小于5位"
            />
          </div>
          <div class="sex-item">
            <div
              class="sex-box"
              :class="{ 'sex-active': reg_form.sex == 0 }"
              @click="reg_form.sex = 0"
            >
              <span>男</span>
              <img src="../assets/images/login/man.png" />
            </div>
            <div
              class="sex-box"
              :class="{ 'sex-active': reg_form.sex == 1 }"
              @click="reg_form.sex = 1"
            >
              <span>女</span>
              <img src="../assets/images/login/woman.png" />
            </div>
          </div>

          <div class="step-btn" @click="lastStep">上一步</div>
          <div class="login-btn" @click="nextStep">完成注册</div>
        </div>
      </div>
    </div>

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
  </div>
</template>

<script>
import { login, regPhoto, reg, updatePhoto } from '@/api';
import { mapActions } from 'vuex';
export default {
  data () {
    return {
      loading: false,
      form: {
        username: '',
        password: '',
        client_id: ''
      },
      banner: [
        require('../assets/images/login/10004.png'),
        require('../assets/images/login/10005.png'),
        require('../assets/images/login/10006.png'),
        require('../assets/images/login/10007.png'),
        require('../assets/images/login/10008.png')
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
        this.tips_msg2 = '请输入正确格式的账号密码';
        return false;
      }
      if (!/^\w{1,20}$/.test(this.reg_form.username)) {
        this.tips_msg2 = '密聊号只能包括下划线、数字、字母,并且不能超过20个';
        return;
      }
      if (!/^\w{1,20}$/.test(this.reg_form.password)) {
        this.tips_msg2 = '密码只能包括下划线、数字、字母,长度6-20位';
        return;
      }
      // this.loading = true;
      this.next = true;
    },
    // 完成注册
    nextStep () {
      if (!this.reg_form.nickname || this.reg_form.nickname < 6) {
        this.$message.error('请输入正确的昵称');
        return;
      }
      if (!this.new_avatar) {
        this.$message.error('请上传用户头像');
        return;
      }
	 
	 
	  
	   
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
        this.tips_msg = '请输入正确格式的账号密码';
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
          console.log("res登陆", res);
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
  min-width: 800px;
  .image-banner {
    height: 700px;
    width: 100%;
    .banner-item {
      height: 700px;
      width: 100%;
    }
    .image-item {
      width: 100%;
      height: 700px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 800px;
        height: auto;
      }
    }
  }
}
.login-form {
  width: 537px;
  height: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  padding-top: 18vh;
  background: url("../assets/images/login/10013.png") no-repeat 40px 40px;
  background-size: 220px 220px;
  .login-content {
    margin-left: 175px;
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
  background-size: cover;
  display: flex;
}
</style>
