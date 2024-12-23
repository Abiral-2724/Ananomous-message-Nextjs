"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Message } from "@/model/User"
import { useToast } from "@/hooks/use-toast"
import axios, { AxiosError, isAxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { format } from "date-fns"

interface MessageCardProps {
  message: Message
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast()

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
      
      toast({
        title: "Success",
        description: response.data.message,
        variant: "default"
      })
      
      onMessageDelete(message.id)
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data.message ?? "Failed to delete message",
          variant: "destructive"
        })
      }
    }
  }

  const formattedDate = message.createdAt ? format(new Date(message.createdAt), "PPp") : ""

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl mb-1">{"Message"}</CardTitle>
          <CardDescription>{message.content || "No description provided"}</CardDescription>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Message</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this message? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.content}</p>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        {formattedDate}
      </CardFooter>
    </Card>
  )
}

export default MessageCard