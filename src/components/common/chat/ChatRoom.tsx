import React, { useCallback, useEffect, useRef, useState } from "react"
import CreateRoom from "./CreateRoom"
import { onValue, ref } from "firebase/database"
import { db } from "@/firebase"
import { Room } from "@/@types"
import Message from "./Message"
import SendMessage from "./SendMessage"


type ChatRoomProps = {roomId: string | undefined}

export default function ChatRoom({roomId} : ChatRoomProps) {
  const  [room,setRoom] = useState<Room | undefined>()


  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomId}`)
    const unsub = onValue(roomRef, (snapshot) => {
      const room : Room = snapshot.val()
      setRoom(room)
    })
    return  () => {
      unsub()
    }
  }, [roomId])

  const Messages = useCallback(() => {
      if(!room || !room.messages) return null
      const messages = Object.entries(room.messages)

      return <div className="order-1 box-border flex flex-col max-h-full overflow-x-hidden">
        {messages.map(([id, message]) =>  <Message key={id} message={message}/>)}
      </div>
  },[room])

  useEffect(() =>{
    if(scrollableRef.current) {
      const scrollHeight = scrollableRef.current.scrollHeight
      scrollableRef.current.scrollTo({left:0,top:scrollHeight,behavior:'smooth'})
    }
   
  },[room])

  const scrollableRef = useRef<HTMLDivElement | null>(null)

  if(!roomId) {
    return <div>
      {/* <CreateRoom/> */}
    </div>
  }

  return <div className="order-1 z-10 flex-grow-1 flex-basis-65 border-r-0 border-solid border-blue-200 box-border flex flex-col h-full w-full min-w-180 text-black bg-white"> 
    <div className="z-1 h-[63px] min-h-[63px] box-border text-black bg-blue-100 font-helvetica flex items-stretch border-b border-solid border-gray-300 p-4 select-none">
      <div className="box-border flex flex-col order-3 flex-grow-2 justify-center min-w-0">
        <div className="box-border  whitespace-nowrap font-bold text-black bg-blue-100">{room?.name}</div>
      </div>
    </div>
    <div className="flex flex-col justify-end box-border w-full h-full  min-h-1.25em relative text-black bg-white">
      <div ref={scrollableRef} className=" touch-none h-auto overflow-y-scroll   box-border absolute top-0 left-0 right-0 bottom-0 p-0.8em 0 0 1.2em">
        <div className="max-w-85 justify-start py-2  box-border flex flex-row my-0.">
        {/*  */}
          <Messages/>

        </div>
      </div>
    </div>
    <div className="border-t border-solid border-blue-200  items-end flex-row flex">
      <div className="h-full w-full  ps box-border relative flex flex-col items-stretch overflow-hidden overflow-y-auto text-[0.94em] leading-[1.35em] min-h-[1.35em] max-h-[5.4em] p-0 scroll-padding-0">
        <SendMessage roomId={roomId}/>

      </div>
    </div>
  </div>
}