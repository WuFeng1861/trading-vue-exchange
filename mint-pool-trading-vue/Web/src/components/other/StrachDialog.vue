<template>
  <el-dialog :model-value="visible" @closed="close" width="100%" :show-close="false" class="StrachDialog">
    <template #header="{ close, titleId, titleClass }">
    </template>
    <div class="container">
      <img :src="getImagePath('MLogo.png')" class="Mlogo" />
      <img :src="getImagePath('ScratchThis.png')" class="ScratchThis" />
      <stratch-card
          class="stratchCard"
          maskColor="#A2A2A2"
          fillStyle="white"
          font="40px 微软雅黑"
          text=""
          :radius="10"
          :scratchRadius="20"
          :scratchPercent="70"
          @scratchStart="scratchStart"
          @scratchEnd="scratchEnd"
          @scratchAll="scratchAll"
          ref="card"
          v-if="visible && showScratchCard"
      >
        <!-- 自定义奖品内容插槽 -->
        <div class="prize">
          <img :src="getImagePath('ScratchBG.png')" class="bgPng" style="border-radius: 10px"/>
          <el-icon size="48">
            <img :src="startMintLogo" alt=""/>
          </el-icon>
          <p style="z-index: 1">{{ coinNumber }}</p>
        </div>
      </stratch-card>
      <div v-if="visible && !showScratchCard" class="ScratchResult">
        <span class="title">恭喜你获得</span>
        <span class="content">{{coinNumber}} <span class="unit">Mercury</span></span>
      </div>
    </div>
    <img :src="getImagePath('Close.png')" class="close" @click="close"/>
  </el-dialog>
</template>

<script setup>
import startMintLogo from '@/assets/startMintLogo.png';
import StratchCard from '@/components/other/StratchCard.vue';
import {useGetStratchReward} from "@/composition/mint/useActive.js";
import {getImagePath} from "@/utils/index.js";

const props = defineProps(['visible', 'title']);
const emit = defineEmits(['update:visible', 'confirm', 'cancel']);
const {
  visible,
  title,
} = toRefs(props);

const card = ref(null);
const coinNumber = ref(0);
const showScratchCard = ref(true);

watch(() => visible.value, () => {
  nextTick(async () => {
    if (visible.value === true) {
      try {
        let coinNumberValue = await useGetStratchReward();
        coinNumber.value = coinNumberValue;
        card.value && card.value.reset();
      } catch (e) {
        emit('update:visible', false);
        emit('cancel');
      }
    }
  })
}, {immediate: true, deep: true})

const close = () => {
  showScratchCard.value = true;
  emit('update:visible', false);
  emit('cancel');
};

const scratchStart = () => {
  console.log('scratchStart')
}
const scratchEnd = () => {
  console.log('scratchEnd')
}
const scratchAll = () => {
  showScratchCard.value = false;
  console.log('scratchAll')
}
</script>

<style lang="scss">
.StrachDialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  background-color: transparent;
  margin: 0;
  padding: 0;

  .el-dialog__header {
    height: 0;
    padding: 0;
  }
  .el-dialog__body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .container {
      max-width: 375px;
      width: 70%;
      margin-top: 20px;
      // 从上到下渐变色 #D4ECA5-#EADBB5
      background: linear-gradient(#D4ECA5, #EADBB5);
      border-radius: 20px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .Mlogo {
        position: absolute;
        left: 50%;
        top: 0;
        transform: translate(-50%, -40%);
        width: 40%;
        border-radius: 50%;
        box-shadow:  0px 0px 67px var(--color-dashboard-green);
      }
      .ScratchThis {
        position: absolute;
        left: 50%;
        bottom: 0;
        width: 52.46%;
        transform: translate(-50%, -50%);
      }
      .ScratchResult {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        user-select: none;
        position: absolute;
        width: 81%;
        height: 45%;
        background-color: transparent;
        .title {
          display: flex;
          align-items: center;
          flex: 1;
          white-space: nowrap;
          font-size: 32px;
          color: var(--color-dashboard-black);
        }
        .content {
          flex: 1;
          white-space: nowrap;
          font-size: 70px;
          font-weight: bold;
          align-items: center;
          color: #967425;
          .unit {
            font-size: 32px;
            font-weight: normal;
            align-self: flex-end
          }
        }
      }
      &::after {
        display: flex;
        content:'';
        width: 100%;
        padding-top: 107%;
      }
    }
    .close {
      width: 40px;
      height: 40px;
      margin-top: 20px;
    }
  }


  .stratchCard {
    user-select: none;
    position: absolute;
    width: 81%;
    height: 45%;

    .prize {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--color-dashboard-bg-active);
      font-size: 25px;
      color: var(--color-dashboard-green);
      z-index: 1;
    }
  }

}


@media screen and (max-width: 768px){
  .StrachDialog {
    .el-dialog__body {
      .container {
        .ScratchResult {
          .title {
            font-size: 6vw;
          }
          .content {
            font-size: 12vw;
            .unit {
              font-size: 6vw;
            }
          }

        }
      }
    }
  }
}
</style>
