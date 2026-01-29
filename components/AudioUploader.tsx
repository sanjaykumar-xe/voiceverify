import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UploadCloudIcon, AudioWaveformIcon, ClockIcon, InfoIcon, TrashIcon, Mic2Icon, SquareIcon, ZapIcon } from './icons';
import { Spinner } from './Spinner';

interface AudioUploaderProps {
  onAnalyze: (file: File) => void;
  isLoading: boolean;
  error: string | null;
  isGuest: boolean;
  onExitGuest: () => void;
}

interface AudioMetadata {
  duration: string;
  size: string;
  type: string;
}

type UploaderMode = 'upload' | 'record';

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onAnalyze, isLoading, error: externalError, isGuest, onExitGuest }) => {
  const [mode, setMode] = useState<UploaderMode>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<AudioMetadata | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordDuration, setRecordDuration] = useState<number>(0);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const error = externalError || localError;

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const processFile = (selectedFile: File) => {
    setLocalError(null);
    if (selectedFile.size > 10 * 1024 * 1024) {
      setLocalError("File size exceeds 10MB limit.");
      return;
    }

    const audio = new Audio();
    const objectUrl = URL.createObjectURL(selectedFile);
    audio.src = objectUrl;
    audio.addEventListener('loadedmetadata', () => {
      setMetadata({
        duration: formatDuration(audio.duration),
        size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: selectedFile.type.split('/')[1].toUpperCase() || 'AUDIO'
      });
      URL.revokeObjectURL(objectUrl);
    });

    setFile(selectedFile);
  };

  const startRecording = async () => {
    if (isGuest) return; // Should be handled by UI visibility, but added for safety
    setLocalError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("MediaDevices API is not supported in this browser.");
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some(device => device.kind === 'audioinput');
      
      if (!hasMic) {
        setLocalError("No microphone detected. Please connect a recording device.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const recordedFile = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
        processFile(recordedFile);
        stream.getTracks().forEach(track => track.stop());
        stopVisualizer();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordDuration(0);
      setFile(null);
      
      timerRef.current = window.setInterval(() => setRecordDuration(prev => prev + 1), 1000);
      startVisualizer(stream);
    } catch (err: any) {
      setLocalError(`Error accessing microphone: ${err.message || 'Unknown error'}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const startVisualizer = (stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      drawVisualizer();
    } catch (e) { console.warn(e); }
  };

  const stopVisualizer = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      animationFrameRef.current = requestAnimationFrame(renderFrame);
      analyserRef.current!.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = `rgba(14, 165, 233, ${Math.max(0.2, dataArray[i]/255)})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    renderFrame();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {error && (
        <div className="w-full mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm text-center font-bold animate-fade-in-short">
          {error}
        </div>
      )}

      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-8 w-full max-w-xs">
        <button 
          onClick={() => { setMode('upload'); setFile(null); setLocalError(null); }}
          disabled={isRecording || isLoading}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black transition-all ${mode === 'upload' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <UploadCloudIcon className="w-4 h-4" />
          File Upload
        </button>
        <button 
          onClick={() => { setMode('record'); setFile(null); setLocalError(null); }}
          disabled={isRecording || isLoading}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black transition-all relative ${mode === 'record' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <Mic2Icon className="w-4 h-4" />
          Voice Record
          {isGuest && <span className="absolute -top-1 -right-1 bg-amber-500 text-[8px] text-white px-1.5 py-0.5 rounded-full font-bold">PRO</span>}
        </button>
      </div>

      <div className="w-full min-h-[250px] relative">
        {mode === 'upload' ? (
          <div 
            className={`w-full group p-10 border-2 border-dashed rounded-[2rem] text-center transition-all duration-300 cursor-pointer ${isDragging ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/10' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/10 hover:border-sky-400'}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault(); setIsDragging(false);
              if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
            }}
          >
            <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} accept="audio/*" className="hidden" />
            <UploadCloudIcon className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 transition-colors" />
            <p className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-200">Drop or Select Audio</p>
            <p className="text-xs text-slate-400 mt-1">MP3, WAV up to 10MB</p>
          </div>
        ) : (
          <div className="w-full bg-slate-50 dark:bg-slate-800/10 border-2 border-slate-200 dark:border-slate-700 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center">
            {isGuest ? (
              <div className="animate-fade-in">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ZapIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Sign In to Record Live</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">Direct audio capture is a Pro feature. Sign in to analyze your voice in real-time.</p>
                <button 
                  onClick={onExitGuest}
                  className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-xl transition-all shadow-lg"
                >
                  Create Free Account
                </button>
              </div>
            ) : isRecording ? (
              <div className="flex flex-col items-center w-full">
                <div className="text-4xl font-bold text-slate-800 dark:text-white mb-4">{formatDuration(recordDuration)}</div>
                <canvas ref={canvasRef} className="w-full h-12 mb-6 opacity-60" width={400} height={100} />
                <button onClick={stopRecording} className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all">
                  <SquareIcon className="w-6 h-6 fill-current" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <button onClick={startRecording} className="w-16 h-16 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all mb-4">
                  <Mic2Icon className="w-8 h-8" />
                </button>
                <p className="text-lg font-bold text-slate-700 dark:text-slate-200">Start Recording</p>
              </div>
            )}
          </div>
        )}
      </div>

      {file && (
        <div className="mt-6 w-full animate-fade-in-short bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AudioWaveformIcon className="h-5 w-5 text-sky-500" />
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{file.name}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold">{metadata?.duration} • {metadata?.size}</p>
            </div>
          </div>
          <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      <button
        onClick={() => file && onAnalyze(file)}
        disabled={!file || isLoading || isRecording}
        className={`w-full h-14 mt-8 rounded-xl font-black text-white uppercase tracking-widest transition-all ${!file || isRecording ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600 shadow-lg'}`}
      >
        {isLoading ? <Spinner className="h-6 w-6 mx-auto" /> : 'Analyze Voice'}
      </button>
    </div>
  );
};