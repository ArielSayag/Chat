import { SerializedError, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut as signOutFirebase } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { UserInfo, UserSignInForm, UserSignUpForm, User, AuthUser} from "../@types";
import { get, ref, set } from "firebase/database";
import { uploadBytes, ref as storageRef, getDownloadURL } from "firebase/storage";
import { saveUserWithPhoto } from "./utils";

// async thunk functions
export const signIn = createAsyncThunk("userSlice/signIn",
   async (userCredentials : UserSignInForm) => {
    const userCredential = await signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
    const userRef = ref(db, `/users/${userCredential.user.uid}`)
    const userInfo = (await get(userRef)).val() as UserInfo
    return {
      userInfo,
      authUser: {
          email: userCredential.user.email ?? "guest@gmail.com",
          phoneNumber: userCredential.user.phoneNumber,
          uid: userCredential.user.uid
      } 
    }
})

export const signOut = createAsyncThunk("userSlice/signOut",
   async () => {
    await signOutFirebase(auth)
    return null
})


export const getUserInfo = createAsyncThunk("userSlice/getUserInfo",
   async (auth : AuthUser) => {
    const userRef = ref(db, `/users/${auth.uid}`)
    const userInfo = (await get(userRef)).val() as UserInfo
    return {
      userInfo,
      authUser:auth
    }
})

export const signUp = createAsyncThunk('userSlice/signUp',
  async ({signUpForm, imageFile}: {signUpForm :UserSignUpForm, imageFile: File | undefined}) => {
    const userCredential = await createUserWithEmailAndPassword(auth, signUpForm.email, signUpForm.password);
   
   // save a document for the user in the database
   const userRef = ref(db, `/users/${userCredential.user.uid}`)

   const saveUser = async (userInfo: UserInfo) => {
       await set(userRef, userInfo)
       return {
         userInfo,
         authUser: {
           email: userCredential.user.email ?? "guest@gmail.com",
           phoneNumber: userCredential.user.phoneNumber,
           uid: userCredential.user.uid
         }  
       } as User
   }

   const result = await new Promise<User>(async (resolve, reject) => {
     try {
     if(imageFile) {
      
       const imageRef = storageRef(storage, `/userImages/${userCredential.user.uid}.png`) 
     
       const fileReader = new FileReader()
       fileReader.onload = async () => {
         try {
         if(fileReader.result) {
           await uploadBytes(imageRef, fileReader.result as ArrayBuffer)
           const photoURL = await getDownloadURL(imageRef)
           const userInfo : UserInfo = {
             nickname: signUpForm.nickname,
             photoURL
           }
           // save the user with the uploaded photo
           resolve(await saveUser(userInfo))
         }
         } catch(e) {
           // error uploading file, save without image
           resolve(await saveUser({nickname: signUpForm.nickname}))
         }
       }
       fileReader.onerror = async () =>{
           // error reading file, save without image
           resolve(await saveUser({nickname: signUpForm.nickname}))
       }
       fileReader.readAsArrayBuffer(imageFile)
     } else {
         // user did not choose file, save without image
         resolve(await saveUser({nickname: signUpForm.nickname}))
     }
     } catch(e:any) {
       try {
         // last attempt to save the user, probably storage problem
         resolve(await saveUser({nickname: signUpForm.nickname}))
       } catch(e) {
         reject(e) // connectivity issues, or firebase issues
       }
     }
   })

   return result
    // const savedUser = await saveUserWithPhoto(signUpForm, userCredential, imageFile)
    // console.log(savedUser)
    // return savedUser;
});




type UserSlice = {
  user: User | null 
  loading:boolean
  error?:SerializedError
}
const initialState: UserSlice = {
  user: null,
  loading: false,
} 

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers:  {
 
  },
  extraReducers:(builder) =>  {
    // signIn
    builder.addCase(signIn.pending, (state) => {
        state.loading = true
        state.user = null
    })

    builder.addCase(signIn.rejected, (state ,action) => {
      state.loading = false
      state.user = null
      state.error = action.error
    })

    builder.addCase(signIn.fulfilled, (state ,action) => {
      state.loading = false
      state.user = action.payload
      state.error = undefined
    })
    //  signUp
    builder.addCase(signUp.pending, (state) => {
      state.loading = true
      state.user = null
    })

    builder.addCase(signUp.rejected, (state ,action) => {
      state.loading = false
      state.user = null
      state.error = action.error
    })

    builder.addCase(signUp.fulfilled, (state ,action) => {
      state.loading = false
      state.user = action.payload
      state.error = undefined
    })
//getUserInfo
    builder.addCase(getUserInfo.pending, (state) => {
      state.loading = true
      state.user = null
    })

    builder.addCase(getUserInfo.rejected, (state ,action) => {
      state.loading = false
      state.user = null
      state.error = action.error
    })

    builder.addCase(getUserInfo.fulfilled, (state ,action) => {
      state.loading = false
      state.user = action.payload
      state.error = undefined
    })

    builder.addCase(signOut.pending, (state) => {
      state.loading = true
      state.user = null
    })

    builder.addCase(signOut.rejected, (state ,action) => {
      state.loading = false
      state.user = null
      state.error = action.error
    })

    builder.addCase(signOut.fulfilled, (state ,_) => {
      state.loading = false
      state.user = null
      state.error = undefined
    })
  }
})

export default userSlice