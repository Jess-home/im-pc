<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="600px">
    <div class="select-content">
      <div class="select-content-left">
        <div class="select-content-header">
          <el-input
            v-model="search"
            :placeholder="$t('sou_suo')"
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
		  <el-button  size='mini' type="primary" @click="handleCheckquan">{{$t('quan_xuan')}}/{{$t('qu_xiao')}}</el-button>
          <span>{{
            selectedList.length == 0
              ? $t('wei_xuan_ze')
              : `${$t('yi_xuan_ze')}${selectedList.length}${$t('ge')}`
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
      <el-button @click="dialogVisible = false">{{$t('qu_xiao')}}</el-button>
      <el-button type="primary" @click="handleSend">{{$t('que_ding')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getFriendList } from '@/api';
import { mapState } from 'vuex';
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
      photoUrl: photoUrl
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
    handleCheck (data) {
      if (this.default.includes(data.user_id)) {
        this.$message.warning(this.$t('gai_yong_hu_yi_bei_yao_qing'));
        return;
      }
      if (
        !this.multiple &&
        !this.list.every(
          (item) => !(item.user_id != data.user_id && item.isSelect)
        )
      ) {
        this.$message.warning(this.$t('jin_neng_fen_xiang_dan_ge_yong_hu'));
        return;
      }
      this.list.forEach((item, index) => {
        if (item.user_id == data.user_id) {
          this.$set(this.list[index], 'isSelect', !this.list[index].isSelect);
        }
      });
    },
	
	handleCheckquan (data) {
	  if (this.default.includes(data.user_id)) {
	    this.$message.warning(this.$t('gai_yong_hu_yi_bei_yao_qing'));
	    return;
	  }
	  if (!this.multiple && !this.list.every((item) => !(item.user_id != data.user_id && item.isSelect))) {
	    this.$message.warning(this.$t('jin_neng_fen_xiang_dan_ge_yong_hu'));
	    return;
	  }
	  this.list.forEach((item, index) => {
	    if (item.user_id == data.user_id) {
	      
	    }
		this.$set(this.list[index], 'isSelect', !this.list[index].isSelect);
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
