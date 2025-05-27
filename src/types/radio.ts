export interface RadioStation {
  stationuuid: string;
  name: string;
  url: string;
  favicon?: string;
  country?: string;
  tags?: string[];
  language?: string;
  votes?: number;
  codec?: string;
  bitrate?: number;
}

export interface RadioFilter {
  name?: string;
  country?: string;
  language?: string;
  tag?: string;
  limit?: number;
  offset?: number;
  order?: string;
  reverse?: boolean;
}

export interface RadioState {
  currentStation: RadioStation | null;
  isPlaying: boolean;
  volume: number;
  favoriteStations: RadioStation[];
  recentStations: RadioStation[];
  setCurrentStation: (station: RadioStation | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  addToFavorites: (station: RadioStation) => void;
  removeFromFavorites: (stationId: string) => void;
  addToRecent: (station: RadioStation) => void;
} 