import { create } from 'zustand';
import type { RadioStation } from '../types/radio';
import { supabase } from '../lib/supabase';

interface RadioState {
  currentStation: RadioStation | null;
  isPlaying: boolean;
  volume: number;
  favoriteStations: RadioStation[];
  recentStations: RadioStation[];
  recentCountries: string[];
  setCurrentStation: (station: RadioStation | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  addToFavorites: (station: RadioStation) => Promise<void>;
  removeFromFavorites: (stationId: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  addToRecent: (station: RadioStation) => Promise<void>;
  loadRecent: () => Promise<void>;
  addRecentCountry: (country: string) => void;
}

const useRadioStore = create<RadioState>((set, get) => ({
  currentStation: null,
  isPlaying: false,
  volume: 1,
  favoriteStations: [],
  recentStations: [],
  recentCountries: [],

  setCurrentStation: (station) => {
    set({ currentStation: station });
    if (station) {
      get().addToRecent(station);
    }
  },

  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),

  addToFavorites: async (station) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('favorites').insert({
      user_id: user.id,
      station_id: station.stationuuid,
      station_name: station.name,
      station_url: station.url,
      station_favicon: station.favicon,
      station_country: station.country,
    });

    set((state) => ({
      favoriteStations: [...state.favoriteStations, station],
    }));
  },

  removeFromFavorites: async (stationId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('station_id', stationId);

    set((state) => ({
      favoriteStations: state.favoriteStations.filter(
        (s) => s.stationuuid !== stationId
      ),
    }));
  },

  loadFavorites: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ favoriteStations: [] });
      return;
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading favorites:', error);
      return;
    }

    const stations: RadioStation[] = data.map((fav) => ({
      stationuuid: fav.station_id,
      name: fav.station_name,
      url: fav.station_url,
      favicon: fav.station_favicon,
      country: fav.station_country,
    }));

    set({ favoriteStations: stations });
  },

  addToRecent: async (station) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('recent_stations').insert({
      user_id: user.id,
      station_id: station.stationuuid,
      station_name: station.name,
      station_url: station.url,
      station_favicon: station.favicon,
      station_country: station.country,
    });

    set((state) => {
      // Remove existing instance of the station if it exists
      const filteredRecent = state.recentStations.filter(
        (s) => s.stationuuid !== station.stationuuid
      );
      // Add the new station to the front and limit to 10
      return { recentStations: [station, ...filteredRecent.slice(0, 9)] };
    });
  },

  loadRecent: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ recentStations: [] });
      return;
    }

    const { data, error } = await supabase
      .from('recent_stations')
      .select('*')
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading recent stations:', error);
      return;
    }

    // Filter out duplicate stations, keeping the most recent one
    const uniqueStationsMap = new Map<string, RadioStation>();
    data.forEach(recent => {
      const station: RadioStation = {
        stationuuid: recent.station_id,
        name: recent.station_name,
        url: recent.station_url,
        favicon: recent.station_favicon,
        country: recent.station_country,
      };
      // Add or replace the station in the map (most recent entries will overwrite older ones due to order by played_at DESC)
      uniqueStationsMap.set(station.stationuuid, station);
    });

    const stations = Array.from(uniqueStationsMap.values());

    set({ recentStations: stations });
  },

  addRecentCountry: (country) => {
    set(state => {
      const filteredCountries = state.recentCountries.filter(c => c !== country);
      return { recentCountries: [country, ...filteredCountries.slice(0, 9)] };
    });
  }
}));

export default useRadioStore; 