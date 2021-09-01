<template>
    <div class="grid justify-items-center w-full">
        <!-- <h1>決済完了(OrderComp.vue)</h1> -->
        <!-- <div class=""><img src="~/assets/img/ordercomp.png" /></div> -->
        <div class="max-w-2xl rounded text-center overflow-hidden shadow-lg">
        <img class="w-full " src="~/assets/img/ordercomp.png" alt="Sunset in the mountains">
        <div class="px-6 py-4">
            <div v-if="userInfoFromStore">
                {{ userInfoFromStore.name}}
            </div>
            <div class="font-bold text-xl mb-2">この度はご購入いただきありがとうございました</div>
            <p class="text-gray-700 text-base">
                ご購入いただいた商品は、注文履歴よりご確認いただけます。
            </p>
        </div>
        <div>
            <!-- <svg class="animate-bounce w-6 h-6">
                <p>a</p>
            </svg> -->
            <svg class="animate-bounce w-6 h-6 text-gray-900" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
            <!-- <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path> -->
            </svg>
        </div>
        <div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            <router-link to="OrderLog">注文履歴を確認する</router-link>
            </button>            
        </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { UserStore } from '../store';

export default Vue.extend({
  computed: {
    userInfoFromStore() {
      return UserStore.getUserInfo;
    },
  },

})
</script>