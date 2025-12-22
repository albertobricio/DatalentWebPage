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
      attribution: '',
    }).addTo(this.map);

    const customIcon = leaflet.icon({
      iconUrl: 'assets/datalent-icon.png',
      iconSize: [30, 30], // Tamaño del icono
      iconAnchor: [12, 30], // Punto de anclaje del icono
      popupAnchor: [1, -34] // Punto de anclaje del popup
    });

    leaflet.marker([40.0075171,-3.0144763], { icon: customIcon }).addTo(this.map)
      .bindPopup('Ubicación: Tarancón, Cuenca, España, C/ Romero')
      .openPopup();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
