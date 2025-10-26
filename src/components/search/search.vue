<!-- 搜索框 -->
<template>
  <div class="wrapper">
    <div class="search-wrapper">
      <i
        v-show="noText"
        class="el-icon-search"
        style="color:#ccc"
      ></i>
      <input
        v-model="search"
        type="text"
        class="searchInput"
        :placeholder="$t('sou_suo')"
        @keyup="change"
      >
      <!-- <div
        v-show="haveText"
        class="searchInput-delete"
        @click="del"
      ></div> -->
      <div v-show="haveText" class="searchInput-delete1" @click="del">
        <i style="color:#ccc"  class="el-icon-close "></i>
      </div>
    </div>

    <el-dropdown @command="handleCommand" >
      <div
        class="add-wrapper"
        :title="$t('fa_qi_qun_liao')"
      >
        <i class="el-icon-circle-plus-outline"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="b" class="drop-item">
          <i style="font-size:22px" class="iconfont iconIMweb_group"></i>
          <span>{{$t('chuang_jian_qun_liao')}}</span>
        </el-dropdown-item>
        <el-dropdown-item command="a" class="drop-item">
          <i style="font-size:22px" class="iconfont iconIMweb_addfriends"></i>
          <span>{{$t('tian_jia_hao_you')}}</span>
        </el-dropdown-item>
        <el-dropdown-item command="c" class="drop-item">
          <i style="font-size:22px" class="iconfont iconIMweb_group"></i>
          <span>{{$t('qun_fa_xiao_xi')}}</span>
        </el-dropdown-item>
        <!-- <el-dropdown-item command="d" class="drop-item">
          <i style="font-size:22px" class="iconfont iconIMweb_addfriends"></i>
          <span>{{$t('xin_jian_biao_qian')}}</span>
        </el-dropdown-item> -->
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog
      :title="$t('tian_jia_hao_you')"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <div class="add-modal">
        <el-input
          v-model="input"
          :placeholder="$t('qing_shu_ru_nei_rong')"
          @input="handleSearch"
        ></el-input>
        <el-empty
          v-if="list.length == 0"
          :description="$t('zan_wu_sou_suo_jie_guo')"
        ></el-empty>
        <div
          v-else
          class="userList"
        >
          <div
            v-for="(item, index) in list"
            :key="index"
            class="user-item"
          >
            <img
              class="avatar"
              width="40"
              height="40"
              :src="photoUrl + item.photo"
            >
            <div class="user-item_name">{{ item.nickname }}</div>
            <div
              class="user-item_add"
              @click="add(item)"
            >{{$t('tian_jia_wei_hao_you')}}</div>
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">{{$t('qu_xiao')}}</el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >{{$t('que_ding')}}</el-button>
      </span>
    </el-dialog>
    <selectUser
      ref="selectUser"
      :title="$t('fa_qi_qun_liao')"
      tip=""
      @handleOk="handleOk"
    ></selectUser>
    <selectUserGroup
      ref="selectUserGroup"
      :title="$t('qun_fa_xiao_xi')"
      tip=""
    ></selectUserGroup>
    <selectUserTag
      ref="selectUserTag"
      :title="$t('tian_jia_biao_qian')"
      tip=""
    ></selectUserTag>
  </div>
</template>

<script>
import { searchUser, friendAdd, addGroup,addTags } from '@/api'
import selectUser from '@/components/selectUser'
import selectUserGroup from '@/components/selectUserGroup'
import selectUserTag from '@/components/selectUserTag'
import { mapState, mapActions } from 'vuex'
const { photoUrl } = window.__gconf
export default {
  components: {
    selectUser,
    selectUserGroup,
    selectUserTag
  },
  data () {
    return {
      search: '',
      dialogVisible: false,
      active: false,
      input: '',
      list: [],
      photoUrl: photoUrl
    }
  },
  computed: {
    ...mapState([
      'selectId'
    ]),
    noText () {
      if (this.search === '') return true
      return false
    },
    haveText () {
      if (this.search === '') return false
      return true
    }
  },
  methods: {
    ...mapActions([
      'fetchCharList',
      'fetchTagsList'
    ]),
    handleOk (data) {
      addGroup({
        users: JSON.stringify(data.map(item => {
          return item.user_id
        })),
        list_id: 0
      }).then(() => {
        this.fetchCharList(this.selectId || '')
      })
    },
    handleCommand (command) {
      console.log(command)
      if (command == 'a') {
        this.handleOpen();
        return
      }
      if (command == 'b') {
        // this.handleOpen()
        this.$refs.selectUser.open();
        return
      }
      if (command == 'c') {
        this.$refs.selectUserGroup.open();
        return
        console.log(999)
      }
      if (command == 'd') {
        this.$refs.selectUserTag.open();
        return
        console.log(999)
      }
    },
    handleOpen () {
      this.list = []
      this.input = ''
      this.dialogVisible = true
    },
    change () {
      this.$store.dispatch('search', this.search)
    },
    handleSearch () {
      if (!this.input) return
      searchUser({
        val: this.input
      }).then(res => {
        this.list = res.data.data
      })
    },
    del () {
      this.search = ''
      this.change()
    },
    add (item) {
      this.$prompt(this.$t('ni_xu_yao_fa_song_yan_zheng_shen_qing_,_deng_dui_fang_tong_guo'), this.$t('peng_you_yan_zheng'), {
        confirmButtonText: this.$t('que_ding'),
        cancelButtonText: this.$t('qu_xiao')
      }).then(({ value }) => {
        friendAdd({
          user_id: item.id,
          is_type: 0,
          content: value
        }).then(res => {
          this.$message.success(this.$t('shen_qing_cheng_gong'))
          this.dialogVisible = false
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.drop-item
  display flex
  align-items center
.userList
  height 240px
  padding 10px 0
  overflow-y auto
  margin-top 20px
  border-top 1px solid #eee
  .user-item
    margin-bottom 10px
    display flex
    justify-content center
    align-items center
    padding 10px
    border-bottom 1px solid #eee
    &_name
      flex 1
      margin 0 12px
    &_add
      cursor pointer
      color #66b1ff
.wrapper
  padding 12px 12px 12px 12px
  display flex
  background-color #fff
  .add-wrapper
    cursor pointer
    width 28px
    height 28px
    border-radius 4px
    font-size 22px
    display flex
    justify-content center
    align-items center
.search-wrapper
  margin-right 12px
  flex 1
  width calc(100% - 44px)
  position relative
  box-sizing border-box
  height 32px
  border none
  background-color #f6f6f6
  border-radius 14px
  display flex
  align-items center
  overflow hidden
  padding-left 8px
  .searchInput
    flex 1
    width calc(100% - 28px)
    font-size 12px
    padding 6px
    outline none
    border none
    background #f6f6f6
  .icon-search
    display inline-block
    width 28px
    height 28px
    font-size 14px
    line-height 28px
    text-align center
  .searchInput-delete
    display block
    position absolute
    outline none
    top 0
    right 0
    width 24px
    height 100%
    background-image url('delete.png')
    background-size 26px
    background-position center
    background-repeat no-repeat
    cursor pointer
  .searchInput-delete1
    display block
    position absolute
    outline none
    top 0
    right 0
    width 24px
    height 100%
    display flex
    justify-content center
    align-items center
    cursor pointer
</style>
