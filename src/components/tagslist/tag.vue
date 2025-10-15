<template>
    <div class="container">
        <div class="tag-list">
            <div class="tag-item">
                <div class="tag" @click="editUserTag">
                    <i class="iconfont iconttubiao_addpeople"></i>
                </div>
                <span class="f12 mt10">添加</span>
            </div>
            <div class="tag-item">
                <div class="tag" @click="editUserTag">
                    <i class="iconfont iconttubiao_Less"></i>
                </div>
                <span class="f12 mt10">删除</span>
            </div>
            <div class="tag-item" v-for="(item,index) in userList" :key="index">
                <div class="tag">
                   <el-image style="width:36px;height:36px;" :src="photoUrl+item.photo"></el-image>
                </div>
                <span class="f12 mt10">{{item.nickname}}</span>
            </div>
        </div>
        <div class="label-box" v-if="getSelectTag.name">
            <div class="label-name">标签名称：</div>
            <div class="label-box">
                <span class="name">{{getSelectTag.name}}</span>
                <i class="iconfont iconttubiao_bianji edit" @click="openTag"></i>
            </div>
        </div>
        <el-dialog
            title="标签名称"
            :visible.sync="dialogVisible"
            top="30vh"
            width="30%">
            <div>
                <el-input show-word-limit type="text" showli size="mini" v-model="label_name" maxlength="30"/>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini"  @click="dialogVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="handleEditTag">确 定</el-button>
            </span>
        </el-dialog>
        <editUserTag
        ref="editusertag"
        @handleOk="handleEditUserTag"
        ></editUserTag>
    </div>
</template> 
<script>
const { photoUrl } = window.__gconf;
import { mapGetters, mapActions, mapState } from 'vuex';
import editUserTag from '@/components/editUserTag';
import { editTags } from '@/api';
export default {
    data() {
        return {
            photoUrl: photoUrl,
            dialogVisible: false,
            label_name:'',//编辑标签名字
        }
    },
    components: {
        editUserTag
    },
    computed: {
        ...mapGetters(['getSelectTag']),
        ...mapState(['selectTagId']),
        userList() {
            console.log("this.getSelectTag", this.getSelectTag);
            if (this.getSelectTag && this.getSelectTag.user_list && this.getSelectTag.user_list.length) {
                return this.getSelectTag.user_list;
            } else {
                return [];
            }
        },
    },
    methods: {
        ...mapActions(['fetchTagsList']),
        openTag() {
            this.label_name = this.getSelectTag.name;
            this.dialogVisible = true;
        },
        // 编辑标签名字
        handleEditTag() {
            this.dialogVisible = false;
            let user_ids = this.getSelectTag.user_ids;
            user_ids = user_ids.split(",");
            editTags({
                id: this.selectTagId,
                name: this.label_name,
                user_ids:user_ids,
            }).then(res => {
                if (res.code == 0) {
                    this.$message.success(res.msg);
                } else {
                    this.$message.error(res.msg);
                }
                this.fetchTagsList();
            })
        },
        // 打开编辑标签成员
        editUserTag() {
            let user_ids = this.getSelectTag.user_ids;
            user_ids = user_ids.split(",");
            this.$refs.editusertag.open(user_ids);
        },
        handleEditUserTag(user_ids) {
             editTags({
                id: this.selectTagId,
                name: this.getSelectTag.name,
                user_ids:user_ids,
            }).then(res => {
                if (res.code == 0) {
                    this.$message.success(res.msg);
                } else {
                    this.$message.error(res.msg);
                }
                this.fetchTagsList();
            })
        },
    },
}
</script>
<style scoped lang="less">
.dialog-footer{
    width: 100%;
    display: flex;
    justify-content: space-around;
}
.label-box{
    display: flex;
    align-items: center;
    height: 60px;
    .name{
        font-size: 14px;
        color:#333;
    }
    i{
        font-size: 20px;
        color: #428dfc;
        cursor: pointer;
    }
    .label-name{
        font-size: 14px;
        color:#999;
        margin:0 20px;
    }
}
.f12{
    font-size: 12px;
}
.mt10{
    margin-top: 10px;
}
.mt20{
    margin-top: 20px;
}
.tag-list{
    display: flex;
    flex-wrap: wrap;
    .tag-item{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin:10px 20px;
        .tag{
            width: 36px;
            height: 36px;
            display: flex;
            justify-content: center;
            align-items: center;
            background:#eee;
            cursor: pointer;
        }
    }
}
.container{
    padding: 20px;
    box-sizing: border-box;
}
</style>