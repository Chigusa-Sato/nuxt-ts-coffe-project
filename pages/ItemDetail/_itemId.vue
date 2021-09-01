<template>
  <div class="p-5 flex">
    <div>
      <div class="flex">
        <div class="m-2">
          <img :src="itemDetail.img" class="rounded-xl w-full" />
        </div>

        <div class="flex flex-col justify-center">
          <div>
            <p class="text-gray-700 text-4xl">{{ itemDetail.name }}</p>
          </div>
          <div>
            <p>
              <span class="text-2xl">￥{{ itemDetail.price }}</span
              >税込
            </p>
          </div>
          <div>
            <p class="block my-4">{{ itemDetail.description }}</p>
          </div>

          <div class="flex">
            <div class="flex items-center">
              <span class="mr-3">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">個数</font>
                </font>
              </span>
              <div class="relative">
                <select
                  class="
                    rounded
                    border
                    appearance-none
                    border-gray-300
                    py-2
                    focus:outline-none
                    focus:ring-2
                    focus:ring-green-500
                    focus:border-green-500
                    text-base
                    pl-3
                    pr-10
                  "
                  v-model="selectedItemNum"
                >
                  <option v-for="(num, index) in itemNum" :key="index">
                    {{ num }}
                  </option>
                </select>
                <span
                  class="
                    absolute
                    right-0
                    top-0
                    h-full
                    w-10
                    text-center text-gray-600
                    pointer-events-none
                    flex
                    items-center
                    justify-center
                  "
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5">
        <p class="mb-3 text-xl">
          トッピング<span class="font-bold"> 少:200円 多:300円</span>
        </p>
        <div class="flex flex-wrap">
          <div
            class="w-1/6 mb-4"
            v-for="topping in getToppings"
            :key="topping.id"
          >
            <p>{{ topping.name }}</p>
            <button
              class="
                hover:bg-gray-400
                text-gray-700
                font-semibold
                hover:text-white
                text-sm
                py-1
                px-2
                border border-gray-400
                w-8
                hover:border-transparent
                rounded
              "
              :class="{ 'bg-gray-400': isSelectedM === topping.id }"
              @click="
                selectToppingSize(
                  topping.name,
                  topping.id,
                  topping.priceM,
                  1,
                  topping.isActiveM
                )
              "
            >
              少
            </button>
            <button
              class="
                hover:bg-gray-400
                text-gray-700
                font-semibold
                hover:text-white
                text-sm
                py-1
                px-2
                border border-gray-400
                w-8
                hover:border-transparent
                rounded
              "
              :class="{ 'bg-gray-400': isSelectedL === topping.id }"
              @click="
                selectToppingSize(
                  topping.name,
                  topping.id,
                  topping.priceL,
                  2,
                  topping.isActiveL
                )
              "
            >
              多
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <div class="py-2 px-4">
          <p class="text-gray-700 text-3xl">合計￥{{ calcTotalPrice }}</p>
        </div>
        <div class="py-2 px-4">
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
            @click="addCart"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ItemsStore, ToppingsStore, CartStore, UserStore } from '../../store';
import { itemType } from '~/types/itemType';
import { toppingType } from '~/types/toppingType';
import { cartItemType } from '~/types/cartItemType';

type DataType = {
  isSelectedM: null | number;
  isSelectedL: null | number;
  itemDetail: itemType | undefined;
  itemNum: number[];
  selectedItemNum: number;
  allToppingPrice: number;
  selectedTopping: toppingType[];
};

export default Vue.extend({
  data(): DataType {
    return {
      isSelectedM: null,
      isSelectedL: null,
      itemDetail: {},
      itemNum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      selectedItemNum: 1,
      allToppingPrice: 0,
      selectedTopping: [],
    };
  },
  created() {
    const params: number = Number(this.$route.params.itemId);
    const getItemDetail: itemType | undefined =
      ItemsStore.getItemDetail(params);
    this.itemDetail = getItemDetail;
  },
  methods: {
    // トッピング追加----------------------------------------------------
    selectToppingSize(
      selectedName: string,
      selecteId: number,
      toppingPrice: number,
      toppingSize: number,
      isActive: boolean
    ) {
      // style変更
      // if (this.isSelectedM === selecteId) {
      //   this.isSelectedM = null;
      // } else {
      //   this.isSelectedM = selecteId;
      // }

      // 同じトッピングを選択していないかチェック
      const duplicatedTopping = this.selectedTopping.findIndex(
        (topping) => topping.id === selecteId
      );
      // toppingの重複が無いとき
      if (duplicatedTopping < 0) {
        const pushTopping: toppingType = {
          name: selectedName,
          id: selecteId,
          price: toppingPrice,
          size: toppingSize,
        };
        this.selectedTopping.push(pushTopping);
      }
      // 同じtoppingを選んだとき
      else if (duplicatedTopping >= 0) {
        // サイズを変更したとき
        if (this.selectedTopping[duplicatedTopping].size !== toppingSize) {
          console.log('更新');
          this.selectedTopping[duplicatedTopping].size = toppingSize;
          this.selectedTopping[duplicatedTopping].price = toppingPrice;
        } // 取り消したいとき(同じトッピング・サイズを選んだとき)
        else {
          console.log('取り消し');
          this.selectedTopping[duplicatedTopping].size = 0;
          this.selectedTopping = this.selectedTopping.filter(
            (topping) => topping.size !== 0
          );
        }
      }
      // topping価格の更新
      this.allToppingPrice = this.selectedTopping.reduce(
        (sum: number, addTopping: any) => sum + addTopping.price,
        0
      );
    },

    // カートに追加-------------------------------------------------------------------
    addCart() {
      const addItemToCart:cartItemType = {
        itemId: this.itemDetail?.id,
        itemName: this.itemDetail?.name,
        itemPrice: this.itemDetail?.price,
        itemNum: this.selectedItemNum,
        itemImg: this.itemDetail?.img,
        toppings: this.selectedTopping,
        allToppingPrice:this.allToppingPrice,
        totalPrice:this.calcTotalPrice
      };
      CartStore.addItemToCartAct(addItemToCart);
      this.$router.push('/Cart')
    },
  },
  computed: {
    getCart(): cartItemType[] {
      return CartStore.getCart;
    },
    getToppings(): toppingType[] {
      return ToppingsStore.getToppings;
    },
    calcTotalPrice(): number {
      if (
        this.itemDetail === undefined ||
        this.itemDetail.price === undefined
      ) {
        return 0;
      } // 0はfalse
      return (
        this.selectedItemNum * this.itemDetail.price + this.allToppingPrice
      );
    },
  },
});
// async asyncData({ params }) {
//   console.log(" ASYNCデータ");
//   const detailParamsId: number = Number(params.itemId);
//   const detailItemFromStore = await ItemsStore.getItemDetail(detailParamsId);
//   return {itemDetail:detailItemFromStore}
// },
</script>
