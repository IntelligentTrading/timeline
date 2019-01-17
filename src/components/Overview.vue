<template>
  <div class="overviewContainer">
    <el-row class="searchRow">
      <img
        src="https://intelligenttrading.org/wp-content/uploads/itf-logo-blue.png"
        style="height:40px; margin:20px"
        @click="goHome"
      >
      <el-autocomplete
        class="inline-input searchBarExt"
        v-model="ticker"
        :fetch-suggestions="querySearch"
        placeholder="Type a ticker name or symbol..."
        @select="handleTickerSelection"
        @keyup.enter.native="searchTicker(ticker)"
      >
        <template slot-scope="{ item }">
          <span class="tickerName">{{ item.name }}</span>
          <span class="tickerSymbol">{{ item.symbol }}</span>
        </template>
      </el-autocomplete>
      <div class="inner-message">
        <span class="error-message negative">{{this.errorMessage}}</span>
        <i v-show="this.errorMessage !== ''" class="fas fa-exclamation-triangle negative"></i>
      </div>
    </el-row>
    <el-row :gutter="24" style="padding-right:45px">
      <el-col :span="12">
        <el-row>
          <price-line
            :loading="this.isLoading"
            :symbol="this.ticker"
            :pricesPayload="this.pricesHistory || []"
          ></price-line>
        </el-row>
      </el-col>
      <el-col :span="6" style="text-align:end">
        <label class="historyTitle">Selected Signals Details</label>
        <div class="historyContainer">
          <signal-details class="history" :loading="this.isLoading"/>
        </div>
      </el-col>
      <el-col :span="6" style="text-align:end">
        <label class="historyTitle">Live Signals Feed</label>
        <div class="historyContainer">
          <feed class="history"/>
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
      isFeedLoading: false,
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
      "currentCounterCurrency",
      "currentExchange",
      "sources",
      "tickers"
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
        this.searchTicker(newTicker);
      }
    }
  },
  asyncComputed: {
    /*livefeed: async function() {
      this.isFeedLoading = true;
      let historyEntries = await api.getHistories();
      this.isFeedLoading = false;
      return historyEntries.filter(historyEntry => {
        return historyEntry.signal != "SMA";
      });
    },*/
    pricesHistory: async function() {
      this.isLoading = true;

      let signalsHistory = await api.getHistory(
        this.ticker,
        null,
        this.currentExchange,
        this.currentCounterCurrency
      );

      let maxPrice = Number.NEGATIVE_INFINITY;
      let minPrice = Number.POSITIVE_INFINITY;
      let neutralSignals = ["ANN_AnomalyPrc"];

      let groupedHistoryEntries = _.groupBy(
        signalsHistory.results
          .filter(historyEntry => {
            return historyEntry.signal != "SMA";
          })
          .map(sig => {
            sig.trend = neutralSignals.indexOf(sig.signal) >= 0 ? 0 : sig.trend;
            sig.source = this.sources[sig.source];
            return sig;
          }),
        "timestamp"
      );

      var points = signalsHistory.results
        .filter(historyEntry => {
          return historyEntry.signal != "SMA";
        })
        .map(historyEntry => {
          let currentPrice = historyEntry.price / Math.pow(10, 8).toFixed(6);
          historyEntry.horizon = ["short", "medium", "long"][
            historyEntry.horizon
          ];

          maxPrice = currentPrice > maxPrice ? currentPrice : maxPrice;
          minPrice = currentPrice < minPrice ? currentPrice : minPrice;
          return {
            x: new Date(historyEntry.timestamp).getTime(),
            y: historyEntry.price / Math.pow(10, 8),
            xaxis: {
              offsetX: 0
            },
            marker: {
              size: 4,
              fillColor: getGroupedTrend(
                groupedHistoryEntries,
                historyEntry.timestamp
              ),
              strokeColor: getGroupedTrend(
                groupedHistoryEntries,
                historyEntry.timestamp
              ),
              radius: 4
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

      let priceHistory = await api.getHistoryPrices(
        this.ticker,
        this.currentCounterCurrency,
        this.currentExchange
      );
      if (!priceHistory.results[0]) {
        this.isLoading = false;
        this.errorMessage = `${this.ticker}/${
          this.currentCounterCurrency
        } not found on ${this.currentExchange}`;
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

              if (eventPoint) {
                vm.$store.commit(
                  "setSelectedSignals",
                  groupedHistoryEntries[
                    moment(selectedPoint.x)
                      .format()
                      .split("+")[0]
                  ]
                );
              }
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
          size: 5,
          fillOpacity: 0.1,
          strokeWidth: 0
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
          curve: "smooth",
          width: 0
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
    },
    handleTickerSelection: function(tickerObject) {
      this.searchTicker(tickerObject.symbol.toUpperCase());
    },
    searchTicker: function(symbol) {
      if (symbol == "" || symbol == null) return;
      if (
        !this.tickers.some(t => {
          return t.symbol.toUpperCase() === symbol.toUpperCase();
        })
      )
        return;
      else {
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
  },
  components: { PriceLine, SignalDetails, Feed }
};

function getGroupedTrend(groupedHistoryEntries, timestamp) {
  let currentGroupedEntry =
    groupedHistoryEntries[
      moment(timestamp)
        .format()
        .split("+")[0]
    ];
  if (!currentGroupedEntry) return "yellow";

  let groupedTrend = 0;
  currentGroupedEntry.forEach(entry => {
    groupedTrend += parseInt(entry.trend);
  });

  if (groupedTrend > 0) return "green";
  else if (groupedTrend < 0) return "red";
  else return "gray";
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.overviewContainer {
  margin: 0px auto;
  height: 100vh;
  position: absolute;
  width: -webkit-fill-available;
}

.disabledComponent {
  pointer-events: none;
  opacity: 0.4;
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
  padding: 15px;
  font-family: "Rubik";
  color: #504b4b;
  font-weight: 500;
}

.historyContainer {
  height: 550px;
  overflow-y: auto;
  border-bottom: #dcdfe65e solid 1px;
}

.inner-message {
  position: absolute;
  right: 80px;
}

.error-message {
  font-size: 10px;
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
