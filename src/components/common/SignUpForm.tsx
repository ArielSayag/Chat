"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AppDispatch } from "@/store"
import { getUserInfo, signUp } from "@/store/userSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { message } from "antd"
import { useMemo, useState } from "react"

const formSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid email address",

  }),
  photoURL: z.string().optional(),
  password: z.string().min(6, {message: "Password must be at least 6 characters long"}),
  nickname:z.string().min(4,{
    message:"nickname must be 4-10 letters"
  }).max(10,"nickname must be 4-10 letters")
})


type UserSignUpForm = z.infer<typeof formSchema>

export default function SignUpForm() {
  const dispatch = useDispatch<AppDispatch>()
  const  nav = useNavigate()
  const [imageFile,setImageFile] = useState<File | undefined>()
  const imageUrl = useMemo<string | undefined>(() => {
    if(imageFile)
      return URL.createObjectURL(imageFile)
  }, [imageFile])

  const form = useForm<UserSignUpForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password:"",
      nickname:"",
    },
  })
 

  async function onSubmit(signUpForm: UserSignUpForm) {

    try {
      await dispatch(signUp({signUpForm, imageFile}))
      nav("/home")
    } catch(e:any) {
      message.info(e.message)
    }
  }
  

  return (
    <>
    {imageFile && <center>
     <img className="rounded-full w-[100px] h-[100px] object-cover"  src={imageUrl}/>
      </center>}
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 inline-grid">
      <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem  className="text-justify inline-grid">
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input placeholder="Enter a nickname" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="text-justify inline-grid">
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input  placeholder="Enter email address"  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem  className="text-justify inline-grid">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          name="photoURL"
          control={form.control}
          render={({ field }) => (
            <FormItem  className="text-justify inline-grid">
              <FormLabel>Photo</FormLabel>
                <Input type="file"  {...field} onChange={(e) => {
                  if(e.currentTarget.files) {
                    const file = e.currentTarget.files[0]
                    setImageFile(file)
                  }
                }} className="pb-7 pt-1 overflow-visible" />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create account</Button>
      </form>
    </Form>
    </>
  )
}
