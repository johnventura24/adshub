import React, { useState } from 'react'
import CSVUpload from './CSVUpload'
import EnhancedDashboard from './EnhancedDashboard'
import UploadForm from './UploadForm'

export default function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleUploadComplete = (newData) => {
    // Trigger dashboard refresh
    setRefreshTrigger(prev => prev + 1)
    // Switch to dashboard to see the results
    setActiveTab('dashboard')
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'csv-upload', label: 'CSV Upload', icon: '📁' },
    { id: 'manual-upload', label: 'Manual Upload', icon: '➕' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                AdSync Media Hub
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Connected to Supabase ✅
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <EnhancedDashboard refreshTrigger={refreshTrigger} />
        )}
        
        {activeTab === 'csv-upload' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">📋 CSV Upload Instructions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Download your CSV file from Ninety.io</li>
                <li>• Upload it here and map the columns to your database fields</li>
                <li>• Preview the data before uploading to ensure accuracy</li>
                <li>• The data will automatically appear in your dashboard</li>
              </ul>
            </div>
            <CSVUpload onUploadComplete={handleUploadComplete} />
          </div>
        )}
        
        {activeTab === 'manual-upload' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">✏️ Manual Upload</h3>
              <p className="text-sm text-green-700">
                Add individual items manually. Perfect for one-off entries or testing.
              </p>
            </div>
            <UploadForm onUploadSuccess={handleUploadComplete} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            AdSync Media Hub - Powered by Supabase
          </p>
        </div>
      </footer>
    </div>
  )
}
