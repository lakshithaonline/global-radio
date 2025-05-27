import { supabase } from '../lib/supabase';

export interface UserPreferences {
  volume: number;
  theme: string;
  autoplay: boolean;
  notifications: boolean;
  last_station_id?: string;
}

export const preferencesService = {
  async getUserPreferences(userId: string) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw error;
    }

    return data || { 
      volume: 1.0, 
      theme: 'dark', 
      autoplay: false,
      notifications: true 
    };
  },

  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}; 