"use client"
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Film, ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useCreatorActions } from '../../hooks/useCreatorActions';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button 
        onClick={resetErrorBoundary}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}

export default function CreateProject() {
  const router = useRouter();
  const { account, isConnected } = useWallet();
  const { createProject, isProcessing, error, transactionHash } = useCreatorActions();
  const fileInputRef = useRef(null);
  
  // Initial form state
  const initialFormState = {
    title: '',
    description: '',
    coverImageURI: '',
    fundingGoal: '1',
    totalShares: '1000',
    tierPricing: ['0.01', '0.05', '0.1', '0.5'],
    tierShares: ['10', '50', '100', '500']
  };

  const [formData, setFormData] = useState(initialFormState);
  const [uploadState, setUploadState] = useState({
    isUploading: false,
    progress: 0,
    previewImage: null
  });
  const [errors, setErrors] = useState({});
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Set preview
    const reader = new FileReader();
    reader.onload = (e) => setUploadState(prev => ({...prev, previewImage: e.target.result}));
    reader.readAsDataURL(file);

    try {
      setUploadState(prev => ({...prev, isUploading: true, progress: 0}));
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      const { cid } = await response.json();
      const ipfsUri = `ipfs://${cid}`;
      
      setFormData(prev => ({ ...prev, coverImageURI: ipfsUri }));
    } catch (err) {
      console.error('Error uploading to IPFS:', err);
      setErrors(prev => ({ ...prev, coverImage: err.message || 'Failed to upload image' }));
    } finally {
      setUploadState(prev => ({...prev, isUploading: false}));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTierChange = (index, field, value) => {
    const newTiers = [...formData[field]];
    newTiers[index] = value;
    setFormData(prev => ({ ...prev, [field]: newTiers }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.coverImageURI) newErrors.coverImage = 'Cover image is required';
    if (!formData.fundingGoal || Number(formData.fundingGoal) <= 0) 
      newErrors.fundingGoal = 'Funding goal must be positive';
    if (!formData.totalShares || Number(formData.totalShares) <= 0) 
      newErrors.totalShares = 'Total shares must be positive';
    
    formData.tierPricing.forEach((price, i) => {
      if (!price || Number(price) <= 0) 
        newErrors[`tierPricing_${i}`] = 'Price must be positive';
    });
    
    formData.tierShares.forEach((shares, i) => {
      if (!shares || Number(shares) <= 0) 
        newErrors[`tierShares_${i}`] = 'Shares must be positive';
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
  
    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        coverImageURI: formData.coverImageURI,
        fundingGoal: (Number(formData.fundingGoal) * 10 ** 18).toString(),
        totalShares: formData.totalShares,
        tierPricing: formData.tierPricing.map(price => (Number(price) * 10 ** 18).toString()),
        tierShares: formData.tierShares
      };
  
      const success = await createProject(projectData);
      if (success) {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      // Error is already set by useCreatorActions
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Film className="text-blue-500" size={32} />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
            BacklotFlix
          </span>
        </div>
        <Link href="/projects" className="flex items-center text-gray-300 hover:text-white">
          <ArrowLeft className="mr-1" size={18} />
          Back to Projects
        </Link>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
        <p className="text-gray-300 mb-8">
          Fill out the details below to launch your film project and start raising funds
        </p>

        {/* Wallet Not Connected Message */}
        {!isConnected && (
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-xl mb-2">Wallet Not Connected</h3>
            <p className="text-gray-300">
              Please connect your wallet using the button in the navigation bar to create a project.
            </p>
          </div>
        )}

        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            setFormData(initialFormState);
            setUploadState({ isUploading: false, progress: 0, previewImage: null });
          }}
        >
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Project Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full bg-gray-800/60 border ${errors.title ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your project title"
                disabled={!isConnected}
              />
              {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
            </div>

            {/* Project Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full bg-gray-800/60 border ${errors.description ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Tell potential investors about your project..."
                disabled={!isConnected}
              />
              {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Cover Image*
              </label>
              <div className="flex flex-col space-y-4">
                <div 
                  className="w-full h-64 bg-gray-800/60 rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => fileInputRef.current.click()}
                >
                  {uploadState.previewImage ? (
                    <img 
                      src={uploadState.previewImage} 
                      alt="Cover preview" 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500 p-6 text-center">
                      <Upload size={32} className="mb-2" />
                      <span>Click to upload cover image</span>
                      <span className="text-xs mt-1">Recommended size: 1200x675px</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    disabled={!isConnected || uploadState.isUploading}
                  />
                </div>
                
                {uploadState.isUploading && (
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${uploadState.progress}%` }}
                    ></div>
                  </div>
                )}
                
                {formData.coverImageURI && !uploadState.isUploading && (
                  <div className="text-xs text-gray-400 break-all">
                    IPFS CID: {formData.coverImageURI.replace('ipfs://', '')}
                  </div>
                )}
                
                {errors.coverImage && (
                  <p className="text-sm text-red-400">{errors.coverImage}</p>
                )}
              </div>
            </div>

            {/* Funding Goal */}
            <div>
              <label htmlFor="fundingGoal" className="block text-sm font-medium text-gray-300 mb-1">
                Funding Goal (ETH)*
              </label>
              <input
                type="number"
                id="fundingGoal"
                name="fundingGoal"
                min="0.01"
                step="0.01"
                value={formData.fundingGoal}
                onChange={handleInputChange}
                className={`w-full bg-gray-800/60 border ${errors.fundingGoal ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={!isConnected}
              />
              {errors.fundingGoal && <p className="mt-1 text-sm text-red-400">{errors.fundingGoal}</p>}
            </div>

            {/* Total Shares */}
            <div>
              <label htmlFor="totalShares" className="block text-sm font-medium text-gray-300 mb-1">
                Total Shares Available*
              </label>
              <input
                type="number"
                id="totalShares"
                name="totalShares"
                min="100"
                step="100"
                value={formData.totalShares}
                onChange={handleInputChange}
                className={`w-full bg-gray-800/60 border ${errors.totalShares ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={!isConnected}
              />
              {errors.totalShares && <p className="mt-1 text-sm text-red-400">{errors.totalShares}</p>}
            </div>

            {/* Investment Tiers */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Investment Tiers*
              </label>
              <div className="space-y-4">
                {['Bronze', 'Silver', 'Gold', 'Platinum'].map((tier, index) => (
                  <div key={tier} className="bg-gray-800/40 rounded-lg p-4 border border-gray-700">
                    <h3 className="font-medium text-gray-200 mb-3">{tier} Tier</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`tierPricing-${index}`} className="block text-xs text-gray-400 mb-1">
                          Price (ETH)
                        </label>
                        <input
                          type="number"
                          id={`tierPricing-${index}`}
                          min="0.001"
                          step="0.001"
                          value={formData.tierPricing[index]}
                          onChange={(e) => handleTierChange(index, 'tierPricing', e.target.value)}
                          className={`w-full bg-gray-800/60 border ${errors[`tierPricing_${index}`] ? 'border-red-500' : 'border-gray-700'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          disabled={!isConnected}
                        />
                        {errors[`tierPricing_${index}`] && (
                          <p className="mt-1 text-xs text-red-400">{errors[`tierPricing_${index}`]}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor={`tierShares-${index}`} className="block text-xs text-gray-400 mb-1">
                          Shares Offered
                        </label>
                        <input
                          type="number"
                          id={`tierShares-${index}`}
                          min="1"
                          step="1"
                          value={formData.tierShares[index]}
                          onChange={(e) => handleTierChange(index, 'tierShares', e.target.value)}
                          className={`w-full bg-gray-800/60 border ${errors[`tierShares_${index}`] ? 'border-red-500' : 'border-gray-700'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          disabled={!isConnected}
                        />
                        {errors[`tierShares_${index}`] && (
                          <p className="mt-1 text-xs text-red-400">{errors[`tierShares_${index}`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link
                href="/projects"
                className="px-6 py-3 border border-gray-700 rounded-lg font-medium hover:bg-gray-800/60 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!isConnected || isProcessing || uploadState.isUploading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-32"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </button>
            </div>

            {/* Transaction Status */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                <div className="flex items-center">
                  <span className="text-red-400">Error: {error}</span>
                </div>
              </div>
            )}

            {transactionHash && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
                <div className="flex items-center">
                  <span className="text-green-400">Project created successfully!</span>
                  <a
                    href={`https://sepolia.basescan.org/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-400 hover:text-blue-300"
                  >
                    View on BaseScan
                  </a>
                </div>
              </div>
            )}
          </form>
        </ErrorBoundary>
      </div>
    </div>
  );
}