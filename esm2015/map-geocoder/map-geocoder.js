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
 * Angular service that wraps the Google Maps Geocoder from the Google Maps JavaScript API.
 * See developers.google.com/maps/documentation/javascript/reference/geocoder#Geocoder
 */
export class MapGeocoder {
    constructor(_ngZone) {
        this._ngZone = _ngZone;
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/geocoder#Geocoder.geocode
     */
    geocode(request) {
        return new Observable(observer => {
            // Initialize the `Geocoder` lazily since the Google Maps API may
            // not have been loaded when the provider is instantiated.
            if (!this._geocoder) {
                this._geocoder = new google.maps.Geocoder();
            }
            this._geocoder.geocode(request, (results, status) => {
                this._ngZone.run(() => {
                    observer.next({ results, status });
                    observer.complete();
                });
            });
        });
    }
}
MapGeocoder.ɵprov = i0.ɵɵdefineInjectable({ factory: function MapGeocoder_Factory() { return new MapGeocoder(i0.ɵɵinject(i0.NgZone)); }, token: MapGeocoder, providedIn: "root" });
MapGeocoder.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
MapGeocoder.ctorParameters = () => [
    { type: NgZone }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWdlb2NvZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1nZW9jb2Rlci9tYXAtZ2VvY29kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUVwQyxPQUFPLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNqRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQU9oQzs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sV0FBVztJQUd0QixZQUE2QixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtJQUFHLENBQUM7SUFFaEQ7O09BRUc7SUFDSCxPQUFPLENBQUMsT0FBb0M7UUFDMUMsT0FBTyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMvQixpRUFBaUU7WUFDakUsMERBQTBEO1lBQzFELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUM3QztZQUVELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO29CQUNwQixRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7b0JBQ2pDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7OztZQXhCRixVQUFVLFNBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzs7WUFaWixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG5cbmltcG9ydCB7SW5qZWN0YWJsZSwgTmdab25lfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFwR2VvY29kZXJSZXNwb25zZSB7XG4gIHN0YXR1czogZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXM7XG4gIHJlc3VsdHM6IGdvb2dsZS5tYXBzLkdlb2NvZGVyUmVzdWx0W107XG59XG5cbi8qKlxuICogQW5ndWxhciBzZXJ2aWNlIHRoYXQgd3JhcHMgdGhlIEdvb2dsZSBNYXBzIEdlb2NvZGVyIGZyb20gdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZ2VvY29kZXIjR2VvY29kZXJcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWFwR2VvY29kZXIge1xuICBwcml2YXRlIF9nZW9jb2RlcjogZ29vZ2xlLm1hcHMuR2VvY29kZXJ8dW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9nZW9jb2RlciNHZW9jb2Rlci5nZW9jb2RlXG4gICAqL1xuICBnZW9jb2RlKHJlcXVlc3Q6IGdvb2dsZS5tYXBzLkdlb2NvZGVyUmVxdWVzdCk6IE9ic2VydmFibGU8TWFwR2VvY29kZXJSZXNwb25zZT4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICAvLyBJbml0aWFsaXplIHRoZSBgR2VvY29kZXJgIGxhemlseSBzaW5jZSB0aGUgR29vZ2xlIE1hcHMgQVBJIG1heVxuICAgICAgLy8gbm90IGhhdmUgYmVlbiBsb2FkZWQgd2hlbiB0aGUgcHJvdmlkZXIgaXMgaW5zdGFudGlhdGVkLlxuICAgICAgaWYgKCF0aGlzLl9nZW9jb2Rlcikge1xuICAgICAgICB0aGlzLl9nZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9nZW9jb2Rlci5nZW9jb2RlKHJlcXVlc3QsIChyZXN1bHRzLCBzdGF0dXMpID0+IHtcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7cmVzdWx0cywgc3RhdHVzfSk7XG4gICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19