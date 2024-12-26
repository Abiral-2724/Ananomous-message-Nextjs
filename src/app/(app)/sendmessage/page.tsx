"use client"
import { useState } from "react"
import { Mail, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

export default function SendMessagePage() {
  const [username, setUsername] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content
      })
      
      toast({
        title: "Success",
        description: response.data.message
      })
      
      setUsername("")
      setContent("")
    } catch (error) {  // Specify the type here
        console.log(error) ;
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-16 md:px-24">
        <section className="text-center mb-16 space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Send Your Anonymous Message
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Share your thoughts securely and privately
          </p>
        </section>

        <div className="w-full max-w-2xl relative">
          <div className="absolute -left-4 -right-4 top-1/2 -translate-y-1/2 h-40 bg-blue-500/10 blur-3xl -z-10" />
          <Card className="border-0 bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <Mail className="h-6 w-6 text-blue-400" />
                Compose Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-gray-300" htmlFor="username">Recipient&apos;s Username</label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter recipient's username"
                    required
                    className="bg-gray-700/50 border-gray-600 text-gray-200 placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300" htmlFor="content">Your Message</label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your message here"
                    rows={6}
                    required
                    className="bg-gray-700/50 border-gray-600 text-gray-200 placeholder:text-gray-400"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-400 bg-gray-900/50 backdrop-blur-sm mt-16">
        <p>© 2024 True Feedback. All rights reserved.</p>
        <p className="text-sm mt-1">Made with ❤️ by Abiral Jain</p>
      </footer>
    </div>
  )
}
