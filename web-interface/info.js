// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAMuS3Ws7Cag09pFnhFLYlAhfVrSc6P4Ok",
    authDomain: "doan1-smart-farm.firebaseapp.com",
    databaseURL: "https://doan1-smart-farm-default-rtdb.firebaseio.com",
    projectId: "doan1-smart-farm",
    storageBucket: "doan1-smart-farm.firebasestorage.app",
    messagingSenderId: "830835298619",
    appId: "1:830835298619:web:eacaeb018377d02f70271e",
    measurementId: "G-KR5CTLBRG1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Hàng 1: Hiển thị thông tin hiện tại
// Temperature
const tempIcon = document.getElementById('temp-icon');
const tempValue = document.getElementById('temp-value');
const tempudIcon = document.getElementById('temp-ud-icon');
let PreTemp = null;

database.ref('/dht22/temp').on('value', (snapshot) => {
    const temperature = snapshot.val();
    if (temperature !== null) {
        tempValue.textContent = temperature.toFixed(1);
        let newTempIcon;
        if (temperature > 32) {
            newTempIcon = 'img/high-temp.png';
        } else if (temperature < 26) {
            newTempIcon = 'img/low-temp.png';
        } else {
            newTempIcon = 'img/mid-temp.png';
        }
        tempIcon.src = newTempIcon;

        let newTempudIcon;
        if (PreTemp !== null) {
            newTempudIcon = temperature > PreTemp ? 'img/up.png' : 'img/down.png';
            tempudIcon.src = newTempudIcon;
        }
        PreTemp = temperature;
    } else {
        console.error('Cannot receive temperature from Firebase');
        tempValue.textContent = 'N/A';
    }
});

// Humidity
const humiValue = document.getElementById('humi-value');
const humiudIcon = document.getElementById('humi-ud-icon');
let PreHumi = null;

database.ref('/dht22/humi').on('value', (snapshot) => {
    const humidity = snapshot.val();
    if (humidity !== null) {
        humiValue.textContent = humidity.toFixed(1);
        let newHumiudIcon;
        if (PreHumi !== null) {
            newHumiudIcon = humidity > PreHumi ? 'img/up.png' : 'img/down.png';
            humiudIcon.src = newHumiudIcon;
        }
        PreHumi = humidity;
    } else {
        console.error('Cannot receive humidity from Firebase');
        humiValue.textContent = 'N/A';
    }
});

// TVOC
const tvocValue = document.getElementById('tvoc-value');
const tvocudIcon = document.getElementById('tvoc-ud-icon');
let PreTvoc = null;

database.ref('/ens160/tvoc').on('value', (snapshot) => {
    const tvoc = snapshot.val();
    if (tvoc !== null) {
        tvocValue.textContent = tvoc;
    } else {
        console.error('Cannot receive TVOC from Firebase');
        tvocValue.textContent = 'N/A';
    }
});

// CO2
const co2Value = document.getElementById('co2-value');
const co2udIcon = document.getElementById('co2-ud-icon');
let PreCo2 = null;

database.ref('/ens160/co2').on('value', (snapshot) => {
    const co2 = snapshot.val();
    if (co2 !== null) {
        co2Value.textContent = co2;
        let newCo2udIcon;
        if (PreCo2 !== null) {
            newCo2udIcon = co2 > PreCo2 ? 'img/up.png' : 'img/down.png';
            co2udIcon.src = newCo2udIcon;
        }
        PreCo2 = co2;
    } else {
        console.error('Cannot receive CO2 from Firebase');
        co2Value.textContent = 'N/A';
    }
});

// Hàng 2: Giá trị cao/thấp/trung bình nhất trong ngày
// Lấy ngày hiện tại (YYYY-MM-DD)
const today = new Date().toISOString().split('T')[0];

// Temperature Max/Min/Avg
const tempMax = document.getElementById('temp-max');
const tempMin = document.getElementById('temp-min');
const tempAvg = document.getElementById('temp-avg');
database.ref('/dht22/temp_history').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        let max = -Infinity;
        let min = Infinity;
        let sum = 0;
        let count = 0;
        Object.values(data).forEach(entry => {
            const date = entry.timestamp.split(' ')[0];
            if (date === today) {
                const value = parseFloat(entry.value);
                max = Math.max(max, value);
                min = Math.min(min, value);
                sum += value;
                count++;
            }
        });
        tempMax.textContent = max !== -Infinity ? max.toFixed(1) : 'N/A';
        tempMin.textContent = min !== Infinity ? min.toFixed(1) : 'N/A';
        tempAvg.textContent = count > 0 ? (sum / count).toFixed(1) : 'N/A';
    } else {
        tempMax.textContent = 'N/A';
        tempMin.textContent = 'N/A';
        tempAvg.textContent = 'N/A';
    }
});

// Humidity Max/Min/Avg
const humiMax = document.getElementById('humi-max');
const humiMin = document.getElementById('humi-min');
const humiAvg = document.getElementById('humi-avg');
database.ref('/dht22/humi_history').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        let max = -Infinity;
        let min = Infinity;
        let sum = 0;
        let count = 0;
        Object.values(data).forEach(entry => {
            const date = entry.timestamp.split(' ')[0];
            if (date === today) {
                const value = parseFloat(entry.value);
                max = Math.max(max, value);
                min = Math.min(min, value);
                sum += value;
                count++;
            }
        });
        humiMax.textContent = max !== -Infinity ? max.toFixed(1) : 'N/A';
        humiMin.textContent = min !== Infinity ? min.toFixed(1) : 'N/A';
        humiAvg.textContent = count > 0 ? (sum / count).toFixed(1) : 'N/A';
    } else {
        humiMax.textContent = 'N/A';
        humiMin.textContent = 'N/A';
        humiAvg.textContent = 'N/A';
    }
});

// TVOC Max/Min/Avg
const tvocMax = document.getElementById('tvoc-max');
const tvocMin = document.getElementById('tvoc-min');
const tvocAvg = document.getElementById('tvoc-avg');
database.ref('/ens160/tvoc_history').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        let max = -Infinity;
        let min = Infinity;
        let sum = 0;
        let count = 0;
        Object.values(data).forEach(entry => {
            const date = entry.timestamp.split(' ')[0];
            if (date === today) {
                const value = parseInt(entry.value);
                max = Math.max(max, value);
                min = Math.min(min, value);
                sum += value;
                count++;
            }
        });
        tvocMax.textContent = max !== -Infinity ? max : 'N/A';
        tvocMin.textContent = min !== Infinity ? min : 'N/A';
        tvocAvg.textContent = count > 0 ? (sum / count).toFixed(0) : 'N/A';
    } else {
        tvocMax.textContent = 'N/A';
        tvocMin.textContent = 'N/A';
        tvocAvg.textContent = 'N/A';
    }
});

// CO2 Max/Min/Avg
const co2Max = document.getElementById('co2-max');
const co2Min = document.getElementById('co2-min');
const co2Avg = document.getElementById('co2-avg');
database.ref('/ens160/co2_history').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        let max = -Infinity;
        let min = Infinity;
        let sum = 0;
        let count = 0;
        Object.values(data).forEach(entry => {
            const date = entry.timestamp.split(' ')[0];
            if (date === today) {
                const value = parseInt(entry.value);
                max = Math.max(max, value);
                min = Math.min(min, value);
                sum += value;
                count++;
            }
        });
        co2Max.textContent = max !== -Infinity ? max : 'N/A';
        co2Min.textContent = min !== Infinity ? min : 'N/A';
        co2Avg.textContent = count > 0 ? (sum / count).toFixed(0) : 'N/A';
    } else {
        co2Max.textContent = 'N/A';
        co2Min.textContent = 'N/A';
        co2Avg.textContent = 'N/A';
    }
});

// Navigation functions
function func_home() {
    window.location.href = 'index.html';
}

function func_info() {
    window.location.href = 'info.html';
}

function func_chart() {
    window.location.href = 'index.html';
}