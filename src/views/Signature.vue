<template>
  <div class="signature-container">
    <div class="page-top">
      <div class="title">{{ title }}</div>
    </div>
    <div class="page-content">
      <!-- <div class="form-label">
        <div class="text"><span>账号:</span></div>
        <div class="right"></div>
      </div>
      <div class="form-input">
        <el-input v-model="form.account"></el-input>
      </div> -->
      <div class="form-label">
        <div class="text"><span>签名内容:</span></div>
        <div class="right"></div>
      </div>
      <div class="form-input">
        <div class="quill-edit">
          <quill-editor ref="uQuillEditor" v-model="form.content" :options="editorOption" @paste.native.passive="imagePaste"></quill-editor>
        </div>
        <!-- <vue-ueditor-wrap v-model="form.content" :config="uEditConfig" style="width:100%"></vue-ueditor-wrap> -->
      </div>
      <div class="form-label">
        <el-checkbox v-model="form.enable">启用签名</el-checkbox>
      </div>
    </div>
    <div class="page-bottom">
      <div class="left">
        <el-button plain @click.native="btnClear">清空</el-button>
      </div>
      <div class="right">
        <el-button type="primary" @click.native="btnSave">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { lqGetSignature, lqSetSignature } from '@/api/lq.email.js'
import VueUeditorWrap from 'vue-ueditor-wrap'
import * as Quill from 'quill' // 引入编辑器
import { ImageDrop } from 'quill-image-drop-module' // 图片拖拽
import { addQuillTitle } from '@/api/quill-title.js'
Quill.register('modules/imageDrop', ImageDrop)

export default {
  name: 'Signature',
  components: {
    VueUeditorWrap,
    addQuillTitle
  },
  data () {
    return {
      title: '签名管理',
      form: {
        account: '',
        content: '签名',
        enable: true
      },
      editor: '',
      editorOption: {
        placeholder: '请输入内容 ...',
        theme: 'snow',
        modules: {
          imageDrop: true,
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
      }
    }
  },
  created () {
  },
  async mounted () {
    addQuillTitle()
    await this.initSignature()
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
    async initSignature () {
      let data = await lqGetSignature()
      if (data.Success) {
        let result = data.Result
        this.form.content = result.MailSignature
        this.form.enable = result.EnableSignature
      } else {
        this.$message({
          showClose: true,
          message: data.Msg,
          type: 'error'
        })
      }
    },
    btnClear () {
      this.form.content = ''
      this.form.enable = true
    },
    async btnSave () {
      let data = await lqSetSignature(this.form.content, this.form.enable)
      if (data.Success) {
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          message: data.Msg,
          type: 'error'
        })
      }
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
        event.preventDefault()
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
      } else {
        console.log(123456)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .signature-container {
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    display: flex;
    flex-flow: column;
    background-color: rgba(187, 205, 218, .2);
    .page-top {
      height: 60px;
      padding: 0 20px 0 20px;
      border-bottom: solid 1px rgba(135, 144, 149, 0.2);
      .title {
        font-size: 16px;
        line-height: 60px;
      }
    }
    .page-content {
      flex: 1;
      min-height: 0;
      overflow: auto;
      display: flex;
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
      }
      .form-input {
        display: flex;
        padding: 10px 0 10px 0;
        .quill-edit {
          width: 100%;
          height: auto;
          background: #fff;
          overflow: hidden;
          /deep/ .ql-toolbar.ql-snow + .ql-container.ql-snow {
            height: calc(100vh - 315px);
            overflow-y: auto;
          }
        }
      }
    }
    .page-bottom {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px 20px 0 20px;
      height: 60px;
      border-top: solid 1px rgba(135, 144, 149, 0.2);
      .right {
        display: flex;
      }
    }
  }
</style>
