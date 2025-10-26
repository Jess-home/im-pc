<template>
  <div v-if="selectedChat" class="message">
    <header class="header">
      <div class="friendname">
        <div class="text-overflow">{{ selectedChat.user.name }}</div>

        <span v-if="selectedChat.type == 1">({{ selectedChat.groupImgs.length }})</span>
        <span v-if="selectedChat.type == 0" class="online">({{ user.online === 0 ? "离线" : "在线" }})
          </span>
      </div>
      <!-- <div
        class="header-option"
        v-if="selectedChat.type == 1"
        @click="handleInvite"
      >邀请群成员</div> -->
      <!-- 群管理-old -->
      <!-- <div
        v-if="selectedChat.type == 1"
        class="header-option"
        @click="handleManage"
      >
        <i style="color:#333" class="el-icon-more"></i>
      </div> -->
      <!-- 群管理-new-->
      <div v-if="selectedChat.type == 1" class="header-option" @click="drawer_group_menu = true">
        <i style="color:#333" class="el-icon-more"></i>
      </div>
      <el-popover v-if="selectedChat.type == 0" placement="top-end" width="250" trigger="click"
        @show="showInfo({ userId: getChatFriendId })" v-model="show_userinfo">
        <div class="friendInfo">
          <div v-if="info" class="esInfo">
            <div class="left">
              <div class="people">
                <div class="nickname">
                  <span>{{ info.nickname }}</span>
                  <i style="color:#428dfc;font-size:24px;cursor: pointer;" class="iconfont iconttubiao_bianji"
                    @click="changeRemark(info, selectedChat.user.name)"></i>
                </div>

                <div :class="[
                  info.sex === 1 ? 'gender-male' : 'gender-female',
                ]"></div>
              </div>
              <div class="signature">{{ info.signature }}</div>
            </div>
            <div class="right">
              <img class="avatar" width="60" height="60" :src="photoUrl + info.photo" />
            </div>
          </div>
          <div v-if="info" class="detInfo">
            <div class="remark">
              <span>{{$t('bei')}}&nbsp&nbsp&nbsp{{$t('zhu')}}</span>
              <span :title="$t('dian_ji_xiu_gai_bei_zhu')" style="cursor: pointer" @click="changeRemark(info, selectedChat.user.name)">{{
                selectedChat.user.name }}
              </span>
            </div>
            <div class="area">
              <span>{{$t('lai')}}&nbsp&nbsp&nbsp{{$t('yuan')}}</span><span>{{ info.from }}</span>
            </div>
            <div class="list_id">
              <span>{{$t('wei_xin_hao')}}</span><span>{{ info.username }}</span>
            </div>
          </div>
          <div v-if="info" :title="$t('fen_xiang_ming_pian')" class="tip el-icon-position" @click="handleShare(item)"></div>
          <!-- TODO对话 -->
          <div v-if="info" :title="$t('dui_hua')" class="tip iconfont iconIMweb_news" @click="show_userinfo = false"></div>
          <div v-if="info" :title="$t('shan_chu')" class="tip iconfont iconIMweb_deldte" @click="showDel"></div>
		   <div v-if="info" :title="$t('la_hei')" >{{$t('la_hei')}}
			   <el-switch
					@change="showlahei(info.user_id)"
			     v-model="lahei"
			     active-color="#13ce66"
			     inactive-color="#9e9e9e">
			   </el-switch>
		   </div>
        </div>
        <div slot="reference" class="header-option" v-if="selectedChat.type == 0" style="cursor: pointer;color:black;">
          <i style="color:#333" class="el-icon-more"></i>
        </div>
      </el-popover>
    </header>
    <div v-show="load" ref="list" class="message-wrapper">
      <!-- <div v-if="selectedChat.type == 1" class="notice">
        <p>{{ notice }}</p>
      </div> -->
      <ul v-if="selectedChat.messages &&
        selectedChat.messages[0] &&
        !selectedChat.messages[0].firstShow
        ">
        <li v-for="(item, index) in selectedChat.messages" :key="item.list_id + index" class="message-item">
          <template v-if="(index == 0 && !selectedChat.messages[0].firstShow) || index != 0
            ">
            <template v-if="item.type != 1">
              <div v-if="item.type == 0 &&
                (index == 0 ||
                  item.date - selectedChat.messages[index - 1].date >
                  180 * 1000)
                " class="time">
                <span>{{ formatTime(item.date)}}</span>
              </div>
              <div class="main" :class="{ self: item.self }">
                <el-popover v-if="!item.self" placement="top-start" width="300" trigger="click" @show="showInfo(item)">
                  <div class="friendInfo">
                    <div v-if="info" class="esInfo">
                      <div class="left">
                        <div class="people">
                          <div class="nickname">
                            <span>{{ info.nickname }}</span>
                          </div>
                          <div :class="[
                            info.sex === 1 ? 'gender-male' : 'gender-female',
                          ]"></div>
                        </div>
                        <div class="signature">{{ info.signature }}</div>
                      </div>
                      <div class="right">
                        <img class="avatar" width="60" height="60" :src="photoUrl + info.photo" />
                      </div>
                    </div>
                    <div v-if="info" class="detInfo">
                      <div class="remark">
                        <span>{{$t('bei')}}&nbsp&nbsp&nbsp{{$t('zhu')}}</span>
                        <span :title="$t('dian_ji_xiu_gai_bei_zhu')" style="cursor: pointer"
                          @click="changeRemark(info, selectedChat.user.name)">{{ selectedChat.user.name }}
                        </span>
                      </div>
                      <div class="area">
                        <span>{{$t('lai')}}&nbsp&nbsp&nbsp{{$t('yuan')}}</span><span>{{ info.from }}</span>
                      </div>
                      <div class="list_id">
                        <span>{{$t('wei_xin_hao')}}</span><span>{{ info.username }}</span>
                      </div>

                    </div>
                    <div class="" v-if="(selectedChat ? selectedChat.type : '') == 1">
                      <el-button size="mini" @click="handleNoSend(info.user_id)">{{$t('jin_yan')}}</el-button>
                      <el-button size="mini" @click="handleRemove2(info.user_id)">{{$t('yi_chu_qun_liao')}}</el-button>
                    </div>
                    <div v-if="info" :title="$t('fen_xiang_ming_pian')" class="tip el-icon-position" @click="handleShare(item)"></div>
                  </div>
                  <img slot="reference" class="avatar" width="36" height="36" :src="item.self
                    ? user.img
                    : item.user_info.face
                      ? photoUrl + item.user_info.face
                      : selectedChat.user.img
                    " />
                </el-popover>
                <img v-else-if="!item.self && (selectedChat ? selectedChat.type : '') == 1" slot="reference"
                  class="avatar" width="36" height="36" :src="item.self
                    ? user.img
                    : item.user_info.face
                      ? photoUrl + item.user_info.face
                      : selectedChat.user.img
                    " />
                <img v-else class="avatar" width="36" height="36" :src="item.self ? user.img : selectedChat.user.img" />
                <div :class="item.self ? 'content-main-right' : 'content-main-left'">
                  <div :class="item.self ? 'content-main-user-right' : ''">
                    <div v-if="item.self" class="user-name-right">
                      <span class="user-name-time">{{ formatTime(item.date) }}</span>
                      <!-- TODO群聊群主标签 -->
                      <!-- <span class="user-name-tag">群主</span> -->
                      <span class="user-name-text">{{ item.user_info.name }}</span>
                    </div>
                    <div v-else class="user-name-left">
                      <span class="user-name-text">{{ item.user_info.name }}</span>
                      <!-- TODO群聊群主标签 -->
                      <!-- <span class="user-name-tag">群主</span> -->
                      <span class="user-name-time">{{ formatTime(item.date)}}</span>
                    </div>
                    <!-- 个人名片 -->

                    <el-checkbox v-model="checked[item.msg_id]"
                      @change="duo(item.content.text ? item.content.text : item.content.url, checked[item.msg_id])"></el-checkbox>


                    <div class="content" :class="(item.msgItem_type == 8 || item.msgItem_type == 12) ? 'card' : ''"
                      @contextmenu.prevent="(e) => handleOption(e, item)">
                      <div v-if="item.msgItem_type == 0 && !isImage(item.content.text)" class="text"
                        v-html="replaceFace(item.content.text)"></div>
                      
                      <el-image v-if="item.msgItem_type == 0 && isImage(item.content.text)" style="width: 166px"
                        :src="item.content.text" :preview-src-list="[item.content.text]">
                      </el-image>
					 
                      <el-image v-if="item.msgItem_type == 2" style="width: 166px" :src="chatUrl + (item.content.list_id ? item.content.list_id : selectedChat.list_id) + '/' + item.content.url
                        " :preview-src-list="[
    chatUrl + (item.content.list_id ? item.content.list_id : selectedChat.list_id) + '/' + item.content.url,
  ]">
                      </el-image>

						<!-- 语言消息 -->
						<div v-if="item.msgItem_type==1"  @click="playVoice(item,index)">
							<i :ref="`videoplay${index}`"  
							 class="el-icon-video-play"
							  style="margin-right: 10px;font-size: 18px"></i>
							<span class="length">{{item.content.length}}</span>
						</div>
						<!--戳一戳-->
						<div v-if="item.msgItem_type==9" class="bubble img">
							<img src="/static/theme/default/chuo.gif" :lazy-load="true"
								style="height: 50px;width: 90px;" mode="heightFix" />
						</div>

                      <!-- 个人名片 -->
                      <el-popover placement="top" width="250" trigger="click">
                        <div class="friendInfo">
                          <div class="esInfo">
                            <div class="left">
                              <div class="people">
                                <div class="nickname">
                                  <span>{{ item.content.nickname }}</span>
                                </div>
                              </div>
                              <div class="signature">{{ item.content.signature }}</div>
                            </div>
                            <div class="right">
                              <img class="avatar" width="60" height="60" :src="photoUrl + item.content.face" />
                            </div>
                          </div>
                          <div class="detInfo">
                            <div class="list_id">
                              <span>UID</span><span>{{ item.content.user_id }}</span>
                            </div>
                          </div>
                          <!-- TODO对话 -->
                          <!-- <div
                            :title="$t('dui_hua')"
                            class="tip iconfont iconIMweb_news"
                          ></div> -->
                          <!-- TODO添加 -->
                          <div :title="$t('tian_jia')" class="tip iconfont iconIMweb_addfriends"></div>
                        </div>
                        <div slot="reference" v-if="item.msgItem_type == 8" class="send-card">
                          <div class="send-card-content">
                            <img width="42" height="42" :src="photoUrl + item.content.face" alt="" />
                            <span style="margin-left: 12px">{{
                              item.content.nickname
                            }}</span>
                          </div>
                          <div class="send-card-content-text">
                            <i style="font-size:16px" class="el-icon-user-solid"></i>
                            <span>{{$t('ge_ren_ming_pian')}}</span>
                          </div>
                        </div>
                      </el-popover>
                      <!-- 群聊名片 -->
                      <div slot="reference" v-if="item.msgItem_type == 12" class="send-card">
                        <div class="send-card-content">
                          <img width="42" height="42" :src="baseUrl + item.content.img" alt="" />
                          <span style="margin-left: 12px">{{
                            item.content.text
                          }}</span>
                        </div>
                        <div class="send-card-content-text">
                          <i style="font-size:16px" class="el-icon-user-solid"></i>
                          <span>{{$t('qun_ming_pian')}}</span>
                        </div>
                      </div>
                      <!-- 视频类型消息 -->
                      <div class="video-msg" v-if="item.msgItem_type == 3">
                        <!-- {{item}} -->
                        <el-image fit="contain" :src="chatUrl + item.content.full_movie" alt="" />
                        <i class="play el-icon-video-play" @click="open_show_video(item)"></i>
                      </div>
					  
					  
					 
					  
					  
                      <!-- 文件类型消息 -->
                      <div class="file-msg" v-if="item.msgItem_type == 11" @click="openFile(item)">
                        <div class="file-content">
                          <span>{{ item.content.name }}</span>
                          <span style="color:#999;" v-if="item.content.length < 1024">{{ item.content.length }}KB</span>
                          <span style="color:#999;" v-else>{{ parseFloat(item.content.length / 1024).toFixed(2)
                          }}MB</span>
                        </div>
                        <div class="file-type">
                          <img v-if="item.content.url && item.content.url.indexOf('docx') > -1"
                            src="@/assets/images/msglist/world.png" alt="" />
                          <img
                            v-else-if="item.content.url && (item.content.url.indexOf('jpg') > -1 || item.content.url.indexOf('png') > -1)"
                            src="@/assets/images/msglist/jpg.png" alt="" />
                          <img
                            v-else-if="item.content.url && (item.content.url.indexOf('xls') > -1 || item.content.url.indexOf('xlsx') > -1)"
                            src="@/assets/images/msglist/xls.png" alt="" />
                          <img v-else-if="item.content.url && item.content.url.indexOf('mp4') > -1"
                            src="@/assets/images/msglist/mp4.png" alt="" />
                          <img v-else-if="item.content.url && item.content.url.indexOf('mp3') > -1"
                            src="@/assets/images/msglist/mp3.png" alt="" />
                          <img v-else-if="item.content.url && item.content.url.indexOf('pdf') > -1"
                            src="@/assets/images/msglist/pdf.png" alt="" />
                          <img
                            v-else-if="item.content.url && (item.content.url.indexOf('ppt') > -1 || item.content.url.indexOf('pptx') > -1)"
                            src="@/assets/images/msglist/ppt.png" alt="" />
                          <img v-else-if="item.content.url && item.content.url.indexOf('zip') > -1"
                            src="@/assets/images/msglist/zip.png" alt="" />
                          <img v-else-if="item.content.url && item.content.url.indexOf('apk') > -1"
                            src="@/assets/images/msglist/apk.png" alt="" />
                          <img v-else-if="item.content.url && item.content.url.indexOf('txt') > -1"
                            src="@/assets/images/msglist/txt.png" alt="" />
                          <img v-else src="@/assets/images/msglist/notRecogn.png" alt="" />
                        </div>
                      </div>
                      <div v-if="item.self && showTip && item.read !==''" class="read-state" @click="yiduliebiao()">
                        <span style="color:#07c427;font-weight: bold;" v-if="item.read"><img style="width: 25px;" src="@/assets/images/read.png" alt="" /></span>
                        <span style="color:#fc0005;font-weight: bold;" v-else><img style="width: 25px;" src="@/assets/images/unread.png" alt="" /></span>
                      </div>
                      
                    </div>
                    <div v-if="item.liked > 0" class="heart-icon">❤️
                      <div class="like-count">{{ item.liked }}</div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </template>
            <div v-if="item.type == 1">
              <div v-if="item.content.text" class="time">
                <span>{{ item.content.text }}</span>
              </div>
            </div>
          </template>
        </li>
      </ul>
    </div>
    <div v-show="menuVisible" id="contextmenu-msg" class="contextmenu-msg_menu">
      <div class="contextmenu-msg__item" @click="handleSetting(4)">复制</div>
      <div class="contextmenu-msg__item" @click="handleSetting(6)">点赞</div>
      <div v-if="currentRow.self || is_action > 0" class="contextmenu-msg__item" @click="handleSetting(1)">
        删除
      </div>
      <div class="contextmenu-msg__item" @click="handleSetting(2)">收藏</div>
      <div class="contextmenu-msg__item" @click="handleSetting(3)">转发</div>
      <div class="contextmenu-msg__item" @click="duoxuan(3)">多选转发</div>
      <div class="contextmenu-msg__item" @click="kickOut()"
        v-if="(selectedChat ? selectedChat.type : '') == 1 && !currentRow.self && group_info_all.is_action > 0">踢出该成员
      </div>
      <div class="contextmenu-msg__item" @click="handleNoSend(currentRow.userId)"
        v-if="(selectedChat ? selectedChat.type : '') == 1 && !currentRow.self && group_info_all.is_action > 0">禁言
      </div>

    </div>
    <selectUser ref="selectUser" title="消息转发" tip="分别转发给" @handleOk="handleOk"></selectUser>
    <selectUser ref="selectInvite" title="邀请新成员" tip="" :default="defaultList" @handleOk="handleInvited"></selectUser>
    <selectUser ref="handleShare" title="分享名片" tip="分别转发给" :multiple="false" @handleOk="handleShared"></selectUser>
    <selectGroupUser ref="group_member" title="移出群成员" :members="members" @save="handleRemoved"></selectGroupUser>
    <selectGroupUser ref="group_manage" title="设置管理员" :members="members" @save="handleSetManaged"></selectGroupUser>
    <selectGroupUser ref="group_trans" title="转让群主" :limit="1" :members="members" @save="handleTransed"></selectGroupUser>


    <Manage ref="manage" :list_id="selectedChat.list_id" @changeGroupName="changeGroupName" @invite="handleInvite"
      @remove="handleRemove" @setmanage="handleSetManage" @trans="handleTrans"></Manage>
    <el-dialog title="" top="30vh" custom-class="custom-dialog" width="300px" :visible.sync="show_del">
      <div class="dialog-body">
        <div class="dialog-item">
          确认删除当前好友，
        </div>
        <div class="dialog-item">
          同时删除与该好友的所有聊天记录？
        </div>
      </div>
      <div slot="footer" class="change-btns dialog-footer">
        <button class="primarybtn default" @click="show_del = false">取 消</button>
        <!-- TODO修改用户信息 -->
        <button class="primarybtn" type="primary" @click="delFriend">删除</button>
      </div>
    </el-dialog>
    <el-dialog :title="current_video.name" custom-class="custom-dialog" width="600px" :visible.sync="show_video">
      <video width="600" controls :src="chatUrl + current_video.full_url"></video>
    </el-dialog>
    <!-- TODO群管理new -->
    <el-drawer :visible.sync="drawer_group_menu" :show-close="false" size="33%" :with-header="false">
      <div class="draw-container">
        <div class="draw_header">
          <el-tabs v-model="active_group_menu" @tab-click="handleGroupClick">
            <el-tab-pane label="群信息" name="1">
              <div class="draw-content">
                <div class="grour_title">
                  <!-- 群头像 -->
                  <el-upload
                    style="width:60px;height:60px;background:#e2e2e2;display: flex;align-items:center;justify-content:center;"
                    action="" :show-file-list="false" :auto-upload="false" :on-change="handleAvatar">
                    <img v-if="group_info.is_photo" style="width:60px;height:60px;background:#e2e2e2;"
                      :src="group_info.is_photo" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <!-- <el-image style="width:60px;height:60px;background:#e2e2e2;" :src="photoUrl + group_info.is_photo"></el-image> -->
                  <div class="group_name">
                    <span @click="showChangeGroupName = true">{{ group_info.name }}</span>
                  </div>
                  <i title="分享" class="el-icon-position share-icon"></i>
                </div>
                <div class="group_info">
                  <div class="group_item">
                    <span>群人数</span>
                    <span class="black">{{ group_members.length }}人</span>
                  </div>


                  <el-collapse>
                    <el-collapse-item title="群公告" name="1">
                      <div class="group_item">
                        <div class="notice">
                          <div :class="!is_show ? 'notice_detail ' : 'notice_detail_all'">{{ group_info.notice
                          }}</div>
                          <span class="shownotice" @click.stop="is_show = !is_show"
                            v-if="group_info.notice && group_info.notice.length > 65">{{
                              words
                            }}</span>
                        </div>
                        <i @click="showChangeNotice = true"
                          style="font-size: 20px; color: rgb(66, 141, 252); cursor: pointer;"
                          class="iconfont iconttubiao_bianji"></i>
                      </div>
                    </el-collapse-item>
                  </el-collapse>

                  <div class="group_item">
                    <span>我在本群昵称</span>
                    <span class="black">{{ group_info_all.my_nickname }}</span>
                    <i @click="showChangeNickName = true"
                      style="font-size: 20px; color: rgb(66, 141, 252); cursor: pointer;"
                      class="iconfont iconttubiao_bianji"></i>
                  </div>
                  <div class="g_list">
                    <!-- <div class="g_item w200">
                      <div>置顶聊天</div>
                      <div class="align-center">
                        <el-switch v-model="group_info_all.top" @change="changeTop"> </el-switch>
                      </div>
                    </div> -->
                    <div class="g_item w200">
                      <div>消息免打扰</div>
                      <div class="align-center">
                        <el-switch v-model="group_info_all.is_disturb" @change="changeDisturb">
                        </el-switch>
                      </div>
                    </div>
                  </div>
                </div>
                <el-button class="get_out_btn" @click="removeGroup">退出群</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="群成员" name="2">
              <div class="draw-content">
                <div class="search-wrapper">
                  <i v-show="noText" class="el-icon-search" style="color:#ccc"></i>
                  <input v-model="search_member" type="text" class="searchInput" placeholder="搜索" @keyup="change_member">
                  <div v-show="haveText" class="searchInput-delete1" @click="del_member">
                    <i style="color:#ccc" class="el-icon-close "></i>
                  </div>
                </div>
                <div>
                </div>
                <div class="members-list">
                  <div class="member-item" @click="handleInvite">
                    <div class="member-img">
                      <i class="iconfont iconttubiao_addpeople"></i>
                    </div>
                    <span>添加</span>
                  </div>
                  <div class="member-item">
                    <div class="member-img" @click="handleRemove">
                      <i class="iconfont iconttubiao_Less"></i>
                    </div>
                    <span>删除</span>
                  </div>
                  <!-- 群成员信息 -->
                  <div class="member-item" v-for="(item, index) in group_members" :key="index">
                    <el-popover width="250" trigger="click" :ref="'popover' + index">
                      <div class="friendInfo">
                        <div class="esInfo">
                          <div class="left">
                            <div class="people">
                              <div class="nickname">
                                <span>{{ maskText(item.show_name) }}</span>
                                <i @click="changeRemark(item, item.show_name, index)" v-if="item.is_friend"
                                  class="iconfont iconttubiao_bianji"
                                  style="font-size: 20px; color: rgb(66, 141, 252); cursor: pointer;"></i>
                              </div>
                            </div>
                          </div>
                          <div class="right xxxxxxxxxx">
                            <img class="avatar" width="60" height="60" :src="photoUrl + item.photo" />

                          </div>
                        </div>
                        <div class="detInfo">
                          <div class="remark">
                            <span>UID</span>
                            <span>{{ item.user_id }}</span>
                          </div>
                          <div v-if="item.show_name" class="remark">
                            <span>昵称</span>
                            <span>{{ maskText(item.show_name) }}</span>
                          </div>
                        </div>
                        <div title="对话" v-if="item.is_friend" class="tip iconfont iconIMweb_news"
                          @click="send(item, index)"></div>
                        <div title="添加" v-if="!item.is_friend && item.user_id != user.uid"
                          class="tip iconfont iconIMweb_addfriends" @click="addFriend(item, index)"></div>
                      </div>
                      <div slot="reference" class="member-img">

                        <img v-if="item.is_admin == 2" src="../../static/img/zhu.png" alt="">
                        <img v-else-if="item.is_admin == 1" src="../../static/img/guan.png" alt="">
                        <img v-else :src="photoUrl + item.photo" alt="">
                      </div>
                    </el-popover>
                    <span>{{ item.show_name }}</span>
                  </div>
                </div>

              </div>

            </el-tab-pane>
            <el-tab-pane v-if="group_info_all.is_action > 0" label="群管理" name="3">
              <div class="g_list">
                <div class="g_item">
                  <div>全员禁言</div>
                  <div class="align-center">
                    <el-switch v-model="group_info.is_msg==1?true:false" @change="changeIsMsg">
                    </el-switch>
                  </div>
                </div>
                <div class="g_item">
                  <div>群内禁止加好友</div>
                  <div class="align-center">
                    <el-switch v-model="group_info.can_add_friend==1?true:false" @change="changeAddFriend">
                    </el-switch>
                  </div>
                </div>
                <div v-if="group_info_all.is_action == 2" class="g_item" @click="handleSetManage">
                  <div>设置管理员</div>
                  <div class="align-center">
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
                <div v-if="group_info_all.is_action == 2" class="g_item" @click="handleTrans">
                  <div>群主转让</div>
                  <div class="align-center">
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="back-icon" @click="drawer_group_menu = false">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </el-drawer>
    <!-- 群公告 -->
    <el-dialog width="400px" title="群公告" :visible.sync="showChangeNotice" append-to-body>
      <el-input v-model="notice" type="textarea" :rows="5" placeholder="请输入群公告"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveNotice">保存</el-button>
      </span>
    </el-dialog>
    <!-- 我在本群的昵称 -->
    <el-dialog width="400px" title="我在本群的昵称" :visible.sync="showChangeNickName" append-to-body>
      <el-input v-model="group_info_all.my_nickname" placeholder="请输入你在本群的昵称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveNickName">保存</el-button>
      </span>
    </el-dialog>
    <!-- 群昵称 -->
    <el-dialog width="400px" title="群昵称" :visible.sync="showChangeGroupName" append-to-body>
      <el-input v-model="group_info.name" placeholder="请输入群昵称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveGroupName">保存</el-button>
      </span>
    </el-dialog>
    <UserListModal 
      :visible.sync="showModal" 
      :list="userList"
    />
  </div>
</template>

<script>
import {
  fetchInfo,
  withdraw,
  setRemarks,
  sendCard,
  saveStore,
  textMsgs,
  addChat,
  removeChat,
  getChatDetails,
  getGroupAdmin,
  setGroupAdmin,
  transferQun,
  setGroupData,
  signOut,
  saveGroupNickName,
  msgDisturb,
  chatTop,
  groupPhoto,
  upGroupPhoto,
  groupIsMsg,
  editChange,
  getListId,
  friendAdd,
  fetchlahei,
  dianzan,
  groupState
} from '@/api';
import { mapGetters, mapState, mapActions } from 'vuex';
import selectUser from '@/components/selectUser';
import selectGroupUser from '@/components/selectGroupUser';
import Manage from '@/components/manage';
import UserListModal from '@/components/userlistmodal/userlistmodal.vue';
const { photoUrl, chatUrl, baseUrl } = window.__gconf;
export default {
  components: {
    selectUser,
    Manage,
    selectGroupUser,
    UserListModal
  },
  // ❌ 删除 filters,改用 methods
  props: {
    type: 0
  },
  data() {
    return {
      lahei: false,//拉黑
      checked: [],
      checkedlist: [],
      is_show: false,
      photoUrl: photoUrl,
      chatUrl: chatUrl,
      baseUrl: baseUrl,
      showTip: false,
      info: {},
      menuVisible: false,
      currentRow: {},
      load: false,
      isFirst: false,
      defaultList: [],
      shareItem: {},
      notice: '', //群公告
      members: [],//群成员
      is_action: '',//权限

      show_del: false,//显示删除好友
      show_userinfo: false,//显示用户信息
      show_video: false,//显示视频
      current_video: {
      },//当前选择视频

      drawer_group_menu: false,//打开群管理
      active_group_menu: '1',

      group_info: {},//群信息
      group_members: [],//群成员
      search_member: '',//搜索群成员
      group_info_all: {},//群的所有信息

      showChangeNotice: false,//显示修改群公告
      showChangeNickName: false,//显示修改我在本群昵称
      showChangeGroupName: false,//显示修改群昵称
      show_member_info: false,//显示群成员信息
      myAuto: '',
      isPlay: false,
      showModal: false,
      userList: []
    };
  },
  computed: {
    ...mapGetters(['selectedChat', 'messages', 'getChatFriendId']),
    ...mapState(['user', 'emojis', 'groupChat', 'selectId']),
    noText() {
      if (this.search_member === '') return true
      return false
    },
    haveText() {
      if (this.search_member === '') return false
      return true
    },
    words() {
      if (this.is_show === false) {
        return this.$t('cha_kan_quan_bu');
      } else if (this.is_show === true) {
        return this.$t('shou_qi_quan_bu');
      } else if (this.is_show === "") {
        return null;
      } else {
        return null;
      }
    },
  },
  watch: {
    // 发送信息后,让信息滚动到最下面
    'selectedChat.messages': {
      handler: function (a) {
        if (!this.isFirst) {
          this.load = false;
        }
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.list
              ? (this.$refs.list.scrollTop = this.$refs.list.scrollHeight)
              : '';

            this.load = true;
            this.isFirst = true;
          }, 0);
        });
      },
      deep: true
    },
    'selectedChat.chat_id': {
      handler: function (a) {
        this.showTip = true;
        if ((this.selectedChat ? this.selectedChat.type : '') == 1) {
          this.getGroupInfo();
        }
      },
      immediate: true,
    }
  },
  mounted() {
    //  在页面加载时让信息滚动到最下面
    if (this.$refs.list)
      setTimeout(() => {
        this.$refs.list.scrollTop = this.$refs.list.scrollHeight;
      }, 0);
  },
  destroyed() {
    this.$store.dispatch('clearIntervalTimer');
  },
  methods: {
    ...mapActions(['selectFriend2', 'fetchCharList', 'fetchFriendList']),
    
    // ⭐ 新增: 将 filter time 改为 method formatTime
    formatTime(timestamp) {
      timestamp = new Date(timestamp).valueOf() / 1000;
      let curTimestamp = parseInt(new Date().getTime() / 1000), //当前时间戳
        timestampDiff = curTimestamp - timestamp, // 参数时间戳与当前时间戳相差秒数
        curDate = new Date(curTimestamp * 1000), // 当前时间日期对象
        tmDate = new Date(timestamp * 1000), // 参数时间戳转换成的日期对象
        Y = tmDate.getFullYear(),
        m = tmDate.getMonth() + 1,
        d = tmDate.getDate(),
        H = tmDate.getHours(),
        i = tmDate.getMinutes(),
        s = tmDate.getSeconds();
      
      if (
        curDate.getFullYear() == Y &&
        curDate.getMonth() + 1 == m &&
        curDate.getDate() == d
      ) {
        return (
          this.$t('jin_tian') +
          ((String(H).length == 1 ? '0' : '') + H) +
          ':' +
          ((String(i).length == 1 ? '0' : '') + i)
        );
      } else {
        var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
        if (
          newDate.getFullYear() == Y &&
          newDate.getMonth() + 1 == m &&
          newDate.getDate() == d
        ) {
          return (
            this.$t('zuo_tian') +
            ((String(H).length == 1 ? '0' : '') + H) +
            ':' +
            ((String(i).length == 1 ? '0' : '') + i)
          );
        } else if (curDate.getFullYear() == Y) {
          return (
            (String(m).length == 1 ? '0' : '') +
            m +
            '-' +
            ((String(d).length == 1 ? '0' : '') + d) +
            ' ' +
            ((String(H).length == 1 ? '0' : '') + H) +
            ':' +
            ((String(i).length == 1 ? '0' : '') + i)
          );
        } else {
          return (
            Y +
            this.$t('nian') +
            ((String(m).length == 1 ? '0' : '') + m) +
            this.$t('yue') +
            ((String(d).length == 1 ? '0' : '') + d) +
            this.$t('ri') +
            ((String(H).length == 1 ? '0' : '') + H) +
            ':' +
            ((String(i).length == 1 ? '0' : '') + i)
          );
        }
      }
    },
    
    // 播放语音
    playVoice(msg, index) {
      this.isPlay = !this.isPlay
      this.$refs[`videoplay${index}`][0].style.cssText = "color: red;margin-right: 10px;font-size: 18px"
      this.$refs[`videoplay${index}`][0].setAttribute("class", "el-icon-video-pause");
      this.myAuto = new Audio(chatUrl + msg.content.full_url)
      if (this.isPlay) {
        this.myAuto.play();
        this.palyEnd(index);
      } else {
        this.myAuto.pause();
        this.palyEnd(index);
      }
    },
    
    //截取字符串
    maskText(str) {
      if (!str || str.length <= 4) return str;
      return str.substring(0, 2) + '**' + str.substring(str.length - 2);
    },
    
    palyEnd(index) {
      this.myAuto.addEventListener('ended', () => {
        this.isPlay = !this.isPlay
        this.$refs[`videoplay${index}`][0].style.cssText = "margin-right: 10px;font-size: 18px"
        this.$refs[`videoplay${index}`][0].setAttribute("class", "el-icon-video-play");
      });
    },
    
    yiduliebiao() {
      groupState({
        _token: localStorage.getItem('token'),
        list_id: this.group_info.list_id,
      }).then((res) => {
        this.userList = res.data.chat_read
        this.showModal = true
      });
    },
    
    // 添加好友
    addFriend(item, index) {
      if (this.group_info.can_add_friend == 1) {
        this.$message.error(this.$t('wu_quan_tian_jia'))
        return false;
      }
      this.$refs['popover' + index][0].showPopper = false;
      this.$prompt(this.$t('ni_xu_yao_fa_song_yan_zheng_shen_qing_,_deng_dui_fang_tong_guo'), this.$t('peng_you_yan_zheng'), {
        confirmButtonText: this.$t('que_ding'),
        cancelButtonText: this.$t('qu_xiao')
      }).then(({ value }) => {
        friendAdd({
          user_id: item.user_id,
          is_type: 0,
          content: value,
          qun_id: this.group_info.list_id,
          qun_type: 1
        }).then(res => {
          this.$message.success(this.$t('shen_qing_cheng_gong'))
          this.drawer_group_menu = false;
        })
      })
    },
    
    async send(item, index) {
      this.$refs['popover' + index][0].showPopper = false;
      console.log("item.user_id", item.user_id);
      console.log("this.$store.state.friendlist", this.$store.state.friendlist);
      let result = this.$store.state.friendlist.find(friend => friend.id === item.user_id);
      console.log("result", result);
      let msg = this.$store.state.chatlist.find(msg => msg.user.name === result.remark);
      let list_id = result.list_id
      if (!msg) {
        await getListId({
          user_id: user_id
        }).then(res => {
          list_id = res.data.list_id
        })
      }

      if (msg) {
        this.$store.state.selectId = list_id
        this.$store.dispatch('selectSession', list_id)
        this.$router.push({ path: '/chat' })
      } else {
        this.$store.dispatch('selectSession', list_id)
      }
      this.drawer_group_menu = false;
    },
    
    //设置群头像
    handleAvatar(file, list) {
      groupPhoto({
        _token: localStorage.getItem('token'),
        list_id: this.selectedChat.list_id,
        file: file.raw
      }).then((res) => {
        upGroupPhoto({
          _token: localStorage.getItem('token'),
          list_id: this.selectedChat.list_id
        }).then((data) => {
          let url = window.URL || window.webkitURL;
          console.log(data);
          this.group_info.is_photo = url.createObjectURL(file.raw);
          this.drawer_group_menu = false;
          this.changeGroupName();
        });
      });
    },
    
    // 置顶聊天
    changeTop(e) {
      console.log('e', e);
      chatTop({
        list_id: this.selectedChat.list_id,
        value: e ? 1 : 0
      }).then((res) => {
        this.group_info_all.top = e;
        this.drawer_group_menu = false;
        this.changeGroupName();
      });
    },
    
    // 消息免打扰
    changeDisturb(e) {
      msgDisturb({
        list_id: this.selectedChat.list_id,
        value: e ? 1 : 0
      }).then((res) => {
        this.group_info_all.is_disturb = e;
        this.$forceUpdate();
        this.drawer_group_menu = false;
        this.changeGroupName();
      });
    },
    
    // 群昵称
    saveGroupName() {
      setGroupData({
        list_id: this.selectedChat.list_id,
        type: 'name',
        content: this.group_info.name
      }).then((res) => {
        this.$message.success(res.msg);
        this.showChangeGroupName = false;
        this.drawer_group_menu = false;
        this.changeGroupName();
      });
    },
    
    // 保存我在本群昵称
    saveNickName() {
      saveGroupNickName({
        nickname: this.group_info_all.my_nickname,
        list_id: this.selectedChat.list_id
      }).then((res) => {
        this.$message.success(res.msg);
        this.showChangeNickName = false;
        this.drawer_group_menu = false;
        this.changeGroupName();
      });
    },
    
    // 退出群聊
    removeGroup() {
      signOut({
        list_id: this.selectedChat.list_id,
      }).then(res => {
        this.$message.success(res.msg);
        this.drawer_group_menu = false;
        this.changeGroupName();
      })
    },
    
    //   判断权限
    hasPerm() {
      if (!this.group_info_all.is_action && this.group_info_all.is_action != 2) {
        return false;
      } else {
        return true;
      }
    },
    
    // 修改公告
    saveNotice() {
      if (!this.hasPerm()) {
        this.$message.error(this.$t('mei_you_quan_xian_she_zhi'));
        return;
      }
      setGroupData({
        list_id: this.selectedChat.list_id,
        type: 'notice',
        content: this.notice
      }).then((res) => {
        this.showChangeNotice = false;
        this.drawer_group_menu = false;
        this.changeGroupName();
      });
    },
    
    // 禁止加好友
    changeAddFriend(e) {
      editChange({
        list_id: this.selectedChat.list_id,
        value: e ? 1 : 0
      })
        .then((res) => {
          console.log("res", res);
          this.group_info.can_add_friend = e;
          this.$forceUpdate();
          this.$message.success(this.$t('qie_huan_cheng_gong'));
          this.drawer_group_menu = false;
          this.changeGroupName();
        })
        .catch((err) => {
          console.log('err', err);
          this.group_info.can_add_friend = !this.group.can_add_friend;
          this.$forceUpdate();
        });
    },
    
    // 全员禁言
    changeIsMsg(e) {
      groupIsMsg({
        list_id: this.selectedChat.list_id,
        value: e ? 1 : 0
      })
        .then((res) => {
          this.group_info.is_msg = e;
          this.$forceUpdate();
          this.$message.success(this.$t('qie_huan_cheng_gong'));
          this.drawer_group_menu = false;
          this.changeGroupName();
        })
        .catch((err) => {
          console.log('err', err);
          this.$forceUpdate();
          this.group_info.is_msg = !this.group.is_msg;
        });
    },
    
    // 搜索群成员
    change_member() {
      let arr = [];
      this.group_info_all.member.forEach(item => {
        if (this.search_member) {
          if (item.show_name.indexOf(this.search_member) > -1) {
            arr.push(item)
          }
        } else {
          arr = this.group_info_all.member;
        }
      })
      this.group_members = arr;
    },
    
    del_member() {
      this.search_member = '';
      this.change_member()
    },
    
    // 群管理菜单切换
    handleGroupClick(tab, event) {
      console.log(tab, event);
    },
    
    // 打开视频播放
    open_show_video(item) {
      console.log(item);
      this.show_video = true;
      this.current_video = item.content;
    },
    
    // 打开文件
    openFile(item) {
      window.open(this.chatUrl + this.selectedChat.list_id + '/' + item.content.url)
    },
    
    showDel() {
      this.show_del = true;
      this.show_userinfo = false;
    },
    
    // 拉黑好友
    showlahei(friend_id) {
      var _this = this;
      fetchlahei({
        lahei: this.lahei,
        friend_id: friend_id
      }).then((res) => {
        console.log(res)
        if (res.code) {
          this.$message.success(this.$t('cao_zuo_cheng_gong'));
        } else {
          this.$message.error(this.$t('cao_zuo_shi_bai'));
        }
        _this.fetchInfo()
      });
    },
    
    delFriend() {
      this.show_del = false;
      removeFriend({
        user_id: this.info.user_id
      }).then(res => {
        this.$emit("refresh");
        this.fetchFriendList();
        localStorage.setItem('vue-chat', []);
        this.fetchCharList();
      })
    },
    
    // 消息是否是图片
    isImage(con) {
      let reg = /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i;
      let reg2 = RegExp(/data:image\/.*;base64,/)
      if (reg.test(con) || reg2.test(con)) {
        return true;
      } else {
        return false;
      }
    },
    
    // 打开好友信息
    handleFriendInfo() {
      console.log("getChatFriendId", this.getChatFriendId);
      this.showInfo({ userId: this.getChatFriendId })
    },
    
    changeGroupName() {
      this.fetchCharList(this.selectedChat.list_id || '');
      this.getGroupInfo();
    },
    
    changeRemark(item, remark, index) {
      this.$prompt(this.$t('qing_shu_ru_bei_zhu_xin_xi'), '', {
        confirmButtonText: this.$t('que_ding'),
        cancelButtonText: this.$t('qu_xiao'),
        inputPattern: /\S/,
        inputValue: remark,
        inputErrorMessage: this.$t('bei_zhu_xin_xi_bu_neng_wei_kong')
      }).then(({ value }) => {
        setRemarks({
          content: value,
          user_id: item.user_id
        }).then((res) => {
          console.log("index", index);
          if (index !== undefined) {
            this.$refs['popover' + index][0].showPopper = false;
            this.drawer_group_menu = false;
            this.changeGroupName();
            return
          }
          this.fetchCharList(this.selectId || '');
        });
      });
    },
    
    // 群信息
    getGroupInfo() {
      getChatDetails({
        list_id: this.selectedChat.list_id
      }).then((res) => {
        this.group_info = res.data.group;
        console.log(this.$t('res_qun_xin_xi'), this.group_info.can_add_friend);
        this.group_members = res.data.member;
        
        // 群成员是否是好友
        let friends = this.$store.state.friendlist;
        this.group_members.forEach(item => {
          friends.forEach(item_ => {
            if (item.user_id == item_.id) {
              item.is_friend = true;
            }
          })
        });
        
        this.group_info_all = res.data;
        this.group_info_all.is_disturb = Boolean(this.group_info_all.is_disturb);
        this.group_info_all.top = Boolean(this.group_info_all.top);
        this.group_info.is_photo = this.photoUrl + this.group_info.is_photo + '?_=' + Math.random();
        this.notice = res.data.group.notice;
        this.is_action = res.data.is_action;
      });
    },
    
    // 转让群主
    handleTrans() {
      getGroupAdmin({
        type: 3,
        list_id: this.selectedChat.list_id
      })
        .then((res) => {
          console.log('res', res);
          if (res.err == 0) {
            let arr = res.data.list;
            this.members = arr;
            this.$refs.group_trans.open();
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch((err) => {
          this.$refs.group_trans.close();
        });
    },
    
    handleTransed(user) {
      transferQun({
        trans_user_id: user[0],
        list_id: this.selectedChat.list_id
      }).then((res) => {
        this.$message.success(this.$t('cao_zuo_cheng_gong'));
        this.fetchCharList(this.selectId || '');
      });
    },
    
    // 打开群管理
    handleManage() {
      this.$refs.manage.open();
      this.$refs.manage.getInfo(this.selectedChat.list_id);
    },
    
    // 设置管理员
    handleSetManage() {
      getGroupAdmin({
        type: 3,
        list_id: this.selectedChat.list_id
      })
        .then((res) => {
          console.log('res', res);
          if (res.err == 0) {
            let arr = res.data.list;
            this.members = arr;
            this.$refs.group_manage.open();
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch((err) => {
          this.$refs.group_manage.close();
        });
    },
    
    handleSetManaged(users) {
      setGroupAdmin({
        users: JSON.stringify(users),
        list_id: this.selectedChat.list_id,
        type: 1
      }).then((res) => {
        this.$message.success(this.$t('cao_zuo_cheng_gong'));
        this.fetchCharList(this.selectId || '');
        this.drawer_group_menu = false;
        this.changeGroupName();
      });
    },
    
    // 禁言1
    handleNoSend(userid) {
      this.handleDontSend([userid]);
    },
    
    // 禁言2
    handleDontSend(users) {
      setGroupAdmin({
        users: JSON.stringify(users),
        list_id: this.selectedChat.list_id,
        type: 2
      }).then((res) => {
        this.$message.success(this.$t('cao_zuo_cheng_gong'));
        this.fetchCharList(this.selectId || '');
      });
    },
    
    // 邀请群成员
    handleInvite() {
      this.drawer_group_menu = false;
      this.$set(this, 'defaultList', [
        ...this.selectedChat.groupImgs.map((item) => item.user_id)
      ]);
      this.$refs.selectInvite.open(this.defaultList);
    },
    
    // 移除群成员2
    handleRemove2(userid) {
      this.handleRemoved([userid]);
    },
    
    // 移除群成员
    handleRemove() {
      this.drawer_group_menu = false;
      getGroupAdmin({
        type: 3,
        list_id: this.selectedChat.list_id
      })
        .then((res) => {
          console.log('res', res);
          if (res.err == 0) {
            let arr = res.data.list;
            this.members = arr;
            this.$refs.group_member.open();
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch((err) => {
          this.$refs.group_member.close();
        });
    },
    
    // 踢出成员
    handleRemoved(users) {
      removeChat({
        users: JSON.stringify(users),
        list_id: this.selectedChat.list_id
      }).then((res) => {
        this.$message.success(this.$t('cao_zuo_cheng_gong'));
        this.fetchCharList(this.selectId || '');
      });
    },
    
    showInfo(item) {
      console.log("item", item);
      fetchInfo({
        user_id: item.userId,
        in: 0
      }).then((res) => {
        this.info = {
          ...res.data
        };
        console.log(this.$t('res_xin_xi'), this.info.lahei);
        if (this.info.lahei == 1) {
          this.lahei = true;
        } else {
          this.lahei = false;
        }
        this.$forceUpdate();
      });
    },

    // 邀请成员
    handleInvited(data) {
      const users = [];
      data.forEach((item) => {
        if (!this.defaultList.includes(item.user_id)) {
          users.push(item.user_id);
        }
      });
      addChat({
        users: JSON.stringify(users),
        list_id: this.selectedChat.list_id
      }).then((res) => {
        this.fetchCharList(this.selectId || '');
      });
    },
    
    handleOk(data) {
      if (this.checkedlist.length > 0) {
        for (var i = 0; i < this.checkedlist.length; i++) {
          console.log(this.checkedlist[i])
          if (this.checkedlist[i].indexOf(".jpg") != -1 || this.checkedlist[i].indexOf(".png") != -1) {
            this.currentRow.content.h = 300;
            this.currentRow.content.save_pic_path = '';
            this.currentRow.content.list_id = this.selectedChat.list_id;
            this.currentRow.content.type = 2;
            this.currentRow.content.url = this.checkedlist[i];
            this.currentRow.content.w = 300;
          } else {
            this.currentRow.content.text = this.checkedlist[i]
          }
          textMsgs({
            list_ids: data
              .filter((item) => item.list_id)
              .map((item) => {
                return item.list_id;
              })
              .join(),
            content_type: this.currentRow.msgItem_type,
            content: JSON.stringify(this.currentRow.content)
          }).then((res) => {
            this.fetchCharList(this.selectId || '');
          });
        }
      } else {
        textMsgs({
          list_ids: data
            .filter((item) => item.list_id)
            .map((item) => {
              return item.list_id;
            })
            .join(),
          content_type: this.currentRow.msgItem_type,
          content: JSON.stringify(this.currentRow.content)
        }).then((res) => {
          this.fetchCharList(this.selectId || '');
        });
      }
    },
    
    showHide() {
    },
    
    handleOption(event, item) {
      this.menuVisible = false;
      this.menuVisible = true;
      event.preventDefault();
      this.currentRow = {
        ...item
      };
      console.log(item);
      var menu = document.querySelector('.contextmenu-msg_menu');
      this.styleMenu(menu, event);
    },
    
    foo() {
      this.menuVisible = false;
      document.removeEventListener('click', this.foo);
    },
    
    styleMenu(menu, event) {
      if (event.clientX > 1800) {
        menu.style.left = event.clientX - 100 + 'px';
      } else {
        menu.style.left = event.clientX + 1 + 'px';
      }
      document.addEventListener('click', this.foo);
      if (event.clientY > 700) {
        menu.style.top = event.clientY - 30 + 'px';
      } else {
        menu.style.top = event.clientY - 10 + 'px';
      }
    },
    
    handleShare(item) {
      this.show_userinfo = false;
      this.shareItem = item;
      this.$refs.handleShare.open();
    },
    
    handleShared(data) {
      sendCard({
        users: JSON.stringify([this.shareItem.userId + '']),
        list_id: data
          .map((item) => {
            return item.list_id;
          })
          .join()
      }).then((res) => {
        this.fetchCharList(this.selectId || '');
        this.$message.success(this.$t('fa_song_cheng_gong'));
      });
    },
    
    duo(msg, type) {
      if (type == true) {
        this.checkedlist.push(msg)
      } else {
      }
      console.log(this.checkedlist);
    },
    
    duoxuan(type) {
      this.handleSetting(type)
    },
    
    handleSetting(type) {
      const data = {
        list_id: this.currentRow.list_id,
        type: this.currentRow.msg_type,
        msg_id: this.currentRow.msg_id
      };

      if (type == 4) {
        // 如果是文字，如果是图片，其他不支持
        console.log('this.currentRow', this.currentRow);
        // 复制图片
        if (this.currentRow.content.url) {
          let str = this.chatUrl + this.selectedChat.list_id + '/' + this.currentRow.content.url;
          this.copyText(str);
          return;
        }
        // 文字可能是图片地址链接
        if (this.currentRow.type == 0) {
          let reg2 = RegExp(/data:image\/.*;base64,/)
          if (reg2.test(this.currentRow.content.text)) {
            let str = `<img src="${this.currentRow.content.text}" />`
            this.copyText(str)
          } else {
            this.copyText(this.currentRow.content.text);
          }
          return;
        }
        this.$message.toast(this.$t('bu_zhi_chi_fu_zhi_gai_lei_xing_wen_jian'));
        return;
      }

      let fetchUrl;
      if (type == 2) {
        fetchUrl = saveStore;
      } else if (type == 1) {
        fetchUrl = withdraw;
      } else if (type == 6) {
        fetchUrl = dianzan;
      } else {
        this.$refs.selectUser.open();
        return;
      }
      // todo撤回消息type == 1群聊普通0私聊
      data.type = this.selectedChat.type;
      fetchUrl(data).then((res) => {
        if (type == 1) {
          this.$store.dispatch('selectSession', this.selectId);
        } else if (type == 2) {
          if (res.msg == this.$t('shou_cang_cheng_gong')) {
            this.$message.success(this.$t('shou_cang_cheng_gong'));
          } else {
            this.$message.warning(res.msg);
          }
        } else if (type == 6) {
          this.$store.dispatch('selectSession', this.selectId);
        }
      });
    },
    
    kickOut() {
      console.log(this.currentRow, 'this.currentRow')
      this.handleRemoved([this.currentRow.userId]);
    },
    
    copyText(str) {
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.$message.success(this.$t('fu_zhi_cheng_gong'));
    },
    
    //  在发送信息之后，将输入的内容中属于表情的部分替换成emoji图片标签
    //  再经过v-html 渲染成真正的图片
    replaceFace(con) {
      if (con && con.includes('[') && con.includes(']')) {
        var emojis = this.emojis;
        var newCon = '';
        con.split(']').forEach((item) => {
          if (item.lastIndexOf('[') > 0) {
            item.split('[').forEach((a) => {
              if (a != '') {
                for (var i = 0; i < emojis.length; i++) {
                  if (emojis[i].code.includes(a)) {
                    newCon +=
                      '<img src="static/emoji/' +
                      emojis[i].file +
                      '"  alt="" style="vertical-align: middle; width: 24px!important; height: 24px" />';
                    return;
                  } else if (i + 1 == emojis.length) {
                    newCon += a;
                  }
                }
              } else {
                newCon += '[';
              }
            });
          }
          if (item != '') {
            for (var i = 0; i < emojis.length; i++) {
              if (emojis[i].code.includes(item)) {
                newCon +=
                  '<img src="static/emoji/' +
                  emojis[i].file +
                  '"  alt="" style="vertical-align: middle; width: 24px!important; height: 24px" />';
                return;
              }
            }
          }
        });

        return newCon;
      }
      return con;
    }
  }
};
</script>

<style lang="stylus" scoped>
.heart-icon {
  animation: heartBeat 0.6s ease-in-out;
  display: flex;
  align-items: center;
  position: relative;
      width: 35px;
    height: 40px;
    font-size: large;
    margin-top: 10px;
}

/* 数量标签样式 */
.like-count {
  position: absolute;
  top: -1px;
  right: -1px;
  background-color: #ff4444;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 50%;
  text-align: center;
  font-weight: bold;
}

/* 红心缩放动画 */
@keyframes heartBeat {
  0% {
    transform: scale(0.5);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.align-center {
  display: flex;
  align-items: center;
  height: 100%;
}
.g_list {
  display: flex;
  flex-direction: column;
  .w200{
     width:200px;
  }
  .g_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 44px;
    cursor: pointer;
    box-sizing: border-box;
    padding: 0 10px;
    font-size: 14px;
    color:#999;
  }
}
.members-list 
  display flex
  flex-wrap wrap
  .member-item
    display flex
    flex-direction column
    align-items center
    margin 10px
    cursor pointer
    span
     font-size 12px
     color #666
     text-align center
     margin-top 4px
     width 50px
     overflow hidden
     text-overflow ellipsis
     white-space nowrap
    .member-img
     width 40px
     height 40px
     display flex
     justify-content center
     align-items center
     background #eee
     img
      width 100%
      height 100%


.search-wrapper
  margin-right 12px
  flex 1
  width 100%
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
    width 100%
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

.get_out_btn
 position absolute
 bottom 10px
 left 50%
 transform translateX(-50%)
.group_info
 display flex
 flex-direction column
 .group_item
  line-height 30px
  display flex
  align-items center
  color #999
  font-size 14px
  box-sizing border-box
  padding-left 10px
  span 
   margin-right 20px
  .black
   color #333
   
.grour_title
 display flex
 justify-content center
 flex-direction column
 align-items center
 height 125px
 background #f5f9ff
 position relative
 .group_name
  display flex
  align-items center
  margin-top 15px
  cursor pointer
  span
    font-size 14px
    color #333
    line-height 20px
    text-align center
    width:200px;//固定宽度
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;

 .share-icon
  position absolute
  right 10px
  top 10px
  font-size 20px
  cursor pointer



.draw-container
 box-sizing border-box
 padding-left 10px
.draw-content
 box-sizing border-box
 height calc(100vh - 70px)
 
.draw_header 
  // display flex
  // align-items center
  // position relative
  .back-icon
   width 40px
   height 40px
   flex-shrink 0
   display flex
   justify-content center
   align-items center
   position absolute
   right 0
   top 0
   font-size 24px
   cursor pointer

.video-msg
 position relative
//  width 160px
//  height 90px
 .play
  position absolute
  left 50%
  top 50%
  transform translate(-50%,-50%)
  font-size 30px
  color #fff
  cursor pointer


.file-msg
 display flex
 align-items center
 cursor pointer
 .file-content
  display flex
  flex-direction column
  font-size 12px
 .file-type
  height 44px
  width 32px
  margin-left 10px
  img
   width 100%
   height 100%
.dialog-footer{
  justify-content: center;
  width:250px!important;
  margin:0 auto;
}
.dialog-body{
  padding:0 30px;
  .dialog-item{
    display: flex;
    align-items: center;
    justify-content: center;
    min-height:30px;
    color: #2c2c2c;
    margin-top:6px;
    
    span{
      font-size:12px;
      min-width: 30px;
    }
    .align-start{
      align-self:flex-start;
      height:30px;
      align-items: center;
      display:flex;
    }
    .gray{
      color:gray;
      margin-right:10px;
    }
  }
}


.change-btns{
  display: flex;
  justify-content: space-around;
  align-items: center;
  height:60px;
  width:450px;
  margin:0 auto; 
  
  .primarybtn{
    width: 90px;
    height: 30px;
    border-radius: 4px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    background: linear-gradient(134deg, #44baf8 0%, #3596fc 100%);
    box-shadow: 0px 2px 6px #8dbff8;
    color: #fff;
    outline: none;
    border:none;
  }
  .primarybtn.default{
      box-shadow: 0px 2px 6px #7f96be7d;
      color: #333;
      background: linear-gradient(125deg, #f5f5f5 0%, #edeff3 100%);
  }
  .large{
    width:134px;
    height:40px;
    line-height:40px;
  }
}
.contextmenu-msg__item {
  display: block;
  line-height: 34px;
  text-align: center;
}

.contextmenu-msg__item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.contextmenu-msg_menu {
  cursor: pointer;
  position: absolute;
  background-color: #fff;
  width: 100px;
  /* height: 106px; */
  font-size: 12px;
  color: #444040;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  white-space: nowrap;
  z-index: 1000;
}

.contextmenu__item:hover {
  cursor: pointer;
  background: #eee;
  border-color: #eee;
}

.message {
  width: 100%;
  height: calc(100vh - 180px);

  .header {
    height: 56px;
    padding: 0 20px;
    box-sizing: border-box;
    position: relative;
    display:flex;
    align-items:center;
    justify-content:space-between;

    &-option {
      position: absolute;
      right: 10px;
      top: 50%;
      transform:translateY(-50%);
      cursor: pointer;
      color: #409EFF;
    }
    .online{
      color:#999;
      font-size:14px;
    }
    .friendname {
      font-size: 18px;
      display:flex;
      align-items:center;
      height:100%;
      .text-overflow{
        width:150px;//固定宽度
        overflow: hidden;
        height:56px;
        line-height:56px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .message-wrapper {
    min-height: calc(100vh - 240px);
    max-height: calc(100vh - 240px);
    padding: 10px;
    box-sizing: border-box;
    overflow-y: auto;
    background: #f3f3f3;

    .message-item {
      margin-bottom: 10px;
    }

    .group {
      position: absolute;
      z-index: 999;
      background-color: #e7e7e7;
    }

    .group li {
      margin-right: 10px;
      display: inline-block;
    }

    .group li img {
      width: 36px;
      height: 36px;
    }

    .message {
      margin-bottom: 15px;
    }

    .time {
      width: 100%;
      font-size: 12px;
      margin: 7px auto;
      text-align: center;

      span {
        display: inline-block;
        line-height: 14px;
        padding: 4px 6px;
        color: #C4C4C4;
      }
    }

    .main {
      .avatar {
        float: left;
        margin-left: 15px;
        border-radius: 3px;
      }

      .content {
        display: inline-block;
        margin-left: 10px;
        position: relative;
        padding: 6px 10px;
        max-width: 330px;
        min-height: 36px;
        line-height: 24px;
        box-sizing: border-box;
        font-size: 14px;
        text-align: left;
        word-break: break-all;
        background-color: #fff;
        border-radius: 4px;
        color:#333;
        .text{
          p{
            img{
              width:166px !important;
              height:auto;
            }
          }
        }
        &.card {
          // background-color: #fff;
          padding:0;
          border: 1px solid #eee;
          cursor:pointer;

          &:before {
            display:none;
          }
        }

        &:before {
          content: ' ';
          position: absolute;
          top: 0px;
          left:-6px;
          border: 6px solid transparent;
          border-top-color: #fff;
        }
        
      }
    }

    .self {
      text-align: right;

      .avatar {
        float: right;
        margin: 0 15px;
      }

      .content {
        background-color: #cfe7ff;
        .text{
          p{
            img{
              width:166px !important;
              height:auto;
            }
          }
        }

        &.card {
          // background-color: #fff;
          padding:0;
          border: 1px solid #eee;
          cursor:pointer;

          &:before {
            display:none;
          }
        }

        &:before {
          left:calc(100% - 6px);
          top:0;
          // vertical-align: middle;
          border-right-color: transparent;
          border-top-color: #cfe7ff;
        }

        .read-state {
          position: absolute;
          left: -30px;
          top: 6px;
          font-size: 12px;
          opacity: 0.4;
        }
      }
    }
  }
}

.friendInfo {
  padding: 0 5px;
}

.esInfo {
  display: flex;
  align-items: center;
  padding: 20px 0 20px 0;

  .left {
    flex: 1;

    .people {
      .nickname {
        display: inline-block;
        font-size: 14px;
        color:#333;
        margin-bottom: 16px;
        display:inline-flex;
        align-items:center;
      }

      .gender-male, .gender-female {
        display: inline-block;
        width: 18px;
        height: 18px;
        vertical-align: top;
        margin-top: 2px;
      }
    }

    .signature {
      font-size: 14px;
      color: rgba(153, 153, 153, 0.8);
    }
  }

  .right {
    .avatar {
      border-radius: 3px;
    }
  }
}

.tip {
  font-size: 24px;
  float: right;
  cursor: pointer;
  width:40px;
  height:40px;
  display:flex;
  justify-content:center;
  align-items:center;
  box-shadow:0 0 10px 2px rgba(0,0,0,.1);
  border-radius:50%;
  margin-left:20px;
  margin-top:10px;
}

.detInfo {
  padding: 20px 0 10px;
  border-top: 1px solid #e7e7e7;

  .remark, .area, .list_id {
    font-size: 14px;
    margin-top: 10px;

    span {
      font-size: 12px;
      color: #999;
      margin-right: 20px;
      min-width: 80px;

      &:last-child {
        margin-right: 0;
        color:#333;
      }
    }
  }

  .remark {
    margin-top: 0;
  }
}
</style>
<style lang="less" scoped>
.content-main-left {
  display: flex;
  justify-content: flex-start;
  padding-left: 5px;
}

.content-main-right {
  display: flex;
  justify-content: flex-end;
  padding-right: 5px;
}

.user-name-tag {
  min-width: 30px;
  font-size: 12px;
  color: #fff;
  height: 20px;
  padding: 0 4px;
  background: #7bbbff;
  line-height: 20px;
  text-align: center;
  margin: 0 4px;
}

.user-name-left {
  height: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  .user-name-text {
    width: auto;
    height: 20px;
    color: #909090;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 10px;
    font-size: 12px;
  }

  .user-name-time {
    font-size: 12px;
    color: #c4c4c4;
    margin-left: 8px;
  }
}

.user-name-right {
  height: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  .user-name-text {
    width: auto;
    height: 20px;
    color: #909090;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
  }

  .user-name-time {
    font-size: 12px;
    color: #c4c4c4;
    margin-right: 8px;
  }
}

.content-main-user-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.notice {
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    background: #eee;
    padding: 15px;
    display: inline-block;
    border-radius: 5px;
    color: #333;
    font-size: 12px;
    width: calc(90vw - 250px);
    overflow: hidden;
    /* min-height: 100px; */
    word-break: break-all;

  }
}

.send-card {
  width: 200px;
  display: flex;
  min-height: 25px;
  border-radius: 5px;
  font-size: 14px;
  background-color: #fff;
  flex-direction: column;
  color: #333;
  overflow: hidden;
}

.send-card-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  height: 100%;
  margin-bottom: 0;
  border-bottom: 1px solid #e1e1e1;
  background: url(../../assets/images/card.png) no-repeat;
  background-size: cover;
  color: #fff;
}

.send-card-content text {
  margin-left: 10px;
}

.send-card-content-text {
  display: flex;
  // justify-content: center;
  align-items: center;
  // flex-direction: column;
  font-size: 14px;
  height: 100%;
  margin-left: 8px;
  color: #b5b5b5;

  span {
    margin-left: 4px;
  }
}
</style>
<style  scoped>
.content .text p img {
  width: 166px !important;
  height: auto;
}

.content .text img {
  width: 166px !important;
  height: auto;
}

.custom-dialog .el-dialog__body {
  padding: 0 !important;
}

.custom-dialog .el-dialog__header {
  width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.custom-dialog .el-dialog__title {
  width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice_detail {
  max-height: 60px;
  -webkit-line-clamp: 2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  color: #333;
  text-align: justify;
  word-break: break-all;
}

.notice {
  line-height: 30px;
  width: 93%;
  color: #333;
  position: relative;
  display: flex;
  flex-direction: column;
}

.shownotice {
  color: #409EFF;
  width: 100%;
  text-align: right;
}

.notice_detail_all {
  text-align: justify;
  word-break: break-all;
}

/deep/ .el-collapse-item__header {

  line-height: 30px !important;
  color: #999 !important;
  border-bottom: none !important;
  margin-left: 10px !important;

}

/deep/ .el-collapse {
  border: none !important;
}
</style>
