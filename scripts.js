// Loading screen animation and progress bar with enhanced effects
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('progress-bar-gif');
    let width = 0;
    
    // Add click event to hide loading screen with fade animation
    loadingScreen.addEventListener('click', function() {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    });
    
    // Animate progress bar with controlled speed and smooth transitions
    const interval = setInterval(function() {
        if (width >= 98) {
            clearInterval(interval);
            width = 100;
            progressBar.style.width = width + '%';
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
        } else {
            width += Math.min(5, 100 - width);
            progressBar.style.width = width + '%';
        }
    }, 100);
});

// Start button with hover animation
document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.querySelector('.navbar .start-button');
    
    if (startButton) {
        startButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'https://linktr.ee/4hrsleep';
        });
        
        // Add hover animation
        startButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        startButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
});

/**
 * Enhanced smooth scroll functionality
 * Handles navigation clicks with easing animation
 */
document.addEventListener('DOMContentLoaded', function() {
    // 移除旧的事件监听器
    const navLinks = document.querySelectorAll('.navbar a'); // 只处理 navbar 的链接
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (link.getAttribute('href').startsWith('#')) { // 只处理内部链接
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create container first
    const container = document.createElement('div');
    container.id = 'windows-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1000';

    // Add container to body
    document.body.appendChild(container);

    // WindowManager class definition
    class WindowManager {
        constructor() {
            this.container = document.getElementById('windows-container');
            if (!this.container) {
                throw new Error('Windows container not found');
            }
            this.windows = new Set();
            this.zIndex = 1000;
            this.activeWindow = null;
        }

        createWindow(id, title, content) {
            try {
                const windowEl = document.createElement('div');
                windowEl.className = 'retro-window';
                windowEl.id = id;
                windowEl.style.pointerEvents = 'auto';
                windowEl.innerHTML = `
                    <div class="window-header">
                        <span class="window-title">${title}</span>
                        <button class="close-button">×</button>
                    </div>
                    <div class="window-content">
                        ${content || ''}
                    </div>
                `;

                this.makeDraggable(windowEl);
                this.container.appendChild(windowEl);
                this.windows.add(windowEl);
                
                const closeBtn = windowEl.querySelector('.close-button');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => this.closeWindow(windowEl));
                }
                
                this.focusWindow(windowEl);
                return windowEl;
            } catch (error) {
                console.error('Error creating window:', error);
                return null;
            }
        }

        makeDraggable(windowEl) {
            const header = windowEl.querySelector('.window-header');
            if (!header) return;

            let isDragging = false;
            let startX;
            let startY;

            header.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('window-button')) return;
                isDragging = true;
                
                // 获取初始位置
                const rect = windowEl.getBoundingClientRect();
                startX = e.clientX - rect.left;
                startY = e.clientY - rect.top;
                
                this.focusWindow(windowEl);
                windowEl.style.cursor = 'move';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                e.preventDefault();
                
                // 直接设置位置，不使用 transform
                let newX = e.clientX - startX;
                let newY = e.clientY - startY;

                // 添加边界检查
                const maxX = window.innerWidth - windowEl.offsetWidth;
                const maxY = window.innerHeight - windowEl.offsetHeight;

                // 确保窗口不会被拖出视口
                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));

                // 直接设置位置
                windowEl.style.left = `${newX}px`;
                windowEl.style.top = `${newY}px`;
            });

            document.addEventListener('mouseup', () => {
                if (!isDragging) return;
                isDragging = false;
                windowEl.style.cursor = 'default';
            });

            // 防止拖动时选中文本
            header.addEventListener('selectstart', (e) => {
                e.preventDefault();
            });
        }

        focusWindow(windowEl) {
            this.zIndex += 1;
            windowEl.style.zIndex = this.zIndex;
            if (this.activeWindow) {
                this.activeWindow.classList.remove('active');
            }
            windowEl.classList.add('active');
            this.activeWindow = windowEl;
        }

        closeWindow(windowEl) {
            if (windowEl && windowEl.parentNode) {
                windowEl.remove();
                this.windows.delete(windowEl);
            }
        }

        closeAllWindows() {
            this.windows.forEach(window => {
                if (window && window.parentNode) {
                    window.remove();
                }
            });
            this.windows.clear();
        }

        getWindowContent(section) {
            const contentEl = document.querySelector(`#${section} .content`);
            return contentEl ? contentEl.innerHTML : '';
        }
    }

    // Initialize WindowManager
    try {
        console.log('Initializing WindowManager...');
        const windowManager = new WindowManager();
        window.windowManager = windowManager; // Make it globally accessible

        // Initialize existing windows
        document.querySelectorAll('.retro-window').forEach(window => {
            windowManager.makeDraggable(window);
            window.addEventListener('mousedown', () => {
                windowManager.focusWindow(window);
            });
        });

        console.log('WindowManager initialized successfully');
    } catch (error) {
        console.error('Failed to initialize WindowManager:', error);
    }
});

// Add a check to ensure script is loaded
console.log('Script loaded');

// Enhanced cursor trail effect
const cursorContainer = document.createElement('div');
cursorContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 99999;
`;
document.body.appendChild(cursorContainer);

// Create main cursor with glow effect
const cursor = document.createElement('div');
cursor.className = 'cursor-trail';
cursorContainer.appendChild(cursor);

// Create enhanced trail effect
const trails = [];
const numTrails = 5;

for (let i = 0; i < numTrails; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    // Adjust opacity for smoother trail effect
    trail.style.opacity = 0.2 + (0.8 * (1 - i / numTrails));
    cursorContainer.appendChild(trail);
    trails.push(trail);
}

// Update cursor position with smooth animation
document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
        trails.forEach((trail, index) => {
            setTimeout(() => {
                trail.style.left = e.clientX + 'px';
                trail.style.top = e.clientY + 'px';
            }, index * 40);
        });
    });
});

// Cursor visibility handling
document.addEventListener('mouseenter', () => {
    cursorContainer.style.display = 'block';
});

document.addEventListener('mouseleave', () => {
    cursorContainer.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    const musicControl = document.getElementById('musicControl');
    const bgMusic = document.getElementById('bgMusic');
    const musicLabel = musicControl.querySelector('.credits-label');

    // Initialize music state
    let isMusicPlaying = false;
    bgMusic.volume = 0.5;

    // Add load event listener to check if audio loaded successfully
    bgMusic.addEventListener('loadeddata', () => {
        console.log('Audio file loaded successfully');
    });

    bgMusic.addEventListener('error', (e) => {
        console.error('Error loading audio file:', e);
        console.log('Audio source:', bgMusic.currentSrc);
    });

    // Music control function with enhanced error handling
    async function toggleMusic() {
        try {
            if (!isMusicPlaying) {
                console.log('Attempting to play music...');
                const playPromise = bgMusic.play();
                
                if (playPromise !== undefined) {
                    await playPromise;
                    musicControl.setAttribute('data-playing', 'true');
                    musicLabel.textContent = 'MUSIC ON';
                    isMusicPlaying = true;
                    console.log('Music started playing successfully');
                }
            } else {
                bgMusic.pause();
                musicControl.setAttribute('data-playing', 'false');
                musicLabel.textContent = 'MUSIC OFF';
                isMusicPlaying = false;
                console.log('Music paused');
            }
        } catch (error) {
            console.error('Error playing music:', error);
            musicLabel.textContent = 'ERROR';
            // Try to recover from error
            isMusicPlaying = false;
            musicControl.setAttribute('data-playing', 'false');
        }
    }

    // Click event listener
    musicControl.addEventListener('click', toggleMusic);
});

// Clock functionality
function updateClock() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Update clock every second
setInterval(updateClock, 1000);
// Initial update
updateClock();

document.addEventListener('DOMContentLoaded', function() {
    const videoLink = document.querySelector('.navbar a[href="#video"]');
    const videoWindow = document.getElementById('video-window');
    const closeVideoButton = document.getElementById('close-video');

    if (videoLink) {
        videoLink.addEventListener('click', function(e) {
            e.preventDefault();
            videoWindow.style.display = 'flex';
        });
    }

    if (closeVideoButton) {
        closeVideoButton.addEventListener('click', function() {
            videoWindow.style.display = 'none';
        });
    }
});
