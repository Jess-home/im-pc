<!-- 文本输入框 -->
<template>
  <div v-if="selectId !== ''" id="text" class="text1">
    <div class="emoji">
      <!-- TODO 对话框功能 -->
      <i class="iconfont iconIMweb_expression upload-file-icon" :title="$t('xuan_ze_biao_qing')" :style="{
        color: showEmoji ? '#7bbbff' : '#7c7c7c'
      }" @click="openEmoji"></i>
      <!-- <i
        class="click-icon upload-file-icon"
        style="font-size:24px"
        @click="sendClick"
      ></i> -->
      <i class="iconfont iconIMweb_picture upload-file-icon" :title="$t('fa_song_tu_pian')" @click="uploadImage">
        <input id="upload_file" type="file" accept=".jpeg,.jpg,.png,.gif" multiple class="upload-file"
          @change="fileChange($event)" ref="upload_file" />
      </i>
      <i class="iconfont iconIMweb_file upload-file-icon" :title="$t('fa_song_wen_jian')" @click="uploadFile">
        <input id="upload_file1" type="file" class="upload-file" @change="fileChange1($event)" ref="upload_file1" />
      </i>
      <i class="iconfont iconIMweb_video upload-file-icon" :title="$t('fa_song_shi_pin')" @click="uploadVideo">
        <input id="upload_file2" type="file" accept="video/*" class="upload-file" @change="fileChange2($event)"
          ref="upload_file2" />
      </i>
      <!-- 群聊功能 -->
      <i class="iconfont iconIMweb_ upload-file-icon" v-if="(selectedChat ? selectedChat.type : '') == 1" title="@"
        :style="{
          color: show_concat ? '#7bbbff' : '#7c7c7c'
        }" @click="openSelectFriend"></i>
      <i :title="$t('tui_jian_hao_you')" @click="getFriendList" class="iconfont iconIMweb_grcard upload-file-icon" :style="{
        color: show_friend ? '#7bbbff' : '#7c7c7c'
      }"></i>
      <i :title="$t('fen_xiang_qun_liao')" class="iconfont iconfont iconIMweb_qcard upload-file-icon" @click="getChatList" :style="{
        color: show_group ? '#7bbbff' : '#7c7c7c'
      }"></i>
      <transition name="showbox">
        <div v-show="showEmoji" class="emojiBox">
          <li v-for="(item, index) in emojis" :key="index">
            <img v-if="item.title !== '戳一戳'" :src="'static/emoji/' + item.file" :data="item.code"
              @click="addEmoji(item.code)">
          </li>
        </div>
      </transition>
      <!-- 搜索群成员 -->
      <transition name="showbox">
        <div class="concat-content" v-show="show_concat">
          <div class="concat-title">
            {{$t('xuan_ze_yao_ti_xing_de_ren')}}
            <i class="concat-close iconfont iconIMweb_cancel_cancel" @click="show_concat = false"></i>
          </div>
          <div class="concat-input">
            <el-input :placeholder="$t('qing_shu_ru_ming_cheng')" prefix-icon="el-icon-search" @input="change_member" v-model="search_member">
            </el-input>
          </div>
          <div class="concat-list">
            <div class="concat-item" @click="chooseUser({ show_name: '所有人' })">
              <el-avatar class="concat-avatar" size="large" :src="all_avatar"></el-avatar>
              <div>
                <!-- {{item}} -->
                <div> {{$t('suo_you_ren')}}</div>
              </div>
            </div>
            <div class="concat-item" v-for="(item, index) in member_list" :key="index" @click="chooseUser(item)">
              <el-avatar class="concat-avatar" size="large" :src="photoUrl + item.photo"></el-avatar>
              <div>
                <!-- {{item}} -->
                <div> {{ item.show_name }}</div>
                <!-- <div> {{item.user_id}}</div> -->

              </div>
            </div>
          </div>

        </div>
      </transition>
      <!-- 搜索好友 -->
      <transition name="showbox">
        <div class="concat-content" v-show="show_friend">
          <div class="concat-title">
            {{$t('xuan_ze_yao_tui_jian_de_hao_you')}}
            <i class="concat-close iconfont iconIMweb_cancel_cancel" @click="show_friend = false"></i>
          </div>
          <div class="concat-input">
            <el-input :placeholder="$t('qing_shu_ru_ming_cheng')" prefix-icon="el-icon-search" @input="change_friend" v-model="search_friend">
            </el-input>
          </div>
          <div class="concat-list">
            <div class="concat-item" v-for="(item, index) in friend_list" :key="index" @click="chooseFriend(item)">
              <el-avatar class="concat-avatar" size="large" :src="photoUrl + item.photo"></el-avatar>
              <div>
                <!-- {{item}} -->
                <div> {{ item.name }}</div>
                <!-- <div> {{item.user_id}}</div> -->

              </div>
            </div>
          </div>

        </div>
      </transition>
      <!-- 搜索群聊 -->
      <!-- 搜索好友 -->
      <transition name="showbox">
        <div class="concat-content" v-show="show_group">
          <div class="concat-title">
            {{$t('xuan_ze_yao_tui_jian_de_qun_liao')}}
            <i class="concat-close iconfont iconIMweb_cancel_cancel" @click="show_group = false"></i>
          </div>
          <div class="concat-input">
            <el-input :placeholder="$t('qing_shu_ru_ming_cheng')" prefix-icon="el-icon-search" @input="change_group" v-model="search_group">
            </el-input>
          </div>
          <div class="concat-list">
            <div class="concat-item" v-for="(item, index) in group_list" :key="index" @click="chooseGroup(item)">
              <el-avatar class="concat-avatar" size="large" :src="photoUrl + item.photo_path"></el-avatar>
              <div>
                <!-- {{item}} -->
                <div class="text-overflow"> {{ item.show_name }}</div>
                <!-- <div> {{item.user_id}}</div> -->

              </div>
            </div>
          </div>

        </div>
      </transition>
    </div>


    <!-- TODO优化对话框功能，ctrl+enter -->
    <!-- <textarea ref="text" v-model="content" @keyup="onKeyup" @keydown="onkeyDown" @click="closeMask" autofocus></textarea> -->


    <div class="box">




      <div ref="text" id="preview" style="height: 200px;max-height: 300px; max-width: 1000px;" v-on:paste="handlePaste"
        v-on:keyup="onKeyup" v-on:keydown="onkeyDown" v-on:click="closeMask" contenteditable='true'
        @input="content = $event.target.innerHTML">
		
		
		
      </div>
    </div>

    <!-- <Editor 
      v-model="content"
      ref="cu_editor"
      api-key='czp9ou3y89lvfup2bga4iai8t0kjx8x0lmn5yx3h5vacxu6p' :init="{
        toolbar: false,
        // plugins:'powerpaste',
        tinycomments_mode: 'embedded',
        menubar: false,
        statusbar: false,
        height:120,
        branding:false,
        auto_focus: true,
        content_style: 'img {max-width:100px;} .tox.tox-tinymce{border:none;}',
        forced_root_block:''
    }"></Editor> -->
    <div class="send" @click.stop.prevent="send">
      <span class="send_text">Ctrl+Enter：{{$t('huan_hang')}}| Enter：{{$t('fa_song')}}</span>
      <span class="send_btn">{{$t('fa_song')}}</span>
    </div>
    <transition name="appear">
      <div v-show="warn" class="warn">
        <div class="description">{{$t('bu_neng_fa_song_kong_bai_xin_xi')}}</div>
      </div>
    </transition>
  </div>
</template>

<script>
import DivInput from '@/components/divinput/divinput'
import Editor from '@tinymce/tinymce-vue'
const { Parser } = require('htmlparser2')
import { mapGetters, mapState, mapActions } from 'vuex'
import { textMsg, upload, setListTime, getChatDetails, getFriendList, sendCard, getChatList, sendGroupCard } from '@/api'
import selectGroupUser from '@/components/selectGroupUser';
const { photoUrl, chatUrl } = window.__gconf;
export default {
  data() {
    return {
      photoUrl: photoUrl,
      chatUrl: chatUrl,
      content: '',
      reply: this.$t('wei_zhao_dao'),
      frequency: 0,
      warn: false,
      showEmoji: false,

      show_concat: false,//显示联系人
      search_member: '',//搜索成员
      member_list: [],
      all_memeber_list: [],//所有成员
      all_avatar: require('../../assets/images/group/group_chat.png'),

      show_friend: false,//显示朋友
      friend_list: [],//朋友列表
      all_friend_list: [],//所有朋友
      search_friend: '',//搜索朋友

      show_group: false,//显示群聊
      group_list: [],//群聊列表
      all_group_list: [],//所有群聊
      search_group: '',//搜群聊

      flagCtrl: false,
	    dropActive:false,
    };
  },
  components: {
    DivInput,
    Editor,
    selectGroupUser
  },
  computed: {
    ...mapState([
      'selectId',
      'emojis'
    ]),
    ...mapGetters([
      'selectedChat'
    ])
  },
  watch: {
    // 在选择其它对话的时候 聚焦输入框
    selectId() {
      setTimeout(() => {
        // this.$refs.cu_editor.focus()
      }, 0)
      this.$nextTick(() => {
        const _this = this
        this.$refs.text.focus()
        const box = document.getElementById('text')
        document.ondragover = () => false
        document.ondrop = () => false
        box.ondrop = (e) => {
          const files = e.dataTransfer.files
          if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
              let url = window.URL || window.webkitURL
              let img = new Image();
              let item = files[i]
              img.src = url.createObjectURL(item)

              img.onload = function () {
                console.log(item);
                upload({
                  list_id: _this.selectedChat.list_id,
                  _token: localStorage.getItem('token'),
                  file: item
                }).then(res => {
                  if (res.err == 0) {
                    let msg = {
                      content: {
                        url: res.data.save_name,
                        h: this.height,
                        w: this.width,
                        save_pic_path: ''
                      },
                      type: 2
                    }
                    console.log(this.content); return;
                    textMsg({
                      list_id: _this.selectedChat.list_id,
                      _token: localStorage.getItem('token'),
                      content_type: 0,
                      content: JSON.stringify({
                        url: res.data.save_name,
                        h: this.height,
                        w: this.width,
                        save_pic_path: '',
                        type: 2
                      }),
                      _agent_id: 1
                    }).then(res => {
                      _this.$store.dispatch('selectSession', _this.selectId)
                    })
                    setListTime({
                      list_id: _this.selectedChat.list_id,
                      _token: localStorage.getItem('token'),
                      _agent_id: 1
                    })
                    _this.$store.dispatch('sendMessage', msg)
                  }

                })
              }
            }
          }
        }
      })
    },
    // 当输入框中的值为空时 弹出提示  并在一秒后消失
    content() {
      if (this.content === '') {
        if (this.frequency === 0) {
          this.warn = true;
          this.frequency++
          setTimeout(() => {
            this.warn = false;
          }, 1000)
        }
      }
    }
  },
 mounted () {
	 setTimeout(function(){
		 var box=document.getElementById('preview');
		 
		 box.ondragover=function (e){
		 
		  e.preventDefault();
		 
		 }
		 
		 box.ondrop=function (e){
		 
		  e.preventDefault();
		 
		  // console.log(e.dataTransfer.files[0]);
		 
		  var f=e.dataTransfer.files[0];//获取到第一个上传的文件对象
		 
		  var fr=new FileReader();//实例FileReader对象
		 
		  fr.readAsDataURL(f);//把上传的文件对象转换成url
		 
		  fr.onload=function (e){
		 
		   console.log(e);
		 
		   // var Url=e.target.result;//上传文件的URL
		 
		   var Url=this.result;//上传文件的URL
		 
		   box.innerHTML+='<img src="'+Url+'" alt="">';
		 
		  }
		 
		 }
	 },2000)
	 // window.οnlοad=function(){ 
		//  let dropArea = document.getElementById('preview')
		//  // console.log(dropArea);return;
		//  dropArea.addEventListener('drop', this.dropEvent, false)
		//  dropArea.addEventListener('dragleave', (e) => {
		//    e.stopPropagation()
		//    e.preventDefault()
		//    this.dropActive = false
		//  })
		//  dropArea.addEventListener('dragenter', (e) => {
		//    e.stopPropagation()
		//    e.preventDefault()
		//    this.dropActive = true
		//  })
		//  dropArea.addEventListener('dragover', (e) => {
		//    e.stopPropagation()
		//    e.preventDefault()
		//    this.dropActive = true
		//  })
	 // };
     
   },
 
  methods: {

    ...mapActions(['fetchCharList']),
		
	dropEvent(e) {
	      this.dropActive = false
	      e.stopPropagation()
	      e.preventDefault()
	      this.uploadFile(e.dataTransfer.files)
	    },
	
	uploadFile (file) { // 渲染上传文件
	      console.log(file[0], 'file')
	      if (file && file.length) {
	        //自行发挥，存本地或上传服务器
	      }
	    },
    addEmoji(code) {
      preview.innerHTML += code
      console.log(code)
    },


    // 监听粘贴操作
    handlePaste(event) {
      // console.log('监听粘贴---'+this.content);
      var _this = this;
      const items = (event.clipboardData || window.clipboardData).items;
      let file = null;

      if (!items || items.length === 0) {
        this.$message.error(this.$t('dang_qian_liu_lan_qi_bu_zhi_chi_ben_di'));
        return;
      }
      // 搜索剪切板items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
      if (!file) {
        // this.$message.error("粘贴内容非图片");
        return;
      }
      // 此时file就是我们的剪切板中的图片对象
      // 如果需要预览，可以执行下面代码
      const reader = new FileReader();
      reader.onload = event => {

        preview.innerHTML = `<img style="width: 80px;height: 80px;" src="${event.target.result}">`;
        this.content = `<img style="width: 80px;height: 80px;" src="${event.target.result}">`;


        let notesDom = document.getElementById("preview");
        if (window.getSelection) {
          // 兼容 IE11 10 9 ff safari
          // notesDom.focus(); // 解决ff不获取焦点无法定位问题
          let range = window.getSelection(); // 创建range
          range.selectAllChildren(notesDom); // range 选择notesDom下所有子内容
          range.collapseToEnd(); // 光标移至最后
        } else if (document.selection) {
          // 兼容 IE10 9 8 7 6
          let range = document.selection.createRange(); // 创建选择对象
          range.moveToElementText(notesDom); // range定位到notesDom
          range.collapse(false); // 光标移至最后
          range.select();
        }


      };
      reader.readAsDataURL(file);
      this.file = file;

    },
    //上传文件成功后回调
    uploadPlans() {
      let file = this.file;
      if (!file) {
        this.$message.error(this.$t('qing_nian_tie_tu_pian_hou_shang_chuan'));
        return;
      }
      this.loading = true;
      let form = new FormData();
      form.append("file", file);
      form.append("type", this.type);
      //uploadCertificate是封装的axios请求，自己根据需求传参


      upload({
        list_id: _this.selectedChat.list_id,
        _token: localStorage.getItem('token'),
        file: form
      }).then(res => {
        console.log(this.$t('res_shang_chuan_fan_hui'), res);
        _this.$refs.upload_file.value = '';
        if (res.err == 0) {
          let msg = {
            content: {
              url: res.data.save_name,
              h: this.height,
              w: this.width,
              save_pic_path: ''
            },
            type: 2
          }
          console.log(this.content); return;
          textMsg({
            list_id: _this.selectedChat.list_id,
            _token: localStorage.getItem('token'),
            content_type: 2,
            content: JSON.stringify({
              url: res.data.save_name,
              h: this.height,
              w: this.width,
              save_pic_path: '',
              type: 2
            }),
            _agent_id: 1
          }).then(res => {
            _this.$store.dispatch('selectSession', _this.selectId)
          })
          setListTime({
            list_id: _this.selectedChat.list_id,
            _token: localStorage.getItem('token'),
            _agent_id: 1
          })


          _this.$store.dispatch('sendMessage', msg)
        }

      })





      // uploadCertificate(form)
      //   .then(data => {
      //     if (data.data && data.data.success) {
      //       this.certificate_pic = data.data.data.source;
      //       this.$message.success(this.name + "上传成功！");
      //     } else {
      //       this.$message.error(this.name + "上传失败！");
      //     }
      //   }).catch(() => {});
    },









    openEmoji() {
      this.closeMask();
      this.showEmoji = true;
    },
    // 选择好友分享名片
    chooseFriend(item) {
      this.show_friend = false;
      sendCard({
        users: JSON.stringify([item.user_id + '']),
        list_id: this.selectedChat.list_id
      }).then(res => {
        console.log(this.$t('res_fen_xiang_ka_pian'), res);
        this.fetchCharList(this.selectedChat.list_id || '');
      })
    },
    // 选择群聊分享名片
    chooseGroup(item) {
      this.show_group = false;
      sendGroupCard({
        list_ids: JSON.stringify([this.selectedChat.list_id + '']),
        list_id: item.list_id
      }).then(res => {
        console.log(this.$t('res_fen_xiang_qun_liao_ka_pian'), res);
        this.fetchCharList(this.selectedChat.list_id || '');
      })
      // sendGroupCard({
      //   list_ids: JSON.stringify([item.list_id + '']),
      //   list_id:this.selectedChat.list_id
      // }).then(res => {
      //   console.log("res分享群聊卡片", res);
      //   this.fetchCharList(this.selectedChat.list_id || '');
      // })
    },
    // 搜索群聊
    change_group() {
      let arr = [];
      this.all_group_list.forEach(item => {
        if (this.search_group) {
          if (item.show_name.indexOf(this.search_group) > -1) {
            arr.push(item)
          }
        } else {
          arr = this.all_group_list;
        }
      })
      this.group_list = arr;
    },
    // 搜索朋友
    change_friend() {
      let arr = [];
      this.all_friend_list.forEach(item => {
        if (this.search_friend) {
          if (item.name.indexOf(this.search_friend) > -1) {
            arr.push(item)
          }
        } else {
          arr = this.all_friend_list;
        }
      })
      this.friend_list = arr;
    },
    // 选择@人员
    chooseUser(item) {
      this.show_concat = false;
      this.content = '@' + item.show_name;
      preview.innerHTML = '@' + item.show_name;
    },
    // 搜索群成员
    change_member() {
      let arr = [];
      this.all_memeber_list.forEach(item => {
        if (this.search_member) {
          if (item.show_name.indexOf(this.search_member) > -1) {
            arr.push(item)
          }
        } else {
          arr = this.all_memeber_list;
        }
      })
      this.member_list = arr;
    },
    // 获取群成员
    getMembers() {
      getChatDetails({
        list_id: this.selectedChat.list_id
      }).then(res => {
        console.log(this.$t('res_qun_cheng_yuan'), res);
        this.member_list = res.data.member;
        this.all_memeber_list = res.data.member;
        this.show_concat = true;
      })
    },
    // 获取群聊
    getChatList() {
      this.closeMask();
      getChatList().then(res => {
        console.log(this.$t('res_qun_liao'), res);
        let arr = [];
        let data = res.data;
        data.forEach(item => {
          if (item.type == 1) {
            arr.push(item);
          }
        })
        this.group_list = arr;
        this.all_group_list = arr;
        this.show_group = true;
      })
    },
    // 搜索朋友
    getFriendList() {
      this.closeMask();
      getFriendList().then(res => {
        console.log(this.$t('res_peng_you'), res);
        let data = res.data.data;
        let arr = [];
        for (let key in data) {
          data[key].data.forEach(item => {
            arr.push(item);
          })
        }
        this.friend_list = arr;
        this.all_friend_list = arr;
        this.show_friend = true;
      })
    },
    // 打开好友选择框
    openSelectFriend() {
      this.closeMask();
      this.getMembers();
    },
    // 关闭弹窗
    closeMask() {
      this.showEmoji = false;
      this.show_concat = false;
      this.show_friend = false;
      this.show_group = false;
    },
    // 上传图片
    uploadImage() {
      this.closeMask();
      this.$refs.upload_file.click();
    },
    // 上传文件
    uploadFile() {
      this.closeMask();
      this.$refs.upload_file1.click();
    },
    // 上传视频
    uploadVideo() {
      this.closeMask();
      this.$refs.upload_file2.click();
    },
    onkeyDown(e) {
      // console.log('监听键盘按下---'+this.content);
      if (e.key === 'Control') {
        this.flagCtrl = true;
      }
    },
    // 按回车发送信息
    onKeyup(e) {
      // console.log(e.keyCode);
      // console.log('监听键盘抬起---'+this.content);
      // console.log("e",e)
      if (e.key === 'Control') {
        this.flagCtrl = false;
      }
      if (e.keyCode === 13 && this.flagCtrl) {
        this.content = this.content + '\n';
      }
      if (e.keyCode === 13 && !this.flagCtrl) {
        this.send()
      }
    },
    // 消息是否是图片
    isImage(con) {
      // 如果是图片，则转换成图片
      // let reg =
      //   /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i;
      let reg = RegExp(/data:image\/.*;base64,/)
      if (reg.test(con)) {
        return true;
      } else {
        return false;
      }
    },
    parseHtml(html) {
      let _this = this;
      const parser = new Parser({
        onreset() {
          // console.info('reset');
        },
        onopentag(name, attribs) {
          // console.info('opentag', name);
          // console.info('attribs', attribs);
          let content = attribs.src;
          if (_this.isImage(content)) {
            // 如果是base64图片
            _this.uploadBaseFile(content);
          } else {
            // 如果是网络图片
            console.log(this.content); return;
            textMsg({
              list_id: _this.selectedChat.list_id,
              _token: localStorage.getItem('token'),
              content_type: 0,
              content: JSON.stringify({
                text: content
              }),
              _agent_id: 1
            }).then(res => {
              _this.content = '';
              _this.$store.dispatch('selectSession', _this.selectId)
            })
            setListTime({
              list_id: _this.selectedChat.list_id,
              _token: localStorage.getItem('token'),
              _agent_id: 1
            })
            _this.content = ''
          }

          _this.content = ``;
        },
        ontext(text) {
          console.info('text', text);
          // _this.send()
        },
        onclosetag(tagname) {
          console.info('closetag', tagname)
        },
        onopentagname(name) {
          console.info('opentagname', name)
        },
        onend() {
          console.info('onend');
        },
        oncomment(val) {
          console.info('comment', val);
        },
        oncommentend() {
          console.info('commentend');
        },
        oncdatastart() {
          console.info('oncdatastart');
        },
        oncdataend() {
          console.info('oncdataend');
        },
        onprocessinginstruction(name, data) {
          console.info('onprocessinginstruction', name);
          console.info('onprocessinginstruction', data);
        }
      }, {
        recognizeCDATA: true
      })
      parser.parseComplete(html);
    },
    // 点击发送按钮发送信息
    send() {

      this.content = preview.innerHTML

      this.content = this.content.replace("<div><br></div>", "")

      preview.innerHTML = ''

      this.closeMask();
      // console.log(this.content.length < 1);return;
      // this.showEmoji=false;
      if (this.content.length < 1) {
        this.warn = true
        this.content = ''
        setTimeout(() => {
          this.warn = false;
        }, 1000)
      } else {
        var msg = {
          content: this.content,
          type: 0
        }
        if (this.content.indexOf('<img') > -1) {
          this.parseHtml(this.content);
          return
        }
        // console.log(this.content );return;
        // this.content = this.content.replace(/\n/g, "<br/>");

        textMsg({
          list_id: this.selectedChat.list_id,
          _token: localStorage.getItem('token'),
          content_type: 0,
          content: JSON.stringify({
            text: this.content
          }),
          _agent_id: 1
        }).then(res => {
          console.log("res", res);
          this.content = '';
          this.$store.dispatch('selectSession', this.selectId)
          if (res.err == 2) {
            this.$message.error(res.msg);
          }
        }).catch(err => {
          console.log("err", err);
        })
        // setListTime({
        //   list_id: this.selectedChat.list_id,
        //   _token: localStorage.getItem('token'),
        //   _agent_id: 1
        // })
        this.content = ''
      }
    },
    sendClick() {
      var msg = {
        content: this.$t('[_chuo_yi_chuo_]'),
        type: 0
      }
      this.$store.dispatch('sendMessage', msg)
      console.log(this.content); return;
      textMsg({
        list_id: this.selectedChat.list_id,
        _token: localStorage.getItem('token'),
        content_type: 0,
        content: JSON.stringify({
          text: this.$t('[_chuo_yi_chuo_]')
        }),
        msgItem_type: 0,
        _agent_id: 1
      })
      setListTime({
        list_id: this.selectedChat.list_id,
        _token: localStorage.getItem('token'),
        _agent_id: 1
      })
    },
    // 上传图片
    fileChange(e) {
      let _this = this
      let len = e.target.files.length;

      for (var i = 0; i < len; i++) {
        let url = window.URL || window.webkitURL
        let img = new Image();
        let item = e.target.files[i]
        img.src = url.createObjectURL(item)

        img.onload = function () {
          console.log(item);
          upload({
            list_id: _this.selectedChat.list_id,
            _token: localStorage.getItem('token'),
            file: item
          }).then(res => {
            console.log(this.$t('res_shang_chuan_fan_hui'), res);
            _this.$refs.upload_file.value = '';
            if (res.err == 0) {
              let msg = {
                content: {
                  url: res.data.save_name,
                  h: this.height,
                  w: this.width,
                  save_pic_path: ''
                },
                type: 2
              }
              // console.log(this.content );return;
              textMsg({
                list_id: _this.selectedChat.list_id,
                _token: localStorage.getItem('token'),
                content_type: 2,
                content: JSON.stringify({
                  url: res.data.save_name,
                  h: this.height,
                  w: this.width,
                  save_pic_path: '',
                  type: 2
                }),
                _agent_id: 1
              }).then(res => {
                _this.$store.dispatch('selectSession', _this.selectId)
              })
              setListTime({
                list_id: _this.selectedChat.list_id,
                _token: localStorage.getItem('token'),
                _agent_id: 1
              })


              _this.$store.dispatch('sendMessage', msg)
            }

          })
        }
      }


    },
    // 上传文件
    fileChange1(e) {
      let _this = this
      let len = e.target.files.length;
      for (var i = 0; i < len; i++) {
        let item = e.target.files[i];
        // console.log("文件", item);
        // return
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        upload({
          list_id: _this.selectedChat.list_id,
          _token: localStorage.getItem('token'),
          file: item
        }).then(res => {
          _this.$refs.upload_file1.value = '';
          loading.close();
          if (res.err == 0) {
            let data = res.data
            let msg = {
              content: {
                url: data.save_name,
                full_url: data.full_url,
                full_movie: data.full_movie,
                name: item.name,
                length: parseFloat(item.size / 1024).toFixed(2),
                save_pic_path: '',
              },
              type: 11
            };
            if ('save_gif_path' in data) msg.content.save_pic_path = data.save_gif_path;
            if ('save_pic_path' in data) msg.content.save_pic_path = data.save_gif_path;

            let content = {
              url: data.save_name,
              full_url: data.full_url,
              full_movie: data.full_movie,
              name: item.name,
              length: parseFloat(item.size / 1024).toFixed(2),
              save_pic_path: '',
            };
            if ('save_gif_path' in data) content.save_pic_path = data.save_gif_path;
            if ('save_pic_path' in data) content.save_pic_path = data.save_gif_path;
            // console.log(this.content );return;
            textMsg({
              list_id: _this.selectedChat.list_id,
              _token: localStorage.getItem('token'),
              content_type: 11,
              content: JSON.stringify(content),
              _agent_id: 1
            }).then(res => {
              _this.$store.dispatch('selectSession', _this.selectId)
            })
            setListTime({
              list_id: _this.selectedChat.list_id,
              _token: localStorage.getItem('token'),
              _agent_id: 1
            })
            _this.$store.dispatch('sendMessage', msg)
          }

        }).catch(err => {
          loading.close();
        })

      }
    },
    // 上传视频
    fileChange2(e) {
      let _this = this
      let len = e.target.files.length;
      for (var i = 0; i < len; i++) {
        let item = e.target.files[i];
        // console.log("文件", item);
        // return
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        upload({
          list_id: _this.selectedChat.list_id,
          _token: localStorage.getItem('token'),
          file: item
        }).then(res => {
          _this.$refs.upload_file2.value = '';
          loading.close();
          if (res.err == 0) {
            let data = res.data
            let msg = {
              content: {
                url: data.save_name,
                full_url: data.full_url,
                full_movie: data.full_movie,
                name: item.name,
                length: parseFloat(item.size / 1024).toFixed(2),
                save_pic_path: '',
              },
              type: 3
            };
            if ('save_gif_path' in data) msg.content.save_pic_path = data.save_gif_path;
            if ('save_pic_path' in data) msg.content.save_pic_path = data.save_gif_path;

            let content = {
              url: data.save_name,
              full_url: data.full_url,
              full_movie: data.full_movie,
              name: item.name,
              length: parseFloat(item.size / 1024).toFixed(2),
              save_pic_path: '',
            };
            if ('save_gif_path' in data) content.save_pic_path = data.save_gif_path;
            if ('save_pic_path' in data) content.save_pic_path = data.save_gif_path;
            // console.log(this.content );return;
            textMsg({
              list_id: _this.selectedChat.list_id,
              _token: localStorage.getItem('token'),
              content_type: 3,
              content: JSON.stringify(content),
              _agent_id: 1
            }).then(res => {
              _this.$store.dispatch('selectSession', _this.selectId)
            })
            setListTime({
              list_id: _this.selectedChat.list_id,
              _token: localStorage.getItem('token'),
              _agent_id: 1
            })
            _this.$store.dispatch('sendMessage', msg)
          }

        }).catch(err => {
          loading.close();
        })

      }
    },

    random() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16))
    },
    // 上传base64图片
    base64toFile(base64Data, filename) {
      var arr = base64Data.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, {
        type: mime
      })
    },
    uploadBaseFile(base64) {
      let baseFile = this.base64toFile(base64, this.random() + '.png');
      let e = [baseFile];
      let _this = this;
      let len = 1;

      for (var i = 0; i < len; i++) {
        let url = window.URL || window.webkitURL
        let img = new Image();
        let item = baseFile;
        img.src = url.createObjectURL(item)
        img.onload = function () {
          console.log(item);
          upload({
            list_id: _this.selectedChat.list_id,
            _token: localStorage.getItem('token'),
            file: item
          }).then(res => {
            if (res.err == 0) {
              let msg = {
                content: {
                  url: res.data.save_name,
                  h: this.height,
                  w: this.width,
                  save_pic_path: ''
                },
                type: 2
              }
              // console.log(res.data.save_name);return;
              textMsg({
                list_id: _this.selectedChat.list_id,
                _token: localStorage.getItem('token'),
                content_type: 2,
                content: JSON.stringify({
                  url: res.data.save_name,
                  h: this.height,
                  w: this.width,
                  save_pic_path: '',
                  type: 2
                }),
                _agent_id: 1
              }).then(res => {
                _this.content = '';
                _this.$store.dispatch('selectSession', _this.selectId)
              })
              setListTime({
                list_id: _this.selectedChat.list_id,
                _token: localStorage.getItem('token'),
                _agent_id: 1
              })


              _this.$store.dispatch('sendMessage', msg)
            }

          })
        }
      }
    },
  }
}
</script>

<style lang="stylus" scoped>
.text-overflow
  width 250px
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
.concat-content 
  width 320px
  position absolute
  top -375px
  left 4px
  height 360px
  padding 5px
  background-color #fff
  border 1px solid #d1d1d1
  border-radius 2px
  box-shadow 0 1px 2px 1px #d1d1d1
  &.showbox-enter-active, &.showbox-leave-active
    transition all 0.5s
  &.showbox-enter, &.showbox-leave-active
    opacity 0
  .concat-input
    width 100%
    height 60px
    display flex
    align-items center
    box-sizing border-box
    padding 0 10px
  .concat-list
    height 260px
    overflow-y auto
    .concat-item
      height 60px
      display flex
      align-items center
      box-sizing border-box
      padding 0 10px
      cursor pointer
      &:hover
       background #edeff3
      .concat-avatar
        flex-shrink 0
        margin-right 10px
     
  .concat-title
    width 100%
    height 40px
    font-size 14px 
    color #333
    box-sizing border-box
    padding 0 10px
    position relative
    .concat-close
      position absolute
      right 20px;
      top 0
      font-size 24px
      color #333
      cursor pointer
.text1
  position relative
  height 180px
  background #fff
  
  .emoji
    position relative
    width 100%
    height 40px
    line-height 40px
    font-size 12px
    padding 0 10px
    box-sizing border-box
    color #7c7c7c
    .icon-look
      cursor pointer
      &:hover
        color #1aad19
    .emojiBox
      position absolute
      display flex
      flex-wrap wrap
      top -274px
      left 4px
      width 500px
      height 260px
      padding 5px
      background-color #fff
      border 1px solid #d1d1d1
      border-radius 2px
      box-shadow 0 1px 2px 1px #d1d1d1
      &.showbox-enter-active, &.showbox-leave-active
        transition all 0.5s
      &.showbox-enter, &.showbox-leave-active
        opacity 0
      overflow-y auto
      img 
        width 30px !important
        height 30px
        margin 2px
  .upload-file-icon
    position relative
    cursor pointer
    margin 0 8px
    font-size 24px
    &:hover
      color #7bbbff
    &:active
      color #7bbbff
  .upload-file
    position absolute
    width 24px
    height 24px
    box-sizing border-box
    left 0
    top 0
    cursor pointer
    visibility hidden
    z-index 10

  // .upload-file:before
  //   position absolute
  //   content ''
  //   width 18px
  //   height 15px
  //   top 0
  //   left 0
  //   background url('../../assets/images/img.png') no-repeat
  //   background-size 100% 100%
  //   display block
  //   z-index 666
  //   opacity 1
  //   pointer-events none
  .click-icon
    position relative
    width 24px
    height 24px
    top 3px
    background url('../../assets/images/click.png') no-repeat
    background-size 100% 100%
    display inline-block
    cursor pointer
    &:hover
      color #1aad19
  textarea
    box-sizing border-box
    padding 0 20px
    height 110px
    width 100%
    border none
    outline none
    font-family 'Micrsofot Yahei'
    resize none
  .send
    position absolute
    cursor pointer
    bottom 10px
    right 10px
    display flex
    align-items center
    .send_text 
      flex-shrink: 0;
      padding: 0 12px;
      font-size: 12px;
      color: #999;
    .send_btn
      width 90px;
      height 30px;
      border-radius 4px;
      line-height 30px;
      text-align center;
      cursor pointer;
      background linear-gradient(134deg, #44baf8 0%, #3596fc 100%);
      box-shadow 0px 2px 6px #8dbff8;
      color #fff;
      font-size 13px
    
  .warn
    position absolute
    bottom 50px
    right 10px
    width 110px
    height 30px
    line-height 30px
    font-size 12px
    text-align center
    border 1px solid #bdbdbd
    border-radius 4px
    box-shadow 0 1px 5px 1px #bdbdbd
    &.appear-enter-active, &.appear-leave-active
      transition all 1s
    &.appear-enter, &.appear-leave-active
      opacity 0
    &:before
      content ' '
      position absolute
      top 100%
      right 20px
      border 7px solid transparent
      border-top-color #fff
      filter drop-shadow(1px 3px 2px #bdbdbd)
	  
	  
	  #preview:focus
	  
	    border:none;outline:none;
	  
	  
	  
	  
</style>