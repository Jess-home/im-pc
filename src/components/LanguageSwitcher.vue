<!-- 
  文件路径: src/components/LanguageSwitcher.vue
  语言切换弹框组件
-->

<template>
  <div>
    <!-- 触发按钮 -->
    <button class="language-btn" @click="showModal = true">
      <span class="icon">🌐</span>
      <!-- {{ currentLanguageName }} -->
    </button>

    <!-- 语言选择弹框 -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <!-- 标题和关闭按钮 -->
        <div class="modal-header">
          <h3>{{ $t('language.title') }}</h3>
          <button class="close-btn" @click="showModal = false">×</button>
        </div>

        <!-- 语言列表 -->
        <div class="modal-body">
          <div 
            v-for="lang in languages" 
            :key="lang.value"
            class="language-item"
            :class="{ active: currentLanguage === lang.value }"
            @click="switchLanguage(lang.value)"
          >
            <span class="flag">{{ lang.flag }}</span>
            <span class="name">{{ lang.label }}</span>
            <span v-if="currentLanguage === lang.value" class="check">✓</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LanguageSwitcher',
  data() {
    return {
      showModal: false,
      languages: [
        { 
          value: 'zh-CN', 
          label: this.$t('zhong_wen_jian_ti'), 
          flag: '🇨🇳',
          key: 'zhCN'
        },
        { 
          value: 'en', 
          label: 'English', 
          flag: '🇺🇸',
          key: 'en'
        },
        { 
          value: 'es', 
          label: 'Español', 
          flag: '🇪🇸',
          key: 'es'
        }
      ]
    };
  },
  computed: {
    // 当前语言
    currentLanguage() {
      return this.$i18n.locale;
    },
    // 当前语言显示名称
    currentLanguageName() {
      const lang = this.languages.find(l => l.value === this.currentLanguage);
      return lang ? lang.label : this.$t('zhong_wen_jian_ti');
    }
  },
  methods: {
    // 切换语言
    switchLanguage(lang) {
      if (lang === this.currentLanguage) {
        this.showModal = false;
        return;
      }
      
      // 切换语言
      this.$i18n.locale = lang;
      // 保存到本地存储
      localStorage.setItem('language', lang);
      // 关闭弹框
      this.showModal = false;
      
      // 触发事件通知父组件(可选)
      this.$emit('language-change', lang);
      
      // 提示消息(如果项目中有 Message 组件)
      // this.$message.success(this.$t('message.switchSuccess'));
    }
  }
};
</script>

<style scoped>
/* 语言切换按钮 */
.language-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #fff;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 20px;
}

.language-btn:hover {
  color: #409eff;
  border-color: #409eff;
}

.language-btn .icon {
  font-size: 18px;
}

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
  z-index: 2000;
}

/* 弹框主体 */
.modal-content {
  background: white;
  border-radius: 8px;
  width: 400px;
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
  padding: 12px;
}

/* 语言项 */
.language-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.language-item:hover {
  background-color: #f5f7fa;
}

.language-item.active {
  background-color: #ecf5ff;
  color: #409eff;
}

.language-item .flag {
  font-size: 24px;
}

.language-item .name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.language-item .check {
  color: #409eff;
  font-size: 18px;
  font-weight: bold;
}
</style>