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

interface VoiceOption {
  id: string;
  name: string;
  gender: "male" | "female";
  accent?: string;
}

const voiceOptions: VoiceOption[] = [
  {
    id: "Ruth",
    name: "Ruth",
    gender: "female",
    accent: "American",
  },
  {
    id: "Patrick",
    name: "Patrick",
    gender: "male",
    accent: "American",
  },
  {
    id: "Danielle",
    name: "Danielle",
    gender: "female",
    accent: "American",
  },
  {
    id: "Gregory",
    name: "Gregory",
    gender: "male",
    accent: "American",
  },
];

interface SpeechButtonProps {
  textContent: string;
}

export function SpeechButton({ textContent }: SpeechButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(
    voiceOptions[0]
  );
  const [showTooltip, setShowTooltip] = useState(false);
  const isCancelledRef = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // State for our custom feature tooltip
  const [showIntroTooltip, setShowIntroTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleVoiceSelect = (voice: VoiceOption) => {
    setSelectedVoice(voice);
    setShowTooltip(false);
  };

  useEffect(() => {
    if (!isSpeaking) return;
    const interval = setInterval(() => {}, 300); // keeps wave state consistent if needed
    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Check localStorage on mount - only once
  useEffect(() => {
    // Check if we've shown the tooltip before
    const hasSeenTooltip = localStorage.getItem("hasSeenVoiceoverTooltip");

    if (!hasSeenTooltip) {
      // Wait a moment before showing the tooltip
      const showTimer = setTimeout(() => {
        setShowIntroTooltip(true);

        // Auto-hide after 5 seconds
        const hideTimer = setTimeout(() => {
          setShowIntroTooltip(false);
          localStorage.setItem("hasSeenVoiceoverTooltip", "true");
        }, 5000);

        return () => clearTimeout(hideTimer);
      }, 500);

      return () => clearTimeout(showTimer);
    }
  }, []);

  const handleSpeech = async () => {
    if (isSpeaking) {
      isCancelledRef.current = true;
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current = null;
      }
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

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
        if (isCancelledRef.current) break;

        const blob = new Blob([new Uint8Array(part)], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        currentAudioRef.current = audio;

        await new Promise<void>((resolve) => {
          audio.addEventListener("ended", () => {
            URL.revokeObjectURL(url);
            resolve();
          });
          audio.addEventListener("error", () => {
            URL.revokeObjectURL(url);
            resolve();
          });
          audio.play().catch((err) => {
            console.error("Audio play error:", err);
            resolve();
          });
        });

        currentAudioRef.current = null;
      }
    } catch (err) {
      console.error("Speech error:", err);
      const utterance = new SpeechSynthesisUtterance(textContent);
      window.speechSynthesis.speak(utterance);
    } finally {
      setIsSpeaking(false);
      setIsLoading(false);
      isCancelledRef.current = false;
      currentAudioRef.current = null;
    }
  };

  return (
    <div className="flex items-center space-x-2 relative">
      {/* Voice Selector */}
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

      {/* Play/Stop Button */}
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

      {/* Custom tooltip that doesn't rely on the Tooltip component */}
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
            <p className="">
              <span className="font-bold">NEW!</span> AI can now read summaries
              aloud. Choose a voice and click to listen.
            </p>
            {/* Arrow pointing down */}
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
