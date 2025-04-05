// SpeechButton.tsx
import { Volume2, VolumeX, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SERVER } from "@/constants";
import { supabase } from "@/supabaseconsant";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAudioContext } from "@/contexts/AudioContext";

interface VoiceOption {
  id: string;
  name: string;
  gender: "male" | "female";
  accent?: string;
}

const voiceOptions: VoiceOption[] = [
  { id: "Ruth", name: "Ruth", gender: "female", accent: "American" },
  { id: "Patrick", name: "Patrick", gender: "male", accent: "American" },
  { id: "Danielle", name: "Danielle", gender: "female", accent: "American" },
  { id: "Gregory", name: "Gregory", gender: "male", accent: "American" },
];

interface SpeechButtonProps {
  textContent: string;
}

export function SpeechButton({ textContent }: SpeechButtonProps) {
  const globalAudioContext = useAudioContext();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(
    voiceOptions[0]
  );
  const [showTooltip, setShowTooltip] = useState(false);
  const isCancelledRef = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  // Ref to track the AudioContext source so it can be stopped later
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioUrlsRef = useRef<string[]>([]);
  const [showIntroTooltip, setShowIntroTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleVoiceSelect = (voice: VoiceOption) => {
    setSelectedVoice(voice);
    setShowTooltip(false);
  };

  // Function to stop all audio and cleanup resources
  const stopAndCleanupAudio = () => {
    console.log("Stopping all audio...");
    isCancelledRef.current = true;

    // Stop the AudioContext source if it exists
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {
        console.error("Error stopping AudioContext source:", e);
      }
      audioSourceRef.current = null;
    }

    // Pause and reset any playing Audio element
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = "";
        currentAudioRef.current.load();
        currentAudioRef.current = null;
      } catch (e) {
        console.error("Error stopping audio:", e);
      }
    }

    // Cancel speech synthesis
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {
      console.error("Error cancelling speech synthesis:", e);
    }

    // Stop other audio elements on the page
    try {
      document.querySelectorAll("audio").forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    } catch (e) {
      console.error("Error stopping page audio elements:", e);
    }

    // Revoke created audio URLs
    audioUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error("Error revoking URL:", e);
      }
    });
    audioUrlsRef.current = [];

    setIsSpeaking(false);
    setIsLoading(false);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      isCancelledRef.current = true;
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch (e) {
          console.error("Error stopping AudioContext source:", e);
        }
        audioSourceRef.current = null;
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      audioUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error("Error revoking URL:", e);
        }
      });
      audioUrlsRef.current = [];
    };
  }, []);

  // (Optional) Route change and custom navigation event handlers…
  // (They can remain the same as in your previous version.)

  // Show tooltip if not seen before
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem("hasSeenVoiceoverTooltip");
    if (!hasSeenTooltip) {
      const showTimer = setTimeout(() => {
        setShowIntroTooltip(true);
        const hideTimer = setTimeout(() => {
          setShowIntroTooltip(false);
          localStorage.setItem("hasSeenVoiceoverTooltip", "true");
        }, 5000);
        return () => clearTimeout(hideTimer);
      }, 500);
      return () => clearTimeout(showTimer);
    }
  }, []);

  // Helper function to play audio using the standard Audio element
  const playWithAudioElement = async (url: string): Promise<void> => {
    if (isCancelledRef.current) {
      return Promise.resolve();
    }

    const audio = new Audio(url);
    currentAudioRef.current = audio;
    audio.setAttribute("playsinline", "true");
    audio.preload = "auto";

    return new Promise<void>((resolve) => {
      const handleEnded = () => {
        cleanup();
        resolve();
      };

      const handleError = (error: Event) => {
        console.error("Audio playback error:", error);
        cleanup();
        resolve();
      };

      const cleanup = () => {
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("error", handleError);
        audio.removeEventListener("canplaythrough", canPlayHandler);
        clearInterval(cancellationCheck);
      };

      const cancellationCheck = setInterval(() => {
        if (isCancelledRef.current) {
          console.log("Cancellation detected during audio play");
          audio.pause();
          audio.src = "";
          cleanup();
          resolve();
        }
      }, 100);

      const canPlayHandler = () => {
        if (isCancelledRef.current) {
          cleanup();
          resolve();
          return;
        }
        audio.play().catch((err) => {
          console.error("Audio play error:", err);
          cleanup();
          resolve();
        });
      };

      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("error", handleError);

      if (audio.readyState >= 3) {
        canPlayHandler();
      } else {
        audio.addEventListener("canplaythrough", canPlayHandler);
      }

      setTimeout(() => {
        if (currentAudioRef.current === audio) {
          cleanup();
          resolve();
        }
      }, 30000);
    });
  };

  // Main speech playback handler using the global audio context
  const handleSpeech = async () => {
    if (isSpeaking || isLoading) {
      console.log("Stop button clicked");
      stopAndCleanupAudio();
      return;
    }

    // Use the global audio context (if available) and resume if needed
    const context = globalAudioContext;
    if (context && context.state === "suspended") {
      await context.resume();
    }

    console.log("Starting speech playback");
    setIsSpeaking(true);
    setIsLoading(true);
    isCancelledRef.current = false;

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw new Error("Auth error");

      const token = session?.access_token || "";
      const response = await fetch(`${SERVER}/text_to_speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: textContent, voice: selectedVoice.id }),
      });
      if (!response.ok) throw new Error("Failed to generate speech");

      const { audioParts } = await response.json();
      if (!audioParts || audioParts.length === 0)
        throw new Error("No audio returned");

      setIsLoading(false);

      for (const part of audioParts) {
        if (isCancelledRef.current) {
          console.log("Cancelled during audio processing");
          break;
        }

        const blob = new Blob([new Uint8Array(part)], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        audioUrlsRef.current.push(url);

        if (context) {
          try {
            if (isCancelledRef.current) break;
            const audioBuffer = await fetch(url).then((r) => r.arrayBuffer());
            if (isCancelledRef.current) break;
            const decodedData = await context.decodeAudioData(audioBuffer);
            if (isCancelledRef.current) break;

            const source = context.createBufferSource();
            source.buffer = decodedData;
            source.connect(context.destination);
            audioSourceRef.current = source;

            await new Promise<void>((resolve) => {
              const checkCancellation = setInterval(() => {
                if (isCancelledRef.current) {
                  clearInterval(checkCancellation);
                  try {
                    source.stop();
                  } catch (e) {
                    console.error("Error stopping source:", e);
                  }
                  resolve();
                }
              }, 100);

              source.onended = () => {
                clearInterval(checkCancellation);
                resolve();
              };

              source.start(0);

              const timeout = setTimeout(() => {
                clearInterval(checkCancellation);
                if (!isCancelledRef.current) {
                  resolve();
                }
              }, decodedData.duration * 1000 + 500);

              const originalStop = source.stop.bind(source);
              source.stop = () => {
                clearInterval(checkCancellation);
                clearTimeout(timeout);
                originalStop();
                resolve();
              };
            });
            audioSourceRef.current = null;
          } catch (e) {
            console.error("Error playing with AudioContext:", e);
            await playWithAudioElement(url);
          }
        } else {
          await playWithAudioElement(url);
        }

        if (isCancelledRef.current) {
          console.log("Cancelled after audio segment");
          break;
        }
      }
    } catch (err) {
      console.error("Speech error:", err);
      if (!isCancelledRef.current && window.speechSynthesis) {
        try {
          const utterance = new SpeechSynthesisUtterance(textContent);
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            const matchingVoice = voices.find(
              (v) =>
                v.name
                  .toLowerCase()
                  .includes(selectedVoice.name.toLowerCase()) ||
                (selectedVoice.gender === "female" &&
                  v.name.toLowerCase().includes("female"))
            );
            if (matchingVoice) {
              utterance.voice = matchingVoice;
            }
          }
          utterance.onend = () => {
            setIsSpeaking(false);
          };
          utterance.onerror = (e) => {
            console.error("Speech synthesis error:", e);
            setIsSpeaking(false);
          };
          window.speechSynthesis.speak(utterance);
        } catch (synthErr) {
          console.error("Speech synthesis fallback error:", synthErr);
          setIsSpeaking(false);
        }
      } else {
        setIsSpeaking(false);
      }
    } finally {
      if (!isCancelledRef.current) {
        setIsLoading(false);
      }
      isCancelledRef.current = false;

      if (!window.speechSynthesis?.speaking) {
        currentAudioRef.current = null;
      }

      audioUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error("Error revoking URL:", e);
        }
      });
      audioUrlsRef.current = [];
      stopAndCleanupAudio();
    }
  };

  return (
    <div className="flex items-center space-x-2 relative">
      <Popover open={showTooltip} onOpenChange={setShowTooltip}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`p-1.5 h-auto rounded-full ${
              isSpeaking
                ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <User className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-2 border dark:border-slate-700 bg-white dark:bg-gray-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 px-2 pb-2">
            Select a voice
          </p>
          {voiceOptions.map((voice) => (
            <div
              key={voice.id}
              className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors ${
                selectedVoice.id === voice.id
                  ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              onClick={() => handleVoiceSelect(voice)}
            >
              <span>{voice.name}</span>
              <Badge
                variant="outline"
                className={`ml-2 text-xs font-normal px-1.5 ${
                  voice.gender === "male"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
                    : "bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 border-pink-200 dark:border-pink-800/30"
                }`}
              >
                {voice.gender}
              </Badge>
            </div>
          ))}
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="sm"
        className={`p-1.5 h-auto rounded-full transition-transform ${
          isSpeaking
            ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
        onClick={handleSpeech}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-pulse bg-current rounded-full opacity-75" />
        ) : isSpeaking ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>

      <AnimatePresence>
        {showIntroTooltip && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -5 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 right-0 bg-black text-white py-2 px-3 rounded-md text-xs max-w-[220px] shadow-lg z-50"
            style={{ minWidth: "200px" }}
          >
            <p>
              <span className="font-bold">NEW!</span> AI can now read summaries
              aloud. Choose a voice and click to listen.
            </p>
            <div
              className="absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black"
              style={{ bottom: "-6px", right: "10px" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
