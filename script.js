// Lấy tham chiếu tới các phần tử trong giao diện
const statusElement = document.getElementById("status");
const timeElement = document.getElementById("time");

let isTimerStarted = false;
let startTime = null;

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

        // Mô phỏng nhận tín hiệu bắt đầu bằng âm thanh mạnh (có thể thay thế bằng thuật toán phân tích tín hiệu âm thanh thực tế)
        const signalStrength = dataArray.reduce((acc, val) => acc + val, 0); // Tổng giá trị tín hiệu âm thanh
        const threshold = 1000; // Ngưỡng tín hiệu âm thanh

        if (signalStrength > threshold && !isTimerStarted) {
          // Khi tín hiệu đủ mạnh và timer chưa bắt đầu, bắt đầu đồng hồ
          isTimerStarted = true;
          startTime = Date.now();
        }

        if (isTimerStarted) {
          const elapsedTime = Date.now() - startTime;
          const seconds = Math.floor(elapsedTime / 1000);
          const milliseconds = elapsedTime % 1000;
          const timeFormatted = `${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(3, "0")}`;

          timeElement.textContent = timeFormatted;
        }

        requestAnimationFrame(processAudio);
      }

      processAudio();
    })
    .catch((error) => {
      statusElement.textContent = "Không thể truy cập micro: " + error.message;
    });
}
