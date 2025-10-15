<!-- 好友列表 -->
<template>
  <div class="friendlist">
    <div class="line-num">
      <span class="line-num-item"></span>
      <span>{{searchedTagslist.length }}个标签</span>
      <span class="line-num-item"></span>
    </div>
   
    <ul>
      <li
        v-for="(item,index) in searchedTagslist"
        :key="index"
        class="frienditem"
        :class="{ noborder: !item.initial}"
      >
        <div
          class="friend-info"
          :class="{ active: item.id === selectTagId }"
          @contextmenu.prevent="(e) => handleSet(e, item)"
          @click="handleSelectTag(item)"
        >
          <div class="name">{{item.name}}</div>
          <div class="remark">({{ item.num }})人</div>
        </div>
      </li>
    </ul>
    <div v-show="menuVisible" id="contextmenu" class="menu">
      <div class="contextmenu__item" @click="handleDelTag">删除标签</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { delTags } from '@/api'
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
      photoUrl: photoUrl,
      menuVisible: false,//右键拟态框
      currentRow:{},//右键选中的列表
    }
  },
  computed: {
    ...mapState([
      'searchText',
      'user',
      'selectTagId'
    ]),
    ...mapGetters([
      'searchedTagslist',
    ]),
    
  },
  methods: {
    ...mapActions(['fetchTagsList']),
    handleSelectTag(item) {
      this.menuVisible = false;
      this.$store.state.selectTagId = item.id;
    },
    handleSet (event, item) {
      console.log(item);
      this.menuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.menuVisible = true; // 显示模态窗口，跳出自定义菜单栏
      event.preventDefault(); //关闭浏览器右键默认事件
      this.currentRow = {
        ...item,
      };
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
    // 删除标签
    handleDelTag() {
      this.menuVisible = false;
      delTags({
        id:this.currentRow.id,
      }).then(res => {
        this.$message.success("删除成功");
        this.fetchTagsList();
      })
    },
  }
}
</script>

<style lang="stylus" scoped>
.contextmenu__item {
  display: block;
  line-height: 34px;
  text-align: center;
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
  justify-content space-between
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
    color #999
    text-align right
  .name
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
