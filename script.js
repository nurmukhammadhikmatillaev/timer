


const tabs = document.querySelectorAll('.tab');
const contents = {
    stopwatch: document.getElementById('stopwatch'),
    timer: document.getElementById('timer'),
    alarm: document.getElementById('alarm'),
    world: document.getElementById('world')
};

const stopwatchDisplay = document.getElementById('stopwatch-display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

let stopwatchStartTime = 0;
let stopwatchElapsed = 0;
let stopwatchInterval = null;
let stopwatchRunning = false;

function formatStopwatch(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}.${tenths}`;
}

function updateStopwatch() {
    if (stopwatchRunning) {
        stopwatchElapsed = Date.now() - stopwatchStartTime;
        stopwatchDisplay.textContent = formatStopwatch(stopwatchElapsed);
    }
}

function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        stopwatchStartTime = Date.now() - stopwatchElapsed;
        stopwatchInterval = setInterval(updateStopwatch, 100);
    }
}

function stopStopwatch() {
    if (stopwatchRunning) {
        stopwatchRunning = false;
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
}

function resetStopwatch() {
    stopStopwatch();
    stopwatchElapsed = 0;
    stopwatchDisplay.textContent = formatStopwatch(0);
}


const timerDisplay = document.getElementById('timer-display');
const timerMinutes = document.getElementById('timer-minutes');
const timerStartBtn = document.getElementById('timerStartBtn');
const timerStopBtn = document.getElementById('timerStopBtn');
const timerResetBtn = document.getElementById('timerResetBtn');

let timerEndTime = 0;
let timerInterval = null;
let timerRunning = false;
let timerValue = 5 * 60 * 1000; 

function formatTimer(ms) {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}.${tenths}`;
}

function updateTimer() {
    if (timerRunning) {
        const remaining = timerEndTime - Date.now();
        if (remaining <= 0) {
         
            timerDisplay.textContent = formatTimer(0);
            stopTimer();
            playAlarm();
            alert('⏰ Таймер сработал!');
        } else {
            timerDisplay.textContent = formatTimer(remaining);
        }
    }
}

function startTimer() {
    if (!timerRunning) {
        const minutes = parseInt(timerMinutes.value) || 0;
        timerValue = minutes * 60 * 1000;
        timerEndTime = Date.now() + timerValue;
        timerRunning = true;
        timerInterval = setInterval(updateTimer, 100);
    }
}

function stopTimer() {
    if (timerRunning) {
        timerRunning = false;
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    const minutes = parseInt(timerMinutes.value) || 0;
    timerDisplay.textContent = formatTimer(minutes * 60 * 1000);
}


const alarmTimeInput = document.getElementById('alarm-time');
const alarmDisplay = document.getElementById('alarm-display');
const setAlarmBtn = document.getElementById('setAlarmBtn');
const clearAlarmBtn = document.getElementById('clearAlarmBtn');
const alarmStatus = document.getElementById('alarm-status');
const alarmSound = document.getElementById('alarm-sound');

let alarmTime = null;
let alarmInterval = null;
let alarmActive = false;

function updateAlarmDisplay() {
    const now = new Date();
    alarmDisplay.textContent = now.toLocaleTimeString('ru-RU');
    
    // Проверяем будильник
    if (alarmActive && alarmTime) {
        const currentTime = now.getHours() * 60 + now.getMinutes();
        if (currentTime === alarmTime) {
            playAlarm();
            alarmStatus.textContent = '⏰ Будильник сработал!';
            alarmActive = false;
        }
    }
}

function setAlarm() {
    const timeStr = alarmTimeInput.value;
    if (timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        alarmTime = hours * 60 + minutes;
        alarmActive = true;
        alarmStatus.textContent = `Будильник установлен на ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
}

function clearAlarm() {
    alarmActive = false;
    alarmTime = null;
    alarmStatus.textContent = 'Будильник сброшен';
}

function playAlarm() {
    alarmSound.play().catch(e => console.log('Не удалось воспроизвести звук'));
}

const worldTimes = document.getElementById('world-times');

const cities = [
    { name: 'Москва', offset: 3 },
    { name: 'Лондон', offset: 0 },
    { name: 'Нью-Йорк', offset: -4 },
    { name: 'Токио', offset: 9 },
    { name: 'Сидней', offset: 11 },
    { name: 'Дубай', offset: 4 }
];

function updateWorldTimes() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    
    let html = '';
    cities.forEach(city => {
        const cityTime = new Date(utc + (3600000 * city.offset));
        const timeStr = cityTime.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        html += `
            <div class="city-time">
                <span class="city-name">${city.name}</span>
                <span class="time-value">${timeStr}</span>
            </div>
        `;
    });
    worldTimes.innerHTML = html;
}


tabs.forEach(tab => {
    tab.addEventListener('click', () => {

        tabs.forEach(t => t.classList.remove('active'));
  
        tab.classList.add('active');
        
   
        Object.values(contents).forEach(content => {
            content.classList.add('hidden');
        });
        
  
        const tabName = tab.getAttribute('data-tab');
        contents[tabName].classList.remove('hidden');
    });
});


startBtn.addEventListener('click', startStopwatch);
stopBtn.addEventListener('click', stopStopwatch);
resetBtn.addEventListener('click', resetStopwatch);


timerStartBtn.addEventListener('click', startTimer);
timerStopBtn.addEventListener('click', stopTimer);
timerResetBtn.addEventListener('click', resetTimer);
timerMinutes.addEventListener('input', () => {
    const minutes = parseInt(timerMinutes.value) || 0;
    timerDisplay.textContent = formatTimer(minutes * 60 * 1000);
});


setAlarmBtn.addEventListener('click', setAlarm);
clearAlarmBtn.addEventListener('click', clearAlarm);
setInterval(updateAlarmDisplay, 1000);


updateWorldTimes();
setInterval(updateWorldTimes, 1000);


updateAlarmDisplay();
updateWorldTimes();


resetStopwatch();
resetTimer();