import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators"
import { db } from "~/plugins/firebase";
import { cartItemType,orderedItemType } from "~/types/cartItemType";
import { UserStore,itemInfoStore,OrderlogStore } from "~/store";
@Module({ name: 'cart', namespaced: true ,stateFactory: true})

 export default class CartStore extends VuexModule {
     
    // state----------------------------------------
    public carts: cartItemType[]=[];
    public cartWithUser = [];
    //public userInfo:string | null =null

    // getters--------------------------------------
    public get getCart(){
        return this.carts.filter(cart=>cart.status===0)
    }
    

    // mutation-------------------------------------
    @Mutation
    private  addItemToCartMut(addItemToCart:cartItemType, idFromDb:string|null):void{
        if(idFromDb===null)return
    this.carts.push({...addItemToCart,orderId:idFromDb});
    }

    // action---------------------------------------
    @Action({rawError: true})
    public addItemToCartAct(addItemToCart:cartItemType){

        //ランダムな文字列IDを作成
        let specialId = Math.random().toString(36).slice(-8);
        console.log(specialId)
        let itemInfo={...addItemToCart,specialId:specialId}
        console.log(itemInfo)
        let _order={itemInfo:[itemInfo],status:0}

        // ログインしていない場合カート商品はstoreにだけ追加
        if(!UserStore.userInfo){
            this.addItemToCartMut(addItemToCart,null);
        }// ログインしてたらdbとstoreにカート商品を追加
        else {
            // 既にカートがあったらOrder/orderInfoコレクション内のitemInfo配列に追加
            if(itemInfoStore.getitemInfo.length>0){
                console.log("既にカートがあるので既存のカートに商品追加")
                let newCartitems =  {...itemInfoStore.getitemInfo};
                console.log(newCartitems)
                if(newCartitems[0].itemInfo===undefined)return
                newCartitems[0].itemInfo.push(itemInfo);
                console.log(newCartitems[0].itemInfo)
                if(itemInfoStore.getitemInfo[0].orderId===null) return;

                db.collection(`users/${UserStore.userInfo.uid}/order`).doc(itemInfoStore.getitemInfo[0].orderId).update({
                    itemInfo:[...newCartitems[0].itemInfo]
                }).then(()=>{
                if (itemInfoStore.getitemInfo[0].orderId===undefined) return;
                this.addItemToCartMut(addItemToCart,itemInfoStore.getitemInfo[0].orderId)})
            } else {
            // カートの中身が空だったらOrder/ordrtIdコレクションごと作成
            if(!UserStore.userInfo.uid) return
            console.log("カートが空なので新たなカートを作成")
            db.collection(`users/${UserStore.userInfo.uid}/order`).add(_order).then(cartItem=>{
                console.log(cartItem.id);
                this.addItemToCartMut(addItemToCart,cartItem.id)
            })
        }        
    }}
    @Action({rawError: true})
    public updateOrderAct(orderInfoToDb:orderedItemType){
        if(orderInfoToDb.orderInfo===undefined)return
        orderInfoToDb.status= orderInfoToDb.orderInfo.payment
        console.log(orderInfoToDb);
        if(UserStore.userInfo){
            db.collection(`users/${UserStore.userInfo.uid}/order`).doc(orderInfoToDb.orderId).update(orderInfoToDb).then(()=>{
                console.log("注文完了")
                if(orderInfoToDb.orderId===undefined)return
                itemInfoStore.updateOrderMut(orderInfoToDb,orderInfoToDb.orderId)
            })
        }
    }
}
