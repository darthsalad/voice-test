import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [audioBlobs, setAudioBlobs] = useState<Blob[] | null>(null);
  const [globalMediaRecorder, setGlobalMediaRecorder] = useState<MediaRecorder | null>(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      SpeechRecognition.startListening({
        continuous: true,
        language: 'en-US',
        interimResults: true,
      });
      startAudioRecording();
    } else {
      SpeechRecognition.stopListening();
      clearTimeout(timer!);
      globalMediaRecorder?.stop();
    }
  }

  const reset = () => {
    resetTranscript();
    setAudioBlobs(null);
  }

  const startAudioRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        setGlobalMediaRecorder(mediaRecorder);
        mediaRecorder.start();
        const audioChunks: Blob[] = [];

        mediaRecorder.addEventListener("dataavailable", (event: any) => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          setAudioBlobs((prev) => {
            if (prev) {
              return [...prev, audioBlob];
            }
            return [audioBlob];
          })
        });
      });
  }

  useEffect(() => {
    if (listening && transcript !== "") {
      clearTimeout(timer!);
      setTimer(
        setTimeout(() => {
          SpeechRecognition.stopListening();
          setIsRecording(false);
        }, 10000)
      );
    }

    if (!browserSupportsSpeechRecognition) {
      alert(
        "Your browser does not support speech recognition software! Try Chrome desktop, maybe?"
      );
    }
  }, [transcript, listening]);

  useEffect(() => {
    return () => clearTimeout(timer!);
  }, [timer]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <h1 className="text-4xl font-bold text-center">Voice Stream Test</h1>

      <div className="w-1/2 flex items-center flex-col">
        <div className="text-2xl mt-8 font-semibold text-gray-600 text-center">
          {listening ? "Listening..." : "Click to start recording"}
        </div>
        <button type="button" className="mx-auto mt-4" onClick={handleRecord}>
          <svg
            className={`w-12 h-12 ${
              isRecording ? "text-red-600" : "text-gray-600"
            } fill-current ${isRecording && "animate-pulse"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path className="heroicon-ui" d="M12 14a2 2 0 100-4 2 2 0 000 4z" />
            <path
              className="heroicon-ui"
              d="M19 12a7 7 0 11-14 0 7 7 0 0114 0zm-7 5a5 5 0 100-10 5 5 0 000 10z"
            />
          </svg>
        </button>
      </div>
      <button
        type="button"
        className="mt-8 px-8 py-2 text-xl text-white bg-gray-900 rounded-md"
        onClick={reset}
      >
        Reset
      </button>
      <h2 className="mt-8 text-2xl font-semibold">Generated Transcript</h2>
      <p className="mt-8 text-xl font-semibold text-gray-300">{transcript}</p>
      {audioBlobs && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-center">
            Audio Recordings
          </h2>
          {audioBlobs.map((blob, index) => (
            <div key={index} className="flex justify-center items-center">
              <audio
                className="mt-4"
                controls
                src={URL.createObjectURL(blob)}
                autoPlay={false}
              />
              <button
                className="mt-4 ml-4 p-2 text-xl text-white bg-gray-900 rounded-full"
                onClick={() => {
                  // download audio
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  document.body.appendChild(a);
                  a.style.display = "none";
                  a.href = url;
                  a.download = "audio.wav";
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
              >
                <svg
                  className="w-6 h-6 fill-white font-bold"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z"
                    // fill="#1C274C"
                  />
                  <path
                    d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"
                    // fill="#1C274C"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
