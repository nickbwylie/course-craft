// AudioContextProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AudioContextContext = createContext<AudioContext | null>(null);

export const AudioContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const context = new AudioContextClass();
      setAudioContext(context);

      // Clean up the context when the app unmounts
      return () => {
        context.close();
      };
    }
  }, []);

  return (
    <AudioContextContext.Provider value={audioContext}>
      {children}
    </AudioContextContext.Provider>
  );
};

export const useAudioContext = () => {
  return useContext(AudioContextContext);
};
