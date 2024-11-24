// Lấy tham chiếu tới các phần tử trong giao diện
const statusElement = document.getElementById("status");
const timeElement = document.getElementById("time");

// Kiểm tra quyền truy cập micro
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  statusElement.textContent = "Trình duyệt của bạn không hỗ trợ micro!";
} else {
  statusElement.textContent = "Đang kích hoạt micro...";
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      statusElement.textContent = "Micro đã kết nối!";

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      source.connect(analyser);

      // Phân tích dữ liệu từ micro
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      function processAudio() {
        analyser.getByteFrequencyData(dataArray);

        // Giả lập nhận dữ liệu từ timer qua tín hiệu âm thanh
        // (Đoạn này cần kết hợp với giải thuật xử lý tín hiệu Stackmat thực tế)
        const simulatedTime = "00:12.345"; // Thay thế bằng dữ liệu thực tế từ tín hiệu micro

        timeElement.textContent = simulatedTime;

        requestAnimationFrame(processAudio);
      }

      processAudio();
    })
    .catch((error) => {
      statusElement.textContent = "Không thể truy cập micro: " + error.message;
    });
}
