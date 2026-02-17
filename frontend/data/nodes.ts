/**
 * Cloudflare Edge Locations Data
 * Represents major edge nodes for simulation
 */

import type { GeoNode } from '../types';

export const EDGE_NODES: GeoNode[] = [
  // North America
  { id: 'sfo', name: 'San Francisco', city: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, region: 'North America' },
  { id: 'lax', name: 'Los Angeles', city: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, region: 'North America' },
  { id: 'sea', name: 'Seattle', city: 'Seattle', country: 'USA', lat: 47.6062, lng: -122.3321, region: 'North America' },
  { id: 'dfw', name: 'Dallas', city: 'Dallas', country: 'USA', lat: 32.7767, lng: -96.7970, region: 'North America' },
  { id: 'ord', name: 'Chicago', city: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, region: 'North America' },
  { id: 'iad', name: 'Washington DC', city: 'Washington', country: 'USA', lat: 38.9072, lng: -77.0369, region: 'North America' },
  { id: 'ewr', name: 'New York', city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, region: 'North America' },
  { id: 'yyz', name: 'Toronto', city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, region: 'North America' },
  
  // Europe
  { id: 'lhr', name: 'London', city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, region: 'Europe' },
  { id: 'cdg', name: 'Paris', city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, region: 'Europe' },
  { id: 'fra', name: 'Frankfurt', city: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821, region: 'Europe' },
  { id: 'ams', name: 'Amsterdam', city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, region: 'Europe' },
  { id: 'mad', name: 'Madrid', city: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, region: 'Europe' },
  { id: 'arn', name: 'Stockholm', city: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, region: 'Europe' },
  
  // Asia Pacific
  { id: 'nrt', name: 'Tokyo', city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, region: 'Asia' },
  { id: 'sin', name: 'Singapore', city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, region: 'Asia' },
  { id: 'hkg', name: 'Hong Kong', city: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694, region: 'Asia' },
  { id: 'syd', name: 'Sydney', city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, region: 'Oceania' },
  { id: 'bom', name: 'Mumbai', city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, region: 'Asia' },
  { id: 'icn', name: 'Seoul', city: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, region: 'Asia' },
  
  // South America
  { id: 'gru', name: 'São Paulo', city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, region: 'South America' },
  { id: 'eze', name: 'Buenos Aires', city: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, region: 'South America' },
  
  // Africa & Middle East
  { id: 'jnb', name: 'Johannesburg', city: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, region: 'Africa' },
  { id: 'dxb', name: 'Dubai', city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, region: 'Middle East' },
];

export function getNodeById(id: string): GeoNode | undefined {
  return EDGE_NODES.find(node => node.id === id);
}

export function getNodesByRegion(region: string): GeoNode[] {
  return EDGE_NODES.filter(node => node.region === region);
}
