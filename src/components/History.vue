<template>
  <div>
    <label style="font-size:9px" v-show='!selectedSignals || selectedSignals.length <= 0'>Click on a signal (circle) or select an area to get insights.</label>
    <el-row v-for="signal in selectedSignals" :key="signal.id">
      <el-card shadow="never" style="padding:5px">
        <el-row style="text-align:left">
          <i class="far fa-dot-circle" :class="signal.trend>0 ? 'positive' : 'negative'"></i>
          <label>{{sources[signal.source]}}:{{signal.transaction_currency}}/{{counterCurrencies[signal.counter_currency]}}</label>
        </el-row>
        <el-row>
          <table>
            <thead>
              <th>Current trading price</th>
              <th>{{signal.signal}}</th>
            </thead>
            <tbody>
              <td>{{signal.price}}</td>
              <td :class="signal.trend>0 ? 'positive' : 'negative'">{{Math.round(signal.rsi_value)}}</td>
            </tbody>
            <tfoot style="font-size:8px">{{signal.timestamp}}</tfoot>
          </table>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>
<script>
import api from "../store/api";
import { mapGetters, mapState } from "vuex";

export default {
  name: "History",
  props: ["signalsSource"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["horizons", "sources", "counterCurrencies","selectedSignals"])
  }
};
</script>

<style>
th {
  font-size: 10px;
}

tfoot {
  vertical-align: bottom;
}

.positive {
  color: green;
}
.negative {
  color: red;
}
.neutral {
  color: gray;
}
</style>
