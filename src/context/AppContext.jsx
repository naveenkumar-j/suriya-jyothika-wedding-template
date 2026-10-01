import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPlaylistPlayer } from "../lib/audio.js";
import { wedding } from "../data/weddingData.js";

const AppContext = createContext(null);
const STORAGE_KEY = "ap-audio";

export function AppProvider({ children }) {
  const [entered, setEntered] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  const ensurePlayer = useCallback(() => {
    if (!playerRef.current) {
      playerRef.current = createPlaylistPlayer({
        tracks: wedding.audio.tracks,
        volume: wedding.audio.volume,
      });
    }
    return playerRef.current;
  }, []);

  useEffect(() => {
    return () => playerRef.current?.dispose();
  }, []);

  // Must run inside the click so the browser treats it as a user gesture.
  // The overlay outlives this call: it stays mounted to play the gate opening.
  const begin = useCallback(async () => {
    setEntered(true);
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "off") return;
    const ok = await ensurePlayer().play();
    setPlaying(Boolean(ok));
  }, [ensurePlayer]);

  const finishIntro = useCallback(() => setIntroDone(true), []);

  const toggleMusic = useCallback(async () => {
    const player = ensurePlayer();
    if (playing) {
      player.pause();
      setPlaying(false);
      sessionStorage.setItem(STORAGE_KEY, "off");
    } else {
      const ok = await player.play();
      setPlaying(Boolean(ok));
      sessionStorage.setItem(STORAGE_KEY, ok ? "on" : "off");
    }
  }, [ensurePlayer, playing]);

  return (
    <AppContext.Provider value={{ entered, introDone, begin, finishIntro, playing, toggleMusic }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
