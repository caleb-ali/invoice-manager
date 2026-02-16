'use client'

import { useState, useRef } from 'react'
import { InvoiceAttachment } from '../lib/types'

interface FileUploadProps {
  attachments: InvoiceAttachment[]
  onFilesChange: (attachments: InvoiceAttachment[]) => void
  maxFiles?: number
  maxSizeMB?: number
}

export default function FileUpload({
  attachments,
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 10,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
    if (fileType === 'application/pdf') {
      return (
        <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
    return (
      <svg className="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeBytes) {
      return `File "${file.name}" exceeds ${maxSizeMB}MB limit`
    }
    return null
  }

  const processFiles = async (fileList: FileList) => {
    setError('')

    if (attachments.length + fileList.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    const newAttachments: InvoiceAttachment[] = []

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const validationError = validateFile(file)

      if (validationError) {
        setError(validationError)
        return
      }

      // Convert file to base64 for storage
      const base64 = await fileToBase64(file)

      const attachment: InvoiceAttachment = {
        id: `${Date.now()}-${i}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        url: base64,
        uploadedAt: new Date().toISOString(),
      }

      newAttachments.push(attachment)
    }

    onFilesChange([...attachments, ...newAttachments])
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = (id: string) => {
    onFilesChange(attachments.filter((att) => att.id !== id))
  }

  const downloadFile = (attachment: InvoiceAttachment) => {
    const link = document.createElement('a')
    link.href = attachment.url
    link.download = attachment.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        />

        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <div className="text-sm text-gray-600">
            <button
              type="button"
              onClick={handleButtonClick}
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
            >
              Click to upload
            </button>
            {' or drag and drop'}
          </div>

          <p className="text-xs text-gray-500">
            PDF, DOC, XLS, or images up to {maxSizeMB}MB (Max {maxFiles} files)
          </p>

          <p className="text-xs text-gray-400">
            {attachments.length}/{maxFiles} files uploaded
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* File List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
            {attachments.map((attachment) => (
              <li key={attachment.id} className="flex items-center justify-between p-3 hover:bg-gray-50">
                <div className="flex items-center flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {getFileIcon(attachment.fileType)}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {attachment.fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.fileSize)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    type="button"
                    onClick={() => downloadFile(attachment)}
                    className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none"
                    title="Download"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFile(attachment.id)}
                    className="p-1 text-gray-400 hover:text-red-600 focus:outline-none"
                    title="Remove"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}