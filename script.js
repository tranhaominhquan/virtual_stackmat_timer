const segments = [
    [true, true, true, false, true, true, true], // 0
    [false, false, true, false, false, true, false], // 1
    [true, false, true, true, true, false, true], // 2
    [true, false, true, true, false, true, true], // 3
    [false, true, true, true, false, true, true], // 4
    [true, true, false, true, false, true, true], // 5
    [true, true, false, true, true, true, true], // 6
    [true, false, true, false, false, true, false], // 7
    [true, true, true, true, true, true, true], // 8
    [true, true, true, true, false, true, true], // 9
];

let timerDisplay = document.getElementById('timer');
let statusDisplay = document.getElementById('status');
let isRecording = false;
let startTime, elapsedTime = 0, interval;

// Các function điều khiển các segment của đồng hồ 7-segment
const updateSegments = (digitId, segmentsState) => {
    const digit = document.getElementById(digitId);
    const segmentIds = ['top', 'top-right', 'bottom-right', 'bottom', 'bottom-left', 'top-left', 'middle'];
    segmentIds.forEach((segment, index) => {
        const segmentDiv = digit.querySelector(`.${segment}`);
        if (segmentsState[index]) {
            segmentDiv.classList.add('on');
            segmentDiv.classList.remove('off');
        } else {
            segmentDiv.classList.add('off');
            segmentDiv.classList.remove('on');
        }
    });
};

// Hàm cập nhật thời gian hiển thị
const updateTime = () => {
    elapsedTime = Date.now() - startTime;
    let minutes = Math.floor(elapsedTime / 60000);
    let seconds = Math.floor((elapsedTime % 60000) / 1000);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    milliseconds = (milliseconds < 10) ? '0' + milliseconds : milliseconds;

    // Cập nhật các chữ số
    updateSegments('digit-1', segments[parseInt(minutes[0])]);
    updateSegments('digit-2', segments[parseInt(minutes[1])]);
    updateSegments('digit-3', segments[parseInt(seconds[0])]);
    updateSegments('digit-4', segments[parseInt(seconds[1])]);
};

const startTimer = () => {
    startTime = Date.now() - elapsedTime;
    interval = setInterval(updateTime, 10);
    statusDisplay.textContent = "Đang ghi nhận...";
};

const stopTimer = () => {
    clearInterval(interval);
    statusDisplay.textContent = "Dừng ghi nhận.";
};

const startListening = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const detectSignal = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }

            if (sum > 5000 && !isRecording) {
                isRecording = true;
                startTimer();
            } else if (sum < 5000 && isRecording) {
                isRecording = false;
                stopTimer();
            }

            requestAnimationFrame(detectSignal);
        };
        
        detectSignal();
    })
    .catch(err => {
        statusDisplay.textContent = "Không thể truy cập microphone.";
        console.error(err);
    });
};

startListening();
