<template>
  <div class="divContainer">
    <el-row>
      <img
        src="https://intelligenttrading.org/wp-content/uploads/itf-logo-blue.png"
        style="height:50px;margin:20px"
      >
    </el-row>
    <el-row>
      <el-input
        class="searchBar"
        v-model="ticker"
        placeholder="Ticker name or symbol"
        @keyup.enter.native="searchTicker(ticker)"
      ></el-input>
      <el-button
        type="primary"
        :disabled="ticker == '' || ticker == null"
        style="margin:5px"
        @click="searchTicker(ticker)"
      >Search</el-button>
    </el-row>
    <el-row>
      <label style=" color: currentColor;font-size: x-small;margin-left: -42%;">Trending coins</label>
    </el-row>
    <el-row>
      <el-button
        type="info"
        round
        size="mini"
        v-for="coin in topCoins"
        :key="coin.transaction_currency"
        @click="searchTicker(coin.transaction_currency)"
      >{{coin.transaction_currency}}</el-button>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapState, mapGetters } from "vuex";
import _ from "lodash";

export default {
  name: "Home",
  data() {
    return {
      ticker: ""
    };
  },
  computed: {
    ...mapGetters(["topCoins"])
  },
  methods: {
    searchTicker: function(nameOrSymbol) {
      if (nameOrSymbol == "" || nameOrSymbol == null) return;
      else {
        this.$store.commit("setCurrentTicker", nameOrSymbol);
        this.$router.push({ path: `overview` });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.divContainer {
  margin: 0px auto;
  height: 100vh;
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, 0%);
  width: -webkit-fill-available;
}

.searchBar {
  width: 40%;
}
</style>
