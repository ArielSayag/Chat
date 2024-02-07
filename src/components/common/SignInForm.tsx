"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { message } from "antd"
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
import { signIn } from "@/store/userSlice"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

const formSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid email address",

  }),
  password: z.string().min(6, {message: "Password must be atleast 6 characters long"})
})


type UserSignInForm = z.infer<typeof formSchema>
export function SignInForm() {
  const dispatch = useDispatch<AppDispatch>()
  const  nav = useNavigate()
 
  const form = useForm<UserSignInForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password:""
    },
  })
 

  async function onSubmit(values: UserSignInForm) {
    try {
      dispatch(signIn(values))
      
      nav("/home")
    } catch(e:any) {
        message.info(e.message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 inline-grid">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
             <FormItem className="text-justify inline-grid">
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input placeholder="Enter email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
             <FormItem className="text-justify inline-grid">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign In</Button>
      </form>
    </Form>
  )
}
