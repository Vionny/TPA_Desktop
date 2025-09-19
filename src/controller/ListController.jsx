import { addDoc, arrayUnion, collection } from "firebase/firestore"
import { getfstore } from "../fbase/fbaseimport"
import { AddNewListtoBoard } from "./BoardController"

export const ListAddress = collection(getfstore,'List')


export function CreateNewList(boardid,name){
    addDoc(ListAddress,{
        ListName : name,
        ListCard: arrayUnion(' ')
     }).then((doc)=>{
        AddNewListtoBoard(doc.id,boardid)
     })
}