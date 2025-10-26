<template>
  <el-dialog
    class="group_manage"
    :title="$t('qun_guan_li')"
    :visible.sync="dialogVisible"
    width="400px"
  >
    <!-- 群昵称 -->
    <el-dialog
      width="400px"
      :title="$t('qun_ni_cheng')"
      :visible.sync="showChangeGroupName"
      append-to-body
    >
      <el-input v-model="group.name" :placeholder="$t('qing_shu_ru_qun_ni_cheng')"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveGroupName">{{$t('bao_cun')}}</el-button>
      </span>
    </el-dialog>
    <!-- 我在本群的昵称 -->
    <el-dialog
      width="400px"
      :title="$t('wo_zai_ben_qun_de_ni_cheng')"
      :visible.sync="showChangeNickName"
      append-to-body
    >
      <el-input
        v-model="info.my_nickname"
        :placeholder="$t('qing_shu_ru_ni_zai_ben_qun_de_ni_cheng')"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveNickName">{{$t('bao_cun')}}</el-button>
      </span>
    </el-dialog>
    <!-- 群公告 -->
    <el-dialog
      width="400px"
      :title="$t('qun_gong_gao')"
      :visible.sync="showChangeNotice"
      append-to-body
    >
      <el-input
        v-model="group.notice"
        type="textarea"
        :rows="5"
        :placeholder="$t('qing_shu_ru_qun_gong_gao')"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveNotice">{{$t('bao_cun')}}</el-button>
      </span>
    </el-dialog>
    <!-- 群管理 -->
    <el-dialog
      width="400px"
      :title="$t('qun_guan_li')"
      class="group_manage"
      :visible.sync="showChangeManage"
      append-to-body
    >
      <div class="g_list">
        <div class="g_item">
          <div>{{$t('quan_yuan_jin_yan')}}</div>
          <div class="align-center">
            <el-switch v-model="group.is_msg" @change="changeIsMsg">
            </el-switch>
          </div>
        </div>
        <div class="g_item">
          <div>{{$t('qun_nei_jin_zhi_jia_hao_you')}}</div>
          <div class="align-center">
            <el-switch v-model="group.can_add_friend" @change="changeAddFriend">
            </el-switch>
          </div>
        </div>
        <div v-if="info.is_action == 2" class="g_item" @click="handleSetManage">
          <div>{{$t('she_zhi_guan_li_yuan')}}</div>
          <div class="align-center">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div v-if="info.is_action == 2" class="g_item" @click="handleTrans">
          <div>{{$t('qun_zhu_zhuan_rang')}}</div>
          <div class="align-center">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="g_item" @click="handleInvite">
          <div>{{$t('yao_qing_cheng_yuan')}}</div>
          <div class="align-center">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="g_item" @click="handleRemove">
          <div>{{$t('ti_chu_cheng_yuan')}}</div>
          <div class="align-center">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </el-dialog>
    <div class="g_list">
      <div class="g_item">
        <div class="label">{{$t('qun_tou_xiang')}}</div>
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
        <div>{{$t('qun_ni_cheng')}}</div>
        <div class="align-center">
          <span class="text-hidden">{{ group.name }}</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="g_item" @click="copyText(group.id)">
        <div>{{$t('qun_id_dian_ji_fu_zhi')}}</div>
        <div class="align-center">
          <span class="text-hidden">{{ group.id }}</span>
        </div>
      </div>
      <div class="g_item" @click="showChangeNickName = true">
        <div>{{$t('wo_zai_ben_qun_de_ni_cheng')}}</div>
        <div class="align-center">
          <span class="text-hidden">{{ info.my_nickname }}</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="group_space"></div>
      <div v-if="info.is_action == 0" class="g_item">
        <div>{{$t('qun_gong_gao')}}</div>
        <div class="align-center">
          <span class="text-hidden">{{ group.notice }}</span>
        </div>
      </div>
      <div v-else class="g_item" @click="showChangeNotice = true">
        <div>{{$t('qun_gong_gao')}}</div>
        <div class="align-center">
          <span class="text-hidden">{{ group.notice }}</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div v-if="info.is_action>0" class="g_item" @click="showChangeManage = true">
        <div>{{$t('qun_guan_li')}}</div>
        <div class="align-center">
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="group_space"></div>
      <div class="g_item">
        <div>{{$t('zhi_ding_liao_tian')}}</div>
        <div class="align-center">
          <el-switch v-model="info.top" @change="changeTop"> </el-switch>
        </div>
      </div>
      <div class="g_item">
        <div>{{$t('xiao_xi_mian_da_rao')}}</div>
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
        this.$message.error(this.$t('mei_you_quan_xian_she_zhi'));
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
      this.$message.success(this.$t('fu_zhi_cheng_gong'));
    },
    changeTop (e) {
      console.log('e', e);
      chatTop({
        list_id: this.list_id,
        value: e ? 1 : 0
      }).then((res) => {
        this.info.top = e;
        this.$message.success(this.$t('qie_huan_cheng_gong'));
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
          this.$message.success(this.$t('qie_huan_cheng_gong'));
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
          this.$message.success(this.$t('qie_huan_cheng_gong'));
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
        this.$message.success(this.$t('qie_huan_cheng_gong'));
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
