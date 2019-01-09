<template>
  <div :class="this.loading ? 'disabledComponent' : ''">
    <label
      style="font-size:9px"
      v-show="!selectedSignals || selectedSignals.length <= 0"
    >Click on a signal (circle) or select an area to get insights.</label>
    <el-row v-for="signal in selectedSignals" :key="signal.id">
      <signal :signalDto="signal"/>
    </el-row>
  </div>
</template>
<script>
import api from "../store/api";
import { mapGetters, mapState } from "vuex";
import Signal from "./Signal";

export default {
  name: "SignalDetails",
  props: ["signalsSource","loading"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      "horizons",
      "sources",
      "counterCurrencies",
      "selectedSignals"
    ])
  },
  components: {
    Signal
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
