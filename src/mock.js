import Mock from 'mockjs'

const Random = Mock.Random

var getEmails = function () {
  let data = []
  let acceptlist = []
  let cclist = []
  let secretlist = []
  let annexlist = []
  for (let i = 0; i < 15; i++) {
    let item = {
      id: i + 1,
      name: Random.cname(),
      type: 1,
      info: {
        name: '开发三部(部门)',
        managerName: Random.cname(),
        number: 3,
        members: '贺兴祥,刘志强,黄春霞,余佳琪'
      }
    }
    acceptlist.push(item)
  }
  for (let i = 0; i < 5; i++) {
    let item = {
      id: i + 1,
      name: Random.cname(),
      type: 2,
      info: {
        name: '刘志强',
        jobNo: '1581',
        position: '前端开发工程师',
        dept: '开发三部',
        tel: '18012345678'
      }
    }
    cclist.push(item)
  }
  for (let i = 0; i < 3; i++) {
    let item = {
      id: i + 1,
      name: Random.cname(),
      type: 1,
      info: {
        name: '开发三部(部门)',
        managerName: '贺兴祥',
        number: 3,
        members: '贺兴祥,刘志强,黄春霞'
      }
    }
    secretlist.push(item)
  }
  for (let i = 0; i < 3; i++) {
    let item = {
      id: i + 1,
      name: Random.csentence(5, 10)
    }
    annexlist.push(item)
  }

  for (let i = 0; i < 5; i++) {
    let newList = { // 详细 规则 参照mockjs官网
      id: i + 1,
      name: Random.cname(), // Random.cname() 随机生成中文名
      title: Random.csentence(5, 30), //  Random.csentence( min, max )
      content: '<p>大家好：</p><p><br/></p<p>从 2015 年 4 月起，Ant Design 在蚂蚁金服中后台产品线迅速推广，对接多条业务线，覆盖系统 800 个以上。</p><p>定位于中台业务的 Ant Design 兼顾专业和非专业的设计人员，具有学习成本低、上手速度快、实现效果好等特点，并且提供从界面设计到前端开发的全链路生态，可以大大提升设计和开发的效率。</p><p><br/></p><p><br/></p><p>Thanks and Best Regards!</p><p>--------------------------------------</p><p>核心价值观：责任、服务、创新、共赢</p><p>做事标准：务实、严谨、高效、奋斗</p><p><br/></p>', //  Random.csentence( min, max )
      url: Random.dataImage('40x40', ''), // Random.dataImage( size, text ) 生成图片（base64位数据格式）
      datetime: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + Random.time(), // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
      isStar: true,
      isAnnex: true,
      isRead: false,
      isSelected: false,
      acceptlist: acceptlist,
      cclist: cclist,
      secretlist: secretlist,
      annexlist: annexlist
    }
    data.push(newList)
  }

  for (let i = 5; i < 100; i++) {
    let newList = { // 详细 规则 参照mockjs官网
      id: i + 1,
      name: Random.cname(), // Random.cname() 随机生成中文名
      title: Random.csentence(5, 30), //  Random.csentence( min, max )
      content: '<p>vdsfdsfds fsddf</p><table><tbody><tr class="firstRow"><td width="167" valign="top"></td><td width="167" valign="top"></td><td width="167" valign="top"></td><td width="167" valign="top"></td><td width="167" valign="top"></td></tr></tbody></table><p><br/></p>  1111111111111 <p>大家好：</p><p><br/></p<p>从 2015 年 4 月起，Ant Design 在蚂蚁金服中后台产品线迅速推广，对接多条业务线，覆盖系统 800 个以上。</p><p>定位于中台业务的 Ant Design 兼顾专业和非专业的设计人员，具有学习成本低、上手速度快、实现效果好等特点，并且提供从界面设计到前端开发的全链路生态，可以大大提升设计和开发的效率。</p><p><br/></p><p><br/></p><p>Thanks and Best Regards!</p><p>--------------------------------------</p><p>核心价值观：责任、服务、创新、共赢</p><p>做事标准：务实、严谨、高效、奋斗</p><p><br/></p>', //  Random.csentence( min, max )
      url: Random.dataImage('40x40', ''), // Random.dataImage( size, text ) 生成图片（base64位数据格式）
      datetime: Random.date() + ' ' + Random.time(), // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
      isStar: false,
      isAnnex: false,
      isRead: true,
      isSelected: false,
      acceptlist: acceptlist,
      cclist: cclist,
      secretlist: secretlist,
      annexlist: annexlist
    }
    data.push(newList)
  }

  return data
}

// url为要拦截的请求地址  请求方式  请求数据（规则） （此处api会被mockjs拦截）
Mock.mock('api/emails', 'get', (params) => {
  let emails = getEmails()
  let info = JSON.parse(params.body)
  let [index, size, total] = [info.pageIndex - 1, info.pageSize, emails.length]
  let len = total / size
  let totalPages = len - parseInt(len) > 0 ? parseInt(len) + 1 : len
  let newDatas = emails.slice(index * size, (index + 1) * size)
  let datas = newDatas.sort(t => t.datetime)
  let result = {
    'code': '0',
    'message': 'success',
    'data': {
      'pageIndex': index,
      'pageSize': size,
      'data': datas,
      'total': total,
      'totalPages': totalPages
    }
  }
  return result
})

Mock.mock('api/email', 'get', (params) => {
  let datas = getEmails()
  let info = JSON.parse(params.body)
  let data = datas.filter(t => t.id === Number(info.id))
  return data
})
