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
let GoogleMapsModule = /** @class */ (() => {
    class GoogleMapsModule {
    }
    GoogleMapsModule.decorators = [
        { type: NgModule, args: [{
                    declarations: COMPONENTS,
                    exports: COMPONENTS,
                },] }
    ];
    return GoogleMapsModule;
})();
export { GoogleMapsModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcHMtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL2dvb2dsZS1tYXBzLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0seUNBQXlDLENBQUM7QUFDekUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ2hFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDckQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ3hELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUUzRCxNQUFNLFVBQVUsR0FBRztJQUNqQixTQUFTO0lBQ1QsU0FBUztJQUNULGdCQUFnQjtJQUNoQixhQUFhO0lBQ2IsU0FBUztJQUNULFVBQVU7SUFDVixXQUFXO0lBQ1gsWUFBWTtDQUNiLENBQUM7QUFFRjtJQUFBLE1BSWEsZ0JBQWdCOzs7Z0JBSjVCLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUUsVUFBVTtvQkFDeEIsT0FBTyxFQUFFLFVBQVU7aUJBQ3BCOztJQUVELHVCQUFDO0tBQUE7U0FEWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcENpcmNsZX0gZnJvbSAnLi9tYXAtY2lyY2xlL21hcC1jaXJjbGUnO1xuaW1wb3J0IHtNYXBHcm91bmRPdmVybGF5fSBmcm9tICcuL21hcC1ncm91bmQtb3ZlcmxheS9tYXAtZ3JvdW5kLW92ZXJsYXknO1xuaW1wb3J0IHtNYXBJbmZvV2luZG93fSBmcm9tICcuL21hcC1pbmZvLXdpbmRvdy9tYXAtaW5mby13aW5kb3cnO1xuaW1wb3J0IHtNYXBNYXJrZXJ9IGZyb20gJy4vbWFwLW1hcmtlci9tYXAtbWFya2VyJztcbmltcG9ydCB7TWFwUG9seWdvbn0gZnJvbSAnLi9tYXAtcG9seWdvbi9tYXAtcG9seWdvbic7XG5pbXBvcnQge01hcFBvbHlsaW5lfSBmcm9tICcuL21hcC1wb2x5bGluZS9tYXAtcG9seWxpbmUnO1xuaW1wb3J0IHtNYXBSZWN0YW5nbGV9IGZyb20gJy4vbWFwLXJlY3RhbmdsZS9tYXAtcmVjdGFuZ2xlJztcblxuY29uc3QgQ09NUE9ORU5UUyA9IFtcbiAgR29vZ2xlTWFwLFxuICBNYXBDaXJjbGUsXG4gIE1hcEdyb3VuZE92ZXJsYXksXG4gIE1hcEluZm9XaW5kb3csXG4gIE1hcE1hcmtlcixcbiAgTWFwUG9seWdvbixcbiAgTWFwUG9seWxpbmUsXG4gIE1hcFJlY3RhbmdsZSxcbl07XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogQ09NUE9ORU5UUyxcbiAgZXhwb3J0czogQ09NUE9ORU5UUyxcbn0pXG5leHBvcnQgY2xhc3MgR29vZ2xlTWFwc01vZHVsZSB7XG59XG4iXX0=