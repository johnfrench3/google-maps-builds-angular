/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/google-maps-module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { GoogleMap } from './google-map/google-map';
import { MapInfoWindow } from './map-info-window/map-info-window';
import { MapMarker } from './map-marker/map-marker';
import { MapPolygon } from './map-polygon/map-polygon';
import { MapPolyline } from './map-polyline/map-polyline';
import { MapRectangle } from './map-rectangle/map-rectangle';
/** @type {?} */
const COMPONENTS = [
    GoogleMap,
    MapInfoWindow,
    MapMarker,
    MapPolyline,
    MapPolygon,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcHMtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL2dvb2dsZS1tYXBzLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFDaEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2xELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDeEQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLCtCQUErQixDQUFDOztNQUVyRCxVQUFVLEdBQUc7SUFDakIsU0FBUztJQUNULGFBQWE7SUFDYixTQUFTO0lBQ1QsV0FBVztJQUNYLFVBQVU7SUFDVixZQUFZO0NBQ2I7QUFNRCxNQUFNLE9BQU8sZ0JBQWdCOzs7WUFKNUIsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxVQUFVO2dCQUN4QixPQUFPLEVBQUUsVUFBVTthQUNwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwSW5mb1dpbmRvd30gZnJvbSAnLi9tYXAtaW5mby13aW5kb3cvbWFwLWluZm8td2luZG93JztcbmltcG9ydCB7TWFwTWFya2VyfSBmcm9tICcuL21hcC1tYXJrZXIvbWFwLW1hcmtlcic7XG5pbXBvcnQge01hcFBvbHlnb259IGZyb20gJy4vbWFwLXBvbHlnb24vbWFwLXBvbHlnb24nO1xuaW1wb3J0IHtNYXBQb2x5bGluZX0gZnJvbSAnLi9tYXAtcG9seWxpbmUvbWFwLXBvbHlsaW5lJztcbmltcG9ydCB7TWFwUmVjdGFuZ2xlfSBmcm9tICcuL21hcC1yZWN0YW5nbGUvbWFwLXJlY3RhbmdsZSc7XG5cbmNvbnN0IENPTVBPTkVOVFMgPSBbXG4gIEdvb2dsZU1hcCxcbiAgTWFwSW5mb1dpbmRvdyxcbiAgTWFwTWFya2VyLFxuICBNYXBQb2x5bGluZSxcbiAgTWFwUG9seWdvbixcbiAgTWFwUmVjdGFuZ2xlLFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBDT01QT05FTlRTLFxuICBleHBvcnRzOiBDT01QT05FTlRTLFxufSlcbmV4cG9ydCBjbGFzcyBHb29nbGVNYXBzTW9kdWxlIHtcbn1cbiJdfQ==