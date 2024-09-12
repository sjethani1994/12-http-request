import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Subscription, throwError } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private subscription = Subscription.EMPTY;
  public isFetching = signal(false);
  public error = signal('');
  ngOnInit(): void {
    this.isFetching.set(true);
    this.subscription = this.httpClient
      .get<{ places: Place[] }>('http://localhost:3000/places', {
        observe: 'response',
      })
      .pipe(
        map((response: any) => response.body.places),
        catchError((error) =>
          throwError(() => {
            console.error('Error fetching places:', error);
            return new Error('Error fetching available places');
          })
        )
      )
      .subscribe({
        next: (places) => {
          this.places.set(places);
        },
        complete: () => {
          this.isFetching.set(false);
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
      });
    this.destroyRef.onDestroy(() => {
      this.subscription.unsubscribe();
    });
  }
}
