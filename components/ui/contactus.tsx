// components/ContactUs.tsx

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactUs() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
  
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
  
      const result = await response.json()
      if (result.success) {
        alert("Message sent successfully! 🎉")
        setFormData({ name: "", email: "", contact: "", message: "" })
        setOpen(false)
      } else {
        alert("Failed to send message. Please try again later.")
      }
    } catch (error) {
      console.error("Submit error:", error)
      alert("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Contact JSON Forge</h1>
        <p className="mb-4 text-center">
            Have a question, feedback, or need assistance? 
        </p>
        <p className="mb-4 text-center">
            We'd love to hear from you!
            <br/>
            Whether it's a query about our JSON tools or suggestions for new features, feel free to reach out.  
            <br />
            Our team is ready to help you make the most of JSON Forge.
        </p>
        <Button className="mt-6" onClick={() => setOpen(true)}>
          Send a Message
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Get in Touch</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                type="tel"
                required
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
