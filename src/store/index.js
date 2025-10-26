import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";
import {
  setListTime,
  getListTime,
  chatData,
  getMemberPhotos,
  getFriendList,
  getListId,
  textMsg,
  getChatList,
  getTagsList,
  addTags,
} from "@/api";
const { photoUrl } = window.__gconf;
Vue.use(Vuex);

//获取当前时间
const now = new Date();
const state = {
  // 输入的搜索值
  searchText: "",
  // 当前登录用户
  user: {
    name: "ratel",
    img: "static/images/UserAvatar.jpg",
    ip: "127.0.0.1",
    region: "",
    online: 0,
    user_info: {},
  },
  // 对话好友列表
  chatlist: [],
  // 好友列表
  friendlist: [],
  // 标签列表
  tagslist: [],
  //emoji表情
  emojis: [
    { file: "100.gif", code: "[微笑]", title: "微笑", reg: /\/::\)/g },
    { file: "101.gif", code: "[伤心]", title: "伤心", reg: /\/::~/g },
    { file: "102.gif", code: "[美女]", title: "美女", reg: /\/::B/g },
    { file: "103.gif", code: "[发呆]", title: "发呆", reg: /\/::\|/g },
    { file: "104.gif", code: "[墨镜]", title: "墨镜", reg: /[墨镜]/g },
    { file: "105.gif", code: "[哭]", title: "哭", reg: /\/::</g },
    { file: "106.gif", code: "[羞]", title: "羞", reg: /\/::\$/g },
    { file: "107.gif", code: "[哑]", title: "哑", reg: /\/::X/g },
    { file: "108.gif", code: "[睡]", title: "睡", reg: /\/::Z/g },
    { file: "109.gif", code: "[哭]", title: "哭", reg: /\/::'\(/g },
    { file: "110.gif", code: "[囧]", title: "囧", reg: /\/::-\|/g },
    { file: "111.gif", code: "[怒]", title: "怒", reg: /\/::@/g },
    { file: "112.gif", code: "[调皮]", title: "调皮", reg: /\/::P/g },
    { file: "113.gif", code: "[笑]", title: "笑", reg: /\/::D/g },
    { file: "114.gif", code: "[惊讶]", title: "惊讶", reg: /\/::O/g },
    { file: "115.gif", code: "[难过]", title: "难过", reg: /\/::\(/g },
    { file: "116.gif", code: "[酷]", title: "酷", reg: /\/::\+/g },
    { file: "117.gif", code: "[汗]", title: "汗", reg: /\/:--b/g },
    { file: "118.gif", code: "[抓狂]", title: "抓狂", reg: /\/::Q/g },
    { file: "119.gif", code: "[吐]", title: "吐", reg: /\/::T/g },
    { file: "120.gif", code: "[笑]", title: "笑", reg: /\/:,@P/g },
    { file: "121.gif", code: "[快乐]", title: "快乐", reg: /\/:,@-D/g },
    { file: "122.gif", code: "[奇]", title: "奇", reg: /\/::d/g },
    { file: "123.gif", code: "[傲]", title: "傲", reg: /\/:,@o/g },
    { file: "124.gif", code: "[饿]", title: "饿", reg: /\/::g/g },
    { file: "125.gif", code: "[累]", title: "累", reg: /\/:\|-\)/g },
    { file: "126.gif", code: "[吓]", title: "吓", reg: /\/::!/g },
    { file: "127.gif", code: "[汗]", title: "汗", reg: /\/::L/g },
    { file: "128.gif", code: "[高兴]", title: "高兴", reg: /\/::>/g },
    { file: "129.gif", code: "[闲]", title: "闲", reg: /\/::,@/g },
    { file: "130.gif", code: "[努力]", title: "努力", reg: /\/:,@f/g },
    { file: "131.gif", code: "[骂]", title: "骂", reg: /\/::-S/g },
    { file: "133.gif", code: "[秘密]", title: "秘密", reg: /\/:,@x/g },
    { file: "134.gif", code: "[乱]", title: "乱", reg: /\/:,@@/g },
    { file: "135.gif", code: "[疯]", title: "疯", reg: /\/::8/g },
    { file: "136.gif", code: "[哀]", title: "哀", reg: /\/:,@!/g },
    { file: "137.gif", code: "[鬼]", title: "鬼", reg: /\/:!!!/g },
    { file: "138.gif", code: "[打击]", title: "打击", reg: /\/:xx/g },
    { file: "139.gif", code: "[bye]", title: "bye", reg: /\/:bye/g },
    { file: "142.gif", code: "[鼓掌]", title: "鼓掌", reg: /\/:handclap/g },
    { file: "145.gif", code: "[什么]", title: "什么", reg: /\/:<@/g },
    { file: "147.gif", code: "[累]", title: "累", reg: /\/::-O/g },
    { file: "153.gif", code: "[吓]", title: "吓", reg: /\/:@x/g },
    { file: "155.gif", code: "[刀]", title: "刀", reg: /\/:pd/g },
    { file: "156.gif", code: "[水果]", title: "水果", reg: /\/:<W>/g },
    { file: "157.gif", code: "[酒]", title: "酒", reg: /\/:beer/g },
    { file: "158.gif", code: "[篮球]", title: "篮球", reg: /\/:basketb/g },
    { file: "159.gif", code: "[乒乓]", title: "乒乓", reg: /\/:oo/g },
    { file: "195.gif", code: "[跳舞]", title: "跳舞", reg: /\/:circle/g },
    { file: "160.gif", code: "[咖啡]", title: "咖啡", reg: /\/:coffee/g },
    { file: "161.gif", code: "[美食]", title: "美食", reg: /\/:coffee/g },
    { file: "162.gif", code: "[动物]", title: "动物", reg: /\/:coffee/g },
    { file: "163.gif", code: "[鲜花]", title: "鲜花", reg: /\/:coffee/g },
    { file: "164.gif", code: "[枯]", title: "枯", reg: /\/:coffee/g },
    { file: "165.gif", code: "[唇]", title: "唇", reg: /\/:coffee/g },
    { file: "166.gif", code: "[爱]", title: "爱", reg: /\/:coffee/g },
    { file: "167.gif", code: "[分手]", title: "分手", reg: /\/:coffee/g },
    { file: "168.gif", code: "[生日]", title: "生日", reg: /\/:coffee/g },
    { file: "169.gif", code: "[电]", title: "电", reg: /\/:coffee/g },
    { file: "170.gif", code: "[炸弹]", title: "炸弹", reg: /\/:coffee/g },
    { file: "171.gif", code: "[刀子]", title: "刀子", reg: /\/:coffee/g },
    { file: "172.gif", code: "[足球]", title: "足球", reg: /\/:coffee/g },
    { file: "173.gif", code: "[瓢虫]", title: "瓢虫", reg: /\/:coffee/g },
    { file: "174.gif", code: "[翔]", title: "翔", reg: /\/:coffee/g },
    { file: "175.gif", code: "[月亮]", title: "月亮", reg: /\/:coffee/g },
    { file: "176.gif", code: "[太阳]", title: "太阳", reg: /\/:coffee/g },
    { file: "177.gif", code: "[礼物]", title: "礼物", reg: /\/:coffee/g },
    { file: "178.gif", code: "[抱抱]", title: "抱抱", reg: /\/:coffee/g },
    { file: "179.gif", code: "[拇指]", title: "拇指", reg: /\/:coffee/g },
    { file: "180.gif", code: "[贬低]", title: "贬低", reg: /\/:coffee/g },
    { file: "181.gif", code: "[握手]", title: "握手", reg: /\/:coffee/g },
    { file: "182.gif", code: "[剪刀手]", title: "剪刀手", reg: /\/:coffee/g },
    { file: "183.gif", code: "[抱拳]", title: "抱拳", reg: /\/:coffee/g },
    { file: "184.gif", code: "[勾引]", title: "勾引", reg: /\/:coffee/g },
    { file: "185.gif", code: "[拳头]", title: "拳头", reg: /\/:coffee/g },
    { file: "186.gif", code: "[小拇指]", title: "小拇指", reg: /\/:coffee/g },
    { file: "187.gif", code: "[拇指八]", title: "拇指八", reg: /\/:coffee/g },
    { file: "188.gif", code: "[食指]", title: "食指", reg: /\/:coffee/g },
    { file: "189.gif", code: "[ok]", title: "ok", reg: /\/:coffee/g },
    { file: "190.gif", code: "[情侣]", title: "情侣", reg: /\/:coffee/g },
    { file: "191.gif", code: "[爱心]", title: "爱心", reg: /\/:coffee/g },
    { file: "192.gif", code: "[蹦哒]", title: "蹦哒", reg: /\/:coffee/g },
    { file: "193.gif", code: "[颤抖]", title: "颤抖", reg: /\/:coffee/g },
    { file: "194.gif", code: "[怄气]", title: "怄气", reg: /\/:coffee/g },
    { file: "195.gif", code: "[跳舞]", title: "跳舞", reg: /\/:coffee/g },
    { file: "196.gif", code: "[发呆]", title: "发呆", reg: /\/:coffee/g },
    { file: "197.gif", code: "[背着]", title: "背着", reg: /\/:coffee/g },
    { file: "198.gif", code: "[伸手]", title: "伸手", reg: /\/:coffee/g },
    { file: "199.gif", code: "[耍帅]", title: "耍帅", reg: /\/:coffee/g },
    { file: "200.png", code: "[微笑]", title: "微笑", reg: /\/:coffee/g },
    { file: "201.png", code: "[生病]", title: "生病", reg: /\/:coffee/g },
    { file: "202.png", code: "[哭泣]", title: "哭泣", reg: /\/:coffee/g },
    { file: "203.png", code: "[吐舌]", title: "吐舌", reg: /\/:coffee/g },
    { file: "204.png", code: "[迷糊]", title: "迷糊", reg: /\/:coffee/g },
    { file: "205.png", code: "[瞪眼]", title: "瞪眼", reg: /\/:coffee/g },
    { file: "206.png", code: "[恐怖]", title: "恐怖", reg: /\/:coffee/g },
    { file: "207.png", code: "[忧愁]", title: "忧愁", reg: /\/:coffee/g },
    { file: "208.png", code: "[眨眉]", title: "眨眉", reg: /\/:coffee/g },
    { file: "209.png", code: "[闭眼]", title: "闭眼", reg: /\/:coffee/g },
    { file: "210.png", code: "[鄙视]", title: "鄙视", reg: /\/:coffee/g },
    { file: "211.png", code: "[阴暗]", title: "阴暗", reg: /\/:coffee/g },
    { file: "212.png", code: "[小鬼]", title: "小鬼", reg: /\/:coffee/g },
    { file: "213.png", code: "[礼物]", title: "礼物", reg: /\/:coffee/g },
    { file: "214.png", code: "[拜佛]", title: "拜佛", reg: /\/:coffee/g },
    { file: "215.png", code: "[力量]", title: "力量", reg: /\/:coffee/g },
    { file: "216.png", code: "[金钱]", title: "金钱", reg: /\/:coffee/g },
    { file: "217.png", code: "[蛋糕]", title: "蛋糕", reg: /\/:coffee/g },
    { file: "218.png", code: "[彩带]", title: "彩带", reg: /\/:coffee/g },
    { file: "219.png", code: "[礼物]", title: "礼物", reg: /\/:coffee/g },
    { file: "220.gif", code: "[戳一戳]", title: "戳一戳", reg: /\/:coffee/g },
    { file: "221.png", code: "[国旗]", title: "国旗", reg: /\/:coffee/g },
    { file: "222.png", code: "[得]", title: "得", reg: /\/:coffee/g },
    { file: "223.png", code: "[禁止]", title: "禁止", reg: /\/:coffee/g },
    { file: "224.png", code: "[提醒]", title: "提醒", reg: /\/:coffee/g },
    { file: "225.png", code: "[话筒]", title: "话筒", reg: /\/:coffee/g },
    { file: "226.png", code: "[无]", title: "无", reg: /\/:coffee/g },
  ],
  // 得知当前选择的是哪个对话
  selectId: "",
  // 得知当前选择的是哪个好友
  selectFriendId: "",
  // 当前选择的是哪个标签
  selectTagId: "",
  unreadsum: 0,
  chatDataTimer: null,
  groupChat: [],
  chatFriendId: "", //对话框好友
};

const mutations = {
  // 从localStorage 中获取数据
  initData(state) {
    let data = localStorage.getItem("vue-chat");
    if (data) {
      state.chatlist = JSON.parse(data);
    }
  },
  // 获取搜索值
  search(state, value) {
    state.searchText = value;
  },
  clearIntervalTimer(state) {
    clearInterval(state.chatDataTimer);
  },
  clearSelectId() {
    state.selectId = "";
  },
  // 得知用户当前选择的是哪个对话。便于匹配对应的对话框
  async selectSession(state, value) {
    console.log(value);
    let list_id = value;
    let hasChat = false;
    state.chatlist.map((item) => {
      if (item.list_id === value) {
        item.unread = 0;
        hasChat = true;
      }
    });
    state.selectId = list_id;
    // if (!hasChat) {
    //   await textMsg({
    //     list_id,
    //     _token: localStorage.getItem("token"),
    //     content_type: 0,
    //     content: JSON.stringify({
    //       text: "你好",
    //     }),
    //     _agent_id: 1,
    //   }).then((res) => {
    //     router.push({ path: "/chat" });
    //   });
    //   return;
    // }

    await chatData({
      list_id,
      time: 0,
      is_up: 1,
      _token: localStorage.getItem("token"),
      _agent_id: 1,
    }).then((res) => {
      console.log(
        "res对话消息sdsadddddddddddddddddddddddddddddddddddddddddddd",
        res
      );
      if (res.err == 0) {
        state.chatFriendId = res.data.obj_id;
      }
      let item = state.chatlist.filter((item) => {
        return item.list_id === res.data.list_id;
      })[0];

      let msgs = [];

      state.user["ip"] = res.data.ip;
      state.user["region"] = res.data.region;
      state.user["online"] = res.data.online;
      res.data.list.map((item) => {
        msgs.push({
          content: item.msg.content,
          date: new Date(item.msg.time * 1000),
          type: (item.msg.content && item.msg.content.type) || item.type,
          msg_type: res.data.type,
          read: '',
          liked: item.msg.liked,
          list_id: res.data.list_id,
          msg_id: item.msg.id,
          userId: item.msg.user_info.uid,
          msgItem_type: item.msg.content.type || item.msg.type,
          self: state.user.uid == item.msg.user_info.uid,
          user_info: item.msg.user_info,
        });
      });
      item.online = res.data.online;
      item.messages = msgs;
    });
	
	
	
	
    await getListTime({
      list_id: list_id,
      _token: localStorage.getItem("token"),
      _agent_id: 1,
    }).then((res) => {
      if (res.read_time > 0) {
        state.chatlist.forEach((item) => {
          item.messages.forEach((i, j) => {
            if (i.date <= new Date(res.read_time * 1000)) {
              i.read = true;
            } else {
				console.log(i.date,new Date(res.read_time * 1000));
              i.read = false;
            }
			
          });
        });
      } else {
        state.chatlist.forEach((item) => {
          item.messages.forEach((i, j) => {
            i.read = false;
          });
        });
      }
    });



  
    state.groupChat = [];

    await getMemberPhotos({
      list_id: list_id,
      _token: localStorage.getItem("token"),
      _agent_id: 1,
    }).then((res) => {
      if (res.data.length > 2) {
        state.groupChat = res.data;
      }
    });
	await setListTime({
	  list_id: list_id,
	  _token: localStorage.getItem("token"),
	  _agent_id: 1,
	});
  },
  // 得知用户当前选择的是哪个好友。
  selectFriend(state, value) {
    router.push({ path: "/friend" });
    state.selectFriendId = value;
  },
  // 选择当前标签
  selectTag(state, value) {
    state.selectTagId = value;
  },
  // 得知用户当前选择的是哪个好友。
  selectFriend2(state, value) {
    router.push({ path: "/friend" });
    getFriendList({
      _token: localStorage.getItem("token"),
      _agent_id: 1,
    }).then((res) => {
      let data = res.data.data;
      Object.keys(res.data.data).forEach((key) => {
        data[key].data.forEach((item) => {
          if (item.user_id == value.user_id) {
            state.selectFriendId = item.list_id;
            console.log(item.list_id);
          }
        });
      });
    });
    // state.friendlist.filter(item => {
    //     return item.
    // })
    //    state.selectFriendId = value
  },
  // 发送信息
  sendMessage(state, msg) {
    let result = state.chatlist.find(
      (session) => session.list_id === state.selectId
    );
    result.messages.push({
      content:
        typeof msg.content == "string" ? { text: msg.content } : msg.content,
      date: new Date(),
      type: msg.type,
      self: true,
      msgItem_type: 0,
    });
  },
  getMessage(state, data) {},
  // 选择好友后，点击发送信息。判断在聊天列表中是否有该好友，有的话跳到该好友对话。没有的话
  // 添加该好友的对话 并置顶
  async send(state) {
    let result = state.friendlist.find(
      (friend) => friend.id === state.selectFriendId
    );
    let msg = state.chatlist.find((msg) => msg.user.name === result.remark);
    let list_id = result.list_id;
    if (!msg) {
      await getListId({
        user_id: state.selectFriendId,
      }).then((res) => {
        list_id = res.data.list_id;
      });
    }

    // console.log(list_id)
    //
    if (msg) {
      state.selectId = list_id;
      router.push({ path: "/chat" });
    } else {
		// router.push({ path: "/chat" });
      store.dispatch("selectSession", list_id);
    }
  },
  refreshFriendlist(state, value) {
    state.friendlist = value;
  },

  refreshChatlist(state, value) {
	  console.log(value, "value(state)");
    value.forEach((item) => {
      if (item.type == 1) {
        getMemberPhotos({
          list_id: item.list_id,
          _token: localStorage.getItem("token"),
          _agent_id: 1,
        }).then((res) => {
          item.groupImgs = res.data;
        });
		
      }
	  
	  
    });
	 
    state.chatlist = value;
  },
  // 刷新标签列表
  refreshTagslist(state, value) {
    state.tagslist = value;
  },
  updataUser(state, value) {
    console.log(value);
    state.user = value;
  },
};
const getters = {
  // 筛选出含有搜索值的聊天列表
  searchedChatlist(state) {
   
    let sessions = state.chatlist.filter((sessions) =>
      sessions.user.name.includes(state.searchText)
    );
    return sessions;
  },
  // 筛选出含有搜索值的好友列表
  searchedFriendlist(state) {
    let friends = state.friendlist.filter((friends) =>
      friends.remark.includes(state.searchText)
    );
    return friends;
  },
  // 筛选出含有搜索值的标签
  searchedTagslist(state) {
    if (state.tagslist.length) {
      let tags = state.tagslist.filter((tags) =>
        tags.name.includes(state.searchText)
      );
      return tags;
    } else {
      return [];
    }
  },
  // 当前选中的标签
  getSelectTag(state) {
    if (state.tagslist.length) {
      let tags = state.tagslist.find((tags) => tags.id == state.selectTagId);
      return tags;
    } else {
      return {
        user_list: [],
      };
    }
  },
  // 通过当前选择是哪个对话匹配相应的对话
  selectedChat(state) {
    let session = state.chatlist.find(
      (session) => session.list_id === state.selectId
    );
    return session;
  },
  // 通过当前选择是哪个好友匹配相应的好友
  selectedFriend(state) {
    let friend = state.friendlist.find(
      (friend) => friend.id === state.selectFriendId
    );
    if (friend) return friend;
  },
  messages(state) {
    let session = state.chatlist.find(
      (session) => session.id === state.selectId
    );
    if (session) return session.messages;
  },
  getChatFriendId(state) {
    return state.chatFriendId;
  },
};

const actions = {
  search: ({ commit }, value) => {
    setTimeout(() => {
      commit("search", value);
    }, 100);
  },
  selectSession: ({ commit }, value) => commit("selectSession", value),
  selectFriend: ({ commit }, value) => commit("selectFriend", value),
  selectFriend2: ({ commit }, value) => commit("selectFriend2", value),
  // 选择当前标签
  selectTag: ({ commit }, value) => commit("selectTag", value),

  sendMessage: ({ commit }, msg) => commit("sendMessage", msg),
  send: ({ commit }) => commit("send"),
  initData: ({ commit }) => commit("initData"),
  refreshFriendlist: ({ commit }, value) => commit("refreshFriendlist", value),
  refreshChatlist: ({ commit }, value) => commit("refreshChatlist", value),
  updataUser: ({ commit }, value) => commit("updataUser", value),
  clearIntervalTimer: ({ commit }, value) => commit("clearIntervalTimer"),
  fetchFriendList: ({ commit }, value) => {
    getFriendList({
      _token: localStorage.getItem("token"),
      _agent_id: 1,
    }).then((res) => {
      let data = res.data.data;
      let friendlist = [];
      Object.keys(res.data.data).forEach((key) => {
        if (
          data[key].data[0].hasOwnProperty("type") &&
          data[key].data[0].type === 1
        ) {
        } else {
          data[key].data.forEach((item) => {
            // if (item.list_id) {
            friendlist.push({
              id: item.user_id,
              list_id: item.list_id, //微信号
              initial: data[key].letter, //姓名首字母
              img: photoUrl + item.photo, //头像
              signature: "", //个性签名
              nickname: item.name, //昵称
              sex: 0, //性别 1为男，0为女
              remark: item.name, //备注
              area: "", //地区
            });
            // }
          });
        }
      });
      commit("refreshFriendlist", friendlist);
    });
  },
  fetchCharList: ({ commit }, value) => {
    getChatList({
      _token: localStorage.getItem("token"),
      _agent_id: 1,
    }).then((res) => {
      // let vueChat = JSON.parse(localStorage.getItem('vue-chat'))
      // if (!vueChat || (vueChat && vueChat.length < 1)) {
      console.log(res, "getChatList");
      let data = [];
      res.data.forEach((item) => {
        data.push({
          chat_id: item.chat_id,
          list_id: item.list_id,
          unread: item.no_reader_num,
          type: item.type,
          groupImgs: [],
          top: item.top,
          online: item.online,
          messages: [
            {
              content: item.last_msg,
              date: new Date(item.time * 1000),
              type: 0,
              read: '',
              firstShow: true,
            },
          ],
          user: {
            img: photoUrl + item.photo_path,
            name: item.show_name,
          },
        });
      });
      commit("refreshChatlist", data);
      if (value) {
        commit("selectSession", value);
      }
      // } else {
      //   this.$store.dispatch('refreshChatlist', vueChat)
      // }
    });
  },
  // 获取标签列表
  fetchTagsList: ({ commit, state }, value) => {
    getTagsList({
      _token: localStorage.getItem("token"),
      _agent_id: 1,
    }).then((res) => {
      console.log("res标签", res);
      let tagsList = [];
      let data = res;
      data.forEach((item) => {
        tagsList.push(item);
      });
      if (!state.selectTagId && tagsList.length) {
        commit("selectTag", tagsList[0].id);
      }
      if (tagsList.length == 0) {
        commit("selectTag", "");
      }
      commit("refreshTagslist", tagsList);
    });
  },
};
const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
});

// 监听聊天列表的值， 发生变化就保存在localStorage中
store.watch(
  (state) => state.chatlist,
  (val) => {
    localStorage.setItem("vue-chat", JSON.stringify(val));
    state.unreadsum = 0;
    val.forEach((item) => {
      state.unreadsum += item.unread;
    });
  },
  {
    deep: true,
  }
);
export default store;
