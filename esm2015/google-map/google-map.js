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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9nb29nbGUtbWFwL2dvb2dsZS1tYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUVwQyxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUlMLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsTUFBTSxFQUNOLFdBQVcsRUFDWCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6RSxPQUFPLEVBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDakUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBTXJELDRDQUE0QztBQUM1QyxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQTJCO0lBQ3JELE1BQU0sRUFBRSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFDO0lBQzFDLElBQUksRUFBRSxFQUFFO0NBQ1QsQ0FBQztBQUVGLG1EQUFtRDtBQUNuRCxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDO0FBQ3RDLGtEQUFrRDtBQUNsRCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDO0FBRXJDOzs7O0dBSUc7QUFRSCxNQUFNLE9BQU8sU0FBUztJQTRLcEIsWUFDbUIsV0FBdUIsRUFDaEMsT0FBZSxFQUNGLFVBQWtCO1FBRnRCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FB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QUM1RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3QsXG4gIFBMQVRGT1JNX0lELFxuICBOZ1pvbmUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCBzaGFyZVJlcGxheSwgdGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG5pbnRlcmZhY2UgR29vZ2xlTWFwc1dpbmRvdyBleHRlbmRzIFdpbmRvdyB7XG4gIGdvb2dsZT86IHR5cGVvZiBnb29nbGU7XG59XG5cbi8qKiBkZWZhdWx0IG9wdGlvbnMgc2V0IHRvIHRoZSBHb29nbGVwbGV4ICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9PUFRJT05TOiBnb29nbGUubWFwcy5NYXBPcHRpb25zID0ge1xuICBjZW50ZXI6IHtsYXQ6IDM3LjQyMTk5NSwgbG5nOiAtMTIyLjA4NDA5Mn0sXG4gIHpvb206IDE3XG59O1xuXG4vKiogQXJiaXRyYXJ5IGRlZmF1bHQgaGVpZ2h0IGZvciB0aGUgbWFwIGVsZW1lbnQgKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX0hFSUdIVCA9ICc1MDBweCc7XG4vKiogQXJiaXRyYXJ5IGRlZmF1bHQgd2lkdGggZm9yIHRoZSBtYXAgZWxlbWVudCAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfV0lEVEggPSAnNTAwcHgnO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXAgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0XG4gKiBBUEkuXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZ29vZ2xlLW1hcCcsXG4gIGV4cG9ydEFzOiAnZ29vZ2xlTWFwJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIm1hcC1jb250YWluZXJcIj48L2Rpdj48bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgR29vZ2xlTWFwIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlcjogTWFwRXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcih0aGlzLl9uZ1pvbmUpO1xuICBwcml2YXRlIF9nb29nbGVNYXBDaGFuZ2VzOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcD47XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfb3B0aW9ucyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuTWFwT3B0aW9ucz4oREVGQVVMVF9PUFRJT05TKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfY2VudGVyID1cbiAgICAgIG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbHxnb29nbGUubWFwcy5MYXRMbmd8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF96b29tID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudW1iZXJ8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBfbWFwRWw6IEhUTUxFbGVtZW50O1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy5NYXAgb2JqZWN0XG4gICAqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXBcbiAgICovXG4gIGdvb2dsZU1hcD86IGdvb2dsZS5tYXBzLk1hcDtcblxuICAvKiogV2hldGhlciB3ZSdyZSBjdXJyZW50bHkgcmVuZGVyaW5nIGluc2lkZSBhIGJyb3dzZXIuICovXG4gIF9pc0Jyb3dzZXI6IGJvb2xlYW47XG5cbiAgLyoqIEhlaWdodCBvZiB0aGUgbWFwLiBTZXQgdGhpcyB0byBgbnVsbGAgaWYgeW91J2QgbGlrZSB0byBjb250cm9sIHRoZSBoZWlnaHQgdGhyb3VnaCBDU1MuICovXG4gIEBJbnB1dCgpIGhlaWdodDogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCA9IERFRkFVTFRfSEVJR0hUO1xuXG4gIC8qKiBXaWR0aCBvZiB0aGUgbWFwLiBTZXQgdGhpcyB0byBgbnVsbGAgaWYgeW91J2QgbGlrZSB0byBjb250cm9sIHRoZSB3aWR0aCB0aHJvdWdoIENTUy4gKi9cbiAgQElucHV0KCkgd2lkdGg6IHN0cmluZyB8IG51bWJlciB8IG51bGwgPSBERUZBVUxUX1dJRFRIO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIG1hcCB0aGF0IHNob3VsZCBiZSByZW5kZXJlZC4gRS5nLiBoeWJyaWQgbWFwLCB0ZXJyYWluIG1hcCBldGMuXG4gICAqIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXBUeXBlSWRcbiAgICovXG4gIEBJbnB1dCgpIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkIHwgdW5kZWZpbmVkO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBjZW50ZXIoY2VudGVyOiBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsfGdvb2dsZS5tYXBzLkxhdExuZykge1xuICAgIHRoaXMuX2NlbnRlci5uZXh0KGNlbnRlcik7XG4gIH1cbiAgQElucHV0KClcbiAgc2V0IHpvb20oem9vbTogbnVtYmVyKSB7XG4gICAgdGhpcy5fem9vbS5uZXh0KHpvb20pO1xuICB9XG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLk1hcE9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zLm5leHQob3B0aW9ucyB8fCBERUZBVUxUX09QVElPTlMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5ib3VuZHNfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGJvdW5kc0NoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2JvdW5kc19jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5jZW50ZXJfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNlbnRlckNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2NlbnRlcl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcENsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnR8Z29vZ2xlLm1hcHMuSWNvbk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50fGdvb2dsZS5tYXBzLkljb25Nb3VzZUV2ZW50PignY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRibGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwRGJsY2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkYmxjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZHJhZ1xuICAgKi9cbiAgQE91dHB1dCgpIG1hcERyYWc6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRyYWdlbmRcbiAgICovXG4gIEBPdXRwdXQoKSBtYXBEcmFnZW5kOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdkcmFnZW5kJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5kcmFnc3RhcnRcbiAgICovXG4gIEBPdXRwdXQoKSBtYXBEcmFnc3RhcnQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWdzdGFydCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuaGVhZGluZ19jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgaGVhZGluZ0NoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2hlYWRpbmdfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuaWRsZVxuICAgKi9cbiAgQE91dHB1dCgpIGlkbGU6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2lkbGUnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1hcHR5cGVpZF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwdHlwZWlkQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignbWFwdHlwZWlkX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1vdXNlbW92ZVxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcE1vdXNlbW92ZTogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNlbW92ZScpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAubW91c2VvdXRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBNb3VzZW91dDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNlb3V0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5tb3VzZW92ZXJcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBNb3VzZW92ZXI6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdtb3VzZW92ZXInKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5wcm9qZWN0aW9uX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwcm9qZWN0aW9uQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3Byb2plY3Rpb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAucmlnaHRjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcFJpZ2h0Y2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdyaWdodGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC50aWxlc2xvYWRlZFxuICAgKi9cbiAgQE91dHB1dCgpIHRpbGVzbG9hZGVkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd0aWxlc2xvYWRlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAudGlsdF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgdGlsdENoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3RpbHRfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuem9vbV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgem9vbUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3pvb21fY2hhbmdlZCcpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcGxhdGZvcm1JZDogT2JqZWN0KSB7XG5cbiAgICB0aGlzLl9pc0Jyb3dzZXIgPSBpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKTtcblxuICAgIGlmICh0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgIGNvbnN0IGdvb2dsZU1hcHNXaW5kb3c6IEdvb2dsZU1hcHNXaW5kb3cgPSB3aW5kb3c7XG4gICAgICBpZiAoIWdvb2dsZU1hcHNXaW5kb3cuZ29vZ2xlICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICAgJ05hbWVzcGFjZSBnb29nbGUgbm90IGZvdW5kLCBjYW5ub3QgY29uc3RydWN0IGVtYmVkZGVkIGdvb2dsZSAnICtcbiAgICAgICAgICAgICdtYXAuIFBsZWFzZSBpbnN0YWxsIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSTogJyArXG4gICAgICAgICAgICAnaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvJyArXG4gICAgICAgICAgICAndHV0b3JpYWwjTG9hZGluZ190aGVfTWFwc19BUEknKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9zZXRTaXplKCk7XG4gICAgaWYgKHRoaXMuZ29vZ2xlTWFwICYmIHRoaXMubWFwVHlwZUlkKSB7XG4gICAgICB0aGlzLmdvb2dsZU1hcC5zZXRNYXBUeXBlSWQodGhpcy5tYXBUeXBlSWQpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIEl0IHNob3VsZCBiZSBhIG5vb3AgZHVyaW5nIHNlcnZlci1zaWRlIHJlbmRlcmluZy5cbiAgICBpZiAodGhpcy5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9tYXBFbCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubWFwLWNvbnRhaW5lcicpITtcbiAgICAgIHRoaXMuX3NldFNpemUoKTtcbiAgICAgIHRoaXMuX2dvb2dsZU1hcENoYW5nZXMgPSB0aGlzLl9pbml0aWFsaXplTWFwKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgdGhpcy5fZ29vZ2xlTWFwQ2hhbmdlcy5zdWJzY3JpYmUoKGdvb2dsZU1hcDogZ29vZ2xlLm1hcHMuTWFwKSA9PiB7XG4gICAgICAgIHRoaXMuZ29vZ2xlTWFwID0gZ29vZ2xlTWFwO1xuICAgICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuZ29vZ2xlTWFwKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvckNlbnRlckNoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yWm9vbUNoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3kubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3kuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZml0Qm91bmRzXG4gICAqL1xuICBmaXRCb3VuZHMoXG4gICAgICBib3VuZHM6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc3xnb29nbGUubWFwcy5MYXRMbmdCb3VuZHNMaXRlcmFsLFxuICAgICAgcGFkZGluZz86IG51bWJlcnxnb29nbGUubWFwcy5QYWRkaW5nKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLmdvb2dsZU1hcC5maXRCb3VuZHMoYm91bmRzLCBwYWRkaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAucGFuQnlcbiAgICovXG4gIHBhbkJ5KHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLmdvb2dsZU1hcC5wYW5CeSh4LCB5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAucGFuVG9cbiAgICovXG4gIHBhblRvKGxhdExuZzogZ29vZ2xlLm1hcHMuTGF0TG5nfGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMuZ29vZ2xlTWFwLnBhblRvKGxhdExuZyk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLnBhblRvQm91bmRzXG4gICAqL1xuICBwYW5Ub0JvdW5kcyhcbiAgICAgIGxhdExuZ0JvdW5kczogZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzfGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc0xpdGVyYWwsXG4gICAgICBwYWRkaW5nPzogbnVtYmVyfGdvb2dsZS5tYXBzLlBhZGRpbmcpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMuZ29vZ2xlTWFwLnBhblRvQm91bmRzKGxhdExuZ0JvdW5kcywgcGFkZGluZyk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldEJvdW5kc1xuICAgKi9cbiAgZ2V0Qm91bmRzKCk6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc3xudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRCb3VuZHMoKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRDZW50ZXJcbiAgICovXG4gIGdldENlbnRlcigpOiBnb29nbGUubWFwcy5MYXRMbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldENlbnRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRDbGlja2FibGVJY29uc1xuICAgKi9cbiAgZ2V0Q2xpY2thYmxlSWNvbnMoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0Q2xpY2thYmxlSWNvbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0SGVhZGluZ1xuICAgKi9cbiAgZ2V0SGVhZGluZygpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldEhlYWRpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0TWFwVHlwZUlkXG4gICAqL1xuICBnZXRNYXBUeXBlSWQoKTogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkfHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0TWFwVHlwZUlkKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldFByb2plY3Rpb25cbiAgICovXG4gIGdldFByb2plY3Rpb24oKTogZ29vZ2xlLm1hcHMuUHJvamVjdGlvbnxudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRQcm9qZWN0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldFN0cmVldFZpZXdcbiAgICovXG4gIGdldFN0cmVldFZpZXcoKTogZ29vZ2xlLm1hcHMuU3RyZWV0Vmlld1Bhbm9yYW1hIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRTdHJlZXRWaWV3KCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldFRpbHRcbiAgICovXG4gIGdldFRpbHQoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRUaWx0KCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldFpvb21cbiAgICovXG4gIGdldFpvb20oKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRab29tKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmNvbnRyb2xzXG4gICAqL1xuICBnZXQgY29udHJvbHMoKTogZ29vZ2xlLm1hcHMuTVZDQXJyYXk8Tm9kZT5bXSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuY29udHJvbHM7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRhdGFcbiAgICovXG4gIGdldCBkYXRhKCk6IGdvb2dsZS5tYXBzLkRhdGEge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmRhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1hcFR5cGVzXG4gICAqL1xuICBnZXQgbWFwVHlwZXMoKTogZ29vZ2xlLm1hcHMuTWFwVHlwZVJlZ2lzdHJ5IHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5tYXBUeXBlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAub3ZlcmxheU1hcFR5cGVzXG4gICAqL1xuICBnZXQgb3ZlcmxheU1hcFR5cGVzKCk6IGdvb2dsZS5tYXBzLk1WQ0FycmF5PGdvb2dsZS5tYXBzLk1hcFR5cGU+IHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5vdmVybGF5TWFwVHlwZXM7XG4gIH1cblxuICBwcml2YXRlIF9zZXRTaXplKCkge1xuICAgIGlmICh0aGlzLl9tYXBFbCkge1xuICAgICAgY29uc3Qgc3R5bGVzID0gdGhpcy5fbWFwRWwuc3R5bGU7XG4gICAgICBzdHlsZXMuaGVpZ2h0ID1cbiAgICAgICAgICB0aGlzLmhlaWdodCA9PT0gbnVsbCA/ICcnIDogKGNvZXJjZUNzc1BpeGVsVmFsdWUodGhpcy5oZWlnaHQpIHx8IERFRkFVTFRfSEVJR0hUKTtcbiAgICAgIHN0eWxlcy53aWR0aCA9IHRoaXMud2lkdGggPT09IG51bGwgPyAnJyA6IChjb2VyY2VDc3NQaXhlbFZhbHVlKHRoaXMud2lkdGgpIHx8IERFRkFVTFRfV0lEVEgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDb21iaW5lcyB0aGUgY2VudGVyIGFuZCB6b29tIGFuZCB0aGUgb3RoZXIgbWFwIG9wdGlvbnMgaW50byBhIHNpbmdsZSBvYmplY3QgKi9cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBPcHRpb25zPiB7XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoW3RoaXMuX29wdGlvbnMsIHRoaXMuX2NlbnRlciwgdGhpcy5fem9vbV0pXG4gICAgICAgIC5waXBlKG1hcCgoW29wdGlvbnMsIGNlbnRlciwgem9vbV0pID0+IHtcbiAgICAgICAgICBjb25zdCBjb21iaW5lZE9wdGlvbnM6IGdvb2dsZS5tYXBzLk1hcE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgLy8gSXQncyBpbXBvcnRhbnQgdGhhdCB3ZSBzZXQgKipzb21lKioga2luZCBvZiBgY2VudGVyYCBhbmQgYHpvb21gLCBvdGhlcndpc2VcbiAgICAgICAgICAgIC8vIEdvb2dsZSBNYXBzIHdpbGwgcmVuZGVyIGEgYmxhbmsgcmVjdGFuZ2xlIHdoaWNoIGxvb2tzIGJyb2tlbi5cbiAgICAgICAgICAgIGNlbnRlcjogY2VudGVyIHx8IG9wdGlvbnMuY2VudGVyIHx8IERFRkFVTFRfT1BUSU9OUy5jZW50ZXIsXG4gICAgICAgICAgICB6b29tOiB6b29tID8/IG9wdGlvbnMuem9vbSA/PyBERUZBVUxUX09QVElPTlMuem9vbSxcbiAgICAgICAgICAgIG1hcFR5cGVJZDogdGhpcy5tYXBUeXBlSWRcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemVNYXAob3B0aW9uc0NoYW5nZXM6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwT3B0aW9ucz4pOlxuICAgICAgT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXA+IHtcbiAgICByZXR1cm4gb3B0aW9uc0NoYW5nZXMucGlwZShcbiAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgbWFwKG9wdGlvbnMgPT4ge1xuICAgICAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgICAgIHJldHVybiB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gbmV3IGdvb2dsZS5tYXBzLk1hcCh0aGlzLl9tYXBFbCwgb3B0aW9ucykpO1xuICAgICAgICB9KSxcbiAgICAgICAgc2hhcmVSZXBsYXkoMSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpIHtcbiAgICBjb21iaW5lTGF0ZXN0KFt0aGlzLl9nb29nbGVNYXBDaGFuZ2VzLCB0aGlzLl9vcHRpb25zXSlcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgICAuc3Vic2NyaWJlKChbZ29vZ2xlTWFwLCBvcHRpb25zXSkgPT4ge1xuICAgICAgICAgIGdvb2dsZU1hcC5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yQ2VudGVyQ2hhbmdlcygpIHtcbiAgICBjb21iaW5lTGF0ZXN0KFt0aGlzLl9nb29nbGVNYXBDaGFuZ2VzLCB0aGlzLl9jZW50ZXJdKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKFtnb29nbGVNYXAsIGNlbnRlcl0pID0+IHtcbiAgICAgICAgICBpZiAoY2VudGVyKSB7XG4gICAgICAgICAgICBnb29nbGVNYXAuc2V0Q2VudGVyKGNlbnRlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yWm9vbUNoYW5nZXMoKSB7XG4gICAgY29tYmluZUxhdGVzdChbdGhpcy5fZ29vZ2xlTWFwQ2hhbmdlcywgdGhpcy5fem9vbV0pXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgICAgLnN1YnNjcmliZSgoW2dvb2dsZU1hcCwgem9vbV0pID0+IHtcbiAgICAgICAgICBpZiAoem9vbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBnb29nbGVNYXAuc2V0Wm9vbSh6b29tKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEFzc2VydHMgdGhhdCB0aGUgbWFwIGhhcyBiZWVuIGluaXRpYWxpemVkLiAqL1xuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge2dvb2dsZU1hcDogZ29vZ2xlLm1hcHMuTWFwfSB7XG4gICAgaWYgKCF0aGlzLmdvb2dsZU1hcCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0Nhbm5vdCBhY2Nlc3MgR29vZ2xlIE1hcCBpbmZvcm1hdGlvbiBiZWZvcmUgdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBBUEkgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGNzc1VuaXRzUGF0dGVybiA9IC8oW0EtWmEteiVdKykkLztcblxuLyoqIENvZXJjZXMgYSB2YWx1ZSB0byBhIENTUyBwaXhlbCB2YWx1ZS4gKi9cbmZ1bmN0aW9uIGNvZXJjZUNzc1BpeGVsVmFsdWUodmFsdWU6IGFueSk6IHN0cmluZyB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmV0dXJuIGNzc1VuaXRzUGF0dGVybi50ZXN0KHZhbHVlKSA/IHZhbHVlIDogYCR7dmFsdWV9cHhgO1xufVxuIl19