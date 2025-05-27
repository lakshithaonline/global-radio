-- Create favorites table
CREATE TABLE favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    station_id TEXT NOT NULL,
    station_name TEXT NOT NULL,
    station_url TEXT NOT NULL,
    station_favicon TEXT,
    station_country TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, station_id)
);

-- Create recent_stations table
CREATE TABLE recent_stations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    station_id TEXT NOT NULL,
    station_name TEXT NOT NULL,
    station_url TEXT NOT NULL,
    station_favicon TEXT,
    station_country TEXT,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_preferences table
CREATE TABLE user_preferences (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    volume FLOAT DEFAULT 1.0,
    theme TEXT DEFAULT 'dark',
    autoplay BOOLEAN DEFAULT false,
    notifications BOOLEAN DEFAULT true,
    last_station_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
    ON favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
    ON favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
    ON favorites FOR DELETE
    USING (auth.uid() = user_id);

-- Recent stations policies
CREATE POLICY "Users can view their own recent stations"
    ON recent_stations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recent stations"
    ON recent_stations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view their own preferences"
    ON user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
    ON user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON user_preferences FOR UPDATE
    USING (auth.uid() = user_id); 