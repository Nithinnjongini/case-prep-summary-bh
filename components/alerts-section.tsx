"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const alertTabs = [
  { id: "alerts", label: "Alerts", count: 1 },
  { id: "agent-alerts", label: "Agent-Entered Member Alerts" },
  { id: "clinical-flags", label: "Clinical Model Flags" },
  { id: "key-indicators", label: "Key Indicators" },
]

const filterOptions = ["All", "Open", "Expired"]

export function AlertsSection() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeAlertTab, setActiveAlertTab] = useState("alerts")
  const [activeFilter, setActiveFilter] = useState("All")

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50"
      >
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors",
            isExpanded
              ? "border-orange-500 bg-orange-500 text-white"
              : "border-gray-300 text-gray-400"
          )}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
        <span className="font-medium text-gray-900">Alerts</span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-4 border-b border-gray-200 mb-4">
            {alertTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAlertTab(tab.id)}
                className={cn(
                  "flex items-center gap-1 px-2 py-2 text-sm border-b-2 -mb-px transition-colors",
                  activeAlertTab === tab.id
                    ? "border-blue-600 text-blue-600 font-medium"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                )}
              >
                {tab.label}
                {tab.count && (
                  <span className="ml-1 px-1.5 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeAlertTab === "alerts" && (
            <AlertsTabContent />
          )}

          {activeAlertTab === "agent-alerts" && (
            <AgentAlertsTabContent activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          )}

          {activeAlertTab === "clinical-flags" && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No clinical model flags to display.
            </div>
          )}

          {activeAlertTab === "key-indicators" && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No key indicators to display.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AlertsTabContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-800">Instructional Alerts</span>
        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-700">
          Click To View
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-1">Account Alerts</h4>
        <p className="text-sm text-gray-500">No Account Alerts for this member</p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-1">Member Alerts</h4>
        <p className="text-sm text-gray-500">No Account Alerts for this member</p>
      </div>
    </div>
  )
}

function AgentAlertsTabContent({ 
  activeFilter, 
  setActiveFilter 
}: { 
  activeFilter: string
  setActiveFilter: (filter: string) => void 
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">
            Agent-Entered Member Alerts
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Alert
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-4">
        {filterOptions.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-3 py-1 text-sm rounded-full transition-colors",
              activeFilter === filter
                ? "bg-gray-200 text-gray-900 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="text-center py-8 text-gray-500 text-sm">
        No records to display.
      </div>
    </>
  )
}
