// Kiểm tra hỗ trợ microphone và nhận dữ liệu từ microphone
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        
        let audioData = new Uint8Array(analyser.frequencyBinCount);
        
        function updateAudioData() {
            analyser.getByteFrequencyData(audioData);
            
            let peak = 0;
            for (let i = 0; i < audioData.length; i++) {
                if (audioData[i] > peak) peak = audioData[i];
            }
            
            // Kiểm tra nếu có tín hiệu âm thanh lớn đủ để nhận dạng (ví dụ: tiếng vỗ tay)
            if (peak > 100) {
                startTimer();
            } else {
                stopTimer();
            }

            requestAnimationFrame(updateAudioData);
        }

        updateAudioData();

        let startTime = 0;
        let timerInterval;
        let running = false;

        function startTimer() {
            if (!running) {
                running = true;
                startTime = Date.now() - (startTime || 0);
                timerInterval = setInterval(updateTimer, 10);
                document.getElementById('status').textContent = 'Đang đếm...';
            }
        }

        function stopTimer() {
            if (running) {
                clearInterval(timerInterval);
                running = false;
                document.getElementById('status').textContent = 'Dừng lại.';
            }
        }

        function updateTimer() {
            const elapsed = Date.now() - startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            const milliseconds = Math.floor((elapsed % 1000) / 10);
            document.getElementById('timer').textContent = `${padZero(minutes)}:${padZero(seconds)}.${padZero(milliseconds)}`;
        }

        function padZero(num) {
            return num < 10 ? '0' + num : num;
        }
    })
    .catch(function(err) {
        console.log("Không thể truy cập microphone: ", err);
    });
