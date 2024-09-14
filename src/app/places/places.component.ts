import { Component, inject, input, output } from '@angular/core';

import { Place } from './place.model';
import { PlacesService } from './places.service';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [],
  templateUrl: './places.component.html',
  styleUrl: './places.component.css',
})
export class PlacesComponent {
  places = input.required<Place[]>();
  selectPlace = output<Place>();
  removePlace = input<Place[]>()
  private placesService = inject(PlacesService);
  onSelectPlace(place: Place) {
    this.selectPlace.emit(place);
  }
}
