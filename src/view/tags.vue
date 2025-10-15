<template>
  <div class="content">
    <div class="friend-wrapper">
      <search></search>
      <tagslist
      ></tagslist>
    </div>
    <div class="friendinfo">
      <tag></tag>
    </div>
  </div>
</template>

<script>
import search from '@/components/search/search'
import tagslist from '@/components/tagslist/tagslist'
import tag from '@/components/tagslist/tag'
import { mapActions } from 'vuex'
export default {
  components: {
    search,
    tagslist,
    tag,
  },
  data () {
    return {
      list: []
    }
  },
  mounted() {
    this.fetchTagsList();
  },
  methods: {
    ...mapActions([
      'fetchTagsList'
    ]),
    refreshFriend(){
      
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
    box-shadow 3px 0 8px -4px rgba(0,0,0,.1)
  .friendinfo
    // width 550px
    width calc(100vh - 310px)
    flex 1
</style>
