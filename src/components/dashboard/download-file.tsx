"use client"

import Link from "next/link"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DownloadButtonProps {
    fileUrl: string
    fileName: string
    title: string

    

}

export function DownloadFile({ fileUrl, fileName, title }: DownloadButtonProps) {
  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    // Create a temporary link element
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = `${fileName}.pdf` // Set the download filename
    link.target = '_blank' // Open in new tab if download fails
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button asChild className="w-full">
      <Link 
        href={fileUrl} 
        onClick={handleDownload}
        target="_blank" 
        rel="noopener noreferrer"
      >
        <Download className="mr-2 h-4 w-4" />
        {title}
      </Link>
    </Button>
  )
}
