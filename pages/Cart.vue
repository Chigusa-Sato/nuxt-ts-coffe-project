<template>
  <div>
    <div v-show="itemInfoFromStore[0].itemInfo.length===0" class="grid justify-items-center p-20">
     <div class="text-red-400 font-bold text-2xl">現在カートに商品はありません</div>
     <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full m-10">
        <router-link to="/">商品を選ぶ</router-link>
     </button>
    </div>
    <div v-show="itemInfoFromStore[0].itemInfo.length!=0" class="grid justify-items-center">
      <div class="p-8">
        <table class="table-auto shadow-xl">
          <thead class="bg-yellow-800 bg-opacity-25">
            <tr class="text-right">
              <th class="w-1/12"></th>
              <th class="w-4/12">商品名</th>
              <th class="w-2/12">価格(税抜)</th>
              <th class="w-1/12">個数</th>
              <th class="w-2/12">計(税抜)</th>
              <th class="w-2/12"></th>
            </tr>
          </thead>
          <tbody class="">
            <tr
              v-for="cartitem in itemInfoFromStore[0].itemInfo"
              :key="cartitem.specialId"
              class="
                shadow-inner
                text-right
                hover:bg-green-500 hover:bg-opacity-25 hover:shadow
                space-y-6
              "
            >
              <td class="w-1/12 shadow-md"><p class=""><img :src="cartitem.itemImg" /></p></td>
              <td class="w-4/12">
                <div class="text-xl font-bold pb-5">{{ cartitem.itemName }}</div>
                <div v-for="topping in cartitem.toppings" :key="topping.id" class="text-sm">
                    {{ topping.name }} ({{toppingSize(topping.size)}})
                </div>
                <!-- <div>{{ toppings[0].name}}</div> -->
              </td>
              <td class="w-2/12">
                <div class="pb-5 text-xl">{{ cartitem.itemPrice }} 円</div>
                <div v-for="topping in cartitem.toppings" :key="topping.id" class="text-sm">
                 + {{ topping.price }} 円
                </div>
              </td>
              <td class="w-1/12">{{ cartitem.itemNum }} 個</td>
              <td class="w-2/12">{{ cartitem.totalPrice }} 円</td>
              <td class="w-2/12">
               <button title="商品を削除" @click="deleteCartItem(cartitem.specialId)">
               <!-- <button> -->
                <img src="~/assets/img/trash.png" class="w-1/5 ml-10" />
               </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <button
          @click="OrderMove()"
          class="
            bg-green-500
            hover:bg-green-700
            text-white
            font-bold
            py-2
            px-4
            rounded-full
          "
        >
          <router-link to="/OrderInfo"> 注文に進む </router-link>
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { itemInfoStore } from '../store';

export default Vue.extend({
//   data() {
//     return {
//     };
//   },
  methods: {
    OrderMove() {
      console.log('move');
      console.log(itemInfoStore.getitemInfo);
    },
    toppingSize(el:number){
        if(el===1){
            return '多'
        }else if(el===2){
            return '少'
        }
    },
    deleteCartItem(id:string){
        if(confirm("カートから商品を削除しますか？")){
           itemInfoStore.deleteCartItemAct(id)
        }
    }
  },
  computed: {
    itemInfoFromStore(){
      return itemInfoStore.getitemInfo;
    }
  },
  async fetch() {
    // if (itemInfoStore.itemInfo.length === 0) {
      const fetchitemInfoFromStore = itemInfoStore.fetchitemInfoAct();
      await Promise.all([fetchitemInfoFromStore]);
    // }
  },
});
</script>
