<!-- 好友信息 -->
<template>
  <div v-if="info" class="Info-wrapper">
    <!-- <div
      v-show="info.list_id === ''"
      class="newfriend"
    >
      <div class="nickname">{{ info.nickname }}</div>
    </div> -->
    <div class="friendInfo">
      <div class="header-info">
        {{ info.nickname }}
      </div>
      <div class="info-body">
        <div class="esInfo">
          <div class="left">
            <img class="avatar" width="60" height="60" :src="photoUrl + info.photo">
            <div class="left-remark" @click="changeRemark(info)">
              <span>{{ info.remark }}</span>
              <i class="iconfont iconttubiao_bianji" style="font-size:20px;color: #428dfc;cursor: pointer;"></i>
            </div>
          </div>
          <div class="right" @click="show_del = true">
            <i class="iconfont iconIMweb_deldte" style="margin-right:6px;font-size:20px;"></i>
            <span>{{$t('shan_chu_hao_you')}}</span>
          </div>
        </div>
        <div class="detInfo">
          <div class="area">
            <span>U I D</span>
            <span>{{ info.id }}</span>
          </div>
          <div class="area"><span>{{$t('ni_cheng')}}</span><span>{{ info.username }}</span></div>
          <div class="area"><span>{{$t('lai_yuan')}}</span><span>{{ info.from }}</span></div>
          <!-- <div class="remark">
          <span>{{$t('bei')}}&nbsp&nbsp&nbsp{{$t('zhu')}}</span>
          <span
            :title="$t('dian_ji_xiu_gai_bei_zhu')"
            style="cursor:pointer"
            @click="changeRemark(info)"
          >{{ info.remark }}
          </span>
        </div> -->
          <!-- <div class="list_id"><span>微信号</span><span>{{ info.username }}</span></div> -->
        </div>

        <div class="change-btns">
          <button class="primarybtn default large" @click.stop="handleShare">
            <span>{{$t('fa_song_ming_pian')}}</span>
          </button>
          <button class="primarybtn large" @click.stop="send">
            <span>{{$t('fa_xiao_xi')}}</span>
          </button>
        </div>
      </div>
      <!-- <el-popover
        placement="top"
        width="160"
        v-model="visible">
        <h3 style="text-align: center;font-size: 18px;font-weight: bold;color: #f78989;margin:10px;">{{$t('zhong_yao_ti_shi')}}</h3>
        <p class="font-size: 20px;">{{$t('shan_chu_hao_you_ji_xiang_guan_de_hui_hua_shu_ju_bing_qie_bu_neng_hui_fu_que_ren_shan_chu_ma')}}</p>
        <div style="text-align: right; margin: 0;font-size: 20px;">
          <el-button type="info" size="mini" @click="visible = false">{{$t('qu_xiao')}}</el-button>
          <el-button type="danger" size="mini" @click="delFriend">{{$t('que_ding')}}</el-button>
        </div>
        <div class="option" slot="reference">
              <div
                class="del_btn"
              >
                <span>{{$t('shan_chu')}}</span>
              </div>
            </div>
      </el-popover> -->
    </div>
    <selectUser ref="selectUser" :title="$t('fen_xiang_ming_pian')" :tip="$t('fen_bie_zhuan_fa_gei')" :multiple="false" @handleOk="handleOk"></selectUser>
    <el-dialog title="" top="30vh" custom-class="custom-dialog" width="300px" :visible.sync="show_del">
      <div class="dialog-body">
        <div class="dialog-item">
          {{$t('que_ren_shan_chu_dang_qian_hao_you')}}
        </div>
        <div class="dialog-item">
          {{$t('tong_shi_shan_chu_yu_gai_hao_you_de_suo_you_liao_tian_ji_lu')}}
        </div>
      </div>
      <div slot="footer" class="change-btns dialog-footer">
        <button class="primarybtn default" @click="show_del = false">{{$t('qu_xiao')}}</button>
        <!-- TODO修改用户信息 -->
        <button class="primarybtn" type="primary" @click="delFriend">{{$t('shan_chu')}}</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import selectUser from '@/components/selectUser'
import { setRemarks, fetchInfo, sendCard, removeFriend } from '@/api'
const { photoUrl } = window.__gconf
export default {
  components: {
    selectUser
  },
  data() {
    return {
      info: null,
      photoUrl: photoUrl,
      visible: false,
      show_del: false,
    }
  },

  computed: {
    ...mapGetters([
      'selectedFriend'
    ])
  },
  watch: {
    selectedFriend(val) {
		
      this.fetchInfo()
	 
    }
  },
  	
  methods: {
    ...mapActions([
      'fetchFriendList',
      'fetchCharList'
    ]),
    delFriend() {
      this.visible = false;
      this.show_del = false;
      // 删除好友，更新朋友列表，更新消息列表
      removeFriend({
        user_id: this.selectedFriend.id
      }).then(res => {
        this.$emit("refresh");
        this.fetchFriendList();
        localStorage.setItem('vue-chat', []);
        this.fetchCharList();
      })
    },
    handleOk(data) {
      sendCard({
        users: JSON.stringify([this.info.user_id + '']),
        list_id: data.map(item => {
          return item.list_id
        }).join()
      }).then(res => {
        this.$message.success(this.$t('fa_song_cheng_gong'))
      })
    },
    fetchInfo() {
      fetchInfo({
        user_id: this.selectedFriend.id,
        in: 0
      }).then(res => {
        this.info = {
          ...this.selectedFriend,
          ...res.data
        }
      })
    },
    send() {
      this.$store.dispatch('send')
      this.$store.dispatch('search', '')
    },
    handleShare() {
      this.$refs.selectUser.open()
    },
    changeRemark(item) {
      this.$prompt(this.$t('qing_shu_ru_bei_zhu_xin_xi'), '', {
        confirmButtonText: this.$t('que_ding'),
        cancelButtonText: this.$t('qu_xiao'),
        inputPattern: /\S/,
        inputValue: item.remark,
        inputErrorMessage: this.$t('bei_zhu_xin_xi_bu_neng_wei_kong')
      }).then(({ value }) => {
        setRemarks({
          content: value,
          user_id: item.id
        }).then(res => {
          this.fetchFriendList()
        })
      }).catch(() => {
      });
      console.log(item)
    }
  }
}
</script>

<style lang="stylus" scoped>
.dialog-footer{
  justify-content: center;
  width:250px!important;
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
    justify-content: center;
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
  width:450px;
  margin:0 auto; 
  
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
  .large{
    width:134px;
    height:40px;
    line-height:40px;
  }
}
.info-body
  padding 0 50px
.header-info
  height 56px
  display flex
  align-items center
  font-size 16px
  color #333
  background #fcfcfc
  padding 0 20px
.newfriend
  height 60px
  padding 28px 0 0 30px
  box-sizing border-box
  border-bottom 1px solid #e7e7e7
  .nickname
    font-size 18px
.friendInfo
  background #f3f3f3
  box-sizing border-box
  height 100vh
.esInfo
  display flex
  align-items center
  padding 20px 0
  .left
    flex 1
    display flex
    align-items center
    .avatar
      width 60px
      height 60px
      margin-right 10px
    .left-remark
        color #333
        height 30px
        font-size 16px
        display flex
        align-items center
      
    .people
      .nickname
        display inline-block
        font-size 20px
        margin-bottom 16px
      .gender-male, .gender-female
        display inline-block
        width 18px
        height 18px
        vertical-align top
        margin-top 2px
      .gender-male
        background-image url('man.png')
        background-size cover
      .gender-female
        background-image url('woman.png')
        background-size cover
    .signature
      font-size 14px
      color rgba(153, 153, 153, 0.8)
  .right
    display flex
    align-items center
    font-size 14px
    color #999
    cursor pointer
    .avatar
      border-radius 3px
.detInfo
  padding 0 0 20px
  border-top 1px solid #e7e7e7
  border-bottom 1px solid #e7e7e7
  margin-bottom 36px
  .remark, .area, .list_id
    font-size 14px
    display flex
    align-items center
    height 30px
    margin-top 20px
    span
      font-size 14px
      color #999
      margin-right 20px
      min-width 30px
      &:last-child
        margin-right 0
        color #333
  .remark
    margin-top 0
.option
  display flex
  justify-content center
  align-items center
  margin-top 40px
.send
  text-align center
  width 140px
  height 36px
  line-height 36px
  font-size 14px
  color #fff
  background-color #1aad19
  cursor pointer
  border-radius 2px
  &:first-child
    margin-right 30px
  &:hover
    background rgb(18, 150, 17)
.del_btn
  text-align center
  width 140px
  height 36px
  line-height 36px
  font-size 14px
  color #fff
  background-color #e78888
  cursor pointer
  border-radius 2px
  &:first-child
    margin-right 30px
  &:hover
    background #f56c6c
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

