<template>
  <el-dialog :title="title" top="5vh" :visible.sync="dialogVisible" width="600px">
    <div class="select-content">
      <div class="select-content-left">
        <div class="select-content-header">
          <el-input
            v-model="search"
            :placeholder="$t('sou_suo')"
            size="mini"
            prefix-icon="el-icon-search"
          ></el-input>
          <el-button type="primary" style="margin:0 10px" @click="selectAll" size="mini">{{$t('quan_xuan')}}/{{$t('fan_xuan')}}</el-button>
        </div>
        <div class="select-content-wrapper">
          <div
            v-for="(item, index) in selectList"
            :key="index"
            class="select-item"
            @click.stop.prevent="handleCheck(item)"
          >
            <img
              class="avatar"
              width="40"
              height="40"
              :src="photoUrl + item.photo_path"
            />
            <div class="select-item_name">{{ item.show_name }}</div>
            <el-checkbox
              v-model="item.isSelect"
              class="select-item_checkbox"
            ></el-checkbox>
          </div>
        </div>
      </div>
      <div class="select-content-right">
        <div class="select-content-header">
          <span class="flex">{{ tip }}</span>
          <span>{{
            selectedList.length == 0
              ? "未选择"
              : `已选择${selectedList.length}个`
          }}</span>
        </div>
        <div class="select-content-wrapper">
          <div
            v-for="(item, index) in selectedList"
            :key="index"
            class="select-item"
            @click.stop.prevent="handleCheck(item)"
          >
            <img
              class="avatar"
              width="40"
              height="40"
              :src="photoUrl + item.photo_path"
            />
            <div class="select-item_name">{{ item.show_name }}</div>
            <i class="el-icon-error"></i>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="custom-dialog-footer">
      <div style="width:100%;height:200px;">
        <vText :selectedList="selectedList" @send="hide"></vText>
      </div>
      <!-- <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSend">确 定</el-button> -->
    </span>
  </el-dialog>
</template>

<script>
import { getFriendList,getChatList,getMemberPhotos } from '@/api';
import { mapState,mapActions } from 'vuex';
const { photoUrl } = window.__gconf;
import vText from '@/components/vtext/text'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    tip: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  components: {
    vText
  },
  data () {
    return {
      list: [],
      dialogVisible: false,
      result: [],
      search: '',
      photoUrl: photoUrl,
      all_select: false,
    };
  },
  computed: {
    selectList () {
      return this.list.filter((item) => item.show_name.includes(this.search));
    },
    selectedList () {
      return this.list.filter((item) => item.isSelect);
    },
    selectedListId() {
      let arr = [];
      this.selectedList.forEach(item => {
        arr.push(item.list_id);
      })
      return arr.join(",");
    },
  },
  created () {
    this.getList();
  },
  methods: {
    ...mapActions([
      'fetchCharList'
    ]),
    hide() {
      this.dialogVisible = false;
      this.fetchCharList();
    },
    getMemberPhotos() {
      if (this.selectedList.length) {
        getMemberPhotos({
          list_id:this.selectedListId,
        }).then(res => {
          
        })
      }
    },
    selectAll() {
      this.list.map(item => {
        if (this.all_select) {
          item.isSelect = false;
        } else {
          item.isSelect = true;
        }
      })
      this.all_select = !this.all_select;
      // this.getMemberPhotos();
    },
    handleCheck (data) {
      if (this.default.includes(data.list_id)) {
        this.$message.warning(this.$t('gai_liao_tian_yi_bei_yao_qing'));
        return;
      }
      if (
        !this.multiple &&
        !this.list.every(
          (item) => !(item.list_id != data.list_id && item.isSelect)
        )
      ) {
        this.$message.warning(this.$t('jin_neng_fen_xiang_dan_ge_yong_hu'));
        return;
      }
      this.list.forEach((item, index) => {
        if (item.list_id == data.list_id) {
          this.$set(this.list[index], 'isSelect', !this.list[index].isSelect);
        }
      });
      // this.getMemberPhotos();
    },
    getList () {
      getChatList().then((res) => {
        console.log(this.$t('qun_fa_xiao_xi_lie_biao'), res);
        const data = res.data;
        let result = [];
        Object.keys(data).forEach((key) => {
          result = result.concat(data[key]);
        });
        this.list = result.map((item) => {
          return {
            ...item,
            isSelect: false
          };
        });
      });
    },
    open (list = []) {
      getChatList().then((res) => {
        const data = res.data;
        let result = [];
        Object.keys(data).forEach((key) => {
          result = result.concat(data[key]);
        });
        this.list = result.map((item) => {
          return {
            ...item,
            isSelect: false
          };
        });

        this.default = list;
        this.list.forEach((item) => {
          if (this.default.some((selectItem) => selectItem == item.user_id)) {
            item.isSelect = true;
          } else {
            item.isSelect = false;
          }
        });
        this.dialogVisible = true;
      });
    },
    handleSend () {
      if (this.selectedList.length == 0) {
        this.$message.warning(this.$t('qing_xuan_ze_ren_yuan'));
        return;
      }
      this.$emit('handleOk', this.selectedList);
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>

.select-content {
  width: 100%;
  display: flex;
  .select-content-left,
  .select-content-right {
    flex: 1;
    padding: 0 10px;
  }
  .select-content-left {
    border-right: 1px solid #eee;
  }
  &-header {
    // height: 40px;
    margin-bottom: 12px;
    display: flex;
    .flex {
      flex: 1;
    }
  }
  &-wrapper {
    height: 260px;
    overflow-y: auto;
  }
  .select-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border-radius: 6px;
    &:hover {
      background-color: #dcdcdc;
    }
    &_name {
      flex: 1;
      margin: 0 12px;
    }
    .el-icon-error {
      font-size: 16px;
    }
  }
}
</style>
<style>
.custom-dialog-footer .text1 .emoji{
  text-align: left!important;
}
</style>
