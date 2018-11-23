<template>
<div style="margin:0 auto;width:30%;">
<el-card style='height:350px'>
    <img src="https://intelligenttrading.org/wp-content/uploads/itf-logo-blue.png" style='height:70px'>
    <el-row style='margin-top:10%'>
        <el-input style='width:280px' placeholder="Please input your telegram chat id" v-model="telegramChatId"></el-input>
    </el-row>
    <el-row>
        <label style='font-size:10px; color:grey'>
        To find your telegram chat id, run <el-tag type="danger" style='font-size:10px' size=mini>/getme</el-tag> in the bot
        </label>
    </el-row>
    <el-row style='margin-top:20px'>
        <el-button :disabled="telegramChatId == ''" type="primary" @click="auth(telegramChatId)">Login</el-button>
    </el-row>
    </el-card>

</div>
</template>

<script>
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
    auth: (tcid) => {
        this.getHistory()
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
