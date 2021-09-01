import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { db } from "~/plugins/firebase";
import { cartItemType,orderedItemType, otderIemType } from "~/types/cartItemType";
import { UserStore } from "../store";

// interface itemInfoType {
//     id?:string,
//     itemId?:number,
//     itemNum?:string
// }

@Module({ name: 'itemInfo', namespaced: true, stateFactory: true})

export default class itemInfoStore extends VuexModule {

    //state-------------------------------------------------
    public itemInfo:  otderIemType[] = [];
    public userUid: string='';
    public order:null|cartItemType=null;

    //getters-----------------------------------------------
    public get getitemInfo():  otderIemType[]{
        return this.itemInfo.filter(item=>item.status===0);
    }
    // public get getOrderId():string|null|undefined{
    //   return this.itemInfo.length>0?this.itemInfo[0].orderId:null
    // }

    //mutation-----------------------------------------------
    @Mutation
    private fetchitemInfoMut(itemInfoFromDb:cartItemType):void{
       // let itemInfoFromDB = {...itemInfoFromDb}
        this.itemInfo.push(itemInfoFromDb)
        //this.order=itemInfoFromDb;
    }

    // @Mutation
    // private deleteCartItemMut(id:string):void{
    //     const index = this.itemInfo.findIndex(item => item.id ==id)
    //     this.itemInfo.splice(index,1)
    // }


    @Mutation
    public updateOrderMut(orderInfoToDb:orderedItemType,orderId:string){
       
        //orderInfoToDb.orderId=orderId;
        this.itemInfo=[]
    }

    //action-------------------------------------------------
    @Action({rawError: true})
    public async fetchitemInfoAct(): Promise<void>{
            await db.collection(`users/${UserStore.userInfo!.uid}/order`).get().then(itemInfoAll =>{
            if(itemInfoAll.docs.length>this.itemInfo.length){
            itemInfoAll.forEach(itemInfo=>{
                    let itemInfoFromDb:cartItemType = itemInfo.data()
                    itemInfoFromDb = {...itemInfoFromDb,orderId:itemInfo.id}
                    this.fetchitemInfoMut(itemInfoFromDb)
            })}
        })
    }

    @Action({rawError: true})
    public async deleteCartItemAct(id:string): Promise<void>{
        let cartOrderId = this.getitemInfo[0].orderId
        const deleteCartItemIndex:number = this.getitemInfo[0].itemInfo.findIndex(item=>item.specialId === id )
        this.getitemInfo[0].itemInfo.splice(deleteCartItemIndex,1)
        await db.collection(`users/${UserStore.userInfo!.uid}/order`).doc(`${cartOrderId}`).update({
            itemInfo: this.getitemInfo[0].itemInfo
        })
    }
}
