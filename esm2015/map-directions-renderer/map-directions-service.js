/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
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
            const callback = (result, status) => {
                this._ngZone.run(() => {
                    observer.next({ result, status });
                    observer.complete();
                });
            };
            this._directionsService.route(request, callback);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWRpcmVjdGlvbnMtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtZGlyZWN0aW9ucy1yZW5kZXJlci9tYXAtZGlyZWN0aW9ucy1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxvQ0FBb0M7QUFFcEMsT0FBTyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFPaEM7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sb0JBQW9CO0lBRy9CLFlBQTZCLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO0lBQUcsQ0FBQztJQUVoRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLE9BQXNDO1FBQzFDLE9BQU8sSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDL0IsMEVBQTBFO1lBQzFFLDBEQUEwRDtZQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO2dCQUM1QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7YUFDL0Q7WUFFRCxNQUFNLFFBQVEsR0FDVixDQUNFLE1BQThDLEVBQzlDLE1BQW9DLEVBQ3BDLEVBQUU7Z0JBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO29CQUNwQixRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7b0JBQ2hDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUM7WUFDRixJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Ozs7WUEvQkYsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7O1lBZFosTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZW1hcHNcIiAvPlxuXG5pbXBvcnQge0luamVjdGFibGUsIE5nWm9uZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1hcERpcmVjdGlvbnNSZXNwb25zZSB7XG4gIHN0YXR1czogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cztcbiAgcmVzdWx0PzogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1Jlc3VsdDtcbn1cblxuLyoqXG4gKiBBbmd1bGFyIHNlcnZpY2UgdGhhdCB3cmFwcyB0aGUgR29vZ2xlIE1hcHMgRGlyZWN0aW9uc1NlcnZpY2UgZnJvbSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdFxuICogQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2RpcmVjdGlvbnMjRGlyZWN0aW9uc1NlcnZpY2VcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWFwRGlyZWN0aW9uc1NlcnZpY2Uge1xuICBwcml2YXRlIF9kaXJlY3Rpb25zU2VydmljZTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2V8dW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9kaXJlY3Rpb25zXG4gICAqICNEaXJlY3Rpb25zU2VydmljZS5yb3V0ZVxuICAgKi9cbiAgcm91dGUocmVxdWVzdDogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlcXVlc3QpOiBPYnNlcnZhYmxlPE1hcERpcmVjdGlvbnNSZXNwb25zZT4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICAvLyBJbml0aWFsaXplIHRoZSBgRGlyZWN0aW9uc1NlcnZpY2VgIGxhemlseSBzaW5jZSB0aGUgR29vZ2xlIE1hcHMgQVBJIG1heVxuICAgICAgLy8gbm90IGhhdmUgYmVlbiBsb2FkZWQgd2hlbiB0aGUgcHJvdmlkZXIgaXMgaW5zdGFudGlhdGVkLlxuICAgICAgaWYgKCF0aGlzLl9kaXJlY3Rpb25zU2VydmljZSkge1xuICAgICAgICB0aGlzLl9kaXJlY3Rpb25zU2VydmljZSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZSgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjYWxsYmFjayA9XG4gICAgICAgICAgKFxuICAgICAgICAgICAgcmVzdWx0OiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVzdWx0fHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHN0YXR1czogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1c1xuICAgICAgICAgICkgPT4ge1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHtyZXN1bHQsIHN0YXR1c30pO1xuICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHRoaXMuX2RpcmVjdGlvbnNTZXJ2aWNlLnJvdXRlKHJlcXVlc3QsIGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfVxufVxuIl19