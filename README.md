# SlidePage - Make URLs Public

A simple, elegant web application for making URLs publicly shareable. Perfect for sharing presentation slides, documents, and any web content.

## Features

- 🔗 **Easy URL Sharing**: Simply paste any URL and make it publicly shareable
- 📋 **Quick Copy**: Copy URLs to clipboard with one click
- 📤 **Social Sharing**: Share via Email, Twitter, or Facebook
- 💾 **Local Storage**: Your public URLs are saved locally in your browser
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ✨ **Clean Interface**: Beautiful, modern UI with gradient design

## How to Use

1. **Open the Application**: Open `index.html` in your web browser
2. **Enter a URL**: Paste the URL you want to make public (e.g., your slide presentation link)
3. **Add a Title** (optional): Give your URL a descriptive title
4. **Click "Make Public"**: Your URL is now publicly shareable!
5. **Share**: Use the copy button or social sharing options to distribute your URL

## Local Development

No build process required! Simply open the `index.html` file in any modern web browser:

```bash
# Option 1: Direct file open
open index.html

# Option 2: Using a simple HTTP server (recommended)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Technology Stack

- Pure HTML5, CSS3, and JavaScript
- No external dependencies
- Uses localStorage for data persistence
- Responsive design with CSS Grid and Flexbox

## Browser Support

Works in all modern browsers that support:
- ES6 JavaScript
- localStorage API
- CSS Grid and Flexbox

## Privacy

All URLs are stored locally in your browser using localStorage. No data is sent to any server. Your URLs remain private to your device unless you choose to share them.

## License

MIT License - Feel free to use and modify as needed.
