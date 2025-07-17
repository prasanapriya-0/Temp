const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');

// Start camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
      video.play();
   };
  })
  .catch(err => {
    alert("Camera access failed:"+err.message);
    console.error("Camera error:",err);
 });

function captureFrame() {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw current frame to canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const frame = context.getImageData(0, 0, canvas.width, canvas.height);
  
  let totalRed = 0;
  let count = 0;

  for (let i = 0; i < frame.data.length; i += 4) {
    const red = frame.data[i];
    const green = frame.data[i + 1];
    const blue = frame.data[i + 2];

    // Basic skin-tone filter (very rough)
    if (red > 80 && green > 50 && blue < 100) {
      totalRed += red;
      count++;
    }
  }

  let avgRed = totalRed / count;

  // Approximate temp calculation (for demo only)
  let tempC = (avgRed - 50) / 2 + 36;
  tempC = Math.min(40, Math.max(34, tempC)); // clamp range
  let tempF = (tempC * 9 / 5) + 32;

  result.innerText = `Estimated Body Temp: ${tempC.toFixed(1)} °C / ${tempF.toFixed(1)} °F (Approx)`;
}
