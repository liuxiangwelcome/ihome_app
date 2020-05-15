<template>
    <div>
        <div class="item_row">
            <text class="item_lable">账号：</text>
            <wxc-searchbar class="searchbar" ref="account" placeholder="手机号" input-type="text"></wxc-searchbar>
        </div>
        <div class="item_row">
            <text class="item_lable">密码：</text>
            <wxc-searchbar class="searchbar" ref="password" placeholder="密码" input-type="password"></wxc-searchbar>
        </div>
        <div class="item_row">
            <wxc-button text="确定" type="blue" size="full"></wxc-button>
        </div>
    </div>
</template>

<script>
import {WxcSearchbar, WxcButton} from 'weex-ui'

export default {
  components: {WxcSearchbar, WxcButton},
  name: 'login'
}
</script>

<style scoped>
.item_row {
    align-items: center;
    height: 200px;
}
.item_lable {
    left: 50px;
    align-self: flex-start;
    font-size: 30px;
}
.searchbar {
}
</style>
