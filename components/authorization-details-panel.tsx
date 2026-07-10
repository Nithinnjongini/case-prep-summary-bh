"use client"

import { useState } from "react"
import { X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuthorizationData {
  id: number
  type: string
  provider: string
  procedure: string
  effective: string
  approved: string
  utilized: string
  status: string
}

interface AuthorizationDetailsPanelProps {
  isOpen: boolean
  onClose: () => void
  authData: AuthorizationData | null
}

export function AuthorizationDetailsPanel({
  isOpen,
  onClose,
  authData,
}: AuthorizationDetailsPanelProps) {
  const [formData, setFormData] = useState({
    mhAuthorized: true,
    mhFeeIncluded: false,
    attending: "",
    rateRemarks: "",
    requestDate: "04/03/2026",
    requestTime: "12",
    requestTimeMinutes: "50",
    requestTimePeriod: "PM",
    requestedBy: "Provider",
    umProcess: "STAT Concurrent Review",
    determinationDate: "04/03/2026",
    determinationTime: "01",
    determinationTimeMinutes: "50",
    determinationTimePeriod: "PM",
    linkedMedicareAuth: "No",
    medicare: "",
    reviewType: "Urgent Concurrent",
    authUnits: "4",
    expectedUnits: "9",
    instructions: "Standard",
    effectiveDate: "04/04/2026",
    expirationDate: "04/07/2026",
    ambulance: false,
    disclaimer: false,
    alertRelated: false,
    ect: true,
    authStatusChange: "",
    authStatusChangeReason: "",
    authStatusChangeDate: "01/01/1900",
  })

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header with close button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Dx Code Table */}
          <div className="mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 font-medium text-gray-700">Dx Code</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-700">Dx Description</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-400 text-sm">
                    No diagnosis codes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Rate Information & Rate Remarks */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Information</h3>
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={formData.mhAuthorized}
                    onChange={(e) => setFormData({ ...formData, mhAuthorized: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  MH Authorized
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={formData.mhFeeIncluded}
                    onChange={(e) => setFormData({ ...formData, mhFeeIncluded: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  MH Fee Included
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Attending</label>
                <div className="relative">
                  <select
                    value={formData.attending}
                    onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm appearance-none bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="dr1">Dr. Smith</option>
                    <option value="dr2">Dr. Johnson</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Remarks</h3>
              <textarea
                value={formData.rateRemarks}
                onChange={(e) => setFormData({ ...formData, rateRemarks: e.target.value })}
                className="w-full h-32 border border-gray-300 rounded px-3 py-2 text-sm resize-none"
                placeholder="Enter remarks..."
              />
            </div>
          </div>

          {/* Authorization Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Authorization</h3>
            
            {/* Row 1: Request Date, Time, Requested By, UM Process */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Request Date</label>
                <input
                  type="text"
                  value={formData.requestDate}
                  onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Time</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={formData.requestTime}
                    onChange={(e) => setFormData({ ...formData, requestTime: e.target.value })}
                    className="w-12 border border-gray-300 rounded px-2 py-2 text-sm text-center"
                  />
                  <input
                    type="text"
                    value={formData.requestTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, requestTimeMinutes: e.target.value })}
                    className="w-12 border border-gray-300 rounded px-2 py-2 text-sm text-center"
                  />
                  <select
                    value={formData.requestTimePeriod}
                    onChange={(e) => setFormData({ ...formData, requestTimePeriod: e.target.value })}
                    className="border border-gray-300 rounded px-2 py-2 text-sm"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Requested By</label>
                <input
                  type="text"
                  value={formData.requestedBy}
                  onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">UM Process</label>
                <input
                  type="text"
                  value={formData.umProcess}
                  onChange={(e) => setFormData({ ...formData, umProcess: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Row 2: Determination Date, Time, Linked Medicare Auth, Medicare */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Determination Date</label>
                <input
                  type="text"
                  value={formData.determinationDate}
                  onChange={(e) => setFormData({ ...formData, determinationDate: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Time</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={formData.determinationTime}
                    onChange={(e) => setFormData({ ...formData, determinationTime: e.target.value })}
                    className="w-12 border border-gray-300 rounded px-2 py-2 text-sm text-center"
                  />
                  <input
                    type="text"
                    value={formData.determinationTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, determinationTimeMinutes: e.target.value })}
                    className="w-12 border border-gray-300 rounded px-2 py-2 text-sm text-center"
                  />
                  <select
                    value={formData.determinationTimePeriod}
                    onChange={(e) => setFormData({ ...formData, determinationTimePeriod: e.target.value })}
                    className="border border-gray-300 rounded px-2 py-2 text-sm"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Linked Medicare Auth</label>
                <input
                  type="text"
                  value={formData.linkedMedicareAuth}
                  onChange={(e) => setFormData({ ...formData, linkedMedicareAuth: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Medicare</label>
                <input
                  type="text"
                  value={formData.medicare}
                  onChange={(e) => setFormData({ ...formData, medicare: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Row 3: Review Type, Auth Units, Expected Units, Instructions */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Review Type</label>
                <input
                  type="text"
                  value={formData.reviewType}
                  onChange={(e) => setFormData({ ...formData, reviewType: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Auth Units</label>
                <input
                  type="text"
                  value={formData.authUnits}
                  onChange={(e) => setFormData({ ...formData, authUnits: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Expected Units</label>
                <input
                  type="text"
                  value={formData.expectedUnits}
                  onChange={(e) => setFormData({ ...formData, expectedUnits: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Instructions</label>
                <input
                  type="text"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Row 4: Effective, Expiration, Checkboxes */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Effective</label>
                <input
                  type="text"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Expiration</label>
                <input
                  type="text"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="col-span-2">
                <div className="grid grid-cols-2 gap-2 mt-6">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={formData.ambulance}
                      onChange={(e) => setFormData({ ...formData, ambulance: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    Ambulance
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={formData.disclaimer}
                      onChange={(e) => setFormData({ ...formData, disclaimer: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    Disclaimer
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={formData.ect}
                      onChange={(e) => setFormData({ ...formData, ect: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    ECT
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={formData.alertRelated}
                      onChange={(e) => setFormData({ ...formData, alertRelated: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    Alert Related
                  </label>
                </div>
              </div>
            </div>

            {/* Row 5: Auth Status Change fields */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Auth Status Change</label>
                <input
                  type="text"
                  value={formData.authStatusChange}
                  onChange={(e) => setFormData({ ...formData, authStatusChange: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Auth Status Change Reason</label>
                <input
                  type="text"
                  value={formData.authStatusChangeReason}
                  onChange={(e) => setFormData({ ...formData, authStatusChangeReason: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Auth Status Change Date</label>
                <input
                  type="text"
                  value={formData.authStatusChangeDate}
                  onChange={(e) => setFormData({ ...formData, authStatusChangeDate: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
