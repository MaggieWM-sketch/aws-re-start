// script.js

let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Initialize slide counter
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('totalSlides').textContent = totalSlides;
    showSlide(0);
});

function showSlide(index) {
    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Add active class to current slide
    slides[index].classList.add('active');
    
    // Update slide counter
    document.getElementById('currentSlide').textContent = index + 1;
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    showSlide(currentSlideIndex);
}

function previousSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    showSlide(currentSlideIndex);
}

function startPresentation() {
    currentSlideIndex = 0;
    showSlide(currentSlideIndex);
}

function goToSlide(slideNumber) {
    if (slideNumber >= 0 && slideNumber < totalSlides) {
        currentSlideIndex = slideNumber;
        showSlide(currentSlideIndex);
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
            event.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
        case 'PageUp':
            event.preventDefault();
            previousSlide();
            break;
        case 'Home':
            event.preventDefault();
            startPresentation();
            break;
        case 'End':
            event.preventDefault();
            goToSlide(totalSlides - 1);
            break;
        case 'Escape':
            event.preventDefault();
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
            break;
    }
});

// Touch/Swipe support for mobile
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

document.addEventListener('touchstart', function(event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});

document.addEventListener('touchend', function(event) {
    endX = event.changedTouches[0].clientX;
    endY = event.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > minSwipeDistance) {
            previousSlide(); // Swipe right
        } else if (deltaX < -minSwipeDistance) {
            nextSlide(); // Swipe left
        }
    }
}

// Presentation timer (optional)
function startTimer(durationMinutes = 3) {
    const totalSeconds = durationMinutes * 60;
    let remainingSeconds = totalSeconds;
    
    const timerElement = document.createElement('div');
    timerElement.id = 'presentation-timer';
    timerElement.style.cssText = `
        position: fixed;
        top: 30px;
        left: 30px;
        background: rgba(255, 153, 0, 0.8);
        color: #232f3e;
        padding: 10px 20px;
        border-radius: 20px;
        font-weight: bold;
        font-family: monospace;
        z-index: 1001;
    `;
    document.body.appendChild(timerElement);
    
    const interval = setInterval(() => {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (remainingSeconds <= 0) {
            clearInterval(interval);
            timerElement.textContent = 'TIME UP!';
            timerElement.style.background = 'rgba(255, 0, 0, 0.8)';
            timerElement.style.color = '#fff';
        }
        
        remainingSeconds--;
    }, 1000);
}

// Auto-advance slides (uncomment to enable)
function enableAutoAdvance(secondsPerSlide = 25) {
    setInterval(() => {
        nextSlide();
    }, secondsPerSlide * 1000);
}

// Fullscreen toggle
function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    }
}

// Add fullscreen button (optional)
function addFullscreenButton() {
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.textContent = '⛶ Fullscreen';
    fullscreenBtn.className = 'nav-btn';
    fullscreenBtn.onclick = toggleFullscreen;
    document.querySelector('.navigation').appendChild(fullscreenBtn);
}

// Initialize optional features
document.addEventListener('DOMContentLoaded', function() {
    // Uncomment any of these to enable:
    // startTimer(3); // 3-minute timer
    // enableAutoAdvance(25); // Auto-advance every 25 seconds
    // addFullscreenButton(); // Add fullscreen toggle
});

// Presentation mode toggle
function togglePresentationMode() {
    const navigation = document.querySelector('.navigation');
    const counter = document.querySelector('.slide-counter');
    
    if (navigation.style.display === 'none') {
        navigation.style.display = 'flex';
        counter.style.display = 'block';
    } else {
        navigation.style.display = 'none';
        counter.style.display = 'none';
    }
}

// Add presentation mode toggle with 'P' key
document.addEventListener('keydown', function(event) {
    if (event.key.toLowerCase() === 'p') {
        event.preventDefault();
        togglePresentationMode();
    }
});