<!-- 好友列表 -->
<template>
  <div class="friendlist">
    <div
      class="friend-info static"
      :class="{ active: type == 1 }"
      @click="handleShowNew"
    >
      <img
        class="avatar"
        width="36"
        height="36"
        :src="img"
      >
      <div class="remark">{{$t('hao_you_qing_qiu')}}</div>
      <p
        v-if="user.new_friend_tips_num > 0"
        class="newFriend"
      >{{ user.new_friend_tips_num }}</p>
    </div>
    <div class="line-num">
      <span class="line-num-item"></span>
      <span>{{searchedFriendlist.length }}{{$t('ge_lian_xi_ren')}}</span>
      <span class="line-num-item"></span>
    </div>
    <ul>
      <li class="frienditem">
        <div
          v-for="(item,index) in list"
          :key="index"
          class="friend-info"
          :class="{ active: item.chat_id === selectId && type == 3 }"
          @click="handleShowGroup(item)"
        >
          <img
            class="avatar"
            width="36"
            height="36"
            :src="photoUrl + item.photo_path"
          >
          <div class="remark">{{ item.show_name }}</div>
        </div>
      </li>
    </ul>
    <ul>
      <li
        v-for="(item,index) in searchedFriendlist"
        :key="index"
        class="frienditem"
        :class="{ noborder: !item.initial}"
      >
        <div
          v-if="item.initial && (index == 0 || searchedFriendlist[index - 1].initial != item.initial)"
          class="list_title"
        >{{ item.initial }}</div>
        <div
          class="friend-info"
          :class="{ active: item.id === selectFriendId && type == 2 }"
          @contextmenu.prevent="(e) => handleSet(e, item)"
          @click="handleSelectFriend(item.id)"
        >
          <img
            class="avatar"
            width="36"
            height="36"
            :src="item.img"
          >
          <div class="remark">{{ item.remark }}</div>
        </div>
      </li>
    </ul>
    <div v-show="menuVisible" id="contextmenu" class="menu">
      <div class="contextmenu__item" @click="handleDel">{{$t('shan_chu_hao_you')}}</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getFriendList, getChatList,removeFriend } from '@/api'
import img from '@/assets/friend/newfriend.png'
const { photoUrl } = window.__gconf
export default {
  props: {
    type: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      img,
      list: [],
      selectId: null,
      photoUrl: photoUrl,

      currentRow: {},
      menuVisible:false,
      

    }
  },
  computed: {
    ...mapState([
      'selectFriendId',
      'searchText',
      'user'
    ]),
    ...mapGetters([
      'searchedFriendlist'
    ])
  },
  mounted () {
    this.fetchFriendList()
    this.handleShowNew();
    // getChatList({
    //   type: 1
    // }).then(res => {
    //   console.log(res)
    //   this.list = res.data
    // })
  },
  methods: {
    ...mapActions([
      'selectFriend',
      'fetchFriendList'
    ]),
    // 删除好友
    handleDel() {
      removeFriend({
        user_id: this.currentRow.id
      }).then(res=>{
        this.fetchFriendList();
        this.fetchCharList();
      })
    },
    handleSet (event, item) {
      console.log(item);
      this.menuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.menuVisible = true; // 显示模态窗口，跳出自定义菜单栏
      event.preventDefault(); //关闭浏览器右键默认事件
      this.currentRow = {
        ...item,
      };
      console.log("this.currentRow", this.currentRow);
      var menu = document.querySelector('.menu');
      this.styleMenu(menu, event);
    },
    styleMenu (menu, event) {
      if (event.clientX > 1800) {
        menu.style.left = event.clientX - 100 + 'px';
      } else {
        menu.style.left = event.clientX + 1 + 'px';
      }
      document.addEventListener('click', this.foo); // 给整个document新增监听鼠标事件，点击任何位置执行foo方法
      if (event.clientY > 700) {
        menu.style.top = event.clientY - 30 + 'px';
      } else {
        menu.style.top = event.clientY - 10 + 'px';
      }
    },
    foo () {
      // 取消鼠标监听事件 菜单栏
      this.menuVisible = false;
      document.removeEventListener('click', this.foo); // 关掉监听，
    },
    handleSelectFriend (id) {
      this.$emit('handleClick', 2)
      this.selectFriend(id)
    },
    handleShowNew () {
      this.$emit('handleClick', 1)
    },
    handleShowGroup (item) {
      this.selectId = item.chat_id
      this.$emit('handleClick', 3, item)
    }
  }
}
</script>

<style lang="stylus" scoped>
.contextmenu__item {
  display: block;
  line-height: 34px;
  text-align: center;
  cursor:pointer;
}

.contextmenu__item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.menu {
  position: absolute;
  background-color: #fff;
  width: 100px;
  /* height: 106px; */
  font-size: 12px;
  color: #444040;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  white-space: nowrap;
  z-index: 1000;
}

.contextmenu__item:hover {
  cursor: pointer;
  background: #eee;
  border-color: #eee;
}
.line-num 
  font-size 12px
  display flex
  justify-content center
  align-items center
  height 40px
  color #bebebe
  .line-num-item
    height 1px
    background #DEDEDE
    width 50px
    margin 0 4px
    transform scaleY(0.5)
.newFriend
  position absolute
  right 20px
  top 22px
  height 15px
  background-color #e10000
  border-radius 50px
  box-sizing border-box
  padding 0 7px
  color #e1e1e1
  font-size 14px
.friendlist
  height calc(100vh - 56px)
  overflow-y auto
  .frienditem
    // border-top 1px solid #dadada
    &:first-child, &.noborder
      border-top none
    .list_title
      box-sizing border-box
      width 100%
      font-size 12px
      padding 15px 0 3px 12px
      color #999
.friend-info
  display flex
  padding 12px
  transition background-color 0.1s
  cursor pointer
  font-size 0
  &:hover
    background-color #edeff3
  &.active
    background-color #edeff3
  .avatar
    border-radius 2px
    margin-right 12px
    img
     width 36px
     height 36px
     flex-shrink 0
  .remark
    font-size 14px
    line-height 36px
    width 150px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
.static
  // border-bottom 1px solid #dadada
  position relative
</style>
