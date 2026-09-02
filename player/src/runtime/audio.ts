const audioModules = import.meta.glob<string>(
  "../../episodes/*/media/audio/**/*.mp3",
  { eager: true, query: "?url", import: "default" },
);

const AUDIO_URLS: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(
    Object.entries(audioModules).flatMap(([source, url]) => {
      const match = source.match(/\/episodes\/([^/]+)\/media\/audio\/(.+\.mp3)$/);
      return match ? [[`${match[1]}/${match[2]}`, url]] : [];
    }),
  ),
);

export function resolveEpisodeAudioUrl(
  episodeId: string,
  chapterId: string,
  step: number,
): string | null {
  return AUDIO_URLS[`${episodeId}/${chapterId}/${step}.mp3`] ?? null;
}
