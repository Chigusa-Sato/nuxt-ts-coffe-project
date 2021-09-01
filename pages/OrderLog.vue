<template>
  <div>
    <div v-if="logItems.length === 0">履歴はありません</div>
    <div class="grid justify-items-center" v-if="logItems.length > 0">
      <!-- <h1>カート(Cart.vue)</h1> -->
      <!-- <div class="p-8">
        <table class="table-auto shadow-xl bg-gray-400">
          <thead class="bg-yellow-800 bg-opacity-25">
            <tr>
              <th class="w-1/6"></th>
              <th class="w-1/6">商品</th>
              <th class="w-1/6">トッピング</th>
              <th class="w-1/6">配送情報</th>
              <th class="w-1/6">計(税抜)</th>
              <th></th>
            </tr>
          </thead>
          <tbody class="">
            <tr
              v-for="logItem in logItems[0].itemInfo"
              :key="logItem.specialId"
              class="
                shadow-inner
                text-center
                hover:bg-green-500 hover:bg-opacity-25 hover:shadow
              "
            >
              <td class="w-1/6 shadow-md"><img :src="logItem.itemImg" /></td>
              <td class="w-1/6">
                <p class="font-bold">{{ logItem.itemName }}</p>
                <p>×{{ logItem.itemNum }}</p>
              </td>
              <td>
                <div v-if="logItem.toppings.length > 0">
                  <div v-for="topping in logItem.toppings" :key="topping.id">
                    {{ topping.name }}
                  </div>
                </div>
                <div v-else>トッピングなし</div>
              </td>
              <td>配送情報</td>
              <td class="w-1/6">{{ logItem.totalPrice }} 円</td>
              <td>
                <button
                  class="
                    text-white
                    font-semibold
                    bg-green-500
                    py-2
                    px-4
                    rounded
                    transition
                    duration-200
                    transform-gpu
                    hover:scale-105
                  "
                  @click="cancelOrder(logItem)"
                >
                  注文キャンセル
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div> -->

      <!-- table2 -->
      <div class="">
        <div class="bg-orange-100 m-1 border-solid border-2 border-gray-200 flex">
          <div class="p-1 w-3/4 text-center">商品情報</div>
          <div class="p-1 w-1/4">配達情報</div>
        </div>
        <div
          v-for="logItem in logItems"
          :key="logItem.orderId"
          class="flex m-1 border-solid border-2 border-gray-200"
        >
          <div class="p-2">
            <div
              v-for="item in logItem.itemInfo"
              :key="item.specialId"
              class="m-1 p-1"
            >
              <!-- アイテム情報 -->
              <div class="flex">
                <div class="w-1/4"><img :src="item.itemImg" /></div>
                <div class="flex flex-col w-2/4 border-solid border-b border-gyar-100">
                  <div class="p-1 flex">
                    <div class="w-3/4">
                      <span class="font-bold text-xl">{{ item.itemName }}</span
                      >× {{ item.itemNum }}
                    </div>
                    <div class="w-1/4">
                      ￥{{ item.itemPrice * item.itemNum }}
                    </div>
                  </div>
                  <div
                    class="p-1 text-sm flex"
                    v-for="(topping, index) in item.toppings"
                    :key="index"
                  >
                    <div class="w-3/4">+{{ topping.name }}</div>
                    <div class="w-1/4">￥{{ topping.price }}</div>
                  </div>
                  <div class="p-1 pt-5 flex">
                    <div class="w-3/4">合計金額</div>
                    <div class="w-1/4 text-xl font-bold">
                      ￥{{
                        item.itemPrice * item.itemNum + item.allToppingPrice
                      }}
                    </div>
                  </div>
                  <!-- <div class="p-1">￥{{ item.totalPrice }}</div> -->
                  <div class="p-1"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="p-2 w-1/4 flex flex-col justify-center">
            <!-- オーダー情報 -->
            <p>注文者 : {{ logItem.orderInfo.name }}</p>
            <p>配送先 : {{ logItem.orderInfo.address }}</p>
            <p>
              配送日時 : {{ logItem.orderInfo.deliveryDate }}
              {{ logItem.orderInfo.deliveryTime }}時
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { UserStore } from '../store';
import { db } from '~/plugins/firebase';
import { orderedItemType } from '~/types/cartItemType';

type DataType = {
  logItems: orderedItemType[];
};
export default Vue.extend({
  data(): DataType {
    return {
      logItems: [],
    };
  },
  async fetch() {
    if (!UserStore.userInfo) {
      console.log('ログインしていません');
    } else {
      if (!UserStore.userInfo.uid) return;
      let uid: string | undefined | null;
      uid = UserStore.userInfo.uid;
      await db
        .collection(`users/${uid}/order`)
        .get()
        .then((orders) => {
          orders.forEach((order) => {
            if (order.data().status === 1 || order.data().status === 2) {
              // ifDBの履歴情報(orderId)がstateのorederLogの情報と重複していなかったら下記を実行
              this.logItems.push(order.data());
            }
          });
        });
    }
  },
  methods: {
    // deleteItem(item_specialId:any, orderId:any) {
    //   const deleteIndex = this.logItems.findIndex(logItem=>orderId===logItem.orderId)//削除対象のオーダーを特定(インデックスを特定)
    //   const deleteItemIndex = this.logItems[deleteIndex].itemInfo.findIndex(item=>item.specialId===item_specialId)//オーダーの中から削除対象の商品を特定
    //   console.log(deleteItemIndex)
    //   console.log(this.logItems[deleteIndex].itemInfo[deleteItemIndex])
    //   this.logItems[deleteIndex].itemInfo.splice(deleteItemIndex,1)//data()のlogItemから削除対象の商品を削除
    //console.log(this.logItems[deleteIndex])
    // db.collection(`users/${UserStore.userInfo.uid}/order`).doc(orderId).update({
    //   itemInfo:this.logItems[deleteIndex].itemInfo //data()のlogItemと同じ状態に更新(削除)
    // })
    // },
    // cancelOrder(logItem: cartItemType): void {
    //   console.log('注文キャンセル' + JSON.stringify(logItem));
    //   //クリックしたdata()内のorderのuidをdbで検索し、一致したもののstatusを9にする
    // },
  },
});
</script>
