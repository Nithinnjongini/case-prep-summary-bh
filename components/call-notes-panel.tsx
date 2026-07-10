"use client"

import { useState } from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface CallNote {
  id: number
  method: string
  dateTime: string
  agent: string
  primaryReason: string
  outcome: string
}

interface CallNotesPanelProps {
  isOpen: boolean
  onClose: () => void
  callData: CallNote | null
}

export function CallNotesPanel({ isOpen, onClose, callData }: CallNotesPanelProps) {
  const [isAdditionalInfoExpanded, setIsAdditionalInfoExpanded] = useState(true)
  const [caseNotes, setCaseNotes] = useState("")
  const [callReasons, setCallReasons] = useState<string[]>(
    callData?.primaryReason ? [callData.primaryReason] : ["Member Outbound Call"]
  )
  const [callOutcomes, setCallOutcomes] = useState<string[]>(
    callData?.outcome ? [callData.outcome] : ["Follow-Up Call"]
  )

  const removeCallReason = (reason: string) => {
    setCallReasons(callReasons.filter((r) => r !== reason))
  }

  const removeCallOutcome = (outcome: string) => {
    setCallOutcomes(callOutcomes.filter((o) => o !== outcome))
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[500px] bg-white shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">Call Notes</h2>
              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                Finalized
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Member Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Member</label>
              <p className="text-sm text-gray-600 mt-1">-</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Subscriber ID:</label>
              <p className="text-sm text-gray-600 mt-1">-</p>
            </div>
          </div>

          {/* Agent Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Agent</label>
              <p className="text-sm text-gray-600 mt-1">-</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Note Created:</label>
              <p className="text-sm text-blue-600 mt-1">04/01/2026 6:50 PM EDT</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700">MSD</label>
              <p className="text-sm text-gray-600 mt-1">-</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Note Completed:</label>
              <p className="text-sm text-gray-900 font-medium mt-1">04/01/2026 7:00 PM EDT</p>
            </div>
          </div>

          {/* EAP Related Toggle */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-gray-100 rounded text-sm text-gray-600">
                EAP
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded"></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">related</p>
          </div>

          {/* Additional Information */}
          <div className="border border-gray-200 rounded-lg mb-6">
            <button
              onClick={() => setIsAdditionalInfoExpanded(!isAdditionalInfoExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900">Additional Information</span>
              {isAdditionalInfoExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {isAdditionalInfoExpanded && (
              <div className="px-4 pb-4">
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Case Notes
                    <span className="text-blue-600 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 mb-2">
                    Please include any other additional notes you wish to have saved on this record.
                  </p>
                  <textarea
                    value={caseNotes}
                    onChange={(e) => setCaseNotes(e.target.value)}
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder=""
                  />
                </div>

                {/* Call Reasons */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    Call Reasons <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {callReasons.map((reason) => (
                      <div
                        key={reason}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded text-sm"
                      >
                        {reason}
                        <button
                          onClick={() => removeCallReason(reason)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button className="flex items-center gap-1 px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Call Outcomes */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    Call Outcomes <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {callOutcomes.map((outcome) => (
                      <div
                        key={outcome}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded text-sm"
                      >
                        {outcome}
                        <button
                          onClick={() => removeCallOutcome(outcome)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button className="flex items-center gap-1 px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
              Complete Note
            </button>
            <button className="text-sm text-blue-600 hover:underline">
              Save as draft
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
