// Khởi tạo biến timer và các thiết lập
let startTime;
let running = false;
let elapsedTime = 0;
let timerInterval;
let isMicActive = false;

// Hàm chuyển đổi thời gian từ milliseconds thành định dạng phút:giây.mili giây
function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${milliseconds < 100 ? '0' : ''}${milliseconds}`;
}

// Cập nhật đồng hồ
function updateTimer() {
    elapsedTime = Date.now() - startTime;
    document.getElementById("timer").textContent = formatTime(elapsedTime);
}

// Bắt đầu hoặc dừng timer
function startStopTimer() {
    if (!running) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 10);
        running = true;
    } else {
        clearInterval(timerInterval);
        running = false;
    }
}

// Lắng nghe sự kiện microphone
async function listenMicrophone() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        analyser.getByteFrequencyData(dataArray);
        
        setInterval(() => {
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }

            if (sum > 1000 && !isMicActive) {  // Nếu có tiếng động lớn, kích hoạt
                isMicActive = true;
                startStopTimer();  // Bắt đầu hoặc dừng timer
            } else if (sum < 1000 && isMicActive) {  // Nếu không có tiếng động, dừng
                isMicActive = false;
            }
        }, 100);
    } catch (err) {
        console.error("Không thể truy cập microphone: ", err);
    }
}

// Lắng nghe microphone khi trang tải
window.onload = listenMicrophone;
