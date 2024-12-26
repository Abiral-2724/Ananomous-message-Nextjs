"use client"

import { Message } from "@/model/User"
import { useCallback, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { 
    Loader2, 
    RefreshCcw, 
    Link, 
    Copy, 
    MessageSquare,
    Bell,
    Settings,
} from "lucide-react"
import MessageCard from "@/components/messageCard"
import { User } from "next-auth"
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle,
    CardDescription 
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

const Dashboard = () => {
    const router = useRouter() ;
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const { toast } = useToast()
    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(AcceptMessageSchema)
    })

    const { register, watch, setValue } = form
    const acceptMessages = watch('acceptMessages')

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessages', response.data.isAccesptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                variant: "destructive"
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue, toast])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if (refresh) {
                toast({
                    title: "Success",
                    description: "Messages refreshed successfully",
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch messages",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }, [toast])

    useEffect(() => {
        if (!session?.user) return
        fetchMessages()
        fetchAcceptMessage()
    }, [session, fetchAcceptMessage, fetchMessages])

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages
            })
            setValue('acceptMessages', !acceptMessages)
            toast({
                title: "Success",
                description: response.data.message,
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to update message settings",
                variant: "destructive"
            })
        }
    }

    if (!session?.user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
                <Card className="w-96 bg-gray-800/30 border-0">
                    <CardContent className="p-6">
                        <Alert>
                            <AlertDescription className="text-center text-gray-200">
                                Please login to access your dashboard
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const { username } = session.user as User
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : ''
    const profileUrl = `${baseUrl}/u/${username}`

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                                Welcome back, {username}
                            </h1>
                            <p className="mt-2 text-gray-300">
                                Manage your messages and profile settings
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button 
                                onClick={() => router.push('/sendmessage')}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Send Message
                            </Button>
                            <Button variant="outline" size="icon" className="bg-gray-800/30 border-0 hover:bg-gray-700/50">
                                <Bell className="h-4 w-4 text-gray-200" />
                            </Button>
                            <Button variant="outline" size="icon" className="bg-gray-800/30 border-0 hover:bg-gray-700/50">
                                <Settings className="h-4 w-4 text-gray-200" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-gray-800/30 border-0 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-200">
                                    <Link className="h-5 w-5 text-blue-400" />
                                    Share Profile
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Share your profile link to receive anonymous messages
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={profileUrl}
                                            readOnly
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700/50 
                                                     text-gray-200 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <Button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(profileUrl)
                                            toast({
                                                title: 'Success',
                                                description: 'Profile URL copied to clipboard',
                                            })
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800/30 border-0 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-200">
                                    <MessageSquare className="h-5 w-5 text-blue-400" />
                                    Message Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="font-medium text-gray-200">Accept New Messages</h3>
                                        <p className="text-sm text-gray-400">
                                            {acceptMessages ? 'Currently accepting messages' : 'Messages are disabled'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={acceptMessages ? "default" : "secondary"}>
                                            {acceptMessages ? 'Active' : 'Inactive'}
                                        </Badge>
                                        <Switch
                                            {...register('acceptMessages')}
                                            checked={acceptMessages}
                                            onCheckedChange={handleSwitchChange}
                                            disabled={isSwitchLoading}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-gray-800/30 border-0 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-gray-200">Recent Messages</CardTitle>
                                <CardDescription className="text-gray-400">
                                    You have {messages.length} message{messages.length !== 1 ? 's' : ''}
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchMessages(true)}
                                disabled={isLoading}
                                className="bg-gray-700/50 border-0 hover:bg-gray-600/50 text-gray-200"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCcw className="h-4 w-4" />
                                )}
                                Refresh
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {messages.length > 0 ? (
                                    messages.map((message ,index) => (
                                        <MessageCard
                                            key={index}
                                            message={message}
                                            onMessageDelete={handleDeleteMessage}
                                        />
                                    ))
                                ) : (
                                    <Card className="col-span-full bg-gray-700/30 border-0">
                                        <CardContent className="p-8 text-center">
                                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                            <h3 className="text-lg font-medium mb-2 text-gray-200">No messages yet</h3>
                                            <p className="text-gray-400">
                                                Share your profile link to start receiving anonymous messages
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <footer className="text-center py-6 text-gray-400 bg-gray-900/50 backdrop-blur-sm mt-16">
                <p>© 2024 True Feedback. All rights reserved.</p>
                <p className="text-sm mt-1">Made with ❤️ by Abiral jain</p>
            </footer>
        </div>
    )
}

export default Dashboard