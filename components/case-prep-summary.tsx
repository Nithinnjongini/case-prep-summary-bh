"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle, Phone, FileText, Calendar, User, Activity, Link2, Search, X, PhoneIncoming, PhoneOutgoing, Clock, CheckCircle, AlertTriangle, ChevronDown as ChevronDownIcon, Database, Building2, Heart, Pill, FileStack, Sparkles, ExternalLink, LayoutGrid, MessageSquare, FolderOpen, ListTodo, GripVertical, ArrowUpRight, Home, Users, Car, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

// Helper function to scroll to a section and expand it
function scrollToSection(sectionId: string) {
  const element = document.getElementById(`section-${sectionId}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // Trigger click on the accordion header to expand it if collapsed
    const button = element.querySelector('button')
    if (button) {
      // Small delay to ensure scroll completes first
      setTimeout(() => {
        const isExpanded = element.querySelector('[class*="border-orange"]')
        if (!isExpanded) {
          button.click()
        }
      }, 300)
    }
  }
}

// Helper component for At-a-glance fields
function AtAGlanceField({ 
  label, 
  value, 
  highlight = false,
  actionLabel,
  actionSection
}: { 
  label: string
  value: string | null | undefined
  highlight?: boolean
  actionLabel?: string
  actionSection?: string
}) {
  return (
    <div className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
        {actionLabel && actionSection && value && (
          <button
            onClick={() => scrollToSection(actionSection)}
            className="flex items-center gap-0.5 text-[10px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {actionLabel}
            <ArrowUpRight className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
      {value ? (
        <p className={cn(
          "text-[13px] leading-relaxed",
          highlight ? "text-amber-700 font-semibold" : "text-slate-900 font-medium"
        )}>
          {value}
        </p>
      ) : (
        <span className="text-[13px] text-slate-400 italic">Not available</span>
      )}
    </div>
  )
}

interface Interaction {
  id: string
  interactionId: string
  dateTime: string
  type: "Inbound" | "Outbound"
  department: string
  isMWT: boolean
  summary: string
  status: "resolved" | "pending" | "escalated"
  notePreview: string
  agent: string
}

type TabType = "summary" | "interactions" | "documents" | "actions"

const MIN_WIDTH = 280
const MAX_WIDTH = 600
const DEFAULT_WIDTH = 320

export function CasePrepSummary() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [callDirection, setCallDirection] = useState<"inbound" | "outbound">("inbound")
  const [activeTab, setActiveTab] = useState<TabType>("summary")
  const [mwtOnly, setMwtOnly] = useState(false)
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null)
  const [expandedEnrichments, setExpandedEnrichments] = useState<string[]>([])
  const [expandedDocuments, setExpandedDocuments] = useState<string[]>([])
  const [sdohExpanded, setSdohExpanded] = useState(false)
  
  // Resize state
  const [panelWidth, setPanelWidth] = useState(DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return
    
    // Calculate new width based on mouse position from right edge of viewport
    const newWidth = window.innerWidth - e.clientX
    
    // Clamp the width between min and max
    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      setPanelWidth(newWidth)
    }
  }, [isResizing])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  // Add and remove event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  const toggleEnrichment = (id: string) => {
    setExpandedEnrichments(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const toggleDocument = (id: string) => {
    setExpandedDocuments(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "summary", label: "Summary", icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { id: "interactions", label: "Interactions", icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: "documents", label: "Documents", icon: <FolderOpen className="w-3.5 h-3.5" /> },
    { id: "actions", label: "Actions", icon: <ListTodo className="w-3.5 h-3.5" /> },
  ]

  const summaryData = {
    memberName: "Spider Man",
    memberId: "362584321",
    lastContact: "04/03/2026",
    openAlerts: 1,
    pendingTasks: 2,
    recentAuthorizations: 3,
    activeReferrals: 2,
    ongoingProviderSearch: 1,
    keyNotes: [
      "BH Navigation - Transitional Case Management active",
      "Youth Transitional Case Mgmt program enrolled",
      "Recent inpatient authorization at Ridgeview Institute",
    ],
    upcomingActions: [
      { type: "Follow-up call", date: "04/10/2026", priority: "high" },
      { type: "Program Agreement Assessment", date: "04/15/2026", priority: "medium" },
    ],
    sdoh: {
      available: true,
      summaryLine: "Transportation challenges noted; family support present",
      lastUpdated: "Based on care notes from 03/30/2026",
      details: {
        livingSituation: "Lives with family (parents) in stable housing",
        supportSystem: "Strong family support; parents actively involved in care coordination",
        transportationBarriers: "Limited access to personal vehicle; relies on family for transportation to appointments",
        financialConstraints: "Occasional financial stress reported; employed part-time",
        otherFactors: "Prefers evening appointments due to work schedule"
      }
    }
  }

  const atAGlanceData = {
    inbound: {
      primaryBHDiagnosis: "Major Depressive Disorder, Recurrent",
      lastMemberCall: "04/03/2026 at 8:31 AM EDT",
      lastCallConcern: "Medication refill coordination; reported improved mood stability",
      mwtSupportHistory: "2 interactions (03/15/2026, 02/28/2026)",
      hospitalizations: {
        count: 1,
        mostRecentFacility: "Ridgeview Institute Monroe",
        mostRecentDate: "03/29/2026"
      },
      outpatientClaims: {
        count: 8,
        topCategory: "Behavioral Health services",
        lastClaimDate: "04/01/2026",
        lastProvider: {
          name: "Atlanta Behavioral Health",
          phone: "(770) 555-0142"
        }
      },
      pharmacyClaims: {
        filled: 4,
        nonFilled: 1,
        lastFillDate: "04/03/2026",
        pharmacy: {
          name: "CVS Pharmacy #4521",
          phone: "(770) 555-0198"
        }
      }
    },
    outbound: {
      primaryBHDiagnosis: "Major Depressive Disorder, Recurrent",
      hospitalizations: {
        count: 1,
        erVisits: 0,
        mostRecentFacility: "Ridgeview Institute Monroe",
        mostRecentDate: "03/29/2026"
      },
      outpatientClaims: {
        count: 8,
        topCategory: "Behavioral Health services",
        trend: "trending up from Q1",
        lastClaimDate: "04/01/2026",
        lastProvider: {
          name: "Atlanta Behavioral Health",
          phone: "(770) 555-0142"
        }
      },
      mwtSupportHistory: "4 MWT interactions in last 90 days",
      pharmacyClaims: {
        filled: 4,
        nonFilled: 1,
        lastFillDate: "04/03/2026",
        pharmacy: {
          name: "CVS Pharmacy #4521",
          phone: "(770) 555-0198"
        }
      },
      careGaps: [
        { gap: "Annual wellness visit", status: "overdue", priority: "high" },
        { gap: "Depression screening (PHQ-9)", status: "due in 14 days", priority: "medium" }
      ],
      readinessForOutreach: "High - Recent engagement, stable condition post-discharge",
      lastSuccessfulContact: "04/01/2026 - Member responsive",
      preferredContactTime: "Evenings after 5 PM"
    }
  }

  const recentInteractions: Interaction[] = [
    {
      id: "1",
      interactionId: "I78432",
      dateTime: "04/03/2026 8:31 AM",
      type: "Inbound",
      department: "BH Navigation",
      isMWT: true,
      summary: "Medication refill coordination - member reported improved mood",
      status: "resolved",
      notePreview: "Member called to coordinate medication refill for Sertraline. Reports improved mood stability over the past 2 weeks. No side effects reported. Refill processed and sent to pharmacy. Member confirmed they will pick up today.",
      agent: "Kimberly Chance"
    },
    {
      id: "2",
      interactionId: "I78401",
      dateTime: "04/02/2026 12:57 PM",
      type: "Inbound",
      department: "Care Management",
      isMWT: false,
      summary: "Benefits inquiry - coverage question for therapy sessions",
      status: "resolved",
      notePreview: "Member inquired about coverage for outpatient therapy sessions. Confirmed 20 sessions covered per year with $25 copay. Member has used 8 sessions YTD. Provided list of in-network providers in their area.",
      agent: "Ryann Check"
    },
    {
      id: "3",
      interactionId: "I78356",
      dateTime: "04/01/2026 6:50 PM",
      type: "Outbound",
      department: "MWT Outreach",
      isMWT: true,
      summary: "Follow-up on recent hospitalization - confirmed appointment",
      status: "resolved",
      notePreview: "Reached member for post-discharge follow-up after Ridgeview Institute stay. Member confirmed follow-up appointment scheduled for 04/05/2026 with Dr. Martinez. Discussed medication adherence and warning signs. Member reports feeling supported.",
      agent: "Mollie Carl"
    },
    {
      id: "4",
      interactionId: "I78298",
      dateTime: "03/29/2026 2:15 PM",
      type: "Inbound",
      department: "Crisis Line",
      isMWT: true,
      summary: "Crisis support - arranged inpatient admission",
      status: "escalated",
      notePreview: "Member called reporting acute symptoms. Safety assessment completed. Coordinated with Ridgeview Institute Monroe for voluntary admission. Member transported by family. Authorization submitted for MH Inpatient services.",
      agent: "Clinical Wellbeing Specialist"
    },
    {
      id: "5",
      interactionId: "I78145",
      dateTime: "03/15/2026 10:20 AM",
      type: "Inbound",
      department: "BH Navigation",
      isMWT: true,
      summary: "In-the-moment support - anxiety management techniques",
      status: "resolved",
      notePreview: "Member called experiencing elevated anxiety. Provided grounding techniques and breathing exercises. Discussed triggers and coping strategies. Member declined crisis services, stated they felt better after call. Scheduled follow-up for 03/22.",
      agent: "Kimberly Chance"
    },
    {
      id: "6",
      interactionId: "I78012",
      dateTime: "02/28/2026 3:45 PM",
      type: "Outbound",
      department: "MWT Outreach",
      isMWT: true,
      summary: "Wellness check - provider search assistance",
      status: "pending",
      notePreview: "Reached out for routine wellness check. Member expressed interest in finding a new psychiatrist closer to home. Initiated provider search. Pending callback with options. Member stable, no immediate concerns.",
      agent: "Mollie Carl"
    }
  ]

  const filteredInteractions = mwtOnly 
    ? recentInteractions.filter(i => i.isMWT) 
    : recentInteractions

  const documentsData = [
    {
      id: "doc1",
      docId: "A37676787",
      type: "Discharge Summary",
      source: "Ridgeview Institute Monroe",
      date: "03/30/2026",
      aiSummary: "Patient discharged after 2-day voluntary admission for acute depressive episode. Medication adjusted to Sertraline 100mg. Safety plan established.",
      highlights: [
        "Diagnosis: Major Depressive Disorder, Recurrent, Moderate",
        "Medication change: Sertraline increased from 50mg to 100mg daily",
        "Safety plan: 24/7 crisis line provided, family support confirmed",
        "Follow-up: Psychiatry appointment scheduled within 7 days"
      ]
    },
    {
      id: "doc2",
      docId: "A37676823",
      type: "Referral - Outpatient",
      source: "Dr. Martinez (Psychiatry)",
      date: "04/02/2026",
      aiSummary: "Referral for continued outpatient therapy. Recommends CBT-focused approach with weekly sessions for 8-12 weeks.",
      highlights: [
        "Recommended therapy: Cognitive Behavioral Therapy (CBT)",
        "Frequency: Weekly sessions",
        "Duration: 8-12 weeks initial course",
        "Goals: Mood stabilization, coping skills development"
      ]
    },
    {
      id: "doc3",
      docId: "A37676654",
      type: "Fax - Lab Results",
      source: "Quest Diagnostics",
      date: "03/28/2026",
      aiSummary: "Routine labs within normal limits. TSH and metabolic panel unremarkable. No concerns identified.",
      highlights: [
        "TSH: 2.1 mIU/L (Normal)",
        "Complete Metabolic Panel: All values within reference range",
        "Lipid Panel: Total cholesterol 185 mg/dL",
        "No follow-up required"
      ]
    },
    {
      id: "doc4",
      docId: "A37676701",
      type: "Prior Auth Letter",
      source: "UM Department",
      date: "03/29/2026",
      aiSummary: "Authorization approved for inpatient MH services at Ridgeview Institute. 4 days approved, medical necessity confirmed.",
      highlights: [
        "Auth #: MH-2026-78432",
        "Service: Inpatient Mental Health",
        "Approved days: 4",
        "Effective: 03/29/2026 - 04/07/2026"
      ]
    },
    {
      id: "doc5",
      docId: "A37676512",
      type: "Clinical Note",
      source: "MWT Care Navigator",
      date: "03/15/2026",
      aiSummary: "Care coordination call completed. Member engaged in treatment, reported improved mood. Discussed medication adherence strategies.",
      highlights: [
        "Member reported improved sleep patterns",
        "Medication adherence confirmed",
        "Next outreach scheduled for 03/22/2026",
        "No acute concerns identified"
      ]
    },
    {
      id: "doc6",
      docId: "A37676398",
      type: "Fax - Provider Note",
      source: "Atlanta Behavioral Health",
      date: "03/10/2026",
      aiSummary: "Therapy progress note. Member attending weekly sessions, showing improvement in coping skills. PHQ-9 score decreased from 18 to 12.",
      highlights: [
        "PHQ-9 improvement: 18 to 12",
        "Therapy modality: CBT",
        "Session frequency: Weekly",
        "Treatment plan on track"
      ]
    }
  ]

  const enrichmentData = {
    icueDischarge: {
      available: true,
      source: "ICUE System",
      systemUrl: "https://icue.carelon.com/member/362584321",
      lastUpdated: "03/30/2026",
      data: {
        dischargeDate: "03/30/2026",
        facility: "Ridgeview Institute Monroe",
        aftercarePlan: "Outpatient therapy 2x/week, Psychiatry follow-up within 7 days, Continue Sertraline 100mg daily",
        followUpAppointment: "04/05/2026 at 2:00 PM with Dr. Martinez (Psychiatry)",
        contactAtDischarge: "(404) 555-0123",
        addressAtDischarge: "123 Main Street, Atlanta, GA 30301"
      }
    },
    hospitalizationUM: {
      available: true,
      source: "UM Authorization System",
      systemUrl: "https://um.carelon.com/auth/MH-2026-78432",
      lastUpdated: "04/01/2026",
      data: {
        admissionDate: "03/29/2026",
        dischargeDate: "03/30/2026",
        authNumber: "MH-2026-78432",
        approvedDays: 4,
        usedDays: 2,
        clinicalNotes: [
          {
            date: "03/30/2026",
            time: "2:15 PM",
            author: "Dr. Sarah Chen",
            type: "Discharge Summary",
            content: "Patient discharged stable with safety plan in place. Medication adjusted to Sertraline 100mg. Follow-up scheduled with outpatient psychiatry within 7 days."
          },
          {
            date: "03/30/2026",
            time: "9:00 AM",
            author: "RN Michelle Torres",
            type: "Nursing Note",
            content: "Patient reports improved mood this morning. Slept well overnight. Denies SI/HI. Engaged in group therapy session. Ready for discharge per treatment team."
          },
          {
            date: "03/29/2026",
            time: "6:30 PM",
            author: "Dr. Sarah Chen",
            type: "Admission Note",
            content: "Voluntary admission for acute depressive episode with passive SI. Patient cooperative and engaged. Started medication adjustment protocol. Safety precautions in place."
          },
          {
            date: "03/29/2026",
            time: "4:45 PM",
            author: "LCSW James Wright",
            type: "Social Work Assessment",
            content: "Completed psychosocial assessment. Strong family support system identified. Parents will be involved in discharge planning. No housing or financial barriers to treatment."
          }
        ]
      }
    },
    facetsClaims: {
      available: true,
      source: "FACETS Claims",
      systemUrl: "https://facets.carelon.com/claims/member/362584321",
      lastUpdated: "04/08/2026",
      data: {
        totalClaimsYTD: 12,
        bhClaimsYTD: 8,
        recentClaims: [
          { date: "04/02/2026", type: "Office Visit - Psychiatry", amount: "$185.00", status: "Paid" },
          { date: "03/30/2026", type: "Inpatient - MH", amount: "$4,250.00", status: "Paid" },
          { date: "03/15/2026", type: "Office Visit - Therapy", amount: "$125.00", status: "Paid" }
        ]
      }
    },
    sdoh: {
      available: true,
      source: "Member Profile / Assessment",
      systemUrl: "https://memberprofile.carelon.com/sdoh/362584321",
      lastUpdated: "02/15/2026",
      data: {
        housingStatus: "Stable - Lives with family",
        transportationAccess: "Has personal vehicle",
        foodSecurity: "No concerns reported",
        socialSupport: "Strong family support system",
        employmentStatus: "Employed part-time",
        additionalNotes: "Member reports occasional financial stress but managing."
      }
    }
  }

  // Tab Content Components
  const SummaryTab = () => (
    <div className="space-y-4">
      {/* Inbound/Outbound Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setCallDirection("inbound")}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-md transition-colors",
              callDirection === "inbound"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Inbound
          </button>
          <button
            onClick={() => setCallDirection("outbound")}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-md transition-colors",
              callDirection === "outbound"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Outbound
          </button>
        </div>
      </div>

      {/* At-a-glance Section */}
      {callDirection === "inbound" ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 px-3 py-2 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800">At-a-glance (Inbound)</h3>
          </div>
          <div className="p-3 space-y-3">
            <AtAGlanceField 
              label="Primary BH Diagnosis" 
              value={atAGlanceData.inbound.primaryBHDiagnosis}
              actionLabel="View Benefits"
              actionSection="benefits"
            />
            <AtAGlanceField 
              label="Last time member called" 
              value={atAGlanceData.inbound.lastMemberCall}
              actionLabel="Call History"
              actionSection="call-history"
            />
            <AtAGlanceField 
              label="Concern addressed during last call" 
              value={atAGlanceData.inbound.lastCallConcern}
              actionLabel="See Notes"
              actionSection="call-history"
            />
            <AtAGlanceField 
              label="History of In-the-Moment Support by MWT" 
              value={atAGlanceData.inbound.mwtSupportHistory}
              actionLabel="Contact History"
              actionSection="contact"
            />
            {/* Hospitalizations Card */}
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Hospitalizations (last 12 months)</div>
                <button
                  onClick={() => scrollToSection('authorization')}
                  className="flex items-center gap-0.5 text-[10px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  View admission history
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
              </div>
              {atAGlanceData.inbound.hospitalizations.count === 0 ? (
                <p className="text-[13px] text-slate-500 italic">No inpatient admissions in the last 12 months</p>
              ) : (
                <div>
                  <p className={cn(
                    "text-[13px] font-medium",
                    atAGlanceData.inbound.hospitalizations.count >= 4 ? "text-red-700" : "text-amber-700"
                  )}>
                    {atAGlanceData.inbound.hospitalizations.count} admission{atAGlanceData.inbound.hospitalizations.count > 1 ? 's' : ''} 
                    {atAGlanceData.inbound.hospitalizations.count > 1 ? ' — most recent ' : ' — '}
                    {atAGlanceData.inbound.hospitalizations.mostRecentFacility} ({atAGlanceData.inbound.hospitalizations.mostRecentDate})
                  </p>
                  {atAGlanceData.inbound.hospitalizations.count >= 4 && (
                    <p className="text-[11px] text-red-600 mt-0.5">High utilization in the last 12 months</p>
                  )}
                </div>
              )}
            </div>

            {/* Outpatient Claims Card */}
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Outpatient Claims (last 12 months)</div>
                <button
                  onClick={() => scrollToSection('claims')}
                  className="flex items-center gap-0.5 text-[10px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Claims
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
              </div>
              {atAGlanceData.inbound.outpatientClaims.count === 0 ? (
                <p className="text-[13px] text-slate-500 italic">No outpatient claims in the last 12 months</p>
              ) : (
                <div>
                  <p className="text-[13px] text-slate-900 font-medium">
                    {atAGlanceData.inbound.outpatientClaims.count} outpatient claim{atAGlanceData.inbound.outpatientClaims.count > 1 ? 's' : ''} — {atAGlanceData.inbound.outpatientClaims.topCategory}
                  </p>
                  {atAGlanceData.inbound.outpatientClaims.lastClaimDate && (
                    <p className="text-[11px] text-slate-500 mt-0.5">Last claim: {atAGlanceData.inbound.outpatientClaims.lastClaimDate}</p>
                  )}
                  {atAGlanceData.inbound.outpatientClaims.lastProvider && (
                    <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                      <span className="text-slate-600 font-medium">{atAGlanceData.inbound.outpatientClaims.lastProvider.name}</span>
                      <a href={`tel:${atAGlanceData.inbound.outpatientClaims.lastProvider.phone}`} className="text-blue-600 hover:underline">{atAGlanceData.inbound.outpatientClaims.lastProvider.phone}</a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pharmacy Claims Card */}
            <div className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pharmacy Claims (last 12 months)</div>
                <button
                  onClick={() => scrollToSection('claims')}
                  className="flex items-center gap-0.5 text-[10px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Pharmacy details
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
              </div>
              {(atAGlanceData.inbound.pharmacyClaims.filled + atAGlanceData.inbound.pharmacyClaims.nonFilled) === 0 ? (
                <p className="text-[13px] text-slate-500 italic">No pharmacy claims in the last 12 months</p>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-semibold bg-green-100 text-green-800">
                      {atAGlanceData.inbound.pharmacyClaims.filled} filled
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-semibold bg-amber-100 text-amber-800">
                      {atAGlanceData.inbound.pharmacyClaims.nonFilled} not filled
                    </span>
                  </div>
                  {atAGlanceData.inbound.pharmacyClaims.nonFilled >= 2 && (
                    <p className="text-[11px] text-amber-600 mt-1">Non-filled prescriptions noted</p>
                  )}
                  {atAGlanceData.inbound.pharmacyClaims.lastFillDate && (
                    <p className="text-[11px] text-slate-500 mt-0.5">Last fill: {atAGlanceData.inbound.pharmacyClaims.lastFillDate}</p>
                  )}
                  {atAGlanceData.inbound.pharmacyClaims.pharmacy && (
                    <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                      <span className="text-slate-600 font-medium">{atAGlanceData.inbound.pharmacyClaims.pharmacy.name}</span>
                      <a href={`tel:${atAGlanceData.inbound.pharmacyClaims.pharmacy.phone}`} className="text-blue-600 hover:underline">{atAGlanceData.inbound.pharmacyClaims.pharmacy.phone}</a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg overflow-hidden">
          <div className="bg-indigo-100 px-3 py-2 border-b border-indigo-200">
            <h3 className="text-sm font-semibold text-indigo-900">Outbound Prep Summary</h3>
            <p className="text-[10px] text-indigo-700 mt-0.5">This view supports proactive outreach and gap identification.</p>
          </div>
          <div className="p-3 space-y-3">
            <AtAGlanceField 
              label="Primary BH Diagnosis" 
              value={atAGlanceData.outbound.primaryBHDiagnosis}
              actionLabel="View Benefits"
              actionSection="benefits"
            />
            <AtAGlanceField 
              label="MWT support history" 
              value={atAGlanceData.outbound.mwtSupportHistory}
              actionLabel="Contact History"
              actionSection="contact"
            />

            {/* Hospitalizations & ER Card */}
            <div className="border-b border-indigo-100 pb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Hospitalizations & ER (last 12 months)</div>
                <button
                  onClick={() => scrollToSection('authorization')}
                  className="flex items-center gap-0.5 text-[10px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  View admission history
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
              </div>
              {atAGlanceData.outbound.hospitalizations.count === 0 && atAGlanceData.outbound.hospitalizations.erVisits === 0 ? (
                <p className="text-[13px] text-slate-500 italic">No inpatient admissions or ER visits in the last 12 months</p>
              ) : (
                <div>
                  <p className={cn(
                    "text-[13px] font-medium",
                    atAGlanceData.outbound.hospitalizations.count >= 4 ? "text-red-700" : "text-amber-700"
                  )}>
                    {atAGlanceData.outbound.hospitalizations.count} hospitalization{atAGlanceData.outbound.hospitalizations.count !== 1 ? 's' : ''}
                    {atAGlanceData.outbound.hospitalizations.count > 0 && (
                      <span>
                        {atAGlanceData.outbound.hospitalizations.count > 1 ? ' — most recent ' : ' — '}
                        {atAGlanceData.outbound.hospitalizations.mostRecentFacility} ({atAGlanceData.outbound.hospitalizations.mostRecentDate})
                      </span>
                    )}
                    ; {atAGlanceData.outbound.hospitalizations.erVisits} ER visit{atAGlanceData.outbound.hospitalizations.erVisits !== 1 ? 's' : ''}
                  </p>
                  {atAGlanceData.outbound.hospitalizations.count >= 4 && (
                    <p className="text-[11px] text-red-600 mt-0.5">High utilization in the last 12 months</p>
                  )}
                </div>
              )}
            </div>

            {/* Outpatient Claims Card */}
            <div className="border-b border-indigo-100 pb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Outpatient Claims (last 12 months)</div>
                <button
                  onClick={() => scrollToSection('claims')}
                  className="flex items-center gap-0.5 text-[10px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Claims
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
              </div>
              {atAGlanceData.outbound.outpatientClaims.count === 0 ? (
                <p className="text-[13px] text-slate-500 italic">No outpatient claims in the last 12 months</p>
              ) : (
                <div>
                  <p className="text-[13px] text-slate-900 font-medium">
                    {atAGlanceData.outbound.outpatientClaims.count} outpatient claim{atAGlanceData.outbound.outpatientClaims.count > 1 ? 's' : ''} — {atAGlanceData.outbound.outpatientClaims.topCategory}
                  </p>
                  {atAGlanceData.outbound.outpatientClaims.lastClaimDate && (
                    <p className="text-[11px] text-slate-500 mt-0.5">Last claim: {atAGlanceData.outbound.outpatientClaims.lastClaimDate}</p>
                  )}
                  {atAGlanceData.outbound.outpatientClaims.lastProvider && (
                    <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                      <span className="text-slate-600 font-medium">{atAGlanceData.outbound.outpatientClaims.lastProvider.name}</span>
                      <a href={`tel:${atAGlanceData.outbound.outpatientClaims.lastProvider.phone}`} className="text-blue-600 hover:underline">{atAGlanceData.outbound.outpatientClaims.lastProvider.phone}</a>
                    </div>
                  )}
                  {atAGlanceData.outbound.outpatientClaims.trend && (
                    <p className="text-[11px] text-slate-500 mt-0.5">{atAGlanceData.outbound.outpatientClaims.trend}</p>
                  )}
                </div>
              )}
            </div>

            {/* Pharmacy Claims Card */}
            <div className="border-b border-indigo-100 pb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pharmacy Claims (last 12 months)</div>
                <button
                  onClick={() => scrollToSection('claims')}
                  className="flex items-center gap-0.5 text-[10px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Pharmacy details
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
              </div>
              {(atAGlanceData.outbound.pharmacyClaims.filled + atAGlanceData.outbound.pharmacyClaims.nonFilled) === 0 ? (
                <p className="text-[13px] text-slate-500 italic">No pharmacy claims in the last 12 months</p>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-semibold bg-green-100 text-green-800">
                      {atAGlanceData.outbound.pharmacyClaims.filled} filled
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-semibold bg-amber-100 text-amber-800">
                      {atAGlanceData.outbound.pharmacyClaims.nonFilled} not filled
                    </span>
                  </div>
                  {atAGlanceData.outbound.pharmacyClaims.nonFilled >= 2 && (
                    <p className="text-[11px] text-amber-600 mt-1">Non-filled prescriptions noted</p>
                  )}
                  {atAGlanceData.outbound.pharmacyClaims.lastFillDate && (
                    <p className="text-[11px] text-slate-500 mt-0.5">Last fill: {atAGlanceData.outbound.pharmacyClaims.lastFillDate}</p>
                  )}
                  {atAGlanceData.outbound.pharmacyClaims.pharmacy && (
                    <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                      <span className="text-slate-600 font-medium">{atAGlanceData.outbound.pharmacyClaims.pharmacy.name}</span>
                      <a href={`tel:${atAGlanceData.outbound.pharmacyClaims.pharmacy.phone}`} className="text-blue-600 hover:underline">{atAGlanceData.outbound.pharmacyClaims.pharmacy.phone}</a>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-indigo-100 pt-3">
              <div className="text-xs font-medium text-slate-600 mb-2">Care Gaps</div>
              {atAGlanceData.outbound.careGaps && atAGlanceData.outbound.careGaps.length > 0 ? (
                <div className="space-y-1.5">
                  {atAGlanceData.outbound.careGaps.map((gap, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white rounded px-2 py-1.5 border border-indigo-100">
                      <span className="text-xs text-slate-800">{gap.gap}</span>
                      <span className={cn(
                        "text-[10px] font-medium px-1.5 py-0.5 rounded",
                        gap.priority === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {gap.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">No care gaps identified</span>
              )}
            </div>

            <div className="border-t border-indigo-100 pt-3">
              <div className="text-xs font-medium text-slate-600 mb-1">Readiness for outreach</div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">High</span>
                <span className="text-xs text-slate-600">Recent engagement, stable condition</span>
              </div>
            </div>

            <AtAGlanceField 
              label="Last successful contact" 
              value={atAGlanceData.outbound.lastSuccessfulContact}
              actionLabel="Call History"
              actionSection="call-history"
            />
            <AtAGlanceField 
              label="Preferred contact time" 
              value={atAGlanceData.outbound.preferredContactTime}
              actionLabel="Contact"
              actionSection="contact"
            />
          </div>
        </div>
      )}

      {/* Things You Should Know */}
      <div>
        <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Things You Should Know</h3>
        
        {/* Icon Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center mb-1">
              <AlertCircle className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-lg font-semibold text-orange-700">{summaryData.openAlerts}</div>
            <div className="text-[10px] text-orange-600">Open Alert</div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center mb-1">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg font-semibold text-blue-700">{summaryData.recentAuthorizations}</div>
            <div className="text-[10px] text-blue-600">Auth</div>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center mb-1">
              <Link2 className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-lg font-semibold text-purple-700">{summaryData.activeReferrals}</div>
            <div className="text-[10px] text-purple-600">Referrals</div>
          </div>
        </div>

        {/* Status Indicators Row */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-2">
            <div className="text-[10px] font-semibold text-green-700 uppercase tracking-wide mb-1">Active Programs</div>
            <div className="text-xs text-green-900 font-medium">MWT BH Navigation</div>
            <div className="text-[10px] text-green-600">Enrolled 01/15/2026</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
            <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide mb-1">Enrollment Status</div>
            <div className="text-xs text-slate-900 font-medium">Active</div>
            <div className="text-[10px] text-slate-500">Eligible through 12/31/2026</div>
          </div>
        </div>

        {/* Recent Authorizations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
          <div className="text-[10px] font-semibold text-blue-700 uppercase tracking-wide mb-1">Recent Authorizations</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-900">MH Inpatient - Ridgeview</span>
              <span className="text-blue-600">03/29/2026</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-900">Outpatient Therapy (20 visits)</span>
              <span className="text-blue-600">01/15/2026</span>
            </div>
          </div>
        </div>

        {/* Transitional Care Indicators */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3">
          <div className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide mb-1">Transitional Care</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-amber-900">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Post-discharge follow-up due 04/10/2026</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-amber-900">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>7-day follow-up completed 04/05/2026</span>
            </div>
          </div>
        </div>

        {/* Key Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
          <div className="text-[10px] font-semibold text-yellow-700 uppercase tracking-wide mb-2">Key Notes</div>
          <ul className="space-y-1.5">
            {summaryData.keyNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-yellow-900">
                <FileText className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* Social & Environmental Context (SDOH) */}
        {summaryData.sdoh?.available && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setSdohExpanded(!sdohExpanded)}
              className="w-full text-left px-3 py-2 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">Social & Environmental Context</span>
                </div>
                <ChevronDownIcon className={cn(
                  "w-4 h-4 text-slate-400 transition-transform",
                  sdohExpanded && "rotate-180"
                )} />
              </div>
              {!sdohExpanded && (
                <p className="text-xs text-slate-600 mt-1.5 pl-5.5">{summaryData.sdoh.summaryLine}</p>
              )}
            </button>
            
            {sdohExpanded && (
              <div className="px-3 pb-3 pt-1 border-t border-slate-200 space-y-2.5">
                {summaryData.sdoh.details.livingSituation && (
                  <div className="flex items-start gap-2">
                    <Home className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-medium text-slate-500">Living Situation</div>
                      <p className="text-xs text-slate-700">{summaryData.sdoh.details.livingSituation}</p>
                    </div>
                  </div>
                )}
                {summaryData.sdoh.details.supportSystem && (
                  <div className="flex items-start gap-2">
                    <Users className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-medium text-slate-500">Support System</div>
                      <p className="text-xs text-slate-700">{summaryData.sdoh.details.supportSystem}</p>
                    </div>
                  </div>
                )}
                {summaryData.sdoh.details.transportationBarriers && (
                  <div className="flex items-start gap-2">
                    <Car className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-medium text-slate-500">Transportation</div>
                      <p className="text-xs text-slate-700">{summaryData.sdoh.details.transportationBarriers}</p>
                    </div>
                  </div>
                )}
                {summaryData.sdoh.details.financialConstraints && (
                  <div className="flex items-start gap-2">
                    <Wallet className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-medium text-slate-500">Financial Considerations</div>
                      <p className="text-xs text-slate-700">{summaryData.sdoh.details.financialConstraints}</p>
                    </div>
                  </div>
                )}
                {summaryData.sdoh.details.otherFactors && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-medium text-slate-500">Other Factors</div>
                      <p className="text-xs text-slate-700">{summaryData.sdoh.details.otherFactors}</p>
                    </div>
                  </div>
                )}
                <div className="pt-1.5 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 italic">{summaryData.sdoh.lastUpdated}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  const InteractionsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Recent Interactions</h3>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={mwtOnly}
            onChange={(e) => setMwtOnly(e.target.checked)}
            className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-600">MWT only</span>
        </label>
      </div>

      {/* Pattern Analysis */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-medium text-amber-800">Pattern Detected</div>
            <p className="text-xs text-amber-700 mt-0.5">3 calls in past 7 days - medication coordination and post-hospitalization support</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-200" />
        <div className="space-y-3">
          {filteredInteractions.map((interaction) => (
            <button
              key={interaction.id}
              onClick={() => setSelectedInteraction(interaction)}
              className="relative w-full text-left pl-8 pr-2 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className={cn(
                "absolute left-1.5 top-3 w-3 h-3 rounded-full border-2 bg-white",
                interaction.status === "resolved" && "border-green-500",
                interaction.status === "pending" && "border-amber-500",
                interaction.status === "escalated" && "border-red-500"
              )} />
              
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    {interaction.type === "Inbound" ? (
                      <PhoneIncoming className="w-3 h-3 text-blue-600" />
                    ) : (
                      <PhoneOutgoing className="w-3 h-3 text-green-600" />
                    )}
                    <span className="text-xs font-medium text-gray-900">{interaction.type}</span>
                    <span 
                      onClick={(e) => {
                        e.stopPropagation()
                        scrollToSection('call-history')
                      }}
                      className="text-[10px] font-mono text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      {interaction.interactionId}
                    </span>
                    <span className={cn(
                      "px-1.5 py-0.5 text-[10px] font-medium rounded",
                      interaction.isMWT ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                    )}>
                      {interaction.department}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 line-clamp-2 group-hover:text-gray-900">{interaction.summary}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Clock className="w-2.5 h-2.5" />
                      {interaction.dateTime}
                    </div>
                    {interaction.status === "pending" && (
                      <span className="text-[10px] text-amber-600 font-medium">Pending</span>
                    )}
                    {interaction.status === "escalated" && (
                      <span className="text-[10px] text-red-600 font-medium">Escalated</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {filteredInteractions.length === 0 && (
        <div className="text-xs text-gray-500 text-center py-4">No {mwtOnly ? "MWT " : ""}interactions found</div>
      )}
    </div>
  )

  const DocumentsTab = () => (
    <div className="space-y-5">
      {/* Documents & Faxes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileStack className="w-3.5 h-3.5 text-gray-500" />
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Recent Documents</h3>
          </div>
          <span className="text-[10px] text-gray-400">{documentsData.length} most relevant</span>
        </div>
        <p className="text-[10px] text-gray-500 mb-3">AI-summarized clinical documents and faxes</p>
        
        <div className="space-y-2">
          {documentsData.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleDocument(doc.id)}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={cn(
                        "px-1.5 py-0.5 text-[10px] font-medium rounded",
                        doc.type.includes("Fax") ? "bg-purple-100 text-purple-700" :
                        doc.type.includes("Discharge") ? "bg-blue-100 text-blue-700" :
                        doc.type.includes("Referral") ? "bg-green-100 text-green-700" :
                        doc.type.includes("Clinical") ? "bg-teal-100 text-teal-700" :
                        "bg-gray-100 text-gray-700"
                      )}>
                        {doc.type}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">{doc.docId}</span>
                      <span className="text-[10px] text-gray-400">|</span>
                      <span className="text-[10px] text-gray-500">{doc.date}</span>
                    </div>
                    <p className="text-xs text-gray-700 font-medium mt-1 line-clamp-1">{doc.source}</p>
                  </div>
                  <ChevronDownIcon className={cn(
                    "w-4 h-4 text-gray-400 transition-transform flex-shrink-0 mt-0.5",
                    expandedDocuments.includes(doc.id) && "rotate-180"
                  )} />
                </div>
                
                {/* AI Summary - always visible */}
                <div className="flex items-start gap-1.5 mt-2 pt-2 border-t border-gray-100">
                  <Sparkles className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-gray-600 line-clamp-2">{doc.aiSummary}</p>
                </div>
              </button>
              
              {/* Expanded Details */}
              {expandedDocuments.includes(doc.id) && (
                <div className="px-3 py-2 border-t border-gray-200 bg-white">
                  <div className="text-[10px] font-medium text-gray-500 mb-2">Key Highlights</div>
                  <ul className="space-y-1.5">
                    {doc.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <button className="flex items-center gap-1 mt-3 text-[11px] text-blue-600 hover:text-blue-700 font-medium">
                    <ExternalLink className="w-3 h-3" />
                    View original document
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <button 
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={() => {
              // Navigate to full document history
              scrollToSection('documents')
            }}
          >
            <FileText className="w-3.5 h-3.5" />
            View all documents
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

{/* Related Data From Other Systems */}
  <div>
  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Related Data From Other Systems</h3>
  <p className="text-[10px] text-gray-500 mb-3">Data pulled from connected clinical systems</p>
        
        <div className="space-y-2">
          {/* ICUE Discharge Summary */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleEnrichment("icue")}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-medium text-gray-800">ICUE Discharge Summary</span>
              </div>
              <ChevronDownIcon className={cn("w-4 h-4 text-gray-400 transition-transform", expandedEnrichments.includes("icue") && "rotate-180")} />
            </button>
{expandedEnrichments.includes("icue") && (
  <div className="px-3 py-2 border-t border-gray-200 bg-white">
  {enrichmentData.icueDischarge.available ? (
  <>
  <div className="flex items-center justify-between mb-2">
  <span className="text-[10px] text-gray-500">Source: {enrichmentData.icueDischarge.source}</span>
  <span className="text-[10px] text-gray-500">Updated: {enrichmentData.icueDischarge.lastUpdated}</span>
  </div>
  <a 
    href={enrichmentData.icueDischarge.systemUrl} 
    target="_blank" 
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium mb-2"
  >
    <ExternalLink className="w-3 h-3" />
    Open in ICUE
  </a>
                    <div className="space-y-2 text-xs">
                      <div><span className="font-medium text-gray-700">Discharge Date:</span> <span className="text-gray-600">{enrichmentData.icueDischarge.data.dischargeDate}</span></div>
                      <div><span className="font-medium text-gray-700">Facility:</span> <span className="text-gray-600">{enrichmentData.icueDischarge.data.facility}</span></div>
                      <div><span className="font-medium text-gray-700">Aftercare Plan:</span> <span className="text-gray-600">{enrichmentData.icueDischarge.data.aftercarePlan}</span></div>
                      <div><span className="font-medium text-gray-700">Follow-up:</span> <span className="text-gray-600">{enrichmentData.icueDischarge.data.followUpAppointment}</span></div>
                      <div><span className="font-medium text-gray-700">Contact:</span> <span className="text-gray-600">{enrichmentData.icueDischarge.data.contactAtDischarge}</span></div>
                      <div><span className="font-medium text-gray-700">Address:</span> <span className="text-gray-600">{enrichmentData.icueDischarge.data.addressAtDischarge}</span></div>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-400 italic py-2">Not available</div>
                )}
              </div>
            )}
          </div>

          {/* Hospitalization UM Notes */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleEnrichment("um")}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-medium text-gray-800">Hospitalization UM Notes</span>
              </div>
              <ChevronDownIcon className={cn("w-4 h-4 text-gray-400 transition-transform", expandedEnrichments.includes("um") && "rotate-180")} />
            </button>
{expandedEnrichments.includes("um") && (
  <div className="px-3 py-2 border-t border-gray-200 bg-white">
  {enrichmentData.hospitalizationUM.available ? (
  <>
  <div className="flex items-center justify-between mb-2">
  <span className="text-[10px] text-gray-500">Source: {enrichmentData.hospitalizationUM.source}</span>
  <span className="text-[10px] text-gray-500">Updated: {enrichmentData.hospitalizationUM.lastUpdated}</span>
  </div>
  <a 
    href={enrichmentData.hospitalizationUM.systemUrl} 
    target="_blank" 
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium mb-2"
  >
    <ExternalLink className="w-3 h-3" />
    Open in UM System
  </a>
                    <div className="space-y-2 text-xs">
                      <div className="flex gap-4">
                        <div><span className="font-medium text-gray-700">Admission:</span> <span className="text-gray-600">{enrichmentData.hospitalizationUM.data.admissionDate}</span></div>
                        <div><span className="font-medium text-gray-700">Discharge:</span> <span className="text-gray-600">{enrichmentData.hospitalizationUM.data.dischargeDate}</span></div>
                      </div>
                      <div><span className="font-medium text-gray-700">Auth #:</span> <span className="text-gray-600">{enrichmentData.hospitalizationUM.data.authNumber}</span></div>
                      <div><span className="font-medium text-gray-700">Days:</span> <span className="text-gray-600">{enrichmentData.hospitalizationUM.data.usedDays} used of {enrichmentData.hospitalizationUM.data.approvedDays} approved</span></div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-700">Clinical Notes</span>
                          <span className="text-[10px] text-gray-400">{enrichmentData.hospitalizationUM.data.clinicalNotes.length} notes</span>
                        </div>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                          {enrichmentData.hospitalizationUM.data.clinicalNotes.map((note, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-2 border-l-2 border-blue-300">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">{note.type}</span>
                                <span className="text-[10px] text-gray-400">{note.date} {note.time}</span>
                              </div>
                              <p className="text-gray-600 text-[11px] leading-relaxed">{note.content}</p>
                              <div className="text-[10px] text-gray-400 mt-1 italic">— {note.author}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-400 italic py-2">Not available</div>
                )}
              </div>
            )}
          </div>

          {/* FACETS Claims */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleEnrichment("facets")}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-medium text-gray-800">FACETS Claims Details</span>
              </div>
              <ChevronDownIcon className={cn("w-4 h-4 text-gray-400 transition-transform", expandedEnrichments.includes("facets") && "rotate-180")} />
            </button>
{expandedEnrichments.includes("facets") && (
  <div className="px-3 py-2 border-t border-gray-200 bg-white">
  {enrichmentData.facetsClaims.available ? (
  <>
  <div className="flex items-center justify-between mb-2">
  <span className="text-[10px] text-gray-500">Source: {enrichmentData.facetsClaims.source}</span>
  <span className="text-[10px] text-gray-500">Updated: {enrichmentData.facetsClaims.lastUpdated}</span>
  </div>
  <a 
    href={enrichmentData.facetsClaims.systemUrl} 
    target="_blank" 
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium mb-2"
  >
    <ExternalLink className="w-3 h-3" />
    Open in FACETS
  </a>
                    <div className="space-y-2 text-xs">
                      <div className="flex gap-4">
                        <div><span className="font-medium text-gray-700">Total YTD:</span> <span className="text-gray-600">{enrichmentData.facetsClaims.data.totalClaimsYTD} claims</span></div>
                        <div><span className="font-medium text-gray-700">BH YTD:</span> <span className="text-gray-600">{enrichmentData.facetsClaims.data.bhClaimsYTD} claims</span></div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Recent Claims:</span>
                        <div className="mt-1 space-y-1">
                          {enrichmentData.facetsClaims.data.recentClaims.map((claim, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-gray-50 p-1.5 rounded text-[11px]">
                              <div>
                                <span className="text-gray-500">{claim.date}</span>
                                <span className="mx-1">·</span>
                                <span className="text-gray-700">{claim.type}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">{claim.amount}</span>
                                <span className={cn(
                                  "px-1 py-0.5 rounded text-[10px] font-medium",
                                  claim.status === "Paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                )}>{claim.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-400 italic py-2">Not available</div>
                )}
              </div>
            )}
          </div>

          {/* Social Determinants of Health */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleEnrichment("sdoh")}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-medium text-gray-800">Social Determinants of Health</span>
              </div>
              <ChevronDownIcon className={cn("w-4 h-4 text-gray-400 transition-transform", expandedEnrichments.includes("sdoh") && "rotate-180")} />
            </button>
{expandedEnrichments.includes("sdoh") && (
  <div className="px-3 py-2 border-t border-gray-200 bg-white">
  {enrichmentData.sdoh.available ? (
  <>
  <div className="flex items-center justify-between mb-2">
  <span className="text-[10px] text-gray-500">Source: {enrichmentData.sdoh.source}</span>
  <span className="text-[10px] text-gray-500">Updated: {enrichmentData.sdoh.lastUpdated}</span>
  </div>
  <a 
    href={enrichmentData.sdoh.systemUrl} 
    target="_blank" 
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium mb-2"
  >
    <ExternalLink className="w-3 h-3" />
    Open in Member Profile
  </a>
                    <div className="space-y-2 text-xs">
                      <div><span className="font-medium text-gray-700">Housing:</span> <span className="text-gray-600">{enrichmentData.sdoh.data.housingStatus}</span></div>
                      <div><span className="font-medium text-gray-700">Transportation:</span> <span className="text-gray-600">{enrichmentData.sdoh.data.transportationAccess}</span></div>
                      <div><span className="font-medium text-gray-700">Food Security:</span> <span className="text-gray-600">{enrichmentData.sdoh.data.foodSecurity}</span></div>
                      <div><span className="font-medium text-gray-700">Social Support:</span> <span className="text-gray-600">{enrichmentData.sdoh.data.socialSupport}</span></div>
                      <div><span className="font-medium text-gray-700">Employment:</span> <span className="text-gray-600">{enrichmentData.sdoh.data.employmentStatus}</span></div>
                      {enrichmentData.sdoh.data.additionalNotes && (
                        <div className="bg-amber-50 border border-amber-100 p-2 rounded text-amber-800">
                          <span className="font-medium">Note:</span> {enrichmentData.sdoh.data.additionalNotes}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-400 italic py-2">Not available</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const ActionsTab = () => (
    <div className="space-y-5">
      {/* Upcoming Actions */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Upcoming Actions</h3>
        <div className="space-y-2">
          {summaryData.upcomingActions.map((action, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center justify-between p-2 rounded-lg border",
                action.priority === "high"
                  ? "bg-red-50 border-red-100"
                  : "bg-blue-50 border-blue-100"
              )}
            >
              <div className="flex items-center gap-2">
                <Calendar className={cn(
                  "w-3.5 h-3.5",
                  action.priority === "high" ? "text-red-600" : "text-blue-600"
                )} />
                <span className="text-xs text-gray-800">{action.type}</span>
              </div>
              <span className={cn(
                "text-xs font-medium",
                action.priority === "high" ? "text-red-600" : "text-blue-600"
              )}>
                {action.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Phone className="w-3.5 h-3.5" />
            Log New Call
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <FileText className="w-3.5 h-3.5" />
            Add Note
          </button>
          <button className="w-full px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            View Full History
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div
      ref={panelRef}
      className={cn(
        "h-full bg-white border-l border-gray-200 flex flex-col relative",
        !isResizing && "transition-all duration-300 ease-in-out"
      )}
      style={{ width: isExpanded ? `${panelWidth}px` : '40px' }}
    >
      {/* Resize Handle */}
      {isExpanded && (
        <div
          onMouseDown={handleMouseDown}
          className={cn(
            "absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize group z-20 flex items-center",
            isResizing && "bg-blue-100"
          )}
        >
          <div className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 rounded-full transition-colors",
            isResizing ? "bg-blue-500" : "bg-gray-300 group-hover:bg-blue-400"
          )} />
          <GripVertical className={cn(
            "w-3 h-3 absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0.5 transition-colors",
            isResizing ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"
          )} />
        </div>
      )}

      {/* Collapse/Expand Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-6 h-12 bg-white border border-gray-200 rounded-l-md flex items-center justify-center hover:bg-gray-50 shadow-sm"
      >
        {isExpanded ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {!isExpanded ? (
        <div className="flex flex-col items-center py-4 gap-2">
          <span className="text-xs font-medium text-gray-600 writing-mode-vertical rotate-180" style={{ writingMode: "vertical-rl" }}>
            Case Prep Summary
          </span>
        </div>
      ) : (
        <>
          {/* Sticky Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Case Prep Summary</h2>
                <div className="flex flex-col items-center">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                  </button>
                  <span className="text-[10px] text-gray-400">just now</span>
                </div>
              </div>
            </div>

            {/* Section Tabs */}
            <div className="flex border-t border-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors border-b-2",
                    activeTab === tab.id
                      ? "text-blue-600 border-blue-600 bg-blue-50/50"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "summary" && <SummaryTab />}
            {activeTab === "interactions" && <InteractionsTab />}
            {activeTab === "documents" && <DocumentsTab />}
            {activeTab === "actions" && <ActionsTab />}
          </div>
        </>
      )}

      {/* Note Preview Modal */}
      {selectedInteraction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedInteraction(null)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {selectedInteraction.type === "Inbound" ? (
                    <PhoneIncoming className="w-4 h-4 text-blue-600" />
                  ) : (
                    <PhoneOutgoing className="w-4 h-4 text-green-600" />
                  )}
                  <h3 className="font-semibold text-gray-900">{selectedInteraction.type} Call Note</h3>
                  <span className="text-xs font-mono text-gray-500">{selectedInteraction.interactionId}</span>
                  <span className={cn(
                    "px-2 py-0.5 text-xs font-medium rounded",
                    selectedInteraction.status === "resolved" && "bg-green-100 text-green-700",
                    selectedInteraction.status === "pending" && "bg-amber-100 text-amber-700",
                    selectedInteraction.status === "escalated" && "bg-red-100 text-red-700"
                  )}>
                    {selectedInteraction.status.charAt(0).toUpperCase() + selectedInteraction.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{selectedInteraction.dateTime}</p>
              </div>
              <button onClick={() => setSelectedInteraction(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Department</div>
                    <div className="text-sm text-gray-900">{selectedInteraction.department}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Agent</div>
                    <div className="text-sm text-gray-900">{selectedInteraction.agent}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Summary</div>
                  <div className="text-sm text-gray-900">{selectedInteraction.summary}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Full Note</div>
                  <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
                    {selectedInteraction.notePreview}
                  </div>
                </div>

                {selectedInteraction.isMWT && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">MWT Interaction</span>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-end gap-2">
              <button onClick={() => setSelectedInteraction(null)} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded transition-colors">
                Close
              </button>
              <button 
                onClick={() => {
                  setSelectedInteraction(null)
                  scrollToSection('call-history')
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                View in Call History
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
