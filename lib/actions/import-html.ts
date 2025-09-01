'use server';

export interface ImportHtmlResult {
  success: boolean;
  html?: string;
  error?: string;
}

export async function importHtmlFromUrl(url: string): Promise<ImportHtmlResult> {
  try {
    // Validate URL
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return {
        success: false,
        error: 'Invalid URL format'
      };
    }

    // Only allow HTTP and HTTPS protocols for security
    if (!['http:', 'https:'].includes(validUrl.protocol)) {
      return {
        success: false,
        error: 'Only HTTP and HTTPS URLs are allowed'
      };
    }

    // Fetch the HTML content
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BlogImporter/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache',
      },
      // Set a reasonable timeout
      signal: AbortSignal.timeout(30000), // 30 seconds
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch content: ${response.status} ${response.statusText}`
      };
    }

    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      return {
        success: false,
        error: 'URL does not return HTML content'
      };
    }

    // Get the HTML content
    const html = await response.text();
    
    if (!html.trim()) {
      return {
        success: false,
        error: 'No content found at the provided URL'
      };
    }

    // Basic HTML sanitization - remove script tags and potentially harmful content
    let sanitizedHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^>]*>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');

    // Check if HTML contains elements with 'prose' class and extract only that content
    const proseRegex = /class\s*=\s*['"]*[^'"]*\bprose\b[^'"]*['"]/i;
    
    if (proseRegex.test(sanitizedHtml)) {
      // Look for elements with prose class using a more flexible approach
      const proseElementRegex = /<(div|article|section|main|aside)\s+[^>]*class\s*=\s*['"]*[^'"]*\bprose\b[^'"]*['"]*[^>]*>([\s\S]*?)<\/\1>/gi;
      const proseMatches = [...sanitizedHtml.matchAll(proseElementRegex)];
      
      if (proseMatches.length > 0) {
        // Extract content from all prose elements found
        const proseContent = proseMatches.map(match => match[2]).join('\n\n');
        
        // Use the prose content if it's substantial (more than just whitespace)
        if (proseContent.trim().length > 50) {
          sanitizedHtml = proseContent.trim();
        }
      } else {
        // Fallback: try to find any element with prose class (less specific)
        const fallbackProseRegex = /<[^>]*class\s*=\s*['"]*[^'"]*\bprose\b[^'"]*['"]*[^>]*>([\s\S]*?)<\/[^>]+>/gi;
        const fallbackMatches = [...sanitizedHtml.matchAll(fallbackProseRegex)];
        
        if (fallbackMatches.length > 0) {
          const fallbackContent = fallbackMatches[0][1];
          if (fallbackContent.trim().length > 50) {
            sanitizedHtml = fallbackContent.trim();
          }
        }
      }
    }

    return {
      success: true,
      html: sanitizedHtml
    };

  } catch (error) {
    console.error('Error importing HTML:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout - the URL took too long to respond'
        };
      }
      return {
        success: false,
        error: `Failed to import content: ${error.message}`
      };
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred while importing content'
    };
  }
}
