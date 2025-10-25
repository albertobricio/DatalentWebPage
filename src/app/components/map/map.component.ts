import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import * as leaflet from 'leaflet';

@Component({
  standalone: true,
  selector: 'app-map',
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map: leaflet.Map | undefined;

  private initMap(): void {
    this.map = leaflet.map('map').setView([40.0075171,-3.0144763], 17);

    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    leaflet.marker([40.0075171,-3.0144763]).addTo(this.map)
      .bindPopup('Ubicación: Tarancón, Cuenca, España, C/ Romero')
      .openPopup();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
