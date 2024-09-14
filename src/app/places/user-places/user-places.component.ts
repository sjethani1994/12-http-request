import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  private subscription = Subscription.EMPTY;
  public isFetching = signal(false);
  public error = signal('');
  places = this.placesService.loadedUserPlaces;
  ngOnInit(): void {
    this.isFetching.set(true);
    this.subscription = this.placesService.loadUserPlaces().subscribe({
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

  public onRemovePlace(place: Place) {
    this.subscription = this.placesService.removeUserPlace(place).subscribe();
    this.destroyRef.onDestroy(() => {
      this.subscription.unsubscribe();
    });
  }
}
