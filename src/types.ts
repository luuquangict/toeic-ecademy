export interface CorePoint {
  title: string;
  code: string;
  desc: string;
}

export interface CardGrid {
  title: string;
  items: string[];
}

export interface Tip {
  tag: string;
  text: string;
}

export interface LinkItem {
  name: string;
  url: string;
  isQuizlet?: boolean;
}

export interface Homework {
  deadline: string;
  tasks: string[];
  links: LinkItem[];
}

export interface Lesson {
  id: string;
  sessionNum: number | string;
  type: 'listening' | 'reading' | 'all';
  badge: string;
  title: string;
  desc: string;
  core: CorePoint[];
  grids?: CardGrid[];
  tips?: Tip[];
  homework: Homework;
}

export interface Flashcard {
  q: string;
  a: string;
}

export interface QuizletItem {
  session: string;
  type: 'listening' | 'reading' | 'global';
  title: string;
  topic: string;
  url: string;
}
