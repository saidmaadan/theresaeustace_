import PDFParser from "pdf2json"

export async function extractTextFromPDF(pdfUrl: string): Promise<string> {
  try {
    // Fetch the PDF file
    const response = await fetch(pdfUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`)
    }

    const pdfBuffer = await response.arrayBuffer()

    // Parse PDF to text
    const pdfParser = new PDFParser()
    
    return new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const text = pdfData.Pages.map(page => 
          page.Texts.map(text => decodeURIComponent(text.R[0].T)).join(" ")
        ).join("\n")
        resolve(text)
      })

      pdfParser.on("pdfParser_dataError", (error) => {
        reject(error)
      })

      pdfParser.parseBuffer(Buffer.from(pdfBuffer))
    })
  } catch (error) {
    console.error("Error extracting text from PDF:", error)
    throw error
  }
}

async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = []
  
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }
  
  return Buffer.concat(chunks)
}
