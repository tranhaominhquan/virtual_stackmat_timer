let startTime = null;
let isRunning = false;
const timerDisplay = document.getElementById("timer");
const statusDisplay = document.getElementById("status");

document.addEventListener("keydown", () => {
    if (!isRunning) {
        startMicrophone();
    }
});

async function startMicrophone() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        microphone.connect(analyser);
        const dataArray = new Uint8Array(analyser.fftSize);

        statusDisplay.textContent = "Micro đang hoạt động. Đợi tín hiệu âm thanh...";
        isRunning = true;

        detectSound(analyser, dataArray);
    } catch (err) {
        statusDisplay.textContent = "Không thể truy cập micro: " + err.message;
        console.error(err);
    }
}

function detectSound(analyser, dataArray) {
    const detectThreshold = 100;
    const interval = 50; // 50ms

    const checkSound = () => {
        analyser.getByteTimeDomainData(dataArray);
        const volume = dataArray.reduce((sum, value) => sum + Math.abs(value - 128), 0) / dataArray.length;

        if (volume > detectThreshold) {
            if (!startTime) {
                startTime = performance.now();
                statusDisplay.textContent = "Đang tính giờ...";
            } else {
                const elapsed = (performance.now() - startTime) / 1000;
                timerDisplay.textContent = elapsed.toFixed(2);
                statusDisplay.textContent = "Đã dừng tính giờ.";
                startTime = null;
                isRunning = false;
            }
        }

        if (isRunning) {
            setTimeout(checkSound, interval);
        }
    };

    checkSound();
}
