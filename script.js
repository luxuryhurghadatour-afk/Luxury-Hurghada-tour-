// Configuration
const API_URL = 'https://official-joke-api.appspot.com/random_joke';
const STORAGE_KEY = 'jokeHistory';
const MAX_HISTORY = 10;

// DOM Elements
const jokeText = document.getElementById('joke-text');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// State
let currentJoke = null;
let jokeHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    renderHistory();
    generateBtn.addEventListener('click', fetchJoke);
    copyBtn.addEventListener('click', copyToClipboard);
    clearHistoryBtn.addEventListener('click', clearHistory);
});

/**
 * Fetch a random joke from the API
 */
async function fetchJoke() {
    generateBtn.disabled = true;
    loadingDiv.classList.remove('hidden');
    hideError();

    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const joke = `${data.setup} ${data.punchline}`;
        
        currentJoke = joke;
        jokeText.textContent = joke;
        
        // Add to history
        addToHistory(joke);
        
    } catch (error) {
        showError(`Failed to load joke: ${error.message}`);
        console.error('Error fetching joke:', error);
    } finally {
        generateBtn.disabled = false;
        loadingDiv.classList.add('hidden');
    }
}

/**
 * Copy current joke to clipboard
 */
async function copyToClipboard() {
    if (!currentJoke) {
        showError('No joke to copy. Generate one first!');
        return;
    }

    try {
        await navigator.clipboard.writeText(currentJoke);
        
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard');
        console.error('Copy error:', error);
    }
}

/**
 * Add joke to history
 */
function addToHistory(joke) {
    // Remove duplicate if exists
    jokeHistory = jokeHistory.filter(j => j !== joke);
    
    // Add to beginning
    jokeHistory.unshift(joke);
    
    // Keep only MAX_HISTORY items
    jokeHistory = jokeHistory.slice(0, MAX_HISTORY);
    
    // Save to localStorage
    saveHistory();
    
    // Update UI
    renderHistory();
}

/**
 * Render joke history
 */
function renderHistory() {
    historyList.innerHTML = '';
    
    if (jokeHistory.length === 0) {
        historyList.innerHTML = '<li>No jokes yet. Generate one!</li>';
        historyList.classList.add('empty');
        return;
    }
    
    historyList.classList.remove('empty');
    
    jokeHistory.forEach((joke, index) => {
        const li = document.createElement('li');
        li.textContent = joke;
        li.title = 'Click to use this joke';
        li.addEventListener('click', () => {
            currentJoke = joke;
            jokeText.textContent = joke;
            jokeText.style.animation = 'none';
            setTimeout(() => {
                jokeText.style.animation = '';
            }, 10);
        });
        historyList.appendChild(li);
    });
}

/**
 * Clear joke history
 */
function clearHistory() {
    if (confirm('Are you sure you want to clear all joke history?')) {
        jokeHistory = [];
        saveHistory();
        renderHistory();
    }
}

/**
 * Save history to localStorage
 */
function saveHistory() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jokeHistory));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Load history from localStorage
 */
function loadHistory() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        jokeHistory = stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        jokeHistory = [];
    }
}

/**
 * Show error message
 */
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

/**
 * Hide error message
 */
function hideError() {
    errorDiv.classList.add('hidden');
}