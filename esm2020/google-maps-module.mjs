/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { GoogleMap } from './google-map/google-map';
import { MapBaseLayer } from './map-base-layer';
import { MapBicyclingLayer } from './map-bicycling-layer/map-bicycling-layer';
import { MapCircle } from './map-circle/map-circle';
import { MapDirectionsRenderer } from './map-directions-renderer/map-directions-renderer';
import { MapGroundOverlay } from './map-ground-overlay/map-ground-overlay';
import { MapInfoWindow } from './map-info-window/map-info-window';
import { MapKmlLayer } from './map-kml-layer/map-kml-layer';
import { MapMarker } from './map-marker/map-marker';
import { MapMarkerClusterer } from './map-marker-clusterer/map-marker-clusterer';
import { MapPolygon } from './map-polygon/map-polygon';
import { MapPolyline } from './map-polyline/map-polyline';
import { MapRectangle } from './map-rectangle/map-rectangle';
import { MapTrafficLayer } from './map-traffic-layer/map-traffic-layer';
import { MapTransitLayer } from './map-transit-layer/map-transit-layer';
import { MapHeatmapLayer } from './map-heatmap-layer/map-heatmap-layer';
import * as i0 from "@angular/core";
const COMPONENTS = [
    GoogleMap,
    MapBaseLayer,
    MapBicyclingLayer,
    MapCircle,
    MapDirectionsRenderer,
    MapGroundOverlay,
    MapInfoWindow,
    MapKmlLayer,
    MapMarker,
    MapMarkerClusterer,
    MapPolygon,
    MapPolyline,
    MapRectangle,
    MapTrafficLayer,
    MapTransitLayer,
    MapHeatmapLayer,
];
export class GoogleMapsModule {
}
GoogleMapsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0-rc.0", ngImport: i0, type: GoogleMapsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
GoogleMapsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.0-rc.0", ngImport: i0, type: GoogleMapsModule, declarations: [GoogleMap,
        MapBaseLayer,
        MapBicyclingLayer,
        MapCircle,
        MapDirectionsRenderer,
        MapGroundOverlay,
        MapInfoWindow,
        MapKmlLayer,
        MapMarker,
        MapMarkerClusterer,
        MapPolygon,
        MapPolyline,
        MapRectangle,
        MapTrafficLayer,
        MapTransitLayer,
        MapHeatmapLayer], exports: [GoogleMap,
        MapBaseLayer,
        MapBicyclingLayer,
        MapCircle,
        MapDirectionsRenderer,
        MapGroundOverlay,
        MapInfoWindow,
        MapKmlLayer,
        MapMarker,
        MapMarkerClusterer,
        MapPolygon,
        MapPolyline,
        MapRectangle,
        MapTrafficLayer,
        MapTransitLayer,
        MapHeatmapLayer] });
GoogleMapsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.0-rc.0", ngImport: i0, type: GoogleMapsModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0-rc.0", ngImport: i0, type: GoogleMapsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: COMPONENTS,
                    exports: COMPONENTS,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcHMtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL2dvb2dsZS1tYXBzLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFDNUUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2xELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLG1EQUFtRCxDQUFDO0FBQ3hGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHlDQUF5QyxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNoRSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDMUQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2xELE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLDZDQUE2QyxDQUFDO0FBQy9FLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDeEQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzNELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUN0RSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDdEUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHVDQUF1QyxDQUFDOztBQUV0RSxNQUFNLFVBQVUsR0FBRztJQUNqQixTQUFTO0lBQ1QsWUFBWTtJQUNaLGlCQUFpQjtJQUNqQixTQUFTO0lBQ1QscUJBQXFCO0lBQ3JCLGdCQUFnQjtJQUNoQixhQUFhO0lBQ2IsV0FBVztJQUNYLFNBQVM7SUFDVCxrQkFBa0I7SUFDbEIsVUFBVTtJQUNWLFdBQVc7SUFDWCxZQUFZO0lBQ1osZUFBZTtJQUNmLGVBQWU7SUFDZixlQUFlO0NBQ2hCLENBQUM7QUFNRixNQUFNLE9BQU8sZ0JBQWdCOztrSEFBaEIsZ0JBQWdCO21IQUFoQixnQkFBZ0IsaUJBdEIzQixTQUFTO1FBQ1QsWUFBWTtRQUNaLGlCQUFpQjtRQUNqQixTQUFTO1FBQ1QscUJBQXFCO1FBQ3JCLGdCQUFnQjtRQUNoQixhQUFhO1FBQ2IsV0FBVztRQUNYLFNBQVM7UUFDVCxrQkFBa0I7UUFDbEIsVUFBVTtRQUNWLFdBQVc7UUFDWCxZQUFZO1FBQ1osZUFBZTtRQUNmLGVBQWU7UUFDZixlQUFlLGFBZmYsU0FBUztRQUNULFlBQVk7UUFDWixpQkFBaUI7UUFDakIsU0FBUztRQUNULHFCQUFxQjtRQUNyQixnQkFBZ0I7UUFDaEIsYUFBYTtRQUNiLFdBQVc7UUFDWCxTQUFTO1FBQ1Qsa0JBQWtCO1FBQ2xCLFVBQVU7UUFDVixXQUFXO1FBQ1gsWUFBWTtRQUNaLGVBQWU7UUFDZixlQUFlO1FBQ2YsZUFBZTttSEFPSixnQkFBZ0I7Z0dBQWhCLGdCQUFnQjtrQkFKNUIsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUUsVUFBVTtvQkFDeEIsT0FBTyxFQUFFLFVBQVU7aUJBQ3BCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBCYXNlTGF5ZXJ9IGZyb20gJy4vbWFwLWJhc2UtbGF5ZXInO1xuaW1wb3J0IHtNYXBCaWN5Y2xpbmdMYXllcn0gZnJvbSAnLi9tYXAtYmljeWNsaW5nLWxheWVyL21hcC1iaWN5Y2xpbmctbGF5ZXInO1xuaW1wb3J0IHtNYXBDaXJjbGV9IGZyb20gJy4vbWFwLWNpcmNsZS9tYXAtY2lyY2xlJztcbmltcG9ydCB7TWFwRGlyZWN0aW9uc1JlbmRlcmVyfSBmcm9tICcuL21hcC1kaXJlY3Rpb25zLXJlbmRlcmVyL21hcC1kaXJlY3Rpb25zLXJlbmRlcmVyJztcbmltcG9ydCB7TWFwR3JvdW5kT3ZlcmxheX0gZnJvbSAnLi9tYXAtZ3JvdW5kLW92ZXJsYXkvbWFwLWdyb3VuZC1vdmVybGF5JztcbmltcG9ydCB7TWFwSW5mb1dpbmRvd30gZnJvbSAnLi9tYXAtaW5mby13aW5kb3cvbWFwLWluZm8td2luZG93JztcbmltcG9ydCB7TWFwS21sTGF5ZXJ9IGZyb20gJy4vbWFwLWttbC1sYXllci9tYXAta21sLWxheWVyJztcbmltcG9ydCB7TWFwTWFya2VyfSBmcm9tICcuL21hcC1tYXJrZXIvbWFwLW1hcmtlcic7XG5pbXBvcnQge01hcE1hcmtlckNsdXN0ZXJlcn0gZnJvbSAnLi9tYXAtbWFya2VyLWNsdXN0ZXJlci9tYXAtbWFya2VyLWNsdXN0ZXJlcic7XG5pbXBvcnQge01hcFBvbHlnb259IGZyb20gJy4vbWFwLXBvbHlnb24vbWFwLXBvbHlnb24nO1xuaW1wb3J0IHtNYXBQb2x5bGluZX0gZnJvbSAnLi9tYXAtcG9seWxpbmUvbWFwLXBvbHlsaW5lJztcbmltcG9ydCB7TWFwUmVjdGFuZ2xlfSBmcm9tICcuL21hcC1yZWN0YW5nbGUvbWFwLXJlY3RhbmdsZSc7XG5pbXBvcnQge01hcFRyYWZmaWNMYXllcn0gZnJvbSAnLi9tYXAtdHJhZmZpYy1sYXllci9tYXAtdHJhZmZpYy1sYXllcic7XG5pbXBvcnQge01hcFRyYW5zaXRMYXllcn0gZnJvbSAnLi9tYXAtdHJhbnNpdC1sYXllci9tYXAtdHJhbnNpdC1sYXllcic7XG5pbXBvcnQge01hcEhlYXRtYXBMYXllcn0gZnJvbSAnLi9tYXAtaGVhdG1hcC1sYXllci9tYXAtaGVhdG1hcC1sYXllcic7XG5cbmNvbnN0IENPTVBPTkVOVFMgPSBbXG4gIEdvb2dsZU1hcCxcbiAgTWFwQmFzZUxheWVyLFxuICBNYXBCaWN5Y2xpbmdMYXllcixcbiAgTWFwQ2lyY2xlLFxuICBNYXBEaXJlY3Rpb25zUmVuZGVyZXIsXG4gIE1hcEdyb3VuZE92ZXJsYXksXG4gIE1hcEluZm9XaW5kb3csXG4gIE1hcEttbExheWVyLFxuICBNYXBNYXJrZXIsXG4gIE1hcE1hcmtlckNsdXN0ZXJlcixcbiAgTWFwUG9seWdvbixcbiAgTWFwUG9seWxpbmUsXG4gIE1hcFJlY3RhbmdsZSxcbiAgTWFwVHJhZmZpY0xheWVyLFxuICBNYXBUcmFuc2l0TGF5ZXIsXG4gIE1hcEhlYXRtYXBMYXllcixcbl07XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogQ09NUE9ORU5UUyxcbiAgZXhwb3J0czogQ09NUE9ORU5UUyxcbn0pXG5leHBvcnQgY2xhc3MgR29vZ2xlTWFwc01vZHVsZSB7fVxuIl19