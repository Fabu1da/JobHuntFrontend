import { useRef, useState, type ChangeEvent } from 'react'
import { extractProfileFromCV, extractTextFromODF, extractTextFromPDF, pdfToImages } from '../service/parsePdf';
import { useFilterContext } from '../hooks/useContext';

export const Upload = () => {

    const [cvLoading, setCvLoading] = useState(false);
    const [cvFileName, setCvFileName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {setError, setProfile } = useFilterContext();
    
    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      setCvLoading(true);
      setCvFileName(file.name);
  
      try {
        let text = '';
        let pdfImages: string[] | undefined;
        
        if (file.type === 'application/pdf') {
          // Convert PDF pages to images for OpenAI vision API
          pdfImages = await pdfToImages(file);
          text = await extractTextFromPDF(file); // Fallback text extraction
        } else if (file.name.endsWith('.odt') || file.name.endsWith('.odf')) {
          text = await extractTextFromODF(file);
        } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          text = await file.text();
        } else {
          // Try to read as text for other formats
          text = await file.text();
        }
        
        // Extract profile from CV using AI (with PDF images for vision if available)
        const extractedProfile = await extractProfileFromCV(text, pdfImages);
        console.log('Extracted profile:', extractedProfile);
        if (extractedProfile) {
          setProfile(extractedProfile);
        } else {
          setError('Could not extract profile from CV. Please try again.');
        }
      } catch (err) {
        console.error('Error reading file:', err);
        setError('Failed to read CV file. Please try a different format.');
        setCvFileName('');
      } finally {
        setCvLoading(false);
      }
    };

  const clearCV = () => {
    setCvFileName('');
    setProfile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <>
      {/* CV Upload Section */}
      <div className="cv-upload-section">
        <div className="cv-upload-header">
          <div className="input-label">Your CV / Resume</div>
          <span className="cv-hint">Upload your CV to get personalized job matching scores</span>
        </div>
        <div className="cv-upload-area">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx,.odt,.odf"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="cv-upload"
          />
          {!cvFileName ? (
            <label htmlFor="cv-upload" className="cv-upload-label">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Click to upload CV</span>
              <span className="cv-formats">PDF, TXT, ODF supported</span>
            </label>
          ) : (
            <div className="cv-uploaded">
              {cvLoading ? (
                <div className="cv-loading">
                  <div className="spinner" style={{ width: 20, height: 20 }} />
                  <span>Analyzing CV...</span>
                </div>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="cv-filename">{cvFileName}</span>
                  <button className="cv-clear-btn" onClick={clearCV} title="Remove CV">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      </>
  )
}
