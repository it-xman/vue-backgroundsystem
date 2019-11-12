<template>
    <div class="login-container">
      <div class="login-box">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" status-icon>
          <img src="./logo_index.png" alt="">
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号">
              <i slot="prefix" class="iconfont icon-shoujihao"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="loginForm.code" placeholder="请输入验证码">
              <i slot="prefix" class="iconfont icon-yanzhengma2"></i>
            </el-input>
          </el-form-item>
          <el-form-item style="text-align: left" prop="xieyi">
            <el-checkbox v-model="loginForm.xieyi">我已阅读并同意用户协议和隐私条款</el-checkbox>
          </el-form-item>
          <el-button
                  type="primary"
                  style="width: 100%"
                  @click="login()"
                  :loading="isActive"
                  :disabled="isActive"
          >
            登录
          </el-button>
        </el-form>
      </div>
    </div>
</template>

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
