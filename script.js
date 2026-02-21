    // DOM Elements (mobile optimized)
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const fromCurrencyBadge = document.getElementById('fromCurrencyBadge');
const swapBtn = document.getElementById('swapBtn');
const convertBtn = document.getElementById('convertBtn');
const resultSpan = document.getElementById('convertedAmount');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const rateDisplay = document.getElementById('rateDisplay');
const updateTimeSpan = document.getElementById('updateTime');
const currentDateSpan = document.getElementById('currentDate');
const mobileThemeBtn = document.getElementById('mobileThemeToggle');

// Stats elements (static for display)
const eurUsdRate = document.getElementById('eurUsdRate');
const gbpUsdRate = document.getElementById('gbpUsdRate');
const usdJpyRate = document.getElementById('usdJpyRate');
const btcUsdRate = document.getElementById('btcUsdRate');

// Fixed rates (PKR, SAR, USD, INR)
const RATES = {
    'PKR': { 'SAR': 0.0135, 'USD': 0.0036, 'INR': 0.30 },
    'SAR': { 'PKR': 74.07, 'USD': 0.27, 'INR': 22.22 },
    'USD': { 'PKR': 277.78, 'SAR': 3.75, 'INR': 83.33 },
    'INR': { 'PKR': 3.33, 'SAR': 0.045, 'USD': 0.012 }
};

// History array
let conversionHistory = [];

// ========== THEME ==========
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    if (!mobileThemeBtn) return;
    const icon = mobileThemeBtn.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
}

// ========== DATE ==========
function updateDate() {
    if (!currentDateSpan) return;
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    currentDateSpan.textContent = now.toLocaleDateString('en-US', options);
}

// ========== CURRENCY DROPDOWNS ==========
function populateDropdowns() {
    if (!fromCurrency || !toCurrency) return;
    const currencies = [
        { code: 'PKR', name: 'Pakistani Rupee', flag: '🇵🇰' },
        { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
        { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
        { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' }
    ];
    fromCurrency.innerHTML = '';
    toCurrency.innerHTML = '';
    currencies.forEach(c => {
        const opt1 = document.createElement('option');
        opt1.value = c.code;
        opt1.textContent = `${c.flag} ${c.code} - ${c.name}`;
        fromCurrency.appendChild(opt1);
        const opt2 = document.createElement('option');
        opt2.value = c.code;
        opt2.textContent = `${c.flag} ${c.code} - ${c.name}`;
        toCurrency.appendChild(opt2);
    });
    fromCurrency.value = 'PKR';
    toCurrency.value = 'SAR';
    updateCurrencyBadges();
    updateRateInfo();
}

function getFlag(code) {
    const flags = { 'PKR': '🇵🇰', 'SAR': '🇸🇦', 'USD': '🇺🇸', 'INR': '🇮🇳' };
    return flags[code] || '🌍';
}

function updateCurrencyBadges() {
    if (!fromCurrencyBadge) return;
    fromCurrencyBadge.textContent = fromCurrency.value;
    // Update visual selectors
    const fromSel = document.getElementById('fromSelector');
    if (fromSel) {
        const flagSpan = fromSel.querySelector('.currency-flag');
        const codeSpan = fromSel.querySelector('.currency-code');
        if (flagSpan) flagSpan.textContent = getFlag(fromCurrency.value);
        if (codeSpan) codeSpan.textContent = fromCurrency.value;
    }
    const toSel = document.getElementById('toSelector');
    if (toSel) {
        const flagSpan = toSel.querySelector('.currency-flag');
        const codeSpan = toSel.querySelector('.currency-code');
        if (flagSpan) flagSpan.textContent = getFlag(toCurrency.value);
        if (codeSpan) codeSpan.textContent = toCurrency.value;
    }
}

function updateRateInfo() {
    if (!rateDisplay) return;
    const from = fromCurrency.value;
    const to = toCurrency.value;
    let rate = from === to ? 1 : (RATES[from]?.[to] || 0);
    rateDisplay.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    if (updateTimeSpan) updateTimeSpan.textContent = 'Updated now';
}

// ========== STATS (static demo) ==========
function updateStats() {
    if (eurUsdRate) eurUsdRate.textContent = '1.0923';
    if (gbpUsdRate) gbpUsdRate.textContent = '1.2845';
    if (usdJpyRate) usdJpyRate.textContent = '151.23';
    if (btcUsdRate) btcUsdRate.textContent = '43,256';
}

// ========== CONVERSION ==========
function convertCurrency() {
    if (!amountInput || !resultSpan) return;
    const amount = parseFloat(amountInput.value) || 0;
    const from = fromCurrency.value;
    const to = toCurrency.value;
    if (amount <= 0) {
        alert('Enter valid amount');
        return;
    }
    const rate = from === to ? 1 : (RATES[from]?.[to] || 0);
    const converted = amount * rate;
    resultSpan.innerHTML = converted.toFixed(2) + ' ' + to;
    addToHistory(amount, from, to, converted, rate);
}

// ========== HISTORY ==========
function addToHistory(amount, from, to, result, rate) {
    const item = {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
        amount: amount.toFixed(2),
        from, to,
        result: result.toFixed(2),
        rate: rate.toFixed(4),
        fromFlag: getFlag(from),
        toFlag: getFlag(to)
    };
    conversionHistory.unshift(item);
    if (conversionHistory.length > 5) conversionHistory.pop();
    renderHistory();
}

function renderHistory() {
    if (!historyList) return;
    if (!conversionHistory.length) {
        historyList.innerHTML = '<div class="empty-history">No conversions yet</div>';
        return;
    }
    let html = '';
    conversionHistory.forEach(item => {
        html += `
            <div class="history-item">
                <div>
                    <div><strong>${item.fromFlag} ${item.amount} ${item.from} → ${item.toFlag} ${item.result} ${item.to}</strong></div>
                    <small>1 ${item.from} = ${item.rate} ${item.to}</small>
                    <small>${item.time}</small>
                </div>
                <button class="delete-btn" onclick="deleteItem(${item.id})">✕</button>
            </div>
        `;
    });
    historyList.innerHTML = html;
}

window.deleteItem = function(id) {
    conversionHistory = conversionHistory.filter(item => item.id !== id);
    renderHistory();
};

function clearHistory() {
    if (conversionHistory.length) {
        conversionHistory = [];
        renderHistory();
    }
}

// ========== SWAP ==========
function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    updateCurrencyBadges();
    updateRateInfo();
}

// ========== EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    updateDate();
    populateDropdowns();
    updateRateInfo();
    updateStats();

    // Theme toggle
    if (mobileThemeBtn) {
        mobileThemeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTheme();
        });
    }

    // Convert
    if (convertBtn) convertBtn.addEventListener('click', convertCurrency);

    // Swap
    if (swapBtn) swapBtn.addEventListener('click', swapCurrencies);

    // Clear history
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearHistory);

    // Click on custom dropdown areas
    const fromSel = document.getElementById('fromSelector');
    if (fromSel) fromSel.addEventListener('click', () => fromCurrency.click());
    const toSel = document.getElementById('toSelector');
    if (toSel) toSel.addEventListener('click', () => toCurrency.click());

    // Currency change events
    if (fromCurrency) {
        fromCurrency.addEventListener('change', () => {
            updateCurrencyBadges();
            updateRateInfo();
        });
    }
    if (toCurrency) {
        toCurrency.addEventListener('change', () => {
            updateCurrencyBadges();
            updateRateInfo();
        });
    }

    // Enter key on amount
    if (amountInput) {
        amountInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') convertCurrency();
        });
    }

    // Show default conversion
    setTimeout(() => convertCurrency(), 100);
});