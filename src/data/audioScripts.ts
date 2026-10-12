import { audioScriptsData } from './audioScriptsData';

export interface ScriptSentence {
  id: number;
  label: string;
  text: string;
  start: number;
  end: number;
}

export interface AudioScript {
  key: string;
  unit: number | null;
  track: number | null;
  fileName: string;
  part: number;
  partTitle: string;
  topic: string;
  duration: number;
  sentences: ScriptSentence[];
}

export const audioScripts: AudioScript[] = audioScriptsData;

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
