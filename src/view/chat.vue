<template>
  <div class="content">
    <div class="msglist">
      <search></search>
      <chatlist :type="type"></chatlist>
    </div>
    <div class="chatbox">
      <message></message>
      <v-text></v-text>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import search from '@/components/search/search'
import chatlist from '@/components/chatlist/chatlist'
import message from '@/components/message/message'
import vText from '@/components/text/text'
export default {
  name: 'chat',
  components: {
    search,
    chatlist,
    message,
    vText
  },
  data () {
    return {
      type:0,//默认是全部聊天0，1是群聊
    }
  },
  watch: {
    '$route': {
      handler(newval, oldval) {
        this.type = newval.query.type || 0;
        this.fetchFriendList();
      },
      immediate:true
    },
  },
  created () {
    
  },
  methods: {
    ...mapActions(['fetchFriendList'])
  },
}
</script>

<style lang="less" scoped>
.content {
  display: flex;
  .msglist {
    width: 250px;
    background: #fff;
    // box-shadow:6px 0 8px -10px ;
    box-shadow:4px 0 10px -4px rgba(0, 0, 0, .1);
  }
  .chatbox {
    border-left: 1px solid #eee;
    flex: 1;
  }
}
</style>
