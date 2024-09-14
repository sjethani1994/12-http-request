import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { Subscription } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  private subscription = Subscription.EMPTY;
  public isFetching = signal(false);
  public error = signal('');
  ngOnInit(): void {
    this.isFetching.set(true);
    this.subscription = this.placesService.loadAvailablePlaces().subscribe({
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

  public onSelectPlace(selectedPlace: Place) {
    this.placesService.addPlaceToUserPlaces(selectedPlace).subscribe({
      next: (response: any) => {
        console.log('Place added to user places:', response);
      },
    });
  }
}
