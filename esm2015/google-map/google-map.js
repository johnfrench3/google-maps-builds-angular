/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
import { ChangeDetectionStrategy, Component, ElementRef, Input, Output, ViewEncapsulation, Inject, PLATFORM_ID, NgZone, } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, shareReplay, take, takeUntil } from 'rxjs/operators';
import { MapEventManager } from '../map-event-manager';
/** default options set to the Googleplex */
export const DEFAULT_OPTIONS = {
    center: { lat: 37.421995, lng: -122.084092 },
    zoom: 17
};
/** Arbitrary default height for the map element */
export const DEFAULT_HEIGHT = '500px';
/** Arbitrary default width for the map element */
export const DEFAULT_WIDTH = '500px';
/**
 * Angular component that renders a Google Map via the Google Maps JavaScript
 * API.
 * @see https://developers.google.com/maps/documentation/javascript/reference/
 */
export class GoogleMap {
    constructor(_elementRef, _ngZone, platformId) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(this._ngZone);
        this._options = new BehaviorSubject(DEFAULT_OPTIONS);
        this._center = new BehaviorSubject(undefined);
        this._zoom = new BehaviorSubject(undefined);
        this._destroy = new Subject();
        /** Height of the map. Set this to `null` if you'd like to control the height through CSS. */
        this.height = DEFAULT_HEIGHT;
        /** Width of the map. Set this to `null` if you'd like to control the width through CSS. */
        this.width = DEFAULT_WIDTH;
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.bounds_changed
         */
        this.boundsChanged = this._eventManager.getLazyEmitter('bounds_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.center_changed
         */
        this.centerChanged = this._eventManager.getLazyEmitter('center_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.click
         */
        this.mapClick = this._eventManager
            .getLazyEmitter('click');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dblclick
         */
        this.mapDblclick = this._eventManager.getLazyEmitter('dblclick');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.drag
         */
        this.mapDrag = this._eventManager.getLazyEmitter('drag');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragend
         */
        this.mapDragend = this._eventManager.getLazyEmitter('dragend');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragstart
         */
        this.mapDragstart = this._eventManager.getLazyEmitter('dragstart');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.heading_changed
         */
        this.headingChanged = this._eventManager.getLazyEmitter('heading_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.idle
         */
        this.idle = this._eventManager.getLazyEmitter('idle');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.maptypeid_changed
         */
        this.maptypeidChanged = this._eventManager.getLazyEmitter('maptypeid_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mousemove
         */
        this.mapMousemove = this._eventManager.getLazyEmitter('mousemove');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseout
         */
        this.mapMouseout = this._eventManager.getLazyEmitter('mouseout');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseover
         */
        this.mapMouseover = this._eventManager.getLazyEmitter('mouseover');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/map#Map.projection_changed
         */
        this.projectionChanged = this._eventManager.getLazyEmitter('projection_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.rightclick
         */
        this.mapRightclick = this._eventManager.getLazyEmitter('rightclick');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilesloaded
         */
        this.tilesloaded = this._eventManager.getLazyEmitter('tilesloaded');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilt_changed
         */
        this.tiltChanged = this._eventManager.getLazyEmitter('tilt_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.zoom_changed
         */
        this.zoomChanged = this._eventManager.getLazyEmitter('zoom_changed');
        this._isBrowser = isPlatformBrowser(platformId);
        if (this._isBrowser) {
            const googleMapsWindow = window;
            if (!googleMapsWindow.google && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('Namespace google not found, cannot construct embedded google ' +
                    'map. Please install the Google Maps JavaScript API: ' +
                    'https://developers.google.com/maps/documentation/javascript/' +
                    'tutorial#Loading_the_Maps_API');
            }
        }
    }
    set center(center) {
        this._center.next(center);
    }
    set zoom(zoom) {
        this._zoom.next(zoom);
    }
    set options(options) {
        this._options.next(options || DEFAULT_OPTIONS);
    }
    ngOnChanges() {
        this._setSize();
        if (this.googleMap && this.mapTypeId) {
            this.googleMap.setMapTypeId(this.mapTypeId);
        }
    }
    ngOnInit() {
        // It should be a noop during server-side rendering.
        if (this._isBrowser) {
            this._mapEl = this._elementRef.nativeElement.querySelector('.map-container');
            this._setSize();
            this._googleMapChanges = this._initializeMap(this._combineOptions());
            this._googleMapChanges.subscribe((googleMap) => {
                this.googleMap = googleMap;
                this._eventManager.setTarget(this.googleMap);
            });
            this._watchForOptionsChanges();
            this._watchForCenterChanges();
            this._watchForZoomChanges();
        }
    }
    ngOnDestroy() {
        this._eventManager.destroy();
        this._destroy.next();
        this._destroy.complete();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
     */
    fitBounds(bounds, padding) {
        this._assertInitialized();
        this.googleMap.fitBounds(bounds, padding);
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panBy
     */
    panBy(x, y) {
        this._assertInitialized();
        this.googleMap.panBy(x, y);
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panTo
     */
    panTo(latLng) {
        this._assertInitialized();
        this.googleMap.panTo(latLng);
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panToBounds
     */
    panToBounds(latLngBounds, padding) {
        this._assertInitialized();
        this.googleMap.panToBounds(latLngBounds, padding);
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getBounds
     */
    getBounds() {
        this._assertInitialized();
        return this.googleMap.getBounds() || null;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getCenter
     */
    getCenter() {
        this._assertInitialized();
        return this.googleMap.getCenter();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getClickableIcons
     */
    getClickableIcons() {
        this._assertInitialized();
        return this.googleMap.getClickableIcons();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getHeading
     */
    getHeading() {
        this._assertInitialized();
        return this.googleMap.getHeading();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getMapTypeId
     */
    getMapTypeId() {
        this._assertInitialized();
        return this.googleMap.getMapTypeId();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getProjection
     */
    getProjection() {
        this._assertInitialized();
        return this.googleMap.getProjection();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getStreetView
     */
    getStreetView() {
        this._assertInitialized();
        return this.googleMap.getStreetView();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getTilt
     */
    getTilt() {
        this._assertInitialized();
        return this.googleMap.getTilt();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getZoom
     */
    getZoom() {
        this._assertInitialized();
        return this.googleMap.getZoom();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.controls
     */
    get controls() {
        this._assertInitialized();
        return this.googleMap.controls;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.data
     */
    get data() {
        this._assertInitialized();
        return this.googleMap.data;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mapTypes
     */
    get mapTypes() {
        this._assertInitialized();
        return this.googleMap.mapTypes;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.overlayMapTypes
     */
    get overlayMapTypes() {
        this._assertInitialized();
        return this.googleMap.overlayMapTypes;
    }
    _setSize() {
        if (this._mapEl) {
            const styles = this._mapEl.style;
            styles.height =
                this.height === null ? '' : (coerceCssPixelValue(this.height) || DEFAULT_HEIGHT);
            styles.width = this.width === null ? '' : (coerceCssPixelValue(this.width) || DEFAULT_WIDTH);
        }
    }
    /** Combines the center and zoom and the other map options into a single object */
    _combineOptions() {
        return combineLatest([this._options, this._center, this._zoom])
            .pipe(map(([options, center, zoom]) => {
            var _a;
            const combinedOptions = Object.assign(Object.assign({}, options), { 
                // It's important that we set **some** kind of `center` and `zoom`, otherwise
                // Google Maps will render a blank rectangle which looks broken.
                center: center || options.center || DEFAULT_OPTIONS.center, zoom: (_a = zoom !== null && zoom !== void 0 ? zoom : options.zoom) !== null && _a !== void 0 ? _a : DEFAULT_OPTIONS.zoom, mapTypeId: this.mapTypeId });
            return combinedOptions;
        }));
    }
    _initializeMap(optionsChanges) {
        return optionsChanges.pipe(take(1), map(options => {
            // Create the object outside the zone so its events don't trigger change detection.
            // We'll bring it back in inside the `MapEventManager` only for the events that the
            // user has subscribed to.
            return this._ngZone.runOutsideAngular(() => new google.maps.Map(this._mapEl, options));
        }), shareReplay(1));
    }
    _watchForOptionsChanges() {
        combineLatest([this._googleMapChanges, this._options])
            .pipe(takeUntil(this._destroy))
            .subscribe(([googleMap, options]) => {
            googleMap.setOptions(options);
        });
    }
    _watchForCenterChanges() {
        combineLatest([this._googleMapChanges, this._center])
            .pipe(takeUntil(this._destroy))
            .subscribe(([googleMap, center]) => {
            if (center) {
                googleMap.setCenter(center);
            }
        });
    }
    _watchForZoomChanges() {
        combineLatest([this._googleMapChanges, this._zoom])
            .pipe(takeUntil(this._destroy))
            .subscribe(([googleMap, zoom]) => {
            if (zoom !== undefined) {
                googleMap.setZoom(zoom);
            }
        });
    }
    /** Asserts that the map has been initialized. */
    _assertInitialized() {
        if (!this.googleMap && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('Cannot access Google Map information before the API has been initialized. ' +
                'Please wait for the API to load before trying to interact with it.');
        }
    }
}
GoogleMap.decorators = [
    { type: Component, args: [{
                selector: 'google-map',
                exportAs: 'googleMap',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: '<div class="map-container"></div><ng-content></ng-content>',
                encapsulation: ViewEncapsulation.None
            },] }
];
GoogleMap.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
];
GoogleMap.propDecorators = {
    height: [{ type: Input }],
    width: [{ type: Input }],
    mapTypeId: [{ type: Input }],
    center: [{ type: Input }],
    zoom: [{ type: Input }],
    options: [{ type: Input }],
    boundsChanged: [{ type: Output }],
    centerChanged: [{ type: Output }],
    mapClick: [{ type: Output }],
    mapDblclick: [{ type: Output }],
    mapDrag: [{ type: Output }],
    mapDragend: [{ type: Output }],
    mapDragstart: [{ type: Output }],
    headingChanged: [{ type: Output }],
    idle: [{ type: Output }],
    maptypeidChanged: [{ type: Output }],
    mapMousemove: [{ type: Output }],
    mapMouseout: [{ type: Output }],
    mapMouseover: [{ type: Output }],
    projectionChanged: [{ type: Output }],
    mapRightclick: [{ type: Output }],
    tilesloaded: [{ type: Output }],
    tiltChanged: [{ type: Output }],
    zoomChanged: [{ type: Output }]
};
const cssUnitsPattern = /([A-Za-z%]+)$/;
/** Coerces a value to a CSS pixel value. */
function coerceCssPixelValue(value) {
    if (value == null) {
        return '';
    }
    return cssUnitsPattern.test(value) ? value : `${value}px`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9nb29nbGUtbWFwL2dvb2dsZS1tYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUVwQyxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUlMLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsTUFBTSxFQUNOLFdBQVcsRUFDWCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6RSxPQUFPLEVBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDakUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBTXJELDRDQUE0QztBQUM1QyxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQTJCO0lBQ3JELE1BQU0sRUFBRSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFDO0lBQzFDLElBQUksRUFBRSxFQUFFO0NBQ1QsQ0FBQztBQUVGLG1EQUFtRDtBQUNuRCxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDO0FBQ3RDLGtEQUFrRDtBQUNsRCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDO0FBRXJDOzs7O0dBSUc7QUFRSCxNQUFNLE9BQU8sU0FBUztJQTRLcEIsWUFDbUIsV0FBdUIsRUFDaEMsT0FBZSxFQUNGLFVBQWtCO1FBRnRCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FB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O0FBQzVELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGVtYXBzXCIgLz5cblxuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEluamVjdCxcbiAgUExBVEZPUk1fSUQsXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIHNoYXJlUmVwbGF5LCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5cbmludGVyZmFjZSBHb29nbGVNYXBzV2luZG93IGV4dGVuZHMgV2luZG93IHtcbiAgZ29vZ2xlPzogdHlwZW9mIGdvb2dsZTtcbn1cblxuLyoqIGRlZmF1bHQgb3B0aW9ucyBzZXQgdG8gdGhlIEdvb2dsZXBsZXggKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX09QVElPTlM6IGdvb2dsZS5tYXBzLk1hcE9wdGlvbnMgPSB7XG4gIGNlbnRlcjoge2xhdDogMzcuNDIxOTk1LCBsbmc6IC0xMjIuMDg0MDkyfSxcbiAgem9vbTogMTdcbn07XG5cbi8qKiBBcmJpdHJhcnkgZGVmYXVsdCBoZWlnaHQgZm9yIHRoZSBtYXAgZWxlbWVudCAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfSEVJR0hUID0gJzUwMHB4Jztcbi8qKiBBcmJpdHJhcnkgZGVmYXVsdCB3aWR0aCBmb3IgdGhlIG1hcCBlbGVtZW50ICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9XSURUSCA9ICc1MDBweCc7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcCB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHRcbiAqIEFQSS5cbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL1xuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdnb29nbGUtbWFwJyxcbiAgZXhwb3J0QXM6ICdnb29nbGVNYXAnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwibWFwLWNvbnRhaW5lclwiPjwvZGl2PjxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBHb29nbGVNYXAgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyOiBNYXBFdmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKHRoaXMuX25nWm9uZSk7XG4gIHByaXZhdGUgX2dvb2dsZU1hcENoYW5nZXM6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwPjtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9vcHRpb25zID0gbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5NYXBPcHRpb25zPihERUZBVUxUX09QVElPTlMpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9jZW50ZXIgPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsfGdvb2dsZS5tYXBzLkxhdExuZ3x1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3pvb20gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3kgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF9tYXBFbDogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLk1hcCBvYmplY3RcbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcFxuICAgKi9cbiAgZ29vZ2xlTWFwPzogZ29vZ2xlLm1hcHMuTWFwO1xuXG4gIC8qKiBXaGV0aGVyIHdlJ3JlIGN1cnJlbnRseSByZW5kZXJpbmcgaW5zaWRlIGEgYnJvd3Nlci4gKi9cbiAgX2lzQnJvd3NlcjogYm9vbGVhbjtcblxuICAvKiogSGVpZ2h0IG9mIHRoZSBtYXAuIFNldCB0aGlzIHRvIGBudWxsYCBpZiB5b3UnZCBsaWtlIHRvIGNvbnRyb2wgdGhlIGhlaWdodCB0aHJvdWdoIENTUy4gKi9cbiAgQElucHV0KCkgaGVpZ2h0OiBzdHJpbmcgfCBudW1iZXIgfCBudWxsID0gREVGQVVMVF9IRUlHSFQ7XG5cbiAgLyoqIFdpZHRoIG9mIHRoZSBtYXAuIFNldCB0aGlzIHRvIGBudWxsYCBpZiB5b3UnZCBsaWtlIHRvIGNvbnRyb2wgdGhlIHdpZHRoIHRocm91Z2ggQ1NTLiAqL1xuICBASW5wdXQoKSB3aWR0aDogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCA9IERFRkFVTFRfV0lEVEg7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgbWFwIHRoYXQgc2hvdWxkIGJlIHJlbmRlcmVkLiBFLmcuIGh5YnJpZCBtYXAsIHRlcnJhaW4gbWFwIGV0Yy5cbiAgICogU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcFR5cGVJZFxuICAgKi9cbiAgQElucHV0KCkgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQgfCB1bmRlZmluZWQ7XG5cbiAgQElucHV0KClcbiAgc2V0IGNlbnRlcihjZW50ZXI6IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWx8Z29vZ2xlLm1hcHMuTGF0TG5nKSB7XG4gICAgdGhpcy5fY2VudGVyLm5leHQoY2VudGVyKTtcbiAgfVxuICBASW5wdXQoKVxuICBzZXQgem9vbSh6b29tOiBudW1iZXIpIHtcbiAgICB0aGlzLl96b29tLm5leHQoem9vbSk7XG4gIH1cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogZ29vZ2xlLm1hcHMuTWFwT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMubmV4dChvcHRpb25zIHx8IERFRkFVTFRfT1BUSU9OUyk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmJvdW5kc19jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgYm91bmRzQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignYm91bmRzX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmNlbnRlcl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2VudGVyQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2VudGVyX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwQ2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudHxnb29nbGUubWFwcy5JY29uTW91c2VFdmVudD4gPSB0aGlzLl9ldmVudE1hbmFnZXJcbiAgICAgIC5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50fGdvb2dsZS5tYXBzLkljb25Nb3VzZUV2ZW50PignY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRibGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwRGJsY2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkYmxjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZHJhZ1xuICAgKi9cbiAgQE91dHB1dCgpIG1hcERyYWc6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRyYWdlbmRcbiAgICovXG4gIEBPdXRwdXQoKSBtYXBEcmFnZW5kOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdkcmFnZW5kJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5kcmFnc3RhcnRcbiAgICovXG4gIEBPdXRwdXQoKSBtYXBEcmFnc3RhcnQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWdzdGFydCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuaGVhZGluZ19jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgaGVhZGluZ0NoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2hlYWRpbmdfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuaWRsZVxuICAgKi9cbiAgQE91dHB1dCgpIGlkbGU6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2lkbGUnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1hcHR5cGVpZF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwdHlwZWlkQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignbWFwdHlwZWlkX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1vdXNlbW92ZVxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcE1vdXNlbW92ZTogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNlbW92ZScpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAubW91c2VvdXRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBNb3VzZW91dDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNlb3V0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5tb3VzZW92ZXJcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBNb3VzZW92ZXI6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdtb3VzZW92ZXInKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5wcm9qZWN0aW9uX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwcm9qZWN0aW9uQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3Byb2plY3Rpb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAucmlnaHRjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcFJpZ2h0Y2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdyaWdodGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC50aWxlc2xvYWRlZFxuICAgKi9cbiAgQE91dHB1dCgpIHRpbGVzbG9hZGVkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd0aWxlc2xvYWRlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAudGlsdF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgdGlsdENoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3RpbHRfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuem9vbV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgem9vbUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3pvb21fY2hhbmdlZCcpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcGxhdGZvcm1JZDogT2JqZWN0KSB7XG5cbiAgICB0aGlzLl9pc0Jyb3dzZXIgPSBpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKTtcblxuICAgIGlmICh0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgIGNvbnN0IGdvb2dsZU1hcHNXaW5kb3c6IEdvb2dsZU1hcHNXaW5kb3cgPSB3aW5kb3c7XG4gICAgICBpZiAoIWdvb2dsZU1hcHNXaW5kb3cuZ29vZ2xlICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICAgJ05hbWVzcGFjZSBnb29nbGUgbm90IGZvdW5kLCBjYW5ub3QgY29uc3RydWN0IGVtYmVkZGVkIGdvb2dsZSAnICtcbiAgICAgICAgICAgICdtYXAuIFBsZWFzZSBpbnN0YWxsIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSTogJyArXG4gICAgICAgICAgICAnaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvJyArXG4gICAgICAgICAgICAndHV0b3JpYWwjTG9hZGluZ190aGVfTWFwc19BUEknKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9zZXRTaXplKCk7XG4gICAgaWYgKHRoaXMuZ29vZ2xlTWFwICYmIHRoaXMubWFwVHlwZUlkKSB7XG4gICAgICB0aGlzLmdvb2dsZU1hcC5zZXRNYXBUeXBlSWQodGhpcy5tYXBUeXBlSWQpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIEl0IHNob3VsZCBiZSBhIG5vb3AgZHVyaW5nIHNlcnZlci1zaWRlIHJlbmRlcmluZy5cbiAgICBpZiAodGhpcy5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9tYXBFbCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubWFwLWNvbnRhaW5lcicpITtcbiAgICAgIHRoaXMuX3NldFNpemUoKTtcbiAgICAgIHRoaXMuX2dvb2dsZU1hcENoYW5nZXMgPSB0aGlzLl9pbml0aWFsaXplTWFwKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgdGhpcy5fZ29vZ2xlTWFwQ2hhbmdlcy5zdWJzY3JpYmUoKGdvb2dsZU1hcDogZ29vZ2xlLm1hcHMuTWFwKSA9PiB7XG4gICAgICAgIHRoaXMuZ29vZ2xlTWFwID0gZ29vZ2xlTWFwO1xuICAgICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuZ29vZ2xlTWFwKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvckNlbnRlckNoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yWm9vbUNoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3kubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3kuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZml0Qm91bmRzXG4gICAqL1xuICBmaXRCb3VuZHMoXG4gICAgICBib3VuZHM6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc3xnb29nbGUubWFwcy5MYXRMbmdCb3VuZHNMaXRlcmFsLFxuICAgICAgcGFkZGluZz86IG51bWJlcnxnb29nbGUubWFwcy5QYWRkaW5nKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLmdvb2dsZU1hcC5maXRCb3VuZHMoYm91bmRzLCBwYWRkaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAucGFuQnlcbiAgICovXG4gIHBhbkJ5KHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLmdvb2dsZU1hcC5wYW5CeSh4LCB5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAucGFuVG9cbiAgICovXG4gIHBhblRvKGxhdExuZzogZ29vZ2xlLm1hcHMuTGF0TG5nfGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMuZ29vZ2xlTWFwLnBhblRvKGxhdExuZyk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLnBhblRvQm91bmRzXG4gICAqL1xuICBwYW5Ub0JvdW5kcyhcbiAgICAgIGxhdExuZ0JvdW5kczogZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzfGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc0xpdGVyYWwsXG4gICAgICBwYWRkaW5nPzogbnVtYmVyfGdvb2dsZS5tYXBzLlBhZGRpbmcpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMuZ29vZ2xlTWFwLnBhblRvQm91bmRzKGxhdExuZ0JvdW5kcywgcGFkZGluZyk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldEJvdW5kc1xuICAgKi9cbiAgZ2V0Qm91bmRzKCk6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc3xudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRCb3VuZHMoKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRDZW50ZXJcbiAgICovXG4gIGdldENlbnRlcigpOiBnb29nbGUubWFwcy5MYXRMbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldENlbnRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRDbGlja2FibGVJY29uc1xuICAgKi9cbiAgZ2V0Q2xpY2thYmxlSWNvbnMoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0Q2xpY2thYmxlSWNvbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0SGVhZGluZ1xuICAgKi9cbiAgZ2V0SGVhZGluZygpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldEhlYWRpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0TWFwVHlwZUlkXG4gICAqL1xuICBnZXRNYXBUeXBlSWQoKTogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkfHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0TWFwVHlwZUlkKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldFByb2plY3Rpb25cbiAgICovXG4gIGdldFByb2plY3Rpb24oKTogZ29vZ2xlLm1hcHMuUHJvamVjdGlvbnxudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRQcm9qZWN0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldFN0cmVldFZpZXdcbiAgICovXG4gIGdldFN0cmVldFZpZXcoKTogZ29vZ2xlLm1hcHMuU3RyZWV0Vmlld1Bhbm9yYW1hIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRTdHJlZXRWaWV3KCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldFRpbHRcbiAgICovXG4gIGdldFRpbHQoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRUaWx0KCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldFpvb21cbiAgICovXG4gIGdldFpvb20oKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRab29tKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmNvbnRyb2xzXG4gICAqL1xuICBnZXQgY29udHJvbHMoKTogZ29vZ2xlLm1hcHMuTVZDQXJyYXk8Tm9kZT5bXSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuY29udHJvbHM7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRhdGFcbiAgICovXG4gIGdldCBkYXRhKCk6IGdvb2dsZS5tYXBzLkRhdGEge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmRhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1hcFR5cGVzXG4gICAqL1xuICBnZXQgbWFwVHlwZXMoKTogZ29vZ2xlLm1hcHMuTWFwVHlwZVJlZ2lzdHJ5IHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5tYXBUeXBlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAub3ZlcmxheU1hcFR5cGVzXG4gICAqL1xuICBnZXQgb3ZlcmxheU1hcFR5cGVzKCk6IGdvb2dsZS5tYXBzLk1WQ0FycmF5PGdvb2dsZS5tYXBzLk1hcFR5cGU+IHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5vdmVybGF5TWFwVHlwZXM7XG4gIH1cblxuICBwcml2YXRlIF9zZXRTaXplKCkge1xuICAgIGlmICh0aGlzLl9tYXBFbCkge1xuICAgICAgY29uc3Qgc3R5bGVzID0gdGhpcy5fbWFwRWwuc3R5bGU7XG4gICAgICBzdHlsZXMuaGVpZ2h0ID1cbiAgICAgICAgICB0aGlzLmhlaWdodCA9PT0gbnVsbCA/ICcnIDogKGNvZXJjZUNzc1BpeGVsVmFsdWUodGhpcy5oZWlnaHQpIHx8IERFRkFVTFRfSEVJR0hUKTtcbiAgICAgIHN0eWxlcy53aWR0aCA9IHRoaXMud2lkdGggPT09IG51bGwgPyAnJyA6IChjb2VyY2VDc3NQaXhlbFZhbHVlKHRoaXMud2lkdGgpIHx8IERFRkFVTFRfV0lEVEgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDb21iaW5lcyB0aGUgY2VudGVyIGFuZCB6b29tIGFuZCB0aGUgb3RoZXIgbWFwIG9wdGlvbnMgaW50byBhIHNpbmdsZSBvYmplY3QgKi9cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBPcHRpb25zPiB7XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoW3RoaXMuX29wdGlvbnMsIHRoaXMuX2NlbnRlciwgdGhpcy5fem9vbV0pXG4gICAgICAgIC5waXBlKG1hcCgoW29wdGlvbnMsIGNlbnRlciwgem9vbV0pID0+IHtcbiAgICAgICAgICBjb25zdCBjb21iaW5lZE9wdGlvbnM6IGdvb2dsZS5tYXBzLk1hcE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgLy8gSXQncyBpbXBvcnRhbnQgdGhhdCB3ZSBzZXQgKipzb21lKioga2luZCBvZiBgY2VudGVyYCBhbmQgYHpvb21gLCBvdGhlcndpc2VcbiAgICAgICAgICAgIC8vIEdvb2dsZSBNYXBzIHdpbGwgcmVuZGVyIGEgYmxhbmsgcmVjdGFuZ2xlIHdoaWNoIGxvb2tzIGJyb2tlbi5cbiAgICAgICAgICAgIGNlbnRlcjogY2VudGVyIHx8IG9wdGlvbnMuY2VudGVyIHx8IERFRkFVTFRfT1BUSU9OUy5jZW50ZXIsXG4gICAgICAgICAgICB6b29tOiB6b29tID8/IG9wdGlvbnMuem9vbSA/PyBERUZBVUxUX09QVElPTlMuem9vbSxcbiAgICAgICAgICAgIG1hcFR5cGVJZDogdGhpcy5tYXBUeXBlSWRcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemVNYXAob3B0aW9uc0NoYW5nZXM6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwT3B0aW9ucz4pOlxuICAgICAgT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXA+IHtcbiAgICByZXR1cm4gb3B0aW9uc0NoYW5nZXMucGlwZShcbiAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgbWFwKG9wdGlvbnMgPT4ge1xuICAgICAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgICAgIHJldHVybiB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gbmV3IGdvb2dsZS5tYXBzLk1hcCh0aGlzLl9tYXBFbCwgb3B0aW9ucykpO1xuICAgICAgICB9KSxcbiAgICAgICAgc2hhcmVSZXBsYXkoMSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpIHtcbiAgICBjb21iaW5lTGF0ZXN0KFt0aGlzLl9nb29nbGVNYXBDaGFuZ2VzLCB0aGlzLl9vcHRpb25zXSlcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgICAuc3Vic2NyaWJlKChbZ29vZ2xlTWFwLCBvcHRpb25zXSkgPT4ge1xuICAgICAgICAgIGdvb2dsZU1hcC5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yQ2VudGVyQ2hhbmdlcygpIHtcbiAgICBjb21iaW5lTGF0ZXN0KFt0aGlzLl9nb29nbGVNYXBDaGFuZ2VzLCB0aGlzLl9jZW50ZXJdKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKFtnb29nbGVNYXAsIGNlbnRlcl0pID0+IHtcbiAgICAgICAgICBpZiAoY2VudGVyKSB7XG4gICAgICAgICAgICBnb29nbGVNYXAuc2V0Q2VudGVyKGNlbnRlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yWm9vbUNoYW5nZXMoKSB7XG4gICAgY29tYmluZUxhdGVzdChbdGhpcy5fZ29vZ2xlTWFwQ2hhbmdlcywgdGhpcy5fem9vbV0pXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgICAgLnN1YnNjcmliZSgoW2dvb2dsZU1hcCwgem9vbV0pID0+IHtcbiAgICAgICAgICBpZiAoem9vbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBnb29nbGVNYXAuc2V0Wm9vbSh6b29tKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEFzc2VydHMgdGhhdCB0aGUgbWFwIGhhcyBiZWVuIGluaXRpYWxpemVkLiAqL1xuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge2dvb2dsZU1hcDogZ29vZ2xlLm1hcHMuTWFwfSB7XG4gICAgaWYgKCF0aGlzLmdvb2dsZU1hcCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0Nhbm5vdCBhY2Nlc3MgR29vZ2xlIE1hcCBpbmZvcm1hdGlvbiBiZWZvcmUgdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBBUEkgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGNzc1VuaXRzUGF0dGVybiA9IC8oW0EtWmEteiVdKykkLztcblxuLyoqIENvZXJjZXMgYSB2YWx1ZSB0byBhIENTUyBwaXhlbCB2YWx1ZS4gKi9cbmZ1bmN0aW9uIGNvZXJjZUNzc1BpeGVsVmFsdWUodmFsdWU6IGFueSk6IHN0cmluZyB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmV0dXJuIGNzc1VuaXRzUGF0dGVybi50ZXN0KHZhbHVlKSA/IHZhbHVlIDogYCR7dmFsdWV9cHhgO1xufVxuIl19