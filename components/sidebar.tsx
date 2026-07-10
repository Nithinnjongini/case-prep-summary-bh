"use client"

import { Home, MessageSquare, Users, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navItems = [
  { icon: Home, label: "Home", id: "home" },
  { icon: MessageSquare, label: "Messages", id: "messages" },
  { icon: Users, label: "Members", id: "members" },
]

export function Sidebar() {
  const [active, setActive] = useState("members")

  return (
    <div className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-4">
      <div className="w-8 h-8 rounded-full bg-red-500 mb-6" />
      
      <nav className="flex-1 flex flex-col items-center gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              active === item.id
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:bg-gray-100"
            )}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </nav>

      <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100">
        <Settings className="w-5 h-5" />
      </button>
    </div>
  )
}
