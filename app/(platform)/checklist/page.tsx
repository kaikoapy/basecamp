"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Check, Printer, Car, CarFront } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import Pill from "./_components/Pill"
import Confetti from "react-confetti"
import { BlobProvider, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import "./styles.css"

interface ChecklistItem {
  id: string
  label: string
  link?: string
  category: "new" | "trade" | "lease"
}

interface ChecklistItems {
  new: ChecklistItem[]
  used: ChecklistItem[]
}

interface PrintViewProps {
  activeTab: string
  tradeOption: string | null
  selectedItems: { [key: string]: boolean }
  checklistItems: ChecklistItems
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    marginRight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 8,
  },
  checkmark: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: -2,
  },
  text: {
    fontSize: 12,
  }
});

const PDFDocument = React.memo(function PDFDocument({ activeTab, tradeOption, selectedItems, checklistItems }: PrintViewProps) {
  const items = checklistItems[activeTab as keyof typeof checklistItems];
  const mainItems = items.filter(item => item.category === "new");
  const tradeItems = tradeOption === "Trade In" 
    ? items.filter(item => item.category === "trade")
    : tradeOption === "Lease Return"
      ? items.filter(item => item.category === "lease")
      : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          {activeTab === "new" ? "New" : "Used"} Car Checklist
          {tradeOption ? ` with ${tradeOption}` : ""}
        </Text>
        
        <View style={styles.content}>
          <View style={[styles.column, !tradeOption && { marginRight: 0 }]}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {activeTab === "new" ? "New" : "Used"} Car Items
              </Text>
              {mainItems.map((item) => (
                <View key={item.id} style={styles.item}>
                  <View style={styles.checkbox}>
                    {selectedItems[item.id] && (
                      <Text style={styles.checkmark}>×</Text>
                    )}
                  </View>
                  <Text style={styles.text}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {tradeOption && tradeItems.length > 0 && (
            <View style={styles.column}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {tradeOption} Items
                </Text>
                {tradeItems.map((item) => (
                  <View key={item.id} style={styles.item}>
                    <View style={styles.checkbox}>
                      {selectedItems[item.id] && (
                        <Text style={styles.checkmark}>×</Text>
                      )}
                    </View>
                    <Text style={styles.text}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
});

export default function DealChecklist() {
  const [tradeOption, setTradeOption] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean
  }>({})
  const [confetti, setConfetti] = useState<boolean>(false)
  const [confettiFadeOut, setConfettiFadeOut] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("new")

  const checklistItems: ChecklistItems = useMemo(
    () => ({
      new: [
        { id: "01", label: "Driver's License", category: "new" },
        { id: "02", label: "Insurance ID Card", category: "new" },
        {
          id: "03",
          label: "Credit Application",
          link: "https://www.volvocarsnorthmiami.com/getfinancing",
          category: "new",
        },
        { id: "05", label: "Get Ready", category: "new" },
        { id: "04", label: "ODO Picture", category: "new" },
        { id: "09", label: "Proof of Loyalty", category: "new" },
        { id: "10", label: "A-Plan/Affinity Pin", category: "new" },
        {
          id: "18",
          label: "Validate Pin(s)",
          link: "https://aplanbyvolvo.com/Affinity-Tools/A-Plan-Affinity/PIN-Look-Up",
          category: "new",
        },
        { id: "11", label: "Forms", link: "/", category: "new" },
        { id: "06", label: "We Owe", category: "new" },
        {
          id: "07",
          label: "Volvo App",
          link: "https://www.volvocars.com/us/volvo-cars-app/",
          category: "new",
        },
        // Trade In items
        { id: "00", label: "Registration", category: "trade" },
        { id: "13", label: "Trade ODO Picture", category: "trade" },
        { id: "15", label: "Trade Title", category: "trade" },
        { id: "14", label: "Trade Pay-Off Form", category: "trade" },
        { id: "17", label: "ACV Form", category: "trade" },
        // Lease Return items
        { id: "00", label: "Registration", category: "lease" },
        {
          id: "16",
          label: "VCFS Statement",
          link: "https://www.volvocarfinancialservices.com/login",
          category: "lease",
        },
        { id: "19", label: "Lease Return ODO Picture", category: "lease" },
        { id: "20", label: "ODO Disclosure", category: "lease" },
      ],
      used: [
        { id: "01", label: "Driver's License", category: "new" },
        { id: "02", label: "Insurance ID Card", category: "new" },
        {
          id: "03",
          label: "Credit Application",
          link: "https://www.volvocarsnorthmiami.com/getfinancing",
          category: "new",
        },
        { id: "05", label: "Get Ready", category: "new" },
        { id: "04", label: "ODO Picture", category: "new" },
        { id: "10", label: "A-Plan/Affinity Pin", category: "new" },
        {
          id: "18",
          label: "Validate Pin(s)",
          link: "https://aplanbyvolvo.com/Affinity-Tools/A-Plan-Affinity/PIN-Look-Up",
          category: "new",
        },
        {
          id: "08",
          label: "Sign CarFax",
          link: "https://www.carfaxonline.com/",
          category: "new",
        },
        { id: "06", label: "We Owe", category: "new" },
        // Trade In items
        { id: "00", label: "Registration", category: "trade" },
        { id: "13", label: "Trade ODO Picture", category: "trade" },
        { id: "15", label: "Trade Title", category: "trade" },
        { id: "14", label: "Trade Pay-Off Form", category: "trade" },
        { id: "17", label: "ACV Form", category: "trade" },
        // Lease Return items
        { id: "00", label: "Registration", category: "lease" },
        {
          id: "16",
          label: "VCFS Statement",
          link: "https://www.volvocarfinancialservices.com/login",
          category: "lease",
        },
        { id: "19", label: "Lease Return ODO Picture", category: "lease" },
        { id: "20", label: "ODO Disclosure", category: "lease" },
      ],
    }),
    [],
  )

  const toggleTradeOption = (option: string) => {
    setTradeOption(tradeOption === option ? null : option)
  }

  const playChime = () => {
    try {
      const chime = new Audio("/chime.mp3")
      chime.play().catch((error) => {
        console.error("Error playing chime sound:", error)
      })
    } catch (error) {
      console.error("Error creating Audio object:", error)
    }
  }

  const playConfettiSound = () => {
    try {
      const confettiSound = new Audio("/confetti.mp3")
      confettiSound.play().catch((error) => {
        console.error("Error playing confetti sound:", error)
      })
    } catch (error) {
      console.error("Error creating Audio object:", error)
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: e.target.checked,
    }))
    if (e.target.checked) {
      playChime()
    }
  }

  useEffect(() => {
    const allItems = checklistItems[activeTab as keyof typeof checklistItems]

    const filteredItems = allItems.filter((item: ChecklistItem) => {
      if (tradeOption === "Trade In" && item.category === "trade") return true
      if (tradeOption === "Lease Return" && item.category === "lease") return true
      if (item.category === "new") return true
      return false
    })

    const allSelected = filteredItems.every((item: ChecklistItem) => selectedItems[item.id])

    if (allSelected && filteredItems.length > 0) {
      setConfetti(true)
      setConfettiFadeOut(false)
      playConfettiSound()
      setTimeout(() => setConfettiFadeOut(true), 3000)
      setTimeout(() => setConfetti(false), 5000)
    }
  }, [selectedItems, tradeOption, checklistItems, activeTab])

  const noClipboardIconItems = ["Validate Pin(s)", "Sign CarFax", "Forms"]

  return (
    <div className="flex flex-col items-center py-6 w-5xl selection:bg-purple-300 min-h-screen">
      {confetti && (
        <Confetti
          className={cn(confettiFadeOut ? "confetti-fade-out" : "")}
          recycle={false}
          numberOfPieces={500}
          gravity={0.1}
          tweenDuration={5000}
        />
      )}

      <div className="w-full max-w-5xl px-4 sm:px-6 pb-12">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Deal Checklist
        </h1>

        <div className="flex justify-center mb-4">
          <BlobProvider
            key={`${activeTab}-${tradeOption}`}
            document={
              <PDFDocument
                activeTab={activeTab}
                tradeOption={tradeOption}
                selectedItems={selectedItems}
                checklistItems={checklistItems}
              />
            }
          >
            {({ url, loading }) => (
              <button
                onClick={() => url && window.open(url, '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors duration-200 shadow-sm hover:shadow-md"
                disabled={loading}
              >
                <Printer className="h-4 w-4" />
                {loading ? "Generating PDF..." : "Open PDF"}
              </button>
            )}
          </BlobProvider>
        </div>

        <Tabs defaultValue="new" onValueChange={setActiveTab}>
          <TabsList className="flex space-x-1 justify-center items-center rounded-xl bg-transparent p-1 mb-4 w-full">
            <TabsTrigger
              value="new"
              className={cn(
                "w-full text-center rounded-lg py-2.5 text-sm font-medium leading-5 select-none",
                "ring-white/60 focus:outline-none focus:ring-none transition-all",
                activeTab === "new"
                  ? "bg-gradient-to-r from-pink-300 border border-pink-200 via-pink-400/80 via-50% to-pink-300 text-white shadow-sm hover:shadow-md"
                  : "text-gray-500 bg-white border shadow-sm hover:shadow-md hover:text-gray-700",
              )}
            >
              New Deal
            </TabsTrigger>
            <TabsTrigger
              value="used"
              className={cn(
                "w-full text-center rounded-lg py-2.5 text-sm font-medium leading-5 select-none",
                "ring-white/60 focus:outline-none focus:ring-none transition-all",
                activeTab === "used"
                  ? "bg-red-400 text-white shadow-sm border border-red-300 hover:shadow-md"
                  : "text-gray-500 bg-white border shadow-sm hover:shadow-md hover:text-gray-700",
              )}
            >
              Used Deal
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-4 mt-4 justify-center">
            <button
              className={`px-4 w-36 py-2 text-sm select-none rounded-xl transition ${
                tradeOption === "Lease Return"
                  ? "bg-green-500 text-white border border-emerald-500 shadow-md hover:shadow-lg"
                  : "bg-white text-gray-500 hover:text-gray-700 shadow-md hover:shadow-lg border rounded-xl"
              }`}
              onClick={() => toggleTradeOption("Lease Return")}
            >
              Lease Return {tradeOption === "Lease Return" && <Check className="inline-block ml-1 h-4 w-4" />}
            </button>
            <button
              className={`px-4 py-2 w-36 text-sm select-none rounded-xl transition ${
                tradeOption === "Trade In"
                  ? "bg-green-500 text-white border border-emerald-500 shadow-md hover:shadow-lg"
                  : "bg-white text-gray-500 hover:text-gray-700 shadow-md hover:shadow-lg border rounded-xl"
              }`}
              onClick={() => toggleTradeOption("Trade In")}
            >
              Trade In {tradeOption === "Trade In" && <Check className="inline-block ml-1 h-4 w-4" />}
            </button>
          </div>

          <TabsContent value="new" className="mt-6">
            <div className={cn(
              "grid gap-6",
              tradeOption ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:max-w-2xl md:mx-auto"
            )}>
              <div className={cn(
                tradeOption ? "" : "md:max-w-2xl md:mx-auto"
              )}>
                <div className="flex items-center mb-3">
                  <Car className="h-5 w-5 text-pink-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">New Car Checklist</h2>
                </div>
                <div id="checklist" className="w-full bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  {checklistItems.new
                    .filter((item) => item.category === "new")
                    .map((item: ChecklistItem) => (
                      <div key={item.id} className="flex items-center mb-0 rounded-lg p-2.5 hover:bg-gray-50">
                        <input
                          id={`new-${item.id}`}
                          type="checkbox"
                          className="mr-2 custom-checkbox"
                          checked={selectedItems[item.id] || false}
                          onChange={(e) => handleCheckboxChange(e, item.id)}
                        />
                        <label
                          htmlFor={`new-${item.id}`}
                          className={cn("text-gray-700 cursor-pointer", selectedItems[item.id] && "text-gray-400")}
                        >
                          {item.label}
                        </label>
                        {!selectedItems[item.id] && item.link && (
                          <Pill
                            label={item.label}
                            link={item.link}
                            showClipboardIcon={!noClipboardIconItems.includes(item.label)}
                          />
                        )}
                        {item.label === "A-Plan/Affinity Pin" && !selectedItems[item.id] && (
                          <button className="border border-gray-200 text-gray-700 px-2.5 py-1.5 ml-4 rounded-xl text-xs hover:shadow-lg hover:text-gray-800 hover:scale-105 hover:bg-white transition-transform duration-300 ease-in-out select-none">
                            View Links
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {tradeOption && (
                <div>
                  {tradeOption === "Trade In" && (
                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <CarFront className="h-5 w-5 text-green-500 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-800">Trade In Checklist</h2>
                      </div>
                      <div id="checklist" className="w-full bg-white rounded-xl p-3 shadow-sm border border-green-100">
                        {checklistItems.new
                          .filter((item) => item.category === "trade")
                          .map((item: ChecklistItem) => (
                            <div key={item.id} className="flex items-center mb-0 rounded-lg p-2.5 hover:bg-green-50">
                              <input
                                id={`new-trade-${item.id}`}
                                type="checkbox"
                                className="mr-2 custom-checkbox"
                                checked={selectedItems[item.id] || false}
                                onChange={(e) => handleCheckboxChange(e, item.id)}
                              />
                              <label
                                htmlFor={`new-trade-${item.id}`}
                                className={cn("text-gray-700 cursor-pointer", selectedItems[item.id] && "text-gray-400")}
                              >
                                {item.label}
                              </label>
                              {!selectedItems[item.id] && item.link && (
                                <Pill
                                  label={item.label}
                                  link={item.link}
                                  showClipboardIcon={!noClipboardIconItems.includes(item.label)}
                                />
                              )}
                              {item.label === "Trade Pay-Off Form" && !selectedItems[item.id] && (
                                <button className="border border-gray-200 text-gray-700 px-2.5 py-1.5 ml-4 rounded-xl text-xs hover:shadow-lg hover:text-gray-800 hover:scale-105 hover:bg-white transition-transform duration-300 ease-in-out select-none">
                                  View Numbers
                                </button>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {tradeOption === "Lease Return" && (
                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <CarFront className="h-5 w-5 text-blue-500 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-800">Lease Return Checklist</h2>
                      </div>
                      <div id="checklist" className="w-full bg-white rounded-xl p-3 shadow-sm border border-blue-100">
                        {checklistItems.new
                          .filter((item) => item.category === "lease")
                          .map((item: ChecklistItem) => (
                            <div key={item.id} className="flex items-center mb-0 rounded-lg p-2.5 hover:bg-blue-50">
                              <input
                                id={`new-lease-${item.id}`}
                                type="checkbox"
                                className="mr-2 custom-checkbox"
                                checked={selectedItems[item.id] || false}
                                onChange={(e) => handleCheckboxChange(e, item.id)}
                              />
                              <label
                                htmlFor={`new-lease-${item.id}`}
                                className={cn("text-gray-700 cursor-pointer", selectedItems[item.id] && "text-gray-400")}
                              >
                                {item.label}
                              </label>
                              {!selectedItems[item.id] && item.link && (
                                <Pill
                                  label={item.label}
                                  link={item.link}
                                  showClipboardIcon={!noClipboardIconItems.includes(item.label)}
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="used" className="mt-6">
            <div className={cn(
              "grid gap-6",
              tradeOption ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:max-w-2xl md:mx-auto"
            )}>
              <div className={cn(
                tradeOption ? "" : "md:max-w-2xl md:mx-auto"
              )}>
                <div className="flex items-center mb-3">
                  <Car className="h-5 w-5 text-red-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">Used Car Checklist</h2>
                </div>
                <div id="checklist" className="w-full bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  {checklistItems.used
                    .filter((item) => item.category === "new")
                    .map((item: ChecklistItem) => (
                      <div key={item.id} className="flex items-center mb-0 rounded-lg p-2.5 hover:bg-gray-50">
                        <input
                          id={`used-${item.id}`}
                          type="checkbox"
                          className="mr-2 custom-checkbox"
                          checked={selectedItems[item.id] || false}
                          onChange={(e) => handleCheckboxChange(e, item.id)}
                        />
                        <label
                          htmlFor={`used-${item.id}`}
                          className={cn("text-gray-700 cursor-pointer", selectedItems[item.id] && "text-gray-400")}
                        >
                          {item.label}
                        </label>
                        {!selectedItems[item.id] && item.link && (
                          <Pill
                            label={item.label}
                            link={item.link}
                            showClipboardIcon={!noClipboardIconItems.includes(item.label)}
                          />
                        )}
                        {item.label === "A-Plan/Affinity Pin" && !selectedItems[item.id] && (
                          <button className="border border-gray-200 text-gray-700 px-2.5 py-1.5 ml-4 rounded-xl text-xs hover:shadow-lg hover:text-gray-800 hover:scale-105 hover:bg-white transition-transform duration-300 ease-in-out select-none">
                            View Links
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {tradeOption && (
                <div>
                  {tradeOption === "Trade In" && (
                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <CarFront className="h-5 w-5 text-green-500 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-800">Trade In Checklist</h2>
                      </div>
                      <div id="checklist" className="w-full bg-white rounded-xl p-3 shadow-sm border border-green-100">
                        {checklistItems.used
                          .filter((item) => item.category === "trade")
                          .map((item: ChecklistItem) => (
                            <div key={item.id} className="flex items-center mb-0 rounded-lg p-2.5 hover:bg-green-50">
                              <input
                                id={`used-trade-${item.id}`}
                                type="checkbox"
                                className="mr-2 custom-checkbox"
                                checked={selectedItems[item.id] || false}
                                onChange={(e) => handleCheckboxChange(e, item.id)}
                              />
                              <label
                                htmlFor={`used-trade-${item.id}`}
                                className={cn("text-gray-700 cursor-pointer", selectedItems[item.id] && "text-gray-400")}
                              >
                                {item.label}
                              </label>
                              {!selectedItems[item.id] && item.link && (
                                <Pill
                                  label={item.label}
                                  link={item.link}
                                  showClipboardIcon={!noClipboardIconItems.includes(item.label)}
                                />
                              )}
                              {item.label === "Trade Pay-Off Form" && !selectedItems[item.id] && (
                                <button className="border border-gray-200 text-gray-700 px-2.5 py-1.5 ml-4 rounded-xl text-xs hover:shadow-lg hover:text-gray-800 hover:scale-105 hover:bg-white transition-transform duration-300 ease-in-out select-none">
                                  View Numbers
                                </button>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {tradeOption === "Lease Return" && (
                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <CarFront className="h-5 w-5 text-blue-500 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-800">Lease Return Checklist</h2>
                      </div>
                      <div id="checklist" className="w-full bg-white rounded-xl p-3 shadow-sm border border-blue-100">
                        {checklistItems.used
                          .filter((item) => item.category === "lease")
                          .map((item: ChecklistItem) => (
                            <div key={item.id} className="flex items-center mb-0 rounded-lg p-2.5 hover:bg-blue-50">
                              <input
                                id={`used-lease-${item.id}`}
                                type="checkbox"
                                className="mr-2 custom-checkbox"
                                checked={selectedItems[item.id] || false}
                                onChange={(e) => handleCheckboxChange(e, item.id)}
                              />
                              <label
                                htmlFor={`used-lease-${item.id}`}
                                className={cn("text-gray-700 cursor-pointer", selectedItems[item.id] && "text-gray-400")}
                              >
                                {item.label}
                              </label>
                              {!selectedItems[item.id] && item.link && (
                                <Pill
                                  label={item.label}
                                  link={item.link}
                                  showClipboardIcon={!noClipboardIconItems.includes(item.label)}
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

