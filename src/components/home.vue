<template>
    <wxc-tab-bar :tab-titles="tabBar.tabIconFontTitles"
                 :tab-styles="tabBar.tabStyles"
                 title-type="text"
                 @wxcTabBarCurrentTabSelected="wxcTabBarCurrentTabSelected">
        <!-- 第一个页面内容-->
        <div class="item-container" :style="contentStyle"><text>首页</text></div>

        <!-- 第二个页面内容-->
        <div class="item-container" :style="contentStyle"><text>我的</text></div>
    </wxc-tab-bar>
</template>

<style scoped>
    .item-container {
        width: 750px;
        background-color: #f2f3f4;
        align-items: center;
        justify-content: center;
    }
</style>
<script>
import { WxcTabBar, Utils } from 'weex-ui'

export default {
  components: { WxcTabBar },
  data: () => ({
    tabBar: {
      tabIconFontTitles: [
        {
          title: '首页',
          codePoint: '\ue623'
        },
        {
          title: '我的',
          codePoint: '\ue601'
        }
      ],
      tabStyles: {
        bgColor: '#FFFFFF',
        titleColor: '#666666',
        activeTitleColor: '#3D3D3D',
        activeBgColor: '#FFFFFF',
        isActiveTitleBold: true,
        iconWidth: 70,
        iconHeight: 70,
        width: 160,
        height: 100,
        fontSize: 24,
        hasActiveBottom: true,
        activeBottomColor: '#FFC900',
        activeBottomHeight: 6,
        activeBottomWidth: 120,
        textPaddingLeft: 10,
        textPaddingRight: 10,
        normalBottomColor: 'rgba(0,0,0,0.4)',
        normalBottomHeight: 2,
        hasRightIcon: true,
        rightOffset: 100
      }
    }
  }),
  created () {
    const tabPageHeight = Utils.env.getPageHeight()
    // 如果页面没有导航栏，可以用下面这个计算高度的方法
    // const tabPageHeight = env.deviceHeight / env.deviceWidth * 750;
    const { tabStyles } = this
    this.contentStyle = { height: (tabPageHeight - tabStyles.height) + 'px' }
  },
  methods: {
    wxcTabBarCurrentTabSelected (e) {
      const index = e.page
    }
  }
}
</script>
