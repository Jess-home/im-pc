import store from '../store'
export let websock = null
import { fetchUserInfo,setListTime,getListTime } from '@/api'
const { wsUrl, photoUrl } = window.__gconf
const websocketonmessage = (e) => {
  const ev = JSON.parse(e.data)
  // console.log("监听所有消息",ev)
  if (ev.action === 'chatData') {
	  console.log(ev);
    if (store.state.user.name !== ev.data.data.msg.user_info.name) {
		console.log(1)
      let listIds = store.state.chatlist.map(item => {
        return item.list_id
      })
      const el = document.getElementById('chatmp3')
      el.play()
      
      // store.dispatch('fetchCharList', store.state.selectId)
      if (listIds.includes(ev.data.list_id)) {
		  console.log(2)
        const _chatlist = [...store.state.chatlist]
        for (let i = 0; i < _chatlist.length; i++) {
          if (store.state.selectId !== ev.data.list_id) {
			  console.log(3)
			  if(_chatlist[i].list_id == ev.data.list_id){
				  _chatlist[i].unread += 1
				  
			  }
            
          }
          if (_chatlist[i].list_id === ev.data.list_id) {
			  console.log(4)
            // if (ev.data.data.msg.type == 0) {
            //   _chatlist[i].messages.push({
            //     content: ev.data.data.msg.content.text,
            //     date: new Date(ev.data.data.msg.time * 1000),
            //     type: 0
            //   })
            // } else if (ev.data.data.msg.type == 2) {
            //   _chatlist[i].messages.push({
            //     content: ev.data.data.msg.content.url,
            //     w: ev.data.data.msg.content.w,
            //     h: ev.data.data.msg.content.h,
            //     date: new Date(ev.data.data.msg.time * 1000),
            //     type: 2
            //   })
            // }
			// 新消息的朋友排到第一位
			
			 
            const itemData = ev.data.data
			// console.log(i);return;
            _chatlist[i].messages.push({
              content: itemData.msg.content,
              date: new Date(itemData.msg.time * 1000),
              type: itemData.msg.content.type || itemData.type,
              msg_type: itemData.type,
              read: '',
              list_id: ev.data.list_id,
              msg_id: itemData.msg.id,
              userId: itemData.msg.user_info.uid,
              msgItem_type: itemData.msg.content.type || itemData.msg.type,
              self: store.state.user.uid == itemData.msg.user_info.uid,
              user_info: itemData.msg.user_info
            })
            console.log("当前用户id", store.state.user.uid);
            console.log(_chatlist)
			
			
			
			if (store.state.selectId == ev.data.list_id) {
				setListTime({
				  list_id: ev.data.list_id,
				  _token: localStorage.getItem("token"),
				  _agent_id: 1,
				});
			}
			
			_chatlist.unshift(_chatlist.splice(i , 1)[0]);
            store.dispatch('refreshChatlist', _chatlist)
            return
          }
        }
      } else {
		  console.log(5)
        store.dispatch('fetchCharList', store.state.selectId)
      }

    }
  } else if (ev.action == 'newFriend') {
    fetchUserInfo().then(res => {
      const userInfo = res.data.user_info
      store.dispatch('updataUser', {
        ...res.data,
        name: userInfo.username,
        img: photoUrl + userInfo.photo,
        uid: userInfo.id
      })
    })
  } else if (ev.action == 'getChatList') {
    store.dispatch('fetchCharList', store.state.selectId)
  }else if (ev.action == "deleteChat"){
    // 如果监听其他人撤回消息。则执行
    if(store.state.user.uid !== ev.data.data.msg.user_info.uid){
      store.dispatch('fetchCharList', store.state.selectId)
    }
  }else if (ev.action == "timeData"){
	  console.log(23423423)
	   getListTime({
	    list_id: ev.data.data.list_id,
	    _token: localStorage.getItem("token"),
	    _agent_id: 1,
	  }).then((res) => {
	      store.state.chatlist.forEach((item) => {
	        item.messages.forEach((i, j) => {
	            i.read = true;
	  		
	        });
	      });
	  });
  }
  // 撤回消息
}

export const websocketsend = (data) => {
  websock.send(data)
}

const websocketonopen = () => {
  const token = localStorage.getItem('token')
  websocketsend(JSON.stringify({
    'action': 'checkToken',
    'data': token
  }))
  
  setInterval(() => {
	  websocketsend(JSON.stringify({
		'action': 'ping',
		'data': token
	  }))
  }, 1000 * 5)
  // 心跳
  // setInterval(() => {
  //   websocketsend(JSON.stringify({
  //     'action': 'ping',
  //     'data': token
  //   }))
  // }, 1000 * 5)
}


const websocketclose = () => {
}

export const initWebSocket = () => {
  websock = new WebSocket(wsUrl);
  websock.onmessage = websocketonmessage;
  websock.onopen = websocketonopen;
  websock.onerror = websocketonerror;
  websock.onclose = websocketclose;
}

const websocketonerror = () => { //连接建立失败重连
  initWebSocket()
}
