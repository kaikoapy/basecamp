"use server"

import { z } from "zod"

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export async function joinWaitlist(formData: FormData) {
  const validatedFields = waitlistSchema.safeParse({
    email: formData.get("email"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid email address",
    }
  }

  try {
    // Here you would typically:
    // 1. Save to your database
    // 2. Send confirmation email
    // 3. Add to your email marketing service
    
    return {
      success: "You've been added to the waitlist!",
    }
  } catch (error) {
    console.error("Waitlist error:", error)
    return {
      error: "Something went wrong. Please try again.",
    }
  }
} 