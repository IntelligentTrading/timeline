<template>
  <div style="margin:0 auto;width:30%;">
    <el-card style="height:350px">
      <img
        src="https://intelligenttrading.org/wp-content/uploads/itf-logo-blue.png"
        style="height:70px"
      >
      <vue-telegram-login mode="callback" telegram-login="IntelligentTradingBot" @callback="auth"/>
    </el-card>
  </div>
</template>

<script>
import { vueTelegramLogin } from "vue-telegram-login";
import moment from "moment";
import { mapActions, mapState } from "vuex";
import _ from "lodash";

export default {
  name: "Login",
  data() {
    return {
      telegramChatId: ""
    };
  },
  methods: {
    ...mapActions(["getHistory", "getHistoryPrice"]),
    auth: user => {
      console.log(user);
    }
  },
  components: { vueTelegramLogin }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
