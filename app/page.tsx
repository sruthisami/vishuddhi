"use client"
import {useState,useEffect} from "react"

export default function Home() {
  const emotions = [
    { value: 0, label: "Sad", color: "from-blue-500/50" },
    { value: 25, label: "Content", color: "from-green-500/50" },
    { value: 50, label: "Peaceful", color: "from-purple-500/50" },
    {value:75, label:"Happy", color:"from-yellow-500/75"},
    {value:100, label:"Excited", color:"from-pink-500/100"},
  ];

  const[emotion,setEmotion]=useState(50)
  const[mounted,setMounted]=useState(false)
  useEffect(()=>{setMounted(true)},[])
  const currentEmotion = emotions.find((em) => Math.abs(emotion - em.value) < 15) || emotions[2]
  
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <section className="relative min-h-[90vh] mt-20 flex flex-col items-center justify-center py-12 px-4">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className={`absolute w-[500px] h-[500px] rounded-full blur-3xl top-0 -left-20 transition-all duration-700 ease-in-out bg-gradient-to-r ${currentEmotion.color} to-transparent opacity-60`}>
            <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl bottom-0 right-0 animate-pulse delay-700">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>
     </div>
  );
}
