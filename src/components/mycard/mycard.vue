<!-- 最左边的选择框 -->
<template>
  <div class="mycard">
    <header>
      <el-popover popper-class="custom-popper" placement="right" width="300" trigger="click" :visible-arrow="false"
        v-model="show_my_card">
        <!-- <div class="friendInfo">
           <div v-if="user.user_info" class="esInfo">
            <div class="left">
              <div class="people">
                <div class="nickname">{{ user.user_info.nickname }}</div>
                <div
                  :class="[
                    user.user_info.sex === 1 ? 'gender-male' : 'gender-female',
                  ]"
                ></div>
              </div>
              <div class="signature">{{ user.user_info.signature }}</div>
            </div>
            <div class="right">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleAvatar"
              >
                <img
                  v-if="user.img"
                  style="width: 60px; height: 60px"
                  :src="user.img"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span>{{$t('xiu_gai_tou_xiang')}}</span>
            </div>
          </div>
          <div v-if="user.user_info" class="detInfo">
            <div class="list_id">
              <span>{{$t('wei_xin_hao')}}</span><span>{{ user.user_info.username }}</span>
            </div>
          </div> 
          
        </div>-->
        <div class="friendInfo1">
          <div class="info">

            <div class="info-bg">
              <img class="bg-image" :src="user.img" alt="">
              <el-upload class="avatar-uploader" action="" :show-file-list="false" :auto-upload="false"
                :on-change="handleAvatar">
                <img v-if="user.img" style="width: 60px; height: 60px" :src="user.img" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div class="nickename">{{ user.user_info.nickname }}</div>
              <div class="account">{{ user.user_info.username }}</div>
              <!-- <div class="nickename">{{user.user_info}}</div> -->

              <div class="user-info">
                <div class="user-info-item">
                  <span class="gray">UUID</span>
                  <span>{{ user.uid }}</span>
                </div>
                <div class="user-info-item">
                  <span class="gray">{{$t('qian_ming')}}</span>
                  <span>{{ user.user_info.doodling }}</span>
                </div>
                <div class="user-info-item">
                  <span class="gray">{{$t('di_qu')}}</span>
                  <span>{{ info.address }}</span>
                </div>
                <div class="change-btns">
                  <button class="primarybtn" @click="show_userinfo = true, show_my_card = false">{{$t('xiu_gai_xin_xi')}}</button>
                  <button class="primarybtn default" @click="show_my_card = false">{{$t('fa_xiao_xi')}}</button>
                </div>
              </div>
            </div>
          </div>

        </div>
        <img slot="reference" :src="user.img" class="avatar" />
      </el-popover>
    </header>
    <div class="navbar" @click="clearSearch">
      <p v-if="unreadsum > 0" class="unread">{{ unreadsum }}</p>
      <p v-if="user.new_friend_tips_num > 0" class="unread newFriend">
        {{ user.new_friend_tips_num }}
      </p>
      <router-link to="/chat" class="custom-link">
        <img v-if="currentPath == '/chat'" src="@/assets/navbar/chatin.png" alt="">
        <img v-else src="@/assets/navbar/chat.png" alt="">
        <span :style="{ color: currentPath == '/chat' ? '#3D98FF' : '#999' }">{{$t('liao_tian')}}</span>
      </router-link>
      <router-link to="/friend" class="custom-link">
        <img v-if="currentPath == '/friend'" src="@/assets/navbar/friendsin.png" alt="">
        <img v-else src="@/assets/navbar/friends.png" alt="">
        <span :style="{ color: currentPath == '/friend' ? '#3D98FF' : '#999' }">{{$t('hao_you')}}</span>
      </router-link>
      <router-link to="/groups?type=1" class="custom-link">
        <!-- TODO群聊功能 -->
        <img v-if="currentPath == '/groups?type=1'" src="@/assets/navbar/groupsin.png" alt="">
        <img v-else src="@/assets/navbar/groups.png" alt="">
        <span :style="{ color: currentPath == '/groups?type=1' ? '#3D98FF' : '#999' }">{{$t('qun_liao')}}</span>
      </router-link>
      <!-- <router-link to="/tags" class="custom-link">

        <img v-if="currentPath == '/tags'" src="@/assets/navbar/tagsin.png" alt="">
        <img v-else src="@/assets/navbar/tags.png" alt="">
        <span :style="{ color: currentPath == '/tags' ? '#3D98FF' : '#999' }">{{$t('biao_qian')}}</span>
      </router-link> -->
      <LanguageSwitcher />
    </div>
    <footer>
      <el-dropdown placement="top" @command="handleCommand">
        <i class="iconfont iconIMweb_more" style="margin-top: 0;color: #333;font-size: 30px;"></i>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item command="bind" class="drop-item">
            <i style="font-size:20px" class="el-icon-mobile
"></i>
            <span>{{$t('bang_ding_shou_ji')}}</span>
          </el-dropdown-item> -->
          <el-dropdown-item command="reset" class="drop-item">
            <i style="font-size:22px" class="iconfont iconPassword"></i>
            <span>{{$t('xiu_gai_mi_ma')}}</span>
          </el-dropdown-item>
          <el-dropdown-item command="logout" class="drop-item">
            <i style="font-size:22px" class="iconfont iconttubiao_signout"></i>
            <span>{{$t('tui_chu_deng_lu')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </footer>
    <el-dialog :title="$t('mi_ma_xiu_gai')" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false">
      <el-form :model="formData">
        <el-form-item :label="$t('shu_ru_yuan_mi_ma')" label-width="60">
          <el-input v-model="formData.pass1" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item :label="$t('shu_ru_xin_mi_ma')" label-width="60">
          <el-input v-model="formData.pass2" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item :label="$t('que_ren_xin_mi_ma')" label-width="60">
          <el-input v-model="formData.pass3" autocomplete="off" show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('qu_xiao')}}</el-button>
        <el-button type="primary" @click="handleReset">{{$t('que_ding')}}</el-button>
      </span>
    </el-dialog>
    <!-- TODO修改用户信息 -->
    <el-dialog custom-class="custom-dialog" width="400px" :visible.sync="show_userinfo">
      <div slot="title" class="dialog-title">
        {{$t('xiu_gai_ge_ren_xin_xi')}}
        
      </div>
      <div class="dialog-body">
        <div class="dialog-item">
          <span class="gray">{{$t('zhang_hao')}}</span>
          <span style="padding-left:15px;">{{ user.user_info.username }}</span>
        </div>
        <div class="dialog-item">
          <span class="gray">{{$t('ni_cheng')}}</span>
          <el-input class="custom-input" type="text" :placeholder="$t('qing_shu_ru_ni_cheng')" v-model="user.user_info.nickname" maxlength="30"
            show-word-limit />
        </div>
        <div class="dialog-item">
          <span class="gray align-start">{{$t('qian_ming')}}</span>
          <el-input class="custom-input" type="textarea" :placeholder="$t('qing_shu_ru_nei_rong')" v-model="user.user_info.doodling"
            maxlength="30" show-word-limit />
        </div>
        <!-- <div class="dialog-item">
          <span class="gray align-start">{{$t('xing_bie')}}</span>
          <el-select class="custom-input" v-model="user.user_info.sex" :placeholder="$t('qing_xuan_ze')">
            <el-option v-for="item in sex_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div> -->
		<div class="dialog-item">
		  <span class="gray align-start">{{$t('kai_qi_hao_you_xiao_xi_yan_zheng')}}</span>
		  <el-switch
		    v-model="validation"
			@change ="uservalidation()" 
		    active-color="#13ce66"
		    inactive-color="#99aaac">
		  </el-switch>
		</div>
        <!-- <div class="dialog-item">
          <span class="gray">{{$t('di_qu')}}</span>
          <span style="padding-left:15px;">{{ info.address }}</span>
          <span class="gray" style="padding-left:15px;">(注册IP归属地，暂不支持修改)</span>
        </div> -->
      </div>
      <div slot="footer" class="change-btns dialog-footer">
        <button class="primarybtn default" @click="show_userinfo = false">{{$t('qu_xiao')}}</button>
        <!-- TODO修改用户信息接口 -->
        <button class="primarybtn" type="primary" @click="show_userinfo = false">{{$t('bao_cun')}}</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { clearStore } from '@/utils/store';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { resetPassword,setInfo,fetchUserInfo, uploadPhoto, updatePhoto, getUserStore } from '@/api';
export default {
  components: {
    LanguageSwitcher
  },
  data() {
    return {
		validation:false,
      formData: {
        pass1: '',
        pass2: '',
        pass3: ''
      },
      hasToken: false,
      dialogVisible: false,

      currentPath: '',
      show_my_card: false,//显示我的信息
      show_userinfo: false,//显示修改用户信息
      sex_options: [
        {
          label: this.$t('nan'),
          value: 1,
        },
        {
          label: this.$t('nv'),
          value: 2
        },
        {
          label: this.$t('bao_mi'),
          value: 0
        }
      ],
      info: {},//所有信息
    };
  },
  computed: {
    ...mapState(['user', 'unreadsum'])
	
  },
  mounted() {
    this.getInfo();
    fetchUserInfo({
		
	}).then(res=>{
		if(res.data.user_info.validation ==1){
			this.validation=true
		}else{
			this.validation=false
		}
	});
	
	
	
  },
  watch: {
    '$route': {
      handler(newval, oldval) {
        this.getInfo();
        this.currentPath = newval.fullPath;
      },
      immediate: true
    },
  },
  methods: {
	  uservalidation(){
		 
		  setInfo({
			  type:3,
			  content:this.validation
		  }).then(res => {
			  if(res.err == 0){
				   this.$message.success(this.$t('she_zhi_cheng_gong'));
			  }else{
				   this.$message.error(this.$t('she_zhi_shi_bai'));
			  }
		  });
	  },
    getInfo() {
      getUserStore().then(res => {
        console.log(this.$t('suo_you_xin_xi_11'), res);
        this.info = res.data.info.user_info;
		 this.getAddress(this.info.ip);
		 
		 
		
       
		for(var x in  this.info){
			// console.log(x); 
			this.$set(this.info,x,res.data.info.user_info.x);
			 
			 }
		
		
      })
    },
    getAddress(ip) {
      // this.$jsonp('http://whois.pconline.com.cn/ipJson.jsp?ip=' + ip, null, (err, data) => {
      //   if (err) {
      //     console.log("err", err);
      //   } else {
      //     console.log("data地区信息", data);
      //     this.info.address = data.addr.split(" ")[0]
      //   }
      // })
      // this.$axios({
      //   url: 'https://api.muxiaoguo.cn/api/ip?api_key=141b6597a6422d02&type=m&ip='+ip,
      // }).then(res => {
      //   // console.log("res地址", res);
      //   this.info.address = res.data.data.address;
      // })
    },
    handleAvatar(file, list) {
      uploadPhoto({
        _token: localStorage.getItem('token'),
        file: file.raw
      }).then((res) => {
        updatePhoto({
          _token: localStorage.getItem('token')
        }).then((data) => {
          let url = window.URL || window.webkitURL;
          console.log(data);
          this.user.img = url.createObjectURL(file.raw);
        });
      });
    },
    clearSearch() {
      this.$store.dispatch('search', '');
    },
    handleCommand(command) {
      if (command == 'reset') {
        this.dialogVisible = true;
      } else if (command == 'logout') {
        this.dialogVisible = true;
        this.$store.state.user.uid = '';
        clearStore();
		this.$store.dispatch('/chat', this.$route)
        this.$router.push('/login');
      } else {
        // 
      }
    },
    handleReset() {
      if (!this.formData.pass1 || this.formData.pass1.length < 6) {
        this.$message.error(this.$t('qing_shu_ru_yuan_mi_ma_,_bu_neng_xiao_yu_6_wei'));
        return;
      }
      if (!this.formData.pass2 || this.formData.pass2.length < 6) {
        this.$message.error(this.$t('qing_shu_ru_xin_mi_ma_,_bu_neng_xiao_yu_6_wei'));
        return;
      }
      if (!this.formData.pass3 || this.formData.pass3.length < 6) {
        this.$message.error(this.$t('qing_que_ren_xin_mi_ma_,_bu_neng_xiao_yu_6_wei'));
        return;
      }
      if (this.formData.pass2 !== this.formData.pass3) {
        this.$message.error(this.$t('liang_ci_xin_mi_ma_bu_yi_zhi'));
        return;
      }
      resetPassword(this.formData).then((res) => {
        this.$message.success(this.$t('yi_xiu_gai_,_qing_zhong_xin_deng_lu'));
        setTimeout(() => {
          this.handleCommand();
        }, 1000);
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/fonts/iconfont.css';

.dialog-footer{
  justify-content: center;
  width:80%;
  margin:0 auto;
}

.dialog-title{
  font-size:14px;
  padding:0 10px;
}
.dialog-body{
  padding:0 30px;
  .dialog-item{
    display: flex;
    align-items: center;
    min-height:30px;
    color: #2c2c2c;
    margin-top:6px;
    
    span{
      font-size:12px;
      min-width: 30px;
    }
    .align-start{
      align-self:flex-start;
      height:30px;
      align-items: center;
      display:flex;
    }
    .gray{
      color:gray;
      margin-right:10px;
    }
  }
}


.change-btns{
  display: flex;
  justify-content: space-around;
  align-items: center;
  height:60px;
  .primarybtn{
    width: 90px;
    height: 30px;
    border-radius: 4px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    background: linear-gradient(134deg, #44baf8 0%, #3596fc 100%);
    box-shadow: 0px 2px 6px #8dbff8;
    color: #fff;
    outline: none;
    border:none;
  }
  .primarybtn.default{
      box-shadow: 0px 2px 6px #7f96be7d;
      color: #333;
      background: linear-gradient(125deg, #f5f5f5 0%, #edeff3 100%);
  }
}


.drop-item
  display flex
  align-items center
  i
   width 22px
   height 22px
   display flex
   align-items center
   justify-content center
.custom-link
  display flex
  flex-direction column
  width 60px
  align-items center
  margin-top 24px
  img 
    width 24px
    height 24px
  span 
    font-size 12px
    margin-top 5px


.friendInfo {
  padding: 0 30px;
}
.custom-popper{
  padding:0;
  background:red;
}
.friendInfo1{
  
  .info{
    height:140px;
    background:#CECECE;
    .info-bg{
      width:300px;
      // height:140px;
      display: flex;
      justify-content: center;
      align-items: center;
      position:relative;
      flex-direction:column;
      padding-top:10px;
      .bg-image{
        position:absolute;
        left:0;
        top:0;
        width:100%;
        height:100%;
        z-index:0;
        filter:blur(20px);
      }
      .user-info{
        background:#fff;
        width:100%;
        position:relative;
        z-index:2;
        display: flex;
        flex-direction: column;
        box-sizing:border-box;
        padding:15px;
        .user-info-item{
          display: flex;
          align-items: center;
          height:40px;
          color: #2c2c2c;
          span{
            font-size:12px;
            min-width: 30px;
          }
          .gray{
            color:gray;
            margin-right:10px;
          }
        }
        
      }
      .avatar{
        position:relative;
        z-index:10;
      }
      .nickename,.account{
        position:relative;
        z-index:2;
        text-align: center;
        color:#fff;
        height:30px;
        line-height:30px;
      }
      .nickename{
        font-size:14px;
      }
      .account{
        font-size:12px;
      }
    }

  }
}

.esInfo {
  display: flex;
  align-items: center;
  padding: 20px 0 20px 0;

  .left {
    flex: 1;

    .people {
      .nickname {
        display: inline-block;
        font-size: 20px;
        margin-bottom: 16px;
      }

      .gender-male, .gender-female {
        display: inline-block;
        width: 18px;
        height: 18px;
        vertical-align: top;
        margin-top: 2px;
      }
    }

    .signature {
      font-size: 14px;
      color: rgba(153, 153, 153, 0.8);
    }
  }

  .right {
    .avatar {
      border-radius: 3px;
    }
  }
}

.tip {
  font-size: 24px;
  float: right;
  cursor: pointer;
}

.detInfo {
  padding: 20px 0 10px;
  border-top: 1px solid #e7e7e7;

  .remark, .area, .list_id {
    font-size: 14px;
    margin-top: 20px;

    span {
      font-size: 14px;
      color: rgba(153, 153, 153, 0.8);
      margin-right: 40px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .remark {
    margin-top: 0;
  }
}

.router-link-active {
  color: #00dc41 !important;
}

.mycard {
  position: relative;
  width: 100%;
  height: 100%;

  .avatar {
    width: 36px;
    height: 36px;
    margin: 12px;
    border-radius: 2px;
  }

  .navbar {
    width: 100%;
    text-align: center;
  }

  .icon {
    display: inline-block;
    font-size: 26px;
    margin-top: 28px;
    padding: 0 16px;
    box-sizing: border-box;
    color: rgb(173, 174, 175);
    opacity: 0.8;
    cursor: pointer;

    &.active {
      color: rgb(0, 220, 65);
    }

    &:hover {
      opacity: 1;
    }
  }
  .icon-msg, .icon-more {
    font-size: 22px;
  }

  .icon-msg {
    padding: 0 19px;
  }
}

.unread {
  position: absolute;
  height: 16px;
  background-color: #FB7B7A;
  border-radius: 8px;
  color: rgb(225, 225, 225);
  font-size: 12px;
  top: 75px;
  left: 66%;
  transform: translateX(-50%);
  z-index: 99;
  box-sizing: border-box;
  padding: 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;

  &.newFriend {
    top: 130px;
  }
}

footer {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
}
</style>
<style>
.custom-popper.el-popover {
  padding: 0 !important;
}

.custom-dialog .el-dialog__body {
  padding: 0 !important;
}

.custom-input .el-input__inner {
  height: 30px !important;
  line-height: 30px !important;
  font-size: 12px !important;
}

.custom-input textarea {
  font-family: '微软雅黑' !important;
  font-size: 12px !important;
}

.custom-input textarea::-webkit-input-placeholder {
  font-family: '微软雅黑' !important;
  font-size: 12px !important;
}

.custom-input .el-input__icon {
  line-height: 30px;
}
</style>
