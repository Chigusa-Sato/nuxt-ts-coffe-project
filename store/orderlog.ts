import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators"
import { db } from "~/plugins/firebase";
import { UserStore } from "~/store";
import { cartItemType } from "~/types/cartItemType";

@Module({ name: 'orderlog', namespaced: true ,stateFactory: true})
export default class OrderlogStore extends VuexModule {

    //state-------------------------------------------------------------------------
    public orderlog:cartItemType[]=[];

    // // getters-----------------------------------------------------------------------
    // public get getOrderLogItem():cartItemType[]{
    //     return this.orderlog
    // }

    // // mutation----------------------------------------------------------------------
    // @Mutation
    // private fetchLogItemsMut(orderLogData:cartItemType){
    //     console.log("MUTATION"+JSON.stringify(orderLogData))
    //     this.orderlog.push(orderLogData)
    // }

    // // actions-----------------------------------------------------------------------
    // @Action({rawError: true})
    // public async fetchLogItemsAct(){
    //     if(!UserStore.userInfo){
    //         console.log("ログインしていません")
    //     } else {
    //     if(!UserStore.userInfo.uid) return
    //     let uid:string|undefined|null 
    //     uid= UserStore.userInfo.uid
    //     console.log("ORDERLOGログインしています"+uid)
        
    //    await db.collection(`users/${uid}/order`).get().then(orders=>{
    //        orders.forEach(order=>{
    //            if(order.data().status===1||order.data().status===2){
    //         // ifDBの履歴情報(orderId)がstateのorederLogの情報と重複していなかったら下記を実行
    //            this.fetchLogItemsMut(order.data())
    //            }
    //        })
    //     })
    // }}
}
