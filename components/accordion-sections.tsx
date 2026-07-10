"use client"

import { useState, Fragment } from "react"
import { ChevronDown, ChevronUp, FileText, X, Search, ArrowUpDown, Plus, MoreVertical } from "lucide-react"
import { CallNotesPanel } from "./call-notes-panel"
import { AuthorizationDetailsPanel } from "./authorization-details-panel"
import { cn } from "@/lib/utils"

interface Section {
  id: string
  title: string
  hasAction?: boolean
  actionLabel?: string
}

const sections: Section[] = [
  { id: "products", title: "Additional Products and Services" },
  { id: "assessment", title: "Assessment History" },
  { id: "authorization", title: "Authorization History" },
  { id: "benefits", title: "Benefits" },
  { id: "call-history", title: "Call History", hasAction: true, actionLabel: "Draft Note" },
  { id: "care-team", title: "Care Team" },
  { id: "claims", title: "Claims History" },
  { id: "contact", title: "Contact History" },
  { id: "ews", title: "EWS/WL Case View" },
  { id: "family", title: "Family Members" },
  { id: "referrals", title: "Referrals & Program History" },
  { id: "tasks", title: "Tasks (2)" },
  { id: "provider-search", title: "Provider Search and Referral" },
]

export function AccordionSections() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["authorization", "benefits", "referrals", "tasks", "contact", "call-history"])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  return (
    <div className="space-y-2">
      {sections.map((section) => (
        <AccordionItem
          key={section.id}
          section={section}
          isExpanded={expandedSections.includes(section.id)}
          onToggle={() => toggleSection(section.id)}
        />
      ))}
    </div>
  )
}

interface AccordionItemProps {
  section: Section
  isExpanded: boolean
  onToggle: () => void
}

function AccordionItem({ section, isExpanded, onToggle }: AccordionItemProps) {
  return (
    <div id={`section-${section.id}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden scroll-mt-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors",
              isExpanded
                ? "border-orange-500 text-orange-500"
                : "border-gray-300 text-gray-400"
            )}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          <span className="font-medium text-gray-900">{section.title}</span>
        </div>

        {section.hasAction && (
          <span
            className="text-blue-600 text-sm hover:underline"
            onClick={(e) => {
              e.stopPropagation()
              alert(`${section.actionLabel} clicked`)
            }}
          >
            {section.actionLabel}
          </span>
        )}

        {section.id === "family" && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation()
              alert("Close family members")
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation()
                alert("Close family members")
              }
            }}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100">
          {section.id === "authorization" ? (
            <AuthorizationHistoryContent />
          ) : section.id === "benefits" ? (
            <BenefitsContent />
          ) : section.id === "referrals" ? (
            <ReferralsContent />
          ) : section.id === "tasks" ? (
            <TasksContent />
          ) : section.id === "contact" ? (
            <ContactHistoryContent />
          ) : section.id === "call-history" ? (
            <CallHistoryContent />
          ) : (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              No data available for {section.title.toLowerCase()}.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface AuthDataRow {
  id: number
  type: string
  provider: string
  tin: string
  procedure: string
  effective: string
  approved: string
  utilized: string
  status: string
  account: string
  hasClaimsRemark: boolean
}

function AuthorizationHistoryContent() {
  const [activeTab, setActiveTab] = useState("BH")
  const [entriesPerPage, setEntriesPerPage] = useState("5")
  const [expandedRows, setExpandedRows] = useState<number[]>([1, 2, 3, 4])
  const [selectedRows, setSelectedRows] = useState<number[]>([1])
  const [selectedAuth, setSelectedAuth] = useState<AuthDataRow | null>(null)
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false)

  const openDetailsPanel = (row: AuthDataRow) => {
    setSelectedAuth(row)
    setIsDetailsPanelOpen(true)
  }

  const closeDetailsPanel = () => {
    setIsDetailsPanelOpen(false)
    setSelectedAuth(null)
  }

  const tabs = ["BH", "EWS", "ICUE"]
  const columns = [
    { key: "auth", label: "Auth#" },
    { key: "type", label: "Type" },
    { key: "provider", label: "Provider/Facility" },
    { key: "tin", label: "TIN" },
    { key: "procedure", label: "Procedure / Program" },
    { key: "effective", label: "Effective / Expiration" },
    { key: "approved", label: "Total Approved" },
    { key: "utilized", label: "Total Utilized" },
    { key: "status", label: "Request Status" },
    { key: "account", label: "Account Id/Name" },
  ]

  const authData = [
    {
      id: 1,
      type: "MH-A",
      provider: "Ridgeview Institute Monroe",
      tin: "",
      procedure: "MH Inpatient Ad...",
      effective: "03-29-2026 - 04-07-2026",
      approved: "10",
      utilized: "",
      status: "See Below",
      account: "",
      hasClaimsRemark: false,
    },
    {
      id: 2,
      type: "MH-A",
      provider: "Ridgeview Institute Monro...",
      tin: "",
      procedure: "MH Inpatient Ad...",
      effective: "04-04-2026 - 04-07-2026",
      approved: "4",
      utilized: "4",
      status: "",
      account: "",
      hasClaimsRemark: true,
    },
    {
      id: 3,
      type: "MH-A",
      provider: "Ridgeview Institute Monro...",
      tin: "",
      procedure: "MH Inpatient Ad...",
      effective: "04-01-2026 - 04-03-2026",
      approved: "3",
      utilized: "5",
      status: "",
      account: "",
      hasClaimsRemark: true,
    },
    {
      id: 4,
      type: "MH-A",
      provider: "Ridgeview Institute Monro...",
      tin: "",
      procedure: "MH Inpatient Ad...",
      effective: "03-29-2026 - 03-30-2026",
      approved: "3",
      utilized: "3",
      status: "",
      account: "",
      hasClaimsRemark: true,
    },
    {
      id: 5,
      type: "MH-N",
      provider: "",
      tin: "",
      procedure: "96130-Psycholog...",
      effective: "10-13-2025 - 10-13-2026",
      approved: "0",
      utilized: "8",
      status: "See Below",
      account: "",
      hasClaimsRemark: false,
    },
    {
      id: 6,
      type: "MH-N",
      provider: "",
      tin: "",
      procedure: "96136-Psycholog...",
      effective: "10-13-2025 - 10-13-2026",
      approved: "9",
      utilized: "9",
      status: "See Below",
      account: "",
      hasClaimsRemark: false,
    },
  ]

  const toggleRow = (id: number) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  const toggleSelect = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 text-sm rounded",
                activeTab === tab
                  ? "bg-gray-200 text-gray-900 font-medium"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-150"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="BH Auth Search"
            className="text-sm outline-none bg-transparent w-32"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-8 py-2"></th>
              <th className="w-8 py-2"></th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left py-2 px-2 font-medium text-gray-700 whitespace-nowrap"
                >
                  <button className="flex items-center gap-1 hover:text-gray-900">
                    {col.label}
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {authData.map((row) => (
              <Fragment key={row.id}>
                <tr 
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => openDetailsPanel(row)}
                >
                  <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleRow(row.id)}>
                      {expandedRows.includes(row.id) ? (
                        <ChevronUp className="w-4 h-4 text-blue-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleSelect(row.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="py-3 px-2 text-gray-600"></td>
                  <td className="py-3 px-2 text-gray-800">{row.type}</td>
                  <td className="py-3 px-2 text-gray-600">{row.provider}</td>
                  <td className="py-3 px-2 text-gray-600">{row.tin}</td>
                  <td className="py-3 px-2 text-gray-600">{row.procedure}</td>
                  <td className="py-3 px-2 text-gray-600 whitespace-nowrap">{row.effective}</td>
                  <td className="py-3 px-2 text-gray-600 text-center">{row.approved}</td>
                  <td className="py-3 px-2 text-gray-600 text-center">{row.utilized}</td>
                  <td className="py-3 px-2 text-gray-600">{row.status}</td>
                  <td className="py-3 px-2 text-gray-600">{row.account}</td>
                </tr>
                {expandedRows.includes(row.id) && row.hasClaimsRemark && (
                  <tr className="bg-gray-50">
                    <td colSpan={12} className="py-2 px-8">
                      <span className="text-gray-700 font-medium">Claims Remark:</span>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="flex items-center gap-2">
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
          </select>
          <span className="text-gray-600">Entries per page</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <button className="hover:text-gray-900">&lt;</button>
          <span>Page 1 of 2</span>
          <button className="hover:text-gray-900">&gt;</button>
        </div>
      </div>

      <AuthorizationDetailsPanel
        isOpen={isDetailsPanelOpen}
        onClose={closeDetailsPanel}
        authData={selectedAuth}
      />
    </div>
  )
}

function BenefitsContent() {
  const [activeTab, setActiveTab] = useState("EAP")
  const [detailsChecked, setDetailsChecked] = useState(false)
  const [eapChecked, setEapChecked] = useState(false)

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <select className="border border-blue-500 text-blue-600 rounded px-3 py-1.5 text-sm bg-white">
            <option>ACCENTURE - 09/01/2025 - 12/31/9999</option>
          </select>
        </div>
        <button className="border border-gray-300 rounded px-4 py-1.5 text-sm hover:bg-gray-50">
          Package Details
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={detailsChecked}
            onChange={(e) => setDetailsChecked(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm text-blue-600 underline">Details</span>
        </label>
        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">
          Member is Eligible
        </span>
      </div>

      <div className="grid grid-cols-3 gap-x-8 gap-y-3 mb-6 text-sm">
        <div>
          <span className="text-blue-600 font-medium">Member ID:</span>
          <span className="ml-2 text-gray-900">362564321</span>
        </div>
        <div>
          <span className="text-blue-600 font-medium">Funding Type:</span>
          <span className="ml-2 text-gray-900"></span>
        </div>
        <div>
          <span className="text-blue-600 font-medium">Policy Type:</span>
          <span className="ml-2 text-blue-600">Commercial</span>
        </div>
        <div>
          <span className="text-blue-600 font-medium">Group Number:</span>
          <span className="ml-2 text-blue-600 underline cursor-pointer hover:text-blue-800">15535</span>
        </div>
        <div>
          <span className="text-blue-600 font-medium">Coverage:</span>
          <span className="ml-2 text-gray-900">09/01/2025 - 12/31/9999</span>
        </div>
        <div>
          <span className="text-blue-600 font-medium">Market Tier:</span>
          <span className="ml-2 text-blue-600">BH Direct</span>
        </div>
        <div>
          <span className="text-blue-600 font-medium">Behavioral Product Package:</span>
          <span className="ml-2 text-gray-900"></span>
        </div>
      </div>

      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setActiveTab("EAP")}
          className={cn(
            "px-6 py-1.5 text-sm rounded",
            activeTab === "EAP"
              ? "bg-gray-700 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          )}
        >
          EAP
        </button>
        <button
          onClick={() => setActiveTab("WL")}
          className={cn(
            "px-6 py-1.5 text-sm rounded",
            activeTab === "WL"
              ? "bg-gray-700 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          )}
        >
          WL
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 text-blue-600 font-medium">Type</th>
            <th className="text-center py-2 text-blue-600 font-medium">Visit Limit</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eapChecked}
                  onChange={(e) => setEapChecked(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span>A&R EAP</span>
              </label>
            </td>
            <td className="py-2 text-center text-blue-600 underline cursor-pointer hover:text-blue-800">
              12 Visits
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function ReferralsContent() {
  const [entriesPerPage, setEntriesPerPage] = useState("5")

  const columns = [
    { key: "program", label: "Program" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
    { key: "statusReason", label: "Status Reason" },
    { key: "referredDate", label: "Referred Date" },
    { key: "referralId", label: "Referral ID/Source" },
    { key: "programEndDate", label: "Program End Date" },
    { key: "accountId", label: "Account ID/Name" },
    { key: "lastUpdated", label: "Last Updated" },
    { key: "lastUpdatedBy", label: "Last Updated By" },
    { key: "documents", label: "Documents" },
  ]

  return (
    <div className="p-4">
      <div className="flex items-center justify-end gap-4 mb-4">
        <button className="text-blue-600 text-sm hover:underline">
          View Additional Referral Details
        </button>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Create a New Referral
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left py-2 px-2 font-medium text-gray-700 whitespace-nowrap"
                >
                  <button className="flex items-center gap-1 hover:text-gray-900">
                    {col.label}
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-gray-500">
                No Results found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end mt-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <button className="hover:text-gray-900">&lt;</button>
          <span>Page 1 of 1</span>
          <button className="hover:text-gray-900">&gt;</button>
        </div>
      </div>
    </div>
  )
}

function TasksContent() {
  const [activeTab, setActiveTab] = useState("non-program")
  const [entriesPerPage, setEntriesPerPage] = useState("5")
  const [searchQuery, setSearchQuery] = useState("")

  const columns = [
    { key: "task", label: "Task" },
    { key: "subtask", label: "Subtask" },
    { key: "createdBy", label: "Created by" },
    { key: "status", label: "Status" },
    { key: "dueDate", label: "Due date" },
    { key: "attempt", label: "Attempt" },
    { key: "assignedTo", label: "Assigned to" },
    { key: "lastUpdatedOn", label: "Last updated on" },
    { key: "customerName", label: "Customer Name" },
    { key: "taskType", label: "Task Type" },
    { key: "action", label: "Action" },
  ]

  const tasks = [
    {
      id: 1,
      task: "Behavioral Health Benefit",
      subtask: "Claims - Complex Claim Support",
      createdBy: "Kimberly Chance",
      status: "Completed",
      statusColor: "green",
      dueDate: "03/20/2026 12:00 pm EDT",
      attempt: "1",
      assignedTo: ["Provider Search", "Kimberly Chance"],
      lastUpdatedOn: "03/17/2026 3:32 pm EDT",
      customerName: "",
      taskType: "Non-Program",
    },
    {
      id: 2,
      task: "Behavioral Health Benefit",
      subtask: "Provider Search",
      createdBy: "Ryann Check",
      status: "Not Started",
      statusColor: "yellow",
      dueDate: "02/22/2026 1:00 pm EDT",
      attempt: "1",
      assignedTo: ["Research Advisor"],
      lastUpdatedOn: "02/19/2026 12:51 pm EDT",
      customerName: "",
      taskType: "Non-Program",
    },
    {
      id: 3,
      task: "Outreach",
      subtask: "Urgent",
      createdBy: "Mollie Carl",
      status: "Completed",
      statusColor: "green",
      dueDate: "02/13/2026 1:48 pm EDT",
      attempt: "1",
      assignedTo: ["Outreach - MWT", "Mollie Carl"],
      lastUpdatedOn: "02/12/2026 1:49 pm EDT",
      customerName: "",
      taskType: "Non-Program",
    },
    {
      id: 4,
      task: "Outreach",
      subtask: "Urgent",
      createdBy: "Mollie Carl",
      status: "Completed",
      statusColor: "green",
      dueDate: "02/10/2026 1:34 pm EDT",
      attempt: "1",
      assignedTo: ["Outreach - MWT", "Mollie Carl"],
      lastUpdatedOn: "02/09/2026 1:39 pm EDT",
      customerName: "",
      taskType: "Non-Program",
    },
    {
      id: 5,
      task: "Follow up",
      subtask: "Case Staffing",
      createdBy: "Mollie Carl",
      status: "Completed",
      statusColor: "green",
      dueDate: "02/09/2026 12:00 pm EDT",
      attempt: "1",
      assignedTo: ["Clinical Wellbeing Specialist", "Mollie Carl"],
      lastUpdatedOn: "02/09/2026 1:37 pm EDT",
      customerName: "",
      taskType: "Non-Program",
    },
  ]

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("program")}
            className={cn(
              "px-3 py-1.5 text-sm rounded flex items-center gap-2",
              activeTab === "program"
                ? "bg-gray-200 text-gray-900 font-medium"
                : "bg-gray-100 text-gray-600 hover:bg-gray-150"
            )}
          >
            Program tasks
            <span className="bg-gray-300 text-gray-700 text-xs px-1.5 py-0.5 rounded-full">0</span>
          </button>
          <button
            onClick={() => setActiveTab("non-program")}
            className={cn(
              "px-3 py-1.5 text-sm rounded flex items-center gap-2",
              activeTab === "non-program"
                ? "bg-gray-200 text-gray-900 font-medium"
                : "bg-gray-100 text-gray-600 hover:bg-gray-150"
            )}
          >
            Non-program tasks
            <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">2</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">Total 8 records | Showing 5records</span>
        <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm outline-none bg-transparent w-32"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-8 py-2"></th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left py-2 px-2 font-medium text-gray-700 whitespace-nowrap"
                >
                  {col.key !== "action" ? (
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      {col.label}
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-2">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </td>
                <td className="py-3 px-2 text-blue-600">{task.task}</td>
                <td className="py-3 px-2 text-gray-600">{task.subtask}</td>
                <td className="py-3 px-2">
                  <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                    {task.createdBy}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        task.statusColor === "green" ? "bg-green-500" : "bg-yellow-500"
                      )}
                    />
                    <span className={task.statusColor === "green" ? "text-green-700" : "text-yellow-700"}>
                      {task.status}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 text-gray-600 whitespace-nowrap">{task.dueDate}</td>
                <td className="py-3 px-2 text-gray-600 text-center">{task.attempt}</td>
                <td className="py-3 px-2">
                  <div className="flex flex-col">
                    {task.assignedTo.map((name, idx) => (
                      <span
                        key={idx}
                        className={idx === 0 ? "text-blue-600" : "text-blue-600 underline cursor-pointer hover:text-blue-800"}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-2 text-gray-600 whitespace-nowrap">{task.lastUpdatedOn}</td>
                <td className="py-3 px-2 text-gray-600">{task.customerName}</td>
                <td className="py-3 px-2 text-gray-600">{task.taskType}</td>
                <td className="py-3 px-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="flex items-center gap-2">
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
          </select>
          <span className="text-gray-600">Entries per page</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <button className="hover:text-gray-900">&lt;</button>
          <span>Page 1 of 1</span>
          <button className="hover:text-gray-900">&gt;</button>
        </div>
      </div>
    </div>
  )
}

interface CallHistoryItem {
  id: number
  method: string
  dateTime: string
  agent: string
  primaryReason: string
  outcome: string
  contact: string
  caseNumber: string
  status: string
  accountNameId: string
  topics: string
  topicsLink: boolean
}

function CallHistoryContent() {
  const [activeTab, setActiveTab] = useState("all")
  const [entriesPerPage, setEntriesPerPage] = useState("5")
  const [selectedCall, setSelectedCall] = useState<CallHistoryItem | null>(null)
  const [isNotesPanelOpen, setIsNotesPanelOpen] = useState(false)

  const openNotesPanel = (call: CallHistoryItem) => {
    setSelectedCall(call)
    setIsNotesPanelOpen(true)
  }

  const closeNotesPanel = () => {
    setIsNotesPanelOpen(false)
    setSelectedCall(null)
  }

  const tabs = [
    { id: "high-priority", label: "High Priority Notes" },
    { id: "all", label: "All Notes" },
    { id: "agent", label: "Agent Notes" },
  ]

  const columns = [
    { key: "flag", label: "Flag", sortable: false },
    { key: "method", label: "Method", sortable: true },
    { key: "dateTime", label: "Date/Time", sortable: true },
    { key: "agent", label: "Agent", sortable: true },
    { key: "primaryReason", label: "Primary Reason", sortable: true },
    { key: "outcome", label: "Outcome", sortable: true },
    { key: "contact", label: "Contact", sortable: true },
    { key: "caseNumber", label: "Case#", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "accountNameId", label: "Account Name/Id", sortable: true },
    { key: "topics", label: "Topics", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
  ]

  const callHistory = [
    {
      id: 1,
      method: "Inbound",
      dateTime: "04/03/2026\n8:31 am EDT",
      agent: "Unknown",
      primaryReason: "",
      outcome: "Received",
      contact: "",
      caseNumber: "",
      status: "Completed",
      accountNameId: "",
      topics: "Notes",
      topicsLink: true,
    },
    {
      id: 2,
      method: "Inbound",
      dateTime: "04/02/2026\n12:57 pm EDT",
      agent: "Unknown",
      primaryReason: "",
      outcome: "Received",
      contact: "",
      caseNumber: "",
      status: "Completed",
      accountNameId: "",
      topics: "Notes",
      topicsLink: true,
    },
    {
      id: 3,
      method: "Inbound",
      dateTime: "04/02/2026\n12:56 pm EDT",
      agent: "Unknown",
      primaryReason: "",
      outcome: "Received",
      contact: "",
      caseNumber: "",
      status: "Completed",
      accountNameId: "",
      topics: "Notes",
      topicsLink: true,
    },
    {
      id: 4,
      method: "Outbound",
      dateTime: "04/01/2026\n6:50 pm EDT",
      agent: "Unknown",
      primaryReason: "Member Outbound Call",
      outcome: "Follow-Up Call",
      contact: "",
      caseNumber: "",
      status: "Completed",
      accountNameId: "",
      topics: "Risk: None",
      topicsLink: true,
    },
    {
      id: 5,
      method: "Inbound",
      dateTime: "04/14/2025\n8:20 am EDT",
      agent: "Unknown",
      primaryReason: "",
      outcome: "Received",
      contact: "",
      caseNumber: "",
      status: "Completed",
      accountNameId: "",
      topics: "Notes",
      topicsLink: true,
    },
  ]

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1.5 text-sm rounded",
                activeTab === tab.id
                  ? "bg-gray-200 text-gray-900 font-medium"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-150"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button className="text-blue-600 text-sm hover:underline">
          Draft Note
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left py-2 px-2 font-medium text-gray-700 whitespace-nowrap"
                >
                  {col.sortable ? (
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      {col.label}
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {callHistory.map((call) => (
              <tr key={call.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-2"></td>
                <td className="py-3 px-2 text-gray-800">{call.method}</td>
                <td className="py-3 px-2 text-gray-600 whitespace-pre-line">{call.dateTime}</td>
                <td className="py-3 px-2 text-gray-600">{call.agent}</td>
                <td className="py-3 px-2 text-gray-600">{call.primaryReason}</td>
                <td className="py-3 px-2 text-gray-600">{call.outcome}</td>
                <td className="py-3 px-2 text-gray-600">{call.contact}</td>
                <td className="py-3 px-2 text-gray-600">{call.caseNumber}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-green-700">{call.status}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-gray-600">{call.accountNameId}</td>
                <td className="py-3 px-2">
                  {call.topicsLink ? (
                    <span 
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() => openNotesPanel(call)}
                    >
                      {call.topics}
                    </span>
                  ) : (
                    call.topics
                  )}
                </td>
                <td className="py-3 px-2"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="flex items-center gap-2">
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
          </select>
          <span className="text-gray-600">Entries per page</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <button className="hover:text-gray-900">&lt;</button>
          <span>Page 1 of 2</span>
          <button className="hover:text-gray-900">&gt;</button>
        </div>
      </div>

      <CallNotesPanel
        isOpen={isNotesPanelOpen}
        onClose={closeNotesPanel}
        callData={selectedCall}
      />
    </div>
  )
}


function ContactHistoryContent() {
  const [entriesPerPage, setEntriesPerPage] = useState("5")

  const columns = [
    { key: "task", label: "Task" },
    { key: "status", label: "Status" },
    { key: "reason", label: "Reason" },
    { key: "lastUpdated", label: "Last Updated Date/Time" },
    { key: "updatedBy", label: "Updated By" },
    { key: "program", label: "Program" },
    { key: "accountId", label: "Account ID / Name" },
  ]

  const contactHistory = [
    {
      id: 1,
      task: "Program Agreement Assessment",
      status: "Rescheduled",
      statusColor: "blue",
      reason: "Other",
      lastUpdated: "04/01/2026, 07:01 PM",
      updatedBy: "",
      program: "BH Navigation - Transitional Case Management",
      accountId: "",
    },
    {
      id: 2,
      task: "Program Agreement Assessment",
      status: "Closed",
      statusColor: "gray",
      reason: "Unable to Reach",
      lastUpdated: "04/12/2025, 10:50 AM",
      updatedBy: "",
      program: "Behavioral Health - Youth Transitional Case Mgmt",
      accountId: "",
    },
    {
      id: 3,
      task: "UTBR-Program Agreement Assessment",
      status: "Completed",
      statusColor: "green",
      reason: "",
      lastUpdated: "03/07/2025, 12:29 AM",
      updatedBy: "",
      program: "Behavioral Health - Youth Transitional Case Mgmt",
      accountId: "",
    },
    {
      id: 4,
      task: "Behavioral Health Care Summary",
      status: "Completed",
      statusColor: "green",
      reason: "",
      lastUpdated: "03/29/2026, 08:15 AM",
      updatedBy: "",
      program: "Behavioral Health - Youth Transitional Case Mgmt",
      accountId: "",
    },
  ]

  const getStatusBadgeClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-700 border-blue-300"
      case "green":
        return "bg-green-100 text-green-700 border-green-300"
      case "gray":
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-8 py-2"></th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left py-2 px-2 font-medium text-gray-700 whitespace-nowrap"
                >
                  {col.key === "lastUpdated" ? (
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      {col.label}
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contactHistory.map((contact) => (
              <tr key={contact.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-2">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </td>
                <td className="py-3 px-2 text-gray-800">{contact.task}</td>
                <td className="py-3 px-2">
                  <span className={cn(
                    "px-2 py-0.5 text-xs rounded border",
                    getStatusBadgeClasses(contact.statusColor)
                  )}>
                    {contact.status}
                  </span>
                </td>
                <td className="py-3 px-2 text-gray-600">{contact.reason}</td>
                <td className="py-3 px-2 text-gray-600 whitespace-nowrap">{contact.lastUpdated}</td>
                <td className="py-3 px-2 text-gray-600">{contact.updatedBy}</td>
                <td className="py-3 px-2 text-gray-600">{contact.program}</td>
                <td className="py-3 px-2 text-gray-600">{contact.accountId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="flex items-center gap-2">
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
          </select>
          <span className="text-gray-600">Entries per page</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <button className="hover:text-gray-900">&lt;</button>
          <span>Page 1 of 1</span>
          <button className="hover:text-gray-900">&gt;</button>
        </div>
      </div>
    </div>
  )
}
