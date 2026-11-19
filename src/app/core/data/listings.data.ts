import { Agent, City, Listing, ListingImage, PropertyType } from '../models/listing';

export const CITIES: City[] = [
  { id: 'dubai', name: 'Dubai', lat: 25.15, lng: 55.25 },
  { id: 'abu-dhabi', name: 'Abu Dhabi', lat: 24.47, lng: 54.45 },
  { id: 'sharjah', name: 'Sharjah', lat: 25.32, lng: 55.42 },
  { id: 'ajman', name: 'Ajman', lat: 25.42, lng: 55.47 },
  { id: 'ras-al-khaimah', name: 'Ras Al Khaimah', lat: 25.7, lng: 55.79 },
];

export const AGENTS: Agent[] = [
  { id: 'sara', name: 'Sara Haddad', title: 'Senior consultant, Dubai', email: 'sara@nestfinder.example', languages: ['English', 'Arabic'], color: '#0f766e' },
  { id: 'daniel', name: 'Daniel Brooks', title: 'Property consultant, Dubai', email: 'daniel@nestfinder.example', languages: ['English', 'German'], color: '#9a3412' },
  { id: 'leila', name: 'Leila Farouk', title: 'Senior consultant, Abu Dhabi', email: 'leila@nestfinder.example', languages: ['English', 'Arabic', 'French'], color: '#6d28d9' },
  { id: 'arjun', name: 'Arjun Mehta', title: 'Consultant, Northern Emirates', email: 'arjun@nestfinder.example', languages: ['English', 'Hindi'], color: '#1d4ed8' },
  { id: 'elena', name: 'Elena Petrova', title: 'Luxury homes specialist', email: 'elena@nestfinder.example', languages: ['English', 'Russian'], color: '#be185d' },
];

// photo sets per property type; the variant number rotates colours between listings
const SCENES: Record<PropertyType, [string, string][]> = {
  apartment: [['tower', 'Building exterior'], ['living', 'Living room'], ['kitchen', 'Kitchen'], ['bedroom', 'Main bedroom'], ['bathroom', 'Bathroom'], ['view', 'View from the balcony']],
  villa: [['villa', 'Villa exterior'], ['garden', 'Garden and pool'], ['living', 'Living room'], ['kitchen', 'Kitchen'], ['bedroom', 'Main bedroom'], ['bathroom', 'Bathroom']],
  townhouse: [['townhouse', 'Townhouse exterior'], ['living', 'Living room'], ['kitchen', 'Kitchen'], ['bedroom', 'Main bedroom'], ['bathroom', 'Bathroom'], ['garden', 'Community pool']],
  studio: [['building', 'Building exterior'], ['living', 'Living area'], ['kitchen', 'Kitchenette'], ['bathroom', 'Bathroom'], ['view', 'View from the window']],
};
const VARIANTS: Record<string, number> = { tower: 3, villa: 3, townhouse: 2, building: 2, living: 3, kitchen: 2, bedroom: 2, bathroom: 2, view: 2, garden: 2 };

function photos(type: PropertyType, seed: number): ListingImage[] {
  return SCENES[type].map(([scene, alt], i) => ({
    src: `images/${scene}-${((seed + i) % VARIANTS[scene]) + 1}.svg`,
    alt,
  }));
}

type Seed = Omit<Listing, 'images' | 'ref'>;

const SEED: Seed[] = [
  {
    id: 'marina-gate-two-bedroom',
    title: 'Two-bedroom with full marina views',
    type: 'apartment', city: 'dubai', community: 'Dubai Marina',
    price: 2_750_000, beds: 2, baths: 3, area: 1380, lat: 25.0869, lng: 55.1473,
    listedAt: '2026-11-14', yearBuilt: 2018, parking: 1, furnished: true, featured: true, agentId: 'sara',
    amenities: ['Balcony', 'Marina view', 'Shared pool', 'Gym', 'Concierge', 'Covered parking', 'Central A/C'],
    description:
      'A bright corner unit on the 32nd floor with floor-to-ceiling windows over the yachts. Both bedrooms are en-suite, the kitchen is open to the living room and the wraparound balcony catches the evening breeze. The tram and the Marina Walk are a two-minute walk away.',
  },
  {
    id: 'downtown-one-bedroom-burj-view',
    title: 'One-bedroom facing Burj Khalifa',
    type: 'apartment', city: 'dubai', community: 'Downtown Dubai',
    price: 2_150_000, beds: 1, baths: 2, area: 860, lat: 25.1951, lng: 55.276,
    listedAt: '2026-11-10', yearBuilt: 2016, parking: 1, furnished: true, agentId: 'daniel',
    amenities: ['Balcony', 'Burj Khalifa view', 'Shared pool', 'Gym', 'Concierge', 'Built-in wardrobes'],
    description:
      'Wake up to the tower and watch the fountain shows from the balcony. The apartment was refurbished last year with oak floors and a new kitchen, and comes fully furnished. Dubai Mall and the metro are within walking distance.',
  },
  {
    id: 'palm-signature-villa',
    title: 'Signature villa with private beach',
    type: 'villa', city: 'dubai', community: 'Palm Jumeirah',
    price: 24_500_000, beds: 5, baths: 6, area: 7200, lat: 25.118, lng: 55.1305,
    listedAt: '2026-11-17', yearBuilt: 2009, parking: 3, furnished: false, featured: true, agentId: 'elena',
    amenities: ['Private pool', 'Beach access', 'Garden', "Maid's room", 'Smart home', 'Sea view', 'Covered parking'],
    description:
      'An upgraded frond villa with 70 metres of private beach and views across to the Marina skyline. The ground floor opens fully onto the pool terrace, and every bedroom has its own bathroom and walk-in wardrobe. Upgrades include a chef kitchen, cinema room and full home automation.',
  },
  {
    id: 'jvc-compact-studio',
    title: 'Compact studio near Circle Mall',
    type: 'studio', city: 'dubai', community: 'Jumeirah Village Circle',
    price: 585_000, beds: 0, baths: 1, area: 410, lat: 25.059, lng: 55.209,
    listedAt: '2026-11-16', yearBuilt: 2021, parking: 1, furnished: true, agentId: 'daniel',
    amenities: ['Shared pool', 'Gym', 'Covered parking', 'Kids play area', 'Central A/C'],
    description:
      'A well laid-out studio in a newer building, rented until March with a tenant who would like to stay. Comes with a parking space, a separate kitchenette and a large window facing the community park. A solid first investment with a gross yield around 7%.',
  },
  {
    id: 'arabian-ranches-corner-townhouse',
    title: 'Corner townhouse backing onto the park',
    type: 'townhouse', city: 'dubai', community: 'Arabian Ranches',
    price: 3_350_000, beds: 3, baths: 4, area: 2450, lat: 25.056, lng: 55.269,
    listedAt: '2026-10-28', yearBuilt: 2014, parking: 2, furnished: false, agentId: 'sara',
    amenities: ['Private garden', 'Community pool', "Maid's room", 'Kids play area', 'Pets allowed', 'Covered parking'],
    description:
      'A corner plot with a larger garden than the rest of the row and a gate straight onto the park. The ground floor has a guest toilet, open kitchen and a family room; upstairs are three bedrooms, two of them en-suite. Schools and the Ranches Souk are a short drive.',
  },
  {
    id: 'business-bay-canal-two-bedroom',
    title: 'Canal-view two-bedroom apartment',
    type: 'apartment', city: 'dubai', community: 'Business Bay',
    price: 2_390_000, beds: 2, baths: 2, area: 1190, lat: 25.184, lng: 55.269,
    listedAt: '2026-11-06', yearBuilt: 2019, parking: 1, furnished: false, agentId: 'daniel',
    amenities: ['Balcony', 'Canal view', 'Shared pool', 'Gym', 'Concierge', 'Study'],
    description:
      'A quiet two-bedroom on the canal side of the building, with a study nook that works well as a home office. The running track along the water starts at the lobby door. Vacant on transfer.',
  },
  {
    id: 'dubai-hills-golf-villa',
    title: 'Family villa on the golf course',
    type: 'villa', city: 'dubai', community: 'Dubai Hills Estate',
    price: 9_800_000, beds: 4, baths: 5, area: 4600, lat: 25.106, lng: 55.249,
    listedAt: '2026-10-20', yearBuilt: 2020, parking: 2, furnished: false, featured: true, agentId: 'elena',
    amenities: ['Private pool', 'Golf course view', 'Garden', "Maid's room", 'Smart home', 'Covered parking'],
    description:
      'A contemporary four-bedroom villa looking straight down the 9th fairway. The double-height living room opens to a landscaped garden with a heated pool. Dubai Hills Mall, parks and two international schools are within five minutes.',
  },
  {
    id: 'jlt-lake-studio',
    title: 'Lake-facing studio with balcony',
    type: 'studio', city: 'dubai', community: 'Jumeirah Lake Towers',
    price: 640_000, beds: 0, baths: 1, area: 455, lat: 25.0715, lng: 55.143,
    listedAt: '2026-10-30', yearBuilt: 2012, parking: 1, furnished: true, agentId: 'sara',
    amenities: ['Balcony', 'Lake view', 'Shared pool', 'Gym', 'Covered parking'],
    description:
      'A furnished studio with a proper balcony over the lake and the metro station at the end of the cluster. The building was repainted this year and has a rooftop pool. Ideal for a short-term rental.',
  },
  {
    id: 'creek-harbour-three-bedroom',
    title: 'Three-bedroom with Creek skyline views',
    type: 'apartment', city: 'dubai', community: 'Dubai Creek Harbour',
    price: 4_250_000, beds: 3, baths: 4, area: 1920, lat: 25.2035, lng: 55.346,
    listedAt: '2026-11-12', yearBuilt: 2023, parking: 2, furnished: false, featured: true, agentId: 'elena',
    amenities: ['Balcony', 'Skyline view', 'Shared pool', 'Gym', 'Concierge', "Maid's room", 'Kids play area'],
    description:
      'A brand-new three-bedroom on a high floor with views across the creek to Downtown. Large windows, a separate laundry and a maid room with its own bathroom. The boardwalk, Creek Beach and the wildlife sanctuary are on the doorstep.',
  },
  {
    id: 'town-square-townhouse',
    title: 'Three-bed townhouse near the park',
    type: 'townhouse', city: 'dubai', community: 'Town Square',
    price: 2_050_000, beds: 3, baths: 3, area: 1980, lat: 25.013, lng: 55.286,
    listedAt: '2026-09-28', yearBuilt: 2019, parking: 2, furnished: false, agentId: 'daniel',
    amenities: ['Private garden', 'Community pool', 'Gym', 'Kids play area', 'Pets allowed'],
    description:
      'A mid-terrace home two streets from the central park, with a south-facing garden and a roof terrace. The owner added built-in wardrobes and a shaded pergola. Good value for a family moving out of an apartment.',
  },
  {
    id: 'reem-island-two-bedroom',
    title: 'Two-bedroom with mangrove views',
    type: 'apartment', city: 'abu-dhabi', community: 'Al Reem Island',
    price: 1_650_000, beds: 2, baths: 3, area: 1320, lat: 24.499, lng: 54.406,
    listedAt: '2026-11-11', yearBuilt: 2015, parking: 1, furnished: false, agentId: 'leila',
    amenities: ['Balcony', 'Sea view', 'Shared pool', 'Gym', 'Concierge', 'Built-in wardrobes'],
    description:
      'Spacious two-bedroom on the waterfront side of Reem, facing the mangroves and the city. Both bedrooms are en-suite and there is a separate guest toilet. The Galleria and Reem Central Park are a few minutes away.',
  },
  {
    id: 'saadiyat-beach-villa',
    title: 'Beachfront villa on Saadiyat',
    type: 'villa', city: 'abu-dhabi', community: 'Saadiyat Island',
    price: 13_900_000, beds: 5, baths: 7, area: 6800, lat: 24.545, lng: 54.43,
    listedAt: '2026-11-04', yearBuilt: 2018, parking: 3, furnished: false, featured: true, agentId: 'leila',
    amenities: ['Private pool', 'Beach access', 'Garden', "Maid's room", 'Driver room', 'Smart home', 'Sea view'],
    description:
      'A five-bedroom villa in a gated beach community, close to the Louvre and the cultural district. The upper floor has a family lounge and a master suite with a sea-facing terrace. Mature garden with an infinity-edge pool.',
  },
  {
    id: 'yas-acres-townhouse',
    title: 'End-unit townhouse in Yas Acres',
    type: 'townhouse', city: 'abu-dhabi', community: 'Yas Island',
    price: 3_100_000, beds: 3, baths: 4, area: 2600, lat: 24.492, lng: 54.598,
    listedAt: '2026-10-25', yearBuilt: 2021, parking: 2, furnished: false, agentId: 'leila',
    amenities: ['Private garden', 'Golf course view', 'Community pool', 'Gym', 'Kids play area', "Maid's room"],
    description:
      'An end unit with an extra side garden and a view over the golf course. Inside: open-plan living, a closed kitchen option and three large bedrooms. Yas Mall, the beach and the theme parks are all within ten minutes.',
  },
  {
    id: 'raha-beach-one-bedroom',
    title: 'Furnished one-bedroom by the canal',
    type: 'apartment', city: 'abu-dhabi', community: 'Al Raha Beach',
    price: 1_180_000, beds: 1, baths: 2, area: 830, lat: 24.4555, lng: 54.601,
    listedAt: '2026-11-15', yearBuilt: 2014, parking: 1, furnished: true, agentId: 'leila',
    amenities: ['Balcony', 'Canal view', 'Shared pool', 'Gym', 'Beach access'],
    description:
      'A furnished one-bedroom with a long balcony over the canal and the promenade below. The building has a private beach and a shaded pool deck. Fifteen minutes to the airport.',
  },
  {
    id: 'khalifa-city-family-villa',
    title: 'Independent family villa with large plot',
    type: 'villa', city: 'abu-dhabi', community: 'Khalifa City',
    price: 4_600_000, beds: 5, baths: 6, area: 5500, lat: 24.42, lng: 54.578,
    listedAt: '2026-10-15', yearBuilt: 2011, parking: 4, furnished: false, agentId: 'leila',
    amenities: ['Private garden', "Maid's room", 'Driver room', 'Majlis', 'Covered parking', 'Storage room'],
    description:
      'A standalone villa on a 9,000 sqft plot with a separate majlis and parking for four cars. Five bedrooms upstairs, a formal dining room and a large family kitchen downstairs. Close to schools, mosques and the main highway.',
  },
  {
    id: 'corniche-three-bedroom',
    title: 'Three-bedroom on the Corniche',
    type: 'apartment', city: 'abu-dhabi', community: 'Corniche',
    price: 3_400_000, beds: 3, baths: 4, area: 2100, lat: 24.478, lng: 54.34,
    listedAt: '2026-11-08', yearBuilt: 2013, parking: 2, furnished: false, agentId: 'leila',
    amenities: ['Balcony', 'Sea view', 'Shared pool', 'Gym', 'Concierge', "Maid's room"],
    description:
      'Unobstructed sea views from every room of this three-bedroom on the Corniche. The layout separates the bedrooms from the living area, and the kitchen has space for a breakfast table. Walking distance to the beach and the Corniche cycle path.',
  },
  {
    id: 'reem-island-studio',
    title: 'Furnished studio in Reem',
    type: 'studio', city: 'abu-dhabi', community: 'Al Reem Island',
    price: 520_000, beds: 0, baths: 1, area: 430, lat: 24.4945, lng: 54.401,
    listedAt: '2026-11-04', yearBuilt: 2020, parking: 1, furnished: true, agentId: 'leila',
    amenities: ['Shared pool', 'Gym', 'Concierge', 'Covered parking', 'Central A/C'],
    description:
      'A neat furnished studio with a parking space, in a building with a rooftop pool and gym. Chiller-free, so running costs stay low. Ready to move in.',
  },
  {
    id: 'al-majaz-two-bedroom',
    title: 'Two-bedroom near Al Majaz Waterfront',
    type: 'apartment', city: 'sharjah', community: 'Al Majaz',
    price: 780_000, beds: 2, baths: 2, area: 1250, lat: 25.326, lng: 55.386,
    listedAt: '2026-11-09', yearBuilt: 2010, parking: 1, furnished: false, agentId: 'arjun',
    amenities: ['Balcony', 'Lake view', 'Shared pool', 'Gym', 'Covered parking'],
    description:
      'A generous two-bedroom overlooking Khalid Lagoon, a short walk from the waterfront park and its fountain. Recently repainted with new bathroom fittings. Easy access to the Dubai road.',
  },
  {
    id: 'aljada-one-bedroom',
    title: 'New one-bedroom in Aljada',
    type: 'apartment', city: 'sharjah', community: 'Aljada',
    price: 720_000, beds: 1, baths: 2, area: 760, lat: 25.3085, lng: 55.459,
    listedAt: '2026-11-13', yearBuilt: 2024, parking: 1, furnished: false, agentId: 'arjun',
    amenities: ['Balcony', 'Shared pool', 'Gym', 'Kids play area', 'Smart home'],
    description:
      'A first-hand one-bedroom in one of the newest Aljada buildings, handed over this year. Smart thermostats, a full kitchen and a balcony over the central park. Shops, cafes and the skate park are downstairs.',
  },
  {
    id: 'aljada-townhouse',
    title: 'Three-bed townhouse with roof terrace',
    type: 'townhouse', city: 'sharjah', community: 'Aljada',
    price: 1_850_000, beds: 3, baths: 4, area: 2050, lat: 25.311, lng: 55.464,
    listedAt: '2026-11-16', yearBuilt: 2024, parking: 2, furnished: false, agentId: 'arjun',
    amenities: ['Private garden', 'Roof terrace', 'Community pool', 'Kids play area', "Maid's room"],
    description:
      'A modern townhouse with a private roof terrace and a small garden. Three bedrooms upstairs, an open living and dining floor and a maid room. Part of a family community with pools and play areas.',
  },
  {
    id: 'al-khan-studio',
    title: 'Sea-view studio in Al Khan',
    type: 'studio', city: 'sharjah', community: 'Al Khan',
    price: 365_000, beds: 0, baths: 1, area: 480, lat: 25.3285, lng: 55.3735,
    listedAt: '2026-11-05', yearBuilt: 2015, parking: 1, furnished: true, agentId: 'arjun',
    amenities: ['Sea view', 'Shared pool', 'Gym', 'Beach access'],
    description:
      'An affordable studio with a side sea view and access to Al Khan beach. The building has a pool, gym and 24-hour security. Furnished and rented until May.',
  },
  {
    id: 'al-zahia-villa',
    title: 'Four-bedroom villa in Al Zahia',
    type: 'villa', city: 'sharjah', community: 'Al Zahia',
    price: 3_900_000, beds: 4, baths: 5, area: 4100, lat: 25.2995, lng: 55.451,
    listedAt: '2026-10-18', yearBuilt: 2019, parking: 2, furnished: false, agentId: 'arjun',
    amenities: ['Private pool', 'Private garden', "Maid's room", 'Community gym', 'Kids play area'],
    description:
      'A well-kept four-bedroom villa with a private pool and a landscaped garden. The ground floor guest suite is ideal for visiting family. City Centre Al Zahia mall is two minutes away.',
  },
  {
    id: 'ajman-corniche-two-bedroom',
    title: 'Two-bedroom on Ajman Corniche',
    type: 'apartment', city: 'ajman', community: 'Ajman Corniche',
    price: 690_000, beds: 2, baths: 3, area: 1300, lat: 25.417, lng: 55.44,
    listedAt: '2026-11-07', yearBuilt: 2016, parking: 1, furnished: false, agentId: 'arjun',
    amenities: ['Balcony', 'Sea view', 'Shared pool', 'Gym', 'Covered parking'],
    description:
      'A sea-facing two-bedroom right on the corniche, across the road from the beach. Large living room, closed kitchen and two en-suite bedrooms. One of the best value sea views on the coast.',
  },
  {
    id: 'al-zorah-golf-villa',
    title: 'Golf-side villa in Al Zorah',
    type: 'villa', city: 'ajman', community: 'Al Zorah',
    price: 3_250_000, beds: 4, baths: 5, area: 3900, lat: 25.442, lng: 55.501,
    listedAt: '2026-10-27', yearBuilt: 2022, parking: 2, furnished: false, agentId: 'arjun',
    amenities: ['Private pool', 'Golf course view', 'Private garden', "Maid's room", 'Smart home'],
    description:
      'A contemporary villa on the edge of the Al Zorah golf course, surrounded by mangroves. Light-filled rooms, a private pool and a covered outdoor kitchen. Freehold for all nationalities.',
  },
  {
    id: 'al-nuaimiya-studio',
    title: 'Budget studio in Al Nuaimiya',
    type: 'studio', city: 'ajman', community: 'Al Nuaimiya',
    price: 245_000, beds: 0, baths: 1, area: 420, lat: 25.399, lng: 55.452,
    listedAt: '2026-11-01', yearBuilt: 2008, parking: 1, furnished: true, agentId: 'arjun',
    amenities: ['Covered parking', 'Security', 'Central A/C'],
    description:
      'A simple, furnished studio in a central location with supermarkets and transport nearby. Low service charges and a parking space included. A practical entry into the market.',
  },
  {
    id: 'al-zorah-townhouse',
    title: 'Three-bed townhouse by the mangroves',
    type: 'townhouse', city: 'ajman', community: 'Al Zorah',
    price: 1_450_000, beds: 3, baths: 3, area: 1850, lat: 25.4385, lng: 55.4955,
    listedAt: '2026-11-03', yearBuilt: 2023, parking: 2, furnished: false, agentId: 'arjun',
    amenities: ['Private garden', 'Community pool', 'Kids play area', 'Pets allowed'],
    description:
      'A new townhouse a short walk from the mangrove boardwalk. Three bedrooms, a laundry room and a private garden. Community pool and play areas within the cluster.',
  },
  {
    id: 'marjan-island-one-bedroom',
    title: 'Beachfront one-bedroom on Al Marjan',
    type: 'apartment', city: 'ras-al-khaimah', community: 'Al Marjan Island',
    price: 1_050_000, beds: 1, baths: 2, area: 880, lat: 25.666, lng: 55.739,
    listedAt: '2026-11-12', yearBuilt: 2022, parking: 1, furnished: true, featured: true, agentId: 'sara',
    amenities: ['Balcony', 'Sea view', 'Beach access', 'Shared pool', 'Gym', 'Concierge'],
    description:
      'A furnished one-bedroom with a deep balcony facing the sea, steps from the beach. Strong holiday-rental demand with the new resort opening nearby. Hotel-style facilities and 24-hour concierge.',
  },
  {
    id: 'mina-al-arab-villa',
    title: 'Lagoon villa in Mina Al Arab',
    type: 'villa', city: 'ras-al-khaimah', community: 'Mina Al Arab',
    price: 4_950_000, beds: 4, baths: 5, area: 4300, lat: 25.734, lng: 55.825,
    listedAt: '2026-10-12', yearBuilt: 2020, parking: 2, furnished: false, agentId: 'elena',
    amenities: ['Private pool', 'Lagoon view', 'Private garden', "Maid's room", 'Beach access'],
    description:
      'A waterfront villa on the lagoon with its own jetty-side garden and a private pool. Four bedrooms, a family room upstairs and a large covered terrace. A calm, nature-reserve setting 45 minutes from Dubai.',
  },
  {
    id: 'al-hamra-townhouse',
    title: 'Townhouse in Al Hamra Village',
    type: 'townhouse', city: 'ras-al-khaimah', community: 'Al Hamra Village',
    price: 1_750_000, beds: 3, baths: 4, area: 2200, lat: 25.688, lng: 55.783,
    listedAt: '2026-11-10', yearBuilt: 2017, parking: 2, furnished: false, agentId: 'sara',
    amenities: ['Private garden', 'Golf course view', 'Community pool', 'Beach access', "Maid's room"],
    description:
      'A golf-side townhouse in an established resort village with a marina, beach and golf course. Bright living space, three bedrooms and a maid room. Rented out until summer.',
  },
  {
    id: 'marjan-island-studio',
    title: 'Sea-view studio on Al Marjan',
    type: 'studio', city: 'ras-al-khaimah', community: 'Al Marjan Island',
    price: 495_000, beds: 0, baths: 1, area: 455, lat: 25.6625, lng: 55.7345,
    listedAt: '2026-11-09', yearBuilt: 2023, parking: 1, furnished: true, agentId: 'sara',
    amenities: ['Sea view', 'Beach access', 'Shared pool', 'Gym'],
    description:
      'A furnished studio with a sea view and direct beach access, run as a holiday home. Comes with a parking space and a fitted kitchenette. A low-entry way into the island.',
  },
];

export const LISTINGS: Listing[] = SEED.map((l, i) => ({ ...l, ref: `NF-${1001 + i}`, images: photos(l.type, i) }));
