'use client';

import * as React from 'react';
import Image from 'next/image';
import { Search, Film } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { cn } from '@/lib/utils';

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

interface CountryData {
  flatrate?: Provider[];
  buy?: Provider[];
  rent?: Provider[];
  ads?: Provider[];
  [key: string]: Provider[] | undefined;
}

interface MovieWatchProvidersProps {
  watchProviders: Record<string, CountryData>;
}

const countryNames: Record<string, string> = {
  TR: 'Turkey',
  US: 'United States',
  GB: 'United Kingdom',
  DE: 'Germany',
  FR: 'France',
  ES: 'Spain',
  IT: 'Italy',
  NL: 'Netherlands',
  BE: 'Belgium',
  AT: 'Austria',
  CH: 'Switzerland',
  PL: 'Poland',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  CA: 'Canada',
  AU: 'Australia',
  NZ: 'New Zealand',
  JP: 'Japan',
  KR: 'South Korea',
  IN: 'India',
  BR: 'Brazil',
  MX: 'Mexico',
  AR: 'Argentina',
  CL: 'Chile',
  CO: 'Colombia',
  PE: 'Peru',
  ZA: 'South Africa',
  EG: 'Egypt',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
  IL: 'Israel',
};

const providerTypeLabels: Record<string, string> = {
  flatrate: 'Streaming',
  buy: 'Buy',
  rent: 'Rent',
  ads: 'Free with Ads',
};

function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function MovieWatchProviders({
  watchProviders,
}: MovieWatchProvidersProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCountry, setSelectedCountry] = React.useState<string>('all');
  const [selectedProvider, setSelectedProvider] = React.useState<string>('all');

  // Get all unique providers
  const allProviders = React.useMemo(() => {
    const providersMap = new Map<number, Provider & { countries: string[] }>();

    Object.entries(watchProviders).forEach(([countryCode, country]) => {
      if (!country) return;

      // Safely collect all providers from all types
      const allProvidersInCountry: Provider[] = [];
      if (country.flatrate) allProvidersInCountry.push(...country.flatrate);
      if (country.buy) allProvidersInCountry.push(...country.buy);
      if (country.rent) allProvidersInCountry.push(...country.rent);
      if (country.ads) allProvidersInCountry.push(...country.ads);

      allProvidersInCountry.forEach((provider) => {
        // Validate provider has required fields
        if (!provider || !provider.provider_id || !provider.provider_name) {
          return;
        }

        if (!providersMap.has(provider.provider_id)) {
          providersMap.set(provider.provider_id, {
            ...provider,
            countries: [],
          });
        }
        const existing = providersMap.get(provider.provider_id)!;
        if (!existing.countries.includes(countryCode)) {
          existing.countries.push(countryCode);
        }
      });
    });

    return Array.from(providersMap.values()).sort((a, b) =>
      a.provider_name.localeCompare(b.provider_name)
    );
  }, [watchProviders]);

  // Filter providers by search and selection
  const filteredProviders = React.useMemo(() => {
    return allProviders.filter((provider) => {
      const matchesSearch =
        !searchQuery ||
        provider.provider_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesProvider =
        selectedProvider === 'all' ||
        provider.provider_id.toString() === selectedProvider;
      return matchesSearch && matchesProvider;
    });
  }, [allProviders, searchQuery, selectedProvider]);

  // Filter countries by search
  const filteredCountries = React.useMemo(() => {
    const countries = Object.keys(watchProviders).sort();
    return countries.filter((countryCode) => {
      const matchesSearch =
        !searchQuery ||
        (countryNames[countryCode] || countryCode)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesCountry =
        selectedCountry === 'all' || countryCode === selectedCountry;
      return matchesSearch && matchesCountry;
    });
  }, [watchProviders, searchQuery, selectedCountry]);

  // Get countries for a specific provider
  const getProviderCountries = (providerId: number) => {
    const countries: string[] = [];
    Object.entries(watchProviders).forEach(([countryCode, country]) => {
      if (!country) return;

      const allProvidersInCountry = [
        ...(country.flatrate || []),
        ...(country.buy || []),
        ...(country.rent || []),
        ...(country.ads || []),
      ].filter((p) => p && p.provider_id);

      if (allProvidersInCountry.some((p) => p.provider_id === providerId)) {
        countries.push(countryCode);
      }
    });
    return countries.sort();
  };

  return (
    <div className="px-8 md:px-16 lg:px-24 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Where to Watch
        </h2>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search countries or providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800/50 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
          />
        </div>
      </div>

      <Tabs defaultValue="country" className="w-full">
        <TabsList className="bg-zinc-900/50 border border-zinc-800/50 mb-6">
          <TabsTrigger
            value="country"
            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400"
          >
            By Country
          </TabsTrigger>
          <TabsTrigger
            value="provider"
            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400"
          >
            By Streaming Service
          </TabsTrigger>
        </TabsList>

        {/* By Country Tab */}
        <TabsContent value="country" className="mt-6">
          <div className="mb-4">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-[200px] bg-zinc-900/50 border-zinc-800/50 text-white [&>span]:text-white">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem
                  value="all"
                  className="text-white hover:text-white focus:text-white focus:bg-zinc-800 hover:bg-zinc-800"
                >
                  All Countries
                </SelectItem>
                {Object.keys(watchProviders)
                  .sort()
                  .map((countryCode) => (
                    <SelectItem
                      key={countryCode}
                      value={countryCode}
                      className="text-white hover:text-white focus:text-white focus:bg-zinc-800 hover:bg-zinc-800"
                    >
                      {countryNames[countryCode] || countryCode}{' '}
                      {getCountryFlag(countryCode)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {filteredCountries.length === 0 ? (
            <div className="text-center py-12">
              <Film className="size-16 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 text-lg">No results found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCountries.map((countryCode) => {
                const country = watchProviders[countryCode];
                const countryName = countryNames[countryCode] || countryCode;

                return (
                  <div
                    key={countryCode}
                    className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm"
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="text-2xl">
                        {getCountryFlag(countryCode)}
                      </span>
                      {countryName}
                    </h3>

                    <div className="space-y-6">
                      {Object.entries(providerTypeLabels).map(
                        ([type, label]) => {
                          const providers = country[type];
                          if (!providers || providers.length === 0) return null;

                          return (
                            <div key={type}>
                              <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                                {label}
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                {providers.map((provider: Provider) => (
                                  <div
                                    key={provider.provider_id}
                                    className="flex items-center gap-2 bg-zinc-800/50 rounded-lg p-3 hover:bg-zinc-800 transition-colors"
                                  >
                                    {provider.logo_path ? (
                                      <Image
                                        src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                                        alt={provider.provider_name}
                                        width={32}
                                        height={32}
                                        className="rounded"
                                      />
                                    ) : (
                                      <div className="size-8 bg-zinc-700 rounded flex items-center justify-center">
                                        <Film className="size-4 text-zinc-500" />
                                      </div>
                                    )}
                                    <span className="text-white text-sm font-medium">
                                      {provider.provider_name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* By Streaming Service Tab */}
        <TabsContent value="provider" className="mt-6">
          <div className="mb-4">
            <Select
              value={selectedProvider}
              onValueChange={setSelectedProvider}
            >
              <SelectTrigger className="w-[200px] bg-zinc-900/50 border-zinc-800/50 text-white [&>span]:text-white">
                <SelectValue placeholder="Filter by provider" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem
                  value="all"
                  className="text-white hover:text-white focus:text-white focus:bg-zinc-800 hover:bg-zinc-800"
                >
                  All Providers
                </SelectItem>
                {allProviders
                  .filter(
                    (provider) =>
                      provider && provider.provider_id && provider.provider_name
                  )
                  .map((provider) => (
                    <SelectItem
                      key={provider.provider_id}
                      value={provider.provider_id.toString()}
                      className="text-white hover:text-white focus:text-white focus:bg-zinc-800 hover:bg-zinc-800"
                    >
                      {provider.provider_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {filteredProviders.length === 0 ? (
            <div className="text-center py-12">
              <Film className="size-16 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 text-lg">No results found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProviders.map((provider) => {
                const countries = getProviderCountries(provider.provider_id);
                const filteredCountriesList = countries.filter((countryCode) =>
                  searchQuery
                    ? (countryNames[countryCode] || countryCode)
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    : true
                );

                if (filteredCountriesList.length === 0) return null;

                return (
                  <div
                    key={provider.provider_id}
                    className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      {provider.logo_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                          alt={provider.provider_name}
                          width={48}
                          height={48}
                          className="rounded"
                        />
                      ) : (
                        <div className="size-12 bg-zinc-700 rounded flex items-center justify-center">
                          <Film className="size-6 text-zinc-500" />
                        </div>
                      )}
                      <h3 className="text-xl md:text-2xl font-bold text-white">
                        {provider.provider_name}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                          Available in {filteredCountriesList.length} countries
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {filteredCountriesList.map((countryCode) => (
                            <div
                              key={countryCode}
                              className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2"
                            >
                              <span className="text-lg">
                                {getCountryFlag(countryCode)}
                              </span>
                              <span className="text-white text-sm">
                                {countryNames[countryCode] || countryCode}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
