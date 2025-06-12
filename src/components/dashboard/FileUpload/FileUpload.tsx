'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import Button from '@/components/ui/Button/Button'
import styles from './FileUpload.module.css'

interface FileUploadProps {
  projectId: string
  onUploadComplete?: (document: any) => void
  className?: string
}

interface UploadFile {
  file: File
  id: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  projectId,
  onUploadComplete,
  className = ''
}) => {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadDocument } = useProjectStore()

  const acceptedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain'
  ]

  const maxFileSize = 50 * 1024 * 1024 // 50MB

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return 'File type not supported'
    }
    if (file.size > maxFileSize) {
      return 'File size too large (max 50MB)'
    }
    return null
  }

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const validFiles: UploadFile[] = []

    fileArray.forEach(file => {
      const error = validateFile(file)
      validFiles.push({
        file,
        id: generateId(),
        status: error ? 'error' : 'pending',
        progress: 0,
        error
      })
    })

    setFiles(prev => [...prev, ...validFiles])
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }, [])

  const uploadFile = async (uploadFile: UploadFile) => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      ))

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id && f.progress < 90
            ? { ...f, progress: f.progress + 10 }
            : f
        ))
      }, 200)

      const document = await uploadDocument(uploadFile.file, projectId)

      clearInterval(progressInterval)
      
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'success', progress: 100 }
          : f
      ))

      onUploadComplete?.(document)

      // Remove successful uploads after 2 seconds
      setTimeout(() => {
        removeFile(uploadFile.id)
      }, 2000)

    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'error', error: 'Upload failed' }
          : f
      ))
    }
  }

  const uploadAllFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending')
    
    for (const file of pendingFiles) {
      await uploadFile(file)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles)
    }
  }, [addFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(selectedFiles)
    }
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }, [addFiles])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className={styles.statusIcon} style={{ color: '#10B981' }} />
      case 'error':
        return <AlertCircle className={styles.statusIcon} style={{ color: '#EF4444' }} />
      default:
        return <File className={styles.statusIcon} />
    }
  }

  return (
    <div className={`${styles.fileUpload} ${className}`}>
      {/* Drop Zone */}
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className={styles.uploadIcon} />
        <h3 className={styles.dropTitle}>
          Drop files here or click to browse
        </h3>
        <p className={styles.dropDescription}>
          Support for PDF, Word, images and more (max 50MB)
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className={styles.hiddenInput}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className={styles.fileList}>
          <div className={styles.fileListHeader}>
            <h4>Files to Upload ({files.length})</h4>
            {files.some(f => f.status === 'pending') && (
              <Button
                variant="accent"
                size="small"
                onClick={uploadAllFiles}
              >
                Upload All
              </Button>
            )}
          </div>

          <div className={styles.files}>
            {files.map((uploadFile) => (
              <div key={uploadFile.id} className={styles.fileItem}>
                <div className={styles.fileInfo}>
                  {getStatusIcon(uploadFile.status)}
                  <div className={styles.fileDetails}>
                    <div className={styles.fileName}>{uploadFile.file.name}</div>
                    <div className={styles.fileSize}>
                      {formatFileSize(uploadFile.file.size)}
                    </div>
                    {uploadFile.error && (
                      <div className={styles.fileError}>{uploadFile.error}</div>
                    )}
                  </div>
                </div>

                <div className={styles.fileActions}>
                  {uploadFile.status === 'uploading' && (
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${uploadFile.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {uploadFile.status === 'pending' && (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => uploadFile(uploadFile)}
                    >
                      Upload
                    </Button>
                  )}

                  <button
                    className={styles.removeButton}
                    onClick={() => removeFile(uploadFile.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload