declare module 'radio-browser' {
  interface RadioBrowserOptions {
    name?: string;
    country?: string;
    language?: string;
    tag?: string;
    limit?: number;
    offset?: number;
    order?: string;
    reverse?: boolean;
  }

  interface RadioBrowser {
    searchStations(options: RadioBrowserOptions): Promise<any[]>;
    getCountries(): Promise<Array<{ name: string }>>;
    getLanguages(): Promise<Array<{ name: string }>>;
    getTags(): Promise<Array<{ name: string }>>;
  }

  const RadioBrowser: RadioBrowser;
  export default RadioBrowser;
} 