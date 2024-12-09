<template>
  <div class="recommend">
    <invite-info/>
    <invite-step/>
    <cube-light/>
  </div>
</template>

<script setup>

import InviteInfo from "@/components/inviteInfo.vue";
import InviteStep from "@/components/inviteStep.vue";
import CubeLight from "@/components/cubeLight.vue";
</script>

<style scoped lang="scss">
.recommend {
  width: 100%;
  height: calc(100% - $header-height);
  overflow: auto;
  padding: 20px;
  padding-top: 0;
}
@media (max-width: 768px) {
  .recommend {
    height: calc(100% - $mobile-nav-height);
    display: flex;
    flex-direction: column;
  }
}
</style>
