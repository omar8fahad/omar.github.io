// أذكار الصباح والمساء
const morningAdhkar = [
    { text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...", count: 1 },
    { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَـهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيْكَ لَهُ...", count: 1 },
    { text: "سُبْحـانَ اللهِ وَبِحَمْـدِهِ", count: 100 },
    { text: "لا إلهَ إلاّ اللّهُ وحدَهُ لا شريكَ لهُ، لهُ المُلكُ ولهُ الحَمدُ، وهوَ على كلّ شيءٍ قديرٌ", count: 10 },
    { text: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3 }
];

const eveningAdhkar = [
    { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَـهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيْكَ لَهُ...", count: 1 },
    { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ", count: 1 },
    { text: "أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ", count: 100 },
    { text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ...", count: 3 },
    { text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", count: 7 }
];

// Audio Effects
const clickSound = new Audio('sounds/click.mp3');
const completionSound = new Audio('sounds/completion.mp3');
const notificationSound = new Audio('sounds/notification.mp3');

// Vibration Support
function vibrate(duration) {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const tabBtns = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.adhkar-section');
const modal = document.getElementById('dhikrModal');
const modalText = document.getElementById('modalDhikrText');
const counter = document.getElementById('counter');
const countBtn = document.getElementById('countBtn');
const closeModal = document.querySelector('.close-modal');
const morningContainer = document.getElementById('morningAdhkar');
const eveningContainer = document.getElementById('eveningAdhkar');

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('ServiceWorker registered'))
            .catch(err => console.log('ServiceWorker registration failed: ', err));
    });
}

// Local Storage Management
const STORAGE_KEY = 'adhkar_app_data';

function saveProgress(dhikrText, count) {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        data[dhikrText] = count;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

function loadProgress(dhikrText) {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return data[dhikrText] || 0;
    } catch (error) {
        console.error('Error loading progress:', error);
        return 0;
    }
}

// Theme Management
function initTheme() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Tab Management
function switchTab(e) {
    const targetTab = e.target.dataset.tab;
    
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    e.target.classList.add('active');
    document.getElementById(targetTab).classList.add('active');
}

// Create Adhkar Cards
function createAdhkarCards(adhkar, container) {
    container.innerHTML = adhkar.map((dhikr, index) => `
        <div class="adhkar-card" data-count="${dhikr.count}" data-current="0">
            <p class="adhkar-text">${dhikr.text}</p>
            <div class="dhikr-footer">
                <span class="dhikr-count">عدد المرات: ${dhikr.count}</span>
                <div class="counter-wrapper">
                    <span class="remaining-count">${dhikr.count}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Add click listeners
    container.querySelectorAll('.adhkar-card').forEach(card => {
        card.addEventListener('click', handleDhikrClick);
    });
}

function handleDhikrClick(event) {
    const card = event.currentTarget;
    const targetCount = parseInt(card.dataset.count);
    let currentCount = parseInt(card.dataset.current);

    // إضافة تأثير النقر
    createClickEffect(event);

    if (currentCount < targetCount) {
        currentCount++;
        card.dataset.current = currentCount;
        
        // تحديث العداد
        const remainingCount = card.querySelector('.remaining-count');
        remainingCount.textContent = targetCount - currentCount;

        // صوت واهتزاز
        clickSound.play().catch(() => {});
        vibrate(50);

        // حفظ التقدم
        saveProgress(card.querySelector('.adhkar-text').textContent, currentCount);

        if (currentCount === targetCount) {
            completeDhikr(card);
        }
    }
}

function createClickEffect(event) {
    const card = event.currentTarget;
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    
    // حساب موقع النقر النسبي داخل البطاقة
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // تعيين حجم وموقع تأثير النقر
    const size = Math.max(rect.width, rect.height) * 2;
    effect.style.width = effect.style.height = `${size}px`;
    effect.style.left = `${x - size/2}px`;
    effect.style.top = `${y - size/2}px`;
    
    card.appendChild(effect);
    
    // تشغيل الانيميشن
    effect.style.animation = 'clickEffect 0.6s ease-out forwards';
    
    // إزالة العنصر بعد انتهاء الانيميشن
    setTimeout(() => effect.remove(), 600);
}

function completeDhikr(card) {
    // تشغيل صوت الإكمال واهتزاز أطول
    completionSound.play().catch(() => {});
    vibrate([100, 50, 100]);
    
    // إضافة تأثيرات بصرية
    card.classList.add('completed');
    
    // إزالة التأثيرات بعد فترة
    setTimeout(() => {
        card.classList.remove('completed');
    }, 2000);
}

// Performance Optimizations
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error Handling
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    // يمكن إضافة نظام تتبع الأخطاء هنا
}

// Enhanced Share Functionality
async function shareAdhkar(platform, text) {
    try {
        if (navigator.share && platform === 'native') {
            await navigator.share({
                title: 'أذكار الصباح والمساء',
                text: text,
                url: window.location.href
            });
            return;
        }

        const urls = {
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
        };
        
        window.open(urls[platform], '_blank');
    } catch (error) {
        handleError(error, 'shareAdhkar');
    }
}

// Event Listeners with Error Handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        initTheme();
        createAdhkarCards(morningAdhkar, morningContainer);
        createAdhkarCards(eveningAdhkar, eveningContainer);
        
        // التبديل التلقائي حسب الوقت
        const currentHour = new Date().getHours();
        if (currentHour >= 18 || currentHour < 6) {
            document.querySelector('[data-tab="evening"]').click();
        }
    } catch (error) {
        handleError(error, 'DOMContentLoaded');
    }
});

// Optimized Event Listeners
themeToggle.addEventListener('click', () => {
    try {
        toggleTheme();
    } catch (error) {
        handleError(error, 'toggleTheme');
    }
});

tabBtns.forEach(btn => btn.addEventListener('click', switchTab));
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const platform = e.currentTarget.dataset.platform;
        const text = modalText.textContent;
        shareAdhkar(platform, text);
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Settings Management
const SETTINGS_KEY = 'adhkar_app_settings';
const THEMES = {
    default: {
        primary: '#4CAF50',
        secondary: '#2196F3'
    },
    blue: {
        primary: '#1976D2',
        secondary: '#64B5F6'
    },
    green: {
        primary: '#388E3C',
        secondary: '#81C784'
    },
    purple: {
        primary: '#7B1FA2',
        secondary: '#BA68C8'
    }
};

let appSettings = {
    theme: 'default',
    soundVolume: 50,
    vibrationIntensity: 50,
    notifications: {
        enabled: false,
        morningTime: '05:00',
        eveningTime: '17:00'
    }
};

let tempSettings = { ...appSettings };

// Settings UI Elements
const settingsModal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const closeSettings = document.getElementById('closeSettings');
const cancelSettings = document.getElementById('cancelSettings');
const saveSettingsBtn = document.getElementById('saveSettings');
const testSoundBtn = document.getElementById('testSound');
const testVibrationBtn = document.getElementById('testVibration');
const testNotificationBtn = document.getElementById('testNotification');

// Load Settings
function loadSettings() {
    try {
        const savedSettings = localStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
            appSettings = { ...appSettings, ...JSON.parse(savedSettings) };
            tempSettings = { ...appSettings };
            applySettings(appSettings);
        }
    } catch (error) {
        handleError(error, 'Loading settings');
    }
}

// Save Settings
function saveSettings() {
    try {
        appSettings = { ...tempSettings };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(appSettings));
        applySettings(appSettings);
        
        // إعادة جدولة التنبيهات بعد حفظ الإعدادات
        if (appSettings.notifications.enabled) {
            requestNotificationPermission().then(() => {
                scheduleNotifications();
            });
        } else {
            // إلغاء التنبيهات إذا تم تعطيلها
            if (window.notificationTimeouts) {
                window.notificationTimeouts.forEach(timeout => clearTimeout(timeout));
                window.notificationTimeouts = [];
            }
        }
        
        hideSettings();
    } catch (error) {
        handleError(error, 'Saving settings');
    }
}

// Apply Settings
function applySettings(settings) {
    // Apply Theme
    const theme = THEMES[settings.theme];
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    
    // Update Settings UI
    document.querySelector(`input[name="theme"][value="${settings.theme}"]`).checked = true;
    document.getElementById('soundVolume').value = settings.soundVolume;
    document.getElementById('vibrationIntensity').value = settings.vibrationIntensity;
    document.getElementById('enableNotifications').checked = settings.notifications.enabled;
    document.getElementById('morningTime').value = settings.notifications.morningTime;
    document.getElementById('eveningTime').value = settings.notifications.eveningTime;
    
    // Update display values
    document.querySelector('.volume-value').textContent = settings.soundVolume + '%';
    document.querySelector('.vibration-value').textContent = settings.vibrationIntensity + '%';
    
    // Apply Sound Volume
    const volume = settings.soundVolume / 100;
    clickSound.volume = volume;
    completionSound.volume = volume;
    notificationSound.volume = volume;
}

// Show/Hide Settings
function showSettings() {
    settingsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    tempSettings = { ...appSettings };
    applySettings(tempSettings);
}

function hideSettings() {
    settingsModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Test Functions
function testSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

function testVibration() {
    const intensity = tempSettings.vibrationIntensity;
    vibrate(Math.floor(100 * (intensity / 100)));
}

async function testNotification() {
    if (!('Notification' in window)) {
        alert('متصفحك لا يدعم التنبيهات');
        return;
    }

    if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            alert('يجب السماح بالتنبيهات لتفعيل هذه الخاصية');
            return;
        }
    }

    showNotification('تجربة التنبيه', 'هذا تنبيه تجريبي', true);
}

// Update Notification Function
function showNotification(title, body, isTest = false) {
    if ('Notification' in window && Notification.permission === 'granted') {
        // Play notification sound
        notificationSound.currentTime = 0;
        notificationSound.play();
        
        // Create notification
        new Notification(title, {
            body: body,
            icon: 'icons/icon-192x192.png'
        });
        
        // Add shake animation to body
        document.body.classList.add('notification-shake');
        setTimeout(() => {
            document.body.classList.remove('notification-shake');
        }, 500);
        
        // Vibrate
        if (isTest) {
            vibrate(1000);
        } else {
            vibrate(2000);
        }
    }
}

// Settings Event Listeners
function initializeSettings() {
    // Theme Settings
    document.querySelectorAll('input[name="theme"]').forEach(input => {
        input.addEventListener('change', (e) => {
            tempSettings.theme = e.target.value;
            applySettings(tempSettings);
        });
    });

    // Sound Volume
    document.getElementById('soundVolume').addEventListener('input', (e) => {
        tempSettings.soundVolume = parseInt(e.target.value);
        applySettings(tempSettings);
    });

    // Vibration Intensity
    document.getElementById('vibrationIntensity').addEventListener('input', (e) => {
        tempSettings.vibrationIntensity = parseInt(e.target.value);
        applySettings(tempSettings);
    });

    // Notifications
    document.getElementById('enableNotifications').addEventListener('change', (e) => {
        tempSettings.notifications.enabled = e.target.checked;
        if (e.target.checked) {
            requestNotificationPermission();
        }
    });

    document.getElementById('morningTime').addEventListener('change', (e) => {
        tempSettings.notifications.morningTime = e.target.value;
    });

    document.getElementById('eveningTime').addEventListener('change', (e) => {
        tempSettings.notifications.eveningTime = e.target.value;
    });

    // Test Buttons
    testSoundBtn.addEventListener('click', testSound);
    testVibrationBtn.addEventListener('click', testVibration);
    testNotificationBtn.addEventListener('click', testNotification);

    // Settings Buttons
    settingsBtn.addEventListener('click', showSettings);
    saveSettingsBtn.addEventListener('click', saveSettings);
    cancelSettings.addEventListener('click', () => {
        tempSettings = { ...appSettings };
        applySettings(appSettings);
        hideSettings();
    });
    closeSettings.addEventListener('click', hideSettings);
}

// Schedule Notifications
function scheduleNotifications() {
    if (!appSettings.notifications.enabled) {
        if (window.notificationTimeouts) {
            window.notificationTimeouts.forEach(timeout => clearTimeout(timeout));
            window.notificationTimeouts = [];
        }
        return;
    }

    // إلغاء أي مؤقتات سابقة
    if (window.notificationTimeouts) {
        window.notificationTimeouts.forEach(timeout => clearTimeout(timeout));
    }
    window.notificationTimeouts = [];

    function scheduleNextNotification(type) {
        const now = new Date();
        const targetTime = new Date(now);
        
        const timeStr = type === 'morning' ? appSettings.notifications.morningTime : appSettings.notifications.eveningTime;
        const [hours, minutes] = timeStr.split(':').map(Number);
        
        targetTime.setHours(hours, minutes, 0, 0);
        
        // إذا مر الوقت اليوم، جدول لليوم التالي
        if (targetTime <= now) {
            targetTime.setDate(targetTime.getDate() + 1);
        }
        
        const timeUntilNotification = targetTime - now;
        
        const timeout = setTimeout(() => {
            const message = type === 'morning' ? 'حان وقت أذكار الصباح' : 'حان وقت أذكار المساء';
            const title = type === 'morning' ? 'أذكار الصباح' : 'أذكار المساء';
            
            showNotification(title, message);
            
            if (appSettings.sound.enabled) {
                const audio = new Audio('sounds/notification.mp3');
                audio.volume = appSettings.sound.volume / 100;
                audio.play().catch(console.error);
            }
            
            if (appSettings.vibration.enabled) {
                navigator.vibrate(1000);
            }
            
            // جدولة التنبيه التالي
            scheduleNextNotification(type);
        }, timeUntilNotification);
        
        window.notificationTimeouts.push(timeout);
        
        console.log(`تم جدولة تنبيه ${type} في ${targetTime.toLocaleTimeString()}`);
    }

    // جدولة كلا التنبيهين
    scheduleNextNotification('morning');
    scheduleNextNotification('evening');
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        loadSettings();
        initializeSettings();
        if (appSettings.notifications.enabled) {
            requestNotificationPermission().then(() => {
                scheduleNotifications();
            });
        }
    } catch (error) {
        handleError(error, 'Initializing settings');
    }
});

// إغلاق النافذة المنبثقة عند النقر خارجها
settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        hideSettings();
    }
});
