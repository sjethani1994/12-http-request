import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);
  private errorService = inject(ErrorService);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/places',
      'Error fetching available places'
    );
  }

  loadUserPlaces() {
    return this.fetchUserPlaces(
      'http://localhost:3000/user-places',
      'Error fetching user places'
    ).pipe(
      tap({
        next: (places) => this.userPlaces.set(places),
      })
    );
  }
  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();

    if (!prevPlaces.some((prevPlace) => prevPlace.id === place.id)) {
      this.userPlaces.update((prev) => [...prev, place]);
    }
    return this.addUserPlaces('http://localhost:3000/user-places', place).pipe(
      catchError((error) => {
        this.userPlaces.set(prevPlaces);
        this.errorService.showError('Failed to store selected place.');
        return throwError(() => new Error('Failed to store selected place.'));
      })
    );
  }

  removeUserPlace(place: Place) {
    const prevPlaces = this.userPlaces();

    if (prevPlaces.some((prevPlace) => prevPlace.id === place.id)) {
      this.userPlaces.update((prev) =>
        prev.filter((prevPlace) => prevPlace.id !== place.id)
      );
    }
    return this.httpClient.delete(
      'http://localhost:3000/user-places/' + place.id
    ).pipe(
      catchError((error) => {
        this.userPlaces.set(prevPlaces);
        this.errorService.showError('Failed to remove selected place.');
        return throwError(() => new Error('Failed to remove selected place.'));
      })
    );
  }

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient
      .get<{ places: Place[] }>(url, {
        observe: 'response',
      })
      .pipe(
        map((response: any) => response.body.places),
        catchError((error) =>
          throwError(() => {
            console.error('Error fetching places:', error);
            return new Error(errorMessage);
          })
        )
      );
  }

  private addUserPlaces(url: string, place: Place) {
    return this.httpClient.put(
      url,
      {
        placeId: place.id,
      },
      {
        observe: 'response',
      }
    );
  }

  private fetchUserPlaces(url: string, errorMessage: string) {
    return this.httpClient
      .get<{ places: Place[] }>(url, {
        observe: 'response',
      })
      .pipe(
        map((response: any) => response.body.places),
        catchError((error) =>
          throwError(() => {
            console.error('Error fetching places:', error);
            return new Error(errorMessage);
          })
        )
      );
  }
}
