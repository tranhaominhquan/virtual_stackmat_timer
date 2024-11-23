let time = 0; // Đếm thời gian bằng giây

// Hàm để chuyển đổi thời gian sang định dạng HH:MM:SS
function formatTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;

    // Đảm bảo các số nhỏ hơn 10 có định dạng 2 chữ số
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Hàm để cập nhật thời gian hiển thị
function updateTimeDisplay() {
    document.getElementById('timeDisplay').textContent = formatTime(time);
}

// Tạo một vòng lặp để tăng thời gian mỗi giây
setInterval(() => {
    time++;
    updateTimeDisplay();
}, 1000);

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        // Lọc âm thanh hoặc phân tích dữ liệu ở đây
        // (Cần thêm logic để nhận diện tín hiệu từ timer cụ thể)
    })
    .catch(error => {
        console.log("Không thể truy cập microphone: ", error);
    });
