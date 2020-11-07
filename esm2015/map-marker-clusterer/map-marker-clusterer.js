/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
/// <reference path="marker-clusterer-types.ts" />
import { ChangeDetectionStrategy, Component, ContentChildren, Input, NgZone, Output, QueryList, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import { MapMarker } from '../map-marker/map-marker';
/**
 * Angular component for implementing a Google Maps Marker Clusterer.
 *
 * See https://developers.google.com/maps/documentation/javascript/marker-clustering
 */
export class MapMarkerClusterer {
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
        this._ariaLabelFn = new BehaviorSubject(undefined);
        this._averageCenter = new BehaviorSubject(undefined);
        this._batchSizeIE = new BehaviorSubject(undefined);
        this._calculator = new BehaviorSubject(undefined);
        this._clusterClass = new BehaviorSubject(undefined);
        this._enableRetinalIcons = new BehaviorSubject(undefined);
        this._gridSize = new BehaviorSubject(undefined);
        this._ignoreHidden = new BehaviorSubject(undefined);
        this._imageExtension = new BehaviorSubject(undefined);
        this._imagePath = new BehaviorSubject(undefined);
        this._imageSizes = new BehaviorSubject(undefined);
        this._maxZoom = new BehaviorSubject(undefined);
        this._minimumClusterSize = new BehaviorSubject(undefined);
        this._styles = new BehaviorSubject(undefined);
        this._title = new BehaviorSubject(undefined);
        this._zIndex = new BehaviorSubject(undefined);
        this._zoomOnClick = new BehaviorSubject(undefined);
        this._currentMarkers = new Set();
        this._eventManager = new MapEventManager(this._ngZone);
        this._destroy = new Subject();
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
    }
    get ariaLabelFn() {
        return this.markerClusterer ? this.markerClusterer.ariaLabelFn : () => '';
    }
    set ariaLabelFn(ariaLabelFn) {
        this._ariaLabelFn.next(ariaLabelFn);
    }
    set averageCenter(averageCenter) {
        this._averageCenter.next(averageCenter);
    }
    set batchSizeIE(batchSizeIE) {
        this._batchSizeIE.next(batchSizeIE);
    }
    set calculator(calculator) {
        this._calculator.next(calculator);
    }
    set clusterClass(clusterClass) {
        this._clusterClass.next(clusterClass);
    }
    set enableRetinalIcons(enableRetinalIcons) {
        this._enableRetinalIcons.next(enableRetinalIcons);
    }
    set gridSize(gridSize) {
        this._gridSize.next(gridSize);
    }
    set ignoreHidden(ignoreHidden) {
        this._ignoreHidden.next(ignoreHidden);
    }
    set imageExtension(imageExtension) {
        this._imageExtension.next(imageExtension);
    }
    set imagePath(imagePath) {
        this._imagePath.next(imagePath);
    }
    set imageSizes(imageSizes) {
        this._imageSizes.next(imageSizes);
    }
    set maxZoom(maxZoom) {
        this._maxZoom.next(maxZoom);
    }
    set minimumClusterSize(minimumClusterSize) {
        this._minimumClusterSize.next(minimumClusterSize);
    }
    set styles(styles) {
        this._styles.next(styles);
    }
    set title(title) {
        this._title.next(title);
    }
    set zIndex(zIndex) {
        this._zIndex.next(zIndex);
    }
    set zoomOnClick(zoomOnClick) {
        this._zoomOnClick.next(zoomOnClick);
    }
    ngOnInit() {
        if (this._googleMap._isBrowser) {
            this._combineOptions().pipe(take(1)).subscribe(options => {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                this._ngZone.runOutsideAngular(() => {
                    this.markerClusterer = new MarkerClusterer(this._googleMap.googleMap, [], options);
                });
                this._assertInitialized();
                this._eventManager.setTarget(this.markerClusterer);
            });
            this._watchForAriaLabelFnChanges();
            this._watchForAverageCenterChanges();
            this._watchForBatchSizeIEChanges();
            this._watchForCalculatorChanges();
            this._watchForClusterClassChanges();
            this._watchForEnableRetinalIconsChanges();
            this._watchForGridSizeChanges();
            this._watchForIgnoreHiddenChanges();
            this._watchForImageExtensionChanges();
            this._watchForImagePathChanges();
            this._watchForImageSizesChanges();
            this._watchForMaxZoomChanges();
            this._watchForMinimumClusterSizeChanges();
            this._watchForStylesChanges();
            this._watchForTitleChanges();
            this._watchForZIndexChanges();
            this._watchForZoomOnClickChanges();
        }
    }
    ngAfterContentInit() {
        this._watchForMarkerChanges();
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
    getEnableRetinalIcons() {
        this._assertInitialized();
        return this.markerClusterer.getEnableRetinalIcons();
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
        return combineLatest([
            this._ariaLabelFn,
            this._averageCenter,
            this._batchSizeIE,
            this._calculator,
            this._clusterClass,
            this._enableRetinalIcons,
            this._gridSize,
            this._ignoreHidden,
            this._imageExtension,
            this._imagePath,
            this._imageSizes,
            this._maxZoom,
            this._minimumClusterSize,
            this._styles,
            this._title,
            this._zIndex,
            this._zoomOnClick,
        ]).pipe(take(1), map(([ariaLabelFn, averageCenter, batchSizeIE, calculator, clusterClass, enableRetinalIcons, gridSize, ignoreHidden, imageExtension, imagePath, imageSizes, maxZoom, minimumClusterSize, styles, title, zIndex, zoomOnClick,]) => {
            const combinedOptions = {
                ariaLabelFn: ariaLabelFn,
                averageCenter: averageCenter,
                batchSize: this.batchSize,
                batchSizeIE: batchSizeIE,
                calculator: calculator,
                clusterClass: clusterClass,
                enableRetinalIcons: enableRetinalIcons,
                gridSize: gridSize,
                ignoreHidden: ignoreHidden,
                imageExtension: imageExtension,
                imagePath: imagePath,
                imageSizes: imageSizes,
                maxZoom: maxZoom,
                minimumClusterSize: minimumClusterSize,
                styles: styles,
                title: title,
                zIndex: zIndex,
                zoomOnClick: zoomOnClick,
            };
            return combinedOptions;
        }));
    }
    _watchForAriaLabelFnChanges() {
        this._ariaLabelFn.pipe(takeUntil(this._destroy)).subscribe(ariaLabelFn => {
            if (this.markerClusterer && ariaLabelFn) {
                this._assertInitialized();
                this.markerClusterer.ariaLabelFn = ariaLabelFn;
            }
        });
    }
    _watchForAverageCenterChanges() {
        this._averageCenter.pipe(takeUntil(this._destroy)).subscribe(averageCenter => {
            if (this.markerClusterer && averageCenter !== undefined) {
                this._assertInitialized();
                this.markerClusterer.setAverageCenter(averageCenter);
            }
        });
    }
    _watchForBatchSizeIEChanges() {
        this._batchSizeIE.pipe(takeUntil(this._destroy)).subscribe(batchSizeIE => {
            if (this.markerClusterer && batchSizeIE !== undefined) {
                this._assertInitialized();
                this.markerClusterer.setBatchSizeIE(batchSizeIE);
            }
        });
    }
    _watchForCalculatorChanges() {
        this._calculator.pipe(takeUntil(this._destroy)).subscribe(calculator => {
            if (this.markerClusterer && calculator) {
                this._assertInitialized();
                this.markerClusterer.setCalculator(calculator);
            }
        });
    }
    _watchForClusterClassChanges() {
        this._clusterClass.pipe(takeUntil(this._destroy)).subscribe(clusterClass => {
            if (this.markerClusterer && clusterClass !== undefined) {
                this._assertInitialized();
                this.markerClusterer.setClusterClass(clusterClass);
            }
        });
    }
    _watchForEnableRetinalIconsChanges() {
        this._enableRetinalIcons.pipe(takeUntil(this._destroy)).subscribe(enableRetinalIcons => {
            if (this.markerClusterer && enableRetinalIcons !== undefined) {
                this._assertInitialized();
                this.markerClusterer.setEnableRetinalIcons(enableRetinalIcons);
            }
        });
    }
    _watchForGridSizeChanges() {
        this._gridSize.pipe(takeUntil(this._destroy)).subscribe(gridSize => {
            if (this.markerClusterer && gridSize !== undefined) {
                this._assertInitialized();
                this.markerClusterer.setGridSize(gridSize);
            }
        });
    }
    _watchForIgnoreHiddenChanges() {
        this._ignoreHidden.pipe(takeUntil(this._destroy)).subscribe(ignoreHidden => {
            if (this.markerClusterer && ignoreHidden !== undefined) {
                this._assertInitialized();
                this.markerClusterer.setIgnoreHidden(ignoreHidden);
            }
        });
    }
    _watchForImageExtensionChanges() {
        this._imageExtension.pipe(takeUntil(this._destroy)).subscribe(imageExtension => {
            if (this.markerClusterer && imageExtension !== undefined) {
                this._assertInitialized();
                this.markerClusterer.setImageExtension(imageExtension);
            }
        });
    }
    _watchForImagePathChanges() {
        this._imagePath.pipe(takeUntil(this._destroy)).subscribe(imagePath => {
            if (this.markerClusterer && imagePath !== undefined) {
                this._assertInitialized();
                this.markerClusterer.setImagePath(imagePath);
            }
        });
    }
    _watchForImageSizesChanges() {
        this._imageSizes.pipe(takeUntil(this._destroy)).subscribe(imageSizes => {
            if (this.markerClusterer && imageSizes) {
                this._assertInitialized();
                this.markerClusterer.setImageSizes(imageSizes);
            }
        });
    }
    _watchForMaxZoomChanges() {
        this._maxZoom.pipe(takeUntil(this._destroy)).subscribe(maxZoom => {
            if (this.markerClusterer && maxZoom !== undefined) {
                this._assertInitialized();
                this.markerClusterer.setMaxZoom(maxZoom);
            }
        });
    }
    _watchForMinimumClusterSizeChanges() {
        this._minimumClusterSize.pipe(takeUntil(this._destroy)).subscribe(minimumClusterSize => {
            if (this.markerClusterer && minimumClusterSize !== undefined) {
                this._assertInitialized();
                this.markerClusterer.setMinimumClusterSize(minimumClusterSize);
            }
        });
    }
    _watchForStylesChanges() {
        this._styles.pipe(takeUntil(this._destroy)).subscribe(styles => {
            if (this.markerClusterer && styles) {
                this._assertInitialized();
                this.markerClusterer.setStyles(styles);
            }
        });
    }
    _watchForTitleChanges() {
        this._title.pipe(takeUntil(this._destroy)).subscribe(title => {
            if (this.markerClusterer && title !== undefined) {
                this._assertInitialized();
                this.markerClusterer.setTitle(title);
            }
        });
    }
    _watchForZIndexChanges() {
        this._zIndex.pipe(takeUntil(this._destroy)).subscribe(zIndex => {
            if (this.markerClusterer && zIndex !== undefined) {
                this._assertInitialized();
                this.markerClusterer.setZIndex(zIndex);
            }
        });
    }
    _watchForZoomOnClickChanges() {
        this._zoomOnClick.pipe(takeUntil(this._destroy)).subscribe(zoomOnClick => {
            if (this.markerClusterer && zoomOnClick !== undefined) {
                this._assertInitialized();
                this.markerClusterer.setZoomOnClick(zoomOnClick);
            }
        });
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
    enableRetinalIcons: [{ type: Input }],
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
    clusteringbegin: [{ type: Output }],
    clusteringend: [{ type: Output }],
    _markers: [{ type: ContentChildren, args: [MapMarker, { descendants: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci1jbHVzdGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLW1hcmtlci1jbHVzdGVyZXIvbWFwLW1hcmtlci1jbHVzdGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUNwQyxrREFBa0Q7QUFFbEQsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUNmLEtBQUssRUFDTCxNQUFNLEVBR04sTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6RSxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUVuRDs7OztHQUlHO0FBUUgsTUFBTSxPQUFPLGtCQUFrQjtJQTRJN0IsWUFBNkIsVUFBcUIsRUFBbUIsT0FBZTtRQUF2RCxlQUFVLEdBQVYsVUFBVSxDQUFXO1FBQW1CLFlBQU8sR0FBUCxPQUFPLENBQVE7UUEzSW5FLGlCQUFZLEdBQUcsSUFBSSxlQUFlLENBQXdCLFNBQVMsQ0FBQyxDQUFDO1FBQ3JFLG1CQUFjLEdBQUcsSUFBSSxlQUFlLENBQW9CLFNBQVMsQ0FBQyxDQUFDO1FBQ25FLGlCQUFZLEdBQUcsSUFBSSxlQUFlLENBQW1CLFNBQVMsQ0FBQyxDQUFDO1FBQ2hFLGdCQUFXLEdBQUcsSUFBSSxlQUFl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QUFDLFNBQVMsRUFBRTtnQkFDOUIsTUFBTSxLQUFLLENBQ1QsNEVBQTRFO29CQUM1RSxvRUFBb0UsQ0FBQyxDQUFDO2FBQ3pFO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ3pCLE1BQU0sS0FBSyxDQUNULHlFQUF5RTtvQkFDekUsZ0ZBQWdGLENBQUMsQ0FBQzthQUNyRjtTQUNGO0lBQ0gsQ0FBQzs7O1lBcGpCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFFBQVEsRUFBRSwyQkFBMkI7Z0JBQ3JDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2FBQ3RDOzs7WUFmTyxTQUFTO1lBVmYsTUFBTTs7OzBCQWtETCxLQUFLOzRCQVFMLEtBQUs7d0JBS0wsS0FBSzswQkFFTCxLQUFLO3lCQUtMLEtBQUs7MkJBS0wsS0FBSztpQ0FLTCxLQUFLO3VCQUtMLEtBQUs7MkJBS0wsS0FBSzs2QkFLTCxLQUFLO3dCQUtMLEtBQUs7eUJBS0wsS0FBSztzQkFLTCxLQUFLO2lDQUtMLEtBQUs7cUJBS0wsS0FBSztvQkFLTCxLQUFLO3FCQUtMLEtBQUs7MEJBS0wsS0FBSzs4QkFVTCxNQUFNOzRCQU9OLE1BQU07dUJBR04sZUFBZSxTQUFDLFNBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGVtYXBzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJtYXJrZXItY2x1c3RlcmVyLXR5cGVzLnRzXCIgLz5cblxuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIHRha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5pbXBvcnQge01hcE1hcmtlcn0gZnJvbSAnLi4vbWFwLW1hcmtlci9tYXAtbWFya2VyJztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCBmb3IgaW1wbGVtZW50aW5nIGEgR29vZ2xlIE1hcHMgTWFya2VyIENsdXN0ZXJlci5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvbWFya2VyLWNsdXN0ZXJpbmdcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWFwLW1hcmtlci1jbHVzdGVyZXInLFxuICBleHBvcnRBczogJ21hcE1hcmtlckNsdXN0ZXJlcicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBNYXJrZXJDbHVzdGVyZXIgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2FyaWFMYWJlbEZuID0gbmV3IEJlaGF2aW9yU3ViamVjdDxBcmlhTGFiZWxGbnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2F2ZXJhZ2VDZW50ZXIgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW58dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9iYXRjaFNpemVJRSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8bnVtYmVyfHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfY2FsY3VsYXRvciA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Q2FsY3VsYXRvcnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NsdXN0ZXJDbGFzcyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nfHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZW5hYmxlUmV0aW5hbEljb25zID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFufHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZ3JpZFNpemUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2lnbm9yZUhpZGRlbiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2ltYWdlRXh0ZW5zaW9uID0gbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmd8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9pbWFnZVBhdGggPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZ3x1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2ltYWdlU2l6ZXMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcltdfHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfbWF4Wm9vbSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8bnVtYmVyfHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfbWluaW11bUNsdXN0ZXJTaXplID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudW1iZXJ8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9zdHlsZXMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PENsdXN0ZXJJY29uU3R5bGVbXXx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3RpdGxlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmd8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF96SW5kZXggPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3pvb21PbkNsaWNrID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFufHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9jdXJyZW50TWFya2VycyA9IG5ldyBTZXQ8Z29vZ2xlLm1hcHMuTWFya2VyPigpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIodGhpcy5fbmdab25lKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgQElucHV0KClcbiAgZ2V0IGFyaWFMYWJlbEZuKCk6IEFyaWFMYWJlbEZuIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIgPyB0aGlzLm1hcmtlckNsdXN0ZXJlci5hcmlhTGFiZWxGbiA6ICgpID0+ICcnO1xuICB9XG4gIHNldCBhcmlhTGFiZWxGbihhcmlhTGFiZWxGbjogQXJpYUxhYmVsRm4pIHtcbiAgICB0aGlzLl9hcmlhTGFiZWxGbi5uZXh0KGFyaWFMYWJlbEZuKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBhdmVyYWdlQ2VudGVyKGF2ZXJhZ2VDZW50ZXI6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9hdmVyYWdlQ2VudGVyLm5leHQoYXZlcmFnZUNlbnRlcik7XG4gIH1cblxuICBASW5wdXQoKSBiYXRjaFNpemU/OiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IGJhdGNoU2l6ZUlFKGJhdGNoU2l6ZUlFOiBudW1iZXIpIHtcbiAgICB0aGlzLl9iYXRjaFNpemVJRS5uZXh0KGJhdGNoU2l6ZUlFKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBjYWxjdWxhdG9yKGNhbGN1bGF0b3I6IENhbGN1bGF0b3IpIHtcbiAgICB0aGlzLl9jYWxjdWxhdG9yLm5leHQoY2FsY3VsYXRvcik7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgY2x1c3RlckNsYXNzKGNsdXN0ZXJDbGFzczogc3RyaW5nKSB7XG4gICAgdGhpcy5fY2x1c3RlckNsYXNzLm5leHQoY2x1c3RlckNsYXNzKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBlbmFibGVSZXRpbmFsSWNvbnMoZW5hYmxlUmV0aW5hbEljb25zOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlUmV0aW5hbEljb25zLm5leHQoZW5hYmxlUmV0aW5hbEljb25zKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBncmlkU2l6ZShncmlkU2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fZ3JpZFNpemUubmV4dChncmlkU2l6ZSk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgaWdub3JlSGlkZGVuKGlnbm9yZUhpZGRlbjogYm9vbGVhbikge1xuICAgIHRoaXMuX2lnbm9yZUhpZGRlbi5uZXh0KGlnbm9yZUhpZGRlbik7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgaW1hZ2VFeHRlbnNpb24oaW1hZ2VFeHRlbnNpb246IHN0cmluZykge1xuICAgIHRoaXMuX2ltYWdlRXh0ZW5zaW9uLm5leHQoaW1hZ2VFeHRlbnNpb24pO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGltYWdlUGF0aChpbWFnZVBhdGg6IHN0cmluZykge1xuICAgIHRoaXMuX2ltYWdlUGF0aC5uZXh0KGltYWdlUGF0aCk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgaW1hZ2VTaXplcyhpbWFnZVNpemVzOiBudW1iZXJbXSkge1xuICAgIHRoaXMuX2ltYWdlU2l6ZXMubmV4dChpbWFnZVNpemVzKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBtYXhab29tKG1heFpvb206IG51bWJlcikge1xuICAgIHRoaXMuX21heFpvb20ubmV4dChtYXhab29tKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBtaW5pbXVtQ2x1c3RlclNpemUobWluaW11bUNsdXN0ZXJTaXplOiBudW1iZXIpIHtcbiAgICB0aGlzLl9taW5pbXVtQ2x1c3RlclNpemUubmV4dChtaW5pbXVtQ2x1c3RlclNpemUpO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHN0eWxlcyhzdHlsZXM6IENsdXN0ZXJJY29uU3R5bGVbXSkge1xuICAgIHRoaXMuX3N0eWxlcy5uZXh0KHN0eWxlcyk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgdGl0bGUodGl0bGU6IHN0cmluZykge1xuICAgIHRoaXMuX3RpdGxlLm5leHQodGl0bGUpO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHpJbmRleCh6SW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMuX3pJbmRleC5uZXh0KHpJbmRleCk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgem9vbU9uQ2xpY2soem9vbU9uQ2xpY2s6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl96b29tT25DbGljay5uZXh0KHpvb21PbkNsaWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZ29vZ2xlbWFwcy5naXRodWIuaW8vdjMtdXRpbGl0eS1saWJyYXJ5L21vZHVsZXMvXG4gICAqIF9nb29nbGVfbWFya2VyY2x1c3RlcmVycGx1cy5odG1sI2NsdXN0ZXJpbmdiZWdpblxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNsdXN0ZXJpbmdiZWdpbjogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2x1c3RlcmluZ2JlZ2luJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBnb29nbGVtYXBzLmdpdGh1Yi5pby92My11dGlsaXR5LWxpYnJhcnkvbW9kdWxlcy9fZ29vZ2xlX21hcmtlcmNsdXN0ZXJlcnBsdXMuaHRtbCNjbHVzdGVyaW5nZW5kXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2x1c3RlcmluZ2VuZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2x1c3RlcmluZ2VuZCcpO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTWFwTWFya2VyLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfbWFya2VyczogUXVlcnlMaXN0PE1hcE1hcmtlcj47XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIE1hcmtlckNsdXN0ZXJlciBvYmplY3QuXG4gICAqXG4gICAqIFNlZVxuICAgKiBnb29nbGVtYXBzLmdpdGh1Yi5pby92My11dGlsaXR5LWxpYnJhcnkvY2xhc3Nlcy9cbiAgICogX2dvb2dsZV9tYXJrZXJjbHVzdGVyZXJwbHVzLm1hcmtlcmNsdXN0ZXJlci5odG1sXG4gICAqL1xuICBtYXJrZXJDbHVzdGVyZXI/OiBNYXJrZXJDbHVzdGVyZXI7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfZ29vZ2xlTWFwOiBHb29nbGVNYXAsIHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9nb29nbGVNYXAuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fY29tYmluZU9wdGlvbnMoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlciA9IG5ldyBNYXJrZXJDbHVzdGVyZXIodGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCEsIFtdLCBvcHRpb25zKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLm1hcmtlckNsdXN0ZXJlcik7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fd2F0Y2hGb3JBcmlhTGFiZWxGbkNoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yQXZlcmFnZUNlbnRlckNoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yQmF0Y2hTaXplSUVDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvckNhbGN1bGF0b3JDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvckNsdXN0ZXJDbGFzc0NoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yRW5hYmxlUmV0aW5hbEljb25zQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JHcmlkU2l6ZUNoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9ySWdub3JlSGlkZGVuQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JJbWFnZUV4dGVuc2lvbkNoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9ySW1hZ2VQYXRoQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JJbWFnZVNpemVzQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JNYXhab29tQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JNaW5pbXVtQ2x1c3RlclNpemVDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclN0eWxlc0NoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yVGl0bGVDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclpJbmRleENoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yWm9vbU9uQ2xpY2tDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX3dhdGNoRm9yTWFya2VyQ2hhbmdlcygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveS5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveS5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgaWYgKHRoaXMubWFya2VyQ2x1c3RlcmVyKSB7XG4gICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgZml0TWFwVG9NYXJrZXJzKHBhZGRpbmc6IG51bWJlcnxnb29nbGUubWFwcy5QYWRkaW5nKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5maXRNYXBUb01hcmtlcnMocGFkZGluZyk7XG4gIH1cblxuICBnZXRBdmVyYWdlQ2VudGVyKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEF2ZXJhZ2VDZW50ZXIoKTtcbiAgfVxuXG4gIGdldEJhdGNoU2l6ZUlFKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0QmF0Y2hTaXplSUUoKTtcbiAgfVxuXG4gIGdldENhbGN1bGF0b3IoKTogQ2FsY3VsYXRvciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0Q2FsY3VsYXRvcigpO1xuICB9XG5cbiAgZ2V0Q2x1c3RlckNsYXNzKCk6IHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0Q2x1c3RlckNsYXNzKCk7XG4gIH1cblxuICBnZXRDbHVzdGVycygpOiBDbHVzdGVyW10ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldENsdXN0ZXJzKCk7XG4gIH1cblxuICBnZXRFbmFibGVSZXRpbmFsSWNvbnMoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0RW5hYmxlUmV0aW5hbEljb25zKCk7XG4gIH1cblxuICBnZXRHcmlkU2l6ZSgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEdyaWRTaXplKCk7XG4gIH1cblxuICBnZXRJZ25vcmVIaWRkZW4oKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0SWdub3JlSGlkZGVuKCk7XG4gIH1cblxuICBnZXRJbWFnZUV4dGVuc2lvbigpOiBzdHJpbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEltYWdlRXh0ZW5zaW9uKCk7XG4gIH1cblxuICBnZXRJbWFnZVBhdGgoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRJbWFnZVBhdGgoKTtcbiAgfVxuXG4gIGdldEltYWdlU2l6ZXMoKTogbnVtYmVyW10ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEltYWdlU2l6ZXMoKTtcbiAgfVxuXG4gIGdldE1heFpvb20oKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRNYXhab29tKCk7XG4gIH1cblxuICBnZXRNaW5pbXVtQ2x1c3RlclNpemUoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRNaW5pbXVtQ2x1c3RlclNpemUoKTtcbiAgfVxuXG4gIGdldFN0eWxlcygpOiBDbHVzdGVySWNvblN0eWxlW10ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFN0eWxlcygpO1xuICB9XG5cbiAgZ2V0VGl0bGUoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRUaXRsZSgpO1xuICB9XG5cbiAgZ2V0VG90YWxDbHVzdGVycygpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFRvdGFsQ2x1c3RlcnMoKTtcbiAgfVxuXG4gIGdldFRvdGFsTWFya2VycygpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFRvdGFsTWFya2VycygpO1xuICB9XG5cbiAgZ2V0WkluZGV4KCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0WkluZGV4KCk7XG4gIH1cblxuICBnZXRab29tT25DbGljaygpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRab29tT25DbGljaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogT2JzZXJ2YWJsZTxNYXJrZXJDbHVzdGVyZXJPcHRpb25zPiB7XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoW1xuICAgICAgdGhpcy5fYXJpYUxhYmVsRm4sXG4gICAgICB0aGlzLl9hdmVyYWdlQ2VudGVyLFxuICAgICAgdGhpcy5fYmF0Y2hTaXplSUUsXG4gICAgICB0aGlzLl9jYWxjdWxhdG9yLFxuICAgICAgdGhpcy5fY2x1c3RlckNsYXNzLFxuICAgICAgdGhpcy5fZW5hYmxlUmV0aW5hbEljb25zLFxuICAgICAgdGhpcy5fZ3JpZFNpemUsXG4gICAgICB0aGlzLl9pZ25vcmVIaWRkZW4sXG4gICAgICB0aGlzLl9pbWFnZUV4dGVuc2lvbixcbiAgICAgIHRoaXMuX2ltYWdlUGF0aCxcbiAgICAgIHRoaXMuX2ltYWdlU2l6ZXMsXG4gICAgICB0aGlzLl9tYXhab29tLFxuICAgICAgdGhpcy5fbWluaW11bUNsdXN0ZXJTaXplLFxuICAgICAgdGhpcy5fc3R5bGVzLFxuICAgICAgdGhpcy5fdGl0bGUsXG4gICAgICB0aGlzLl96SW5kZXgsXG4gICAgICB0aGlzLl96b29tT25DbGljayxcbiAgICBdKS5waXBlKHRha2UoMSksIG1hcCgoW1xuICAgICAgYXJpYUxhYmVsRm4sXG4gICAgICBhdmVyYWdlQ2VudGVyLFxuICAgICAgYmF0Y2hTaXplSUUsXG4gICAgICBjYWxjdWxhdG9yLFxuICAgICAgY2x1c3RlckNsYXNzLFxuICAgICAgZW5hYmxlUmV0aW5hbEljb25zLFxuICAgICAgZ3JpZFNpemUsXG4gICAgICBpZ25vcmVIaWRkZW4sXG4gICAgICBpbWFnZUV4dGVuc2lvbixcbiAgICAgIGltYWdlUGF0aCxcbiAgICAgIGltYWdlU2l6ZXMsXG4gICAgICBtYXhab29tLFxuICAgICAgbWluaW11bUNsdXN0ZXJTaXplLFxuICAgICAgc3R5bGVzLFxuICAgICAgdGl0bGUsXG4gICAgICB6SW5kZXgsXG4gICAgICB6b29tT25DbGljayxcbiAgICBdKSA9PiB7XG4gICAgICBjb25zdCBjb21iaW5lZE9wdGlvbnM6IE1hcmtlckNsdXN0ZXJlck9wdGlvbnMgPSB7XG4gICAgICAgIGFyaWFMYWJlbEZuOiBhcmlhTGFiZWxGbiBhcyBBcmlhTGFiZWxGbnx1bmRlZmluZWQsXG4gICAgICAgIGF2ZXJhZ2VDZW50ZXI6IGF2ZXJhZ2VDZW50ZXIgYXMgYm9vbGVhbnx1bmRlZmluZWQsXG4gICAgICAgIGJhdGNoU2l6ZTogdGhpcy5iYXRjaFNpemUsXG4gICAgICAgIGJhdGNoU2l6ZUlFOiBiYXRjaFNpemVJRSBhcyBudW1iZXJ8dW5kZWZpbmVkLFxuICAgICAgICBjYWxjdWxhdG9yOiBjYWxjdWxhdG9yIGFzIENhbGN1bGF0b3J8dW5kZWZpbmVkLFxuICAgICAgICBjbHVzdGVyQ2xhc3M6IGNsdXN0ZXJDbGFzcyBhcyBzdHJpbmd8dW5kZWZpbmVkLFxuICAgICAgICBlbmFibGVSZXRpbmFsSWNvbnM6IGVuYWJsZVJldGluYWxJY29ucyBhcyBib29sZWFufHVuZGVmaW5lZCxcbiAgICAgICAgZ3JpZFNpemU6IGdyaWRTaXplIGFzIG51bWJlcnx1bmRlZmluZWQsXG4gICAgICAgIGlnbm9yZUhpZGRlbjogaWdub3JlSGlkZGVuIGFzIGJvb2xlYW58dW5kZWZpbmVkLFxuICAgICAgICBpbWFnZUV4dGVuc2lvbjogaW1hZ2VFeHRlbnNpb24gYXMgc3RyaW5nfHVuZGVmaW5lZCxcbiAgICAgICAgaW1hZ2VQYXRoOiBpbWFnZVBhdGggYXMgc3RyaW5nfHVuZGVmaW5lZCxcbiAgICAgICAgaW1hZ2VTaXplczogaW1hZ2VTaXplcyBhcyBudW1iZXJbXXx1bmRlZmluZWQsXG4gICAgICAgIG1heFpvb206IG1heFpvb20gYXMgbnVtYmVyfHVuZGVmaW5lZCxcbiAgICAgICAgbWluaW11bUNsdXN0ZXJTaXplOiBtaW5pbXVtQ2x1c3RlclNpemUgYXMgbnVtYmVyfHVuZGVmaW5lZCxcbiAgICAgICAgc3R5bGVzOiBzdHlsZXMgYXMgQ2x1c3Rlckljb25TdHlsZVtdfHVuZGVmaW5lZCxcbiAgICAgICAgdGl0bGU6IHRpdGxlIGFzIHN0cmluZ3x1bmRlZmluZWQsXG4gICAgICAgIHpJbmRleDogekluZGV4IGFzIG51bWJlcnx1bmRlZmluZWQsXG4gICAgICAgIHpvb21PbkNsaWNrOiB6b29tT25DbGljayBhcyBib29sZWFufHVuZGVmaW5lZCxcbiAgICAgIH07XG4gICAgICByZXR1cm4gY29tYmluZWRPcHRpb25zO1xuICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yQXJpYUxhYmVsRm5DaGFuZ2VzKCkge1xuICAgIHRoaXMuX2FyaWFMYWJlbEZuLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoYXJpYUxhYmVsRm4gPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2VyQ2x1c3RlcmVyICYmIGFyaWFMYWJlbEZuKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLmFyaWFMYWJlbEZuID0gYXJpYUxhYmVsRm47XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvckF2ZXJhZ2VDZW50ZXJDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2F2ZXJhZ2VDZW50ZXIucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShhdmVyYWdlQ2VudGVyID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlckNsdXN0ZXJlciAmJiBhdmVyYWdlQ2VudGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuc2V0QXZlcmFnZUNlbnRlcihhdmVyYWdlQ2VudGVyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yQmF0Y2hTaXplSUVDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2JhdGNoU2l6ZUlFLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoYmF0Y2hTaXplSUUgPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2VyQ2x1c3RlcmVyICYmIGJhdGNoU2l6ZUlFICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuc2V0QmF0Y2hTaXplSUUoYmF0Y2hTaXplSUUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JDYWxjdWxhdG9yQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9jYWxjdWxhdG9yLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoY2FsY3VsYXRvciA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIgJiYgY2FsY3VsYXRvcikge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5zZXRDYWxjdWxhdG9yKGNhbGN1bGF0b3IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JDbHVzdGVyQ2xhc3NDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2NsdXN0ZXJDbGFzcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKGNsdXN0ZXJDbGFzcyA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIgJiYgY2x1c3RlckNsYXNzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuc2V0Q2x1c3RlckNsYXNzKGNsdXN0ZXJDbGFzcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvckVuYWJsZVJldGluYWxJY29uc0NoYW5nZXMoKSB7XG4gICAgdGhpcy5fZW5hYmxlUmV0aW5hbEljb25zLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoZW5hYmxlUmV0aW5hbEljb25zID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlckNsdXN0ZXJlciAmJiBlbmFibGVSZXRpbmFsSWNvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5zZXRFbmFibGVSZXRpbmFsSWNvbnMoZW5hYmxlUmV0aW5hbEljb25zKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yR3JpZFNpemVDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2dyaWRTaXplLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoZ3JpZFNpemUgPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2VyQ2x1c3RlcmVyICYmIGdyaWRTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuc2V0R3JpZFNpemUoZ3JpZFNpemUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JJZ25vcmVIaWRkZW5DaGFuZ2VzKCkge1xuICAgIHRoaXMuX2lnbm9yZUhpZGRlbi5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKGlnbm9yZUhpZGRlbiA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIgJiYgaWdub3JlSGlkZGVuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuc2V0SWdub3JlSGlkZGVuKGlnbm9yZUhpZGRlbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvckltYWdlRXh0ZW5zaW9uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9pbWFnZUV4dGVuc2lvbi5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKGltYWdlRXh0ZW5zaW9uID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlckNsdXN0ZXJlciAmJiBpbWFnZUV4dGVuc2lvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnNldEltYWdlRXh0ZW5zaW9uKGltYWdlRXh0ZW5zaW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9ySW1hZ2VQYXRoQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9pbWFnZVBhdGgucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShpbWFnZVBhdGggPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2VyQ2x1c3RlcmVyICYmIGltYWdlUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnNldEltYWdlUGF0aChpbWFnZVBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JJbWFnZVNpemVzQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9pbWFnZVNpemVzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoaW1hZ2VTaXplcyA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIgJiYgaW1hZ2VTaXplcykge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5zZXRJbWFnZVNpemVzKGltYWdlU2l6ZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JNYXhab29tQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9tYXhab29tLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUobWF4Wm9vbSA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIgJiYgbWF4Wm9vbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnNldE1heFpvb20obWF4Wm9vbSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck1pbmltdW1DbHVzdGVyU2l6ZUNoYW5nZXMoKSB7XG4gICAgdGhpcy5fbWluaW11bUNsdXN0ZXJTaXplLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUobWluaW11bUNsdXN0ZXJTaXplID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlckNsdXN0ZXJlciAmJiBtaW5pbXVtQ2x1c3RlclNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5zZXRNaW5pbXVtQ2x1c3RlclNpemUobWluaW11bUNsdXN0ZXJTaXplKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yU3R5bGVzQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9zdHlsZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShzdHlsZXMgPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2VyQ2x1c3RlcmVyICYmIHN0eWxlcykge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5zZXRTdHlsZXMoc3R5bGVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yVGl0bGVDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3RpdGxlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUodGl0bGUgPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2VyQ2x1c3RlcmVyICYmIHRpdGxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuc2V0VGl0bGUodGl0bGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JaSW5kZXhDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3pJbmRleC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKHpJbmRleCA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIgJiYgekluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuc2V0WkluZGV4KHpJbmRleCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclpvb21PbkNsaWNrQ2hhbmdlcygpIHtcbiAgICB0aGlzLl96b29tT25DbGljay5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKHpvb21PbkNsaWNrID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlckNsdXN0ZXJlciAmJiB6b29tT25DbGljayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnNldFpvb21PbkNsaWNrKHpvb21PbkNsaWNrKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yTWFya2VyQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIGNvbnN0IGluaXRpYWxNYXJrZXJzOiBnb29nbGUubWFwcy5NYXJrZXJbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgbWFya2VyIG9mIHRoaXMuX2dldEludGVybmFsTWFya2Vycyh0aGlzLl9tYXJrZXJzLnRvQXJyYXkoKSkpIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRNYXJrZXJzLmFkZChtYXJrZXIpO1xuICAgICAgaW5pdGlhbE1hcmtlcnMucHVzaChtYXJrZXIpO1xuICAgIH1cbiAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5hZGRNYXJrZXJzKGluaXRpYWxNYXJrZXJzKTtcblxuICAgIHRoaXMuX21hcmtlcnMuY2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKFxuICAgICAgKG1hcmtlckNvbXBvbmVudHM6IE1hcE1hcmtlcltdKSA9PiB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIGNvbnN0IG5ld01hcmtlcnMgPSBuZXcgU2V0PGdvb2dsZS5tYXBzLk1hcmtlcj4odGhpcy5fZ2V0SW50ZXJuYWxNYXJrZXJzKG1hcmtlckNvbXBvbmVudHMpKTtcbiAgICAgICAgY29uc3QgbWFya2Vyc1RvQWRkOiBnb29nbGUubWFwcy5NYXJrZXJbXSA9IFtdO1xuICAgICAgICBjb25zdCBtYXJrZXJzVG9SZW1vdmU6IGdvb2dsZS5tYXBzLk1hcmtlcltdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgbWFya2VyIG9mIEFycmF5LmZyb20obmV3TWFya2VycykpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuX2N1cnJlbnRNYXJrZXJzLmhhcyhtYXJrZXIpKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50TWFya2Vycy5hZGQobWFya2VyKTtcbiAgICAgICAgICAgIG1hcmtlcnNUb0FkZC5wdXNoKG1hcmtlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgbWFya2VyIG9mIEFycmF5LmZyb20odGhpcy5fY3VycmVudE1hcmtlcnMpKSB7XG4gICAgICAgICAgaWYgKCFuZXdNYXJrZXJzLmhhcyhtYXJrZXIpKSB7XG4gICAgICAgICAgICBtYXJrZXJzVG9SZW1vdmUucHVzaChtYXJrZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5hZGRNYXJrZXJzKG1hcmtlcnNUb0FkZCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnJlbW92ZU1hcmtlcnMobWFya2Vyc1RvUmVtb3ZlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIucmVwYWludCgpO1xuICAgICAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiBtYXJrZXJzVG9SZW1vdmUpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50TWFya2Vycy5kZWxldGUobWFya2VyKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0SW50ZXJuYWxNYXJrZXJzKG1hcmtlcnM6IE1hcE1hcmtlcltdKTogZ29vZ2xlLm1hcHMuTWFya2VyW10ge1xuICAgIHJldHVybiBtYXJrZXJzLmZpbHRlcihtYXJrZXJDb21wb25lbnQgPT4gISFtYXJrZXJDb21wb25lbnQubWFya2VyKVxuICAgICAgICAubWFwKG1hcmtlckNvbXBvbmVudCA9PiBtYXJrZXJDb21wb25lbnQubWFya2VyISk7XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge21hcmtlckNsdXN0ZXJlcjogTWFya2VyQ2x1c3RlcmVyfSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgYWNjZXNzIEdvb2dsZSBNYXAgaW5mb3JtYXRpb24gYmVmb3JlIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5tYXJrZXJDbHVzdGVyZXIpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgTWFya2VyQ2x1c3RlcmVyIGJlZm9yZSBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgTWFya2VyQ2x1c3RlcmVyIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19