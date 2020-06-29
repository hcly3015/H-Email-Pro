<template>
  <div class="send-container">
    <div class="page-header">
      <tool-bar :title="headerTitle" :toolbars="toolbars" @toolBarClick="toolBarClick"></tool-bar>
    </div>
    <div class="page-content">
      <div class="form-label">
        <div class="text"><span>收件人/抄送人:</span></div>
        <div class="right">
          <el-button type="text" icon="el-icon-circle-plus-outline" @click="addSecret">添加密送</el-button>
        </div>
      </div>
      <div class="form-input" id = "fromInput">
        <el-select v-model="form.acceptlist" clearable remote multiple filterable :reserve-keyword="false" placeholder="请添加收件人" value-key="name" :remote-method="loadRecipients" :multiple-limit="multiplelimit"  class="selectMenu">
          <el-option v-for="item in recipients" :key="item.id" :label="`${item.Name}(${item.ItemData.JobNo})`" :value="item.UserId"></el-option>
        </el-select>
        <el-button icon="el-icon-user" @click.native="selectEmployee(1)"></el-button>
      </div>
      <div class="form-input">
        <el-select v-model="form.cclist" clearable remote multiple filterable :reserve-keyword="false" placeholder="请添加抄送人" value-key="name" :remote-method="loadCcusers" :multiple-limit="multiplelimit" class="selectMenu">
          <el-option v-for="item in ccusers" :key="item.id" :label="`${item.Name}(${item.ItemData.JobNo})`" :value="item.UserId"></el-option>
        </el-select>
        <el-button icon="el-icon-user" @click.native="selectEmployee(2)"></el-button>
      </div>
      <div class="form-input" v-for="(inputs, i) in secretRows" :key="i">
        <el-select v-model="form.secretlist" clearable remote multiple filterable :reserve-keyword="false" placeholder="请添加密送人" value-key="name" :remote-method="loadSdusers" :multiple-limit="multiplelimit" class="selectMenu" >
         <el-option v-for="item in sdusers" :key="item.id" :label="`${item.Name}(${item.ItemData.JobNo})`" :value="item.UserId"></el-option>
        </el-select>
        <el-button icon="el-icon-user" @click.native="selectEmployee(3)"></el-button>
        <div class="remove-row" @click="removeSecret(inputs)"><i class="el-icon-remove-outline"></i></div>
      </div>
      <div class="form-label" style="position:relative">
        <div class="text"><span>主题:</span></div>
        <div class="right">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              {{ emailLevel.text }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="changeLevel(item)" v-for="(item, i) in emailLevels" :key="i">{{ item.text }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div>
            <el-button size="small" type="primary" icon="el-icon-paperclip" @click="beforeUpload"></el-button>
          </div>
        </div>
      </div>
      <div class="form-input">
        <el-input v-model="form.title" maxlength="150" placeholder="请输入您的标题内容"></el-input>
      </div>
      <div class="form-file"  >
        <div v-show="loading" class="loadwidth"><div class="loads"><span class="loadmun" v-bind:style="{width: loadtime +'%'}"></span></div>附件上传{{loadtime}}%</div>
          <div class="filemenu" v-for="(item,i) in fileName" :key="i" >
            <i class="el-icon-paperclip" ></i>
            <div class="file-title"><span class="titles" :title="item.Name">{{ item.title }}</span>{{item.tip}}</div>
            <el-button type="text" icon="el-icon-error" class="closefile" @click="removeFile(item)"></el-button>
          </div>
          <input type="hidden" v-model="form.fileList">
      </div>
      <div class="form-input">
        <div class="quill-edit">
          <quill-editor ref="uQuillEditor" v-model="form.content" :options="editorOption" @paste.native.passive="imagePaste" accept="image/png, image/gif, image/jpeg, image/bmp, image/x-icon"></quill-editor>
        </div>
        <!-- <vue-ueditor-wrap v-model="form.content" :config="uEditConfig" style="width:100%"></vue-ueditor-wrap> -->
      </div>
    </div>
    <div class="page-bottom">
      <bottom-bar @btnClear="btnClear" @btnSave="btnSave" @btnSend="btnSend"></bottom-bar>
    </div>
    <!-- 选择人员 -->
    <employee-select v-if="showEmployeeSelectDialog" ref="employeeSelectDialog" @closeDialog="closeDialog"></employee-select>
  </div>
</template>

<script>
import Utils from '../js/util.js'
import { HRGetEmployees, lqGetFolders, UserInfos, FileUpload, lqGetMail, lqGetSignature } from '@/api/lq.email.js'
import ToolBar from '@/components/ToolBar'
import BottomBar from '@/components/BottomBar'
import EmployeeSelect from '@/components/EmployeeSelect'
import VueUeditorWrap from 'vue-ueditor-wrap'
import * as Quill from 'quill' // 引入编辑器
import { ImageDrop } from 'quill-image-drop-module' // 图片拖拽
import { addQuillTitle } from '@/api/quill-title.js'
import ImageResize from 'quill-image-resize-module'
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)

export default {
  name: 'Send',
  fileListData: [],
  components: {
    ToolBar,
    BottomBar,
    VueUeditorWrap,
    EmployeeSelect,
    addQuillTitle
  },
  data () {
    return {
      headerTitle: '发布邮件',
      toolbars: ['close'],
      uEditConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 370,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件地址
        serverUrl: '',
        toolbars: [[
          'undo',
          'redo',
          'bold',
          'indent',
          'italic',
          'underline',
          'strikethrough',
          'subscript',
          'fontborder',
          'superscript',
          'formatmatch',
          'source',
          'blockquote',
          'pasteplain',
          'selectall',
          'print',
          'preview',
          'horizontal',
          'removeformat',
          'time',
          'date',
          'unlink',
          'insertrow',
          'insertcol',
          'mergeright',
          'mergedown',
          'deleterow',
          'deletecol',
          'splittorows',
          'splittocols',
          'splittocells',
          'deletecaption',
          'inserttitle',
          'mergecells',
          'deletetable',
          'cleardoc',
          'insertparagraphbeforetable',
          'fontfamily',
          'fontsize',
          'paragraph',
          'emotion',
          'spechars',
          'map',
          'gmap',
          'justifyleft',
          'justifyright',
          'justifycenter',
          'justifyjustify',
          'forecolor',
          'backcolor',
          'insertorderedlist',
          'insertunorderedlist',
          'fullscreen',
          'directionalityltr',
          'directionalityrtl',
          'rowspacingtop',
          'rowspacingbottom',
          'pagebreak',
          'imagenone',
          'imageleft',
          'imageright',
          'imagecenter',
          'lineheight',
          'edittip ',
          'customstyle',
          'autotypeset',
          'touppercase',
          'tolowercase',
          'inserttable'
        ]]
      },
      fileName: [],
      emailLevel: {name: '1', text: '一般'},
      emailLevels: [
        {
          name: '3',
          text: '一般'
        },
        {
          name: '2',
          text: '重要'
        },
        {
          name: '1',
          text: '非常重要'
        }
      ],
      form: {
        acceptlist: [],
        cclist: [],
        secretlist: [],
        title: '',
        fileList: [],
        content: '',
        level: '3'
      }, // 表单对象
      multiplelimit: 500, // 下拉选择人员最大数
      secretRows: [], // 密送人行集合
      recipients: [], // 收件人初始化数据
      ccusers: [], // 抄送人初始化数据
      sdusers: [], // 密送人初始化数据
      employeelist: [],
      employeeActive: 1,
      showEmployeeSelectDialog: false,
      FolderId: 0, // 发件箱Id
      UUserId: 0, // 发件人,
      editor: '',
      editorOption: {
        placeholder: '请输入内容 ...',
        theme: 'snow',
        modules: {
          imageDrop: true,
          imageResize: {},
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
            ['blockquote', 'code-block'], // 引用，代码块
            [{ 'header': 1 }, { 'header': 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{'list': 'ordered'}, { 'list': 'bullet' }], // 列表
            [{'script': 'sub'}, { 'script': 'super' }], // 上下标
            [{'indent': '-1'}, { 'indent': '+1' }], // 缩进
            [{ 'direction': 'rtl' }], // 文本方向
            [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // 几级标题
            [{ 'color': [] }, { 'background': [] }], // 字体颜色，字体背景颜色
            [{ 'font': [] }], // 字体
            [{ 'align': [] }], // 对齐方式
            ['clean'], // 清除字体样式
            ['image'] // 上传图片、上传视频
          ]
        }
      },
      loading: false,
      loadtime: 0,
      mailid: 0
    }
  },
  created () {
  },
  async mounted () {
    // 获取发件箱Id，当前发件人
    await this.GetFolders()
    await this.loadEmails()
    await this.initEmployees()
    // 上传附件 回调数据
    window.UploadCompleted = (data) => {
      if (data) {
        let res = JSON.parse(data)
        let item = res.Result.Data
        this.FileDatas(item)
      }
    }
    window.ProgressReportMethod = (data) => {
      if (data) {
        let res = JSON.parse(data)
        let percent = res.percent
        this.loading = true
        this.loadtime = percent
        if (percent === 100) this.loading = false
      }
    }
    // 列表页点击出发关闭当前页操作
    Utils.$on('CloseEdit', () => {
      this.siderlistClose()
    })
    if (this.$refs.uQuillEditor) {
      this.editor = this.$refs.uQuillEditor.quill
      if (this.editor) {
        this.editor.clipboard.addMatcher(Node.TEXT_NODE, (node, delta) => {
          return delta.insert('')
        })
      }
    }
  },
  beforeDestroy () {
    this.editor = null
    delete this.editor
  },
  methods: {
    async initEmployees () {
      let data = this.$route.query.id
      let barname = this.$route.query.barName
      if (data) {
        if (data === 0) {
          this.form.acceptlist = []
          this.form.cclist = []
          this.form.secretlist = []
          this.form.title = ''
          this.form.fileList = []
          this.form.content = ''
          this.form.level = '1'
          this.fileName = []
        }
        if (data > 0) {
          let emaildata = await lqGetMail(data)
          // 编辑
          if (barname === 'edit') {
            let items = emaildata.Result
            this.form.content = items.Body
            this.form.title = items.Summary
            this.mailid = items.Headers[0].Id
            // 收件人
            let RecipientIds = JSON.parse(items.RecipientIds)
            if (RecipientIds.length > 0) {
              let recs = RecipientIds.map(t => t.Employee)
              let ids = recs.map(t => t.UserId)
              this.form.acceptlist = ids
              let newarr = []
              recs.forEach(k => {
                let recobj = {}
                recobj.Icon = ''
                recobj.ItemData = k
                recobj.Name = k.Name
                recobj.NamePinYin = k.NamePinYin
                recobj.UserId = k.UserId
                newarr.push(recobj)
              })
              this.recipients = newarr
            }
            // 抄送人
            let CCUserIds = JSON.parse(items.CCUserIds)
            if (CCUserIds.length > 0) {
              let recs = CCUserIds.map(t => t.Employee)
              let ids = recs.map(t => t.UserId)
              this.form.cclist = ids
              let newarr = []
              recs.forEach(k => {
                let recobj = {}
                recobj.Icon = ''
                recobj.ItemData = k
                recobj.Name = k.Name
                recobj.NamePinYin = k.NamePinYin
                recobj.UserId = k.UserId
                newarr.push(recobj)
              })
              this.ccusers = newarr
            }
            // 密送人
            let SDUserIds = JSON.parse(items.SDUserIds)
            if (SDUserIds.length > 0) {
              let recs = SDUserIds.map(t => t.Employee)
              let ids = recs.map(t => t.UserId)
              this.form.SDUserIds = ids
              let newarr = []
              recs.forEach(k => {
                let recobj = {}
                recobj.Icon = ''
                recobj.ItemData = k
                recobj.Name = k.Name
                recobj.NamePinYin = k.NamePinYin
                recobj.UserId = k.UserId
                newarr.push(recobj)
              })
              this.sdusers = newarr
            }
          } else {
            // 签名
            let signainfo = await lqGetSignature()
            let MailSignature = ''
            if (signainfo.Success && signainfo.Result.EnableSignature) {
              MailSignature = '<br/><br/><br/><br/>' + '<p>' + '------------------------------------- 签名 -------------------------------------' + '</p>' +
              '' + signainfo.Result.MailSignature + ''
            }
            let getemailuser = ''
            let getemailtime = ''
            let RecipientIds = JSON.parse(emaildata.Result.RecipientIds)
            if (RecipientIds.length > 0) {
              let recs = RecipientIds.map(t => t.Employee)
              let names = recs.map(t => t.Name)
              getemailuser = names.join(';')
              getemailtime = this.$moment(RecipientIds[0].Header.CreateDate).format('YYYY-MM-DD HH:mm')
            }
            let defaultinfo = '<br/><br/><br/>' + '<p>' + '------------------------------------- 原始邮件 -------------------------------------' + '</p>' +
              '<pre>' +
              '<p>' + '发件人：' + `${emaildata.Result.SenderName}` + '</p>' +
              '<p>' + '发送时间：' + `${getemailtime}` + '</p>' +
              '<p>' + '收件人：' + `${getemailuser}` + '</p>' +
              '<p>' + '主题：' + `${emaildata.Result.Subject}` + '</p>' + '' +
              '</pre><br/>'
            // 原始邮件个性签名en
            let textname = '转发'
            if (barname === 'reply' || barname === 'replyall') {
              textname = '回复'
            }
            this.form.title = `${textname}：${emaildata.Result.Subject}`
            this.form.content = `${MailSignature}${defaultinfo}${emaildata.Result.Body}`
            // 回复时操作
            if (barname === 'reply') {
              // 人员信息表
              let employeelist = this.employeelist
              let senderid = emaildata.Result.SenderId
              let recss = employeelist.filter(i => i.UserId === senderid)
              let idss = recss.map(t => t.UserId)
              this.form.acceptlist = idss
              this.recipients = recss
            }
            // 回复全部
            if (barname === 'replyall') {
              // 收件人
              let RecipientIds = JSON.parse(emaildata.Result.RecipientIds)
              if (RecipientIds.length > 0) {
                let recss = RecipientIds.map(t => t.Employee)
                let idss = recss.map(t => t.UserId)
                this.form.acceptlist = idss
                let newarr = []
                recss.forEach(k => {
                  let recobj = {}
                  recobj.Icon = ''
                  recobj.ItemData = k
                  recobj.Name = k.Name
                  recobj.NamePinYin = k.NamePinYin
                  recobj.UserId = k.UserId
                  newarr.push(recobj)
                })
                this.recipients = newarr
              }
              // 抄送人
              let CCUserIds = JSON.parse(emaildata.Result.CCUserIds)
              if (CCUserIds.length > 0) {
                let recss = CCUserIds.map(t => t.Employee)
                let idss = recss.map(t => t.UserId)
                this.form.cclist = idss
                let newarr = []
                recss.forEach(k => {
                  let recobj = {}
                  recobj.Icon = ''
                  recobj.ItemData = k
                  recobj.Name = k.Name
                  recobj.NamePinYin = k.NamePinYin
                  recobj.UserId = k.UserId
                  newarr.push(recobj)
                })
                this.ccusers = newarr
              }
              // 全部回复 加载是否有 密送
              let SDUserIds = JSON.parse(emaildata.Result.SDUserIds)
              if (SDUserIds.length > 0) {
                // 密送 先执行密送的方法
                this.addSecret()
                let recss = SDUserIds.map(t => t.Employee)
                let idss = recss.map(t => t.UserId)
                this.form.secretlist = idss
                let newarr = []
                recss.forEach(k => {
                  let recobj = {}
                  recobj.Icon = ''
                  recobj.ItemData = k
                  recobj.Name = k.Name
                  recobj.NamePinYin = k.NamePinYin
                  recobj.UserId = k.UserId
                  newarr.push(recobj)
                })
                this.sdusers = newarr
              }
            }
            // 邮件
            let annexs = JSON.parse(emaildata.Result.Attachments)
            if (annexs.length > 0) {
              annexs.forEach(v => {
                let Name = v.Name
                let index = Name.lastIndexOf('.')
                v.title = Name.slice(0, index - 1)
                v.tip = Name.substring(index, index.length)
              })
              this.fileName = annexs
              let fileList = this.fileName.map(t => t.FileId)
              this.form.fileList = fileList
            }
          }
        }
      }
    },
    async GetFolders () {
      let Udata = await UserInfos()
      let Folder = await lqGetFolders()
      if (Udata.Success) {
        let res = Udata.Result
        this.UUserId = res.UserId
      }
      if (Folder.Success) {
        let item = Folder.Result
        for (var i = 0; i < item.length; i++) {
          if (item[i].Name === '发件箱') this.FolderId = item[i].Id
        }
      }
    },
    loadRecipients (filter) {
      if (filter) {
        let recipients = this.recipients
        let newrecipients = this.employeelist.filter(item => {
          return item.Name.toLowerCase().indexOf(filter.toLowerCase()) > -1 || (item.ItemData.JobNo && item.ItemData.JobNo.toLowerCase().indexOf(filter.toLowerCase()) > -1) || item.NamePinYin.toLowerCase().indexOf(filter.toLowerCase()) > -1
        })
        let arry = recipients.concat(newrecipients)
        this.recipients = arry
      } else {
        this.recipients = []
      }
    },
    loadCcusers (filter) {
      if (filter) {
        let ccusers = this.ccusers
        let newccusers = this.employeelist.filter(item => {
          return item.Name.toLowerCase().indexOf(filter.toLowerCase()) > -1 || (item.ItemData.JobNo && item.ItemData.JobNo.toLowerCase().indexOf(filter.toLowerCase()) > -1) || item.NamePinYin.toLowerCase().indexOf(filter.toLowerCase()) > -1
        })
        let arry = ccusers.concat(newccusers)
        this.ccusers = arry
      } else {
        this.ccusers = []
      }
    },
    loadSdusers (filter) {
      if (filter) {
        let sdusers = this.sdusers
        let newsdusers = this.employeelist.filter(item => {
          return item.Name.toLowerCase().indexOf(filter.toLowerCase()) > -1 || (item.ItemData.JobNo && item.ItemData.JobNo.toLowerCase().indexOf(filter.toLowerCase()) > -1) || item.NamePinYin.toLowerCase().indexOf(filter.toLowerCase()) > -1
        })
        let arry = sdusers.concat(newsdusers)
        this.sdusers = arry
      } else {
        this.sdusers = []
      }
    },
    // 远程获取收件人
    // 加载邮件
    async loadEmails () {
      let data = await HRGetEmployees()
      if (data.Success) {
        let result = data.Result
        this.employeelist = result
      } else {
        this.$message({
          showClose: true,
          message: data.Msg,
          type: 'error'
        })
      }
    },
    addSecret () {
      let rows = this.secretRows.length
      if (rows <= 0) {
        this.secretRows.push({ value: '', key: Date.now() })
      }
    },
    removeSecret (item) {
      let index = this.secretRows.indexOf(item)
      if (index !== -1) {
        this.secretRows.splice(index, 1)
        this.form.secretlist = []
      }
    },
    selectEmployee (type) {
      let dialogTitle = '选择人员'
      this.employeeActive = type
      this.showEmployeeSelectDialog = true
      if (type === 1) {
        dialogTitle = '选择收件人'
      }
      if (type === 2) {
        dialogTitle = '选择抄送人'
      }
      if (type === 3) {
        dialogTitle = '选择密送人'
      }
      this.$nextTick(() => {
        this.$refs.employeeSelectDialog.init(dialogTitle)
      })
    },
    changeLevel (item) {
      this.emailLevel = item
      this.form.level = item.name
    },
    closeDialog (vals) {
      let ids = []
      let oldIds = []
      let ItemData = []
      if (vals.length > 0) {
        ids = vals.map(t => t.UserId ? t.UserId : t.ItemData.UserId)
        for (let v = 0; v < vals.length; v++) {
          let li = {
            id: vals[v].NodeId ? vals[v].NodeId : vals[v].Id,
            Name: vals[v].Name,
            UserId: vals[v].UserId ? vals[v].UserId : vals[v].ItemData.UserId,
            ItemData: vals[v].ItemData
          }
          ItemData.push(li)
        }
      }
      if (this.employeeActive === 1) {
        oldIds = this.form.acceptlist
      }
      if (this.employeeActive === 2) {
        oldIds = this.form.cclist
      }
      if (this.employeeActive === 3) {
        oldIds = this.form.secretlist
      }
      for (var i = 0; i < oldIds.length; i++) {
        for (var j = 0; j < ids.length; j++) {
          if (oldIds[i] === ids[j]) {
            oldIds.splice(i, 1) // 利用splice函数删除元素，从第i个位置，截取长度为1的元素
          }
        }
      }
      for (var k = 0; k < ids.length; k++) {
        oldIds.push(ids[k])
      }
      if (this.employeeActive === 1) {
        this.form.acceptlist = oldIds
        this.recipients = ItemData
      }
      if (this.employeeActive === 2) {
        this.form.cclist = oldIds
        this.ccusers = ItemData
      }
      if (this.employeeActive === 3) {
        this.form.secretlist = oldIds
        this.sdusers = ItemData
      }
    },
    btnClear () {
      this.form.acceptlist = []
      this.form.cclist = []
      this.form.secretlist = []
      this.form.title = ''
      this.form.content = ''
      this.fileName = []
      this.form.fileList = []
      this.changeLevel({name: '1', text: '一般'})
    },
    btnSave () {
      this.Save(true)
    },
    toolBarClick (item) {
      if (item.name === 'close') {
        this.closePage()
        Utils.$emit('resetSendStyle', false)
      }
    },
    async btnSend () {
      this.Save(false)
    },
    async Save (isTempMail) {
      let da = this.form
      da = JSON.stringify(da)
      let res = JSON.parse(da)
      let abstract = ''
      if (res.content) {
        abstract = res.content.replace(/<\/?.+?>/g, '')
      }
      if (res.fileList.length === 0) {
        if (abstract === '' || res.acceptlist.length === 0 || res.title === '') {
          this.$message({
            showClose: true,
            message: '主题，收件人,内容必填',
            type: 'error'
          })
          return false
        }
      } else {
        if (res.acceptlist.length === 0 || res.title === '') {
          this.$message({
            showClose: true,
            message: '主题，收件人必填',
            type: 'error'
          })
          return false
        }
      }
      let acceptlist = []
      res.acceptlist.forEach(t => {
        acceptlist.push('E' + t)
      })
      acceptlist = acceptlist.join(',')
      let cclist = []
      if (res.cclist) {
        res.cclist.forEach(t => {
          cclist.push('E' + t)
        })
        cclist = cclist.join(',')
      } else {
        cclist = ''
      }
      let sdusers = []
      if (res.secretlist) {
        res.secretlist.forEach(t => {
          sdusers.push('E' + t)
        })
        sdusers = sdusers.join(',')
      } else {
        sdusers = ''
      }
      let list = {
        'Subject': res.title,
        'Summary': abstract,
        'Priority': this.form.level,
        'SenderId': this.UUserId,
        'RecipientIds': acceptlist,
        'CCUserIds': cclist,
        'SDUserIds': sdusers,
        'Body': res.content,
        'Attachments': JSON.stringify(res.fileList),
        'FolderId': this.FolderId
      }
      this.$router.push({ name: 'success', params: {data: list, isTempMails: isTempMail, mailid: this.mailid} })
    },
    async beforeUpload (file) {
      if (!this.loading) {
        let data = {
          'Title ': '上传附件',
          'Multiselect': false,
          'ProgressReportMethod': 'ProgressReportMethod',
          'CallbackMethod': 'UploadCompleted'
        }
        await FileUpload(JSON.stringify(data))
      } else {
        this.$message({
          showClose: true,
          message: '当前有附件在上传，请稍后',
          type: 'error'
        })
      }
    },
    FileDatas (data) {
      if (data) {
        let arr = []
        for (let i = 0; i < data.length; i++) {
          let Name = data[i].Name
          let index = Name.lastIndexOf('.')
          let d = {
            FileId: data[i].FileId,
            Name: Name,
            title: Name.slice(0, index - 1),
            tip: Name.substring(index, index.length),
            RemoteUri: data[i].RemoteUri,
            Size: data[i].Size
          }
          arr.push(d)
        }
        this.fileName.push(...arr)
        let ids = this.fileName.map(t => t.FileId)
        this.form.fileList = ids
      }
    },
    removeFile (item) {
      let li = this.fileName.filter(t => t.FileId !== item.FileId)
      this.fileName = li
      let ids = this.fileName.map(t => t.FileId)
      this.form.fileList = ids
    },
    imagePaste (event) {
      let item = ''
      let items = event.clipboardData && event.clipboardData.items
      // let types = event.clipboardData.types || []
      // for (let i = 0; i < types.length; i++) {
      //   if (types[i] === 'Files') {
      //     item = items[i]
      //     break
      //   }
      // }
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          item = items[i]
          break
        }
      }
      if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
        // event.preventDefault()
        var blob = item.getAsFile()
        if (!blob.name) {
          let reader = new FileReader()
          reader.onload = (e) => {
            let quill = this.$refs.uQuillEditor.quill
            // 获取光标所在位置
            let length = quill.getSelection() && quill.getSelection().index
            // 插入图片  res.info为服务器返回的图片地址
            quill.insertEmbed(length, 'image', e.target.result)
            // 调整光标到最后
            quill.setSelection(length + 1)
          }
          reader.readAsDataURL(blob)
        }
      }
    },
    closePage () {
      this.siderlistClose()
      let IsShow = this.$global.IsShowEdit
      if (IsShow) {
        this.$confirm('退出后将不保存当前数据，是否确定退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$global.IsShowEdit = false
          this.$router.go(-1)
        }).catch(() => {
          console.log('取消')
        })
      } else {
        this.$router.go(-1)
        this.$global.IsShowEdit = false
      }
    },
    siderlistClose () {
      let res = this.form.acceptlist.length > 0 || this.form.title.length > 0 || this.form.content.length > 0 || this.form.fileList.length > 0
      this.$global.IsShowEdit = res
    }
  }
}
</script>

<style lang="scss" scoped>
  .send-container {
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    background-color: rgba(187, 205, 218, .2);
    display: flex;
    flex-direction: column;
    .page-header {
      height: 60px;
    }
    .page-content {
      flex: 1;
      min-height: 0;
      overflow: auto;
      flex-flow: column;
      padding: 0 20px 20px 20px;
      .form-label {
        padding: 25px 0 0 0;
        display: flex;
        justify-content: space-between;
        .text {
          display: flex;
          align-items: center;
        }
        .right {
          display: flex;
          flex-flow: row;
          align-items: center;
          .el-dropdown {
            margin-right: 20px;
            color: #3B5D95;
            cursor: pointer;
          }
          .el-upload {
            .el-button--small {
              padding: 6px 13px;
            }
          }
        }
      }
      #upload-demo{
          height: 28px;
        overflow: hidden;
        width: 42px;
      }
      .form-input {
        display: flex;
        padding: 10px 0 10px 0;
        max-height: 150px;
        .quill-edit{
          width: 100%;
          height: 100%;
          background: #fff;
          overflow: hidden;
          /deep/ .ql-editor {
            pre.ql-syntax {
              background: #e9e9eb;
              color: #000;
              font-family: "Helvetica, Arial, sans-serif";
            }
          }
          /deep/ .ql-toolbar.ql-snow + .ql-container.ql-snow{
            height: calc(100vh - 500px);
            overflow-y: auto;
          }
        }
        /deep/ input.el-input__inner {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        .selectMenu {
          width: 100%;
          overflow: hidden;
          /deep/ .el-select__tags {
            max-height: 85px;
            overflow: auto;
            max-width: 99%;
          }
        }
        .el-button--medium {
          padding: 6px 12px;
          border-left: 0;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        .remove-row {
          cursor: pointer;
          font-size: 20px;
          display: flex;
          align-self: center;
          margin-left: 19px;
          :hover {
            color: red;
          }
        }
      }
      .files{
        float: left;
        margin-right: 10px;
      }
      .form-file{
        width: 100%;
        height: auto;
        margin-bottom: 10px;
        overflow: hidden;
        .loadwidth{
          width: 100%;
          height: auto;
          font-size: 14px;
          .loads{
            width: 200px;
            height: 15px;
            background: #e8e8e8;
            border-radius: 5px;
            position: relative;
            overflow: hidden;
            float: left;
            margin-right: 10px;
            .loadmun{
              display: block;
              height: 15px;
              background: #3B5D95;
            }
          }
        }
        .filemenu{
          width: 275px;
          float: left;
          font-size: 17px;
          color: #666;
          position: relative;
          border: 1px solid rgba(135,144,149,0.30);
          border-radius: 4px;
          border-radius: 4px;
          margin: 10px 10px 0px 0px;
          .el-icon-paperclip{
            float: left;
            margin: 11px 5px 0px 5px;
          }
          .file-title{
              font-size: 14px;
              overflow: hidden;
              width: 215px;
              float: left;
              line-height: 41px;
              span{
                max-width: 185px;
                display: block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                float: left;
              }
            }
          .closefile{
          float: left;
          font-size: 17px;
          margin-left: 10px;
          color:  rgba(135,144,149,0.50);
          }
        }
      }
    }
    .page-bottom {
      height: 60px;
    }
  }
</style>
