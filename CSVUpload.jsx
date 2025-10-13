import React, { useState } from 'react'
import Papa from 'papaparse'
import { supabase } from '../lib/supabase'

export default function CSVUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null)
  const [csvData, setCsvData] = useState([])
  const [headers, setHeaders] = useState([])
  const [mapping, setMapping] = useState({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Upload, 2: Map, 3: Confirm
  const [previewData, setPreviewData] = useState([])

  // Available fields in your Supabase table
  const supabaseFields = [
    { key: 'title', label: 'Title', required: true },
    { key: 'type', label: 'Type', required: false },
    { key: 'url', label: 'URL', required: false },
    { key: 'description', label: 'Description', required: false },
    { key: 'tags', label: 'Tags (comma-separated)', required: false }
  ]

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    setLoading(true)

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('Parsed CSV data:', results.data)
        
        if (results.data.length > 0) {
          setHeaders(Object.keys(results.data[0]))
          setCsvData(results.data)
          setPreviewData(results.data.slice(0, 5)) // Show first 5 rows for preview
          setStep(2)
        }
        setLoading(false)
      },
      error: (error) => {
        console.error('Error parsing CSV:', error)
        alert('Error parsing CSV file: ' + error.message)
        setLoading(false)
      }
    })
  }

  const handleMappingChange = (supabaseField, csvHeader) => {
    setMapping(prev => ({
      ...prev,
      [supabaseField]: csvHeader === 'none' ? null : csvHeader
    }))
  }

  const generatePreviewMapping = () => {
    if (previewData.length === 0) return []

    return previewData.map((row, index) => {
      const mappedRow = {}
      supabaseFields.forEach(field => {
        const csvHeader = mapping[field.key]
        mappedRow[field.key] = csvHeader ? row[csvHeader] : ''
      })
      return { ...mappedRow, _originalIndex: index }
    })
  }

  const processDataForUpload = () => {
    return csvData.map(row => {
      const processedRow = {}
      
      supabaseFields.forEach(field => {
        const csvHeader = mapping[field.key]
        let value = csvHeader ? row[csvHeader] : null
        
        // Special processing for different field types
        if (field.key === 'tags' && value) {
          // If tags are already comma-separated, keep as is
          // If they're in a different format, you can process them here
          value = value.split(',').map(tag => tag.trim()).filter(tag => tag)
        }
        
        if (field.key === 'type' && value) {
          value = value.toLowerCase()
        }
        
        processedRow[field.key] = value
      })
      
      return processedRow
    }).filter(row => row.title) // Only include rows with a title
  }

  const handleUpload = async () => {
    setLoading(true)
    
    try {
      const processedData = processDataForUpload()
      console.log('Uploading data:', processedData)
      
      if (processedData.length === 0) {
        alert('No valid data to upload. Make sure you have mapped the Title field.')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('media_items')
        .insert(processedData)
        .select()

      if (error) throw error

      alert(`Successfully uploaded ${data.length} items!`)
      
      // Reset form
      setFile(null)
      setCsvData([])
      setHeaders([])
      setMapping({})
      setStep(1)
      setPreviewData([])
      
      // Callback to refresh dashboard
      if (onUploadComplete) {
        onUploadComplete(data)
      }
      
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setCsvData([])
    setHeaders([])
    setMapping({})
    setStep(1)
    setPreviewData([])
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Upload CSV from Ninety.io</h2>
      
      {/* Step 1: File Upload */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select CSV File from Ninety.io
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {loading && <p className="text-blue-600">Parsing CSV file...</p>}
        </div>
      )}

      {/* Step 2: Field Mapping */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Map CSV Fields to Database</h3>
            <button
              onClick={resetUpload}
              className="text-gray-500 hover:text-gray-700"
            >
              Start Over
            </button>
          </div>
          
          <p className="text-sm text-gray-600">
            Found {csvData.length} rows with {headers.length} columns. 
            Map your CSV columns to the database fields:
          </p>

          <div className="grid gap-4">
            {supabaseFields.map(field => (
              <div key={field.key} className="flex items-center space-x-4">
                <label className="w-32 text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={mapping[field.key] || 'none'}
                  onChange={(e) => handleMappingChange(field.key, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">-- Select CSV Column --</option>
                  {headers.map(header => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Preview */}
          {Object.keys(mapping).length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Preview (first 5 rows):</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {supabaseFields.map(field => (
                        <th key={field.key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {field.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {generatePreviewMapping().map((row, index) => (
                      <tr key={index} className="border-t">
                        {supabaseFields.map(field => (
                          <td key={field.key} className="px-4 py-2 text-sm text-gray-900 max-w-xs truncate">
                            {row[field.key] || <span className="text-gray-400">--</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => setStep(3)}
              disabled={!mapping.title}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Upload
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm and Upload */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Confirm Upload</h3>
          <p className="text-gray-600">
            Ready to upload {processDataForUpload().length} valid items to your database.
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload to Database'}
            </button>
            <button
              onClick={() => setStep(2)}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Back to Mapping
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
