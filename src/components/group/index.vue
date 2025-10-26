<template>
  <div class="col-page">
    <div class="col-header">{{$t('qun_liao')}}</div>
    <div class="col-list">
      <template v-if="info">
        <div
          v-for="(item, index) in info.member"
          :key="index"
          class="col-item"
        >
          <img
            class="avatar"
            width="50"
            height="50"
            :src="photoUrl + item.photo"
          >
          <div class="col-item_name">{{ item.show_name }}</div>
        </div>
      </template>
    </div>
    <div class="option">
      <div
        class="send"
        @click.stop="send"
      >
        <span>发消息</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getChatDetails } from '@/api'
const { photoUrl } = window.__gconf
export default {
  props: {
    item: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      photoUrl: photoUrl,
      info: null
    }
  },
  computed: {
  },
  watch: {
    'item.list_id': {
      handler: function (a) {
        getChatDetails({
          list_id: this.item.list_id
        }).then(res => {
          this.info = res.data
        })
      }
    }
  },
  created () {
    getChatDetails({
      list_id: this.item.list_id
    }).then(res => {
      console.log(res)
      this.info = res.data
    })
  },
  methods: {
    ...mapActions([
      'selectSession'
    ]),
    send () {
      this.selectSession(this.info.group.list_id)
      this.$router.push({
        path: '/chat'
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
    height: 60px;
    padding: 28px 0 0 30px;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;
  }
  .col-list {
    margin: 0 100px 16px;
    flex: 1;
    flex-wrap: wrap;
    box-sizing: border-box;
    display: flex;
    .col-item {
      box-sizing: border-box;
      padding: 16px 4px;
      width: 25%;
      height: 120px;
      position: relative;
      justify-content: center;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      &_name {
        max-width: 100%;
        font-size: 12px;
        margin-top: 12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .option {
    height: 200px;
  }
}
</style>
<style lang="stylus" scoped>
.option
  display flex
  justify-content center
  align-items center
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
  &:hover
    background rgb(18, 150, 17)
</style>


