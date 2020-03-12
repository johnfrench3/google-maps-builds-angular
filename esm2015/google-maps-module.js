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
import { MapCircle } from './map-circle/map-circle';
import { MapInfoWindow } from './map-info-window/map-info-window';
import { MapMarker } from './map-marker/map-marker';
import { MapPolygon } from './map-polygon/map-polygon';
import { MapPolyline } from './map-polyline/map-polyline';
import { MapRectangle } from './map-rectangle/map-rectangle';
/** @type {?} */
const COMPONENTS = [
    GoogleMap,
    MapCircle,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcHMtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL2dvb2dsZS1tYXBzLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ2hFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDckQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ3hELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQzs7TUFFckQsVUFBVSxHQUFHO0lBQ2pCLFNBQVM7SUFDVCxTQUFTO0lBQ1QsYUFBYTtJQUNiLFNBQVM7SUFDVCxVQUFVO0lBQ1YsV0FBVztJQUNYLFlBQVk7Q0FDYjtBQU1ELE1BQU0sT0FBTyxnQkFBZ0I7OztZQUo1QixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLFVBQVU7Z0JBQ3hCLE9BQU8sRUFBRSxVQUFVO2FBQ3BCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBDaXJjbGV9IGZyb20gJy4vbWFwLWNpcmNsZS9tYXAtY2lyY2xlJztcbmltcG9ydCB7TWFwSW5mb1dpbmRvd30gZnJvbSAnLi9tYXAtaW5mby13aW5kb3cvbWFwLWluZm8td2luZG93JztcbmltcG9ydCB7TWFwTWFya2VyfSBmcm9tICcuL21hcC1tYXJrZXIvbWFwLW1hcmtlcic7XG5pbXBvcnQge01hcFBvbHlnb259IGZyb20gJy4vbWFwLXBvbHlnb24vbWFwLXBvbHlnb24nO1xuaW1wb3J0IHtNYXBQb2x5bGluZX0gZnJvbSAnLi9tYXAtcG9seWxpbmUvbWFwLXBvbHlsaW5lJztcbmltcG9ydCB7TWFwUmVjdGFuZ2xlfSBmcm9tICcuL21hcC1yZWN0YW5nbGUvbWFwLXJlY3RhbmdsZSc7XG5cbmNvbnN0IENPTVBPTkVOVFMgPSBbXG4gIEdvb2dsZU1hcCxcbiAgTWFwQ2lyY2xlLFxuICBNYXBJbmZvV2luZG93LFxuICBNYXBNYXJrZXIsXG4gIE1hcFBvbHlnb24sXG4gIE1hcFBvbHlsaW5lLFxuICBNYXBSZWN0YW5nbGUsXG5dO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IENPTVBPTkVOVFMsXG4gIGV4cG9ydHM6IENPTVBPTkVOVFMsXG59KVxuZXhwb3J0IGNsYXNzIEdvb2dsZU1hcHNNb2R1bGUge1xufVxuIl19