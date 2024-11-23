let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioContext.createAnalyser();
let microphone;
let startTimer = false;
let time = 0;

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyseAudio();
    })
    .catch(error => {
        console.error('Lỗi khi truy cập microphone', error);
    });

function analyseAudio() {
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    function update() {
        analyser.getByteFrequencyData(dataArray);
        let volume = getVolume(dataArray);

        // Điều kiện để bắt đầu dừng đếm thời gian khi âm thanh đạt một ngưỡng
        if (volume > 150) {
            if (!startTimer) {
                startTimer = true;
                startCount();
            }
        }

        requestAnimationFrame(update);
    }

    update();
}

function getVolume(dataArray) {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    return sum / dataArray.length;
}

function startCount() {
    let timerInterval = setInterval(() => {
        if (startTimer) {
            time++;
            updateLCD(time);
        }
    }, 1000);
}

function updateLCD(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    let formattedTime = formatTime(minutes) + "." + formatTime(seconds);
    displayTime(formattedTime);
}

function formatTime(time) {
    return time < 10 ? "0" + time : time;
}

function displayTime(formattedTime) {
    let digits = formattedTime.split('');
    for (let i = 0; i < digits.length; i++) {
        document.getElementById('digit' + (i + 1)).textContent = digits[i];
    }
}
