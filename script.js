// Storage key for localStorage
const STORAGE_KEY = 'slidepage_urls';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadPublicUrls();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('urlForm');
    const copyBtn = document.getElementById('copyBtn');
    const newUrlBtn = document.getElementById('newUrlBtn');
    const shareEmail = document.getElementById('shareEmail');
    const shareTwitter = document.getElementById('shareTwitter');
    const shareFacebook = document.getElementById('shareFacebook');
    const urlInput = document.getElementById('urlInput');
    const titleInput = document.getElementById('titleInput');

    form.addEventListener('submit', handleFormSubmit);
    copyBtn.addEventListener('click', copyToClipboard);
    newUrlBtn.addEventListener('click', resetForm);
    shareEmail.addEventListener('click', shareViaEmail);
    shareTwitter.addEventListener('click', shareViaTwitter);
    shareFacebook.addEventListener('click', shareViaFacebook);
    
    // Clear errors on input
    urlInput.addEventListener('input', () => clearError(urlInput));
    titleInput.addEventListener('input', () => clearError(titleInput));
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const urlInput = document.getElementById('urlInput');
    const titleInput = document.getElementById('titleInput');
    
    const url = urlInput.value.trim();
    const title = titleInput.value.trim() || 'Untitled';
    
    // Validate URL
    if (!isValidUrl(url)) {
        showError(urlInput, 'Please enter a valid URL');
        return;
    }
    
    // Save to storage
    savePublicUrl(url, title);
    
    // Display the public URL
    displayPublicUrl(url, title);
    
    // Show success section
    document.querySelector('.form-section').style.display = 'none';
    document.getElementById('publicUrlSection').style.display = 'block';
    
    // Reload the list
    loadPublicUrls();
}

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Save URL to localStorage
function savePublicUrl(url, title) {
    const urls = getStoredUrls();
    const newEntry = {
        url: url,
        title: title,
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    urls.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
}

// Get stored URLs
function getStoredUrls() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Display the public URL
function displayPublicUrl(url, title) {
    document.getElementById('displayTitle').textContent = title;
    const displayUrlElement = document.getElementById('displayUrl');
    displayUrlElement.href = url;
    displayUrlElement.textContent = url;
}

// Copy URL to clipboard
function copyToClipboard() {
    const url = document.getElementById('displayUrl').textContent;
    const btn = document.getElementById('copyBtn');
    const originalText = btn.textContent;
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            btn.textContent = '✓ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopyToClipboard(url, btn, originalText);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(url, btn, originalText);
    }
}

// Fallback clipboard copy method
function fallbackCopyToClipboard(text, btn, originalText) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            btn.textContent = '✓ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        } else {
            btn.textContent = 'Copy failed';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }
    } catch (err) {
        console.error('Fallback: Failed to copy', err);
        btn.textContent = 'Copy failed';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }
    
    document.body.removeChild(textArea);
}

// Reset form
function resetForm() {
    document.getElementById('urlForm').reset();
    document.querySelector('.form-section').style.display = 'block';
    document.getElementById('publicUrlSection').style.display = 'none';
}

// Load and display public URLs
function loadPublicUrls() {
    const urls = getStoredUrls();
    const urlsList = document.getElementById('urlsList');
    
    if (urls.length === 0) {
        urlsList.innerHTML = '<div class="empty-state">No public URLs yet. Create your first one above!</div>';
        return;
    }
    
    urlsList.innerHTML = urls.map(entry => {
        const date = new Date(entry.timestamp);
        const timeString = date.toLocaleString();
        
        return `
            <div class="url-item">
                <div class="url-item-title">${escapeHtml(entry.title)}</div>
                <a href="${escapeHtml(entry.url)}" class="url-item-link" target="_blank" rel="noopener noreferrer">
                    ${escapeHtml(entry.url)}
                </a>
                <div class="url-item-time">Made public on ${timeString}</div>
            </div>
        `;
    }).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show inline error message
function showError(inputElement, message) {
    // Remove any existing error
    clearError(inputElement);
    
    // Add error class to input
    inputElement.classList.add('error');
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Insert error message after input
    inputElement.parentNode.appendChild(errorDiv);
    
    // Auto-remove error after 5 seconds
    setTimeout(() => {
        clearError(inputElement);
    }, 5000);
}

// Clear error message
function clearError(inputElement) {
    inputElement.classList.remove('error');
    const errorMsg = inputElement.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}


// Share via Email
function shareViaEmail() {
    const url = document.getElementById('displayUrl').href;
    const title = document.getElementById('displayTitle').textContent;
    const subject = encodeURIComponent(`Check out: ${title}`);
    const body = encodeURIComponent(`I wanted to share this with you: ${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
}

// Share via Twitter
function shareViaTwitter() {
    const url = document.getElementById('displayUrl').href;
    const title = document.getElementById('displayTitle').textContent;
    const text = encodeURIComponent(`${title}: ${url}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
}

// Share via Facebook
function shareViaFacebook() {
    const url = document.getElementById('displayUrl').href;
    const shareUrl = encodeURIComponent(url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
}
