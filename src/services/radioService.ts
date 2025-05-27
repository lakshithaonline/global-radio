import RadioBrowser from 'radio-browser';
import type { RadioStation, RadioFilter } from '../types/radio';
import { supabase } from '../lib/supabase';

class RadioService {
  private api: typeof RadioBrowser;
  private baseUrl = 'https://de1.api.radio-browser.info/json';

  constructor() {
    this.api = RadioBrowser;
  }

  private async fetchApi<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const url = `${this.baseUrl}${endpoint}?${searchParams.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
  }

  async searchStations(filters: RadioFilter): Promise<RadioStation[]> {
    try {
      const stations = await this.fetchApi<RadioStation[]>('/stations/search', {
        ...filters,
        limit: filters.limit || 20,
        offset: filters.offset || 0,
        order: 'votes',
        reverse: true,
      });
      return stations;
    } catch (error) {
      console.error('Error searching stations:', error);
      return [];
    }
  }

  async getCountries(): Promise<string[]> {
    try {
      const countries = await this.fetchApi<Array<{ name: string }>>('/countries');
      return countries.map(country => country.name);
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  }

  async getLanguages(): Promise<string[]> {
    try {
      const languages = await this.fetchApi<Array<{ name: string }>>('/languages');
      return languages.map(lang => lang.name);
    } catch (error) {
      console.error('Error fetching languages:', error);
      return [];
    }
  }

  async getTags(): Promise<string[]> {
    try {
      const tags = await this.fetchApi<Array<{ name: string }>>('/tags');
      return tags.map(tag => tag.name);
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }
}

export const radioService = new RadioService();

export const favoritesService = {
  async getFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addFavorite(userId: string, station: RadioStation) {
    const { error } = await supabase.from('favorites').insert({
      user_id: userId,
      station_id: station.stationuuid,
      station_name: station.name,
      station_url: station.url,
      station_favicon: station.favicon,
      station_country: station.country,
    });

    if (error) throw error;
  },

  async removeFavorite(userId: string, stationId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('station_id', stationId);

    if (error) throw error;
  },
};

export const recentStationsService = {
  async getRecentStations(userId: string) {
    const { data, error } = await supabase
      .from('recent_stations')
      .select('*')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data;
  },

  async addRecentStation(userId: string, station: RadioStation) {
    const { error } = await supabase.from('recent_stations').insert({
      user_id: userId,
      station_id: station.stationuuid,
      station_name: station.name,
      station_url: station.url,
      station_favicon: station.favicon,
      station_country: station.country,
    });

    if (error) throw error;
  },
}; 