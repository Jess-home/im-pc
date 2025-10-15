<template>
  <el-dialog
    class="group_manage"
    title="群管理"
    :visible.sync="dialogVisible"
    width="400px"
  >
    <!-- 群昵称 -->
    <el-dialog
      width="400px"
      title="群昵称"
      :visible.sync="showChangeGroupName"
      append-to-body
    >
      <el-input v-model="group.name" placeholder="请输入群昵称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveGroupName">保存</el-button>
      </span>
    </el-dialog>
    <!-- 我在本群的昵称 -->
    <el-dialog
      width="400px"
      title="我在本群的昵称"
      :visible.sync="showChangeNickName"
      append-to-body
    >
      <el-input
        v-model="info.my_nickname"
        placeholder="请输入你在本群的昵称"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveNickName">保存</el-button>
      </span>
    </el-dialog>
    <!-- 群公告 -->
    <el-dialog
      width="400px"
      title="群公告"
      :visible.sync="showChangeNotice"
      append-to-body
    >
      <el-input
        v-model="group.notice"
        type="textarea"
        :rows="5"
        placeholder="请输入群公告"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveNotice">保存</el-button>
      </span>
    </el-dialog>
    <!-- 群管理 -->
    <el-dialog
      width="400px"
      title="群管理"
      class="group_manage"
      :visible.sync="showChangeManage"
      append-to-body
    >
      <div class="g_list">
        <div class="g_item">
          <div>全员禁言</div>
          <div class="align-center">
            <el-switch v-model="group.is_msg" @change="changeIsMsg">
            </el-switch>
          </div>
        </div>
        <div class="g_item">
          <div>群内禁止加好友</div>
          <div class="align-center">
            <el-switch v-model="group.can_add_friend" @change="changeAddFriend">
            </el-switch>
          </div>
        </div>
        <div v-if="info.is_action == 2" class="g_item" @click="handleSetManage">
          <div>设置管理员</div>
          <div class="align-center">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div v-if="info.is_action == 2" class="g_item" @click="handleTrans">
          <div>群主转让</div>
          <div class="align-center">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="g_item" @click="handleInvite">
          <div>邀请成员</div>
          <div class="align-center">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="g_item" @click="handleRemove">
          <div>踢出成员</div>
          <div class="align-center">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </el-dialog>
    <div class="g_list">
      <div class="g_item">
        <div class="label">群头像</div>
        <div>
          <!-- <el-image
            style="width: 40px; height: 40px"
            :src="photoUrl + group.is_photo"
          ></el-image> -->
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatar"
          >
            <img
              v-if="group.is_photo"
              style="width: 40px; height: 40px"
              :src="group.is_photo"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
      <div class="g_item" @click="showChangeGroupName = true">
        <div>群昵称</div>
        <div class="align-center">
          <span class="text-hidden">{{ group.name }}</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="g_item" @click="copyText(group.id)">
        <div>群ID（点击复制）</div>
        <div class="align-center">
          <span class="text-hidden">{{ group.id }}</span>
        </div>
      </div>
      <div class="g_item" @click="showChangeNickName = true">
        <div>我在本群的昵称</div>
        <div class="align-center">
          <span class="text-hidden">{{ info.my_nickname }}</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="group_space"></div>
      <div v-if="info.is_action == 0" class="g_item">
        <div>群公告</div>
        <div class="align-center">
          <span class="text-hidden">{{ group.notice }}</span>
        </div>
      </div>
      <div v-else class="g_item" @click="showChangeNotice = true">
        <div>群公告</div>
        <div class="align-center">
          <span class="text-hidden">{{ group.notice }}</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div v-if="info.is_action>0" class="g_item" @click="showChangeManage = true">
        <div>群管理</div>
        <div class="align-center">
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="group_space"></div>
      <div class="g_item">
        <div>置顶聊天</div>
        <div class="align-center">
          <el-switch v-model="info.top" @change="changeTop"> </el-switch>
        </div>
      </div>
      <div class="g_item">
        <div>消息免打扰</div>
        <div class="align-center">
          <el-switch v-model="info.is_disturb" @change="changeDisturb">
          </el-switch>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  getChatDetails,
  msgDisturb,
  chatTop,
  setGroupData,
  saveGroupNickName,
  groupPhoto,
  upGroupPhoto,
  groupIsMsg,
  editChange
} from '@/api';
const { photoUrl } = window.__gconf;
export default {
  props: {
    list_id: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      dialogVisible: false,
      info: {}, //总信息
      group: {}, //群信息
      photoUrl: photoUrl,
      showChangeGroupName: false, //显示修改群昵称
      showChangeNickName: false, //显示我在本群的昵称
      showChangeNotice: false, //显示修改公告
      showChangeManage: false //显示群管理
    };
  },
  watch: {},
  mounted () {},
  methods: {
    // 设置群管理
    handleSetManage () {
      this.$emit('setmanage');
    },
    // 转让群主
    handleTrans () {
      this.$emit('trans');
    },
    //   邀请新成员
    handleInvite () {
      this.$emit('invite');
    },
    // 踢出成员
    handleRemove () {
      this.$emit('remove');
    },
    //   判断权限
    hasPerm () {
      if (!this.info.is_action && this.info.is_action != 2) {
        return false;
      } else {
        return true;
      }
    },
    //   设置群头像
    handleAvatar (file, list) {
      //   if (!this.hasPerm()) {
      //     this.$message.error("没有权限设置");
      //     return;
      //   }
      groupPhoto({
        _token: localStorage.getItem('token'),
        list_id: this.list_id,
        file: file.raw
      }).then((res) => {
        upGroupPhoto({
          _token: localStorage.getItem('token'),
          list_id: this.list_id
        }).then((data) => {
          let url = window.URL || window.webkitURL;
          console.log(data);
          this.group.is_photo = url.createObjectURL(file.raw);
          this.$emit('changeGroupName');
        });
      });
    },
    saveNotice () {
      if (!this.hasPerm()) {
        this.$message.error('没有权限设置');
        return;
      }
      setGroupData({
        list_id: this.list_id,
        type: 'notice',
        content: this.group.notice
      }).then((res) => {
        this.showChangeNotice = false;
        this.$emit('changeGroupName');
      });
    },
    saveNickName () {
      saveGroupNickName({
        nickname: this.info.my_nickname,
        list_id: this.list_id
      }).then((res) => {
        this.showChangeNickName = false;
        this.$emit('changeGroupName');
      });
    },
    saveGroupName () {
      //   if (!this.hasPerm()) {
      //     this.$message.error("没有权限设置");
      //     return;
      //   }
      setGroupData({
        list_id: this.list_id,
        type: 'name',
        content: this.group.name
      }).then((res) => {
        this.showChangeGroupName = false;
        this.$emit('changeGroupName');
      });
    },
    copyText (str) {
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.$message.success('复制成功');
    },
    changeTop (e) {
      console.log('e', e);
      chatTop({
        list_id: this.list_id,
        value: e ? 1 : 0
      }).then((res) => {
        this.info.top = e;
        this.$message.success('切换成功');
        this.$emit('changeGroupName');
      });
    },
    changeAddFriend (e) {
      console.log("e",e);
      editChange({
        list_id: this.list_id,
        value: e ? 1 : 0
      })
        .then((res) => {
          console.log("res",res);
          this.group.can_add_friend = e;
          this.$forceUpdate();
          this.$message.success('切换成功');
        })
        .catch((err) => {
          console.log('err', err);
          this.group.can_add_friend = !this.group.can_add_friend;
          this.$forceUpdate();
        });
    },
    changeIsMsg (e) {
      groupIsMsg({
        list_id: this.list_id,
        value: e ? 1 : 0
      })
        .then((res) => {
          this.group.is_msg = e;
          this.$forceUpdate();
          this.$message.success('切换成功');
        })
        .catch((err) => {
          console.log('err', err);
          this.$forceUpdate();
          this.group.is_msg = !this.group.is_msg;
        });
    },
    changeDisturb (e) {
      msgDisturb({
        list_id: this.list_id,
        value: e ? 1 : 0
      }).then((res) => {
        this.info.is_disturb = e;
        this.$forceUpdate();
        this.$message.success('切换成功');
      });
    },
    open () {
      this.dialogVisible = true;
    },
    getInfo (list_id) {
      getChatDetails({
        list_id: list_id
      }).then((res) => {
        this.info = res.data;
        this.info.is_disturb = Boolean(this.info.is_disturb);
        this.info.top = Boolean(this.info.top);
        this.group = this.info.group;
        this.group.can_add_friend = Boolean(this.group.can_add_friend);
        this.group.is_msg = Boolean(this.group.is_msg);

        this.group.is_photo =
          this.photoUrl + this.group.is_photo + '?_=' + Math.random();
        console.log('this.group', this.info);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.group_space {
  height: 10px;
  background: #eee;
}
.align-center {
  display: flex;
  align-items: center;
  height: 100%;
}
.text-hidden {
  width: 200px; //固定宽度
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  text-align: right;
}
.g_list {
  display: flex;
  flex-direction: column;
  .g_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 44px;
    cursor: pointer;
    box-sizing: border-box;
    padding: 0 20px;
  }
}
</style>
<style>
.group_manage .el-dialog__body {
  padding: 0 !important;
}
</style>
