
import { User } from '@/@types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppDispatch, RootState } from '@/store'
import { createRoom } from '@/store/chatSlice'
import { Modal, message } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function CreateRoom() {
  const user = useSelector<RootState, User | null>(state => state.userReducer.user)
  const dispatch = useDispatch<AppDispatch>()
  const onCreateRoom = () => {
    if(!user) {
      message.info("you must be signed in ..")
      return
    }
    Modal.confirm({
      content: <div>
        <Label>Room name</Label>
        <Input type='text' required placeholder='Enter room name' id='room-name'/>
      </div>,
      okText: "Create room",
      onOk: async () => {
        const input = document.querySelector("#room-name") as any
        if(!input) {
          message.info("you must enter room name ..")
        }
        await dispatch(createRoom({name:input.value}))
      }
    })
  }
  return (
    <Button className='text-sm w-full  text-white bg-blue-800  p-2 m-0 p-0' onClick={onCreateRoom}>Create room</Button>
  )
}
