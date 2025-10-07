# ReadAble - Accessible Reading for All

A lightweight, browser-based web tool that improves reading accessibility for neurodiverse and visually impaired learners. ReadAble allows users to paste or upload text, reformat it into dyslexia-friendly styles, and use text-to-speech (TTS) playback — all without needing a backend or internet connection beyond initial load.

## 🌟 Features

### 🎨 Customizable Formatting
- **Font Selection**: Choose from OpenDyslexic (dyslexia-friendly), Arial, or Times New Roman
- **Color Themes**: Light, Dark, and Sepia themes for different visual preferences
- **Font Size**: Adjustable from 14px to 28px with real-time preview
- **Line Spacing**: Toggle between normal and wide spacing for better readability

### 🔊 Text-to-Speech
- **Built-in Speech Synthesis**: Uses Web Speech API for high-quality audio
- **Playback Controls**: Play, pause, resume, and stop functionality
- **Status Indicators**: Real-time feedback on speech status
- **Keyboard Shortcuts**: Quick access to speech controls

### 💾 Smart Storage
- **Local Preferences**: All settings saved in your browser
- **No Data Collection**: Everything stays on your device
- **Persistent Settings**: Your preferences are remembered across sessions

### 📁 File Support
- **Text Upload**: Upload .txt files directly
- **Paste Support**: Copy and paste text from any source
- **Real-time Formatting**: See changes instantly as you type

### ♿ Accessibility First
- **WCAG 2.1 Compliant**: Meets accessibility guidelines
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast**: Support for high contrast modes
- **Focus Indicators**: Clear visual focus states

## 🚀 Getting Started

### Option 1: Use Online (Recommended)
1. Visit the live ReadAble application
2. Paste your text or upload a .txt file
3. Customize the formatting using the toolbar
4. Use text-to-speech if needed
5. Your settings are automatically saved!

### Option 2: Run Locally
1. Download or clone this repository
2. Open `index.html` in a modern web browser
3. Start using ReadAble immediately - no installation required!

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Space` | Play/Pause speech |
| `Ctrl + S` | Stop speech |
| `Ctrl + +` | Increase font size |
| `Ctrl + -` | Decrease font size |
| `Ctrl + /` | Show keyboard shortcuts |
| `Esc` | Close modal |
| `Tab` | Navigate between controls |

## 🛠️ Technical Details

### Built With
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Responsive design and theming
- **Vanilla JavaScript**: Interactive features and speech synthesis
- **Web Speech API**: Built-in text-to-speech functionality
- **localStorage API**: Persistent user preferences
- **OpenDyslexic Font**: Designed to improve readability for dyslexic users

### Browser Support
- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Safari
- ⚠️ Firefox (partial TTS support)

### File Structure
```
readable/
├── index.html          # Main application page
├── about.html          # About page
├── css/
│   └── style.css       # All styles and themes
├── js/
│   └── main.js         # Application logic
├── assets/
│   ├── fonts/          # Font files (if needed)
│   └── icons/          # Icon files (if needed)
└── README.md           # This file
```

## 🎯 Use Cases

### For Students
- **Dyslexia Support**: Use OpenDyslexic font and wide spacing
- **Visual Fatigue**: Switch to dark or sepia themes
- **Auditory Learning**: Listen to text while reading
- **Focus**: Remove distractions with clean formatting

### For Professionals
- **Document Review**: Format long documents for easier reading
- **Presentation Prep**: Practice with text-to-speech
- **Accessibility Testing**: Ensure content is readable for all users

### For Everyone
- **Eye Strain Reduction**: Adjust themes and font sizes
- **Reading Speed**: Optimize formatting for your reading style
- **Multitasking**: Listen while doing other tasks

## 🔧 Customization

### Adding New Themes
1. Open `css/style.css`
2. Add a new theme class (e.g., `.custom-theme`)
3. Define colors and styles
4. Update the theme selector in `index.html`
5. Add theme logic in `js/main.js`

### Adding New Fonts
1. Add font import to `index.html`
2. Update font selector options
3. Add font family logic in JavaScript

## 🤝 Contributing

ReadAble is designed to be simple and accessible. Contributions are welcome!

### Areas for Improvement
- Additional file format support (PDF, DOCX)
- Voice selection options
- Cloud storage integration
- Multi-language support
- Advanced accessibility features

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **OpenDyslexic Font**: Created by Abelardo Gonzalez for dyslexia support
- **Web Speech API**: Browser-native text-to-speech functionality
- **WCAG Guidelines**: Web Content Accessibility Guidelines for inclusive design

## 📞 Support

If you encounter any issues or have suggestions for improvement:
1. Check the browser console for error messages
2. Ensure you're using a supported browser
3. Try refreshing the page and reloading settings

---

**ReadAble** - Making digital reading accessible, one text at a time. 🌟
