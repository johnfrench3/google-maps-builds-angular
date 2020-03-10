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
var COMPONENTS = [
    GoogleMap,
    MapInfoWindow,
    MapMarker,
    MapPolyline,
    MapPolygon,
    MapRectangle,
];
var GoogleMapsModule = /** @class */ (function () {
    function GoogleMapsModule() {
    }
    GoogleMapsModule.decorators = [
        { type: NgModule, args: [{
                    declarations: COMPONENTS,
                    exports: COMPONENTS,
                },] }
    ];
    return GoogleMapsModule;
}());
export { GoogleMapsModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcHMtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL2dvb2dsZS1tYXBzLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFDaEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2xELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDeEQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBRTNELElBQU0sVUFBVSxHQUFHO0lBQ2pCLFNBQVM7SUFDVCxhQUFhO0lBQ2IsU0FBUztJQUNULFdBQVc7SUFDWCxVQUFVO0lBQ1YsWUFBWTtDQUNiLENBQUM7QUFFRjtJQUFBO0lBS0EsQ0FBQzs7Z0JBTEEsUUFBUSxTQUFDO29CQUNSLFlBQVksRUFBRSxVQUFVO29CQUN4QixPQUFPLEVBQUUsVUFBVTtpQkFDcEI7O0lBRUQsdUJBQUM7Q0FBQSxBQUxELElBS0M7U0FEWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEluZm9XaW5kb3d9IGZyb20gJy4vbWFwLWluZm8td2luZG93L21hcC1pbmZvLXdpbmRvdyc7XG5pbXBvcnQge01hcE1hcmtlcn0gZnJvbSAnLi9tYXAtbWFya2VyL21hcC1tYXJrZXInO1xuaW1wb3J0IHtNYXBQb2x5Z29ufSBmcm9tICcuL21hcC1wb2x5Z29uL21hcC1wb2x5Z29uJztcbmltcG9ydCB7TWFwUG9seWxpbmV9IGZyb20gJy4vbWFwLXBvbHlsaW5lL21hcC1wb2x5bGluZSc7XG5pbXBvcnQge01hcFJlY3RhbmdsZX0gZnJvbSAnLi9tYXAtcmVjdGFuZ2xlL21hcC1yZWN0YW5nbGUnO1xuXG5jb25zdCBDT01QT05FTlRTID0gW1xuICBHb29nbGVNYXAsXG4gIE1hcEluZm9XaW5kb3csXG4gIE1hcE1hcmtlcixcbiAgTWFwUG9seWxpbmUsXG4gIE1hcFBvbHlnb24sXG4gIE1hcFJlY3RhbmdsZSxcbl07XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogQ09NUE9ORU5UUyxcbiAgZXhwb3J0czogQ09NUE9ORU5UUyxcbn0pXG5leHBvcnQgY2xhc3MgR29vZ2xlTWFwc01vZHVsZSB7XG59XG4iXX0=