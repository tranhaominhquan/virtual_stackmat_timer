// Lắng nghe âm thanh từ microphone và phân tích thời gian
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function(stream) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);

    // Dữ liệu âm thanh sẽ được đọc trong một buffer
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function update() {
      analyser.getByteFrequencyData(dataArray);

      // Kiểm tra nếu có một sự kiện (âm thanh đủ lớn)
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }

      // Nếu có một âm thanh lớn, giả sử là tín hiệu "bắt đầu" thời gian
      if (sum > 1000) {
        startTimer();
      }

      requestAnimationFrame(update);
    }

    // Bắt đầu phân tích dữ liệu âm thanh
    update();
  })
  .catch(function(error) {
    console.log('Không thể truy cập microphone: ', error);
  });

let timer;
let elapsedTime = 0;
let isTiming = false;

function startTimer() {
  if (!isTiming) {
    isTiming = true;
    timer = setInterval(function() {
      elapsedTime++;
      const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0');
      const seconds = String(elapsedTime % 60).padStart(2, '0');
      document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
  }
}
