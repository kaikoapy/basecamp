"use client"

import type React from "react"
import { useState, useEffect, useMemo, memo } from "react"
import { Printer, Car, CarFront } from "lucide-react"
import { cn } from "@/lib/utils"
import Pill from "./_components/Pill"
import Confetti from "react-confetti"
import { BlobProvider, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
  activeTab: "new" | "used"
  tradeOption: "none" | "trade" | "lease"
  selectedItems: { [key: string]: boolean }
  checklistItems: ChecklistItems
}

interface DealType {
  value: "new" | "used"
  label: string
}

interface TradeType {
  value: "none" | "trade" | "lease"
  label: string
}

type TradeOptionType = "none" | "trade" | "lease";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    flexDirection: 'column'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
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
    paddingLeft: 20,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 8,
    backgroundColor: '#fff',
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

const PDFDocument = memo(function PDFDocument({ activeTab, tradeOption, selectedItems, checklistItems }: PrintViewProps) {
  const items = checklistItems[activeTab];
  const mainItems = items.filter(item => item.category === "new");
  const tradeItems = tradeOption === "trade" 
    ? items.filter(item => item.category === "trade")
    : tradeOption === "lease"
      ? items.filter(item => item.category === "lease")
      : [];

  const getTradeOptionLabel = (option: TradeOptionType) => {
    if (option === "trade") return "Trade In";
    if (option === "lease") return "Lease Return";
    return "";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          {activeTab === "new" ? "New" : "Used"} Car Checklist
          {tradeOption !== "none" ? ` with ${getTradeOptionLabel(tradeOption)}` : ""}
        </Text>
        
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

        {tradeOption !== "none" && tradeItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {getTradeOptionLabel(tradeOption)} Items
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
        )}
      </Page>
    </Document>
  );
}, (prevProps, nextProps) => {
  // Deep comparison of props to prevent unnecessary re-renders
  return (
    prevProps.activeTab === nextProps.activeTab &&
    prevProps.tradeOption === nextProps.tradeOption &&
    JSON.stringify(prevProps.selectedItems) === JSON.stringify(nextProps.selectedItems)
  )
});

const dealTypes: DealType[] = [
  { value: "new", label: "New Deal" },
  { value: "used", label: "Used Deal" },
]

const tradeTypes: TradeType[] = [
  { value: "none", label: "N/A" },
  { value: "trade", label: "Trade In" },
  { value: "lease", label: "Lease Return" },
]

export default function DealChecklist() {
  const [activeTab, setActiveTab] = useState<"new" | "used">("new")
  const [tradeOption, setTradeOption] = useState<TradeOptionType>("none")
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean
  }>({})
  const [confetti, setConfetti] = useState<boolean>(false)
  const [confettiFadeOut, setConfettiFadeOut] = useState<boolean>(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

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
    []
  )

  const playChime = () => {
    try {
      const audio = new Audio("/chime.mp3")
      // Only attempt to play if the browser supports the audio format
      if (audio.canPlayType("audio/mpeg")) {
        audio.volume = 0.5 // Reduce volume to 50%
        audio.play().catch((error) => {
          // Silently fail - don't log errors for audio
          console.debug("Audio playback prevented:", error)
        })
      }
    } catch (error) {
      // Silently fail - don't log errors for audio
      console.debug("Audio creation prevented:", error)
    }
  }

  const playConfettiSound = () => {
    try {
      const audio = new Audio("/confetti.mp3")
      // Only attempt to play if the browser supports the audio format
      if (audio.canPlayType("audio/mpeg")) {
        audio.volume = 0.5 // Reduce volume to 50%
        audio.play().catch((error) => {
          // Silently fail - don't log errors for audio
          console.debug("Audio playback prevented:", error)
        })
      }
    } catch (error) {
      // Silently fail - don't log errors for audio
      console.debug("Audio creation prevented:", error)
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: e.target.checked,
    }))
    // Only play sound when checking the box, not unchecking
    if (e.target.checked) {
      playChime()
    }
  }

  useEffect(() => {
    const allItems = checklistItems[activeTab as keyof typeof checklistItems]

    const filteredItems = allItems.filter((item: ChecklistItem) => {
      if (tradeOption === "trade" && item.category === "trade") return true
      if (tradeOption === "lease" && item.category === "lease") return true
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

  // Handle PDF URL changes
  useEffect(() => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
      setPdfUrl(null);
      setIsPrinting(false);
    }
  }, [pdfUrl]);

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

      <div className="container mx-auto py-8 max-w-4xl print:py-0 print:max-w-full">
        <div className="flex justify-between items-center mb-8 print:hidden">
          <h1 className="text-3xl font-bold">Deal Checklist</h1>
          <Button 
            onClick={() => setIsPrinting(true)}
            size="lg"
            className="print:hidden"
          >
            <Printer className="mr-2 h-5 w-5" />
            Print Checklist
          </Button>
        </div>

        {isPrinting && (
          <BlobProvider
            document={
              <PDFDocument
                activeTab={activeTab}
                tradeOption={tradeOption}
                selectedItems={selectedItems}
                checklistItems={checklistItems}
              />
            }
          >
            {({ url, loading, error }) => {
              if (loading) return null;
              if (error) {
                // Schedule state update for next tick
                setTimeout(() => setIsPrinting(false), 0);
                return null;
              }
              if (url) {
                // Update URL through state instead of direct window.open
                setPdfUrl(url);
                return null;
              }
              return null;
            }}
          </BlobProvider>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:hidden">
          <Card className="shadow-md">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle>Deal Type</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <RadioGroup
                value={activeTab}
                onValueChange={(value: "new" | "used") => {
                  setActiveTab(value);
                  setSelectedItems({}); // Reset selections when switching tabs
                }}
                className="flex space-x-8"
              >
                {dealTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label htmlFor={type.value} className="text-base font-medium">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle>Trade Option</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <RadioGroup
                value={tradeOption}
                onValueChange={(value: TradeOptionType) => setTradeOption(value)}
                className="flex space-x-8"
              >
                {tradeTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label htmlFor={type.value} className="text-base font-medium">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div className={cn(
          "grid gap-6",
          tradeOption !== "none" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:max-w-2xl md:mx-auto"
        )}>
          <div className={cn(
            tradeOption ? "" : "md:max-w-2xl md:mx-auto"
          )}>
            <div className="flex items-center mb-3">
              <Car className="h-5 w-5 text-pink-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">{activeTab === "new" ? "New" : "Used"} Car Checklist</h2>
            </div>
            <div id="checklist" className="w-full bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              {checklistItems[activeTab]
                .filter((item) => item.category === "new")
                .map((item: ChecklistItem) => (
                  <div key={item.id} className="flex items-center mb-0 rounded-lg p-2.5 hover:bg-gray-50">
                    <input
                      id={`${activeTab}-${item.id}`}
                      type="checkbox"
                      className="mr-2 custom-checkbox"
                      checked={selectedItems[item.id] || false}
                      onChange={(e) => handleCheckboxChange(e, item.id)}
                    />
                    <label
                      htmlFor={`${activeTab}-${item.id}`}
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
              {tradeOption === "trade" && (
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <CarFront className="h-5 w-5 text-green-500 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">Trade In Checklist</h2>
                  </div>
                  <div id="checklist" className="w-full bg-white rounded-xl p-3 shadow-sm border border-green-100">
                    {checklistItems[activeTab]
                      .filter((item) => item.category === "trade")
                      .map((item: ChecklistItem) => (
                        <div key={item.id} className="flex items-center mb-0 rounded-lg p-2.5 hover:bg-green-50">
                          <input
                            id={`${activeTab}-trade-${item.id}`}
                            type="checkbox"
                            className="mr-2 custom-checkbox"
                            checked={selectedItems[item.id] || false}
                            onChange={(e) => handleCheckboxChange(e, item.id)}
                          />
                          <label
                            htmlFor={`${activeTab}-trade-${item.id}`}
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

              {tradeOption === "lease" && (
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <CarFront className="h-5 w-5 text-blue-500 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">Lease Return Checklist</h2>
                  </div>
                  <div id="checklist" className="w-full bg-white rounded-xl p-3 shadow-sm border border-blue-100">
                    {checklistItems[activeTab]
                      .filter((item) => item.category === "lease")
                      .map((item: ChecklistItem) => (
                        <div key={item.id} className="flex items-center mb-0 rounded-lg p-2.5 hover:bg-blue-50">
                          <input
                            id={`${activeTab}-lease-${item.id}`}
                            type="checkbox"
                            className="mr-2 custom-checkbox"
                            checked={selectedItems[item.id] || false}
                            onChange={(e) => handleCheckboxChange(e, item.id)}
                          />
                          <label
                            htmlFor={`${activeTab}-lease-${item.id}`}
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
      </div>
    </div>
  )
}

