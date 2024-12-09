<template>
  <div class="dashboardMyInfo">
    <div class="myInfoLeft shadowNormal">
      <div style="display: flex; margin-bottom: 10px;align-items: center">
        <span class="title" style="margin-right: 10px;">我的收益</span>
        <el-button class="copyLink3" @click="copyOriginLink(userInfo.invitation_code)">邀请好友</el-button>
      </div>
      <div class="infoItemContainer">
        <div class="infoItem">
          <span> 我的余额 : </span>
          <div class="content">
            <el-icon size="48">
              <img :src="getImagePath('MLogo.png')" alt=""/>
            </el-icon>
            {{ myBalanceRef.balance || 0 }} {{ mintEarnsNowRef && !isNaN(mintEarnsNowRef) ? `+${mintEarnsNowRef}` : '' }}
          </div>
        </div>
        <div class="infoItem" v-if="!mybalanceRef.address">
          <span> 当前速率 : </span>
          <div class="content">
            <el-icon size="48">
              <img :src="getImagePath('MLogo.png')" alt=""/>
            </el-icon>
            {{ SafeCalc.add(myBalanceRef.baseMintRate || 0, myBalanceRef.groupMintRate || 0) }} / h
          </div>
        </div>
        <div class="infoItem" v-else>
          <span> 我的充值 : </span>
          <div class="content">
            <el-icon size="48">
              <img :src="getImagePath('BNBLogo.png')" alt=""/>
            </el-icon>
            {{ Number(mybalanceRef.ethBalance) }}
          </div>
        </div>
      </div>
    </div>
    <div class="myInfoRight shadowNormal">
      <div :class="{
          startMint: startMint === '开始挖矿',
          doing: startMint !== '开始挖矿',
          pcOnly: true
        }" @click="useStartMint">
        <el-icon>
          <img :src="getSvgPath('Start')" v-if="startMint === '开始挖矿'"/>
          <img :src="getSvgPath('Doing')" v-else/>
        </el-icon>
        {{ startMint }}
      </div>
      <my-ripplr-circle
          class="mobileOnly"
          v-model:title="startMintMobile"
          v-model:top="mintRemainPercentRef"
          @clickEvent="useStartMint"
      />
      <div class="mintRate">
        <div class="rateItem">
          <span> 基础速率 : </span>
          <div class="content">
            {{ myBalanceRef.baseMintRate }}
          </div>
        </div>
        <div class="rateItem" title="团队速率 = 基础速率 * 邀请在线人数 * 10%">
          <span> 团队速率 : </span>
          <div class="content">
            {{ myBalanceRef.groupMintRate }}
          </div>
        </div>
      </div>
    </div>
    <div class="myInfoLeft shadowNormal mobileOnly">
      <div class="infoItemContainer">
        <div class="infoItem">
          <span> 全网会员 : </span>
          <div class="content">
            <el-icon size="48">
              <img :src="getThemeImage('TotalMember.png')" alt=""/>
            </el-icon>
            {{ totalRef.userCount || '获取中...'}}
          </div>
        </div>
        <div class="infoItem" >
          <span> 释放总量 : </span>
          <div class="content">
            <el-icon size="48">
              <img :src="getThemeImage('MLogo.png')" alt=""/>
            </el-icon>
            {{ totalRef.releaseTotal || '获取中...'}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  useIsMiningRef,
  useMintEarnsNowRef,
  useMintRemainPercentRef,
  useMintTimeRef,
  useMyBalanceRef
} from "@/composition/mint/useMyBalance.js";
import {useStartMint} from "@/composition/mint/useMint.js";
import {copyOriginLink, getImagePath, getSvgPath} from "@/utils/index.js";
import SafeCalc from "@/utils/bignumberjs.js";
import {useGetUserInfo} from "@/composition/useUser.js";
import MyRipplrCircle from "@/components/myRipplrCircle.vue";
import {getThemeImage} from "@/styles/theme/index.js";
import {useTotalDataTef} from "@/composition/mint/useTotal.js";
let userInfo = useGetUserInfo();

const myBalanceRef = useMyBalanceRef();

const isMining = useIsMiningRef();

const mintEarnsNowRef = useMintEarnsNowRef();

const mybalanceRef = useMyBalanceRef();

const startMint = computed(() => {
  return isMining.value ? '正在挖矿->剩余时间 ' + useMintTimeRef().value : '开始挖矿';
});
const startMintMobile = computed(() => {
  return isMining.value ? useMintTimeRef().value : '开始挖矿';
});

const mintRemainPercentRef = useMintRemainPercentRef();

const totalRef = useTotalDataTef();
</script>

<style scoped lang="scss">
.dashboardMyInfo {
  width: 100%;
  display: flex;
  flex-direction: row;

  .myInfoLeft {
    flex: 2;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    padding: 20px;
    background-color: var(--color-dashboard-bg-active);
    margin-right: 10px;

    .title {
      font-size: 20px;
      color: var(--color-dashboard-white);
    }

    .infoItemContainer {
      display: flex;

      .infoItem {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-radius: 20px;
        padding: 20px;
        background-color: var(--color-dashboard-bg-main);
        font-size: 16px;
        color: var(--color-dashboard-green);

        span {
          color: var(--color-mobile-grey-3);
        }

        &:first-child {
          flex: 2;
          margin-right: 10px;
        }

        .content {
          display: flex;
          align-items: center;
          font-size: 36px;

          img {
            width: 100%;
            height: 100%;
            margin-right: 10px;
          }
        }
      }
    }
  }

  .myInfoRight {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    padding: 20px;
    background-color: var(--color-dashboard-bg-grey);

    .startMint {
      flex: 1;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid var(--color-dashboard-border);
      border-radius: 9999px;
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 10px;
      background-color: var(--color-dashboard-bg-active);

      img {
        margin-right: 5px;
      }

      &:hover {
        background-color: var(--color-dashboard-green);
        color: var(--color-dashboard-black);
      }
    }

    .doing {
      flex: 1;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid var(--color-dashboard-border);
      border-radius: 9999px;
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 10px;
      background-color: var(--color-dashboard-bg-active);

      img {
        margin-right: 5px;
      }
    }

    .mintRate {
      flex: 1;
      display: flex;

      .rateItem {
        display: flex;
        flex: 1;
        //border: 1px solid var(--color-dashboard-border);
        border-radius: 9999px;
        font-weight: bold;
        font-size: 12px;
        line-height: 1.5;
        background-color: var(--color-mobile-grey-4);
        justify-content: center;
        align-items: center;
        color: var(--color-dashboard-green);

        &:first-child {
          margin-right: 10px;
        }

        span {
          margin-right: 5px;
        }

        &:hover {
          background-color: var(--color-dashboard-bg-active);
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .dashboardMyInfo {
    display: flex;
    flex-direction: column;

    .myInfoLeft {
      margin-right: 0;
      margin-bottom: 10px;

      .title {
        white-space: nowrap;
        font-size: 15px;
        line-height: 1;
      }
      .el-button {
        height: 100%;
        padding: 3px 20px;
      }

      .infoItemContainer {
        flex-direction: column;

        .infoItem {
          max-width: 100%;
          overflow: hidden;
          font-size: 14px;

          &:first-child {
            margin-right: 0;
            margin-bottom: 10px;
          }

          span {
            white-space: nowrap;
          }

          .content {
            font-size: 14px;
            white-space: nowrap;

            .el-icon {
              font-size: 25px !important;
            }
          }
        }
      }
    }

    .myInfoRight {
      margin-bottom: 10px;
      .startMint {
        font-size: 25px;
      }

      .doing {
        font-size: 16px;
        padding: 7px 0;
      }

      .rateItem {
        padding: 7px 0;
      }
    }
  }
}
</style>
