"use client"

import { Monitor, Search, MessageSquare, Settings, ChevronDown } from "lucide-react"

export function Header() {
  return (
    <header className="h-12 bg-gray-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <span className="text-white text-sm font-medium">Integrated Experience</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-300 hover:text-white">
          <Monitor className="w-4 h-4" />
        </button>
        <button className="text-gray-300 hover:text-white">
          <Search className="w-4 h-4" />
        </button>
        <button className="text-gray-300 hover:text-white flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          <ChevronDown className="w-3 h-3" />
        </button>
        <button className="text-gray-300 hover:text-white">
          <Settings className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-2 ml-2 border-l border-gray-600 pl-4">
          <div className="text-right">
            <p className="text-white text-xs font-medium">MWT Supervisor</p>
            <p className="text-gray-400 text-xs">Carl, Mollie (she/her)</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
            MC
          </div>
        </div>
      </div>
    </header>
  )
}
