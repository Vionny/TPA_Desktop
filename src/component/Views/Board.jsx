import { doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, ListGroup } from "react-bootstrap"
import { Link } from "react-router-dom";
import { boardAddress, setBoardStatus } from "../../controller/BoardController";
import { getfstore } from "../../fbase/fbaseimport";
import { UseCurrUser } from "../LoginRegister/Auth";

export const ViewAllBoards=()=>{

    const [boards, setBoards] = useState([]);
      const [loadBD, setLoadBD] = useState(true);
      useEffect(() => {
          
          let q = query(boardAddress,);
            let board= [];
  
          onSnapshot(q, (snapShot)=>{
            snapShot.docs.forEach( (doc) => {
               board.push(
                  {
                     ...doc.data(),
                     id: doc.id
                  });
  
              })
              setBoards(board)
              setLoadBD(false)
               
            })
          
      },[!loadBD])
    //   console.log(boards)
      if(!loadBD){
        return <div>
        <div>
        <ListGroup>
            {boards.map((board)=>{
                    return <Link to={'/boarddetails/'+board.id}><ListGroup.Item ><div>
                    <h4>{board.BoardName}</h4>
                    <p>Status : {board.BoardStatus}</p>
                    </div></ListGroup.Item></Link>
            })}
            
        </ListGroup>
        </div>
    </div>
  }
}


export const ViewClosedBoards=()=>{
    
  const [boards, setBoards] = useState([]);
  const [loadBD, setLoadBD] = useState(true);
  useEffect(() => {
      
      let q = query(boardAddress,);
        let board= [];

      onSnapshot(q, (snapShot)=>{
        snapShot.docs.forEach( (doc) => {
           board.push(
              {
                 ...doc.data(),
                 id: doc.id
              });

          })
          setBoards(board)
          setLoadBD(false)
           
        })
      
  },[!loadBD])
//   console.log(boards)
  const [user,setUser]= useState({})
  const userContext = UseCurrUser()
  const curruserid = userContext.user.id  
  const [loadUs,setLoadUs] = useState(true)
  useEffect(()=>{
    getDoc(doc(getfstore,'Users',curruserid)).then((doc)=>{
        const workspace1 = doc.data()
        setUser(workspace1)
        setLoadUs(false)
    })
  },[!loadUs])
  if(!loadBD&&!loadUs){
    return <div>
    <div>
    <ListGroup>
        {boards.map((board)=>{
          if(board.BoardStatus==='closed'&& user.OwnedBoard.includes(board.id)){
            return <ListGroup.Item ><div>
            <h4>{board.BoardName}</h4>
            <p>Status : {board.BoardStatus}</p>
            <Button onClick={()=>{
              setBoardStatus(board.id,'open').then(setLoadBD(false))
            }}>Open</Button>
            </div></ListGroup.Item>
          }
        })}
        
    </ListGroup>
    </div>
</div>
}
}
export const ViewFavoriteBoards=()=>{

    return <div>View Favorite Boards</div>
}

