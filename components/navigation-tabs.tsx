"use client"

import { useState } from "react"
import { ChevronLeft, X, ChevronDown, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Tab {
  id: string
  label: string
  closable?: boolean
}

const tabs: Tab[] = [
  { id: "member-summary", label: "Member Summary", closable: false },
  { id: "snapshot", label: "Spider's Snapshot", closable: true },
  { id: "engagement", label: "Engagement History", closable: true },
  { id: "medications", label: "Medications", closable: true },
  { id: "provider-search", label: "Provider Search", closable: true },
]

interface NavigationTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function NavigationTabs({ activeTab, setActiveTab }: NavigationTabsProps) {
  const [openTabs, setOpenTabs] = useState(tabs)
  const [actionsOpen, setActionsOpen] = useState(false)

  const closeTab = (tabId: string) => {
    setOpenTabs(openTabs.filter((tab) => tab.id !== tabId))
    if (activeTab === tabId) {
      setActiveTab("member-summary")
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1 text-blue-600 text-sm font-medium px-3 py-2 hover:bg-gray-50 rounded">
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {openTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {tab.label}
              {tab.closable && (
                <X
                  className="w-3 h-3 text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                Available Apps (4 Selected)
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>App 1</DropdownMenuItem>
              <DropdownMenuItem>App 2</DropdownMenuItem>
              <DropdownMenuItem>App 3</DropdownMenuItem>
              <DropdownMenuItem>App 4</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu open={actionsOpen} onOpenChange={setActionsOpen}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                Actions
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Ad Hoc Task</DropdownMenuItem>
              <DropdownMenuItem>Fulfillment Request</DropdownMenuItem>
              <DropdownMenuItem>MyHealthDirect</DropdownMenuItem>
              <DropdownMenuItem className="bg-blue-50 text-blue-600">
                Start Call Notes
              </DropdownMenuItem>
              <DropdownMenuItem>Start Assessment</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700">
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
