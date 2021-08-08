<template>
  <div id="app">
    <div class="phina-wrap">
      <PhinaCanvas></PhinaCanvas>
    </div>
  </div>
</template>

<script>
import PhinaCanvas from '@/components/PhinaCanvas'

export default {
  components: {
    PhinaCanvas,
  }
}
</script>

<style lang="scss">
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  #app {
    width: 100%;
    height: 100%;
  }
  .phina-wrap {
    display: flex;
    width: 100%;
    height: 100%;
  }
</style>
