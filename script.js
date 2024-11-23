// Kết nối microphone
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'vi-VN';
recognition.interimResults = false;

recognition.onresult = (event) => {
    const time = event.results[0][0].transcript; // Nhận thời gian từ giọng nói
    updateDisplay(time); // Cập nhật lên màn hình
};

// Bắt đầu nghe từ microphone
recognition.start();

function updateDisplay(time) {
    const digits = time.split('');
    const segments = document.querySelectorAll('.seven-segment');
    
    // Làm trống các số cũ
    segments.forEach((seg, index) => {
        seg.className = 'seven-segment'; // Tắt toàn bộ
        if (digits[index]) seg.classList.add('on');
    });
}
