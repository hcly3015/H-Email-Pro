import axios from 'axios'

// 设置全局变量
const IsShowEdit = false
export default {
  IsShowEdit
}
export function UserInfos () {
  if (typeof (window.LQ_HR_GetCurrentUserInfo) === 'undefined') {
    let url = 'api/LQ_HR_GetCurrentUserInfo'
    return new Promise((resolve, reject) => {
      axios.get(url).then((res) => {
        let item = res.data
        resolve(item)
      }).catch((error) => {
        reject(error)
      })
    })
  } else {
    let result = window.LQ_HR_GetCurrentUserInfo()
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}

export function lqGetFolders () {
  if (typeof (window.LQ_Mail_GetFolders) === 'undefined') {
    return new Promise((resolve, reject) => {
      let url = 'api/LQ_Mail_GetFolders'
      axios.get(url).then((res) => {
        let data = res.data
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  } else {
    let result = window.LQ_Mail_GetFolders()
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}

export function lqGetMailList (folderId, pageSize, pageIndex, filter) {
  if (typeof (window.LQ_Mail_GetMailList) === 'undefined') {
    return new Promise((resolve, reject) => {
      let url = 'api/LQ_Mail_GetMailList'
      axios.post(url, { 'folderId': folderId, 'searchParam': filter, 'pageSize': pageSize, 'pageIndex': pageIndex }).then((res) => {
        let data = res.data
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  } else {
    let result = window.LQ_Mail_GetMailList(folderId, filter, pageSize, pageIndex)
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}

export function lqGetMail (mailId) {
  if (typeof (window.LQ_Mail_GetMail) === 'undefined') {
    return new Promise((resolve, reject) => {
      let url = 'api/LQ_Mail_GetMail'
      axios.post(url, {'mailId': mailId}).then((res) => {
        let data = res.data
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  } else {
    let result = window.LQ_Mail_GetMail(mailId)
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}

export function lqGetHeadersByMailId (mailId) {
  if (typeof (window.LQ_Mail_GetHeadersByMailId) === 'undefined') {
    return new Promise((resolve, reject) => {
      let url = 'api/LQ_Mail_GetHeadersByMailId'
      axios.post(url, {'mailId': mailId}).then((res) => {
        let data = res.data
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  } else {
    let result = window.LQ_Mail_GetHeadersByMailId(mailId)
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}

export function lqGetSignature () {
  if (typeof (window.LQ_Mail_GetMailSetting) === 'undefined') {
    return new Promise((resolve, reject) => {
      let url = 'api/LQ_Mail_GetMailSetting'
      axios.get(url).then((res) => {
        let data = res.data
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  } else {
    let result = window.LQ_Mail_GetMailSetting()
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}

export function lqSetSignature (mailSignature, enableSignature) {
  if (typeof (window.LQ_Mail_SetMailSetting) === 'undefined') {
    return new Promise((resolve, reject) => {
      let url = 'api/LQ_Mail_SetMailSetting'
      axios.post(url, {mailSignature: mailSignature, enableSignature: enableSignature}).then((res) => {
        let data = res.data
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  } else {
    let result = window.LQ_Mail_SetMailSetting(mailSignature, enableSignature)
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}

export function lqSetStar (headId, isStar) {
  if (typeof (window.LQ_Mail_SetStar) === 'undefined') {
    return new Promise((resolve, reject) => {
      let url = 'api/LQ_Mail_SetStar'
      axios.post(url, {headId: headId, isStar: isStar}).then((res) => {
        let data = res.data
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  } else {
    let result = window.LQ_Mail_SetStar(headId, isStar)
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}

// 获取hr人员
export function HRGetEmployees () {
  if (typeof (window.LQ_HR_GetEmployees) === 'undefined') {
    let url = 'api/LQ_HR_GetEmployees'
    return new Promise((resolve, reject) => {
      axios.get(url).then((res) => {
        let item = res.data
        resolve(item)
      }).catch((error) => {
        reject(error)
      })
    })
  } else {
    let result = window.LQ_HR_GetEmployees()
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}
// 组织架构
export function OrgMemberTree () {
  if (typeof (window.LQ_HR_GetOrgMemberTree) === 'undefined') {
    let url = 'api/LQ_HR_GetOrgMemberTree'
    return new Promise((resolve, reject) => {
      axios.get(url).then((res) => {
        let item = res.data
        resolve(item)
      }).catch((error) => {
        console.log(error)
      })
    })
  } else {
    let result = window.LQ_HR_GetOrgMemberTree()
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}
// 获取同部门
export function OrgdepatTree () {
  if (typeof (window.LQ_HR_GetSameOrgMembersByUserId) === 'undefined') {
    let url = 'api/LQ_HR_GetSameOrgMembersByUserId'
    return new Promise((resolve, reject) => {
      axios.post(url, {'userId': 0}).then((res) => {
        let item = res.data
        resolve(item)
      }).catch((error) => {
        console.log(error)
      })
    })
  } else {
    let result = window.LQ_HR_GetSameOrgMembersByUserId(0)
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}
// 邮件发送
export function DSendok (Data, isTempMail) {
  if (typeof (window.LQ_Mail_SaveMailData) === 'undefined') {
    return new Promise((resolve, reject) => {
      axios.post('api/LQ_Mail_SaveMailData', {'data': Data, isTempMail: isTempMail}).then((res) => {
        let item = res.data
        console.log(item)
        resolve(item)
      }).catch((error) => {
        console.log(error)
      })
    })
  } else {
    let result = window.LQ_Mail_SaveMailData(Data, isTempMail)
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}
// 标记未读
export function MailSetReaded (id, isReaded) {
  if (typeof (window.LQ_Mail_SetReaded) === 'undefined') {
    return new Promise((resolve, reject) => {
      axios.post('api/LQ_Mail_SetReaded', {'id': id, 'isReaded': isReaded}).then((res) => {
        let item = res.data
        resolve(item)
      }).catch((error) => {
        console.log(error)
      })
    })
  } else {
    let result = window.LQ_Mail_SetReaded(id, isReaded)
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}
// 删除邮件
export function MailSetDel (id, isComplete) {
  if (typeof (window.LQ_Mail_Delete) === 'undefined') {
    return new Promise((resolve, reject) => {
      axios.post('api/LQ_Mail_Delete', {'id': id, 'isComplete': isComplete}).then((res) => {
        let item = res.data
        resolve(item)
      }).catch((error) => {
        console.log(error)
      })
    })
  } else {
    let result = window.LQ_Mail_Delete(id, isComplete)
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}
// 下载附件
export function Lqdownfile (fileId) {
  if (typeof (window.LQ_File_Download) === 'undefined') {
    return new Promise((resolve, reject) => {
      axios.post('api/LQ_File_Download', {'fileId': fileId}).then((res) => {
        let item = res.data
        resolve(item)
      }).catch((error) => {
        console.log(error)
      })
    })
  } else {
    let result = window.LQ_File_Download(fileId)
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}
// 邮件上传
export function FileUpload (uploadMeta) {
  let result = window.LQ_File_Upload(uploadMeta)
  let data = JSON.parse(result)
  return new Promise((resolve, reject) => {
    resolve(data)
  })
}
// 双击打开文件
export function Lqopenfile (fileId) {
  if (typeof (window.LQ_File_Open) === 'undefined') {
    return new Promise((resolve, reject) => {
      axios.post('api/LQ_File_Open', {'fileId': fileId}).then((res) => {
        let item = res.data
        resolve(item)
      }).catch((error) => {
        console.log(error)
      })
    })
  } else {
    let result = window.LQ_File_Open(fileId)
    let data = JSON.parse(result)
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
}
