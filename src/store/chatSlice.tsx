import { Message, Room } from "@/@types";
import { db } from "@/firebase";
import { SerializedError, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { push, ref } from "firebase/database";


export const createRoom = createAsyncThunk("chatSlice/createRoom",
 async ({name} : {name:string}) => {
  const roomsRef = ref(db, `rooms`)
  const room : Room = {name, messages:{}}
  const doc = await push(roomsRef,room)
  room.id = doc.key!
  return room
})

export const sendMessageToRoom = createAsyncThunk("chatSlice/sendMessageToRoom",
 async ({roomId, message} : {roomId:string,message:Message}) => {
  const roomsRef = ref(db, `rooms/${roomId}/messages`)
  const doc = await push(roomsRef, message)
  return message
})

export const chatSlice = createSlice({
  name:"chatSlice",
  initialState: {
    rooms: {},
    loading:false,
    error:undefined as SerializedError | undefined
  },
  reducers: {
    
  },
  extraReducers: (builder) => {
  builder.addCase(createRoom.pending, (state) => {
      state.loading = true
  })

  builder.addCase(createRoom.rejected, (state ,action) => {
    state.loading = false
    state.error = action.error
  })

  builder.addCase(createRoom.fulfilled, (state ,action) => {
    state.loading = false
    if(action.payload.id)
      state.rooms = {...state.rooms, [action.payload.id]:action.payload}
    state.error = undefined
  })

  builder.addCase(sendMessageToRoom.pending, (state) => {
    state.loading = true
})

  builder.addCase(sendMessageToRoom.rejected, (state ,action) => {
    state.loading = false
    state.error = action.error
  })

  builder.addCase(sendMessageToRoom.fulfilled, (state) => {
    state.loading = false
    state.error = undefined
  })
  }
})
