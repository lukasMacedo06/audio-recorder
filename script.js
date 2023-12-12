document.getElementById('start').addEventListener('click', startRecording);
document.getElementById('stop').addEventListener('click', stopRecording);

let mediaRecorder;
let audioChunks = [];

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => {
      audioChunks.push(e.data);
    };
    mediaRecorder.start();

    document.getElementById('start').disabled = true;
    document.getElementById('stop').disabled = false;
  });
}

function stopRecording() {
  mediaRecorder.stop();
  document.getElementById('stop').disabled = true;

  mediaRecorder.onstop = async () => {
    console.log('Recording stopped');
    console.log('audioChunks', audioChunks);
    console.log(URL.createObjectURL(audioChunks[0]));
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    audioChunks = [];

    console.log('audioBlob === ', audioBlob);
    console.log(URL.createObjectURL(audioBlob));
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await new AudioContext().decodeAudioData(arrayBuffer);
    const mp3Buffer = convertToMp3(audioBuffer);
    console.log('mp3Buffer === ', mp3Buffer);

    const audioUrl = URL.createObjectURL(mp3Buffer);
    document.getElementById('audio').src = audioUrl;

    document.getElementById('start').disabled = false;
  };
}

function convertToMp3(audioBuffer) {
  const channels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);

  let mp3Data = [];
  let bufferLeft = audioBuffer.getChannelData(0);
  let bufferRight = channels === 2 ? audioBuffer.getChannelData(1) : bufferLeft;

  let lenL = bufferLeft.length,
    i = 0;
  let lenR = bufferRight.length;
  let dataAsInt16ArrayLeft = new Int16Array(lenL);
  let dataAsInt16ArrayRight = new Int16Array(lenR);

  while (i < lenL) {
    dataAsInt16ArrayLeft[i] = convert(bufferLeft[i++]);
    dataAsInt16ArrayRight[i] = convert(bufferRight[i++]);
  }
  function convert(n) {
    var v = n < 0 ? n * 32768 : n * 32767; // convert in range [-32768, 32767]
    return Math.max(-32768, Math.min(32768, v)); // clamp
  }

  // Encoding each chunk
  let remaining = dataAsInt16ArrayLeft.length;
  const sampleBlockSize = 1152; // Number of samples per channel in a MP3 frame

  console.log('Channels: ' + channels);
  console.log('Sample Rate: ' + sampleRate);

  for (let i = 0; i < remaining; i += sampleBlockSize) {
    let leftChunk = dataAsInt16ArrayLeft.subarray(i, i + sampleBlockSize);
    let rightChunk = dataAsInt16ArrayRight.subarray(i, i + sampleBlockSize);
    let mp3buf =
      channels === 1
        ? mp3encoder.encodeBuffer(leftChunk)
        : mp3encoder.encodeBuffer(leftChunk, rightChunk);
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }

    console.log('Processing chunk size: ' + leftChunk.length);
    console.log('MP3 buffer length: ' + mp3buf.length);
  }

  let flush = mp3encoder.flush(); // Finish encoding
  if (flush.length > 0) {
    mp3Data.push(new Int8Array(flush));
  }
  console.log('Flush length: ' + flush.length);

  return new Blob(mp3Data, { type: 'audio/mp3' });
}
