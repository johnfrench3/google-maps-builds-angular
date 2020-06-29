/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
import { ChangeDetectionStrategy, Component, ElementRef, Input, Output, ViewEncapsulation, Optional, Inject, PLATFORM_ID, NgZone, } from '@angular/core';
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
    constructor(_elementRef, _ngZone, 
    /**
     * @deprecated `platformId` parameter to become required.
     * @breaking-change 10.0.0
     */
    platformId) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(this._ngZone);
        this._options = new BehaviorSubject(DEFAULT_OPTIONS);
        this._center = new BehaviorSubject(undefined);
        this._zoom = new BehaviorSubject(undefined);
        this._destroy = new Subject();
        /** Height of the map. */
        this.height = DEFAULT_HEIGHT;
        /** Width of the map. */
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
        this.mapClick = this._eventManager.getLazyEmitter('click');
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
        // @breaking-change 10.0.0 Remove null check for `platformId`.
        this._isBrowser =
            platformId ? isPlatformBrowser(platformId) : typeof window === 'object' && !!window;
        if (this._isBrowser) {
            const googleMapsWindow = window;
            if (!googleMapsWindow.google) {
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
            styles.height = coerceCssPixelValue(this.height) || DEFAULT_HEIGHT;
            styles.width = coerceCssPixelValue(this.width) || DEFAULT_WIDTH;
        }
    }
    /** Combines the center and zoom and the other map options into a single object */
    _combineOptions() {
        return combineLatest([this._options, this._center, this._zoom])
            .pipe(map(([options, center, zoom]) => {
            const combinedOptions = Object.assign(Object.assign({}, options), { center: center || options.center, zoom: zoom !== undefined ? zoom : options.zoom, mapTypeId: this.mapTypeId });
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
        if (!this.googleMap) {
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
    { type: Object, decorators: [{ type: Optional }, { type: Inject, args: [PLATFORM_ID,] }] }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9nb29nbGUtbWFwL2dvb2dsZS1tYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUVwQyxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUlMLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsUUFBUSxFQUNSLE1BQU0sRUFDTixXQUFXLEVBQ1gsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekUsT0FBTyxFQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2pFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQU1yRCw0Q0FBNEM7QUFDNUMsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUEyQjtJQUNyRCxNQUFNLEVBQUUsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBQztJQUMxQyxJQUFJLEVBQUUsRUFBRTtDQUNULENBQUM7QUFFRixtREFBbUQ7QUFDbkQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQztBQUN0QyxrREFBa0Q7QUFDbEQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQztBQUVyQzs7OztHQUlHO0FBUUgsTUFBTSxPQUFPLFNBQVM7SUE0S3BCLFlBQ21CLFdBQXVCLEVBQ2hDLE9BQWU7SUFDdkI7OztPQUdHO0lBQzhCLFVBQW1CO1FBTm5D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QUM7U0FDbkY7SUFDSCxDQUFDOzs7WUE1Y0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxZQUFZO2dCQUN0QixRQUFRLEVBQUUsV0FBVztnQkFDckIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFFBQVEsRUFBRSw0REFBNEQ7Z0JBQ3RFLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2FBQ3RDOzs7WUEzQ0MsVUFBVTtZQVVWLE1BQU07WUFxTjBDLE1BQU0sdUJBQW5ELFFBQVEsWUFBSSxNQUFNLFNBQUMsV0FBVzs7O3FCQTdKaEMsS0FBSztvQkFHTCxLQUFLO3dCQU1MLEtBQUs7cUJBRUwsS0FBSzttQkFJTCxLQUFLO3NCQUlMLEtBQUs7NEJBU0wsTUFBTTs0QkFPTixNQUFNO3VCQU9OLE1BQU07MEJBUU4sTUFBTTtzQkFRTixNQUFNO3lCQU1OLE1BQU07MkJBTU4sTUFBTTs2QkFNTixNQUFNO21CQU9OLE1BQU07K0JBTU4sTUFBTTsyQkFPTixNQUFNOzBCQVFOLE1BQU07MkJBUU4sTUFBTTtnQ0FRTixNQUFNOzRCQVFOLE1BQU07MEJBUU4sTUFBTTswQkFNTixNQUFNOzBCQU1OLE1BQU07O0FBOFJULE1BQU0sZUFBZSxHQUFHLGVBQWUsQ0FBQztBQUV4Qyw0Q0FBNEM7QUFDNUMsU0FBUyxtQkFBbUIsQ0FBQyxLQUFVO0lBQ3JDLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtRQUNqQixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBRUQsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUM7QUFDNUQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZW1hcHNcIiAvPlxuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgT3B0aW9uYWwsXG4gIEluamVjdCxcbiAgUExBVEZPUk1fSUQsXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIHNoYXJlUmVwbGF5LCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5cbmludGVyZmFjZSBHb29nbGVNYXBzV2luZG93IGV4dGVuZHMgV2luZG93IHtcbiAgZ29vZ2xlPzogdHlwZW9mIGdvb2dsZTtcbn1cblxuLyoqIGRlZmF1bHQgb3B0aW9ucyBzZXQgdG8gdGhlIEdvb2dsZXBsZXggKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX09QVElPTlM6IGdvb2dsZS5tYXBzLk1hcE9wdGlvbnMgPSB7XG4gIGNlbnRlcjoge2xhdDogMzcuNDIxOTk1LCBsbmc6IC0xMjIuMDg0MDkyfSxcbiAgem9vbTogMTdcbn07XG5cbi8qKiBBcmJpdHJhcnkgZGVmYXVsdCBoZWlnaHQgZm9yIHRoZSBtYXAgZWxlbWVudCAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfSEVJR0hUID0gJzUwMHB4Jztcbi8qKiBBcmJpdHJhcnkgZGVmYXVsdCB3aWR0aCBmb3IgdGhlIG1hcCBlbGVtZW50ICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9XSURUSCA9ICc1MDBweCc7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcCB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHRcbiAqIEFQSS5cbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL1xuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdnb29nbGUtbWFwJyxcbiAgZXhwb3J0QXM6ICdnb29nbGVNYXAnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwibWFwLWNvbnRhaW5lclwiPjwvZGl2PjxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBHb29nbGVNYXAgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyOiBNYXBFdmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKHRoaXMuX25nWm9uZSk7XG4gIHByaXZhdGUgX2dvb2dsZU1hcENoYW5nZXM6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwPjtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9vcHRpb25zID0gbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5NYXBPcHRpb25zPihERUZBVUxUX09QVElPTlMpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9jZW50ZXIgPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsfGdvb2dsZS5tYXBzLkxhdExuZ3x1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3pvb20gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3kgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF9tYXBFbDogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLk1hcCBvYmplY3RcbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcFxuICAgKi9cbiAgZ29vZ2xlTWFwPzogZ29vZ2xlLm1hcHMuTWFwO1xuXG4gIC8qKiBXaGV0aGVyIHdlJ3JlIGN1cnJlbnRseSByZW5kZXJpbmcgaW5zaWRlIGEgYnJvd3Nlci4gKi9cbiAgX2lzQnJvd3NlcjogYm9vbGVhbjtcblxuICAvKiogSGVpZ2h0IG9mIHRoZSBtYXAuICovXG4gIEBJbnB1dCgpIGhlaWdodDogc3RyaW5nIHwgbnVtYmVyID0gREVGQVVMVF9IRUlHSFQ7XG5cbiAgLyoqIFdpZHRoIG9mIHRoZSBtYXAuICovXG4gIEBJbnB1dCgpIHdpZHRoOiBzdHJpbmcgfCBudW1iZXIgPSBERUZBVUxUX1dJRFRIO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIG1hcCB0aGF0IHNob3VsZCBiZSByZW5kZXJlZC4gRS5nLiBoeWJyaWQgbWFwLCB0ZXJyYWluIG1hcCBldGMuXG4gICAqIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXBUeXBlSWRcbiAgICovXG4gIEBJbnB1dCgpIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkIHwgdW5kZWZpbmVkO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBjZW50ZXIoY2VudGVyOiBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsfGdvb2dsZS5tYXBzLkxhdExuZykge1xuICAgIHRoaXMuX2NlbnRlci5uZXh0KGNlbnRlcik7XG4gIH1cbiAgQElucHV0KClcbiAgc2V0IHpvb20oem9vbTogbnVtYmVyKSB7XG4gICAgdGhpcy5fem9vbS5uZXh0KHpvb20pO1xuICB9XG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLk1hcE9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zLm5leHQob3B0aW9ucyB8fCBERUZBVUxUX09QVElPTlMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5ib3VuZHNfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGJvdW5kc0NoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2JvdW5kc19jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5jZW50ZXJfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNlbnRlckNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2NlbnRlcl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcENsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnR8Z29vZ2xlLm1hcHMuSWNvbk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50fGdvb2dsZS5tYXBzLkljb25Nb3VzZUV2ZW50PignY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRibGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwRGJsY2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkYmxjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZHJhZ1xuICAgKi9cbiAgQE91dHB1dCgpIG1hcERyYWc6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRyYWdlbmRcbiAgICovXG4gIEBPdXRwdXQoKSBtYXBEcmFnZW5kOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdkcmFnZW5kJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5kcmFnc3RhcnRcbiAgICovXG4gIEBPdXRwdXQoKSBtYXBEcmFnc3RhcnQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWdzdGFydCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuaGVhZGluZ19jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgaGVhZGluZ0NoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2hlYWRpbmdfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuaWRsZVxuICAgKi9cbiAgQE91dHB1dCgpIGlkbGU6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2lkbGUnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1hcHR5cGVpZF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwdHlwZWlkQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignbWFwdHlwZWlkX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1vdXNlbW92ZVxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcE1vdXNlbW92ZTogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNlbW92ZScpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAubW91c2VvdXRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBNb3VzZW91dDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNlb3V0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5tb3VzZW92ZXJcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBNb3VzZW92ZXI6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdtb3VzZW92ZXInKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5wcm9qZWN0aW9uX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwcm9qZWN0aW9uQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3Byb2plY3Rpb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAucmlnaHRjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcFJpZ2h0Y2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdyaWdodGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC50aWxlc2xvYWRlZFxuICAgKi9cbiAgQE91dHB1dCgpIHRpbGVzbG9hZGVkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd0aWxlc2xvYWRlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAudGlsdF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgdGlsdENoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3RpbHRfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuem9vbV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgem9vbUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3pvb21fY2hhbmdlZCcpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYHBsYXRmb3JtSWRgIHBhcmFtZXRlciB0byBiZWNvbWUgcmVxdWlyZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFBMQVRGT1JNX0lEKSBwbGF0Zm9ybUlkPzogT2JqZWN0KSB7XG5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMCBSZW1vdmUgbnVsbCBjaGVjayBmb3IgYHBsYXRmb3JtSWRgLlxuICAgIHRoaXMuX2lzQnJvd3NlciA9XG4gICAgICAgIHBsYXRmb3JtSWQgPyBpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSA6IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnICYmICEhd2luZG93O1xuXG4gICAgaWYgKHRoaXMuX2lzQnJvd3Nlcikge1xuICAgICAgY29uc3QgZ29vZ2xlTWFwc1dpbmRvdzogR29vZ2xlTWFwc1dpbmRvdyA9IHdpbmRvdztcbiAgICAgIGlmICghZ29vZ2xlTWFwc1dpbmRvdy5nb29nbGUpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAnTmFtZXNwYWNlIGdvb2dsZSBub3QgZm91bmQsIGNhbm5vdCBjb25zdHJ1Y3QgZW1iZWRkZWQgZ29vZ2xlICcgK1xuICAgICAgICAgICAgJ21hcC4gUGxlYXNlIGluc3RhbGwgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJOiAnICtcbiAgICAgICAgICAgICdodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC8nICtcbiAgICAgICAgICAgICd0dXRvcmlhbCNMb2FkaW5nX3RoZV9NYXBzX0FQSScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuX3NldFNpemUoKTtcbiAgICBpZiAodGhpcy5nb29nbGVNYXAgJiYgdGhpcy5tYXBUeXBlSWQpIHtcbiAgICAgIHRoaXMuZ29vZ2xlTWFwLnNldE1hcFR5cGVJZCh0aGlzLm1hcFR5cGVJZCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gSXQgc2hvdWxkIGJlIGEgbm9vcCBkdXJpbmcgc2VydmVyLXNpZGUgcmVuZGVyaW5nLlxuICAgIGlmICh0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX21hcEVsID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXAtY29udGFpbmVyJykhO1xuICAgICAgdGhpcy5fc2V0U2l6ZSgpO1xuICAgICAgdGhpcy5fZ29vZ2xlTWFwQ2hhbmdlcyA9IHRoaXMuX2luaXRpYWxpemVNYXAodGhpcy5fY29tYmluZU9wdGlvbnMoKSk7XG4gICAgICB0aGlzLl9nb29nbGVNYXBDaGFuZ2VzLnN1YnNjcmliZSgoZ29vZ2xlTWFwOiBnb29nbGUubWFwcy5NYXApID0+IHtcbiAgICAgICAgdGhpcy5nb29nbGVNYXAgPSBnb29nbGVNYXA7XG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5nb29nbGVNYXApO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yQ2VudGVyQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3Jab29tQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveS5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5maXRCb3VuZHNcbiAgICovXG4gIGZpdEJvdW5kcyhcbiAgICAgIGJvdW5kczogZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzfGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc0xpdGVyYWwsXG4gICAgICBwYWRkaW5nPzogbnVtYmVyfGdvb2dsZS5tYXBzLlBhZGRpbmcpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMuZ29vZ2xlTWFwLmZpdEJvdW5kcyhib3VuZHMsIHBhZGRpbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5wYW5CeVxuICAgKi9cbiAgcGFuQnkoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMuZ29vZ2xlTWFwLnBhbkJ5KHgsIHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5wYW5Ub1xuICAgKi9cbiAgcGFuVG8obGF0TG5nOiBnb29nbGUubWFwcy5MYXRMbmd8Z29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbCkge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgdGhpcy5nb29nbGVNYXAucGFuVG8obGF0TG5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAucGFuVG9Cb3VuZHNcbiAgICovXG4gIHBhblRvQm91bmRzKFxuICAgICAgbGF0TG5nQm91bmRzOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHN8Z29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzTGl0ZXJhbCxcbiAgICAgIHBhZGRpbmc/OiBudW1iZXJ8Z29vZ2xlLm1hcHMuUGFkZGluZykge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgdGhpcy5nb29nbGVNYXAucGFuVG9Cb3VuZHMobGF0TG5nQm91bmRzLCBwYWRkaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0Qm91bmRzXG4gICAqL1xuICBnZXRCb3VuZHMoKTogZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzfG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldEJvdW5kcygpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldENlbnRlclxuICAgKi9cbiAgZ2V0Q2VudGVyKCk6IGdvb2dsZS5tYXBzLkxhdExuZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0Q2VudGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldENsaWNrYWJsZUljb25zXG4gICAqL1xuICBnZXRDbGlja2FibGVJY29ucygpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRDbGlja2FibGVJY29ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRIZWFkaW5nXG4gICAqL1xuICBnZXRIZWFkaW5nKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0SGVhZGluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRNYXBUeXBlSWRcbiAgICovXG4gIGdldE1hcFR5cGVJZCgpOiBnb29nbGUubWFwcy5NYXBUeXBlSWR8c3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRNYXBUeXBlSWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0UHJvamVjdGlvblxuICAgKi9cbiAgZ2V0UHJvamVjdGlvbigpOiBnb29nbGUubWFwcy5Qcm9qZWN0aW9ufG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldFByb2plY3Rpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0U3RyZWV0Vmlld1xuICAgKi9cbiAgZ2V0U3RyZWV0VmlldygpOiBnb29nbGUubWFwcy5TdHJlZXRWaWV3UGFub3JhbWEge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldFN0cmVldFZpZXcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0VGlsdFxuICAgKi9cbiAgZ2V0VGlsdCgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldFRpbHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0Wm9vbVxuICAgKi9cbiAgZ2V0Wm9vbSgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldFpvb20oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuY29udHJvbHNcbiAgICovXG4gIGdldCBjb250cm9scygpOiBnb29nbGUubWFwcy5NVkNBcnJheTxOb2RlPltdIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5jb250cm9scztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZGF0YVxuICAgKi9cbiAgZ2V0IGRhdGEoKTogZ29vZ2xlLm1hcHMuRGF0YSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAubWFwVHlwZXNcbiAgICovXG4gIGdldCBtYXBUeXBlcygpOiBnb29nbGUubWFwcy5NYXBUeXBlUmVnaXN0cnkge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLm1hcFR5cGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5vdmVybGF5TWFwVHlwZXNcbiAgICovXG4gIGdldCBvdmVybGF5TWFwVHlwZXMoKTogZ29vZ2xlLm1hcHMuTVZDQXJyYXk8Z29vZ2xlLm1hcHMuTWFwVHlwZT4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLm92ZXJsYXlNYXBUeXBlcztcbiAgfVxuXG4gIHByaXZhdGUgX3NldFNpemUoKSB7XG4gICAgaWYgKHRoaXMuX21hcEVsKSB7XG4gICAgICBjb25zdCBzdHlsZXMgPSB0aGlzLl9tYXBFbC5zdHlsZTtcbiAgICAgIHN0eWxlcy5oZWlnaHQgPSBjb2VyY2VDc3NQaXhlbFZhbHVlKHRoaXMuaGVpZ2h0KSB8fCBERUZBVUxUX0hFSUdIVDtcbiAgICAgIHN0eWxlcy53aWR0aCA9IGNvZXJjZUNzc1BpeGVsVmFsdWUodGhpcy53aWR0aCkgfHwgREVGQVVMVF9XSURUSDtcbiAgICB9XG4gIH1cblxuICAvKiogQ29tYmluZXMgdGhlIGNlbnRlciBhbmQgem9vbSBhbmQgdGhlIG90aGVyIG1hcCBvcHRpb25zIGludG8gYSBzaW5nbGUgb2JqZWN0ICovXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwT3B0aW9ucz4ge1xuICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFt0aGlzLl9vcHRpb25zLCB0aGlzLl9jZW50ZXIsIHRoaXMuX3pvb21dKVxuICAgICAgICAucGlwZShtYXAoKFtvcHRpb25zLCBjZW50ZXIsIHpvb21dKSA9PiB7XG4gICAgICAgICAgY29uc3QgY29tYmluZWRPcHRpb25zOiBnb29nbGUubWFwcy5NYXBPcHRpb25zID0ge1xuICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICAgIGNlbnRlcjogY2VudGVyIHx8IG9wdGlvbnMuY2VudGVyLFxuICAgICAgICAgICAgem9vbTogem9vbSAhPT0gdW5kZWZpbmVkID8gem9vbSA6IG9wdGlvbnMuem9vbSxcbiAgICAgICAgICAgIG1hcFR5cGVJZDogdGhpcy5tYXBUeXBlSWRcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemVNYXAob3B0aW9uc0NoYW5nZXM6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwT3B0aW9ucz4pOlxuICAgICAgT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXA+IHtcbiAgICByZXR1cm4gb3B0aW9uc0NoYW5nZXMucGlwZShcbiAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgbWFwKG9wdGlvbnMgPT4ge1xuICAgICAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgICAgIHJldHVybiB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gbmV3IGdvb2dsZS5tYXBzLk1hcCh0aGlzLl9tYXBFbCwgb3B0aW9ucykpO1xuICAgICAgICB9KSxcbiAgICAgICAgc2hhcmVSZXBsYXkoMSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpIHtcbiAgICBjb21iaW5lTGF0ZXN0KFt0aGlzLl9nb29nbGVNYXBDaGFuZ2VzLCB0aGlzLl9vcHRpb25zXSlcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgICAuc3Vic2NyaWJlKChbZ29vZ2xlTWFwLCBvcHRpb25zXSkgPT4ge1xuICAgICAgICAgIGdvb2dsZU1hcC5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yQ2VudGVyQ2hhbmdlcygpIHtcbiAgICBjb21iaW5lTGF0ZXN0KFt0aGlzLl9nb29nbGVNYXBDaGFuZ2VzLCB0aGlzLl9jZW50ZXJdKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKFtnb29nbGVNYXAsIGNlbnRlcl0pID0+IHtcbiAgICAgICAgICBpZiAoY2VudGVyKSB7XG4gICAgICAgICAgICBnb29nbGVNYXAuc2V0Q2VudGVyKGNlbnRlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yWm9vbUNoYW5nZXMoKSB7XG4gICAgY29tYmluZUxhdGVzdChbdGhpcy5fZ29vZ2xlTWFwQ2hhbmdlcywgdGhpcy5fem9vbV0pXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgICAgLnN1YnNjcmliZSgoW2dvb2dsZU1hcCwgem9vbV0pID0+IHtcbiAgICAgICAgICBpZiAoem9vbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBnb29nbGVNYXAuc2V0Wm9vbSh6b29tKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEFzc2VydHMgdGhhdCB0aGUgbWFwIGhhcyBiZWVuIGluaXRpYWxpemVkLiAqL1xuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge2dvb2dsZU1hcDogZ29vZ2xlLm1hcHMuTWFwfSB7XG4gICAgaWYgKCF0aGlzLmdvb2dsZU1hcCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0Nhbm5vdCBhY2Nlc3MgR29vZ2xlIE1hcCBpbmZvcm1hdGlvbiBiZWZvcmUgdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBBUEkgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGNzc1VuaXRzUGF0dGVybiA9IC8oW0EtWmEteiVdKykkLztcblxuLyoqIENvZXJjZXMgYSB2YWx1ZSB0byBhIENTUyBwaXhlbCB2YWx1ZS4gKi9cbmZ1bmN0aW9uIGNvZXJjZUNzc1BpeGVsVmFsdWUodmFsdWU6IGFueSk6IHN0cmluZyB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmV0dXJuIGNzc1VuaXRzUGF0dGVybi50ZXN0KHZhbHVlKSA/IHZhbHVlIDogYCR7dmFsdWV9cHhgO1xufVxuIl19