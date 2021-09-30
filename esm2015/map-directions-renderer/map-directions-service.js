/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="google.maps" />
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Angular service that wraps the Google Maps DirectionsService from the Google Maps JavaScript
 * API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/directions#DirectionsService
 */
export class MapDirectionsService {
    constructor(_ngZone) {
        this._ngZone = _ngZone;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsService.route
     */
    route(request) {
        return new Observable(observer => {
            // Initialize the `DirectionsService` lazily since the Google Maps API may
            // not have been loaded when the provider is instantiated.
            if (!this._directionsService) {
                this._directionsService = new google.maps.DirectionsService();
            }
            this._directionsService.route(request, (result, status) => {
                this._ngZone.run(() => {
                    observer.next({ result: result || undefined, status });
                    observer.complete();
                });
            });
        });
    }
}
MapDirectionsService.ɵprov = i0.ɵɵdefineInjectable({ factory: function MapDirectionsService_Factory() { return new MapDirectionsService(i0.ɵɵinject(i0.NgZone)); }, token: MapDirectionsService, providedIn: "root" });
MapDirectionsService.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
MapDirectionsService.ctorParameters = () => [
    { type: NgZone }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWRpcmVjdGlvbnMtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtZGlyZWN0aW9ucy1yZW5kZXJlci9tYXAtZGlyZWN0aW9ucy1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFPaEM7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sb0JBQW9CO0lBRy9CLFlBQTZCLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO0lBQUcsQ0FBQztJQUVoRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLE9BQXNDO1FBQzFDLE9BQU8sSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDL0IsMEVBQTBFO1lBQzFFLDBEQUEwRDtZQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO2dCQUM1QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7YUFDL0Q7WUFFRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO29CQUNwQixRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLE1BQU0sSUFBSSxTQUFTLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztvQkFDckQsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN0QixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzs7O1lBMUJGLFVBQVUsU0FBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7OztZQWRaLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7SW5qZWN0YWJsZSwgTmdab25lfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFwRGlyZWN0aW9uc1Jlc3BvbnNlIHtcbiAgc3RhdHVzOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzO1xuICByZXN1bHQ/OiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVzdWx0O1xufVxuXG4vKipcbiAqIEFuZ3VsYXIgc2VydmljZSB0aGF0IHdyYXBzIHRoZSBHb29nbGUgTWFwcyBEaXJlY3Rpb25zU2VydmljZSBmcm9tIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0XG4gKiBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZGlyZWN0aW9ucyNEaXJlY3Rpb25zU2VydmljZVxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNYXBEaXJlY3Rpb25zU2VydmljZSB7XG4gIHByaXZhdGUgX2RpcmVjdGlvbnNTZXJ2aWNlOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZXx1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2RpcmVjdGlvbnNcbiAgICogI0RpcmVjdGlvbnNTZXJ2aWNlLnJvdXRlXG4gICAqL1xuICByb3V0ZShyZXF1ZXN0OiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVxdWVzdCk6IE9ic2VydmFibGU8TWFwRGlyZWN0aW9uc1Jlc3BvbnNlPiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIC8vIEluaXRpYWxpemUgdGhlIGBEaXJlY3Rpb25zU2VydmljZWAgbGF6aWx5IHNpbmNlIHRoZSBHb29nbGUgTWFwcyBBUEkgbWF5XG4gICAgICAvLyBub3QgaGF2ZSBiZWVuIGxvYWRlZCB3aGVuIHRoZSBwcm92aWRlciBpcyBpbnN0YW50aWF0ZWQuXG4gICAgICBpZiAoIXRoaXMuX2RpcmVjdGlvbnNTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbnNTZXJ2aWNlID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTZXJ2aWNlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2RpcmVjdGlvbnNTZXJ2aWNlLnJvdXRlKHJlcXVlc3QsIChyZXN1bHQsIHN0YXR1cykgPT4ge1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHtyZXN1bHQ6IHJlc3VsdCB8fCB1bmRlZmluZWQsIHN0YXR1c30pO1xuICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==