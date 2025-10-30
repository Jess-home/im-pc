<template>
  <el-dialog class="group_check" :title="title" :visible.sync="dialogVisible" width="400px">
  
    <el-checkbox-group v-model="member" :max="limit">
      <div v-for="(item,index) in members" :key="index" class="check-list">
        <div class="check-letter">{{ item.letter }}</div>
        <div v-for="(item_,index_) in item.data" :key="index_" class="check-item">
          <el-checkbox :label="item_.user_id">
          </el-checkbox>
          <el-image style="width: 40px; height: 40px;border-radius: 4px;margin:0 10px;" :src="photoUrl+item_.photo"></el-image>
          <div class="check-label">{{
            item_.name
          }}</div>
        </div>
      </div>
      
    </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveUser">{{$t('bao_cun')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getGroupAdmin } from '@/api';
const { photoUrl } = window.__gconf;
export default {
  props: {
    title: '',
    limit: '', //限制最多，如群主只能一个
    members: [] //成员
  },
  data () {
    return {
      dialogVisible: false,
      member: [],
      photoUrl: photoUrl
    };
  },
  watch: {
    // 当 members 数据更新时自动设置默认勾选
    members: {
      handler(newVal) {
        if (!Array.isArray(newVal)) return
        const checked = []
        newVal.forEach(group => {
          if (!group.data) return
          group.data.forEach(user => {
            // 如果 bai_status == 1，则选中
            if (user && user.bai_status === 1) {
              checked.push(user.user_id)
            }
          })
        })
        this.member = checked
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    open () {
      this.dialogVisible = true;
    },
    saveUser () {
      console.log('this.member', JSON.stringify(this.member));
      this.$emit('save', this.member);
      this.close();
    },
    close () {
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.check-letter{
  height: 30px;
  background: #eee;
  font-size: 14px;
  color: #666;
  line-height: 30px;
  box-sizing: border-box;
  padding: 0 10px;
}
.check-item{
  display: flex;
  height: 50px;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px;
  .check-label{
    width: 100px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    height: 50px;
    color: #333;
    font-size: 14px;
    line-height: 50px;
  }
}
</style>
<style>
.group_check .el-dialog__body {
  padding: 0 !important;
}
.group_check .el-checkbox__label{
  width: 30px;
}
</style>
