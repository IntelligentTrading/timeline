<template>
  <div>
    <img src="https://intelligenttrading.org/wp-content/uploads/itf-logo-blue.png" class="logo">
    <el-row :gutter="24">
      <el-col :span="12" style="display:flex;height:100vh">
        <div style="margin:auto;">
          <el-card class="login-card" shadow="never">
            <el-row style="text-align:left;font-size:24px;padding-bottom:20px">
              <label style="font-weight:600;letter-spacing:1px">Better Visualization.
                <br>Better trading.
              </label>
            </el-row>
            <el-row style="text-align:left;font-size:14px">
              <label
                class="welcome-text"
              >Timeline is on private testing now. Get early access by subscribing or trying the platform for 7 days.</label>
            </el-row>
            <el-row style="margin: 50px 0;display: flex;">
              <el-button class="trial">Try 7 days</el-button>
              <el-button class="more">Learn More</el-button>
            </el-row>
            <el-row style="text-align:left;font-size:14px">
              <label class="welcome-text">Already on a PRO plan?</label>
            </el-row>
            <el-row>
              <vue-telegram-login
                mode="callback"
                :telegram-login="this.bot"
                @callback="auth"
                size="medium"
                :userpic="false"
              />
            </el-row>
            <el-row>
              <label v-show="error !== ''">{{error}}</label>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12" class="right-login-col"></el-col>
    </el-row>
  </div>
</template>

<script>
import { vueTelegramLogin } from "vue-telegram-login";
import moment from "moment";
import { mapActions, mapState } from "vuex";
import _ from "lodash";
import api from "../store/api";
import ItfUser from "../Model/ItfUser";

export default {
  name: "Login",
  data() {
    return {
      telegramChatId: "",
      error: "",
      bot: process.env.TELEGRAM_BOT_NAME
    };
  },
  methods: {
    ...mapActions(["getHistory", "getHistoryPrice"]),
    auth: async function(user) {
      let itfUserDto = await api.user(user.id);
      if (itfUserDto) {
        let itfUser = new ItfUser(JSON.parse(itfUserDto));
        if (itfUser.isPro) {
          localStorage.setItem("user", JSON.stringify(itf_user));
          this.$router.push({ path: `home` });
        } else {
          this.error =
            "Sorry, this version is in BETA and reserved to PRO users only.";
        }
      } else {
        this.error = "User not found!";
      }
    }
  },
  components: { vueTelegramLogin }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.login-card {
  height: 350px;
  width: 350px;
  border: 0px !important;
}

.right-login-col {
  height: 100vh;
  background: url("https://cdn.dribbble.com/users/292354/screenshots/4622672/ai_signals_trading.jpg");
}

.logo {
  height: 30px;
  top: 30px;
  left: 30px;
  position: absolute;
}

.trial {
  width: 300px;
  background: cornflowerblue !important;
  border: cornflowerblue solid 1px !important;
  color: white !important;
}

.more {
  background: transparent;
  color: cornflowerblue !important;
  border: cornflowerblue solid 1px !important;
}
</style>
