import { Room, User } from '@/@types'
import { db } from '@/firebase'
import { AppDispatch, RootState } from '@/store'
import { Button } from 'antd'
import { onValue, ref } from 'firebase/database'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CreateRoom from './CreateRoom'
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch } from 'react-redux';
import {   useNavigate } from "react-router";
import {  getUserInfo, signOut } from '@/store/userSlice';


export default function Rooms({onRoom}: {onRoom:(room: string) => void}) {

  const [rooms,setRooms] = useState<{[id:string] : Room }>({})
  const user = useSelector<RootState, User | null>(state => state.userReducer.user)
  const dispatch = useDispatch<AppDispatch>()
  // const  nav = useNavigate()

  useEffect(() => {
    console.log(user)
      const roomsRef = ref(db, "rooms")
      const unsubscribe = onValue(roomsRef, (snapshot) => {
        const allRooms :{[id:string] : Room }= snapshot.val()
        setRooms(allRooms)
      })
      return () => {
        unsubscribe()
      }
  }, [])
  


  const RoomsList = useCallback(() => {
    if(!rooms) return null
      const roomEntires = Object.entries(rooms)
      return <div className='box-border flex flex-col overflow-hidden flex-grow'>
        {roomEntires.map(([id, room]) => <Button className='box-border overflow-hidden whitespace-nowrap text-black text-opacity-87 text-base' onClick={() => onRoom(id)} key={id}>{room.name}</Button>)}
      </div>
  }, [rooms])

  function handleLogOut() {
      dispatch(signOut());   
  }

  return (
    <div className='h-full max-w-[320px] basis-[35%] border-r-[1px] border-blue-500 z-10  '>
      {/* <SlideHeader userPhoto={userImg}  user={user}/> */}
      <div className='bg-blue-100 h-[63px] mr-2 w-full z-10 box-border text-[#000000de]  flex flex-row items-stretch border-b border-solid border-gray-300  select-none'>
      <div className='box-border ml-[11px] mt-[12px] w-[60px] h-[60px] mr-4 order-2  '>
        <img className='rounded-full  border-[1px] border-[white]' alt="user-photo" src={user?.userInfo?.photoURL || ""} />
      </div>
      <div className=' box-border w-full flex items-center order-3 flex-grow-2 justify-center  min-w-0'>
        <div className='pl-[10px] w-[70%] text-left box-border baseline  overflow-hidden whitespace-nowrap font-bold  text-blue-800'>
          {user?.userInfo?.nickname}
        </div>
      <button onClick={handleLogOut} className="opacity-60 hover:opacity-100 cursor-pointer p-0  outline-none box-border inline-block align-middle text-center text-blue-500 bg-transparent border-none rounded-[0.7em] m-0.1em 0.2em p-0.2em 0.7em text-[2em] leading-1.5">
        <AiOutlineLogout />
      </button>
      </div>

    </div>
      <div className='box-border relative overflow-hidden h-full text-black bg-transparent'>
        <div className='relative w-full h-full'>
          <CreateRoom />
          <RoomsList/>
        </div>
      </div>
   
    </div>
  )
}
