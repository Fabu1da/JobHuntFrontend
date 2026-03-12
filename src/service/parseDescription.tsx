import React from 'react'

export const parseJobDescription = (text: string) => {
  
        if (!text) return null;
    
        const lines = text.split('\n');
        const elements: React.JSX.Element[] = [];
        let bulletList: string[] = [];
    
        lines.forEach((line, idx) => {
          const trimmed = line.trim();
    
          // Flush bullet list if we hit a non-bullet line
          if (bulletList.length > 0 && !trimmed.startsWith('*')) {
            elements.push(
              <ul key={`list-${idx}`} className="job-bullet-list">
                {bulletList.map((item, i) => (
                  <li key={i}>{item.replace(/^\*\s*/, '').replace(/\\/g, '')}</li>
                ))}
              </ul>
            );
            bulletList = [];
          }
    
          if (!trimmed) {
            // Empty line - add spacing
            elements.push(<div key={`space-${idx}`} style={{ height: '8px' }} />);
          } else if (trimmed.match(/^-+$/)) {
            // Separator line
            elements.push(<div key={`sep-${idx}`} className="job-separator" />);
          } else if (trimmed.startsWith('*')) {
            // Bullet point
            bulletList.push(trimmed);
          } else if (trimmed.match(/^\*\*.+\*\*$/)) {
            // Section header (surrounded by **)
            const title = trimmed.replace(/\*\*/g, '');
            elements.push(
              <h3 key={`header-${idx}`} className="job-section-header">
                {title}
              </h3>
            );
          } else {
            // Regular text - convert ** to bold
            const parts = trimmed.split(/(\*\*[^*]+\*\*)/);
            const content = parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.replace(/\*\*/g, '')}</strong>;
              }
              return part;
            });
            elements.push(
              <p key={`para-${idx}`} className="job-text">
                {content}
              </p>
            );
          }
        });
    
        // Flush remaining bullet list
        if (bulletList.length > 0) {
          elements.push(
            <ul key="list-final" className="job-bullet-list">
              {bulletList.map((item, i) => (
                <li key={i}>{item.replace(/^\*\s*/, '').replace(/\\/g, '')}</li>
              ))}
            </ul>
          );
        }
    
        return <div className="job-description-parsed">{elements}</div>;
      };


