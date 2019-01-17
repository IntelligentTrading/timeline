<template>
  <div>
    <img src="https://intelligenttrading.org/wp-content/uploads/itf-logo-blue.png" class="logo">
    <el-row :gutter="24">
      <el-col :span="12" style="display:flex;height:100vh">
        <div style="margin:auto;">
          <el-card class="login-card" shadow="never">
            <el-row style="text-align:left;font-size:24px;padding-bottom:20px">
              <label style="font-weight:600;letter-spacing:1px">Better Visualization.
                <br>Better Trading.
              </label>
            </el-row>
            <el-row style="text-align:left;font-size:14px">
              <label
                class="welcome-text"
              >Timeline is on private testing now. Get early access by subscribing or trying the platform for 7 days.</label>
            </el-row>
            <el-row style="margin: 50px 0;display: flex;">
              <el-button class="trial" @click="goToTrialPage">Start 7 days trial</el-button>
              <el-button class="more">Learn More</el-button>
            </el-row>
            <el-row style="text-align:left;font-size:14px">
              <label class="welcome-text">Already on a PRO plan?</label>
            </el-row>
            <el-row style="margin-top: 10px;display: flex;">
              <vue-telegram-login
                mode="callback"
                :telegram-login="this.bot"
                @callback="auth"
                size="large"
                :radius="'4'"
                :userpic="false"
              />
            </el-row>
            <el-row style="text-align:left">
              <label style="font-size:10px">
                Not a member?
                <a
                  href="http://t.me/intelligenttradingbot"
                  target="_blank"
                >Create your account.</a>
              </label>
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
    auth: async function(telegramAuthRes) {
      let itfUserDto = await api.user(telegramAuthRes.id);
      if (itfUserDto) {
        let itfUser = new ItfUser(JSON.parse(itfUserDto), telegramAuthRes);
        if (ItfUser.isPro(itfUser)) {
          localStorage.setItem("user", JSON.stringify(itfUser));
          this.$router.push({ path: `home` });
        } else {
          this.$message.error(
            "Sorry, this version is in BETA and reserved to PRO users only."
          );
        }
      } else {
        this.$message.error({
          message:
            "Sorry, user not found. Create an account and start chatting with the ITF bot before using the timeline.",
          duration: 10000
        });
      }
    },
    goToTrialPage: () => {
      window.location.href = "https://intelligenttrading.org/free";
    }
  },
  components: { vueTelegramLogin },
  mounted() {
    console.log(`Socket on: ${process.env.ITT_SOCKET}`);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.login-card {
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

.error {
  font-size: 11px;
  letter-spacing: 1px;
  font-weight: 500;
  color: red;
}

.tgme_widget_login.large button.tgme_widget_login_button {
  font-size: 14px;
  line-height: 20px;
  padding: 10px 20px;
  border-radius: 20px;
  background: cornflowerblue;
  font-weight: 400;
  font-family: Roboto;
}
</style>
