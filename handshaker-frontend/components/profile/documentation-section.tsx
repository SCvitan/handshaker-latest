"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Upload,
  X,
  Check,
  Shield,
  Files,
  CreditCard,
  Receipt,
  Loader2,
  Eye,
  Image as ImageIcon,
} from "lucide-react"
import type { Documentation, DocumentItem } from "@/lib/cv-types"
import { uploadDocument, deleteDocument } from "@/lib/cv-api"

interface DocumentationSectionProps {
  data: Documentation
  onSaved: (data: Documentation) => void
}

type DocumentType = "WORK_PERMIT" | "PASSPORT" | "RESIDENCE_CARD" | "PAY_SLIP" | "OTHER"

interface FileUploadCardProps {
  title: string
  description: string
  icon: React.ReactNode
  document: DocumentItem | undefined
  documentType: DocumentType
  onUpload: (type: DocumentType, file: File) => Promise<void>
  onRemove: (doc: DocumentItem) => Promise<void>
  isUploading: boolean
  accept?: string
}

function FileUploadCard({
  title,
  description,
  icon,
  document,
  documentType,
  onUpload,
  onRemove,
  isUploading,
  accept = ".pdf,.jpg,.jpeg,.png",
}: FileUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUpload(documentType, file)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <Card className={document ? "border-green-200 bg-green-50/50" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`rounded-lg p-2 ${document ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
              {icon}
            </div>
            <div>
              <CardTitle className="text-base font-medium">{title}</CardTitle>
              <CardDescription className="text-xs">{description}</CardDescription>
            </div>
          </div>
          {document && (
            <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              <Check className="size-3" />
              Uploaded
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        {document ? (
          <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
            <div className="flex items-center gap-3">
              {/* Thumbnail or icon */}
              {document.thumbnailUrl ? (
                <img
                  src={document.thumbnailUrl}
                  alt={document.fileName}
                  className="size-10 rounded object-cover border"
                />
              ) : document.previewAvailable ? (
                <div className="size-10 rounded bg-muted flex items-center justify-center">
                  <ImageIcon className="size-5 text-muted-foreground" />
                </div>
              ) : (
                <div className="size-10 rounded bg-muted flex items-center justify-center">
                  <FileText className="size-5 text-muted-foreground" />
                </div>
              )}
              <span className="text-sm truncate max-w-[160px]">{document.fileName}</span>
            </div>
            <div className="flex items-center gap-1">
              {/* View button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(document.fileUrl, "_blank")}
                className="text-primary hover:text-primary hover:bg-primary/10"
              >
                <Eye className="size-4" />
              </Button>
              {/* Remove button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(document)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={handleClick}
            disabled={isUploading}
            className="w-full gap-2 border-dashed"
          >
            {isUploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {isUploading ? "Uploading..." : `Upload ${title}`}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function DocumentationSection({ data: initialData, onSaved }: DocumentationSectionProps) {
  const [data, setData] = useState<Documentation>(initialData)
  const [isUploading, setIsUploading] = useState(false)

  const getDocumentByType = (type: DocumentType): DocumentItem | undefined => {
    return data.find((doc) => doc.documentType === type)
  }

  const getOtherDocuments = (): DocumentItem[] => {
    return data.filter((doc) => doc.documentType === "OTHER")
  }

  const handleUpload = async (type: DocumentType, file: File) => {
    setIsUploading(true)
    try {
      const result = await uploadDocument(type, file)
      // Create a DocumentItem from the upload result
      const newDoc: DocumentItem = {
        id: crypto.randomUUID(), // Temporary ID until server returns real one
        documentType: type,
        fileUrl: result.fileUrl,
        thumbnailUrl: result.thumbnailUrl,
        fileName: result.fileName,
        contentType: file.type,
        previewAvailable: result.previewAvailable,
        uploadedAt: new Date().toISOString(),
      }
      const updatedData = [...data, newDoc]
      setData(updatedData)
      onSaved(updatedData)
    } catch (err) {
      console.error("Failed to upload document:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async (doc: DocumentItem) => {
    try {
      await deleteDocument(doc.id)
      const updatedData = data.filter((d) => d.id !== doc.id)
      setData(updatedData)
      onSaved(updatedData)
    } catch (err) {
      console.error("Failed to delete document:", err)
    }
  }

  const handleOtherDocumentUpload = async () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf,.jpg,.jpeg,.png"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        await handleUpload("OTHER", file)
      }
    }
    input.click()
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="grid gap-4">
        <FileUploadCard
          title="Work Permit"
          description="Upload a copy of your work permit (PDF, JPG, PNG)"
          icon={<Shield className="size-5" />}
          document={getDocumentByType("WORK_PERMIT")}
          documentType="WORK_PERMIT"
          onUpload={handleUpload}
          onRemove={handleRemove}
          isUploading={isUploading}
        />

        <FileUploadCard
          title="Passport"
          description="Upload a copy of your passport (PDF, JPG, PNG)"
          icon={<Shield className="size-5" />}
          document={getDocumentByType("PASSPORT")}
          documentType="PASSPORT"
          onUpload={handleUpload}
          onRemove={handleRemove}
          isUploading={isUploading}
        />

        <FileUploadCard
          title="Residence Card"
          description="Upload a copy of your residence card (PDF, JPG, PNG)"
          icon={<CreditCard className="size-5" />}
          document={getDocumentByType("RESIDENCE_CARD")}
          documentType="RESIDENCE_CARD"
          onUpload={handleUpload}
          onRemove={handleRemove}
          isUploading={isUploading}
        />

        <FileUploadCard
          title="Pay Slip"
          description="Upload a recent pay slip (PDF, JPG, PNG)"
          icon={<Receipt className="size-5" />}
          document={getDocumentByType("PAY_SLIP")}
          documentType="PAY_SLIP"
          onUpload={handleUpload}
          onRemove={handleRemove}
          isUploading={isUploading}
        />

        {/* Other Documents Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                <Files className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base font-medium">Other Documents</CardTitle>
                <CardDescription className="text-xs">
                  Upload any other relevant documents (certificates, references, etc.)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {getOtherDocuments().map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
              >
                <div className="flex items-center gap-3">
                  {/* Thumbnail or icon */}
                  {doc.thumbnailUrl ? (
                    <img
                      src={doc.thumbnailUrl}
                      alt={doc.fileName}
                      className="size-10 rounded object-cover border"
                    />
                  ) : doc.previewAvailable ? (
                    <div className="size-10 rounded bg-muted flex items-center justify-center">
                      <ImageIcon className="size-5 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="size-10 rounded bg-muted flex items-center justify-center">
                      <FileText className="size-5 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-sm truncate max-w-[160px]">{doc.fileName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(doc.fileUrl, "_blank")}
                    className="text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Eye className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(doc)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={handleOtherDocumentUpload}
              disabled={isUploading}
              className="w-full gap-2 border-dashed"
            >
              {isUploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              {isUploading ? "Uploading..." : "Add Another Document"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
