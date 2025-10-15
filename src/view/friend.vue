<template>
  <div class="content">
    <div class="friend-wrapper">
      <search></search>
      <friendlist
        :type="type"
        @handleClick="handleClick"
      ></friendlist>
    </div>
    <div class="friendinfo">
      <applyList v-if="type == 1"></applyList>
	  <message v-if="type == 4"></message>
      <info v-show="type == 2" @refresh="refreshFriend"></info>
      <group
        v-if="type == 3"
        :item="item"
      ></group>
    </div>
  </div>
</template>

<script>
import search from '@/components/search/search'
import friendlist from '@/components/friendlist/friendlist'
import info from '@/components/info/info'
import applyList from '@/components/applyList'
import group from '@/components/group'
export default {
  components: {
    search,
    friendlist,
    info,
    group,
    applyList
  },
  data () {
    return {
      type: 0,
      item: null
    }
  },
  methods: {
    handleClick (type, item) {
      this.type = type
      if (type == 3) {
        this.item = item
      }
    },
    refreshFriend(){
      this.type = 0;
    }
  }
}
</script>

<style lang="stylus" scoped>
.content
  display flex
  width calc(100vw - 60px)
  .friend-wrapper
    width 250px
    background #fff
  .friendinfo
    // width 550px
    width calc(100vh - 310px)
    flex 1
</style>
