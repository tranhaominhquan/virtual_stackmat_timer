let timerInterval;
let running = false;
let startTime = 0;
let elapsedTime = 0;

function toggleTimer() {
    if (running) {
        clearInterval(timerInterval);
        document.getElementById('startStopButton').textContent = 'Bắt đầu';
    } else {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 10);
        document.getElementById('startStopButton').textContent = 'Dừng lại';
    }
    running = !running;
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    const seconds = Math.floor(elapsedTime / 1000) % 60;
    const minutes = Math.floor(elapsedTime / (1000 * 60)) % 60;
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60)) % 24;

    document.getElementById('timer').textContent = formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds);
}

function formatTime(time) {
    return time < 10 ? "0" + time : time;
}

function resetTimer() {
    clearInterval(timerInterval);
    running = false;
    elapsedTime = 0;
    document.getElementById('timer').textContent = '00:00:00';
    document.getElementById('startStopButton').textContent = 'Bắt đầu';
}

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function detectSound() {
            analyser.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }

            const average = sum / bufferLength;
            if (average > 100) {
                // Xử lý khi có tín hiệu mạnh từ microphone (có thể là từ các timer)
                console.log("Có tín hiệu âm thanh");
                if (!running) {
                    toggleTimer(); // Tự động bắt đầu bấm giờ
                }
            }

            requestAnimationFrame(detectSound);
        }

        detectSound();
    })
    .catch(err => {
        console.error("Không thể truy cập microphone: ", err);
    });
