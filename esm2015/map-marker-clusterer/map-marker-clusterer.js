/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="google.maps" />
/// <reference path="marker-clusterer-types.ts" />
import { ChangeDetectionStrategy, Component, ContentChildren, Input, NgZone, Output, QueryList, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import { MapMarker } from '../map-marker/map-marker';
/** Default options for a clusterer. */
const DEFAULT_CLUSTERER_OPTIONS = {};
/**
 * Angular component for implementing a Google Maps Marker Clusterer.
 *
 * See https://developers.google.com/maps/documentation/javascript/marker-clustering
 */
export class MapMarkerClusterer {
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
        this._currentMarkers = new Set();
        this._eventManager = new MapEventManager(this._ngZone);
        this._destroy = new Subject();
        this.ariaLabelFn = () => '';
        /**
         * See
         * googlemaps.github.io/v3-utility-library/modules/
         * _google_markerclustererplus.html#clusteringbegin
         */
        this.clusteringbegin = this._eventManager.getLazyEmitter('clusteringbegin');
        /**
         * See
         * googlemaps.github.io/v3-utility-library/modules/_google_markerclustererplus.html#clusteringend
         */
        this.clusteringend = this._eventManager.getLazyEmitter('clusteringend');
        /** Emits when a cluster has been clicked. */
        this.clusterClick = this._eventManager.getLazyEmitter('click');
        this._canInitialize = this._googleMap._isBrowser;
    }
    set averageCenter(averageCenter) {
        this._averageCenter = averageCenter;
    }
    set batchSizeIE(batchSizeIE) {
        this._batchSizeIE = batchSizeIE;
    }
    set calculator(calculator) {
        this._calculator = calculator;
    }
    set clusterClass(clusterClass) {
        this._clusterClass = clusterClass;
    }
    set enableRetinaIcons(enableRetinaIcons) {
        this._enableRetinaIcons = enableRetinaIcons;
    }
    set gridSize(gridSize) {
        this._gridSize = gridSize;
    }
    set ignoreHidden(ignoreHidden) {
        this._ignoreHidden = ignoreHidden;
    }
    set imageExtension(imageExtension) {
        this._imageExtension = imageExtension;
    }
    set imagePath(imagePath) {
        this._imagePath = imagePath;
    }
    set imageSizes(imageSizes) {
        this._imageSizes = imageSizes;
    }
    set maxZoom(maxZoom) {
        this._maxZoom = maxZoom;
    }
    set minimumClusterSize(minimumClusterSize) {
        this._minimumClusterSize = minimumClusterSize;
    }
    set styles(styles) {
        this._styles = styles;
    }
    set title(title) {
        this._title = title;
    }
    set zIndex(zIndex) {
        this._zIndex = zIndex;
    }
    set zoomOnClick(zoomOnClick) {
        this._zoomOnClick = zoomOnClick;
    }
    set options(options) {
        this._options = options;
    }
    ngOnInit() {
        if (this._canInitialize) {
            const clustererWindow = window;
            if (!clustererWindow.MarkerClusterer && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('MarkerClusterer class not found, cannot construct a marker cluster. ' +
                    'Please install the MarkerClustererPlus library: ' +
                    'https://github.com/googlemaps/js-markerclustererplus');
            }
            // Create the object outside the zone so its events don't trigger change detection.
            // We'll bring it back in inside the `MapEventManager` only for the events that the
            // user has subscribed to.
            this._ngZone.runOutsideAngular(() => {
                this.markerClusterer = new MarkerClusterer(this._googleMap.googleMap, [], this._combineOptions());
            });
            this._assertInitialized();
            this._eventManager.setTarget(this.markerClusterer);
        }
    }
    ngAfterContentInit() {
        if (this._canInitialize) {
            this._watchForMarkerChanges();
        }
    }
    ngOnChanges(changes) {
        const { markerClusterer: clusterer, ariaLabelFn, _averageCenter, _batchSizeIE, _calculator, _styles, _clusterClass, _enableRetinaIcons, _gridSize, _ignoreHidden, _imageExtension, _imagePath, _imageSizes, _maxZoom, _minimumClusterSize, _title, _zIndex, _zoomOnClick } = this;
        if (clusterer) {
            if (changes['options']) {
                clusterer.setOptions(this._combineOptions());
            }
            if (changes['ariaLabelFn']) {
                clusterer.ariaLabelFn = ariaLabelFn;
            }
            if (changes['averageCenter'] && _averageCenter !== undefined) {
                clusterer.setAverageCenter(_averageCenter);
            }
            if (changes['batchSizeIE'] && _batchSizeIE !== undefined) {
                clusterer.setBatchSizeIE(_batchSizeIE);
            }
            if (changes['calculator'] && !!_calculator) {
                clusterer.setCalculator(_calculator);
            }
            if (changes['clusterClass'] && _clusterClass !== undefined) {
                clusterer.setClusterClass(_clusterClass);
            }
            if (changes['enableRetinaIcons'] && _enableRetinaIcons !== undefined) {
                clusterer.setEnableRetinaIcons(_enableRetinaIcons);
            }
            if (changes['gridSize'] && _gridSize !== undefined) {
                clusterer.setGridSize(_gridSize);
            }
            if (changes['ignoreHidden'] && _ignoreHidden !== undefined) {
                clusterer.setIgnoreHidden(_ignoreHidden);
            }
            if (changes['imageExtension'] && _imageExtension !== undefined) {
                clusterer.setImageExtension(_imageExtension);
            }
            if (changes['imagePath'] && _imagePath !== undefined) {
                clusterer.setImagePath(_imagePath);
            }
            if (changes['imageSizes'] && _imageSizes) {
                clusterer.setImageSizes(_imageSizes);
            }
            if (changes['maxZoom'] && _maxZoom !== undefined) {
                clusterer.setMaxZoom(_maxZoom);
            }
            if (changes['minimumClusterSize'] && _minimumClusterSize !== undefined) {
                clusterer.setMinimumClusterSize(_minimumClusterSize);
            }
            if (changes['styles'] && _styles) {
                clusterer.setStyles(_styles);
            }
            if (changes['title'] && _title !== undefined) {
                clusterer.setTitle(_title);
            }
            if (changes['zIndex'] && _zIndex !== undefined) {
                clusterer.setZIndex(_zIndex);
            }
            if (changes['zoomOnClick'] && _zoomOnClick !== undefined) {
                clusterer.setZoomOnClick(_zoomOnClick);
            }
        }
    }
    ngOnDestroy() {
        this._destroy.next();
        this._destroy.complete();
        this._eventManager.destroy();
        if (this.markerClusterer) {
            this.markerClusterer.setMap(null);
        }
    }
    fitMapToMarkers(padding) {
        this._assertInitialized();
        this.markerClusterer.fitMapToMarkers(padding);
    }
    getAverageCenter() {
        this._assertInitialized();
        return this.markerClusterer.getAverageCenter();
    }
    getBatchSizeIE() {
        this._assertInitialized();
        return this.markerClusterer.getBatchSizeIE();
    }
    getCalculator() {
        this._assertInitialized();
        return this.markerClusterer.getCalculator();
    }
    getClusterClass() {
        this._assertInitialized();
        return this.markerClusterer.getClusterClass();
    }
    getClusters() {
        this._assertInitialized();
        return this.markerClusterer.getClusters();
    }
    getEnableRetinaIcons() {
        this._assertInitialized();
        return this.markerClusterer.getEnableRetinaIcons();
    }
    getGridSize() {
        this._assertInitialized();
        return this.markerClusterer.getGridSize();
    }
    getIgnoreHidden() {
        this._assertInitialized();
        return this.markerClusterer.getIgnoreHidden();
    }
    getImageExtension() {
        this._assertInitialized();
        return this.markerClusterer.getImageExtension();
    }
    getImagePath() {
        this._assertInitialized();
        return this.markerClusterer.getImagePath();
    }
    getImageSizes() {
        this._assertInitialized();
        return this.markerClusterer.getImageSizes();
    }
    getMaxZoom() {
        this._assertInitialized();
        return this.markerClusterer.getMaxZoom();
    }
    getMinimumClusterSize() {
        this._assertInitialized();
        return this.markerClusterer.getMinimumClusterSize();
    }
    getStyles() {
        this._assertInitialized();
        return this.markerClusterer.getStyles();
    }
    getTitle() {
        this._assertInitialized();
        return this.markerClusterer.getTitle();
    }
    getTotalClusters() {
        this._assertInitialized();
        return this.markerClusterer.getTotalClusters();
    }
    getTotalMarkers() {
        this._assertInitialized();
        return this.markerClusterer.getTotalMarkers();
    }
    getZIndex() {
        this._assertInitialized();
        return this.markerClusterer.getZIndex();
    }
    getZoomOnClick() {
        this._assertInitialized();
        return this.markerClusterer.getZoomOnClick();
    }
    _combineOptions() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        const options = this._options || DEFAULT_CLUSTERER_OPTIONS;
        return Object.assign(Object.assign({}, options), { ariaLabelFn: (_a = this.ariaLabelFn) !== null && _a !== void 0 ? _a : options.ariaLabelFn, averageCenter: (_b = this._averageCenter) !== null && _b !== void 0 ? _b : options.averageCenter, batchSize: (_c = this.batchSize) !== null && _c !== void 0 ? _c : options.batchSize, batchSizeIE: (_d = this._batchSizeIE) !== null && _d !== void 0 ? _d : options.batchSizeIE, calculator: (_e = this._calculator) !== null && _e !== void 0 ? _e : options.calculator, clusterClass: (_f = this._clusterClass) !== null && _f !== void 0 ? _f : options.clusterClass, enableRetinaIcons: (_g = this._enableRetinaIcons) !== null && _g !== void 0 ? _g : options.enableRetinaIcons, gridSize: (_h = this._gridSize) !== null && _h !== void 0 ? _h : options.gridSize, ignoreHidden: (_j = this._ignoreHidden) !== null && _j !== void 0 ? _j : options.ignoreHidden, imageExtension: (_k = this._imageExtension) !== null && _k !== void 0 ? _k : options.imageExtension, imagePath: (_l = this._imagePath) !== null && _l !== void 0 ? _l : options.imagePath, imageSizes: (_m = this._imageSizes) !== null && _m !== void 0 ? _m : options.imageSizes, maxZoom: (_o = this._maxZoom) !== null && _o !== void 0 ? _o : options.maxZoom, minimumClusterSize: (_p = this._minimumClusterSize) !== null && _p !== void 0 ? _p : options.minimumClusterSize, styles: (_q = this._styles) !== null && _q !== void 0 ? _q : options.styles, title: (_r = this._title) !== null && _r !== void 0 ? _r : options.title, zIndex: (_s = this._zIndex) !== null && _s !== void 0 ? _s : options.zIndex, zoomOnClick: (_t = this._zoomOnClick) !== null && _t !== void 0 ? _t : options.zoomOnClick });
    }
    _watchForMarkerChanges() {
        this._assertInitialized();
        const initialMarkers = [];
        for (const marker of this._getInternalMarkers(this._markers.toArray())) {
            this._currentMarkers.add(marker);
            initialMarkers.push(marker);
        }
        this.markerClusterer.addMarkers(initialMarkers);
        this._markers.changes.pipe(takeUntil(this._destroy)).subscribe((markerComponents) => {
            this._assertInitialized();
            const newMarkers = new Set(this._getInternalMarkers(markerComponents));
            const markersToAdd = [];
            const markersToRemove = [];
            for (const marker of Array.from(newMarkers)) {
                if (!this._currentMarkers.has(marker)) {
                    this._currentMarkers.add(marker);
                    markersToAdd.push(marker);
                }
            }
            for (const marker of Array.from(this._currentMarkers)) {
                if (!newMarkers.has(marker)) {
                    markersToRemove.push(marker);
                }
            }
            this.markerClusterer.addMarkers(markersToAdd, true);
            this.markerClusterer.removeMarkers(markersToRemove, true);
            this.markerClusterer.repaint();
            for (const marker of markersToRemove) {
                this._currentMarkers.delete(marker);
            }
        });
    }
    _getInternalMarkers(markers) {
        return markers.filter(markerComponent => !!markerComponent.marker)
            .map(markerComponent => markerComponent.marker);
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this._googleMap.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.markerClusterer) {
                throw Error('Cannot interact with a MarkerClusterer before it has been initialized. ' +
                    'Please wait for the MarkerClusterer to load before trying to interact with it.');
            }
        }
    }
}
MapMarkerClusterer.decorators = [
    { type: Component, args: [{
                selector: 'map-marker-clusterer',
                exportAs: 'mapMarkerClusterer',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: '<ng-content></ng-content>',
                encapsulation: ViewEncapsulation.None
            },] }
];
MapMarkerClusterer.ctorParameters = () => [
    { type: GoogleMap },
    { type: NgZone }
];
MapMarkerClusterer.propDecorators = {
    ariaLabelFn: [{ type: Input }],
    averageCenter: [{ type: Input }],
    batchSize: [{ type: Input }],
    batchSizeIE: [{ type: Input }],
    calculator: [{ type: Input }],
    clusterClass: [{ type: Input }],
    enableRetinaIcons: [{ type: Input }],
    gridSize: [{ type: Input }],
    ignoreHidden: [{ type: Input }],
    imageExtension: [{ type: Input }],
    imagePath: [{ type: Input }],
    imageSizes: [{ type: Input }],
    maxZoom: [{ type: Input }],
    minimumClusterSize: [{ type: Input }],
    styles: [{ type: Input }],
    title: [{ type: Input }],
    zIndex: [{ type: Input }],
    zoomOnClick: [{ type: Input }],
    options: [{ type: Input }],
    clusteringbegin: [{ type: Output }],
    clusteringend: [{ type: Output }],
    clusterClick: [{ type: Output }],
    _markers: [{ type: ContentChildren, args: [MapMarker, { descendants: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci1jbHVzdGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLW1hcmtlci1jbHVzdGVyZXIvbWFwLW1hcmtlci1jbHVzdGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLHFDQUFxQztBQUNyQyxrREFBa0Q7QUFFbEQsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUNmLEtBQUssRUFDTCxNQUFNLEVBSU4sTUFBTSxFQUNOLFNBQVMsRUFFVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXpDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBRW5ELHVDQUF1QztBQUN2QyxNQUFNLHlCQUF5QixHQUEyQixFQUFFLENBQUM7QUFFN0Q7Ozs7R0FJRztBQVFILE1BQU0sT0FBTyxrQkFBa0I7SUFpSjdCLFlBQTZCLFVBQXFCLEVBQW1CLE9BQWU7UUFBdkQsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUFtQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBaEpuRSxvQkFBZSxHQUFHLElBQUksR0FBRyxFQUFzQixDQUFDO1FBQ2hELGtCQUFhLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBTWhELGdCQUFXLEdBQWdCLEdBQUcsRUFBRSxDQUFD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LFNBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwibWFya2VyLWNsdXN0ZXJlci10eXBlcy50c1wiIC8+XG5cbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcbmltcG9ydCB7TWFwTWFya2VyfSBmcm9tICcuLi9tYXAtbWFya2VyL21hcC1tYXJrZXInO1xuXG4vKiogRGVmYXVsdCBvcHRpb25zIGZvciBhIGNsdXN0ZXJlci4gKi9cbmNvbnN0IERFRkFVTFRfQ0xVU1RFUkVSX09QVElPTlM6IE1hcmtlckNsdXN0ZXJlck9wdGlvbnMgPSB7fTtcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCBmb3IgaW1wbGVtZW50aW5nIGEgR29vZ2xlIE1hcHMgTWFya2VyIENsdXN0ZXJlci5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvbWFya2VyLWNsdXN0ZXJpbmdcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWFwLW1hcmtlci1jbHVzdGVyZXInLFxuICBleHBvcnRBczogJ21hcE1hcmtlckNsdXN0ZXJlcicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBNYXJrZXJDbHVzdGVyZXIgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSByZWFkb25seSBfY3VycmVudE1hcmtlcnMgPSBuZXcgU2V0PGdvb2dsZS5tYXBzLk1hcmtlcj4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcih0aGlzLl9uZ1pvbmUpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogV2hldGhlciB0aGUgY2x1c3RlcmVyIGlzIGFsbG93ZWQgdG8gYmUgaW5pdGlhbGl6ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2NhbkluaXRpYWxpemU6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgYXJpYUxhYmVsRm46IEFyaWFMYWJlbEZuID0gKCkgPT4gJydcblxuICBASW5wdXQoKVxuICBzZXQgYXZlcmFnZUNlbnRlcihhdmVyYWdlQ2VudGVyOiBib29sZWFuKSB7XG4gICAgdGhpcy5fYXZlcmFnZUNlbnRlciA9IGF2ZXJhZ2VDZW50ZXI7XG4gIH1cbiAgcHJpdmF0ZSBfYXZlcmFnZUNlbnRlcjogYm9vbGVhbjtcblxuICBASW5wdXQoKSBiYXRjaFNpemU/OiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IGJhdGNoU2l6ZUlFKGJhdGNoU2l6ZUlFOiBudW1iZXIpIHtcbiAgICB0aGlzLl9iYXRjaFNpemVJRSA9IGJhdGNoU2l6ZUlFO1xuICB9XG4gIHByaXZhdGUgX2JhdGNoU2l6ZUlFOiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IGNhbGN1bGF0b3IoY2FsY3VsYXRvcjogQ2FsY3VsYXRvcikge1xuICAgIHRoaXMuX2NhbGN1bGF0b3IgPSBjYWxjdWxhdG9yO1xuICB9XG4gIHByaXZhdGUgX2NhbGN1bGF0b3I6IENhbGN1bGF0b3I7XG5cbiAgQElucHV0KClcbiAgc2V0IGNsdXN0ZXJDbGFzcyhjbHVzdGVyQ2xhc3M6IHN0cmluZykge1xuICAgIHRoaXMuX2NsdXN0ZXJDbGFzcyA9IGNsdXN0ZXJDbGFzcztcbiAgfVxuICBwcml2YXRlIF9jbHVzdGVyQ2xhc3M6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBzZXQgZW5hYmxlUmV0aW5hSWNvbnMoZW5hYmxlUmV0aW5hSWNvbnM6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbmFibGVSZXRpbmFJY29ucyA9IGVuYWJsZVJldGluYUljb25zO1xuICB9XG4gIHByaXZhdGUgX2VuYWJsZVJldGluYUljb25zOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBncmlkU2l6ZShncmlkU2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fZ3JpZFNpemUgPSBncmlkU2l6ZTtcbiAgfVxuICBwcml2YXRlIF9ncmlkU2l6ZTogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBpZ25vcmVIaWRkZW4oaWdub3JlSGlkZGVuOiBib29sZWFuKSB7XG4gICAgdGhpcy5faWdub3JlSGlkZGVuID0gaWdub3JlSGlkZGVuO1xuICB9XG4gIHByaXZhdGUgX2lnbm9yZUhpZGRlbjogYm9vbGVhbjtcblxuICBASW5wdXQoKVxuICBzZXQgaW1hZ2VFeHRlbnNpb24oaW1hZ2VFeHRlbnNpb246IHN0cmluZykge1xuICAgIHRoaXMuX2ltYWdlRXh0ZW5zaW9uID0gaW1hZ2VFeHRlbnNpb247XG4gIH1cbiAgcHJpdmF0ZSBfaW1hZ2VFeHRlbnNpb246IHN0cmluZztcblxuICBASW5wdXQoKVxuICBzZXQgaW1hZ2VQYXRoKGltYWdlUGF0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5faW1hZ2VQYXRoID0gaW1hZ2VQYXRoO1xuICB9XG4gIHByaXZhdGUgX2ltYWdlUGF0aDogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBpbWFnZVNpemVzKGltYWdlU2l6ZXM6IG51bWJlcltdKSB7XG4gICAgdGhpcy5faW1hZ2VTaXplcyA9IGltYWdlU2l6ZXM7XG4gIH1cbiAgcHJpdmF0ZSBfaW1hZ2VTaXplczogbnVtYmVyW107XG5cbiAgQElucHV0KClcbiAgc2V0IG1heFpvb20obWF4Wm9vbTogbnVtYmVyKSB7XG4gICAgdGhpcy5fbWF4Wm9vbSA9IG1heFpvb207XG4gIH1cbiAgcHJpdmF0ZSBfbWF4Wm9vbTogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBtaW5pbXVtQ2x1c3RlclNpemUobWluaW11bUNsdXN0ZXJTaXplOiBudW1iZXIpIHtcbiAgICB0aGlzLl9taW5pbXVtQ2x1c3RlclNpemUgPSBtaW5pbXVtQ2x1c3RlclNpemU7XG4gIH1cbiAgcHJpdmF0ZSBfbWluaW11bUNsdXN0ZXJTaXplOiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IHN0eWxlcyhzdHlsZXM6IENsdXN0ZXJJY29uU3R5bGVbXSkge1xuICAgIHRoaXMuX3N0eWxlcyA9IHN0eWxlcztcbiAgfVxuICBwcml2YXRlIF9zdHlsZXM6IENsdXN0ZXJJY29uU3R5bGVbXTtcblxuICBASW5wdXQoKVxuICBzZXQgdGl0bGUodGl0bGU6IHN0cmluZykge1xuICAgIHRoaXMuX3RpdGxlID0gdGl0bGU7XG4gIH1cbiAgcHJpdmF0ZSBfdGl0bGU6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBzZXQgekluZGV4KHpJbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5fekluZGV4ID0gekluZGV4O1xuICB9XG4gIHByaXZhdGUgX3pJbmRleDogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCB6b29tT25DbGljayh6b29tT25DbGljazogYm9vbGVhbikge1xuICAgIHRoaXMuX3pvb21PbkNsaWNrID0gem9vbU9uQ2xpY2s7XG4gIH1cbiAgcHJpdmF0ZSBfem9vbU9uQ2xpY2s6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogTWFya2VyQ2x1c3RlcmVyT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICB9XG4gIHByaXZhdGUgX29wdGlvbnM6IE1hcmtlckNsdXN0ZXJlck9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBnb29nbGVtYXBzLmdpdGh1Yi5pby92My11dGlsaXR5LWxpYnJhcnkvbW9kdWxlcy9cbiAgICogX2dvb2dsZV9tYXJrZXJjbHVzdGVyZXJwbHVzLmh0bWwjY2x1c3RlcmluZ2JlZ2luXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2x1c3RlcmluZ2JlZ2luOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2x1c3RlcmluZ2JlZ2luJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBnb29nbGVtYXBzLmdpdGh1Yi5pby92My11dGlsaXR5LWxpYnJhcnkvbW9kdWxlcy9fZ29vZ2xlX21hcmtlcmNsdXN0ZXJlcnBsdXMuaHRtbCNjbHVzdGVyaW5nZW5kXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2x1c3RlcmluZ2VuZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2NsdXN0ZXJpbmdlbmQnKTtcblxuICAvKiogRW1pdHMgd2hlbiBhIGNsdXN0ZXIgaGFzIGJlZW4gY2xpY2tlZC4gKi9cbiAgQE91dHB1dCgpXG4gIHJlYWRvbmx5IGNsdXN0ZXJDbGljazogT2JzZXJ2YWJsZTxDbHVzdGVyPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxDbHVzdGVyPignY2xpY2snKTtcblxuICBAQ29udGVudENoaWxkcmVuKE1hcE1hcmtlciwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX21hcmtlcnM6IFF1ZXJ5TGlzdDxNYXBNYXJrZXI+O1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBNYXJrZXJDbHVzdGVyZXIgb2JqZWN0LlxuICAgKlxuICAgKiBTZWVcbiAgICogZ29vZ2xlbWFwcy5naXRodWIuaW8vdjMtdXRpbGl0eS1saWJyYXJ5L2NsYXNzZXMvXG4gICAqIF9nb29nbGVfbWFya2VyY2x1c3RlcmVycGx1cy5tYXJrZXJjbHVzdGVyZXIuaHRtbFxuICAgKi9cbiAgbWFya2VyQ2x1c3RlcmVyPzogTWFya2VyQ2x1c3RlcmVyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX2dvb2dsZU1hcDogR29vZ2xlTWFwLCBwcml2YXRlIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSkge1xuICAgIHRoaXMuX2NhbkluaXRpYWxpemUgPSB0aGlzLl9nb29nbGVNYXAuX2lzQnJvd3NlcjtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9jYW5Jbml0aWFsaXplKSB7XG4gICAgICBjb25zdCBjbHVzdGVyZXJXaW5kb3cgPVxuICAgICAgICB3aW5kb3cgYXMgdW5rbm93biBhcyB0eXBlb2YgZ2xvYmFsVGhpcyAmIHtNYXJrZXJDbHVzdGVyZXI/OiBNYXJrZXJDbHVzdGVyZXJ9O1xuXG4gICAgICBpZiAoIWNsdXN0ZXJlcldpbmRvdy5NYXJrZXJDbHVzdGVyZXIgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAnTWFya2VyQ2x1c3RlcmVyIGNsYXNzIG5vdCBmb3VuZCwgY2Fubm90IGNvbnN0cnVjdCBhIG1hcmtlciBjbHVzdGVyLiAnICtcbiAgICAgICAgICAgICdQbGVhc2UgaW5zdGFsbCB0aGUgTWFya2VyQ2x1c3RlcmVyUGx1cyBsaWJyYXJ5OiAnICtcbiAgICAgICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlbWFwcy9qcy1tYXJrZXJjbHVzdGVyZXJwbHVzJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyID0gbmV3IE1hcmtlckNsdXN0ZXJlcih0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwISwgW10sXG4gICAgICAgICAgICB0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLm1hcmtlckNsdXN0ZXJlcik7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIGlmICh0aGlzLl9jYW5Jbml0aWFsaXplKSB7XG4gICAgICB0aGlzLl93YXRjaEZvck1hcmtlckNoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3Qge1xuICAgICAgbWFya2VyQ2x1c3RlcmVyOiBjbHVzdGVyZXIsIGFyaWFMYWJlbEZuLCBfYXZlcmFnZUNlbnRlciwgX2JhdGNoU2l6ZUlFLCBfY2FsY3VsYXRvciwgX3N0eWxlcyxcbiAgICAgIF9jbHVzdGVyQ2xhc3MsIF9lbmFibGVSZXRpbmFJY29ucywgX2dyaWRTaXplLCBfaWdub3JlSGlkZGVuLCBfaW1hZ2VFeHRlbnNpb24sIF9pbWFnZVBhdGgsXG4gICAgICBfaW1hZ2VTaXplcywgX21heFpvb20sIF9taW5pbXVtQ2x1c3RlclNpemUsIF90aXRsZSwgX3pJbmRleCwgX3pvb21PbkNsaWNrXG4gICAgfSA9IHRoaXM7XG5cbiAgICBpZiAoY2x1c3RlcmVyKSB7XG4gICAgICBpZiAoY2hhbmdlc1snb3B0aW9ucyddKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRPcHRpb25zKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2FyaWFMYWJlbEZuJ10pIHtcbiAgICAgICAgY2x1c3RlcmVyLmFyaWFMYWJlbEZuID0gYXJpYUxhYmVsRm47XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snYXZlcmFnZUNlbnRlciddICYmIF9hdmVyYWdlQ2VudGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldEF2ZXJhZ2VDZW50ZXIoX2F2ZXJhZ2VDZW50ZXIpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2JhdGNoU2l6ZUlFJ10gJiYgX2JhdGNoU2l6ZUlFICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldEJhdGNoU2l6ZUlFKF9iYXRjaFNpemVJRSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snY2FsY3VsYXRvciddICYmICEhX2NhbGN1bGF0b3IpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldENhbGN1bGF0b3IoX2NhbGN1bGF0b3IpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2NsdXN0ZXJDbGFzcyddICYmIF9jbHVzdGVyQ2xhc3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0Q2x1c3RlckNsYXNzKF9jbHVzdGVyQ2xhc3MpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2VuYWJsZVJldGluYUljb25zJ10gJiYgX2VuYWJsZVJldGluYUljb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldEVuYWJsZVJldGluYUljb25zKF9lbmFibGVSZXRpbmFJY29ucyk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snZ3JpZFNpemUnXSAmJiBfZ3JpZFNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0R3JpZFNpemUoX2dyaWRTaXplKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydpZ25vcmVIaWRkZW4nXSAmJiBfaWdub3JlSGlkZGVuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldElnbm9yZUhpZGRlbihfaWdub3JlSGlkZGVuKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydpbWFnZUV4dGVuc2lvbiddICYmIF9pbWFnZUV4dGVuc2lvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRJbWFnZUV4dGVuc2lvbihfaW1hZ2VFeHRlbnNpb24pO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2ltYWdlUGF0aCddICYmIF9pbWFnZVBhdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0SW1hZ2VQYXRoKF9pbWFnZVBhdGgpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2ltYWdlU2l6ZXMnXSAmJiBfaW1hZ2VTaXplcykge1xuICAgICAgICBjbHVzdGVyZXIuc2V0SW1hZ2VTaXplcyhfaW1hZ2VTaXplcyk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snbWF4Wm9vbSddICYmIF9tYXhab29tICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldE1heFpvb20oX21heFpvb20pO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ21pbmltdW1DbHVzdGVyU2l6ZSddICYmIF9taW5pbXVtQ2x1c3RlclNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0TWluaW11bUNsdXN0ZXJTaXplKF9taW5pbXVtQ2x1c3RlclNpemUpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ3N0eWxlcyddICYmIF9zdHlsZXMpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldFN0eWxlcyhfc3R5bGVzKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWyd0aXRsZSddICYmIF90aXRsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRUaXRsZShfdGl0bGUpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ3pJbmRleCddICYmIF96SW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0WkluZGV4KF96SW5kZXgpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ3pvb21PbkNsaWNrJ10gJiYgX3pvb21PbkNsaWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldFpvb21PbkNsaWNrKF96b29tT25DbGljayk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveS5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveS5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgaWYgKHRoaXMubWFya2VyQ2x1c3RlcmVyKSB7XG4gICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgZml0TWFwVG9NYXJrZXJzKHBhZGRpbmc6IG51bWJlcnxnb29nbGUubWFwcy5QYWRkaW5nKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5maXRNYXBUb01hcmtlcnMocGFkZGluZyk7XG4gIH1cblxuICBnZXRBdmVyYWdlQ2VudGVyKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEF2ZXJhZ2VDZW50ZXIoKTtcbiAgfVxuXG4gIGdldEJhdGNoU2l6ZUlFKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0QmF0Y2hTaXplSUUoKTtcbiAgfVxuXG4gIGdldENhbGN1bGF0b3IoKTogQ2FsY3VsYXRvciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0Q2FsY3VsYXRvcigpO1xuICB9XG5cbiAgZ2V0Q2x1c3RlckNsYXNzKCk6IHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0Q2x1c3RlckNsYXNzKCk7XG4gIH1cblxuICBnZXRDbHVzdGVycygpOiBDbHVzdGVyW10ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldENsdXN0ZXJzKCk7XG4gIH1cblxuICBnZXRFbmFibGVSZXRpbmFJY29ucygpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRFbmFibGVSZXRpbmFJY29ucygpO1xuICB9XG5cbiAgZ2V0R3JpZFNpemUoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRHcmlkU2l6ZSgpO1xuICB9XG5cbiAgZ2V0SWdub3JlSGlkZGVuKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldElnbm9yZUhpZGRlbigpO1xuICB9XG5cbiAgZ2V0SW1hZ2VFeHRlbnNpb24oKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRJbWFnZUV4dGVuc2lvbigpO1xuICB9XG5cbiAgZ2V0SW1hZ2VQYXRoKCk6IHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0SW1hZ2VQYXRoKCk7XG4gIH1cblxuICBnZXRJbWFnZVNpemVzKCk6IG51bWJlcltdIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRJbWFnZVNpemVzKCk7XG4gIH1cblxuICBnZXRNYXhab29tKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0TWF4Wm9vbSgpO1xuICB9XG5cbiAgZ2V0TWluaW11bUNsdXN0ZXJTaXplKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0TWluaW11bUNsdXN0ZXJTaXplKCk7XG4gIH1cblxuICBnZXRTdHlsZXMoKTogQ2x1c3Rlckljb25TdHlsZVtdIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRTdHlsZXMoKTtcbiAgfVxuXG4gIGdldFRpdGxlKCk6IHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0VGl0bGUoKTtcbiAgfVxuXG4gIGdldFRvdGFsQ2x1c3RlcnMoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRUb3RhbENsdXN0ZXJzKCk7XG4gIH1cblxuICBnZXRUb3RhbE1hcmtlcnMoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRUb3RhbE1hcmtlcnMoKTtcbiAgfVxuXG4gIGdldFpJbmRleCgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFpJbmRleCgpO1xuICB9XG5cbiAgZ2V0Wm9vbU9uQ2xpY2soKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0Wm9vbU9uQ2xpY2soKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE1hcmtlckNsdXN0ZXJlck9wdGlvbnMge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zIHx8IERFRkFVTFRfQ0xVU1RFUkVSX09QVElPTlM7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBhcmlhTGFiZWxGbjogdGhpcy5hcmlhTGFiZWxGbiA/PyBvcHRpb25zLmFyaWFMYWJlbEZuLFxuICAgICAgYXZlcmFnZUNlbnRlcjogdGhpcy5fYXZlcmFnZUNlbnRlciA/PyBvcHRpb25zLmF2ZXJhZ2VDZW50ZXIsXG4gICAgICBiYXRjaFNpemU6IHRoaXMuYmF0Y2hTaXplID8/IG9wdGlvbnMuYmF0Y2hTaXplLFxuICAgICAgYmF0Y2hTaXplSUU6IHRoaXMuX2JhdGNoU2l6ZUlFID8/IG9wdGlvbnMuYmF0Y2hTaXplSUUsXG4gICAgICBjYWxjdWxhdG9yOiB0aGlzLl9jYWxjdWxhdG9yID8/IG9wdGlvbnMuY2FsY3VsYXRvcixcbiAgICAgIGNsdXN0ZXJDbGFzczogdGhpcy5fY2x1c3RlckNsYXNzID8/IG9wdGlvbnMuY2x1c3RlckNsYXNzLFxuICAgICAgZW5hYmxlUmV0aW5hSWNvbnM6IHRoaXMuX2VuYWJsZVJldGluYUljb25zID8/IG9wdGlvbnMuZW5hYmxlUmV0aW5hSWNvbnMsXG4gICAgICBncmlkU2l6ZTogdGhpcy5fZ3JpZFNpemUgPz8gb3B0aW9ucy5ncmlkU2l6ZSxcbiAgICAgIGlnbm9yZUhpZGRlbjogdGhpcy5faWdub3JlSGlkZGVuID8/IG9wdGlvbnMuaWdub3JlSGlkZGVuLFxuICAgICAgaW1hZ2VFeHRlbnNpb246IHRoaXMuX2ltYWdlRXh0ZW5zaW9uID8/IG9wdGlvbnMuaW1hZ2VFeHRlbnNpb24sXG4gICAgICBpbWFnZVBhdGg6IHRoaXMuX2ltYWdlUGF0aCA/PyBvcHRpb25zLmltYWdlUGF0aCxcbiAgICAgIGltYWdlU2l6ZXM6IHRoaXMuX2ltYWdlU2l6ZXMgPz8gb3B0aW9ucy5pbWFnZVNpemVzLFxuICAgICAgbWF4Wm9vbTogdGhpcy5fbWF4Wm9vbSA/PyBvcHRpb25zLm1heFpvb20sXG4gICAgICBtaW5pbXVtQ2x1c3RlclNpemU6IHRoaXMuX21pbmltdW1DbHVzdGVyU2l6ZSA/PyBvcHRpb25zLm1pbmltdW1DbHVzdGVyU2l6ZSxcbiAgICAgIHN0eWxlczogdGhpcy5fc3R5bGVzID8/IG9wdGlvbnMuc3R5bGVzLFxuICAgICAgdGl0bGU6IHRoaXMuX3RpdGxlID8/IG9wdGlvbnMudGl0bGUsXG4gICAgICB6SW5kZXg6IHRoaXMuX3pJbmRleCA/PyBvcHRpb25zLnpJbmRleCxcbiAgICAgIHpvb21PbkNsaWNrOiB0aGlzLl96b29tT25DbGljayA/PyBvcHRpb25zLnpvb21PbkNsaWNrLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck1hcmtlckNoYW5nZXMoKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICBjb25zdCBpbml0aWFsTWFya2VyczogZ29vZ2xlLm1hcHMuTWFya2VyW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiB0aGlzLl9nZXRJbnRlcm5hbE1hcmtlcnModGhpcy5fbWFya2Vycy50b0FycmF5KCkpKSB7XG4gICAgICB0aGlzLl9jdXJyZW50TWFya2Vycy5hZGQobWFya2VyKTtcbiAgICAgIGluaXRpYWxNYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICB9XG4gICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuYWRkTWFya2Vycyhpbml0aWFsTWFya2Vycyk7XG5cbiAgICB0aGlzLl9tYXJrZXJzLmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShcbiAgICAgIChtYXJrZXJDb21wb25lbnRzOiBNYXBNYXJrZXJbXSkgPT4ge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICBjb25zdCBuZXdNYXJrZXJzID0gbmV3IFNldDxnb29nbGUubWFwcy5NYXJrZXI+KHRoaXMuX2dldEludGVybmFsTWFya2VycyhtYXJrZXJDb21wb25lbnRzKSk7XG4gICAgICAgIGNvbnN0IG1hcmtlcnNUb0FkZDogZ29vZ2xlLm1hcHMuTWFya2VyW10gPSBbXTtcbiAgICAgICAgY29uc3QgbWFya2Vyc1RvUmVtb3ZlOiBnb29nbGUubWFwcy5NYXJrZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiBBcnJheS5mcm9tKG5ld01hcmtlcnMpKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLl9jdXJyZW50TWFya2Vycy5oYXMobWFya2VyKSkge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudE1hcmtlcnMuYWRkKG1hcmtlcik7XG4gICAgICAgICAgICBtYXJrZXJzVG9BZGQucHVzaChtYXJrZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiBBcnJheS5mcm9tKHRoaXMuX2N1cnJlbnRNYXJrZXJzKSkge1xuICAgICAgICAgIGlmICghbmV3TWFya2Vycy5oYXMobWFya2VyKSkge1xuICAgICAgICAgICAgbWFya2Vyc1RvUmVtb3ZlLnB1c2gobWFya2VyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuYWRkTWFya2VycyhtYXJrZXJzVG9BZGQsIHRydWUpO1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5yZW1vdmVNYXJrZXJzKG1hcmtlcnNUb1JlbW92ZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnJlcGFpbnQoKTtcbiAgICAgICAgZm9yIChjb25zdCBtYXJrZXIgb2YgbWFya2Vyc1RvUmVtb3ZlKSB7XG4gICAgICAgICAgdGhpcy5fY3VycmVudE1hcmtlcnMuZGVsZXRlKG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEludGVybmFsTWFya2VycyhtYXJrZXJzOiBNYXBNYXJrZXJbXSk6IGdvb2dsZS5tYXBzLk1hcmtlcltdIHtcbiAgICByZXR1cm4gbWFya2Vycy5maWx0ZXIobWFya2VyQ29tcG9uZW50ID0+ICEhbWFya2VyQ29tcG9uZW50Lm1hcmtlcilcbiAgICAgICAgLm1hcChtYXJrZXJDb21wb25lbnQgPT4gbWFya2VyQ29tcG9uZW50Lm1hcmtlciEpO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHttYXJrZXJDbHVzdGVyZXI6IE1hcmtlckNsdXN0ZXJlcn0ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBBUEkgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMubWFya2VyQ2x1c3RlcmVyKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIE1hcmtlckNsdXN0ZXJlciBiZWZvcmUgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIE1hcmtlckNsdXN0ZXJlciB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==