import Vue from "vue";
import Vuex from "vuex";
import api from "./api";
import moment from "moment";
import _ from "lodash";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    groups: [],
    prices: [],
    filters: [],
    horizons: ["1h", "4h", "24h"],
    sources: ["POLONIEX", "BITTREX", "BINANCE"],
    counterCurrencies: ["BTC", "ETH", "USDT", "XMR"],
    signalTypes: [
      "ANN_Simple",
      "RSI",
      "RSI_Cumulative",
      "SMA",
      "kumo_breakout",
      "ANN_AnomalyPrc",
      "VBI"
    ],
    telegram_chat_id: "",
    topCoins: {},
    selectedSignals: [],
    currentTicker: null,
    currentCounterCurrency: "BTC"
  },
  mutations: {
    setCurrentTicker(state, ticker) {
      localStorage["currentTicker"] = ticker;
      state.currentTicker = ticker;
      state.selectedSignals = [];
    },
    setCurrentCounterCurrency(state, counterCurrency) {
      state.currentCounterCurrency = counterCurrency;
    },
    addPrice(state, price) {
      state.prices.push(price);
    },
    setTelegramChatId(state, telegram_chat_id) {
      state.telegram_chat_id = telegram_chat_id;
    },
    setTopCoins(state, coins) {
      state.topCoins = coins;
    },
    setSelectedSignals(state, signals) {
      state.selectedSignals = signals;
    },
    setCurrentSelection(state, { points, range, history }) {
      if (!range.min) range.min = Number.NEGATIVE_INFINITY;
      if (!range.max) range.max = Number.POSITIVE_INFINITY;

      let eventPoints = points
        .filter(point => {
          return point.x > range.min && point.x < range.max;
        })
        .map(eventPoint => {
          return parseInt(eventPoint.label.text);
        });

      let selectedPoints = history.filter(h => {
        return eventPoints.includes(h.id);
      });

      state.selectedSignals = selectedPoints;
    }
  },
  getters: {
    currentTicker(state) {
      return state.currentTicker;
    },
    currentCounterCurrency(state) {
      return state.currentCounterCurrency;
    },
    telegramChatId(state) {
      return state.telegram_chat_id;
    },
    signalTypes(state) {
      return state.signalTypes;
    },
    counterCurrencies(state) {
      return state.counterCurrencies;
    },
    sources(state) {
      return state.sources;
    },
    horizons(state) {
      return state.horizons;
    },
    groups(state) {
      return state.groups;
    },
    prices(state) {
      return state.prices;
    },
    selectedSignals(state) {
      return state.selectedSignals;
    },
    topCoins(state) {
      return state.topCoins;
    }
  },
  actions: {
    async getHistory(context, { ticker, horizon, source, counterCurrency }) {
      console.log(
        `Loading history for ${ticker} ${horizon} ${source} ${counterCurrency}`
      );
      return api
        .getHistory(ticker, horizon, source, counterCurrency)
        .then(history => {
          //build group
          var items = history.results.map(result => {
            return {
              id: result.id,
              timestamp: result.timestamp,
              trend: result.trend,
              price: result.price,
              signal: result.signal,
              rsi: result.rsi_value
                ? `<span style='font-size:10px'> (${Math.round(
                    result.rsi_value
                  )})</span>`
                : ""
            };
          });
        });
    },
    async loadTopCoins(context) {
      return api.topCoins().then(coins => {
        return context.commit("setTopCoins", coins);
      });
    }
  }
});
