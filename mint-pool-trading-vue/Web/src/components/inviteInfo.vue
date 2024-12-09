<template>
  <div class="inviteInfo">
    <div class="myInfoLeft shadowNormal">
      <div style="display: flex;margin-bottom: 10px;align-items: center">
        <span class="title" style="margin-right: 10px">我的邀请</span>
        <el-button class="copyLink3" @click="copyOriginLink(userInfo.invitation_code)">邀请好友</el-button>
      </div>
      <div class="infoItemContainer">
        <div class="infoItem border-black hoverBorderLight" @click="showInviteList">
          <span> 我的邀请人数 : </span>
          <div class="content">
            <el-icon size="35">
              <img :src="getThemeSvg('UserSearch')" alt=""/>
            </el-icon>
            {{ groupTotalRef }}
          </div>
        </div>
        <div class="infoItem border-black">
          <span> 邀请在线人数 : </span>
          <div class="content">
            <el-icon size="35">
              <img :src="getThemeSvg('UserOnline')" alt=""/>
            </el-icon>
            {{ groupOnlineNumberRef }}
          </div>
        </div>
      </div>
      <el-divider class="divider"/>
      <span class="tips">团队收益计算公式: 基础速率 x 10% x 邀请在线人数</span>
    </div>
    <div class="myInfoRight shadowNormal">
      <div class="border-black tips">
        <div class="iconContainer">
          <el-icon size="24">
            <img :src="getThemeSvg('UserAdd')" alt=""/>
          </el-icon>
        </div>
        <p>推荐您的朋友，并增加您的收入，通过任何社交平台与您的朋友进行分享链接</p>
      </div>
      <div class="pc-gap-bt-10">
        <div class="iconContainer">
          <el-icon size="24">
            <img :src="getThemeSvg('Down')" alt=""/>
          </el-icon>
        </div>
      </div>
      <div class="border-black tips">
        <div class="iconContainer">
          <el-icon size="24">
            <img :src="getThemeSvg('Gain')" alt=""/>
          </el-icon>
        </div>
        <p>用户注册时，您可获得对应的奖励，还可获取团队收益加成</p>
      </div>
    </div>
    <my-dialog-list
        v-model:visible="inviteListVisible"
        title="邀请好友列表"
        :icon="getThemeImage('InviteAdd.png')"
        :showClose="true"
        @scrollEnd="getNextMyGroup"
    >
      <template #default>
        <div class="inviteListItem infinite-list-item" v-for="item in inviteList" >
          <div class="left">
            <span class="main">{{item.email}}</span>
            <span class="desc" :style="{
              color: item.nexttime  && Number(item.nexttime) > getNowTimeStamp()? getThemeColor():'var(--color-mobile-grey-3)'
            }">{{item.nexttime  && Number(item.nexttime) > getNowTimeStamp()? "已开启挖矿": "未开启挖矿"}}</span>
          </div>
          <div class="right">
            <span :class="{
              online: true
            }">已完成</span>
          </div>
        </div>
        <div v-if="inviteList.length === 0" style="align-self: center;font-size: 15px;color:var(--color-dashboard-green)">暂时没有邀请用户</div>
      </template>
    </my-dialog-list>
  </div>
</template>

<script setup>
import {
  getNextMyGroup,
  useMyGroupOnlineNumberRef,
  useMyGroupRef,
  useMyGroupTotalRef
} from "@/composition/mint/useMyGroup.js";
import {copyOriginLink, getNowTimeStamp} from "@/utils/index.js";
import {getThemeColor, getThemeImage, getThemeSvg} from "@/styles/theme/index.js";
import {useGetUserInfo} from "@/composition/useUser.js";
import dayjs from "dayjs";

const myGroup = useMyGroupRef();

const groupTotalRef = useMyGroupTotalRef();

const groupOnlineNumberRef = useMyGroupOnlineNumberRef();

let userInfo = useGetUserInfo();
// ------------------------------------
const inviteListVisible = ref(false);
const inviteList = useMyGroupRef();
const showInviteList = () => {
  inviteListVisible.value = true;
};
</script>

<style scoped lang="scss">
.inviteInfo {
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

    .divider {
      border-color: var(--color-dashboard-green);
      margin-bottom: 10px;
      margin-top: 10px;
    }

    .tips {
      font-size: 17px;
      color: var(--color-dashboard-green);
      align-self: center;
      word-spacing: 10px;
    }

    .infoItemContainer {
      display: flex;

      .infoItem {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        border-radius: 20px;
        padding: 10px;
        background-color: var(--color-dashboard-bg-main);
        font-size: 16px;
        color: var(--color-dashboard-green);

        &:first-child {
          flex: 2;
          background-color: var(--color-dashboard-bg-active);
          margin-right: 10px;
        }

        span {
          color: var(--color-mobile-grey-3);
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
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    padding: 20px;
    border: 1px solid var(--color-dashboard-green);
    background-color: var(--color-dashboard-bg-active);

    .tips {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 10px;
      border-radius: 10px;
      background-color: var(--color-dashboard-bg-grey);

      p {
        margin-left: 10px;
      }
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  .inviteListItem {
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 70px;
    padding: 5px 10px;
    border-radius: 5px;
    background-color: var(--color-mobile-grey-4-3);
    &::after {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 3px;
      border-radius: 5px;
      background-color: var(--color-mobile-grey-4-2);
    }
    .left {
      display: flex;
      flex-direction: column;
      max-width: 70%;
      height: 100%;
      justify-content: center;
      align-items: flex-start;
      .main {
        font-size: 16px;
        color: var(--color-dashboard-white);
      }
      .desc {
        font-size: 12px;
        color: var(--color-mobile-grey-3);
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      max-width: 70%;
      height: 100%;
      justify-content: center;
      align-items: flex-end;
      .online {
        color: var(--color-dashboard-green);
      }
      .offline {
        color: var(--color-dashboard-green-op);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .inviteInfo {
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
      .tips {
        font-size: 12px;
        color: var(--color-dashboard-green-op2);
      }

      .el-button {
        height: 100%;
        padding: 3px 20px;
      }

      .infoItemContainer {
        .infoItem {
          &:first-child {
            flex: 1;
          }

          span {
            line-height: 1.5;
            font-size: 12px;
          }
        }
      }
    }
    .myInfoRight {
      .tips {
        font-size: 12px;
        color: var(--color-mobile-grey-3);
      }
    }
  }
}
</style>
