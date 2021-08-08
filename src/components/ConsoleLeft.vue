<template>
  <div id="wrapper">
    <div>スコア </div>
    <div>{{$store.state.score}}</div>
  </div>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  mounted() {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#wrapper {
  display: flex;
}
</style>
