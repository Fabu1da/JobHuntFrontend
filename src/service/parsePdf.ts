import * as pdfjsLib from 'pdfjs-dist';
import type { FilterType, Profile } from '../types';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import JSZip from 'jszip';
import axios from 'axios';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


  
  export const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  };

    export const getScoreClass = (score: number | null | undefined) => {
    if (score === null || score === undefined) return '';
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-mid';
    return 'score-low';
  };


    export const filterButtons: { filter: FilterType; label: string }[] = [
      { filter: 'all', label: 'All' },
      { filter: 'high', label: 'Strong Match (70+)' },
      { filter: 'mid', label: 'Good Match (40+)' },
      { filter: 'linkedin', label: 'LinkedIn' },
      { filter: 'indeed', label: 'Indeed' },
      { filter: 'glassdoor', label: 'Glassdoor' },
      { filter: 'google', label: 'Google Jobs' },
    ];


      // Convert PDF pages to base64 images for OpenAI vision API
  export const pdfToImages = async (file: File): Promise<string[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const images: string[] = [];
    
    // Process first 2 pages (usually enough for a CV)
    const pagesToProcess = Math.min(pdf.numPages, 2);
    
    for (let i = 1; i <= pagesToProcess; i++) {
      const page = await pdf.getPage(i);
      const scale = 2; // Higher scale for better quality
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({ canvasContext: context, viewport, canvas }).promise;
      
      // Convert to base64 PNG (remove the data:image/png;base64, prefix)
      const dataUrl = canvas.toDataURL('image/png');
      const base64 = dataUrl.split(',')[1];
      images.push(base64);
    }
    
    return images;
  };


export const extractTextFromODF = async (file: File): Promise<string> => {
    const zip = await JSZip.loadAsync(file);
    const contentXml = await zip.file('content.xml')?.async('string');
    if (!contentXml) throw new Error('Invalid ODF file');
    
    // Parse XML and extract text content
    const parser = new DOMParser();
    const doc = parser.parseFromString(contentXml, 'text/xml');
    
    // Get all text:p and text:h elements (paragraphs and headings)
    const textElements = doc.querySelectorAll('*');
    let fullText = '';
    
    textElements.forEach(el => {
      if (el.localName === 'p' || el.localName === 'h') {
        fullText += el.textContent + '\n';
      }
    });
    
    return fullText.trim();
  };



export const extractProfileFromCV = async (cvText: string, pdfImages?: string[]): Promise<Profile | null> => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/analyzeCv`, {
        cv_text: cvText,
        pdf_images: pdfImages // Send PDF page images for vision API
      });
      return res.data as Profile;
    } catch (err) {
      console.error('Error extracting profile:', err);
      return null;
    }
  };