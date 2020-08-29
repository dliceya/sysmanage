<template>
  <div id="app" class="body-bg">
    <router-view />
  </div>
</template>

<script>
  export default  {
    name:  'App'
  }
</script>

<style>
  .body-bg {
    font-weight: 700;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow-y: auto;
  }
</style>
