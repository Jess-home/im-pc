<template>
  <div class="col-page">
    <div class="col-header">{{$t('quan_bu_shou_cang')}}</div>
    <div class="col-list">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="col-item"
      >
        <i
          class="el-icon-delete"
          :title="$t('dian_ji_shan_chu_shou_cang')"
          @click.stop="handleDelete(item)"
        ></i>
        <div
          class="col-item_content"
          :title="$t('dian_ji_zhuan_fa_shou_cang')"
          @click.stop="handleShare(item)"
        >
          <span v-if="item.type == 0">{{ item.content.text }}</span>
          <span v-if="item.type == 1">{{ item.content.text }}</span>
          <img
            v-if="item.type == 2"
            width="166"
            :src="chatUrl + item.list_id + '/' + item.content.url"
            alt=""
          >
        </div>
        <div class="col-item_com">
          <span class="col-item_user">{{ item.user_info.nickname }}</span>
          <span class="col-item_time">{{ item.time }}</span>
        </div>
      </div>
    </div>
    <selectUser
      ref="selectUser"
      :title="$t('xiao_xi_zhuan_fa')"
      :tip="$t('fen_bie_zhuan_fa_gei')"
      @handleOk="handleOk"
    ></selectUser>
  </div>
</template>

<script>
import { getUserStore, deleteStore, textMsgs } from '@/api'
import { mapActions } from 'vuex'
import selectUser from '@/components/selectUser'
const { chatUrl } = window.__gconf
export default {
  components: {
    selectUser
  },
  data () {
    return {
      list: [],
      chatUrl: chatUrl,
      currentRow: {}
    }
  },
  created () {
    this.getList()
  },
  methods: {
    ...mapActions([
      'fetchCharList'
    ]),
    getList () {
      getUserStore().then(res => {
        console.log(res)
        this.list = res.data.data
      })
    },
    handleDelete (item) {
      deleteStore({
        id: item.id
      }).then(res => {
        this.$message.success(this.$t('shan_chu_cheng_gong'))
        this.getList()
      })
    },
    handleShare (item) {
      this.currentRow = {
        ...item
      }
      this.$refs.selectUser.open()
    },
    handleOk (data) {
      textMsgs({
        list_ids: data.filter(item => item.list_id).map(item => {
          return item.list_id
        }).join(),
        content_type: this.currentRow.msgItem_type,
        content: JSON.stringify(this.currentRow.content)
      }).then(res => {
        this.$message.success(this.$t('zhuan_fa_cheng_gong'))
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
    padding: 0 40px 16px;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    .col-item {
      padding: 16px 0;
      width: 100%;
      border-bottom: 1px solid #e6e6e6;
      position: relative;
      i {
        position: absolute;
        right: 0;
        color: #adaeaf;
        cursor: pointer;
      }
      &_content {
        margin-bottom: 14px;
        cursor: pointer;
      }
      &_com {
        display: flex;
        justify-content: center;
      }
      &_user {
        flex: 1;
      }
    }
  }
}
</style>
