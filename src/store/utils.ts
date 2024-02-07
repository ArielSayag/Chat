import { ref, set } from "firebase/database"
import {ref as storageRef} from 'firebase/storage'
import { User, UserInfo, UserSignUpForm } from "@/@types"
import {UserCredential} from "firebase/auth"
import { db, storage } from "@/firebase"
import { getDownloadURL, uploadBytes } from "firebase/storage"



export async function saveUserWithPhoto(
  signUpForm: UserSignUpForm,
  userCredential: UserCredential,
  imageFile?: File
) {
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

}