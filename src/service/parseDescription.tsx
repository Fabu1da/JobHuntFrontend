import React from 'react'

// Unescape markdown escape sequences
const unescapeMarkdown = (text: string) => {
  return text.replace(/\\(.)/g, '$1'); // Replace \x with x
};

// Convert markdown bold to strong
const renderMarkdownText = (text: string) => {
  const cleanText = unescapeMarkdown(text);
  const parts = cleanText.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.replace(/\*\*/g, '')}</strong>;
    }
    return part;
  });
};

export const parseJobDescription = (text: string) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.JSX.Element[] = [];
  let bulletList: string[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Flush bullet list if we hit a non-bullet line
    if (bulletList.length > 0 && !trimmed.startsWith('*') && trimmed) {
      elements.push(
        <ul key={`list-${idx}`} className="job-bullet-list">
          {bulletList.map((item, i) => (
            <li key={i}>{renderMarkdownText(item.replace(/^\*\s*/, ''))}</li>
          ))}
        </ul>
      );
      bulletList = [];
    }

    if (!trimmed) {
      // Empty line - add spacing
      elements.push(<div key={`space-${idx}`} style={{ height: '6px' }} />);
    } else if (trimmed.match(/^-+$/)) {
      // Separator line
      elements.push(<div key={`sep-${idx}`} className="job-separator" />);
    } else if (trimmed.match(/^#{1,6}\s+/)) {
      // Markdown heading (# through ######)
      const title = unescapeMarkdown(trimmed.replace(/^#{1,6}\s+/, ''));
      elements.push(
        <h3 key={`header-${idx}`} className="job-section-header">
          {title}
        </h3>
      );
    } else if (trimmed.match(/^\*\*.+\*\*$/)) {
      // Section header (surrounded by **)
      const title = unescapeMarkdown(trimmed).replace(/\*\*/g, '');
      elements.push(
        <h3 key={`header-${idx}`} className="job-section-header">
          {title}
        </h3>
      );
    } else if (trimmed.startsWith('*')) {
      // Bullet point (starts with *)
      bulletList.push(trimmed);
    } else {
      // Regular text - convert ** to bold and unescape
      elements.push(
        <p key={`para-${idx}`} className="job-text">
          {renderMarkdownText(trimmed)}
        </p>
      );
    }
  });

  // Flush remaining bullet list
  if (bulletList.length > 0) {
    elements.push(
      <ul key="list-final" className="job-bullet-list">
        {bulletList.map((item, i) => (
          <li key={i}>{renderMarkdownText(item.replace(/^\*\s*/, ''))}</li>
        ))}
      </ul>
    );
  }

  return <div className="job-description-parsed">{elements}</div>;
};


