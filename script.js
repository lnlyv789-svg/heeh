document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - Starting birthday app");
    initBirthdayApp();
});

function initBirthdayApp() {
    console.log("Initializing birthday app...");
    
    // Elements
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const musicToggle = document.getElementById('musicToggle');
    const musicText = document.getElementById('musicText');
    const birthdayMusic = document.getElementById('birthdayMusic');
    const openGiftBtn = document.getElementById('openGiftBtn');
    const giftLid = document.getElementById('giftLid');
    const giftMessage = document.getElementById('giftMessage');
    const blowCandleBtn = document.getElementById('blowCandleBtn');
    const flame = document.getElementById('flame');
    const photosGrid = document.getElementById('photosGrid');
    const gridContainer = document.getElementById('gridContainer');
    const themeToggle = document.getElementById('themeToggle');
    const confettiContainer = document.getElementById('confettiContainer');
    
    // Array foto yang akan ditampilkan di slide 6
    // Perhatikan: file dengan spasi harus di-encode atau diganti namanya
    // Untuk sekarang kita coba tanpa encoding dulu
    const remainingPhotos = [
        'comel1.jpg', 'comel2.jpg', 'comel3.jpg', 'comel4.jpg',
        'ice bear.jpg', 'ice bear huge.jpg',
        'meme1.jpg', 'meme2.jpg', 'meme3.jpg',
        'miaw1.jpg', 'nailong 1.jpg', 'nailong3.jpg',
        'nailong4.jpg', 'nailong5.jpg', 'nailong6.jpg',
        'spongebob1.jpg'
    ];
    
    let currentSlide = 0;
    let isMusicPlaying = false;
    let giftOpened = false;
    let candleBlown = false;
    let audioContext = null;
    
    // Initialize App
    function init() {
        console.log("Initializing...");
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize music
        initMusic();
        
        // Update navigation buttons
        updateNavigation();
        
        // Preload images for better performance
        preloadImages();
        
        console.log("App initialized successfully!");
    }
    
    // Preload important images
    function preloadImages() {
        const imagesToPreload = [
            'assets/fck.jpg',
            'assets/nailong2.jpg',
            'assets/owl1.jpg',
            'assets/meme5.jpg',
            'assets/sword1.jpg',
            'assets/Fotbar.jpg',
            'assets/sword2.jpg'
        ];
        
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
        });
        
        console.log("Images preloaded");
    }
    
    // Initialize music - FIXED VERSION
    function initMusic() {
        console.log("Initializing music...");
        
        // Set volume
        birthdayMusic.volume = 0.5;
        
        // Set music to start paused (let user control)
        birthdayMusic.pause();
        isMusicPlaying = false;
        updateMusicButton();
        
        // Log music source
        console.log("Music source:", birthdayMusic.querySelector('source').src);
        
        // Add event listeners for audio errors
        birthdayMusic.addEventListener('error', function(e) {
            console.error("Audio error:", e);
            console.error("Audio error details:", birthdayMusic.error);
            
            // Try to load fallback source
            const sources = birthdayMusic.querySelectorAll('source');
            if (sources.length > 1) {
                console.log("Trying fallback source...");
                birthdayMusic.src = sources[1].src;
                birthdayMusic.load();
            }
        });
        
        birthdayMusic.addEventListener('canplay', function() {
            console.log("Audio can play now");
        });
    }
    
    // Update music button display
    function updateMusicButton() {
        if (isMusicPlaying) {
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i> Musik ON';
            musicText.textContent = 'Musik ON';
        } else {
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i> Musik OFF';
            musicText.textContent = 'Musik OFF';
        }
    }
    
    // Setup all event listeners
    function setupEventListeners() {
        console.log("Setting up event listeners...");
        
        // Navigation buttons
        prevBtn.addEventListener('click', goToPrevSlide);
        nextBtn.addEventListener('click', goToNextSlide);
        
        // Progress dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
        
        // Music control - FIXED VERSION
        musicToggle.addEventListener('click', toggleMusic);
        
        // Gift interaction
        if (openGiftBtn) {
            openGiftBtn.addEventListener('click', openGift);
        }
        
        // Candle interaction
        if (blowCandleBtn) {
            blowCandleBtn.addEventListener('click', blowCandle);
        }
        
        // Theme toggle
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        // Add touch events for mobile
        setupTouchEvents();
        
        console.log("Event listeners setup complete!");
    }
    
    // Setup touch events for mobile
    function setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        
        document.querySelector('.slides-container').addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
        });
        
        document.querySelector('.slides-container').addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    goToNextSlide();
                } else {
                    // Swipe right - previous slide
                    goToPrevSlide();
                }
            }
        }
    }
    
    // Handle keyboard navigation
    function handleKeyboardNavigation(e) {
        if (e.key === 'ArrowLeft') {
            goToPrevSlide();
        } else if (e.key === 'ArrowRight') {
            goToNextSlide();
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            toggleMusic();
        }
    }
    
    // Slide navigation
    function goToSlide(index) {
        console.log(`Going to slide ${index}`);
        
        if (index < 0 || index >= slides.length) {
            console.log(`Invalid slide index: ${index}`);
            return;
        }
        
        // Hide current slide
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        // Show new slide
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        // Update slide counter text
        updateSlideCounters();
        
        // Update navigation buttons
        updateNavigation();
        
        // Handle slide-specific effects
        handleSlideEffects();
        
        console.log(`Now on slide ${currentSlide + 1}/${slides.length}`);
    }
    
    function goToPrevSlide() {
        console.log("Previous button clicked");
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }
    
    function goToNextSlide() {
        console.log("Next button clicked");
        if (currentSlide < slides.length - 1) {
            goToSlide(currentSlide + 1);
        }
    }
    
    function updateNavigation() {
        // Update previous button
        prevBtn.disabled = currentSlide === 0;
        
        // Update next button
        nextBtn.disabled = currentSlide === slides.length - 1;
        
        // Change next button text on last slide
        if (currentSlide === slides.length - 1) {
            nextBtn.innerHTML = 'Selesai <i class="fas fa-check"></i>';
        } else {
            nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
        }
        
        console.log("Navigation updated:", {
            currentSlide: currentSlide,
            prevDisabled: prevBtn.disabled,
            nextDisabled: nextBtn.disabled
        });
    }
    
    function updateSlideCounters() {
        document.querySelectorAll('.slide-counter').forEach(counter => {
            counter.textContent = `${currentSlide + 1}/${slides.length}`;
        });
    }
    
    // Handle slide-specific effects
    function handleSlideEffects() {
        // Reset animations when leaving certain slides
        if (currentSlide !== 4 && flame) {
            resetCandle();
        }
        
        // Reset gift animation if not on slide 5
        if (currentSlide !== 4 && giftLid) {
            resetGift();
        }
    }
    
    // Music control - IMPROVED VERSION
    function toggleMusic() {
        console.log("Toggling music, current state:", isMusicPlaying);
        
        // First, ensure we have user interaction
        if (birthdayMusic.paused) {
            // Try to play
            const playPromise = birthdayMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Playback started successfully
                    isMusicPlaying = true;
                    updateMusicButton();
                    console.log("Music started successfully");
                    
                    // Set a flag to remember user interaction
                    localStorage.setItem('musicAutoPlayAllowed', 'true');
                }).catch(error => {
                    console.log("Music play failed:", error);
                    
                    // Show user-friendly message
                    musicToggle.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Klik Lagi';
                    musicText.textContent = 'Klik Lagi';
                    
                    // Try again on next click
                    setTimeout(updateMusicButton, 2000);
                    
                    // If it's an autoplay policy error, inform the user
                    if (error.name === 'NotAllowedError') {
                        console.log("Autoplay prevented. User needs to interact first.");
                        alert("Silakan klik tombol musik sekali lagi untuk memutar lagu.");
                    }
                });
            }
        } else {
            // Music is playing, so pause it
            birthdayMusic.pause();
            isMusicPlaying = false;
            updateMusicButton();
        }
    }
    
    // Gift interaction
    function openGift() {
        if (giftOpened) return;
        
        console.log("Opening gift...");
        
        // Animate gift opening
        if (giftLid) {
            giftLid.style.transform = 'translateY(-40px) rotate(-10deg)';
        }
        
        // Show gift message after delay
        setTimeout(() => {
            if (giftMessage) {
                giftMessage.classList.remove('hidden');
                giftMessage.classList.add('visible');
                
                // Add bounce animation
                giftMessage.style.animation = 'fadeIn 0.5s ease, pulse 2s infinite';
            }
        }, 500);
        
        // Disable button
        if (openGiftBtn) {
            openGiftBtn.disabled = true;
            openGiftBtn.innerHTML = '<i class="fas fa-gift"></i> Sudah Dibuka!';
            openGiftBtn.style.opacity = '0.7';
        }
        
        // Create confetti
        createConfetti('heart');
        
        // Play celebration sound
        playCelebrationSound();
        
        giftOpened = true;
        console.log("Gift opened successfully");
    }
    
    // Reset gift animation
    function resetGift() {
        if (giftLid) {
            giftLid.style.transform = '';
        }
        if (giftMessage) {
            giftMessage.classList.add('hidden');
            giftMessage.classList.remove('visible');
        }
        if (openGiftBtn) {
            openGiftBtn.disabled = false;
            openGiftBtn.innerHTML = '<i class="fas fa-hand-pointer"></i> Buka Kado!';
            openGiftBtn.style.opacity = '1';
        }
        giftOpened = false;
    }
    
    // Candle interaction
    function blowCandle() {
        if (candleBlown) return;
        
        console.log("Blowing candle...");
        
        // Hide flame with animation
        if (flame) {
            flame.style.animation = 'none';
            flame.style.opacity = '0';
            flame.style.transition = 'opacity 0.5s';
            
            // Add blow sound effect
            playBlowSound();
        }
        
        // Create smoke effect
        createSmokeEffect();
        
        // Show photos grid after delay
        setTimeout(() => {
            if (photosGrid) {
                photosGrid.classList.remove('hidden');
                photosGrid.classList.add('visible');
                
                // Load remaining photos
                loadRemainingPhotos();
            }
        }, 800);
        
        // Disable button
        if (blowCandleBtn) {
            blowCandleBtn.disabled = true;
            blowCandleBtn.innerHTML = '<i class="fas fa-check"></i> Lilin Sudah Ditiup!';
            blowCandleBtn.style.opacity = '0.7';
        }
        
        // Create flower confetti
        createConfetti('flower');
        
        // Play celebration sound
        playCelebrationSound();
        
        candleBlown = true;
        console.log("Candle blown successfully");
    }
    
    function resetCandle() {
        if (flame) {
            flame.style.animation = 'flicker 0.5s infinite alternate';
            flame.style.opacity = '1';
        }
        if (blowCandleBtn) {
            blowCandleBtn.disabled = false;
            blowCandleBtn.innerHTML = '<i class="fas fa-wind"></i> Tiup Lilinnya!';
            blowCandleBtn.style.opacity = '1';
        }
        candleBlown = false;
    }
    
    // Load remaining photos into grid - FIXED for files with spaces
    function loadRemainingPhotos() {
        if (!gridContainer) return;
        
        // Clear container first
        gridContainer.innerHTML = '';
        
        // Counter for loaded images
        let loadedCount = 0;
        const totalCount = remainingPhotos.length;
        
        // Create photo elements
        remainingPhotos.forEach(photoName => {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'photo-grid-item';
            
            const img = document.createElement('img');
            
            // Handle file names with spaces
            // Try with original name first
            img.src = `assets/${photoName}`;
            img.alt = photoName.replace('.jpg', '');
            img.className = 'grid-photo';
            img.loading = 'lazy';
            
            // Add error handling for files with spaces
            img.onerror = function() {
                console.log(`Error loading ${photoName}, trying encoded version...`);
                // Try URL encoding for spaces
                const encodedName = encodeURIComponent(photoName);
                this.src = `assets/${encodedName}`;
                
                this.onerror = function() {
                    console.error(`Failed to load: ${photoName}`);
                    // Use a placeholder if image fails to load
                    this.src = `https://via.placeholder.com/150/FF6BB5/FFFFFF?text=${photoName.substring(0, 10)}`;
                };
            };
            
            img.onload = function() {
                loadedCount++;
                console.log(`Loaded ${loadedCount}/${totalCount}: ${photoName}`);
                
                // Add a slight delay for staggered appearance
                setTimeout(() => {
                    this.style.opacity = '1';
                    this.style.transform = 'scale(1)';
                }, (loadedCount % 6) * 100);
            };
            
            // Initial style for fade-in effect
            img.style.opacity = '0';
            img.style.transform = 'scale(0.8)';
            img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            photoDiv.appendChild(img);
            gridContainer.appendChild(photoDiv);
        });
        
        console.log(`Loading ${remainingPhotos.length} photos into grid`);
    }
    
    // Create confetti effect
    function createConfetti(type = 'heart') {
        console.log(`Creating ${type} confetti...`);
        
        const confettiCount = type === 'heart' ? 30 : 40;
        const confettiClass = type === 'heart' ? 'heart-confetti' : 'flower-confetti';
        const confettiSymbol = type === 'heart' ? '❤️' : '🌸';
        
        // Clear any existing confetti
        confettiContainer.innerHTML = '';
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = `confetti ${confettiClass}`;
                confetti.textContent = confettiSymbol;
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.top = '-50px';
                confetti.style.fontSize = `${Math.random() * 20 + 15}px`;
                confetti.style.opacity = '0.9';
                confetti.style.position = 'fixed';
                confetti.style.zIndex = '9999';
                confetti.style.pointerEvents = 'none';
                
                confettiContainer.appendChild(confetti);
                
                // Random animation
                const animation = confetti.animate([
                    { 
                        transform: `translateY(0) rotate(0deg)`,
                        opacity: 1 
                    },
                    { 
                        transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`,
                        opacity: 0 
                    }
                ], {
                    duration: Math.random() * 3000 + 2000,
                    easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
                });
                
                // Remove confetti after animation
                animation.onfinish = () => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                };
            }, i * 50);
        }
    }
    
    // Create smoke effect for candle
    function createSmokeEffect() {
        const cakeContainer = document.querySelector('.cake-container');
        if (!cakeContainer) return;
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const smoke = document.createElement('div');
                smoke.className = 'smoke';
                smoke.style.position = 'absolute';
                smoke.style.width = `${Math.random() * 20 + 10}px`;
                smoke.style.height = `${Math.random() * 20 + 10}px`;
                smoke.style.background = `rgba(200, 200, 200, ${Math.random() * 0.5 + 0.3})`;
                smoke.style.borderRadius = '50%';
                smoke.style.top = '30%';
                smoke.style.left = '50%';
                smoke.style.transform = 'translate(-50%, -50%)';
                smoke.style.filter = 'blur(5px)';
                smoke.style.zIndex = '11';
                
                cakeContainer.appendChild(smoke);
                
                // Random direction for smoke
                const angle = (Math.random() * 60 - 30) * (Math.PI / 180); // -30 to 30 degrees
                const distance = 100 + Math.random() * 100;
                const endX = Math.cos(angle) * distance;
                const endY = -Math.sin(angle) * distance - 100;
                
                // Animate smoke
                smoke.animate([
                    { 
                        transform: 'translate(-50%, -50%) scale(1)',
                        opacity: 1 
                    },
                    { 
                        transform: `translate(${endX}px, ${endY}px) scale(${Math.random() * 2 + 2})`,
                        opacity: 0 
                    }
                ], {
                    duration: 1500 + Math.random() * 1000,
                    easing: 'ease-out'
                });
                
                // Remove smoke after animation
                setTimeout(() => {
                    if (smoke.parentNode) {
                        smoke.parentNode.removeChild(smoke);
                    }
                }, 2500);
            }, i * 200);
        }
    }
    
    // Theme toggle
    function toggleTheme() {
        const themes = ['default', 'purple', 'mint'];
        const currentTheme = document.body.getAttribute('data-theme') || 'default';
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        
        document.body.setAttribute('data-theme', themes[nextIndex]);
        
        // Update theme variables
        updateThemeVariables(themes[nextIndex]);
        
        // Update icon with animation
        const icons = ['fa-palette', 'fa-moon', 'fa-sun'];
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = `fas ${icons[nextIndex]}`;
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 500);
        }
        
        // Save theme preference
        localStorage.setItem('birthdayTheme', themes[nextIndex]);
        
        console.log("Theme changed to:", themes[nextIndex]);
    }
    
    // Update CSS variables based on theme
    function updateThemeVariables(theme) {
        const root = document.documentElement;
        
        switch(theme) {
            case 'purple':
                root.style.setProperty('--primary', '#9B5DE5');
                root.style.setProperty('--secondary', '#F15BB5');
                root.style.setProperty('--accent', '#FEE440');
                root.style.setProperty('--dark', '#7B3DBD');
                break;
            case 'mint':
                root.style.setProperty('--primary', '#00BBF9');
                root.style.setProperty('--secondary', '#00F5D4');
                root.style.setProperty('--accent', '#FFD166');
                root.style.setProperty('--dark', '#0096C7');
                break;
            default:
                root.style.setProperty('--primary', '#FF6BB5');
                root.style.setProperty('--secondary', '#4D96FF');
                root.style.setProperty('--accent', '#FFD166');
                root.style.setProperty('--dark', '#FF4D94');
        }
    }
    
    // Play blow sound effect
    function playBlowSound() {
        try {
            // Create a blowing sound using Web Audio API
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Wind-like sound
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            
        } catch (e) {
            console.log("Could not play blow sound:", e);
        }
    }
    
    // Play celebration sound
    function playCelebrationSound() {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Celebration fanfare
            const now = audioContext.currentTime;
            
            oscillator.frequency.setValueAtTime(523.25, now); // C5
            oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
            oscillator.frequency.setValueAtTime(1046.50, now + 0.3); // C6
            
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            
            oscillator.start(now);
            oscillator.stop(now + 0.5);
            
        } catch (e) {
            console.log("Could not play celebration sound:", e);
        }
    }
    
    // Load saved theme
    function loadSavedTheme() {
        const savedTheme = localStorage.getItem('birthdayTheme');
        if (savedTheme && savedTheme !== 'default') {
            document.body.setAttribute('data-theme', savedTheme);
            updateThemeVariables(savedTheme);
            
            // Update icon
            const themes = ['default', 'purple', 'mint'];
            const icons = ['fa-palette', 'fa-moon', 'fa-sun'];
            const icon = themeToggle.querySelector('i');
            const themeIndex = themes.indexOf(savedTheme);
            
            if (icon && themeIndex !== -1) {
                icon.className = `fas ${icons[themeIndex]}`;
            }
        }
    }
    
    // Initialize the app
    init();
    loadSavedTheme();
}

// Add CSS for themes and additional styles
const style = document.createElement('style');
style.textContent = `
    [data-theme="purple"] {
        --primary: #9B5DE5;
        --secondary: #F15BB5;
        --accent: #FEE440;
        --dark: #7B3DBD;
    }
    
    [data-theme="mint"] {
        --primary: #00BBF9;
        --secondary: #00F5D4;
        --accent: #FFD166;
        --dark: #0096C7;
    }
    
    .smoke {
        position: absolute;
        pointer-events: none;
        z-index: 11;
    }
    
    .confetti {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
    }
    
    .heart-confetti {
        color: #FF6BB5;
    }
    
    .flower-confetti {
        color: #4D96FF;
    }
    
    /* Improved fade-in animation */
    @keyframes fadeIn {
        from { 
            opacity: 0; 
            transform: translateY(20px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
    
    /* Pulse animation for gift */
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Add auto-play permission helper
window.addEventListener('click', function() {
    const musicAutoPlayAllowed = localStorage.getItem('musicAutoPlayAllowed');
    const birthdayMusic = document.getElementById('birthdayMusic');
    
    if (birthdayMusic && musicAutoPlayAllowed === 'true' && birthdayMusic.paused) {
        birthdayMusic.play().catch(e => console.log("Auto-play after click failed:", e));
    }
});