// Kiểm tra nếu trình duyệt hỗ trợ SpeechRecognition
if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'vi-VN'; // Thiết lập ngôn ngữ tiếng Việt
    recognition.interimResults = false; // Không hiển thị kết quả tạm thời
    recognition.maxAlternatives = 1; // Chỉ lấy kết quả duy nhất

    let timerRunning = false; // Cờ để theo dõi trạng thái đồng hồ
    let startTime = 0; // Thời gian bắt đầu
    let currentTime = 0; // Thời gian hiện tại
    let timerInterval; // Biến lưu interval của đồng hồ

    // Hàm bắt đầu hoặc dừng đồng hồ
    function toggleTimer() {
        if (!timerRunning) {
            startTime = Date.now() - currentTime; // Thiết lập thời gian bắt đầu
            timerInterval = setInterval(updateTimer, 10); // Cập nhật đồng hồ mỗi 10ms
            timerRunning = true;
        } else {
            clearInterval(timerInterval); // Dừng đồng hồ
            timerRunning = false;
        }
    }

    // Cập nhật đồng hồ
    function updateTimer() {
        currentTime = Date.now() - startTime; // Tính thời gian đã trôi qua
        document.getElementById('timer').textContent = formatTime(currentTime); // Cập nhật hiển thị
    }

    // Hàm định dạng thời gian theo phút:giây.mili
    function formatTime(ms) {
        let seconds = Math.floor(ms / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        ms = ms % 1000;

        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${Math.floor(ms / 10)}`;
    }

    // Lắng nghe kết quả nhận dạng giọng nói
    recognition.onresult = function(event) {
        const speech = event.results[0][0].transcript.toLowerCase();

        // Kiểm tra lệnh "bắt đầu" hoặc "dừng"
        if (speech.includes("bắt đầu") && !timerRunning) {
            toggleTimer(); // Bắt đầu hoặc dừng đồng hồ
        } else if (speech.includes("dừng") && timerRunning) {
            toggleTimer(); // Dừng đồng hồ
        }
    };

    recognition.onerror = function(event) {
        console.error("Lỗi trong quá trình nhận dạng: ", event.error);
    };

    recognition.onspeechend = function() {
        recognition.start(); // Tiếp tục lắng nghe sau khi nhận dạng xong
    };

    // Bắt đầu nhận diện giọng nói
    recognition.start();
} else {
    alert("Trình duyệt của bạn không hỗ trợ SpeechRecognition API.");
}
