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

