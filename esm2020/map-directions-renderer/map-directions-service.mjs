/// <reference types="google.maps" />
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
MapDirectionsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MapDirectionsService, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
MapDirectionsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MapDirectionsService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MapDirectionsService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWRpcmVjdGlvbnMtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtZGlyZWN0aW9ucy1yZW5kZXJlci9tYXAtZGlyZWN0aW9ucy1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLHFDQUFxQztBQVRyQzs7Ozs7O0dBTUc7QUFFSCx5RUFBeUU7QUFDekUscUNBQXFDO0FBRXJDLE9BQU8sRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2pELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7O0FBT2hDOzs7OztHQUtHO0FBRUgsTUFBTSxPQUFPLG9CQUFvQjtJQUcvQixZQUE2QixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtJQUFHLENBQUM7SUFFaEQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxPQUFzQztRQUMxQyxPQUFPLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQy9CLDBFQUEwRTtZQUMxRSwwREFBMEQ7WUFDMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2FBQy9EO1lBRUQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQ3hELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtvQkFDcEIsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7b0JBQ3JELFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7eUhBekJVLG9CQUFvQjs2SEFBcEIsb0JBQW9CLGNBRFIsTUFBTTttR0FDbEIsb0JBQW9CO2tCQURoQyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgLz5cblxuaW1wb3J0IHtJbmplY3RhYmxlLCBOZ1pvbmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGludGVyZmFjZSBNYXBEaXJlY3Rpb25zUmVzcG9uc2Uge1xuICBzdGF0dXM6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTdGF0dXM7XG4gIHJlc3VsdD86IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZXN1bHQ7XG59XG5cbi8qKlxuICogQW5ndWxhciBzZXJ2aWNlIHRoYXQgd3JhcHMgdGhlIEdvb2dsZSBNYXBzIERpcmVjdGlvbnNTZXJ2aWNlIGZyb20gdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHRcbiAqIEFQSS5cbiAqXG4gKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9kaXJlY3Rpb25zI0RpcmVjdGlvbnNTZXJ2aWNlXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE1hcERpcmVjdGlvbnNTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfZGlyZWN0aW9uc1NlcnZpY2U6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTZXJ2aWNlfHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZGlyZWN0aW9uc1xuICAgKiAjRGlyZWN0aW9uc1NlcnZpY2Uucm91dGVcbiAgICovXG4gIHJvdXRlKHJlcXVlc3Q6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZXF1ZXN0KTogT2JzZXJ2YWJsZTxNYXBEaXJlY3Rpb25zUmVzcG9uc2U+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgYERpcmVjdGlvbnNTZXJ2aWNlYCBsYXppbHkgc2luY2UgdGhlIEdvb2dsZSBNYXBzIEFQSSBtYXlcbiAgICAgIC8vIG5vdCBoYXZlIGJlZW4gbG9hZGVkIHdoZW4gdGhlIHByb3ZpZGVyIGlzIGluc3RhbnRpYXRlZC5cbiAgICAgIGlmICghdGhpcy5fZGlyZWN0aW9uc1NlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uc1NlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fZGlyZWN0aW9uc1NlcnZpY2Uucm91dGUocmVxdWVzdCwgKHJlc3VsdCwgc3RhdHVzKSA9PiB7XG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIG9ic2VydmVyLm5leHQoe3Jlc3VsdDogcmVzdWx0IHx8IHVuZGVmaW5lZCwgc3RhdHVzfSk7XG4gICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19