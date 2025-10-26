// 文件路径: src/i18n/index.js
// 这是多语言的核心配置文件

import Vue from 'vue'
import VueI18n from 'vue-i18n'

// 引入语言包
import zhCN from './locales/zh-CN'
import en from './locales/en'
import es from './locales/es'

Vue.use(VueI18n)

// 创建 i18n 实例
const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'es', // 默认语言,从本地存储读取
  fallbackLocale: 'es', // 备用语言
  messages: {
    'zh-CN': zhCN,
    'en': en,
    'es': es
  }
})

export default i18n