"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { ApiResponse } from "@/types/ApiResponse"

const updatedVerifySchema = z.object({
  code: z.string().min(6, {
    message: "Verification code must be 6 characters.",
  }),
})

const VerifyAccount = () => {
  const router = useRouter()
  const params = useParams<{username: string}>()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof updatedVerifySchema>>({
    resolver: zodResolver(updatedVerifySchema),
    defaultValues: {
      code: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof updatedVerifySchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/verify-code', {
        username: params.username,
        code: data.code
      })

      toast({
        title: "Success",
        description: response.data.message
      })

      router.replace('sign-in')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Verification Failed',
        description: axiosError.response?.data.message ?? 'An error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 flex items-center gap-2 text-white"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 pb-8">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center">
            Verify Your Account
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            We&apos;ve sent a verification code to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="space-y-6">
                    <div className="flex flex-col items-center justify-center">
                      <FormControl>
                        <InputOTP 
                          maxLength={6} 
                          className="flex justify-center gap-3" 
                          {...field}
                        >
                          <InputOTPGroup>
                            {[...Array(6)].map((_, index) => (
                              <InputOTPSlot 
                                key={index} 
                                index={index}
                                className="w-12 h-14 text-lg border-2 bg-white/5 border-gray-600 focus:border-primary rounded-lg transition-all duration-200"
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage className="text-center mt-2" />
                    </div>
                  </FormItem>
                )}
              />
              <div className="space-y-4 mt-8">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    'Verify Account'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm text-gray-500 hover:text-black transition-colors duration-200"
                  onClick={() => form.reset()}
                >
                  Didn&apos;t receive a code? Resend
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyAccount
