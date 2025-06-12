'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Key,
  Mail,
  Phone,
  Building,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import Card from '@/components/ui/Card/Card'
import styles from './settings.module.css'

export default function SettingsPage() {
  const router = useRouter()
  const { user, signOut } = useAuthStore()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    role: 'team_member'
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    taskAssignments: true,
    documentUploads: false,
    weeklyReports: true
  })

  useEffect(() => {
    if (!user) {
      router.push('/signin')
      return
    }
    
    // Load user profile data
    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          company: data.company || '',
          role: data.role || 'team_member'
        })
      }
    }
    
    loadProfile()
  }, [user, router])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          company: profileData.company,
          role: profileData.role
        })
        .eq('id', user?.id)

      if (error) throw error
      
      setMessage('Profile updated successfully!')
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error
      
      setMessage('Password updated successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      // Sign out and redirect
      await signOut()
      router.push('/')
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
  ]

  return (
    <div className={styles.settingsPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>
            Manage your account settings and preferences
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.success}`}>
            {message}
          </div>
        )}

        <div className={styles.settingsLayout}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <nav className={styles.tabNavigation}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className={styles.content}>
            {activeTab === 'profile' && (
              <Card variant="glass" padding="large">
                <div className={styles.sectionHeader}>
                  <h2>Profile Information</h2>
                  <p>Update your personal information and contact details</p>
                </div>

                <form onSubmit={handleProfileUpdate} className={styles.form}>
                  <div className={styles.formGrid}>
                    <Input
                      label="Full Name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                      icon={<User size={16} />}
                    />

                    <Input
                      label="Email"
                      type="email"
                      value={profileData.email}
                      disabled
                      icon={<Mail size={16} />}
                    />

                    <Input
                      label="Phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      icon={<Phone size={16} />}
                    />

                    <Input
                      label="Company"
                      value={profileData.company}
                      onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                      icon={<Building size={16} />}
                    />

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Role</label>
                      <select
                        className={styles.select}
                        value={profileData.role}
                        onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
                      >
                        <option value="admin">Admin</option>
                        <option value="project_manager">Project Manager</option>
                        <option value="contractor">Contractor</option>
                        <option value="client">Client</option>
                        <option value="team_member">Team Member</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <Button
                      type="submit"
                      variant="accent"
                      loading={loading}
                      icon={<Save size={16} />}
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {activeTab === 'security' && (
              <div className={styles.securityContent}>
                <Card variant="glass" padding="large">
                  <div className={styles.sectionHeader}>
                    <h2>Change Password</h2>
                    <p>Update your password to keep your account secure</p>
                  </div>

                  <form onSubmit={handlePasswordUpdate} className={styles.form}>
                    <Input
                      label="Current Password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      icon={<Key size={16} />}
                    />

                    <Input
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      icon={<Key size={16} />}
                    />

                    <Input
                      label="Confirm New Password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      icon={<Key size={16} />}
                    />

                    <div className={styles.passwordToggle}>
                      <button
                        type="button"
                        className={styles.toggleButton}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        {showPassword ? 'Hide' : 'Show'} passwords
                      </button>
                    </div>

                    <div className={styles.formActions}>
                      <Button
                        type="submit"
                        variant="accent"
                        loading={loading}
                        icon={<Save size={16} />}
                      >
                        Update Password
                      </Button>
                    </div>
                  </form>
                </Card>

                <Card variant="glass" padding="large">
                  <div className={styles.sectionHeader}>
                    <h2>Danger Zone</h2>
                    <p>Irreversible and destructive actions</p>
                  </div>

                  <div className={styles.dangerZone}>
                    <div className={styles.dangerItem}>
                      <div>
                        <h4>Delete Account</h4>
                        <p>Permanently delete your account and all associated data</p>
                      </div>
                      <Button
                        variant="danger"
                        onClick={handleDeleteAccount}
                        loading={loading}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'notifications' && (
              <Card variant="glass" padding="large">
                <div className={styles.sectionHeader}>
                  <h2>Notification Preferences</h2>
                  <p>Choose how you want to be notified about updates</p>
                </div>

                <div className={styles.notificationSettings}>
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className={styles.notificationItem}>
                      <div className={styles.notificationInfo}>
                        <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                        <p>Get notified about {key.toLowerCase().replace(/([A-Z])/g, ' $1')}</p>
                      </div>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            [key]: e.target.checked
                          }))}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                  ))}
                </div>

                <div className={styles.formActions}>
                  <Button
                    variant="accent"
                    icon={<Save size={16} />}
                  >
                    Save Preferences
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'preferences' && (
              <Card variant="glass" padding="large">
                <div className={styles.sectionHeader}>
                  <h2>App Preferences</h2>
                  <p>Customize your app experience</p>
                </div>

                <div className={styles.preferenceSettings}>
                  <div className={styles.preferenceItem}>
                    <div className={styles.preferenceInfo}>
                      <h4>Theme</h4>
                      <p>Choose your preferred color scheme</p>
                    </div>
                    <select className={styles.select}>
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div className={styles.preferenceItem}>
                    <div className={styles.preferenceInfo}>
                      <h4>Language</h4>
                      <p>Select your preferred language</p>
                    </div>
                    <select className={styles.select}>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>

                  <div className={styles.preferenceItem}>
                    <div className={styles.preferenceInfo}>
                      <h4>Timezone</h4>
                      <p>Set your local timezone</p>
                    </div>
                    <select className={styles.select}>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <Button
                    variant="accent"
                    icon={<Save size={16} />}
                  >
                    Save Preferences
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}