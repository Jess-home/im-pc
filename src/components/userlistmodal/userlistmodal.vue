<!-- 
  文件路径: src/components/UserListModal.vue
  这是组件代码,放在 components 文件夹中
-->

<template>
  <!-- 遮罩层和弹框 -->
  <div v-if="visible" class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
      <!-- 标题和关闭按钮 -->
      <div class="modal-header">
        <button class="close-btn" @click="handleClose">×</button>
      </div>

      <!-- 列表内容 -->
      <div class="modal-body">
        <div 
          v-for="item in list" 
          :key="item.id" 
          class="list-item"
        >
          <span class="name">{{ item.nickname }}</span>
          <span class="gender" :class="item.no_reader_num > 0 ? 'female' : 'male'">
            {{ item.no_reader_num > 0 ? '✖️' : '✅' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserListModal',
  props: {
    // 控制弹框显示隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 列表数据
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClose() {
      // 通知父组件关闭弹框
      this.$emit('update:visible', false);
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
/* 遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 弹框主体 */
.modal-content {
  background: white;
  border-radius: 8px;
  width: 500px;
  max-height: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

/* 弹框头部 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

/* 关闭按钮 */
.close-btn {
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  font-size: 28px;
  color: #909399;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #409eff;
}

/* 列表容器 */
.modal-body {
  padding: 20px;
  overflow-y: auto;
  max-height: 500px;
}

/* 列表项 */
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background-color: #f5f7fa;
}

.name {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.gender {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.gender.male {
  background-color: #e3f2fd;
  color: #2196f3;
}

.gender.female {
  background-color: #fce4ec;
  color: #e91e63;
}

/* 滚动条美化 */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background-color: #c0c4cc;
}
</style>