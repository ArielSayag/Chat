import { useState } from "react"
import ChatRoom from "./ChatRoom"
import Rooms from "./Rooms"


export default function Chat() {

  const [currentRoom,setCurrentRoom] = useState<string | undefined>()

  return <div className="absolute w-full h-full translate-x-0 opacity-100"> 
  <div className="w-full relative flex flex-row h-full overflow-auto border-0 text-sm  ">
      <Rooms onRoom={setCurrentRoom}/>
      <ChatRoom roomId ={currentRoom}/>

  </div>
  </div>
}