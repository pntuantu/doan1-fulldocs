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
const humiIcon = document.getElementById('humi-icon');
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
const tvocIcon = document.getElementById('tvoc-icon');
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
const co2Icon = document.getElementById('co2-icon');
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

// Charts
const ctxTemp = document.getElementById('temp-chart').getContext('2d');
const tempChart = new Chart(ctxTemp, {
  type: 'line',
  data: {
      labels: [],
      datasets: [{ label: 'Nhiệt độ', data: [], borderColor: 'red' }]
  }
});

const ctxHumi = document.getElementById('humi-chart').getContext('2d');
const humiChart = new Chart(ctxHumi, {
  type: 'line',
  data: {
      labels: [],
      datasets: [{ label: 'Độ ẩm', data: [], borderColor: 'green' }]
  }
});

const ctxTvoc = document.getElementById('tvoc-chart').getContext('2d');
const tvocChart = new Chart(ctxTvoc, {
  type: 'line',
  data: {
      labels: [],
      datasets: [{ label: 'TVOC', data: [], borderColor: 'blue' }]
  }
});

const ctxCo2 = document.getElementById('co2-chart').getContext('2d');
const co2Chart = new Chart(ctxCo2, {
  type: 'line',
  data: {
      labels: [],
      datasets: [{ label: 'CO2', data: [], borderColor: 'orange' }]
  }
});

function upChart() {
  const time = new Date().toLocaleTimeString();
  firebase.database().ref('/dht22/temp').once('value', snap => {
      const val = snap.val();
      if (val !== null) {
          tempChart.data.datasets[0].data.push(val);
          tempChart.data.labels.push(time);
          if (tempChart.data.labels.length > 10) {
              tempChart.data.labels.shift();
              tempChart.data.datasets[0].data.shift();
          }
          tempChart.update();
      }
  });
  firebase.database().ref('/dht22/humi').once('value', snap => {
      const val = snap.val();
      if (val !== null) {
          humiChart.data.datasets[0].data.push(val);
          humiChart.data.labels.push(time);
          if (humiChart.data.labels.length > 10) {
              humiChart.data.labels.shift();
              humiChart.data.datasets[0].data.shift();
          }
          humiChart.update();
      }
  });
  firebase.database().ref('/ens160/tvoc').once('value', snap => {
      const val = snap.val();
      if (val !== null) {
          tvocChart.data.datasets[0].data.push(val);
          tvocChart.data.labels.push(time);
          if (tvocChart.data.labels.length > 10) {
              tvocChart.data.labels.shift();
              tvocChart.data.datasets[0].data.shift();
          }
          tvocChart.update();
      }
  });
  firebase.database().ref('/ens160/co2').once('value', snap => {
      const val = snap.val();
      if (val !== null) {
          co2Chart.data.datasets[0].data.push(val);
          co2Chart.data.labels.push(time);
          if (co2Chart.data.labels.length > 10) {
              co2Chart.data.labels.shift();
              co2Chart.data.datasets[0].data.shift();
          }
          co2Chart.update();
      }
  });
}

setInterval(upChart, 60000); // Update every 1 minute
upChart();

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