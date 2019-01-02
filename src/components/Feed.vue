<template>
  <div>
    <el-row v-for="signal in this.$props.source" :key="signal.id">
      <signal :source='signal'/>
    </el-row>
  </div>
</template>
<script>
import api from "../store/api";
import { mapGetters, mapState } from "vuex";
import Signal from './Signal'

export default {
  name: "Feed",
  props: ["source"],
  data() {
    return {};
  },
  components:{Signal},
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
