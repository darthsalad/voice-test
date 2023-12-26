import { Inter } from 'next/font/google'
import { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleRecord = () => {
    setIsRecording(!isRecording);
    isRecording ? SpeechRecognition.stopListening() : SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US',
      interimResults: true,
    });
  }

  if (!browserSupportsSpeechRecognition) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
      >
        <h1 className="text-4xl font-bold text-center">Voice Stream Test</h1>
        <p className="mt-8 text-xl font-bold text-center">
          Your browser doesn't support speech recognition.
        </p>
      </main>
    );
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <h1 className="text-4xl font-bold text-center">Voice Stream Test</h1>

      <div className="relative w-1/2">
        {listening && (
          <div className='text-2xl font-semibold text-gray-600'>
            Listening...
          </div>
        )}
        <input
          type="text"
          className="w-full mt-8 p-4 text-2xl border-gray-600 border-2 bg-black rounded-md"
          placeholder="Click the mic icon to start"
        />
        <button
          type="button"
          className={`absolute ${listening ? "top-20" : "top-1/2"} right-2 transform -translate-y-2`}
          onClick={handleRecord}
        >
          <svg
            className={`w-12 h-12 ${isRecording ? "text-red-600" : "text-gray-600"} fill-current ${isRecording && "animate-pulse"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              className="heroicon-ui"
              d="M12 14a2 2 0 100-4 2 2 0 000 4z"
            />
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
        onClick={resetTranscript}
      >
        Reset
      </button>
      <h2 className="mt-8 text-2xl font-semibold">
        Generated Transcript
      </h2>
      <p className="mt-8 text-xl font-semibold text-gray-300">
        {transcript}
      </p>
    </main>
  );
}
