// The wedding recordings from `public/audio`, played through a single <audio>
// element. The player is built inside the "Open Invitation" click, so the
// first `play()` always lands in a user gesture and no autoplay policy bites.
export function createPlaylistPlayer({ tracks, volume = 0.55 }) {
  const audio = new Audio(tracks[Math.floor(Math.random() * tracks.length)]);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = volume;

  return {
    async play() {
      try {
        await audio.play();
        return true;
      } catch {
        return false;
      }
    },
    pause() {
      audio.pause();
    },
    dispose() {
      audio.pause();
    },
  };
}
