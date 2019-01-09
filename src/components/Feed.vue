<template>
  <div>
    <div :class="this.loading ? 'disabledComponent' : ''">
      <el-row v-for="signal in this.$props.signals" :key="signal.id">
        <signal :signalDto="signal"/>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from "../store/api";
import { mapGetters, mapState } from "vuex";
import Signal from "./Signal";
import ProgressLine from "./ProgressLine";

export default {
  name: "Feed",
  props: ["signals", "loading"],
  data() {
    return {};
  },
  components: { Signal, ProgressLine },
  computed: {
    ...mapGetters(["horizons", "sources", "counterCurrencies"])
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
