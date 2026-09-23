export type ThemeId = 'cozy' | 'aurora' | 'cyber' | 'glacial' | 'glassy' | 'ivory' | 'copenhagen' | 'newspaper' | 'frosted' | 'midnight';

export type CountryId = 'spain' | 'switzerland' | 'netherlands' | 'norway' | 'sweden';
export type GuideCountryId = CountryId | 'iceland' | 'both' | `custom:${string}`;

export type CategoryId = 'emergency' | 'parking' | 'traffic' | 'grocery' | 'stay' | 'activity' | 'experience' | 'food' | 'aurora' | 'photo' | 'drone' | 'history';

export interface GuideSource {
  title: string;
  url: string;
}

export interface GuideItem {
  id: string;
  category: CategoryId;
  country: GuideCountryId;
  title: string;
  shortDesc: string;
  iconName: string;
  urgency?: 'high' | 'medium' | 'low';
  tags: string[];
  // Detailed fields
  location?: string;
  bookingNeeded?: 'yes' | 'no' | 'recommended';
  costRange?: string; // e.g., '免费', '$$', '$$$'
  details: {
    sectionTitle: string;
    items: string[];
  }[];
  sources?: GuideSource[];
  funFact?: string; // An interesting trivia to add "fun" to the guide
  quickChecklist?: string[]; // A list of items that the user can prepare/bring
  coverImage?: string;
  wikiTitle?: string;
  gallery?: string[];
  mapQuery?: string;
  coordinates?: string;
  googleMapsUrl?: string;
  countryLabel?: string;
  countryEmoji?: string;
  importedListId?: string;
  importedAt?: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  chineseName: string;
  description: string;
  // CSS styling mappings
  bgClass: string;
  cardBgClass: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
  accentColor: string; // Tailwind color e.g., 'emerald-600'
  accentBg: string; // e.g., 'bg-emerald-50'
  borderStyle: string; // e.g., 'border border-stone-200'
  borderRadius: string; // e.g., 'rounded-2xl'
  fontHeading: string; // CSS font-family
  fontBody: string; // CSS font-family
  animationStyle: string; // Description for UI presentation
  effects: {
    snow?: boolean;
    auroraLines?: boolean;
    cyberGrid?: boolean;
    warmFireplace?: boolean;
    glowingGradients?: boolean;
    ivoryPaper?: boolean;
    ashMinimal?: boolean;
    newspaperTactile?: boolean;
    frostedGlass?: boolean;
    midnightStars?: boolean;
  };
}
