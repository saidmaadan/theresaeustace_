"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PDFViewer } from "./pdf-viewer"

interface ViewButtonProps {
  fileUrl: string
  title: string
}

export function ViewButton({ fileUrl, title }: ViewButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => setIsOpen(true)}
      >
        <Eye className="mr-2 h-4 w-4" />
        View PDF
      </Button>
      <PDFViewer
        url={fileUrl}
        title={title}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
