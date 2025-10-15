<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="600px">
    <div class="select-content">
      <div class="select-content-left">
        <div class="tag-box">
          <div>标签名称：</div>
          <div class="tag-input">
            <el-input size="mini" v-model="tag_name" placeholder="如家人、朋友等"></el-input>
          </div>
        </div>
        <div class="select-content-header">
          <el-input
            v-model="search"
            placeholder="搜索"
            size="mini"
            prefix-icon="el-icon-search"
          ></el-input>
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
              :src="photoUrl + item.photo"
            />
            <div class="select-item_name">{{ item.name }}</div>
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
              : `已选择${selectedList.length}个成员`
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
              :src="photoUrl + item.photo"
            />
            <div class="select-item_name">{{ item.name }}</div>
            <i class="el-icon-error"></i>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="handleSend">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getFriendList,addTags } from '@/api';
import { mapState,mapActions } from 'vuex';
const { photoUrl } = window.__gconf;
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
  data () {
    return {
      list: [],
      dialogVisible: false,
      result: [],
      search: '',
      photoUrl: photoUrl,
      tag_name:'',//标签名称
    };
  },
  computed: {
    selectList () {
      return this.list.filter((item) => item.name.includes(this.search));
    },
    selectedList () {
      return this.list.filter((item) => item.isSelect);
    }
  },
  created () {
    this.getList();
  },
  methods: {
    ...mapActions([
      'fetchTagsList'
    ]),
    handleCheck (data) {
      if (this.default.includes(data.user_id)) {
        this.$message.warning('该用户已被邀请');
        return;
      }
      if (
        !this.multiple &&
        !this.list.every(
          (item) => !(item.user_id != data.user_id && item.isSelect)
        )
      ) {
        this.$message.warning('仅能分享单个用户');
        return;
      }
      this.list.forEach((item, index) => {
        if (item.user_id == data.user_id) {
          this.$set(this.list[index], 'isSelect', !this.list[index].isSelect);
        }
      });
    },
    getList () {
      getFriendList().then((res) => {
        const data = res.data.data;
        let result = [];
        Object.keys(data).forEach((key) => {
          result = result.concat(data[key].data);
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
      getFriendList().then((res) => {
        const data = res.data.data;
        let result = [];
        Object.keys(data).forEach((key) => {
          result = result.concat(data[key].data);
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
        this.$message.warning('请选择人员');
        return;
      }
      if (!this.tag_name) {
        this.$message.warning('请输入标签');
        return;
      }
      let user_ids = [];
      this.selectedList.forEach(item => {
        user_ids.push(item.user_id)
      })
      this.handleAddTag( {
        name:this.tag_name,
        list:user_ids
      })
      this.dialogVisible = false;
    },
    // 添加标签
    handleAddTag(data) {
      console.log("data添加", data);
      addTags({
        name:data.name,
        user_ids:data.list,
      }).then(res => {
        console.log("res添加标签成功", res);
        if (res.code == 0) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
        this.fetchTagsList();
      })
    },
  }
};
</script>

<style lang="less" scoped>
.tag-box{
  display: flex;
  flex-direction: column;
  .tag-input{
    margin: 20px 0;
  }
}
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
