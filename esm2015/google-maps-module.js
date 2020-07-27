/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { GoogleMap } from './google-map/google-map';
import { MapCircle } from './map-circle/map-circle';
import { MapGroundOverlay } from './map-ground-overlay/map-ground-overlay';
import { MapInfoWindow } from './map-info-window/map-info-window';
import { MapKmlLayer } from './map-kml-layer/map-kml-layer';
import { MapMarker } from './map-marker/map-marker';
import { MapPolygon } from './map-polygon/map-polygon';
import { MapPolyline } from './map-polyline/map-polyline';
import { MapRectangle } from './map-rectangle/map-rectangle';
const COMPONENTS = [
    GoogleMap,
    MapCircle,
    MapGroundOverlay,
    MapInfoWindow,
    MapKmlLayer,
    MapMarker,
    MapPolygon,
    MapPolyline,
    MapRectangle,
];
export class GoogleMapsModule {
}
GoogleMapsModule.decorators = [
    { type: NgModule, args: [{
                declarations: COMPONENTS,
                exports: COMPONENTS,
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcHMtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL2dvb2dsZS1tYXBzLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0seUNBQXlDLENBQUM7QUFDekUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ2hFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUN4RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFFM0QsTUFBTSxVQUFVLEdBQUc7SUFDakIsU0FBUztJQUNULFNBQVM7SUFDVCxnQkFBZ0I7SUFDaEIsYUFBYTtJQUNiLFdBQVc7SUFDWCxTQUFTO0lBQ1QsVUFBVTtJQUNWLFdBQVc7SUFDWCxZQUFZO0NBQ2IsQ0FBQztBQU1GLE1BQU0sT0FBTyxnQkFBZ0I7OztZQUo1QixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLFVBQVU7Z0JBQ3hCLE9BQU8sRUFBRSxVQUFVO2FBQ3BCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBDaXJjbGV9IGZyb20gJy4vbWFwLWNpcmNsZS9tYXAtY2lyY2xlJztcbmltcG9ydCB7TWFwR3JvdW5kT3ZlcmxheX0gZnJvbSAnLi9tYXAtZ3JvdW5kLW92ZXJsYXkvbWFwLWdyb3VuZC1vdmVybGF5JztcbmltcG9ydCB7TWFwSW5mb1dpbmRvd30gZnJvbSAnLi9tYXAtaW5mby13aW5kb3cvbWFwLWluZm8td2luZG93JztcbmltcG9ydCB7TWFwS21sTGF5ZXJ9IGZyb20gJy4vbWFwLWttbC1sYXllci9tYXAta21sLWxheWVyJztcbmltcG9ydCB7TWFwTWFya2VyfSBmcm9tICcuL21hcC1tYXJrZXIvbWFwLW1hcmtlcic7XG5pbXBvcnQge01hcFBvbHlnb259IGZyb20gJy4vbWFwLXBvbHlnb24vbWFwLXBvbHlnb24nO1xuaW1wb3J0IHtNYXBQb2x5bGluZX0gZnJvbSAnLi9tYXAtcG9seWxpbmUvbWFwLXBvbHlsaW5lJztcbmltcG9ydCB7TWFwUmVjdGFuZ2xlfSBmcm9tICcuL21hcC1yZWN0YW5nbGUvbWFwLXJlY3RhbmdsZSc7XG5cbmNvbnN0IENPTVBPTkVOVFMgPSBbXG4gIEdvb2dsZU1hcCxcbiAgTWFwQ2lyY2xlLFxuICBNYXBHcm91bmRPdmVybGF5LFxuICBNYXBJbmZvV2luZG93LFxuICBNYXBLbWxMYXllcixcbiAgTWFwTWFya2VyLFxuICBNYXBQb2x5Z29uLFxuICBNYXBQb2x5bGluZSxcbiAgTWFwUmVjdGFuZ2xlLFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBDT01QT05FTlRTLFxuICBleHBvcnRzOiBDT01QT05FTlRTLFxufSlcbmV4cG9ydCBjbGFzcyBHb29nbGVNYXBzTW9kdWxlIHtcbn1cbiJdfQ==