<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="storeName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="storeName"
          v-model="loginForm.storeName"
          placeholder="请输入用户名..."
          name="storeName"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="storePassword">
          <span class="svg-container">
            <svg-icon icon-class="storePassword" />
          </span>
          <el-input
            :key="storePasswordType"
            ref="storePassword"
            v-model="loginForm.storePassword"
            :type="storePasswordType"
            placeholder="请输入密码..."
            name="storePassword"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="storePasswordType === 'storePassword' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">立即登录</el-button>
    </el-form>
  </div>
</template>

<script>
import SocialSign from './components/SocialSignin'
import { storeLogin,storeRouters,setUser } from '@/api/user'
import { setToken,setMenus } from '@/utils/auth'

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    return {
      loginForm: {
        storeName: '',
        storePassword: ''
      },
      loginRules: {
        storeName: [{ required: true, trigger: 'blur', message: "请输入用户名" }],
        storePassword: [{ required: true, trigger: 'blur', message: "请输入密码" }]
      },
      storePasswordType: 'storePassword',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      router: [
          {
              path: "",
              component: "Layout",
              redirect: "dashboard",
              children: [
                  {
                      path: "dashboard",
                      component: "dashboard/index",
                      meta: {
                          title: "首页",
                          icon: "dashboard"
                      }
                  }
              ]
          }
      ]
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.storeName === '') {
      this.$refs.storeName.focus()
    } else if (this.loginForm.storePassword === '') {
      this.$refs.storePassword.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.storePasswordType === 'storePassword') {
        this.storePasswordType = ''
      } else {
        this.storePasswordType = 'storePassword'
      }
      this.$nextTick(() => {
        this.$refs.storePassword.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
            storeLogin(this.loginForm).then(res => {
            //this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
              this.$message.success("登录成功！")
              setToken(res.data.token)
              setUser(res.data.user)
              //获取商家菜单权限
              storeRouters(res.data.store.storeId).then(res=>{
                  //...
                  setMenus(res.data)
              })
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
