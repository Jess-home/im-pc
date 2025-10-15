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
            <span>删除好友</span>
          </div>
        </div>
        <div class="detInfo">
          <div class="area">
            <span>U I D</span>
            <span>{{ info.id }}</span>
          </div>
          <div class="area"><span>昵称</span><span>{{ info.username }}</span></div>
          <div class="area"><span>来源</span><span>{{ info.from }}</span></div>
          <!-- <div class="remark">
          <span>备&nbsp&nbsp&nbsp注</span>
          <span
            title="点击修改备注"
            style="cursor:pointer"
            @click="changeRemark(info)"
          >{{ info.remark }}
          </span>
        </div> -->
          <!-- <div class="list_id"><span>微信号</span><span>{{ info.username }}</span></div> -->
        </div>

        <div class="change-btns">
          <button class="primarybtn default large" @click.stop="handleShare">
            <span>发送名片</span>
          </button>
          <button class="primarybtn large" @click.stop="send">
            <span>发消息</span>
          </button>
        </div>
      </div>
      <!-- <el-popover
        placement="top"
        width="160"
        v-model="visible">
        <h3 style="text-align: center;font-size: 18px;font-weight: bold;color: #f78989;margin:10px;">重要提示</h3>
        <p class="font-size: 20px;">删除好友及相关的会话数据并且不能恢复，确认删除吗？</p>
        <div style="text-align: right; margin: 0;font-size: 20px;">
          <el-button type="info" size="mini" @click="visible = false">取消</el-button>
          <el-button type="danger" size="mini" @click="delFriend">确定</el-button>
        </div>
        <div class="option" slot="reference">
              <div
                class="del_btn"
              >
                <span>删除</span>
              </div>
            </div>
      </el-popover> -->
    </div>
    <selectUser ref="selectUser" title="分享名片" tip="分别转发给" :multiple="false" @handleOk="handleOk"></selectUser>
    <el-dialog title="" top="30vh" custom-class="custom-dialog" width="300px" :visible.sync="show_del">
      <div class="dialog-body">
        <div class="dialog-item">
          确认删除当前好友，
        </div>
        <div class="dialog-item">
          同时删除与该好友的所有聊天记录？
        </div>
      </div>
      <div slot="footer" class="change-btns dialog-footer">
        <button class="primarybtn default" @click="show_del = false">取 消</button>
        <!-- TODO修改用户信息 -->
        <button class="primarybtn" type="primary" @click="delFriend">删除</button>
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
        this.$message.success('发送成功')
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
      this.$prompt('请输入备注信息', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputValue: item.remark,
        inputErrorMessage: '备注信息不能为空'
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

