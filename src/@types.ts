export interface UserSignInForm {
  email: string
  password: string
}
export interface UserSignUpForm {
  email: string
  password: string
  nickname: string
  photoURL?:string
}

export interface AuthUser {
  email: string
  phoneNumber?: string | null
  uid:string
}

export interface UserInfo {
  nickname: string
  photoURL?:string
}

export interface User {
  userInfo: UserInfo
  authUser: AuthUser
}

export type Message = {
  sender: User,
  time: number,
  content: string
}
export type Room = {name:string, messages: {[id:string] : Message}, id?:string} 