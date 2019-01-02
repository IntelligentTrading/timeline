<template>
  <el-card shadow="never" class="signal-card">
    <el-row style="text-align:left">
      <i
        class="far fa-dot-circle"
        style="font-size:12px"
        :class="source.trend>0 ? 'positive' : (source.trend < 0 ? 'negative' : 'neutral')"
      ></i>
      <label class="signal-title">
        {{sources[source.source]}}:
        <span class="transaction-currency" @click="updateTicker">{{source.transaction_currency}}</span>
        /{{counterCurrencies[source.counter_currency]}}
      </label>
      <el-tooltip content="Alert validity" placement="top">
        <label class="alert-validity">
          {{this.getAlertValidity()}}
          <i class="far fa-clock"></i>
        </label>
      </el-tooltip>
    </el-row>
    <el-row>
      <table>
        <col width="130">
        <col width="130">
        <thead>
          <th class="subtitle">Current trading price</th>
          <th class="subtitle signal-type">{{this.getFullSignalTypeDescription()}}</th>
        </thead>
        <tbody>
          <td
            class="trading-price"
          >{{source.price/100000000}} {{counterCurrencies[source.counter_currency]}}</td>
          <td
            v-html="this.getFullSignalValueDescription()"
            style="padding-left:10px; text-align:end"
            :class="source.trend>0 ? 'positive' : (source.trend < 0 ? 'negative' : 'neutral')"
          ></td>
        </tbody>
        <tfoot style="font-size:8px">Sent at: {{source.timestamp}}</tfoot>
      </table>
    </el-row>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Signal",
  props: ["source"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      "horizons",
      "sources",
      "counterCurrencies",
      "selectedSignals",
      "signalTypes"
    ])
  },
  methods: {
    updateTicker: function() {
      this.$store.commit("setCurrentTicker", this.source.transaction_currency);
    },
    getFullSignalTypeDescription: function() {
      let index = this.signalTypes.indexOf(this.source.signal);
      const fullSignalTypes = [
        "AI",
        "Relative Strength Index",
        "ITF Proprietary",
        "SMA",
        "Ichimoku",
        "AI Anomaly Detection",
        "Volume Based Index"
      ];

      return index >= 0 ? fullSignalTypes[index] : this.source.signal;
    },
    getFullSignalValueDescription: function() {
      let index = this.signalTypes.indexOf(this.source.signal);

      const fullSignalTypes = [
        '<i class="fas fa-robot"></i>',
        Math.round(this.source.rsi_value) +
          (this.source.trend > 0
            ? "<span style='font-size:12px; padding:5px'>oversold</span>"
            : " <span style='font-size:12px; padding:5px'>overbought</span>"),
        Math.round(this.source.rsi_value) +
          (this.source.trend > 0
            ? "<span style='font-size:12px; padding:5px'>oversold</span>"
            : " <span style='font-size:12px; padding:5px'>overbought</span>"),
        "SMA",
        this.source.trend > 0
          ? "<span style='font-size:12px;'>positive breakout</span>"
          : " <span style='font-size:12px;'>negative breakout</span>",
        '<i class="fas fa-robot"></i>',
        this.source.trend > 0
          ? '<i class="fas fa-arrow-circle-up"></i>'
          : '<i class="fas fa-arrow-circle-down"></i>'
      ];

      return index >= 0 ? fullSignalTypes[index] : this.source.signal;
    },
    getAlertValidity: function() {
      const validity = ["1h", "4h", "24h"];
      return validity[this.source.horizon];
    }
  }
};
</script>

<style>
.trading-price {
  font-family: "Rubik";
  font-size: 14px;
  font-weight: 100;
  border-right: 1px #dedfe2 solid;
  padding-right: 10px;
}

.subtitle {
  color: darkgray;
}

.signal-type {
  padding-left: 10px;
  text-align: end;
}

.signal-title {
  font-family: "Rubik";
  font-size: 12px !important;
  font-weight: 100;
}

.alert-validity {
  font-family: "Rubik";
  font-size: 10px !important;
  font-weight: 100;
  width: auto;
  position: absolute;
  right: 0;
  margin-top: 5px;
}

.el-tooltip__popper {
  font-family: "Rubik" !important;
}

.signal-card {
  margin: 2px;
  text-align: left;
}

.transaction-currency {
  font-weight: 400;
  cursor: pointer;
}
</style>


  
