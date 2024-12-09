<template>
  <div class="inviteStep shadowNormal border-black">
    <img :src="getThemeImage('Step.png')" class="stepLogo mobileOnly"/>
    <el-steps style="width: 100%" :active="activeStep" align-center finish-status="success">
      <el-step v-for="item in steps" @click="item.func">
        <!--  插槽title-->
        <template #title>
          <div style="display: flex;flex-direction: row; justify-content: center; align-items: center;">
            <span style="white-space: nowrap; font-size: 14px">{{ item.title }}</span>
          </div>
        </template>
        <template #description>
          <div class="stepDesc">
            <span class="font-bold" style="white-space: nowrap; font-size: 12px">
              邀请人数
            </span>
            <span class="font-bold" style="white-space: nowrap; font-size: 12px">
              {{ item.description }}
            </span>
          </div>
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<script setup>

import {useMyGroupRef, useMyGroupTotalRef} from "@/composition/mint/useMyGroup.js";
import {elTip} from "@/utils/index.js";
import {useGetInviteReward} from "@/composition/mint/useActive.js";
import {getThemeImage} from "@/styles/theme/index.js";

const myGroupRef = useMyGroupRef();
const mygroupTotalRef = useMyGroupTotalRef();
const activeStep = computed(() => {
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i].number <= mygroupTotalRef.value) {
      return i + 1;
    }
  }
  return 0;
});
const steps = [
  {
    title: '阶段一',
    description: '达到10',
    number: 10,
    func: () => {
      if (mygroupTotalRef.value < 10) {
        return elTip('邀请人数不足', 'warning', true);
      }
      useGetInviteReward(1);
    }
  },
  {
    title: '阶段二',
    description: '达到20',
    number: 20,
    func: () => {
      if (mygroupTotalRef.value < 20) {
        return elTip('邀请人数不足', 'warning', true);
      }
      useGetInviteReward(2);
    }
  },
  {
    title: '阶段三',
    description: '达到50',
    number: 50,
    func: () => {
      if (mygroupTotalRef.value < 50) {
        return elTip('邀请人数不足', 'warning', true);
      }
      useGetInviteReward(3);
    }
  },
  {
    title: '阶段四',
    description: '达到100',
    number: 100,
    func: () => {
      if (mygroupTotalRef.value < 100) {
        return elTip('邀请人数不足', 'warning', true);
      }
      useGetInviteReward(4);
    }
  },
];

</script>

<style scoped lang="scss">
.inviteStep {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding: 50px 20px;
  border-radius: 20px;
  background-color: var(--color-dashboard-bg-grey);
  --el-text-color-primary: var(--color-dashboard-white);

  .stepDesc {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--color-mobile-grey-3);
    transform: scale(0.8);
  }

  .stepLogo {
    width: 40px;
    height: 40px;
    margin-bottom: 20px;
  }

  :deep(.el-step__head.is-success) {
    border-color: var(--color-dashboard-green);
    color: var(--color-dashboard-green);
  }

  :deep(.el-step__title.is-success) {
    color: var(--color-dashboard-green);
  }
}

@media screen and (max-width: 768px) {
  .inviteStep {
    padding: 20px;

    .stepDesc {
      align-items: flex-start;
    }

    .stepLogo {
      width: 30px;
      height: 30px;
      margin-bottom: 10px;
    }
  }
}
</style>
