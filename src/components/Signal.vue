<template>
  <el-card shadow="never" class="signal-card">
    <el-row style="text-align:left">
      <i
        class="far fa-dot-circle"
        style="font-size:12px"
        :class="signalDto.trend>0 ? 'positive' : (signalDto.trend < 0 ? 'negative' : 'neutral')"
      ></i>
      <label class="signal-title">
        {{signalDto.source.toUpperCase()}}:
        <span
          class="transaction-currency"
          @click="setChartSelection"
        >{{signalDto.transaction_currency}}</span>
        /{{counterCurrencies[signalDto.counter_currency]}}
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
          >{{signalDto.price/100000000}} {{counterCurrencies[signalDto.counter_currency]}}</td>
          <td
            v-html="this.getFullSignalValueDescription()"
            style="padding-left:10px; text-align:end"
            :class="signalDto.trend>0 ? 'positive' : (signalDto.trend < 0 ? 'negative' : 'neutral')"
          ></td>
        </tbody>
        <tfoot style="font-size:8px">Sent at: {{signalDto.timestamp}}</tfoot>
      </table>
    </el-row>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Signal",
  props: ["signalDto"],
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
    setChartSelection: function() {
      this.$store.commit("setChartSelection", {
        ticker: this.signalDto.transaction_currency,
        source: this.signalDto.source,
        counter: this.counterCurrencies[this.signalDto.counter_currency]
      });
    },
    getFullSignalTypeDescription: function() {
      let index = this.signalTypes.indexOf(this.signalDto.signal);
      const fullSignalTypes = [
        "AI Trend Prediction",
        "Relative Strength Index",
        "ITF Proprietary",
        "SMA",
        "Ichimoku",
        "AI Anomaly Detection",
        "Volume Based Index"
      ];

      return index >= 0 ? fullSignalTypes[index] : this.signalDto.signal;
    },
    getFullSignalValueDescription: function() {
      let index = this.signalTypes.indexOf(this.signalDto.signal);

      const fullSignalTypes = [
        getAISimple(this.signalDto),
        Math.round(this.signalDto.rsi_value) +
          (this.signalDto.trend > 0
            ? "<span style='font-size:12px; padding:5px'>oversold</span>"
            : " <span style='font-size:12px; padding:5px'>overbought</span>"),
        Math.round(this.signalDto.rsi_value) +
          (this.signalDto.trend > 0
            ? "<span style='font-size:12px; padding:5px'>oversold</span>"
            : " <span style='font-size:12px; padding:5px'>overbought</span>"),
        "SMA",
        this.signalDto.trend > 0
          ? "<span style='font-size:12px;'>positive breakout</span>"
          : " <span style='font-size:12px;'>negative breakout</span>",
        '<i class="fas fa-robot"></i>',
        this.signalDto.trend > 0
          ? '<i class="fas fa-arrow-circle-up"></i>'
          : '<i class="fas fa-arrow-circle-down"></i>'
      ];

      return index >= 0 ? fullSignalTypes[index] : this.signalDto.signal;
    },
    getAlertValidity: function() {
      const validity = [
        { horizon: "short", validity: "1h" },
        { horizon: "medium", validity: "4h" },
        { horizon: "long", validity: "24h" }
      ];
      return validity.find(v => {
        return v.horizon === this.signalDto.horizon;
      }).validity;
    }
  }
};

function getAISimple(signalDto) {
  const percentage = signalDto.probability_down
    ? Math.round(
        Math.max(
          signalDto.probability_down,
          signalDto.probability_same,
          signalDto.probability_up
        ) * 100
      )+'% '
    : "";

  return (
    percentage +
    (signalDto.trend > 0
      ? '<i class="fas fa-arrow-circle-up"></i>'
          : '<i class="fas fa-arrow-circle-down"></i>')
  );
}
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


  
