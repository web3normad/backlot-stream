// app/streaming/upload/page.jsx
'use client'

import { useState, useCallback } from 'react'
import { Upload, Film, X, Check, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

export default function MovieUploadPage() {
  const [file, setFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    year: '',
    price: '',
    isPremium: false,
    isOriginal: false
  })

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxFiles: 1
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    
    // Simulate upload process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setUploadProgress(i)
    }
    
    setIsUploading(false)
    setIsUploaded(true)
    
    // In a real app, you would:
    // 1. Upload the file to IPFS or decentralized storage
    // 2. Store metadata on-chain
    // 3. Handle payments and revenue splits
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar isCreator={true} />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Your Film</h1>
          <p className="text-gray-400">
            Share your creation with the BacklotFlix community. Once approved, your film will be available for streaming.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-6">Film Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/60 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800/60 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Genre</label>
                    <select
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/60 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Action">Action</option>
                      <option value="Comedy">Comedy</option>
                      <option value="Drama">Drama</option>
                      <option value="Sci-Fi">Sci-Fi</option>
                      <option value="Horror">Horror</option>
                      <option value="Documentary">Documentary</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Year</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      min="1900"
                      max="2030"
                      className="w-full px-4 py-3 bg-gray-800/60 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (USDC)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-800/60 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Set to 0 for free viewing</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="isPremium"
                      checked={formData.isPremium}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-500 rounded border-gray-700 focus:ring-blue-500 bg-gray-800"
                    />
                    <span className="text-sm">Premium content (requires subscription)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="isOriginal"
                      checked={formData.isOriginal}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-500 rounded border-gray-700 focus:ring-blue-500 bg-gray-800"
                    />
                    <span className="text-sm">Backlot Original (eligible for special promotion)</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-6">Video File</h2>
              
              {!file ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">
                    {isDragActive ? 'Drop the video file here' : 'Drag & drop your video file'}
                  </p>
                  <p className="text-sm text-gray-400 mb-4">MP4, MOV, or AVI. Max 5GB.</p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    Select File
                  </button>
                </div>
              ) : (
                <div className="border border-gray-700 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Film className="h-10 w-10 text-blue-400" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="p-1 text-gray-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {isUploading ? (
                    <div className="space-y-4">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Uploading... {uploadProgress}%</span>
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  ) : isUploaded ? (
                    <div className="p-4 bg-green-500/20 rounded-lg flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-400" />
                      <span>Upload complete! Your film is under review.</span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-medium transition-colors"
                    >
                      Upload to Backlot
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <h2 className="text-xl font-bold mb-6">Revenue & Rights</h2>
            
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 mb-6">
              <h3 className="font-bold mb-4">Revenue Split</h3>
              <p className="text-sm text-gray-400 mb-4">
                By default, revenue from your film will be split as follows:
              </p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">You (Creator)</span>
                  <span className="font-medium">70%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Investors</span>
                  <span className="font-medium">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Backlot Platform</span>
                  <span className="font-medium">10%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-500 rounded border-gray-700 focus:ring-blue-500 bg-gray-800 mt-1"
                  required
                />
                <span className="text-sm">
                  I confirm that I have all necessary rights to distribute this content and agree to the{' '}
                  <Link href="#" className="text-blue-400 hover:underline">Terms of Service</Link> and{' '}
                  <Link href="#" className="text-blue-400 hover:underline">Content Policy</Link>.
                </span>
              </label>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!file || isUploading || isUploaded}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                      Processing...
                    </>
                  ) : isUploaded ? (
                    'Submitted for Review'
                  ) : (
                    'Publish Film'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
      
      <Footer isCreator={true} />
    </div>
  )
}