// ===== ReadAble Main JavaScript File =====
// Handles all interactive functionality including themes, fonts, TTS, and localStorage

class ReadAble {
    constructor() {
        this.synth = window.speechSynthesis;
        this.currentUtterance = null;
        this.isSpeaking = false;
        this.isPaused = false;
        
        // Initialize the application
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedSettings();
        this.updateTextDisplay();
        this.setupKeyboardShortcuts();
        this.checkTTSupport();
        
        console.log('ReadAble initialized successfully');
    }

    // ===== Event Listeners Setup =====
    setupEventListeners() {
        // Font selection
        const fontSelect = document.getElementById('fontSelect');
        if (fontSelect) {
            fontSelect.addEventListener('change', (e) => this.changeFont(e.target.value));
        }

        // Theme selection
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => this.changeTheme(e.target.value));
        }

        // Font size slider
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => this.changeFontSize(e.target.value));
        }

        // Spacing toggle
        const spacingToggle = document.getElementById('spacingToggle');
        if (spacingToggle) {
            spacingToggle.addEventListener('click', () => this.toggleSpacing());
        }

        // Text input
        const textInput = document.getElementById('textInput');
        if (textInput) {
            textInput.addEventListener('input', () => this.updateTextDisplay());
            textInput.addEventListener('paste', () => {
                // Small delay to ensure paste content is processed
                setTimeout(() => this.updateTextDisplay(), 100);
            });
        }

        // File upload
        const fileUpload = document.getElementById('fileUpload');
        if (fileUpload) {
            fileUpload.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // TTS controls
        const playButton = document.getElementById('playButton');
        const pauseButton = document.getElementById('pauseButton');
        const stopButton = document.getElementById('stopButton');

        if (playButton) {
            playButton.addEventListener('click', () => this.playText());
        }
        if (pauseButton) {
            pauseButton.addEventListener('click', () => this.pauseText());
        }
        if (stopButton) {
            stopButton.addEventListener('click', () => this.stopText());
        }

        // Modal controls
        const modal = document.getElementById('keyboardShortcutsModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideKeyboardShortcuts();
                }
            });
        }

        // Handle page visibility change (pause TTS when tab is hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isSpeaking) {
                this.pauseText();
            }
        });
    }

    // ===== Keyboard Shortcuts =====
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case ' ':
                        e.preventDefault();
                        if (this.isSpeaking && !this.isPaused) {
                            this.pauseText();
                        } else if (this.isSpeaking && this.isPaused) {
                            this.resumeText();
                        } else {
                            this.playText();
                        }
                        break;
                    case 's':
                        e.preventDefault();
                        this.stopText();
                        break;
                    case '+':
                    case '=':
                        e.preventDefault();
                        this.increaseFontSize();
                        break;
                    case '-':
                        e.preventDefault();
                        this.decreaseFontSize();
                        break;
                    case '/':
                        e.preventDefault();
                        this.showKeyboardShortcuts();
                        break;
                }
            }

            if (e.key === 'Escape') {
                this.hideKeyboardShortcuts();
            }
        });
    }

    // ===== Font Management =====
    changeFont(fontFamily) {
        const textDisplay = document.getElementById('textDisplay');
        if (textDisplay) {
            textDisplay.style.fontFamily = fontFamily;
            localStorage.setItem('readable-font', fontFamily);
            this.announceChange(`Font changed to ${fontFamily.split(',')[0]}`);
        }
    }

    // ===== Theme Management =====
    changeTheme(theme) {
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('light-theme', 'dark-theme', 'sepia-theme');
        
        // Add new theme class
        body.classList.add(`${theme}-theme`);
        
        // Save to localStorage
        localStorage.setItem('readable-theme', theme);
        
        this.announceChange(`Theme changed to ${theme}`);
    }

    // ===== Font Size Management =====
    changeFontSize(size) {
        const textDisplay = document.getElementById('textDisplay');
        const fontSizeValue = document.getElementById('fontSizeValue');
        
        if (textDisplay) {
            textDisplay.style.fontSize = `${size}px`;
            localStorage.setItem('readable-font-size', size);
            
            if (fontSizeValue) {
                fontSizeValue.textContent = `${size}px`;
            }
            
            this.announceChange(`Font size changed to ${size} pixels`);
        }
    }

    increaseFontSize() {
        const slider = document.getElementById('fontSizeSlider');
        if (slider) {
            const currentSize = parseInt(slider.value);
            const newSize = Math.min(currentSize + 2, parseInt(slider.max));
            slider.value = newSize;
            this.changeFontSize(newSize);
        }
    }

    decreaseFontSize() {
        const slider = document.getElementById('fontSizeSlider');
        if (slider) {
            const currentSize = parseInt(slider.value);
            const newSize = Math.max(currentSize - 2, parseInt(slider.min));
            slider.value = newSize;
            this.changeFontSize(newSize);
        }
    }

    // ===== Spacing Management =====
    toggleSpacing() {
        const spacingToggle = document.getElementById('spacingToggle');
        const textDisplay = document.getElementById('textDisplay');
        
        if (spacingToggle && textDisplay) {
            const isWideSpacing = spacingToggle.getAttribute('aria-pressed') === 'true';
            
            if (isWideSpacing) {
                textDisplay.style.lineHeight = '1.6';
                spacingToggle.setAttribute('aria-pressed', 'false');
                spacingToggle.querySelector('.button-text').textContent = 'Normal';
                localStorage.setItem('readable-spacing', 'normal');
                this.announceChange('Spacing changed to normal');
            } else {
                textDisplay.style.lineHeight = '2.0';
                spacingToggle.setAttribute('aria-pressed', 'true');
                spacingToggle.querySelector('.button-text').textContent = 'Wide';
                localStorage.setItem('readable-spacing', 'wide');
                this.announceChange('Spacing changed to wide');
            }
        }
    }

    // ===== Text Display Management =====
    updateTextDisplay() {
        const textInput = document.getElementById('textInput');
        const textDisplay = document.getElementById('textDisplay');
        
        if (textInput && textDisplay) {
            const text = textInput.value.trim();
            
            if (text) {
                // Split text into paragraphs and create HTML
                const paragraphs = text.split('\n\n').map(paragraph => {
                    if (paragraph.trim()) {
                        return `<p>${this.escapeHtml(paragraph.trim())}</p>`;
                    }
                    return '';
                }).filter(p => p);
                
                textDisplay.innerHTML = paragraphs.join('');
            } else {
                textDisplay.innerHTML = '<p class="placeholder-text">Your formatted text will appear here...</p>';
            }
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===== File Upload =====
    handleFileUpload(event) {
        const file = event.target.files[0];
        
        if (!file) return;
        
        if (file.type !== 'text/plain') {
            this.announceChange('Please select a .txt file');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const textInput = document.getElementById('textInput');
            if (textInput) {
                textInput.value = e.target.result;
                this.updateTextDisplay();
                this.announceChange('File loaded successfully');
            }
        };
        
        reader.onerror = () => {
            this.announceChange('Error reading file');
        };
        
        reader.readAsText(file);
    }

    // ===== Text-to-Speech =====
    checkTTSupport() {
        if (!('speechSynthesis' in window)) {
            const ttsSection = document.querySelector('.tts-section');
            if (ttsSection) {
                ttsSection.innerHTML = '<p>Text-to-speech is not supported in your browser.</p>';
            }
        }
    }

    playText() {
        const textInput = document.getElementById('textInput');
        const ttsStatus = document.getElementById('ttsStatus');
        
        if (!textInput || !textInput.value.trim()) {
            this.announceChange('No text to speak');
            return;
        }
        
        // Stop any current speech
        this.synth.cancel();
        
        // Create new utterance
        this.currentUtterance = new SpeechSynthesisUtterance(textInput.value);
        
        // Configure speech settings
        this.currentUtterance.rate = 1;
        this.currentUtterance.pitch = 1;
        this.currentUtterance.volume = 1;
        
        // Event handlers
        this.currentUtterance.onstart = () => {
            this.isSpeaking = true;
            this.isPaused = false;
            this.updateTTSButtons();
            if (ttsStatus) {
                ttsStatus.textContent = 'Speaking...';
            }
        };
        
        this.currentUtterance.onend = () => {
            this.isSpeaking = false;
            this.isPaused = false;
            this.updateTTSButtons();
            if (ttsStatus) {
                ttsStatus.textContent = 'Speech completed';
            }
        };
        
        this.currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.isSpeaking = false;
            this.isPaused = false;
            this.updateTTSButtons();
            if (ttsStatus) {
                ttsStatus.textContent = 'Speech error occurred';
            }
        };
        
        // Start speaking
        this.synth.speak(this.currentUtterance);
        this.announceChange('Starting speech');
    }

    pauseText() {
        if (this.isSpeaking && !this.isPaused) {
            this.synth.pause();
            this.isPaused = true;
            this.updateTTSButtons();
            
            const ttsStatus = document.getElementById('ttsStatus');
            if (ttsStatus) {
                ttsStatus.textContent = 'Speech paused';
            }
            
            this.announceChange('Speech paused');
        }
    }

    resumeText() {
        if (this.isSpeaking && this.isPaused) {
            this.synth.resume();
            this.isPaused = false;
            this.updateTTSButtons();
            
            const ttsStatus = document.getElementById('ttsStatus');
            if (ttsStatus) {
                ttsStatus.textContent = 'Speaking...';
            }
            
            this.announceChange('Speech resumed');
        }
    }

    stopText() {
        this.synth.cancel();
        this.isSpeaking = false;
        this.isPaused = false;
        this.updateTTSButtons();
        
        const ttsStatus = document.getElementById('ttsStatus');
        if (ttsStatus) {
            ttsStatus.textContent = 'Speech stopped';
        }
        
        this.announceChange('Speech stopped');
    }

    updateTTSButtons() {
        const playButton = document.getElementById('playButton');
        const pauseButton = document.getElementById('pauseButton');
        const stopButton = document.getElementById('stopButton');
        
        if (playButton) {
            if (this.isSpeaking && !this.isPaused) {
                playButton.disabled = true;
                playButton.textContent = '▶️ Playing';
            } else if (this.isSpeaking && this.isPaused) {
                playButton.disabled = false;
                playButton.textContent = '▶️ Resume';
            } else {
                playButton.disabled = false;
                playButton.textContent = '▶️ Play';
            }
        }
        
        if (pauseButton) {
            pauseButton.disabled = !this.isSpeaking || this.isPaused;
        }
        
        if (stopButton) {
            stopButton.disabled = !this.isSpeaking;
        }
    }

    // ===== Local Storage Management =====
    loadSavedSettings() {
        // Load theme
        const savedTheme = localStorage.getItem('readable-theme');
        if (savedTheme) {
            this.changeTheme(savedTheme);
            const themeSelect = document.getElementById('themeSelect');
            if (themeSelect) {
                themeSelect.value = savedTheme;
            }
        }
        
        // Load font
        const savedFont = localStorage.getItem('readable-font');
        if (savedFont) {
            this.changeFont(savedFont);
            const fontSelect = document.getElementById('fontSelect');
            if (fontSelect) {
                fontSelect.value = savedFont;
            }
        }
        
        // Load font size
        const savedFontSize = localStorage.getItem('readable-font-size');
        if (savedFontSize) {
            this.changeFontSize(savedFontSize);
            const fontSizeSlider = document.getElementById('fontSizeSlider');
            if (fontSizeSlider) {
                fontSizeSlider.value = savedFontSize;
            }
        }
        
        // Load spacing
        const savedSpacing = localStorage.getItem('readable-spacing');
        if (savedSpacing === 'wide') {
            const spacingToggle = document.getElementById('spacingToggle');
            if (spacingToggle) {
                spacingToggle.setAttribute('aria-pressed', 'true');
                spacingToggle.querySelector('.button-text').textContent = 'Wide';
                const textDisplay = document.getElementById('textDisplay');
                if (textDisplay) {
                    textDisplay.style.lineHeight = '2.0';
                }
            }
        }
    }

    // ===== Modal Management =====
    showKeyboardShortcuts() {
        const modal = document.getElementById('keyboardShortcutsModal');
        if (modal) {
            modal.setAttribute('aria-hidden', 'false');
            modal.style.display = 'flex';
            
            // Focus the close button
            const closeButton = modal.querySelector('.modal-close');
            if (closeButton) {
                closeButton.focus();
            }
            
            this.announceChange('Keyboard shortcuts modal opened');
        }
    }

    hideKeyboardShortcuts() {
        const modal = document.getElementById('keyboardShortcutsModal');
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';
        }
    }

    // ===== Accessibility Helpers =====
    announceChange(message) {
        // Create or update aria-live region for screen readers
        let announcer = document.getElementById('announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.className = 'sr-only';
            document.body.appendChild(announcer);
        }
        
        announcer.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }
}

// ===== Global Functions for HTML onclick handlers =====
function showKeyboardShortcuts() {
    if (window.readableApp) {
        window.readableApp.showKeyboardShortcuts();
    }
}

function hideKeyboardShortcuts() {
    if (window.readableApp) {
        window.readableApp.hideKeyboardShortcuts();
    }
}

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
    window.readableApp = new ReadAble();
});

// ===== Service Worker Registration (for future PWA features) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
