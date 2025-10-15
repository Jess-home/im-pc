<template>
  <div class="col-page">
    <div class="col-header">新的朋友</div>
    <div class="col-list">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="col-item"
      >
        <img
          class="avatar"
          width="50"
          height="50"
          :src="photoUrl + item.photo"
        >
        <div class="col-item_content">
          <div class="col-item_name">{{ item.nickname }}</div>
          <div class="col-item_desc">{{ item.content }}&nbsp</div>
        </div>
        <div
          v-if="item.text != '已添加'"
          class="col-item_add"
          @click="add(item)"
        >同意</div>
        <div
          v-else
          class="col-item_added"
        >已添加</div>
      </div>
    </div>
  </div>
</template>

<script>
import { applyFriend, friendAddAction, fetchUserInfo } from '@/api'
import { mapActions } from 'vuex'
const { photoUrl } = window.__gconf
export default {
  data () {
    return {
      list: [],
      photoUrl: photoUrl
    }
  },
  created () {
    this.getList()
  },
  methods: {
    ...mapActions([
      'fetchFriendList'
    ]),
    getList () {
      applyFriend().then(res => {
        this.list = res.data
        this.$store.dispatch('updataUser', {
          ...this.$store.state.user,
          new_friend_tips_num: 0
        })
      })
    },
    add (item) {
      friendAddAction({
        apply_id: item.id
      }).then(res => {
        this.$message.success('添加成功')
        this.getList()
        this.fetchFriendList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.col-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  .col-header {
    height: 56px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
  }
  .col-list {
    padding: 0 20px 16px;
    flex: 1;
    background:#f3f3f3;
    overflow-y: auto;
    overflow-x: hidden;
    .col-item {
      display: flex;
      padding: 16px 0;
      width: 100%;
      border-bottom: 1px solid #e6e6e6;
      position: relative;
      justify-content: center;
      align-items: center;
      &_name {
        margin-bottom: 10px;
      }
      &_content {
        flex: 1;
        margin: 0 16px;
      }
      &_desc {
        opacity: 0.5;
        font-size: 12px;
        max-width: 150px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &_add {
        color: #66b1ff;
        font-size: 13px;
        cursor: pointer;
      }
      &_added {
        font-size: 13px;
        opacity: 0.5;
      }
    }
  }
}
</style>
