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
import { MapMarker } from './map-marker/map-marker';
import { MapPolygon } from './map-polygon/map-polygon';
import { MapPolyline } from './map-polyline/map-polyline';
import { MapRectangle } from './map-rectangle/map-rectangle';
const COMPONENTS = [
    GoogleMap,
    MapCircle,
    MapGroundOverlay,
    MapInfoWindow,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcHMtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL2dvb2dsZS1tYXBzLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0seUNBQXlDLENBQUM7QUFDekUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ2hFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDckQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ3hELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUUzRCxNQUFNLFVBQVUsR0FBRztJQUNqQixTQUFTO0lBQ1QsU0FBUztJQUNULGdCQUFnQjtJQUNoQixhQUFhO0lBQ2IsU0FBUztJQUNULFVBQVU7SUFDVixXQUFXO0lBQ1gsWUFBWTtDQUNiLENBQUM7QUFNRixNQUFNLE9BQU8sZ0JBQWdCOzs7WUFKNUIsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxVQUFVO2dCQUN4QixPQUFPLEVBQUUsVUFBVTthQUNwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwQ2lyY2xlfSBmcm9tICcuL21hcC1jaXJjbGUvbWFwLWNpcmNsZSc7XG5pbXBvcnQge01hcEdyb3VuZE92ZXJsYXl9IGZyb20gJy4vbWFwLWdyb3VuZC1vdmVybGF5L21hcC1ncm91bmQtb3ZlcmxheSc7XG5pbXBvcnQge01hcEluZm9XaW5kb3d9IGZyb20gJy4vbWFwLWluZm8td2luZG93L21hcC1pbmZvLXdpbmRvdyc7XG5pbXBvcnQge01hcE1hcmtlcn0gZnJvbSAnLi9tYXAtbWFya2VyL21hcC1tYXJrZXInO1xuaW1wb3J0IHtNYXBQb2x5Z29ufSBmcm9tICcuL21hcC1wb2x5Z29uL21hcC1wb2x5Z29uJztcbmltcG9ydCB7TWFwUG9seWxpbmV9IGZyb20gJy4vbWFwLXBvbHlsaW5lL21hcC1wb2x5bGluZSc7XG5pbXBvcnQge01hcFJlY3RhbmdsZX0gZnJvbSAnLi9tYXAtcmVjdGFuZ2xlL21hcC1yZWN0YW5nbGUnO1xuXG5jb25zdCBDT01QT05FTlRTID0gW1xuICBHb29nbGVNYXAsXG4gIE1hcENpcmNsZSxcbiAgTWFwR3JvdW5kT3ZlcmxheSxcbiAgTWFwSW5mb1dpbmRvdyxcbiAgTWFwTWFya2VyLFxuICBNYXBQb2x5Z29uLFxuICBNYXBQb2x5bGluZSxcbiAgTWFwUmVjdGFuZ2xlLFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBDT01QT05FTlRTLFxuICBleHBvcnRzOiBDT01QT05FTlRTLFxufSlcbmV4cG9ydCBjbGFzcyBHb29nbGVNYXBzTW9kdWxlIHtcbn1cbiJdfQ==