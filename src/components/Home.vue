<template>
  <div class="divContainer">
    <el-row>
      <img
        src="https://intelligenttrading.org/wp-content/uploads/itf-logo-blue.png"
        style="height:50px;margin:20px"
      >
    </el-row>
    <el-row :gutter="24">
      <el-autocomplete
        class="inline-input searchBar"
        v-model="ticker"
        :fetch-suggestions="querySearch"
        placeholder="Ticker name or symbol"
        @select="handleTickerSelection"
        @keyup.enter.native="searchTicker(ticker)"
      >
        <template slot-scope="{ item }">
          <span class="tickerName">{{ item.name }}</span>
          <span class="tickerSymbol">{{ item.symbol }}</span>
        </template>
      </el-autocomplete>
    </el-row>
    <el-row style="margin:10px">
      <label
        style=" color: currentColor;font-size: x-small;font-weight:400;margin-left: -42%;"
      >Trending coins</label>
      <el-tooltip placement="bottom" effect="light">
        <div
          slot="content"
        >The trending coins are the coins with the highest number of market events (signals) in the past 24h.
          <br>
          Although this information doesn't suggest a buy/sell action, it underlines possible opportunities.
        </div>
        <i class="far fa-question-circle" style="font-size:x-small"></i>
      </el-tooltip>
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
import api from "../store/api";

export default {
  name: "Home",
  data() {
    return {
      ticker: ""
    };
  },
  computed: {
    ...mapGetters(["topCoins", "tickers"])
  },
  methods: {
    handleTickerSelection: function(tickerObject) {
      this.searchTicker(tickerObject.symbol.toUpperCase());
    },
    searchTicker: function(symbol) {
      if (symbol == "" || symbol == null) return;
      if (
        !this.tickers.some(t => {
          return t.symbol.toUpperCase() === symbol.toUpperCase();
        })
      ) {
        return;
      } else {
        this.$store.commit("setCurrentTicker", symbol);
        this.$router.push({ path: `overview` });
      }
    },
    querySearch: function(filter, cb) {
      const filteredTickers = filter
        ? this.tickers.filter(t => {
            return (
              t.symbol.toLowerCase().startsWith(filter.toLowerCase()) ||
              t.name.toLowerCase().startsWith(filter.toLowerCase())
            );
          })
        : this.tickers;

      cb(filteredTickers);
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

.el-autocomplete {
  width: 60%;
}

.searchBar {
  width: 70%;
}

.tickerName {
  font-family: Rubik;
  font-size: 100;
}
.tickerSymbol {
  font-family: Roboto;
  font-size: 10px;
  margin: 5px;
  font-weight: 400;
}
</style>
