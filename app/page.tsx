"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MemberProfile } from "@/components/member-profile"
import { NavigationTabs } from "@/components/navigation-tabs"
import { AlertsSection } from "@/components/alerts-section"
import { AccordionSections } from "@/components/accordion-sections"
import { AIAssistant } from "@/components/ai-assistant"
import { CasePrepSummary } from "@/components/case-prep-summary"

export default function MemberDashboard() {
  const [activeTab, setActiveTab] = useState("member-summary")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <MemberProfile />
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4">
            <AlertsSection />
            <AccordionSections />
          </main>
          <div className="relative">
            <CasePrepSummary />
          </div>
        </div>
      </div>
      <AIAssistant />
    </div>
  )
}
