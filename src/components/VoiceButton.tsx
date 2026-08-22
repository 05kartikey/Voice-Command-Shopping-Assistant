import { useTranslation } from 'react-i18next';
import { Mic, MicOff } from 'lucide-react';

interface Props {
  listening: boolean;
  supported: boolean;
  transcript: string;
  onToggle: () => void;
}

export default function VoiceButton({ listening, supported, transcript, onToggle }: Props) {
  const { t } = useTranslation();

  return (
    <div className="voice-hero">
      <div className="voice-btn-wrap">
        {listening && (
          <>
            <div className="ring ring-1" />
            <div className="ring ring-2" />
            <div className="ring ring-3" />
          </>
        )}
        <button
          className={`voice-btn ${listening ? 'listening' : ''} ${!supported ? 'disabled' : ''}`}
          onClick={onToggle}
          disabled={!supported}
          aria-label={listening ? t('listening') : t('tapToSpeak')}
        >
          <div className="voice-btn-inner">
            {listening ? <MicOff size={30} /> : <Mic size={30} />}
          </div>
        </button>
      </div>

      {listening && (
        <div className="waveform">
          {[18, 28, 22, 32, 26, 20, 16].map((h, i) => (
            <div key={i} className="wave-bar" style={{ height: `${h}px` }} />
          ))}
        </div>
      )}

      <span className={`voice-label ${listening ? 'active' : ''}`}>
        {!supported
          ? t('voiceNotSupported')
          : listening
          ? t('listening')
          : t('tapToSpeak')}
      </span>

      {listening && transcript && (
        <div className="transcript-box">
          <div className="transcript-dot" />
          <span>{transcript}</span>
        </div>
      )}
    </div>
  );
}
