'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Upload, 
  FileText, 
  Search, 
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Folder,
  Image,
  File
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useProjectStore } from '@/store/projectStore'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import Card from '@/components/ui/Card/Card'
import FileUpload from '@/components/dashboard/FileUpload/FileUpload'
import styles from './documents.module.css'

export default function DocumentsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { projects, documents, fetchProjects, fetchProjectDocuments } = useProjectStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [fileTypeFilter, setFileTypeFilter] = useState('all')
  const [showUpload, setShowUpload] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/signin')
      return
    }
    
    const loadData = async () => {
      await fetchProjects()
      // Fetch documents for all projects
      for (const project of projects) {
        await fetchProjectDocuments(project.id)
      }
      setLoading(false)
    }
    
    loadData()
  }, [user, router, fetchProjects, fetchProjectDocuments, projects])

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return File
    
    if (mimeType.startsWith('image/')) return Image
    if (mimeType === 'application/pdf') return FileText
    if (mimeType.includes('word') || mimeType.includes('document')) return FileText
    return File
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProject = selectedProject === 'all' || doc.project_id === selectedProject
    const matchesFileType = fileTypeFilter === 'all' || 
      (fileTypeFilter === 'pdf' && doc.mime_type === 'application/pdf') ||
      (fileTypeFilter === 'image' && doc.mime_type?.startsWith('image/')) ||
      (fileTypeFilter === 'document' && doc.mime_type?.includes('word'))
    
    return matchesSearch && matchesProject && matchesFileType
  })

  const getDocumentStats = () => {
    const total = documents.length
    const pdf = documents.filter(d => d.mime_type === 'application/pdf').length
    const images = documents.filter(d => d.mime_type?.startsWith('image/')).length
    const docs = documents.filter(d => d.mime_type?.includes('word')).length
    const totalSize = documents.reduce((sum, d) => sum + (d.file_size || 0), 0)
    
    return { total, pdf, images, docs, totalSize }
  }

  const stats = getDocumentStats()

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading documents...</p>
      </div>
    )
  }

  return (
    <div className={styles.documentsPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerInfo}>
              <h1 className={styles.title}>Documents</h1>
              <p className={styles.subtitle}>
                Manage all your project documents with AI-powered search
              </p>
            </div>
            
            <Button
              variant="accent"
              icon={<Upload size={16} />}
              onClick={() => setShowUpload(true)}
            >
              Upload Documents
            </Button>
          </div>

          {/* Stats */}
          <div className={styles.statsGrid}>
            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <FileText className={styles.statIcon} />
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stats.total}</div>
                  <div className={styles.statLabel}>Total Documents</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <File className={styles.statIcon} />
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stats.pdf}</div>
                  <div className={styles.statLabel}>PDFs</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <Image className={styles.statIcon} />
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stats.images}</div>
                  <div className={styles.statLabel}>Images</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <Folder className={styles.statIcon} />
                <div className={styles.statContent}>
                  <div className={styles.statValue}>
                    {(stats.totalSize / (1024 * 1024)).toFixed(1)}MB
                  </div>
                  <div className={styles.statLabel}>Total Size</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className={styles.uploadModal}>
            <div className={styles.uploadModalContent}>
              <div className={styles.uploadModalHeader}>
                <h3>Upload Documents</h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setShowUpload(false)}
                >
                  ×
                </button>
              </div>
              
              <div className={styles.uploadModalBody}>
                <div className={styles.projectSelector}>
                  <label>Select Project:</label>
                  <select
                    value={selectedProject === 'all' ? '' : selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className={styles.projectSelect}
                  >
                    <option value="">Choose a project...</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedProject !== 'all' && selectedProject && (
                  <FileUpload
                    projectId={selectedProject}
                    onUploadComplete={() => {
                      fetchProjectDocuments(selectedProject)
                      setShowUpload(false)
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className={styles.controls}>
          <div className={styles.searchAndFilter}>
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
            />
            
            <select
              className={styles.filterSelect}
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <select
              className={styles.filterSelect}
              value={fileTypeFilter}
              onChange={(e) => setFileTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="pdf">PDFs</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <Card variant="glass" padding="large" className={styles.emptyState}>
            <FileText size={48} className={styles.emptyIcon} />
            <h3>No documents found</h3>
            <p>
              {searchTerm || selectedProject !== 'all' || fileTypeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Upload your first document to get started'
              }
            </p>
            {!searchTerm && selectedProject === 'all' && fileTypeFilter === 'all' && (
              <Button
                variant="accent"
                icon={<Upload size={16} />}
                onClick={() => setShowUpload(true)}
              >
                Upload Documents
              </Button>
            )}
          </Card>
        ) : (
          <div className={styles.documentsGrid}>
            {filteredDocuments.map((document) => {
              const IconComponent = getFileIcon(document.mime_type)
              const project = projects.find(p => p.id === document.project_id)
              
              return (
                <Card key={document.id} variant="glass" padding="medium" interactive>
                  <div className={styles.documentCard}>
                    <div className={styles.documentHeader}>
                      <IconComponent className={styles.documentIcon} />
                      <button className={styles.menuButton}>
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    
                    <div className={styles.documentInfo}>
                      <h4 className={styles.documentName}>{document.name}</h4>
                      <p className={styles.documentProject}>{project?.name}</p>
                      <div className={styles.documentMeta}>
                        <span>{formatFileSize(document.file_size)}</span>
                        <span>•</span>
                        <span>v{document.version}</span>
                        <span>•</span>
                        <span>{formatDate(document.created_at)}</span>
                      </div>
                    </div>
                    
                    <div className={styles.documentActions}>
                      <button className={styles.actionButton}>
                        <Eye size={16} />
                      </button>
                      <button className={styles.actionButton}>
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}