"use client"

import { ChevronDown } from "lucide-react"

export function MemberProfile() {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
            SM
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Spider Man</h1>
            <p className="text-sm text-gray-500">
              Male | 36 YO | DOB: 01/01/1990
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">Key Indicators:</span>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                Open to Contact
              </span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                BH Direct
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-8">
          <div className="text-right">
            <p className="text-xs text-gray-500">Customer Name</p>
            <p className="text-sm font-medium text-gray-900">ACCENTURE</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Home phone</p>
            <p className="text-sm font-medium text-gray-900">214-458-1212</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Subscriber ID</p>
            <p className="text-sm font-medium text-gray-900">362584321</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Coverage Types</p>
            <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
              Employee Assistance Program (EAP), Work Life
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
