import request from '@/utils/request'
import qs from 'qs'
// get 请求
export function getUserInfo () {
  return request({
    url: '/system/user/detail',
    method: 'get'
  })
}

// post 参数为json格式
export function postJSON (data) {
  return request({
    url: '/system/user/detail',
    method: 'post',
    data
  })
}

// post 参数为FormData格式
export function postFormData (data) {
  return request({
    url: '/system/user/detail',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export function login (data, usePassword) {
  return request({
    url: `/in/${ usePassword ? 'login' : 'reg_tourist' }`,
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export function reg (data) {
  return request({
    url: `/in/reg`,
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export function fetchUserInfo (data) {
  return request({
    url: '/get/base',
    method: 'post',
    data,
    dataType: 'formData'
  })
}
export function fetchlahei (data) {
  return request({
    url: '/get/lahei',
    method: 'post',
    data,
    dataType: 'formData'
  })
}


//获取好友列表
export const getFriendList = data => {
  return request({
    url: '/get/friendList',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const getChatList = data => {
  return request({
    url: '/get/chatList',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const textMsg = data => {
  return request({
    url: '/message/textMsg',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const setListTime = data => {
  return request({
    url: '/message/setListTime',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const regTourist = data => {
  return request({
    url: '/in/reg_tourist',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const upload = data => {
  return request({
    url: '/upload/chat',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 上传头像
export const uploadPhoto = data => {
  return request({
    url: '/upload/photo',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 更新头像
export const updatePhoto = data => {
  return request({
    url: '/action/upPhoto',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 注册上传头像
export function regPhoto (data) {
  return request({
    url: '/in/photo',
    method: 'post',
    data,
    dataType: 'formData'
  })
}




export const getListTime = data => {
  return request({
    url: '/message/getListTime',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const chatData = data => {
  return request({
    url: '/get/chatData',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const getListId = data => {
  return request({
    url: '/message/getListId',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const getMemberPhotos = data => {
  return request({
    url: '/vendor/getMemberPhotos',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const getChatDetails = data => {
  return request({
    url: '/message/getChatDetails',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const setRemarks = data => {
  return request({
    url: '/friend/setRemarks',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const fetchInfo = data => {
  return request({
    url: '/get/details',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const chatTop = data => {
  return request({
    url: '/message/chatTop',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const msgDisturb = data => {
  return request({
    url: '/message/msgDisturb',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const deleteChat = data => {
  return request({
    url: '/chat/deleteChat',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const resetPassword = data => {
  return request({
    url: '/set/password',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

export const setInfo = data => {
  return request({
    url: '/set/setInfo',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 收藏
export const saveStore = data => {
  return request({
    url: '/vendor/saveStore',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 撤回
export const withdraw = data => {
  return request({
    url: '/message/withdraw',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 收藏列表
export const getUserStore = data => {
  return request({
    url: '/vendor/getUserStore',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 收藏列表
export const deleteStore = data => {
  return request({
    url: '/vendor/deleteStore',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 添加好友列表
export const searchUser = data => {
  return request({
    url: '/get/searchUser',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 添加好友列表
export const applyFriend = data => {
  return request({
    url: '/get/applyFriend',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 分享名片
export const sendCard = data => {
  return request({
    url: '/message/sendCard',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 分享群名片
export const sendGroupCard = data => {
  return request({
    url: '/message/sendGroupCard',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 发消息
export const textMsgs = data => {
	
  return request({
    url: '/message/textMsgs',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 加好友
export const friendAdd = data => {
  return request({
    url: '/action/friendAdd',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 同意
export const friendAddAction = data => {
  return request({
    url: '/action/friendAddAction',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 创建群聊
export const addGroup = data => {
  return request({
    url: '/message/addGroup',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 群聊加人
export const addChat = data => {
  return request({
    url: '/message/addChat',
    method: 'post',
    data,
    dataType: 'formData'
  })
}
// 设置群昵称
export const setGroupData = data => {
  return request({
    url: '/message/setGroupData',
    method: 'post',
    data,
    dataType: 'formData'
  })
}
// 设置我在本群的昵称
export const saveGroupNickName = data => {
  return request({
    url: '/vendor/saveGroupNickName',
    method: 'post',
    data,
    dataType: 'formData'
  })
}
// 设置群头像
export const groupPhoto = data => {
  return request({
    url: '/upload/groupPhoto',
    method: 'post',
    data,
    dataType: 'formData'
  })
}
// 更新群头像
export const upGroupPhoto = data => {
  return request({
    url: '/message/upGroupPhoto',
    method: 'post',
    data,
    dataType: 'formData'
  })
}
// 群禁言
export const groupIsMsg = data => {
  return request({
    url: '/message/groupIsMsg',
    method: 'post',
    data,
    dataType: 'formData'
  })
}
// 群内禁止加好友
export const editChange = data => {
  return request({
    url: '/message/speekChecked',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 踢出群成员
export const removeChat = data => {
  return request({
    url: '/message/removeChat',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 群成员列表
export const getGroupAdmin = data => {
  return request({
    url: '/message/getGroupAdmin',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 设置群管理
export const setGroupAdmin = data => {
  return request({
    url: '/message/setGroupAdmin',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 转让群主
export const transferQun = data => {
  return request({
    url: '/vendor/transferQun',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 删除好友
export const removeFriend = data => {
  return request({
    url: '/remove/friend',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 获取标签列表
export const getTagsList = data => {
  return request({
    url: '/tags.tags/get_list',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 添加标签
export const addTags = data => {
  return request({
    url: '/tags.tags/add_tags',
    method: 'post',
    data,
  })
}

// 删除标签
export const delTags = data => {
  return request({
    url: '/tags.tags/del_tags',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

// 编辑标签
export const editTags = data => {
  return request({
    url: '/tags.tags/edit_tags',
    method: 'post',
    data,
  })
}

// 删除并退出聊天
// 
export const signOut = data => {
  return request({
    url: '/remove/sign_out',
    method: 'post',
    data,
    dataType: 'formData'
  })
}

