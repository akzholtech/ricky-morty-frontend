export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
  origin: Location;
  location: Location;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

export interface Location {
  name: string;
  url: string;
}

export interface ApiResponse<T> {
  info: ApiInfo;
  results: T[];
}

export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharacterFilter {
  name?: string;
  status?: CharacterStatus | '';
  species?: string;
  type?: string;
  gender?: CharacterGender | '';
  page?: number;
}
