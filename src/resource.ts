export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  is_legendary: boolean;
  habitat: NamedAPIResource;
  flavor_text_entries: FlavorText[];
  applied_language: string;
}


