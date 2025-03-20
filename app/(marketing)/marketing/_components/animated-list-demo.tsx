"use client";

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface AnimatedListDemoProps {
  className?: string
}

export function AnimatedListDemo({ className }: AnimatedListDemoProps) {
  const [items, setItems] = useState([
    { id: 1, text: "New customer inquiry" },
    { id: 2, text: "Sales report ready" },
    { id: 3, text: "Inventory update" },
    { id: 4, text: "Meeting reminder" },
    { id: 5, text: "Task completed" },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const newItems = [...prev]
        const first = newItems.shift()
        if (first) {
          newItems.push({ ...first, id: Date.now() })
        }
        return newItems
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-2 rounded-lg bg-gray-100 p-2 dark:bg-gray-800"
        >
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
        </div>
      ))}
    </div>
  )
} 