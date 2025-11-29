import React, { useState } from 'react';
import { uploadInvoice } from '../services/api';
import { useData } from '../contexts/DataContext';

export default function InvoiceUploadPage() {
  const { saveAnalysisResult } = useData();
  // ✅ FIX: Define merchantId state
  const [merchantId, setMerchantId] = useState(1);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      // setDragActive(true);
    } else if (e.type === 'dragleave') {
      // setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // ✅ CRITICAL FIX: Use merchantId from state
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('❌ Please select a file');
      return;
    }
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      console.log(' Uploading file:', file.name);
      console.log(' Merchant ID:', merchantId); // ✅ Now defined
      // ✅ Pass merchantId correctly
      const uploadResponse = await uploadInvoice(file, merchantId);
      if (uploadResponse.status === 'success') {
        setResult({
          success: true,
          invoice_id: uploadResponse.data.file_id,
          message: '✅ Invoice uploaded successfully!',
          file_path: uploadResponse.data.file_path,
          file_size: uploadResponse.data.file_size
        });
        // Save to context
        saveAnalysisResult(uploadResponse.data);
        setFile(null);
        setTimeout(() => setResult(null), 5000);
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
      setError(err.safeMessage || err.message || 'Upload failed. Check console.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div>
        <h1>Upload Invoice</h1>
        <p>
          Upload your GST/tax invoice to get instant financing offers powered by AI agent
        </p>
      </div>

      {/* Merchant ID Selector */}
      <div style={{ margin: '16px 0' }}>
        <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
          Select Merchant
        </label>
        <select
          value={merchantId}
          onChange={(e) => setMerchantId(parseInt(e.target.value))}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          <option value={1}>Merchant 1 - Tech Supplies Inc</option>
          <option value={2}>Merchant 2 - Manufacturing Co</option>
          <option value={3}>Merchant 3 - Wholesale Traders</option>
        </select>
      </div>

      {!uploading && !result && (
        <form onSubmit={handleSubmit}>
          {/* Upload Area */}
          <div
            onClick={() => document.getElementById('file-input').click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              cursor: 'pointer',
              border: '2px dashed var(--brand-primary)',
              padding: '48px 24px',
              marginBottom: '24px',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              background: 'rgba(16, 185, 129, 0.05)',
              transition: 'all 0.3s ease'
            }}
          >
            <div />
            <h3>{file ? file.name : 'Drag & drop or click to upload'}</h3>
            <p>Accepted: PDF, JPG, PNG • Max 10MB</p>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.jpg,.png,.xlsx,.xls"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files?.[0])}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !file}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px 20px',
              fontSize: '1.05rem',
              opacity: uploading || !file ? 0.5 : 1,
              cursor: uploading || !file ? 'not-allowed' : 'pointer'
            }}
          >
            {uploading ? '⏳ Uploading & Analyzing...' : ' Upload & Analyze'}
          </button>
        </form>
      )}

      {/* Uploading State */}
      {uploading && (
        <div style={{ marginTop: 16 }}>
          <div>⏳</div>
          <p>Processing your invoice...</p>
          <p>Verifying with IRP • Running agent analysis • Generating offer...</p>
        </div>
      )}

      {/* Success State */}
      {result && (
        <div style={{ marginTop: 16 }}>
          <div>✅</div>
          <h2>{result.message}</h2>
          <p>
            Invoice ID: <strong>{result.invoice_id}</strong>
          </p>

          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <div style={{ flex: 1 }}>
              <p>File Name</p>
              <p>{result.file_path.split('/').pop()}</p>
            </div>
            <div style={{ flex: 1 }}>
              <p>File Size</p>
              <p>{(result.file_size / 1024).toFixed(2)} KB</p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              setFile(null);
              setResult(null);
            }}
            style={{ width: '100%', marginTop: '16px' }}
          >
            Upload Another
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ marginTop: 12, color: 'var(--danger)' }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
