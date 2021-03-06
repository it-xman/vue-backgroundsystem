# Vue开发后台管理系统

## 1. 登录页面

### 1.1 登录页面制作 使用element-ui组件及弹性盒子布局

```vue
<template>
    <div class="login-container">
      <div class="login-box">
        <el-form ref="loginFormRef" :model="loginForm">
          <img src="./logo_index.png" alt="">
          <el-form-item>
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="loginForm.code" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <el-form-item style="text-align: left">
            <el-checkbox v-model="loginForm.xieyi">我已阅读并同意用户协议和隐私条款</el-checkbox>
          </el-form-item>
          <el-button type="primary" style="width: 100%">登录</el-button>
        </el-form>
      </div>
    </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      loginForm: {
        mobile: '',
        code: '',
        xieyi: false
      }
    }
  }
}
</script>

<style scoped lang="less">
  .login-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("./login_bg.jpg") no-repeat;
    background-size: cover;
    .login-box{
      width: 400px;
      height: 350px;
      background-color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      .el-form {
        width: 85%;
        text-align: center;
        img {
          width: 50%;
          margin-bottom: 20px;
        }
      }
    }
  }

</style>

```

### 1.2 表单验证--简单验证

- 点击登录按钮，验证通过即跳转到后台首页
- 为了减轻后台服务器压力，所以要过滤掉一些无用的，不符合规则的信息
- 当用户输入完手机号和验证码之后即验证输入的是否符合规则并给与用户一定提示

```javascript
data () {
    return {
      loginForm: {
        mobile: '',
        code: '',
        xieyi: true
      },
      loginFormRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[356789]\d{9}$/, message: '手机号码格式不正确' }
        ],
        code: [
          { required: true, message: '请输入验证码' }
        ]
      }
    }
  }
```

- 注意：

  - 每个表单域项目根据需要可以配置**多个**校验项目
  - elementui内部有引入第三方功能包实现校验，名称为[async-validator](https://github.com/yiminghe/async-validator)  可以参考使用
  - required只校验 null   undefined 和空字符串 ,但是不校验false/true

  | 规则         | 说明                                                         |
  | ------------ | ------------------------------------------------------------ |
  | type(可不填) | 指定要检验的字段的类型                                       |
  | required     | 必填项,如果不填 就无法通过校验/如果为true,就表示该字段必填   |
  | validator    | **`自定义校验函数`**                                         |
  | message      | 当不满足设置的规则时的提示信息                               |
  | pattern      | 正则表达式                                                   |
  | range        | 使用min和max属性定义范围。对于字符串和数组类型，将根据长度进行比较，对于数字类型，数字不得小于min，也不得大于max。 |
  | len          | 要验证字段的确切长度，请指定len属性。对于字符串和数组类型，对length属性执行比较，对于数字类型，此属性指示数字的完全匹配，即，它可能仅严格等于len。如果len属性与最小和最大范围属性组合，则len优先。 |
  | enum         | 要从可能值列表中验证值，请使用带枚举属性的枚举类型，列出该字段的有效值，例如： var descriptor = {   role: {type: "enum", enum: ['admin', 'user', 'guest']} } |


### 1.3 登录验证--整体表单校验

- 账号表单域项目不仅正常输入要校验、用户单击 登录 按钮后也要校验一次

  ```javascript
  // 全部表单域项目校验
  			// 通过el-form的ref属性获得整体表单
        // 获得form表单组件的语句: this.$refs.loginFormRef
        // form组件.validate(回调函数)
        // 参数valid：会体现布尔值，表示校验是否成功
  
    methods: {
      login () {
        this.$refs.loginFormRef.validate((valid) => {
          if (valid) {
            this.$router.push({ name: 'home' })
          }
        })
  
        // this.$router.push({ name: 'home' })
      }
    }
  ```

- 1. el-form组件内部有属性值 ref="loginFormRef"，Vue允许通过 this.$refs.loginFormRef的方式获得该组件对象
  2. el-form组件本身可以调用validate方法，实现对**全部**表单域项目做校验
  3. validate内部有**回调函数**参数，该函数内部还有valid参数，valid会返回布尔值，进而知道校验是否成功
  4. validate内部的回调函数要设置为  “箭头函数”，使得内部this与外部保持一致指引，都是组件实例
  5. form表单全部做校验还与el-form 的**model属性**有关系，其会获取全部的表单信息，提供校验使用

### 1.4 表单校验--自定义校验--协议勾选校验

- 自定义校验函数，验证协议
  - rule:校验规则，一般不用
  - value:当前被校验的信息
  - callback：回调函数，校验成功或失败都需要执行
  - 校验方法需要在return语句的“前边”设置
  - 通过validator使用该自定义校验方法

```javascript
data () {
    var xieyiTest = (rule, value, callback) => {
      value ? callback() : callback(new Error('请认真阅读并勾选协议'))
    }
    return {
      loginForm: {
        mobile: '13855566678',
        code: '246810',
        xieyi: true
      },
      loginFormRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[356789]\d{9}$/, message: '手机号码格式不正确' }
        ],
        code: [
          { required: true, message: '请输入验证码' }
        ],
        xieyi: [
          { validator: xieyiTest }
        ]
      }
    }
  },
```

- 说明：

  1. 协议  项目没有提供校验机制(required不能校验true/false的信息)，故要自定义

  2. 校验协议信息的 xieyiTest 方法需要定义到data方法中，注意不是**return内部**
  3. 校验规则要使用 validator 关联 xieyiTest函数

### 1.5 配置axios

```javascript
import axios  from  'axios'
// 配置后端服务器接口公共根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'  
Vue.prototype.$http = axios  
```

- 根据ElementUI事件方法注册机制，给axios做如下配置

  `Vue.prototype.$http = axios`   

  - axios通过继承方式配置为Vue的成员，这样所有通过Vue实例出来的对象就都可以访问，形式为this.\$http

  - 单文件组件VueComponent也有继承Vue，因此组件实例都可以通过 this.\$http 的方式访问axios对象

### 1.6 校验对象

- 通过axios向服务器端发送请求，实现账号的**真实性**校验

- 用户登录系统，表单域校验成功后，要通过axios校验账号的真实性，成功再进入后台系统

  ```javascript
    methods: {
      login () {
        this.$refs.loginFormRef.validate((valid) => {
          if (valid) {
            let pro = this.$http.post('/authorizations', this.loginForm)
            pro
              .then(result => {
                if (result.data.message === 'OK') {
                  this.$router.push({ name: 'home' })
                }
              })
              .catch(err => {
                return this.$message({ type: 'error', message: '用户名或密码错误' + err })
              })
          }
        })
      }
    }
  ```

  -  elementui组件库事件方法$message使用有两种格式

    1. this.$message({type:'error', message:'用户名或密码错误'})

    2. this.$message.error('用户名或密码错误')

    3. 设置停留时间：

       this.$message({type:'error', message:'用户名或密码错误',duration:1000})

### 1.7 客户端记录账号信息

- 通过sessionStorage在客户端存储服务器端返回的用户信息
- 管理员登录系统成功，通过sessionStorage对各个信息(id/name/photo/token)做记录，用以表示当前用户处于登录状态

```javascript
methods: {
    login () {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) {
          return false
        }
        let pro = this.$http.post('/authorizations', this.loginForm)
        pro
          .then(result => {
            if (result.data.message === 'OK') {
              window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
              this.$router.push({ name: 'home' })
            }
          })
          .catch(err => {
            return this.$message({ type: 'error', message: '用户名或密码错误' + err })
          })
      })
    }
  }
```

- 服务器端返回的账号数据信息是一个**对象**，内部有 id/name/photo/token等，webstorage不能存储对象，故要通过  **JSON.stringify()**  进行转换变为字符串，相反信息做应用时还要通过  **JSON.parse()**  再转回为对象
- 一般客户端只存储用户token信息即可(表明是否处于的登录状态)，存储其他信息是为了其他用途
- 如果有其他考虑，使用localStorage存储用户信息也可以

### 1.8 非登录用户限制访问

- 针对**非登录**用户要禁止访问后台系统，相反强制登录去
- 在路由中设置路由守卫进行判断

```javascript
router.beforeEach((to, from, next) => {
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (!userinfo && to.path !== '/login') {
    return next({ name: 'login' })
  }
  next()
})
```

1. 如果用户已经退出系统，或由于其他原因导致客户端数据丢失，则userinfo的信息为**null**
2. 如果其他应用要用**userinfo**用户信息，其是字符串类型，需要通过**JSON.parse()**转换后才可以使用

### 1.9 极验--人机验证

- 人机交互页面效果系统，用户的**行为**没有满足要求，不给与下一步执行的机会
  - 大致效果如下，用户如果没有把目标滑到指定区域就禁止下一步操作
- 传统网站，用户输入 **用户名**、**密码**、**验证码**  就可以登录系统了
  - 这样的网站不安全，有网络**爬虫**技术，可以通过“后端程序代码” **模拟账号**登录，进而获得我们网站的信息
- 比较先进的网站，都使用“**人机交互验证**”功能，对登录者提出高要求，不让模拟登录得逞，相反只允许“实在的人”来登录系统并应用
- 好处：防止账号暴力破解，不给模拟登录机会，增强系统的安全性
- eslint标准规范中有如下要求：
  1. 函数传递参数，不能直接传递boolean值，相反可以声明变量传递(gt.js文件中一共有4处，注意调整)
  2. 要通过 “===”恒等于 方式 判断两个字是否相等(为了使得数据类型是严格的字符串，额外调用了toString()方法，请注意)
  3. 不要设置**空的**回调函数实参，没有意义
- 开发人机验证步骤：
  1. axios向本身后端服务器发起请求，后端服务器会返回极验请求的秘钥信息
  2. **极验秘钥信息** + **用户行为** 一并提交给 极验服务器 做判断，查验行为是否正确
- axios获取极验请求的秘钥信息
  1. 把 账号真实校验 和 登录系统 逻辑代码封装为独立的loginAct方法，方便开发
  2. axios根据接口发送请求，获得极验请求秘钥信息
-  A. axios获得极验请求秘钥信息
  -  // 服务器端返回极验的请求秘钥信息
-  B. 账号真实校验，登录后台
  -  this.loginAct()

```javascript
methods: {
    login () {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) {
          return false
        }
        let pro = this.$http.get(`/captchas/${this.loginForm.mobile}`)
        pro
          .then(result => {
            console.log(result)
          })
          .catch(err => {
            return this.$message({ type: 'error', message: '获取极验初始校验信息失败' + err })
          })

        this.loginAct()
      })
    },
    loginAct () {
      let pro = this.$http.post('/authorizations', this.loginForm)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
            this.$router.push({ name: 'home' })
          }
        })
        .catch(err => {
          return this.$message({ type: 'error', message: '用户名或密码错误' + err })
        })
    }
  }
```

- 创建校验窗口并应用
  - 绘制极验 人机交互 窗口，用户输入完毕账号等信息，单击登录按钮后要显示极验窗口并完成验证和登录系统
- 步骤：
  1. 在login/index.vue中向引入gt.js文件
  2. 对返回的极验请求秘钥信息做接收处理(对象解构赋值)
  3. 调用initGeetest() 函数，生成极验窗口
     - 添加product:'bind'
     - verify()等方法调用
  4. 在login方法内部为了使得this仍然指引VueComponent组件实例对象，要把相关的function都变为箭头函数

```javascript
 methods: {
    login () {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) {
          return false
        }
        let pro = this.$http.get(`/captchas/${this.loginForm.mobile}`)
        pro
          .then(result => {
            window.initGeetest({
              // 以下配置参数来自服务端 SDK
              gt: result.data.data.gt,
              challenge: result.data.data.challenge,
              offline: !result.data.data.success,
              new_captcha: true,
              product: 'bind'
            }, (captchaObj) => {
              // 这里可以调用验证实例 captchaObj 的实例方法
              captchaObj.onReady(() => {
                // 验证码ready之后才能调用verify方法显示验证码
                captchaObj.verify()
              }).onSuccess(() => {
                // 行为验证成功后执行的动作，检验账号真实性
                // your code
                this.loginAct()
              }).onError(() => {
                // your code
              })
            })
          })
          .catch(err => {
            return this.$message({ type: 'error', message: '获取极验初始校验信息失败' + err })
          })
      })
    },
    loginAct () {
      let pro = this.$http.post('/authorizations', this.loginForm)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
            this.$router.push({ name: 'home' })
          }
        })
        .catch(err => {
          return this.$message({ type: 'error', message: '用户名或密码错误' + err })
        })
    }
  }

```

- 按钮等待和禁用

  ```
  :loading="ture/false"
  :disabled="ture/false"
  ```

  1. data成员设置  isActive:false
  2. 给el-button登录按钮应用 loading  和  disabled属性，它们的值通过 isActive控制
  3. 单击登录按钮后马上禁用 按钮  this.isActive= true
  4. 极验交互窗口显示完毕 就恢复按钮 this.isActive= false
  5. 登录按钮禁用需在验证窗口显示的代码之后设置，原因是使用之前缓存的极验对象，由于速度很快，按钮就不需要做禁用状态了

- 处理重复创建dom问题

  - 采取措辞，使得用户多次单击登录按钮，关于极验窗口的dom内容只生成一份
  - 每次单击“登录”按钮，那么就显示“人机交互”页面，本质是许多div  html标签的集合体，如果反复点击“登录”按钮，之前的"窗口"，就隐藏掉(display:none)，再重新生成许多div出来，这个过程不好的地方是，用户都需要等很长时间，并且页面会残留许多无用、过时的dom内容
  - 做优化处理：
    - 第一次生成人机窗口后，就给保存起来，后续再发生相同的动作直接使用即可
    - 好处：用户等待时间缩短，页面上也不用生成许多div了

  - 1. 创建data成员 ctaObj
    2. 第一次生成的人机窗口对象 赋予给 this.ctaObj= captchaObj
    3. 用户重复单击登录窗口使用缓存好的极验对象

```javascript
<script>
import '@/assets/js/gt.js'
export default {
  name: 'index',
  data () {
    var xieyiTest = (rule, value, callback) => {
      value ? callback() : callback(new Error('请认真阅读并勾选协议'))
    }
    return {
      loginForm: {
        mobile: '13855566678',
        code: '246810',
        xieyi: true
      },
      loginFormRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[356789]\d{9}$/, message: '手机号码格式不正确' }
        ],
        code: [
          { required: true, message: '请输入验证码' }
        ],
        xieyi: [
          { validator: xieyiTest }
        ]
      },
      isActive: false,
      ctaObj: null
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.ctaObj !== null) {
          return this.ctaObj.verify()
        }
        this.isActive = true
        let pro = this.$http.get(`/captchas/${this.loginForm.mobile}`)
        pro
          .then(result => {
            window.initGeetest({
              // 以下配置参数来自服务端 SDK
              gt: result.data.data.gt,
              challenge: result.data.data.challenge,
              offline: !result.data.data.success,
              new_captcha: true,
              product: 'bind'
            }, (captchaObj) => {
              // 这里可以调用验证实例 captchaObj 的实例方法
              captchaObj.onReady(() => {
                // 保存创建好的窗口对象
                // 验证码ready之后才能调用verify方法显示验证码
                captchaObj.verify()
                this.ctaObj = captchaObj
                this.isActive = false
              }).onSuccess(() => {
                // 行为验证成功后执行的动作，检验账号真实性
                // your code
                this.loginAct()
              }).onError(() => {
                // your code
              })
            })
          })
          .catch(err => {
            return this.$message({ type: 'error', message: '获取极验初始校验信息失败' + err })
          })
      })
    },
    loginAct () {
      let pro = this.$http.post('/authorizations', this.loginForm)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
            this.$router.push({ name: 'home' })
          }
        })
        .catch(err => {
          return this.$message({ type: 'error', message: '用户名或密码错误' + err })
        })
    }
  }
}
</script>

```

### 1.10 iconfont图标

- 通过“命名插槽”的方式给 手机和验证码 的输入框前边设置对应的图标

- elementui组件库有提供有限的图标供使用，还可以通过  **阿里巴巴** 网站获取其他的一些图标做应用

- 引入iconfont的css文件

  - ```
    import '@/assets/iconfont/iconfont.css'
    ```

- 给输入框做图标应用

```
<i slot="prefix" class="iconfont icon-shoujihao"></i>
```

## 2. 后台首页

### 2.1 绘制品字页面结构

- 使用element-ui的 **布局容器** 找到合适的布局效果

- 制作头部

  - 两个部分，一左一右。只用弹性盒子将两部分分开居中。
  - 左边设置一个可点击的伸缩左侧导航菜单的按钮还有后台系统介绍
  - 右边盒子设置搜索框、消息提示、头像框及用户信息和 **element-ui** 的下拉菜单，菜单内设置需要的信息。

- 制作左侧导航菜单

  - 使用 element 组件的侧栏导航菜单

    - 找到相应合适的组件拿来使用
    - 设置叶子菜单
      - index在父级菜单上边可以设置一个唯一属性用以区分彼此
      - 在子菜单上后期可以设置请求#锚点信息，单击后也执行具体的导航

  - 统一菜单的宽度都为200px

  - 折叠展开效果

    - 给el-menu设置相关属性

      ```vue
      :collapse="isCollapse"       // 控制折叠展开
      :collapse-transition="false" // 禁用折叠动画
      ```

    - 创建data成员 isCollapse=false，控制折叠展开

    - ```js
      isCollapse: false  // false:展开   true:折叠
      ```

    - 给"图标"设置单击事件，折叠展开要显示不同的图标(unfold  和 fold 区分)

      - 菜单折叠展开，小图标也要做变换显示操作

      ```vue
      <i
              slot="prefix"
              :class=" isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
              @click="isCollapse=!isCollapse"
              style="cursor: pointer;position: absolute; left: 18px"
      >
      </i>
      ```

    - 菜单宽度自适应

      - 点击小图标以后宽度要缩小到65px以达到只显示小图标的左侧导航菜单

- 整个首页面设计代码

```html
  <el-container>
    <el-aside :width=" isCollapse? '65px' : '200px'">
      <el-menu
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              :collapse="isCollapse"
              :collapse-transition="false"
              router
      >
        <el-menu-item index="1" :style="{width:isCollapse? '65px' : '200px' }">
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2" :style="{width:isCollapse? '65px' : '200px' }">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item index="2-1">发布文章</el-menu-item>
          <el-menu-item index="2-2">文章列表</el-menu-item>
          <el-menu-item index="2-3">评论列表</el-menu-item>
          <el-menu-item index="2-4">素材管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" :style="{width:isCollapse? '65px' : '200px' }">
          <i class="el-icon-location"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="4" :style="{width:isCollapse? '65px' : '200px' }">
          <i class="el-icon-location"></i>
          <span slot="title">账户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="position: relative">
        <div id="lt">
          <i
                  slot="prefix"
                  :class=" isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
                  @click="isCollapse=!isCollapse"
                  style="cursor: pointer;position: absolute; left: 18px"
          >
          </i>
          <span style="margin-left: 20px;">XCR后台管理系统</span>
        </div>
        <div id="rt">
          <el-input type="text" placeholder="请输入搜索的文章内容" style="width: 300px">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span style="margin: 0 30px 0 15px;">消息</span>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <img :src="photo" alt="" width="40" height="40" style="margin-right: 10px">
              {{name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>GitHub地址</el-dropdown-item>
              <el-dropdown-item @click="logout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>Main</el-main>
    </el-container>
  </el-container>

```

### 2.2 退出登录功能

- 点击用户信息或头像显示退出按钮，点击退出按钮，确认是否退出，给与提示
- 确认退出，删除缓存的用户信息，sessionStorage
- 跳转到登录页面
- 给退出按钮绑定点击事件的时候是给引用的element组件绑定事件
  - 直接绑定@click事件不生效
    - @click是vue事件绑定操作，具体是给普通的html标签使用的
  - 需要设置 @click.native才会生效
    - el-dropdown-item本身是一个“组件”，组件是组多html标签的集合体，这个集合体绑定事件，不知道具体给到那个标签使用，因此事件绑定失败
    - 因此设置一个名称为native的修饰符(**事件修饰符**)，使得该事件作用到内部的html标签身上

### 2.3 右侧welcome页面显示

- 制作欢迎页面组件

- 将页面组件添加到路由

- 登录后台默认显示欢迎页面

- 将其设置为home组件的子路由

- 使用重定向，/home默认显示/welcome

  ```js
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home'),
      redirect: '/welcome',
      children: [
        { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome/Welcome.vue') }
      ]
    }
  ```

  - 注意：虽然有redirect重定向，component也需要保留

- 给home/index.vue配置子组件显示占位符

  ```vue
        <el-main>
          <router-view></router-view>
        </el-main>
  ```


## 3. 文章列表

### 3.1 创建文章列表组件并设置路由

- 创建文章列表组件

- 将文章列表组件加入路由

- 给后台首页的文章列表的index属性设置锚点信息

  - 文章列表路由也是home的子路由

- 需在el-num里设置 router 属性 ，让其激活路配置由，实现单击显示文章列表组件内容

- el-menu组件可以使得本身的菜单项目具备**声明式导航**功能(类似router-link功能)

  - 给el-menu设置**router**属性，使得路由导航功能被激活
  - 在el-menu-item的**index**属性中配置锚点信息

- Vue中属性绑定布尔值true，可以通过如下两种方式

  ```html
  <标签 :属性="true"><标签>   // 1.普通属性绑定
  <标签 属性><标签>           // 2.直接声明空的属性名称
  ```

### 3.2 给文章列表设置具体内容

- 绘制文章列表搜索区域**卡片**和 **表单域名称** 信息

  - 使用element的卡片区组件
    - 头部内容为命名插槽
    - 内容主体为匿名插槽
  - 设置el-form表单区域
    - 文章状态
    - 频道选择
    - 时间选择

- 状态表单域

  - 绘制搜索文章的状态表单域(单选按钮)

  - el-radio

    ```vue
              <el-form-item label="文章状态：">
                <el-radio v-model="searchForm.status" label="">全部</el-radio>
                <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
                <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
                <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
                <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
              </el-form-item>
    ```

  - v-model：双向绑定，获取被选中的项目  或 设置哪个项目选中

  - label：用于设置当前单选按钮的**value**值情况

  - 添加data成员

- 频道表单域

  - 绘制搜索文章的频道表单域（下拉列表）

    ```vue
              <el-form-item label="频道列表：">
                <el-select v-model="searchForm.channel_id" placeholder="请选择">
                  <el-option
                          v-for="item in channelList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
    ```

  - v-model: 双向绑定，获取选中的项目  或 设置哪个项目选中

  - clearable：可以清除选中的项目

  - label  设置每个项目对外提示的名称

  - value 设置每个项目真实起作用的value值

  - 设置data成员channel_id和channelList

- 时间表单域

  - 绘制文章日期选择表单域

    ```vue
              <el-form-item label="时间选择：">
                <el-date-picker
                        v-model="selectTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format = "yyyy-MM-dd"
                >
                </el-date-picker>
    ```

  - v-model ：双向绑定，获取设置好的时间信息，或设置哪个时间显示

  - type="daterange" : 类型设置，daterange表示是日期范围选取的，还有其他可选 year/month/date/dates/ week/datetime/datetimerange/ daterange/monthrange 

  - value-format  设置时间格式，例如 yyyy-MM-dd

  - el-date-picker组件的v-model="selectTime"接收到的是一个**数组**信息，里边的第1、2个单元分别代表开始日期和结束日期，要想办法把其分配给searchForm的两个成员(pub_date和 end_data)里边去

- watch监听器

  - 监测vue中data数据的变化，并做相关处理

  - 语法

    ```javascript
    data(){
      return {
        name:'',
        addr:'',
        cat:{
          leg:'',
          tail:'',
          son:{
            name:'小黄',
            weight:50
          }
        }
      }  
    }
    watch:{
      data成员名称:函数(新值，旧值){}
      name:function(newv,oldv){},
      addr:function(newv,oldv){},
      'cat.leg':function(newv,oldv){},  // 对象成员监听
      'cat.tail':function(newv,oldv){},
      cat: { // 深度监听，内部任意成员变化都会感知到
        handler: function (newv, oldv) { /* ... */ },
        deep: true
      },
    }
    ```

  - 监听器既可以监听**普通成员**、也可以监听**对象成员**，还可以**深度**监听

  - 一般this可以调用的成员属性都可以监听，例如computed计算属性，但是data作为主要使用对象

  - 深度监听，使用**handler**+**deep**关键字达成

- 监听selectTime

  ```javascript
    watch: {
      selectTime: function (newVal, oldVal) {
        if (newVal) {
          this.searchForm.pub_date = newVal[0]
          this.searchForm.end_data = newVal[1]
        } else {
          this.searchForm.pub_date = ''
          this.searchForm.end_data = ''
        }
      }
    }
  ```

  - 把newVal的值拆分分别给到 begin_pubdate和end_pubdate 里边
  - 日期选择器有清空功能，因此监听器也要有清空设置	

### 3.3 获得真实频道数据并展示

- 通过axios获得服务器端真实的频道信息

- 创建getChannleList方法获取数据并赋值给data成员的channelList

- 在created中调用getChannleList方法

  ```javascript
  created () {
      this.getChannelList()
    },
    methods: {
      getChannelList () {
        let pro = this.$http.get('/channels')
        pro
          .then(result => {
            if (result.data.message === 'OK') {
              this.channelList = result.data.data.channels
            }
          })
          .catch(error => {
            return this.$message.error('获取文章列表出错' + error)
          })
      }
    }
  ```

### 3.4 文章列表区域

- 用户第一次登录系统时，服务器端返回了一个身份秘钥信息(token)，表明当前用户有 资格、权利 访问服务器
- token之后通过sessionStorage存储在浏览器中，后续再向服务器发送请求，需要携带token，用以亮明身份。
- 请求拦截器中给axios配置token
  - 浏览器中并不是始终存在userinfo的用户信息的，也并不是每次请求都要传递token秘钥信息，故要把包含着token的userinfo获得出来，判断存在再赋予给axios，不做判断贸然使用会有错误
  - 根据API接口提示，token信息前边需要  “Bearer ”标志，Bearer后边有<font color=red>空格</font>
  - 如果token秘钥没有配置好，获取文章列表相关axios请求会报如下错误401

### 3.5 将main.js中的axios分离开来添加到一个utils的文件夹中，在src目录下

- 从main.js中把axios相关代码移到新创建的utils下的ax.js里：

  - 因为需要给Vue的原型添加方法，所以要在ax.js里也引入Vue实例

  ```javascript
  import Vue from 'vue'
  import axios from 'axios'
  
  axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
  axios.interceptors.request.use((config) => {
    let userinfo = window.sessionStorage.getItem('userinfo')
    if (userinfo) {
      let token = JSON.parse(userinfo).token
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  }
  
  )
  Vue.prototype.$http = axios
  
  ```

- main.js引入已经独立的axios代码文件

  ```javascript
  import '@/utils/ax.js'
  ```

- 虽然main.js  和 ax.js都有引入Vue，但是系统运行的时候它们是一个对象，运行在不同文件中而已。

### 3.6 获取文章列表信息

- 创建data成员 articleList: []

- 在methods里边创建  getArticleList()方法，用axios去获得文章列表信息

- 在created中调用 getArticleList() 执行

  ```js
      getArticleList () {
        let pro = this.$http.get('/articles')
        pro
          .then(result => {
            console.log(result)
            if (result.data.message === 'OK') {
              this.articleList = result.data.data.results
            }
          })
          .catch(error => {
            return this.$message.error('获取文章列表出错' + error)
          })
      }
  ```

### 3.7 table表格-文章列表展示

- 使用到el-table表格组件

  ```vue
  <el-table :data="数据来源(数组对象集)" style="width:100%;">
    <el-table-column label="表格头信息" prop="被显示数据字段名称" width="列宽度(100)"></el-table-column>
    <el-table-column label="……" prop="……" width="……"></el-table-column>
    <el-table-column label="……" prop="……" width="……"></el-table-column>
    <el-table-column label="……" prop="……" width="……"></el-table-column>
  </el-table>
  ```

  - data: 数据来源(数据在组件实例的data中有声明)
  - prop: 定义当前列数据来源的字段名称，来自data数据对象的成员属性名字
  - label: 定义表格列的表头信息
  - 列的宽度，如果不设置，就自适应占据宽度
  - el-table组件内部已经把 “遍历” 机制给集成好了，我们不用额外设置，多条数据会自动形成多行显示

- data中额外声明tot成员接收总记录条数

  ```js
  data(){
    return {
      tot:0 // 全部记录条数
    }
  }
  ```

- getArticleList()方法中把获得好的总记录条数赋予给tot成员

  ```js
  if (result.data.message === 'OK') {
     console.log(result)
     this.articleList = result.data.data.results
     this.tot = result.data.data.total_count
  }
  ```

- 设置外边距，将搜索栏与信息展示栏分隔开

- 操作列展示

  - 有的列不适合通过具体的数据信息直接呈现，例如操作列，里边具体要显示 **修改**、**删除** 两个按钮
  - 该column列中不要设置**prop**，而修改、删除 按钮等内容通过“**内容区域**”呈现即可

  ```vue
  <el-table-column
     label="操作"
  >
    <el-button type="primary" size="small">修改</el-button>
    <el-button type="danger" size="small">删除</el-button>
  </el-table-column>
  ```

- 图标列展示

  - 图标列   与  操作列   有相似的地方，所要呈现的内容都不能直接通过prop获取到

  - 现在需要在column列的“内容区域”中手工绘制   **img标签**

  - img标签 绘制完毕，其中的src属性 比较特殊，其需要通过后端数据提供，具体是“**作用域插槽**”

  - stData调用<font color=red>row</font>：代表当前被遍历出来的每个文章记录信息(对象){cover、id、pubdate、status、title等字段}

  - stData.row.cover.images[0]：代表当前被遍历出来的每条记录的图标信息

  - 原理

    ```vue
    模拟el-table-column组件内容
    <template>
    	<div>
    		<slot row="每个文章的记录信息，是一个对象，里边有各个成员"></slot>
    	</div>
    </template>
    ```

    - 注意： 在每个el-table-column组件内部都可以通过**作用域插槽**获得当前被遍历出来的各个文章信息，插槽属性名称都是**row**	

    - 作用域插槽

      - 子组件

        ```vue
        <slot a="10" b="20" row="每条文章记录信息，是一个对象，里边有各个成员"></slot>
        ```

      - 父组件

        ```vue
        <子组件>
        	<标签 slot-scope="stData">{{stData.a}}---{{stData.b}}---{{stData.row.xxx}}</标签>
        </子组件>
        ```

  - 图标列展示服务器获取到的图片地址，将src的属性和获取到的图片数据的地址绑定

  ```vue
  <el-table-column
     label="图标"
  >
    <img slot-scope="stData" :src="stData.row.cover.images[0]" alt="没有图标" width="150" height="150">
  </el-table-column>
  ```

- 状态列展示

  - 通过el-tag标签组件把文章的状态效果制作出来
  - el-tag是一个通过type属性体现不同样式效果的组件标签
  - 多个el-tag组件标签都要使用数据部分，作用域插槽不用体现多份，为了减少重复代码编写量，可以使用一个公共的父级**template标签统一**接收使用

  ```vue
  <el-table-column
     prop="status"
     label="状态"
  >
  <template slot-scope="stData">
  <el-tag v-if="stData.row.status===0">草稿</el-tag>
  <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
  <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
  <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
  <el-tag v-else type="danger">已删除</el-tag>
  </template>
  </el-table-column>
  ```

- 文章检索，过滤掉searchForm内空的参数

  - 给获得文章的方法getArticleList()增加文章检索条件参数，并对空的条件做过滤
  - 遍历searchForm的内容，如果存在非空的成员，就将该非空成员赋值到声明的空对象searchData里
  - 将searchData作为请求参数发送到服务端获取带有相应请求参数的数据

  ```js
  getArticleList () {
    let searchData = {}
      for (let i in this.searchForm) {
        if (this.searchForm[i]) {
          searchData[i] = this.searchForm[i]
        }
     }
    let pro = this.$http.get('/articles', { params: searchData })
    pro
      .then(result => {
           if (result.data.message === 'OK') {
            this.articleList = result.data.data.results
            this.tot = result.data.data.total_count
          }
        })
      .catch(error => {
          return this.$message.error('获取文章列表出错' + error)
       })
   }
  ```

### 3.8 下面是第五天的