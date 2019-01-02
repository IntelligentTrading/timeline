<template>
  <div class="overviewContainer">
    <el-row class="searchRow">
      <img
        src="https://intelligenttrading.org/wp-content/uploads/itf-logo-blue.png"
        style="height:40px; margin:20px"
        @click="goHome"
      >
      <el-input class="searchBarExt" v-model="ticker" placeholder="Ticker name or symbol"></el-input>
      <div class="inner-message">
        <span class="error-message negative">{{this.errorMessage}}</span>
        <i v-show="this.errorMessage !== ''" class="fas fa-exclamation-triangle negative"></i>
      </div>
    </el-row>
    <el-row :gutter="24" style="padding-right:45px">
      <el-col :span="12">
        <el-row>
          <price-line
            :symbol="this.ticker"
            :pricesPayload="this.pricesHistory || []"
            :loading="isLoading"
          ></price-line>
        </el-row>
      </el-col>
      <el-col :span="6" style="text-align:end">
        <label class="historyTitle">Selected Signals Details</label>
        <div class="historyContainer" v-loading="isLoading">
          <signal-details class="history"/>
        </div>
      </el-col>
      <el-col :span="6" style="text-align:end">
        <label class="historyTitle">Live Signals Feed</label>
        <div class="historyContainer" v-loading="isLoading">
          <feed class="history" :source="livefeed"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapState, mapGetters } from "vuex";
import _ from "lodash";
import PriceLine from "./PriceLine";
import SignalDetails from "./SignalDetails";
import Feed from "./Feed";
import api from "../store/api";

export default {
  name: "Overview",
  data() {
    return {
      isLoading: false,
      errorMessage: "",
      counter_currency: "BTC"
    };
  },
  computed: {
    ...mapGetters([
      "topCoins",
      "counterCurrencies",
      "selectedSignals",
      "currentTicker",
      "currentCounterCurrency"
    ]),
    ticker: {
      get: function() {
        if (!this.currentTicker) {
          this.$store.commit("setCurrentTicker", localStorage["currentTicker"]);
          return localStorage["currentTicker"].toUpperCase();
        }

        return this.currentTicker.toUpperCase();
      },
      set: function(newTicker) {
        this.$store.commit("setCurrentTicker", newTicker);
      }
    }
  },
  asyncComputed: {
    livefeed: async function() {
      this.isLoading = true;
      let historyEntries = await api.getHistories();
      return historyEntries.filter(historyEntry => {
        return historyEntry.signal != "SMA";
      });
    },
    pricesHistory: async function() {
      this.isLoading = true;

      let signalsHistory = await api.getHistory(
        this.ticker,
        null,
        "BINANCE",
        this.currentCounterCurrency
      );

      let maxPrice = Number.NEGATIVE_INFINITY;
      let minPrice = Number.POSITIVE_INFINITY;

      var points = signalsHistory.results
        .filter(historyEntry => {
          return historyEntry.signal != "SMA";
        })
        .map(historyEntry => {
          let currentPrice = historyEntry.price / Math.pow(10, 8).toFixed(6);

          maxPrice = currentPrice > maxPrice ? currentPrice : maxPrice;
          minPrice = currentPrice < minPrice ? currentPrice : minPrice;
          return {
            x: new Date(historyEntry.timestamp).getTime(),
            y: historyEntry.price / Math.pow(10, 8),
            marker: {
              size: 8,
              fillColor: "#fff",
              strokeColor: historyEntry.trend > 0 ? "green" : "red",
              radius: 2
            },
            label: {
              offsetY: 0,
              offsetX: 0,
              style: {
                background: "#fff",
                color: "#777",
                fontSize: "0px",
                cssClass: "apexcharts-point-annotation-label"
              },
              text: `${historyEntry.id}`
            }
          };
        });

      let priceHistory = await api.getHistoryPrices(this.ticker,this.currentCounterCurrency);
      if (!priceHistory.results[0]) {
        this.isLoading = false;
        this.errorMessage = `${this.ticker}/${this.currentCounterCurrency} not found.`;
        return;
      }

      this.errorMessage = "";

      let data = priceHistory.results
        .filter(price => {
          return (
            price != null &&
            price.close_price != null &&
            price.close_price > 0 &&
            !points.some(point => {
              return moment(price.timestamp).isSame(point.x);
            })
          );
        })
        .map(price => {
          let currentPrice = price.close_price / Math.pow(10, 8).toFixed(6);

          maxPrice = currentPrice > maxPrice ? currentPrice : maxPrice;
          minPrice = currentPrice < minPrice ? currentPrice : minPrice;
          return {
            x: new Date(price.timestamp).getTime(),
            y: currentPrice
          };
        });

      let fullDataSource = _.sortBy(
        [
          ...data,
          ...points.map(p => {
            return { x: p.x, y: p.y };
          })
        ],
        o => {
          return o.x;
        }
      );

      var newChartOptions = {
        chart: {
          type: "area",
          events: {
            scrolled: function(chartContext, { xaxis }) {
              vm.$store.commit("setCurrentSelection", {
                points: points,
                range: xaxis,
                history: signalsHistory.results
              });
            },
            dataPointSelection: function(event, chartContext, config) {
              let selectedPoint = fullDataSource[config.dataPointIndex];

              let eventPoint = points.find(point => {
                return point.x == selectedPoint.x && point.y == selectedPoint.y;
              });
              let selectedSignal = signalsHistory.results.find(h => {
                return h.id == eventPoint.label.text;
              });

              vm.$store.commit("setSelectedSignals", [selectedSignal]);
            },
            zoomed: function(chartContext, { xaxis, yaxis }) {
              vm.$store.commit("setCurrentSelection", {
                points: points,
                range: xaxis,
                history: signalsHistory.results
              });
            }
          }
        },
        tooltip: {
          intersect: true,
          shared: false,
          enabled: true
        },
        markers: {
          size: 1,
          fillOpacity: 0
        },
        yaxis: {
          max: maxPrice + maxPrice * 0.01,
          min: minPrice - minPrice * 0.01,
          decimalsInFloat: 8,
          floating: false
        },
        xaxis: {
          type: "datetime",
          tickAmount: 6
        },
        annotations: { points: points, position: "back" },
        stroke: {
          curve: "straight"
        },
        dataLabels: {
          enabled: false
        }
      };
      this.isLoading = false;
      return {
        prices: [
          {
            name: `${this.ticker}/${
              this.counterCurrencies[priceHistory.results[0].counter_currency]
            }`,
            data: fullDataSource
          }
        ],
        chartOptions: newChartOptions,
        current: priceHistory.results[0]
      };
    }
  },
  methods: {
    goHome: function() {
      this.$router.push({ path: `../home` });
    }
  },
  components: { PriceLine, SignalDetails, Feed }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.overviewContainer {
  margin: 0px auto;
  height: 100vh;
  position: absolute;
  width: -webkit-fill-available;
}

.searchRow {
  text-align: left;
  display: flex;
  align-items: center;
}

.searchBarExt {
  width: 85% !important;
}

.history {
  padding-left: 0px;
  padding-right: 12px;
}

.historyTitle {
  text-align: right;
  font-size: 10px;
  padding: 10px;
  font-family: "Rubik";
  color: cornflowerblue;
}

.historyContainer {
  height: 550px;
  overflow-y: scroll;
  border-bottom: #dcdfe65e solid 1px;
}

.inner-message {
  position: absolute;
  right: 80px;
}

.error-message {
  font-size: 10px;
}
</style>
