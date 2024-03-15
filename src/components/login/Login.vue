<template>
  <div class="body">
    <el-image :src="loginBg" class="loginBg"/>
    <div><el-image :src="aixlab" class="aixlab"/></div>
    <div class="appName">{{ appName }}</div>
    <div class="" >
      <a class="aixlabChatbotGuide" style="color:#FFF" href="/robot/robot.html" target="_blank">聊天机器人手册</a>
      <a class="aixlabStudy" style="color:#FFF" href="http://www.knowyourself.xyz/AI/" target="_blank">教学系统</a>
      <a class="aixlabDown" style="color:#FFF" href="/downloads/" target="_blank">客户端下载</a>
      <a class="aixlabSecification" style="color:#FFF" href="/shouce/shouce.html" target="_blank">使用说明</a>
    </div>
    <div class="loginTip">
      <div><el-image :src="aixlab" class="aixlabTip"/></div>
      <div class="appNameTip">{{ appDesc }}</div>
    </div>
    <div class="loginBox">
      <el-input size="small" placeholder="请输入用户名" v-model="account" style="width: 250px;"/>
      <el-input size="small" placeholder="请输入密码" show-password v-model="password"
                style="width: 250px;margin-top: 20px"/>
      <el-button @click="loginOrRegister()" type="primary" size="small" style="width: 250px;margin-top: 20px">
        {{ scene === 0 ? '登录' : '注册' }}
      </el-button>
<!--      <el-button @click="changeScene()" type="text" size="small" style="width: 250px;margin-left: 0;margin-top: 10px">
        {{ scene === 0 ? '注册' : '已有账号，去登录' }}
      </el-button>  &lt;!&ndash;部署线上暂时隐藏注册入口&ndash;&gt;-->
    </div>
    <a class="aixlabIcp" style="color:#FFF" href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">aixlab.cn 版权所有 ICP证: 京ICP备15065656号-6</a>
  </div>
</template>

<script>
import loginBg from '@/assets/login_bg.png'
import aixlab from '@/assets/aixlab.png'
import {loginOrRegister} from "@/http/loginRequest"

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  data() {
    return {
      loginBg: loginBg,
      aixlab: aixlab,
      appName: this.$store.state.appName,
      appDesc: this.$store.state.appDesc,
      account: '',
      password: '',
      scene: 0
    }
  },
  methods: {
    changeScene() {
      this.scene = this.scene === 0 ? 1 : 0
    },

    loginOrRegister() {
      let data = {
        account: this.account,
        password: this.password
      }
      let login = this.scene === 0
      loginOrRegister(login, data).then(data => {
        if (login) {
          switch (data.state) {
            case 100:
              this.$store.commit("saveToken", data.data.token);
              this.$store.commit("saveUsername", data.data.account);
              this.$store.commit("saveUserlevel", data.data.level);
              this.$router.push({path: '/home'});
              break;
            case 101:
              this.$message.error("尚未注册")
              break;
            case 102:
              if (!this.password) this.$message.error("请输入密码")
              else this.$message.error("密码错误")
              break;
          }
        } else {
          if (data.state === 100) {
            this.$message.success("注册成功")
            this.scene = 0;
          } else {
            this.$message.error("注册失败")
          }
        }
      }).catch(reason => {
        console.log(reason)
      })
    }
  }
}
</script>

<style scoped>
.body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}

.loginBg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.aixlab {
  position: absolute;
  left: 50px;
  top: 30px;
  width: 100px;
  height: 20px;
}
.aixlabTip {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 200px;
  height: 40px;
}
.appNameTip {
  position: absolute;
  left: 0px;
  top: 50px;
  font-size: 18px;
  color: white;
}

.appName {
  position: absolute;
  left: 50px;
  top: 50px;
  font-size: 18px;
  color: white;
}

.loginBox {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 380px;
  height: 260px;
  border-radius: 15px;
  background: white;
}
.loginTip {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 380px;
  height: 120px;
  border-radius: 15px;
  background: transparent;
}
.aixlabIcp {
  position: absolute;
  display: block;
  bottom: 20px;
  background: transparent;
}
.aixlabDown {
  position: absolute;
  right: 50px;
  top: 50px;
  font-size: 18px;
  color: white;
}
.aixlabStudy {
  position: absolute;
  right: 150px;
  top: 50px;
  font-size: 18px;
  color: white;
}
.aixlabSecification{
  position: absolute;
  right: 235px;
  top: 50px;
  font-size: 18px;
  color: white;
}
.aixlabChatbotGuide {
  position: absolute;
  right: 320px;
  top: 50px;
  font-size: 18px;
  color: white;
}
</style>
