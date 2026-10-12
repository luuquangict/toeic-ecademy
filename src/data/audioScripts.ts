import audioScriptsData from './audioScripts.json';

export interface ScriptSentence {
  id: number;
  label: string;
  text: string;
  start: number;
  end: number;
}

export interface AudioScript {
  key: string;
  unit: number;
  track: number;
  fileName: string;
  part: number;
  partTitle: string;
  topic: string;
  duration: number;
  sentences: ScriptSentence[];
}

export const audioScripts: AudioScript[] = audioScriptsData as AudioScript[];

export const getAudioScriptByKey = (key: string): AudioScript | undefined => {
  return audioScripts.find((item) => item.key === key);
};

export const getAudioScriptByUnitAndTrack = (
  unit: number,
  track: number
): AudioScript | undefined => {
  return audioScripts.find(
    (item) => item.unit === unit && item.track === track
  );
};
