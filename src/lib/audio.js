// The wedding recordings from `public/audio`, played through a single <audio>
// element. The player is built inside the "Open Invitation" click, so the
// first `play()` always lands in a user gesture and no autoplay policy bites.
export function createPlaylistPlayer({ tracks, volume = 0.55 }) {
  const src = tracks[Math.floor(Math.random() * tracks.length)];
  const audio = new Audio(src);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = volume;

  // Some browsers ignore `loop` for mp4-muxed audio and fire `ended` instead,
  // which leaves the invitation silent. Manually restart in that case.
  let wantsPlayback = false;
  audio.addEventListener("ended", () => {
    if (!wantsPlayback) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });

  return {
    async play() {
      try {
        await audio.play();
        wantsPlayback = true;
        return true;
      } catch {
        return false;
      }
    },
    pause() {
      wantsPlayback = false;
      audio.pause();
    },
    dispose() {
      wantsPlayback = false;
      audio.pause();
    },
  };
}
