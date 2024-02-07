import { User } from '@/@types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppDispatch,RootState } from '@/store'
import { sendMessageToRoom } from '@/store/chatSlice'
import React, { FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TbSend } from "react-icons/tb";


type SendMessageProps = {roomId:string}
function SendMessage({roomId}: SendMessageProps) {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector<RootState, User | null>(state => state.userReducer.user)

  const onMessage = (e:any) => {
    e.preventDefault()
    if(!user) {
      return;
    }

    const message = {
      content:e.target[0].value,
      sender:user,
      time:Date.now()
    } 
    dispatch(sendMessageToRoom({roomId, message}))

    const end= document.querySelector<HTMLInputElement>("#send-message")
    if(end){
      end.value="";
    }
    
  }
  return (
    <form onSubmit={onMessage} className='mt-[5px]'>
      <Input className='box-border h-10 p-1 w-[80%] flex-grow bg-blue-200 font-sans outline-none border-0 overflow-visible text-black overflow-wrap-anywhere break-words' 
              type='text' 
              id="send-message" 
              placeholder='Enter a message..'/>
      <Button className='box-border absolute ml-[5px] w-10 h-10  bg-blue-800 p-0'>
          <TbSend color='white' size={20}/>
      </Button>
    </form>
  )
}

export default SendMessage