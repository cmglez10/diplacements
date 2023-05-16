import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ceil } from 'lodash';
import { Observable, map } from 'rxjs';

export interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

export interface OpenrouteserviceResponse {
  features: Array<{
    properties: {
      summary: {
        distance: number;
      };
    };
  }>;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface AddressInfo {
  coordinates: Coordinates;
  name: string;
}

const NOMATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const OPENROUTESERVICE_TOKEN = '';
const OPENROUTESERVICE_BASE_URL =
  'https://api.openrouteservice.org/v2/directions';

@Injectable({
  providedIn: 'root',
})
export class OpenstreetmapService {
  constructor(private readonly _httpClient: HttpClient) {}

  getAddressInfo(location: string): Observable<AddressInfo> {
    const url = `${NOMATIM_BASE_URL}/search?q=${location}&format=json&polygon=1&addressdetails=1`;

    return this._httpClient.get<NominatimResponse[]>(url).pipe(
      map((response: NominatimResponse[]) => {
        return {
          coordinates: {
            latitude: parseFloat(response[0]?.lat),
            longitude: parseFloat(response[0]?.lon),
          },
          name: response[0]?.display_name,
        };
      })
    );
  }

  getDistance(origin: Coordinates, destiny: Coordinates): Observable<number> {
    const originString = `${origin.longitude},${origin.latitude}`;
    const destinyString = `${destiny.longitude},${destiny.latitude}`;
    const url = `${OPENROUTESERVICE_BASE_URL}/driving-car?api_key=${OPENROUTESERVICE_TOKEN}&start=${originString}&end=${destinyString}`;

    return this._httpClient.get<OpenrouteserviceResponse>(url).pipe(
      map((response: OpenrouteserviceResponse) => {
        return ceil(response.features[0].properties.summary.distance / 1000);
      })
    );
  }
}
