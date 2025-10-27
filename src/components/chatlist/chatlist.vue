<!-- 聊天列表 -->
<template>
  <div class="msglist">
    <ul>
      <li class="line-box" v-if="type == 1">
        <span class="line"></span>
        <span class="group-num">{{ filterSearchedChatlist.length }}{{$t('ge_qun_liao')}}</span>
        <span class="line"></span>
      </li>
      <li v-for="(item, index) in  filterSearchedChatlist " :key="index" class="sessionlist"
        :class="{ active: item.list_id === selectId, isTop: item.top }" @contextmenu.prevent="(e) => handleSet(e, item)"
        @click="selectSession(item.list_id)">
        <div class="list-left">
          <img v-if="item.type == 0" class="avatar" width="40" height="40" :alt="item.user.name"
            :src="item.user.img + '?_=' + Math.random()" />
          <img v-if="item.type == 1" class="avatar" width="40" height="40" :alt="item.user.name"
            :src="item.user.img + '?_=' + Math.random()" />
          <!-- <ul
            v-if="item.type == 1"
            class="group-avatar"
          >
            <li
              v-for="(j, _index) in item.groupImgs"
              :key="_index"
            >
              <img
                v-if="_index < 4"
                width="20"
                height="20"
                :src="photoUrl + j.photo"
              >
            </li>
          </ul> -->
          <!-- <p v-if="item.unread > 0" class="unread">{{ item.unread }}</p> -->
        </div>
        <div class="list-right">
          <p class="name">
            {{ item.user.name }}
            <span v-if="item.type == 1">({{ item.groupImgs.length }})</span>
          </p>
          <div class="line-right">
            <p v-if="item.unread > 0" class="unread-right">{{ item.unread }}</p>
            <!-- TODO判断聊天列表是否在线 -->

            <span class="green-tip" v-if="item.type == 0 && item.online"></span>
            <span class="red-tip" v-if="item.type == 0 && !item.online"></span>
          </div>
          <div class="lastmsg" v-text="guolvehtml(filterContent(item.messages[item.messages.length - 1].content))">
          </div>

        </div>
        <div class="zhiding" v-if="item.top"></div>
        <div class="time">
          <span>{{ formatTime(item.messages[item.messages.length - 1].date)}}</span>
        </div>
      </li>
    </ul>
    <div v-show="menuVisible" id="contextmenu" class="menu">
      <div class="contextmenu__item" @click="handleSetting(1, !currentRow.top)">
        {{ currentRow.top ? $t('qu_xiao') : "" }}{{$t('zhi_ding')}}
      </div>
      <div class="contextmenu__item" @click="handleSetting(2, !currentRow.is_disturb)">
        {{ currentRow.is_disturb ? $t('da_kai_xin_xi_tong_zhi') : $t('guan_bi_xin_xi_tong_zhi') }}
      </div>
      <div class="contextmenu__item" @click="handleSetting(3)">{{$t('shan_chu_liao_tian')}}</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import {
  getChatList,
  getChatDetails,
  msgDisturb,
  chatTop,
  deleteChat
} from '@/api';
const { photoUrl } = window.__gconf;
export default {
  // ❌ 删除这里的 filters,因为 filters 中无法使用 this.$t
  // 改用 methods 来实现
  
  props: {
    type: 0
  },
  data() {
    return {
      menuVisible: false,
      currentRow: {},
      photoUrl: photoUrl,
      adddd: ""
    };
  },
  computed: {
    ...mapState(['selectId', 'searchText', 'chatlist']),
    ...mapGetters(['searchedChatlist']),
    filterSearchedChatlist() {
      let arr = [];
     
      if (this.type == 0) {
        arr = this.searchedChatlist;
        console.log(arr, 'arr')
      }
      if (this.type == 1) {
        this.searchedChatlist.map(item => {
          if (item.type == 1) {
            arr.push(item)
          }
        })
      }
      if (arr.length && !this.selectId) {
        this.selectSession(arr[0].list_id)
      }
      this.adddd = arr
      return arr;
    }
  },
  watch: {
    searchedChatlist(searchedChatlist) {
    }
  },
  created() {
    this.fetchCharList(this.selectId || '');
  },
  methods: {
    ...mapActions(['selectSession', 'selectSession1', 'fetchCharList']),
    ...mapMutations(['clearSelectId']),
    
    // ⭐ 新增: 将 filter 改为 method
    formatTime(timestamp) {
      timestamp = new Date(timestamp).valueOf() / 1000;
      let curTimestamp = parseInt(new Date().getTime() / 1000), //当前时间戳
        timestampDiff = curTimestamp - timestamp, // 参数时间戳与当前时间戳相差秒数
        curDate = new Date(curTimestamp * 1000), // 当前时间日期对象
        tmDate = new Date(timestamp * 1000), // 参数时间戳转换成的日期对象
        Y = tmDate.getFullYear(),
        m = tmDate.getMonth() + 1,
        d = tmDate.getDate(),
        H = tmDate.getHours(),
        i = tmDate.getMinutes(),
        s = tmDate.getSeconds();
      
      if (timestampDiff < 60) {
        // 一分钟以内
        return this.$t('gang_gang');
      } else if (timestampDiff < 3600) {
        // 一小时前之内
        return Math.floor(timestampDiff / 60) + this.$t('fen_zhong_qian');
      } else if (
        curDate.getFullYear() == Y &&
        curDate.getMonth() + 1 == m &&
        curDate.getDate() == d
      ) {
        return (
          this.$t('jin_tian') +
          ((String(H).length == 1 ? '0' : '') + H) +
          ':' +
          ((String(i).length == 1 ? '0' : '') + i)
        );
      } else {
        var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
        if (
          newDate.getFullYear() == Y &&
          newDate.getMonth() + 1 == m &&
          newDate.getDate() == d
        ) {
          return (
            this.$t('zuo_tian') +
            ((String(H).length == 1 ? '0' : '') + H) +
            ':' +
            ((String(i).length == 1 ? '0' : '') + i)
          );
        } else if (curDate.getFullYear() == Y) {
          return (
            (String(m).length == 1 ? '0' : '') +
            m +
            '/' +
            ((String(d).length == 1 ? '0' : '') + d) +
            ' ' +
            ((String(H).length == 1 ? '0' : '') + H) +
            ':' +
            ((String(i).length == 1 ? '0' : '') + i)
          );
        } else {
          return (
            Y +
            this.$t('nian') +
            ((String(m).length == 1 ? '0' : '') + m) +
            this.$t('yue') +
            ((String(d).length == 1 ? '0' : '') + d) +
            this.$t('ri') +
            ((String(H).length == 1 ? '0' : '') + H) +
            ':' +
            ((String(i).length == 1 ? '0' : '') + i)
          );
        }
      }
    },
    
    aaaaa() {
      var _this = this
      
      setInterval(function() {
        if (_this.adddd != undefined) {
          for (var i = 0; i < _this.adddd.length; i++) {
            if (_this.adddd[i]['type'] == 0) {
              console.log(1111)
              _this.selectSession1(_this.adddd[i], _this.adddd[i]['list_id'])
            }
          }
        }
      }, 1000);
    },
    
    guolvehtml(content) {
      var regex = /(<([^>]+)>)/ig;
      return content.replace(regex, "");
    },
    
    filterContent(content) {
      if (typeof content == 'string') {
        return content;
      } else if (typeof content == 'object') {
        if (content.url && this.isVideo(content.url)) {
          return this.$t('[_shi_pin_]');
        } else if (content.url && this.isFile(content.url)) {
          return this.$t('[_wen_jian_]');
        } else if (content.url && this.isImageFile(content.url)) {
          return this.$t('[_tu_pian_]');
        } else if (content.url || this.isImage(content.text)) {
          return this.$t('[_tu_pian_]');
        } else if (
          content.text &&
          typeof content.text == 'string' &&
          content.text.includes(this.$t('ming_pian'))
        ) {
          return this.$t('[_ming_pian_]');
        } else {
          return content.text;
        }
      }
    },
    
    // 判断视频
    isVideo(url) {
      if (url && url.indexOf('mp4') > -1) {
        return true
      } else {
        return false
      }
    },
    
    // 图片文件
    isImageFile(url) {
      if (url && (url.indexOf('jpg') > -1 || url.indexOf('png') > -1)) {
        return true
      } else {
        return false
      }
    },
    
    // 判断文件
    isFile(url) {
      if (url && (url.indexOf('pdf') > -1 || url.indexOf('ppt') > -1 || url.indexOf('zip') > -1 || url.indexOf('zip') > -1 || url.indexOf('apk') > -1 || url.indexOf('txt') > -1)) {
        return true
      } else {
        return false
      }
    },
    
    // 判断图片
    isImage(con) {
      // 如果是图片,则转换成图片
      let reg = /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i;
      if (reg.test(con) || con.indexOf('<img') > -1) {
        return true;
      } else {
        return false;
      }
    },
    
    handleSet(event, item) {
      console.log(item);
      getChatDetails({
        list_id: item.list_id
      }).then((res) => {
        this.menuVisible = false;
        this.menuVisible = true;
        event.preventDefault();
        this.currentRow = {
          ...item,
          ...res.data
        };
        var menu = document.querySelector('.menu');
        this.styleMenu(menu, event);
      });
    },
    
    foo() {
      this.menuVisible = false;
      document.removeEventListener('click', this.foo);
    },
    
    styleMenu(menu, event) {
      if (event.clientX > 1800) {
        menu.style.left = event.clientX - 100 + 'px';
      } else {
        menu.style.left = event.clientX + 1 + 'px';
      }
      document.addEventListener('click', this.foo);
      if (event.clientY > 700) {
        menu.style.top = event.clientY - 30 + 'px';
      } else {
        menu.style.top = event.clientY - 10 + 'px';
      }
    },
    
    handleSetting(type, value) {
      const data = {
        list_id: this.currentRow.list_id,
        value: value ? '1' : '0'
      };
      let fetchUrl;
      if (type == 1) {
        fetchUrl = chatTop;
      } else if (type == 2) {
        fetchUrl = msgDisturb;
      } else {
        fetchUrl = deleteChat;
      }
      fetchUrl(data).then((res) => {
        this.fetchCharList('');
        if (type == 3) {
          this.clearSelectId();
        }
      });
      this.fetchCharList(this.selectId || '');
    }
  }
};
</script>

<style lang="stylus" scoped>
.line-box
  display flex
  align-items center
  justify-content center
  height 40px
  .line
    height 1px
    width 50px
    background #bebebe
    margin 0 10px
    transform scaleY(0.5)
  .group-num
    font-size 12px
    color #bebebe
    
.list-left
 display flex
 align-items center
 flex-shrink 0
 flex 1
 width 40px
 height 40px
 box-sizing border-box
 img
  width 40px
  height 40px
.zhiding{
  position: absolute;
  top: 0;
  left: 0;
  border: 6px solid transparent;
  border-left: #4c94ff solid 6px;
  border-top: #4c94ff solid 6px;
  z-index: 10;
  border-top-left-radius: 4px;
}
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

.msglist {
  height: calc(100vh - 56px);
  overflow-y: auto;

  .sessionlist {
    cursor: pointer;
    position: relative;
    display: flex;
    padding: 10px;
    transition: background-color 0.1s;
    font-size: 0;

    &.isTop {
      background-color: rgb(223, 223, 223);
    }

    &:hover {
      background-color: #fbfbfb;
    }

    &.active {
      background-color: #edeff3;
    }

    .avatar {
      border-radius: 2px;
      margin-right: 10px;
    }

    .group-avatar {
      width: 42px;
      height: 42px;
      border-radius: 2px;
      margin-right: 12px;
    }

    .group-avatar li {
      border-radius: 2px;
      margin-right: 1px;
      margin-bottom: 1px;
      overflow: hidden;
      display: inline-block;
    }

    .unread {
      position: absolute;
      height: 16px;
      background-color: #FB7B7A;
      border-radius: 50px;
      color: rgb(225, 225, 225);
      font-size: 12px;
      top: 5px;
      right: 190px;
      z-index: 99;
      box-sizing: border-box;
      padding: 0 5px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .unread-right {
      height: 16px;
      background-color: #FB7B7A;
      border-radius: 50px;
      color: rgb(225, 225, 225);
      font-size: 12px;
      box-sizing: border-box;
      padding: 0 8px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .list-right {
      position: relative;
      flex-shrink: 0;
      width:180px;
      height: 40px;
    }

    .name {
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
      width:90px;//固定宽度
      overflow: hidden;
      text-overflow: ellipsis;
      height:20px;
      line-height 20px;
      white-space: nowrap;
    }
    .line-right{
      float: right;
      color: #999;
      font-size: 10px;
      vertical-align: top;
      display: flex;
      align-items: center;
      .green-tip{
          width: 10px;
          height: 10px;
          border-radius: 10px;
          z-index: 2;
          background-color:#67C23A;
          margin-left:6px;
      }
      .red-tip{
          width: 10px;
          height: 10px;
          border-radius: 10px;
          z-index: 2;
          background-color:#F56C6C;
          margin-left:6px;

      }
    }
    .time {
      position:absolute;
      right:10px;
      bottom:10px;
      // float: right;
      color: #999;
      font-size: 12px;
      height:20px;
      line-height:20px;
      vertical-align: top;
      display: flex;
      align-items: center;
    }

    .lastmsg {
      position: absolute;
      font-size: 12px;
      width: 100px;
      height: 20px;
      line-height: 20px;
      color: #999;
      bottom: 0px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
