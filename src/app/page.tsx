'use client'

import { Mail, MessageSquare, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Autoplay from 'embla-carousel-autoplay'
import messages from '@/messages.json'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'


export default function Home() {
  const router = useRouter();

  // If any effect was causing issues with layout, consider switching useLayoutEffect to useEffect
  useEffect(() => {
    // If there are any cleanup operations needed on mount/unmount, we can do them here
    return () => {
      // Cleanup logic if required, for example:
      console.log('Home component unmounted');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-16 md:px-24">
        <section className="text-center mb-16 space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Share your thoughts freely, stay completely anonymous
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => router.replace('/sendmessage')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
              Get Started
            </button>
            <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>
        </section>

        <div className="relative w-full max-w-4xl">
          <div className="absolute -left-4 -right-4 top-1/2 -translate-y-1/2 h-40 bg-blue-500/10 blur-3xl -z-10" />
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="border-0 bg-gray-800/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-200">
                        <MessageSquare className="h-4 w-4 text-blue-400" />
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{message.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>{message.received}</span>
                        <Send className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
          {['Safe & Secure', 'Real-time Feedback', 'Easy to Use'].map((feature, i) => (
            <Card key={i} className="bg-gray-800/30 border-0">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-500/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-gray-200">{feature}</h3>
                <p className="text-gray-400">Experience the power of anonymous feedback with our intuitive platform.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-gray-400 bg-gray-900/50 backdrop-blur-sm mt-16">
        <p>© 2024 True Feedback. All rights reserved.</p>
        <p className="text-sm mt-1">Made with ❤️ by Abiral Jain</p>
      </footer>
    </div>
  );
}
