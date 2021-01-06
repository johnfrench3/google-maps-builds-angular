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
        this._enableRetinaIcons = new BehaviorSubject(undefined);
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
        this._canInitialize = this._googleMap._isBrowser;
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
    set enableRetinaIcons(enableRetinaIcons) {
        this._enableRetinaIcons.next(enableRetinaIcons);
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
        if (this._canInitialize) {
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
            this._watchForEnableRetinaIconsChanges();
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
        if (this._canInitialize) {
            this._watchForMarkerChanges();
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
        return combineLatest([
            this._ariaLabelFn,
            this._averageCenter,
            this._batchSizeIE,
            this._calculator,
            this._clusterClass,
            this._enableRetinaIcons,
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
        ]).pipe(take(1), map(([ariaLabelFn, averageCenter, batchSizeIE, calculator, clusterClass, enableRetinaIcons, gridSize, ignoreHidden, imageExtension, imagePath, imageSizes, maxZoom, minimumClusterSize, styles, title, zIndex, zoomOnClick,]) => {
            const combinedOptions = {
                ariaLabelFn: ariaLabelFn,
                averageCenter: averageCenter,
                batchSize: this.batchSize,
                batchSizeIE: batchSizeIE,
                calculator: calculator,
                clusterClass: clusterClass,
                enableRetinaIcons: enableRetinaIcons,
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
    _watchForEnableRetinaIconsChanges() {
        this._enableRetinaIcons.pipe(takeUntil(this._destroy)).subscribe(enableRetinaIcons => {
            if (this.markerClusterer && enableRetinaIcons !== undefined) {
                this._assertInitialized();
                this.markerClusterer.setEnableRetinaIcons(enableRetinaIcons);
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
    clusteringbegin: [{ type: Output }],
    clusteringend: [{ type: Output }],
    _markers: [{ type: ContentChildren, args: [MapMarker, { descendants: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci1jbHVzdGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLW1hcmtlci1jbHVzdGVyZXIvbWFwLW1hcmtlci1jbHVzdGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUNwQyxrREFBa0Q7QUFFbEQsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUNmLEtBQUssRUFDTCxNQUFNLEVBR04sTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6RSxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUVuRDs7OztHQUlHO0FBUUgsTUFBTSxPQUFPLGtCQUFrQjtJQStJN0IsWUFBNkIsVUFBcUIsRUFBbUIsT0FBZTtRQUF2RCxlQUFVLEdBQVYsVUFBVSxDQUFXO1FBQW1CLFlBQU8sR0FBUCxPQUFPLENBQVE7UUE5SW5FLGlCQUFZLEdBQUcsSUFBSSxlQUFlLENBQXdCLFNBQVMsQ0FBQyxDQUFDO1FBQ3JFLG1CQUFjLEdBQUcsSUFBSSxlQUFlLENBQW9CLFNBQVMsQ0FBQyxDQUFDO1FBQ25FLGlCQUFZLEdBQUcsSUFBSSxlQUFlLENBQW1CLFNBQVMsQ0FBQyxDQUFDO1FBQ2hFLGdCQUFXLEdBQUcsSUFBSSxlQUFl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QWtCO1FBQ3hCLElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsRUFBRTtZQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUU7Z0JBQzlCLE1BQU0sS0FBSyxDQUNULDRFQUE0RTtvQkFDNUUsb0VBQW9FLENBQUMsQ0FBQzthQUN6RTtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUN6QixNQUFNLEtBQUssQ0FDVCx5RUFBeUU7b0JBQ3pFLGdGQUFnRixDQUFDLENBQUM7YUFDckY7U0FDRjtJQUNILENBQUM7OztZQTNqQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxRQUFRLEVBQUUsMkJBQTJCO2dCQUNyQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN0Qzs7O1lBZk8sU0FBUztZQVZmLE1BQU07OzswQkFxREwsS0FBSzs0QkFRTCxLQUFLO3dCQUtMLEtBQUs7MEJBRUwsS0FBSzt5QkFLTCxLQUFLOzJCQUtMLEtBQUs7Z0NBS0wsS0FBSzt1QkFLTCxLQUFLOzJCQUtMLEtBQUs7NkJBS0wsS0FBSzt3QkFLTCxLQUFLO3lCQUtMLEtBQUs7c0JBS0wsS0FBSztpQ0FLTCxLQUFLO3FCQUtMLEtBQUs7b0JBS0wsS0FBSztxQkFLTCxLQUFLOzBCQUtMLEtBQUs7OEJBVUwsTUFBTTs0QkFPTixNQUFNO3VCQUdOLGVBQWUsU0FBQyxTQUFTLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwibWFya2VyLWNsdXN0ZXJlci10eXBlcy50c1wiIC8+XG5cbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuaW1wb3J0IHtNYXBNYXJrZXJ9IGZyb20gJy4uL21hcC1tYXJrZXIvbWFwLW1hcmtlcic7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgZm9yIGltcGxlbWVudGluZyBhIEdvb2dsZSBNYXBzIE1hcmtlciBDbHVzdGVyZXIuXG4gKlxuICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L21hcmtlci1jbHVzdGVyaW5nXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hcC1tYXJrZXItY2x1c3RlcmVyJyxcbiAgZXhwb3J0QXM6ICdtYXBNYXJrZXJDbHVzdGVyZXInLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWFwTWFya2VyQ2x1c3RlcmVyIGltcGxlbWVudHMgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIHJlYWRvbmx5IF9hcmlhTGFiZWxGbiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8QXJpYUxhYmVsRm58dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9hdmVyYWdlQ2VudGVyID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFufHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfYmF0Y2hTaXplSUUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NhbGN1bGF0b3IgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PENhbGN1bGF0b3J8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9jbHVzdGVyQ2xhc3MgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZ3x1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2VuYWJsZVJldGluYUljb25zID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFufHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZ3JpZFNpemUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2lnbm9yZUhpZGRlbiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2ltYWdlRXh0ZW5zaW9uID0gbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmd8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9pbWFnZVBhdGggPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZ3x1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2ltYWdlU2l6ZXMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcltdfHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfbWF4Wm9vbSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8bnVtYmVyfHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfbWluaW11bUNsdXN0ZXJTaXplID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudW1iZXJ8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9zdHlsZXMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PENsdXN0ZXJJY29uU3R5bGVbXXx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3RpdGxlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmd8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF96SW5kZXggPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3pvb21PbkNsaWNrID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFufHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9jdXJyZW50TWFya2VycyA9IG5ldyBTZXQ8Z29vZ2xlLm1hcHMuTWFya2VyPigpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIodGhpcy5fbmdab25lKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNsdXN0ZXJlciBpcyBhbGxvd2VkIHRvIGJlIGluaXRpYWxpemVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9jYW5Jbml0aWFsaXplOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBhcmlhTGFiZWxGbigpOiBBcmlhTGFiZWxGbiB7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyID8gdGhpcy5tYXJrZXJDbHVzdGVyZXIuYXJpYUxhYmVsRm4gOiAoKSA9PiAnJztcbiAgfVxuICBzZXQgYXJpYUxhYmVsRm4oYXJpYUxhYmVsRm46IEFyaWFMYWJlbEZuKSB7XG4gICAgdGhpcy5fYXJpYUxhYmVsRm4ubmV4dChhcmlhTGFiZWxGbik7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgYXZlcmFnZUNlbnRlcihhdmVyYWdlQ2VudGVyOiBib29sZWFuKSB7XG4gICAgdGhpcy5fYXZlcmFnZUNlbnRlci5uZXh0KGF2ZXJhZ2VDZW50ZXIpO1xuICB9XG5cbiAgQElucHV0KCkgYmF0Y2hTaXplPzogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBiYXRjaFNpemVJRShiYXRjaFNpemVJRTogbnVtYmVyKSB7XG4gICAgdGhpcy5fYmF0Y2hTaXplSUUubmV4dChiYXRjaFNpemVJRSk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgY2FsY3VsYXRvcihjYWxjdWxhdG9yOiBDYWxjdWxhdG9yKSB7XG4gICAgdGhpcy5fY2FsY3VsYXRvci5uZXh0KGNhbGN1bGF0b3IpO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGNsdXN0ZXJDbGFzcyhjbHVzdGVyQ2xhc3M6IHN0cmluZykge1xuICAgIHRoaXMuX2NsdXN0ZXJDbGFzcy5uZXh0KGNsdXN0ZXJDbGFzcyk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgZW5hYmxlUmV0aW5hSWNvbnMoZW5hYmxlUmV0aW5hSWNvbnM6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbmFibGVSZXRpbmFJY29ucy5uZXh0KGVuYWJsZVJldGluYUljb25zKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBncmlkU2l6ZShncmlkU2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fZ3JpZFNpemUubmV4dChncmlkU2l6ZSk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgaWdub3JlSGlkZGVuKGlnbm9yZUhpZGRlbjogYm9vbGVhbikge1xuICAgIHRoaXMuX2lnbm9yZUhpZGRlbi5uZXh0KGlnbm9yZUhpZGRlbik7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgaW1hZ2VFeHRlbnNpb24oaW1hZ2VFeHRlbnNpb246IHN0cmluZykge1xuICAgIHRoaXMuX2ltYWdlRXh0ZW5zaW9uLm5leHQoaW1hZ2VFeHRlbnNpb24pO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGltYWdlUGF0aChpbWFnZVBhdGg6IHN0cmluZykge1xuICAgIHRoaXMuX2ltYWdlUGF0aC5uZXh0KGltYWdlUGF0aCk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgaW1hZ2VTaXplcyhpbWFnZVNpemVzOiBudW1iZXJbXSkge1xuICAgIHRoaXMuX2ltYWdlU2l6ZXMubmV4dChpbWFnZVNpemVzKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBtYXhab29tKG1heFpvb206IG51bWJlcikge1xuICAgIHRoaXMuX21heFpvb20ubmV4dChtYXhab29tKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBtaW5pbXVtQ2x1c3RlclNpemUobWluaW11bUNsdXN0ZXJTaXplOiBudW1iZXIpIHtcbiAgICB0aGlzLl9taW5pbXVtQ2x1c3RlclNpemUubmV4dChtaW5pbXVtQ2x1c3RlclNpemUpO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHN0eWxlcyhzdHlsZXM6IENsdXN0ZXJJY29uU3R5bGVbXSkge1xuICAgIHRoaXMuX3N0eWxlcy5uZXh0KHN0eWxlcyk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgdGl0bGUodGl0bGU6IHN0cmluZykge1xuICAgIHRoaXMuX3RpdGxlLm5leHQodGl0bGUpO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHpJbmRleCh6SW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMuX3pJbmRleC5uZXh0KHpJbmRleCk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgem9vbU9uQ2xpY2soem9vbU9uQ2xpY2s6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl96b29tT25DbGljay5uZXh0KHpvb21PbkNsaWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZ29vZ2xlbWFwcy5naXRodWIuaW8vdjMtdXRpbGl0eS1saWJyYXJ5L21vZHVsZXMvXG4gICAqIF9nb29nbGVfbWFya2VyY2x1c3RlcmVycGx1cy5odG1sI2NsdXN0ZXJpbmdiZWdpblxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNsdXN0ZXJpbmdiZWdpbjogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2x1c3RlcmluZ2JlZ2luJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBnb29nbGVtYXBzLmdpdGh1Yi5pby92My11dGlsaXR5LWxpYnJhcnkvbW9kdWxlcy9fZ29vZ2xlX21hcmtlcmNsdXN0ZXJlcnBsdXMuaHRtbCNjbHVzdGVyaW5nZW5kXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2x1c3RlcmluZ2VuZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2x1c3RlcmluZ2VuZCcpO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTWFwTWFya2VyLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfbWFya2VyczogUXVlcnlMaXN0PE1hcE1hcmtlcj47XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIE1hcmtlckNsdXN0ZXJlciBvYmplY3QuXG4gICAqXG4gICAqIFNlZVxuICAgKiBnb29nbGVtYXBzLmdpdGh1Yi5pby92My11dGlsaXR5LWxpYnJhcnkvY2xhc3Nlcy9cbiAgICogX2dvb2dsZV9tYXJrZXJjbHVzdGVyZXJwbHVzLm1hcmtlcmNsdXN0ZXJlci5odG1sXG4gICAqL1xuICBtYXJrZXJDbHVzdGVyZXI/OiBNYXJrZXJDbHVzdGVyZXI7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfZ29vZ2xlTWFwOiBHb29nbGVNYXAsIHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lKSB7XG4gICAgdGhpcy5fY2FuSW5pdGlhbGl6ZSA9IHRoaXMuX2dvb2dsZU1hcC5faXNCcm93c2VyO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2NhbkluaXRpYWxpemUpIHtcbiAgICAgIHRoaXMuX2NvbWJpbmVPcHRpb25zKCkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIgPSBuZXcgTWFya2VyQ2x1c3RlcmVyKHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAhLCBbXSwgb3B0aW9ucyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5tYXJrZXJDbHVzdGVyZXIpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3dhdGNoRm9yQXJpYUxhYmVsRm5DaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvckF2ZXJhZ2VDZW50ZXJDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvckJhdGNoU2l6ZUlFQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JDYWxjdWxhdG9yQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JDbHVzdGVyQ2xhc3NDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvckVuYWJsZVJldGluYUljb25zQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JHcmlkU2l6ZUNoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9ySWdub3JlSGlkZGVuQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JJbWFnZUV4dGVuc2lvbkNoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9ySW1hZ2VQYXRoQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JJbWFnZVNpemVzQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JNYXhab29tQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JNaW5pbXVtQ2x1c3RlclNpemVDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclN0eWxlc0NoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yVGl0bGVDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclpJbmRleENoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yWm9vbU9uQ2xpY2tDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIGlmICh0aGlzLl9jYW5Jbml0aWFsaXplKSB7XG4gICAgICB0aGlzLl93YXRjaEZvck1hcmtlckNoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95Lm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIpIHtcbiAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnNldE1hcChudWxsKTtcbiAgICB9XG4gIH1cblxuICBmaXRNYXBUb01hcmtlcnMocGFkZGluZzogbnVtYmVyfGdvb2dsZS5tYXBzLlBhZGRpbmcpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLmZpdE1hcFRvTWFya2VycyhwYWRkaW5nKTtcbiAgfVxuXG4gIGdldEF2ZXJhZ2VDZW50ZXIoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0QXZlcmFnZUNlbnRlcigpO1xuICB9XG5cbiAgZ2V0QmF0Y2hTaXplSUUoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRCYXRjaFNpemVJRSgpO1xuICB9XG5cbiAgZ2V0Q2FsY3VsYXRvcigpOiBDYWxjdWxhdG9yIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRDYWxjdWxhdG9yKCk7XG4gIH1cblxuICBnZXRDbHVzdGVyQ2xhc3MoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRDbHVzdGVyQ2xhc3MoKTtcbiAgfVxuXG4gIGdldENsdXN0ZXJzKCk6IENsdXN0ZXJbXSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0Q2x1c3RlcnMoKTtcbiAgfVxuXG4gIGdldEVuYWJsZVJldGluYUljb25zKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEVuYWJsZVJldGluYUljb25zKCk7XG4gIH1cblxuICBnZXRHcmlkU2l6ZSgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEdyaWRTaXplKCk7XG4gIH1cblxuICBnZXRJZ25vcmVIaWRkZW4oKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0SWdub3JlSGlkZGVuKCk7XG4gIH1cblxuICBnZXRJbWFnZUV4dGVuc2lvbigpOiBzdHJpbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEltYWdlRXh0ZW5zaW9uKCk7XG4gIH1cblxuICBnZXRJbWFnZVBhdGgoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRJbWFnZVBhdGgoKTtcbiAgfVxuXG4gIGdldEltYWdlU2l6ZXMoKTogbnVtYmVyW10ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEltYWdlU2l6ZXMoKTtcbiAgfVxuXG4gIGdldE1heFpvb20oKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRNYXhab29tKCk7XG4gIH1cblxuICBnZXRNaW5pbXVtQ2x1c3RlclNpemUoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRNaW5pbXVtQ2x1c3RlclNpemUoKTtcbiAgfVxuXG4gIGdldFN0eWxlcygpOiBDbHVzdGVySWNvblN0eWxlW10ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFN0eWxlcygpO1xuICB9XG5cbiAgZ2V0VGl0bGUoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRUaXRsZSgpO1xuICB9XG5cbiAgZ2V0VG90YWxDbHVzdGVycygpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFRvdGFsQ2x1c3RlcnMoKTtcbiAgfVxuXG4gIGdldFRvdGFsTWFya2VycygpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFRvdGFsTWFya2VycygpO1xuICB9XG5cbiAgZ2V0WkluZGV4KCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0WkluZGV4KCk7XG4gIH1cblxuICBnZXRab29tT25DbGljaygpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRab29tT25DbGljaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogT2JzZXJ2YWJsZTxNYXJrZXJDbHVzdGVyZXJPcHRpb25zPiB7XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoW1xuICAgICAgdGhpcy5fYXJpYUxhYmVsRm4sXG4gICAgICB0aGlzLl9hdmVyYWdlQ2VudGVyLFxuICAgICAgdGhpcy5fYmF0Y2hTaXplSUUsXG4gICAgICB0aGlzLl9jYWxjdWxhdG9yLFxuICAgICAgdGhpcy5fY2x1c3RlckNsYXNzLFxuICAgICAgdGhpcy5fZW5hYmxlUmV0aW5hSWNvbnMsXG4gICAgICB0aGlzLl9ncmlkU2l6ZSxcbiAgICAgIHRoaXMuX2lnbm9yZUhpZGRlbixcbiAgICAgIHRoaXMuX2ltYWdlRXh0ZW5zaW9uLFxuICAgICAgdGhpcy5faW1hZ2VQYXRoLFxuICAgICAgdGhpcy5faW1hZ2VTaXplcyxcbiAgICAgIHRoaXMuX21heFpvb20sXG4gICAgICB0aGlzLl9taW5pbXVtQ2x1c3RlclNpemUsXG4gICAgICB0aGlzLl9zdHlsZXMsXG4gICAgICB0aGlzLl90aXRsZSxcbiAgICAgIHRoaXMuX3pJbmRleCxcbiAgICAgIHRoaXMuX3pvb21PbkNsaWNrLFxuICAgIF0pLnBpcGUodGFrZSgxKSwgbWFwKChbXG4gICAgICBhcmlhTGFiZWxGbixcbiAgICAgIGF2ZXJhZ2VDZW50ZXIsXG4gICAgICBiYXRjaFNpemVJRSxcbiAgICAgIGNhbGN1bGF0b3IsXG4gICAgICBjbHVzdGVyQ2xhc3MsXG4gICAgICBlbmFibGVSZXRpbmFJY29ucyxcbiAgICAgIGdyaWRTaXplLFxuICAgICAgaWdub3JlSGlkZGVuLFxuICAgICAgaW1hZ2VFeHRlbnNpb24sXG4gICAgICBpbWFnZVBhdGgsXG4gICAgICBpbWFnZVNpemVzLFxuICAgICAgbWF4Wm9vbSxcbiAgICAgIG1pbmltdW1DbHVzdGVyU2l6ZSxcbiAgICAgIHN0eWxlcyxcbiAgICAgIHRpdGxlLFxuICAgICAgekluZGV4LFxuICAgICAgem9vbU9uQ2xpY2ssXG4gICAgXSkgPT4ge1xuICAgICAgY29uc3QgY29tYmluZWRPcHRpb25zOiBNYXJrZXJDbHVzdGVyZXJPcHRpb25zID0ge1xuICAgICAgICBhcmlhTGFiZWxGbjogYXJpYUxhYmVsRm4gYXMgQXJpYUxhYmVsRm58dW5kZWZpbmVkLFxuICAgICAgICBhdmVyYWdlQ2VudGVyOiBhdmVyYWdlQ2VudGVyIGFzIGJvb2xlYW58dW5kZWZpbmVkLFxuICAgICAgICBiYXRjaFNpemU6IHRoaXMuYmF0Y2hTaXplLFxuICAgICAgICBiYXRjaFNpemVJRTogYmF0Y2hTaXplSUUgYXMgbnVtYmVyfHVuZGVmaW5lZCxcbiAgICAgICAgY2FsY3VsYXRvcjogY2FsY3VsYXRvciBhcyBDYWxjdWxhdG9yfHVuZGVmaW5lZCxcbiAgICAgICAgY2x1c3RlckNsYXNzOiBjbHVzdGVyQ2xhc3MgYXMgc3RyaW5nfHVuZGVmaW5lZCxcbiAgICAgICAgZW5hYmxlUmV0aW5hSWNvbnM6IGVuYWJsZVJldGluYUljb25zIGFzIGJvb2xlYW58dW5kZWZpbmVkLFxuICAgICAgICBncmlkU2l6ZTogZ3JpZFNpemUgYXMgbnVtYmVyfHVuZGVmaW5lZCxcbiAgICAgICAgaWdub3JlSGlkZGVuOiBpZ25vcmVIaWRkZW4gYXMgYm9vbGVhbnx1bmRlZmluZWQsXG4gICAgICAgIGltYWdlRXh0ZW5zaW9uOiBpbWFnZUV4dGVuc2lvbiBhcyBzdHJpbmd8dW5kZWZpbmVkLFxuICAgICAgICBpbWFnZVBhdGg6IGltYWdlUGF0aCBhcyBzdHJpbmd8dW5kZWZpbmVkLFxuICAgICAgICBpbWFnZVNpemVzOiBpbWFnZVNpemVzIGFzIG51bWJlcltdfHVuZGVmaW5lZCxcbiAgICAgICAgbWF4Wm9vbTogbWF4Wm9vbSBhcyBudW1iZXJ8dW5kZWZpbmVkLFxuICAgICAgICBtaW5pbXVtQ2x1c3RlclNpemU6IG1pbmltdW1DbHVzdGVyU2l6ZSBhcyBudW1iZXJ8dW5kZWZpbmVkLFxuICAgICAgICBzdHlsZXM6IHN0eWxlcyBhcyBDbHVzdGVySWNvblN0eWxlW118dW5kZWZpbmVkLFxuICAgICAgICB0aXRsZTogdGl0bGUgYXMgc3RyaW5nfHVuZGVmaW5lZCxcbiAgICAgICAgekluZGV4OiB6SW5kZXggYXMgbnVtYmVyfHVuZGVmaW5lZCxcbiAgICAgICAgem9vbU9uQ2xpY2s6IHpvb21PbkNsaWNrIGFzIGJvb2xlYW58dW5kZWZpbmVkLFxuICAgICAgfTtcbiAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JBcmlhTGFiZWxGbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5fYXJpYUxhYmVsRm4ucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShhcmlhTGFiZWxGbiA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIgJiYgYXJpYUxhYmVsRm4pIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuYXJpYUxhYmVsRm4gPSBhcmlhTGFiZWxGbjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yQXZlcmFnZUNlbnRlckNoYW5nZXMoKSB7XG4gICAgdGhpcy5fYXZlcmFnZUNlbnRlci5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKGF2ZXJhZ2VDZW50ZXIgPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2VyQ2x1c3RlcmVyICYmIGF2ZXJhZ2VDZW50ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5zZXRBdmVyYWdlQ2VudGVyKGF2ZXJhZ2VDZW50ZXIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JCYXRjaFNpemVJRUNoYW5nZXMoKSB7XG4gICAgdGhpcy5fYmF0Y2hTaXplSUUucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShiYXRjaFNpemVJRSA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIgJiYgYmF0Y2hTaXplSUUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5zZXRCYXRjaFNpemVJRShiYXRjaFNpemVJRSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvckNhbGN1bGF0b3JDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2NhbGN1bGF0b3IucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShjYWxjdWxhdG9yID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlckNsdXN0ZXJlciAmJiBjYWxjdWxhdG9yKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnNldENhbGN1bGF0b3IoY2FsY3VsYXRvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvckNsdXN0ZXJDbGFzc0NoYW5nZXMoKSB7XG4gICAgdGhpcy5fY2x1c3RlckNsYXNzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoY2x1c3RlckNsYXNzID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlckNsdXN0ZXJlciAmJiBjbHVzdGVyQ2xhc3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5zZXRDbHVzdGVyQ2xhc3MoY2x1c3RlckNsYXNzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yRW5hYmxlUmV0aW5hSWNvbnNDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2VuYWJsZVJldGluYUljb25zLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoZW5hYmxlUmV0aW5hSWNvbnMgPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2VyQ2x1c3RlcmVyICYmIGVuYWJsZVJldGluYUljb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuc2V0RW5hYmxlUmV0aW5hSWNvbnMoZW5hYmxlUmV0aW5hSWNvbnMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JHcmlkU2l6ZUNoYW5nZXMoKSB7XG4gICAgdGhpcy5fZ3JpZFNpemUucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShncmlkU2l6ZSA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIgJiYgZ3JpZFNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5zZXRHcmlkU2l6ZShncmlkU2l6ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvcklnbm9yZUhpZGRlbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5faWdub3JlSGlkZGVuLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoaWdub3JlSGlkZGVuID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlckNsdXN0ZXJlciAmJiBpZ25vcmVIaWRkZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5zZXRJZ25vcmVIaWRkZW4oaWdub3JlSGlkZGVuKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9ySW1hZ2VFeHRlbnNpb25DaGFuZ2VzKCkge1xuICAgIHRoaXMuX2ltYWdlRXh0ZW5zaW9uLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoaW1hZ2VFeHRlbnNpb24gPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2VyQ2x1c3RlcmVyICYmIGltYWdlRXh0ZW5zaW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuc2V0SW1hZ2VFeHRlbnNpb24oaW1hZ2VFeHRlbnNpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JJbWFnZVBhdGhDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2ltYWdlUGF0aC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKGltYWdlUGF0aCA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIgJiYgaW1hZ2VQYXRoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuc2V0SW1hZ2VQYXRoKGltYWdlUGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvckltYWdlU2l6ZXNDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2ltYWdlU2l6ZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShpbWFnZVNpemVzID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlckNsdXN0ZXJlciAmJiBpbWFnZVNpemVzKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnNldEltYWdlU2l6ZXMoaW1hZ2VTaXplcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck1heFpvb21DaGFuZ2VzKCkge1xuICAgIHRoaXMuX21heFpvb20ucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShtYXhab29tID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlckNsdXN0ZXJlciAmJiBtYXhab29tICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuc2V0TWF4Wm9vbShtYXhab29tKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yTWluaW11bUNsdXN0ZXJTaXplQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9taW5pbXVtQ2x1c3RlclNpemUucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShtaW5pbXVtQ2x1c3RlclNpemUgPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2VyQ2x1c3RlcmVyICYmIG1pbmltdW1DbHVzdGVyU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnNldE1pbmltdW1DbHVzdGVyU2l6ZShtaW5pbXVtQ2x1c3RlclNpemUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JTdHlsZXNDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3N0eWxlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKHN0eWxlcyA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIgJiYgc3R5bGVzKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnNldFN0eWxlcyhzdHlsZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JUaXRsZUNoYW5nZXMoKSB7XG4gICAgdGhpcy5fdGl0bGUucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZSh0aXRsZSA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIgJiYgdGl0bGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5zZXRUaXRsZSh0aXRsZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclpJbmRleENoYW5nZXMoKSB7XG4gICAgdGhpcy5fekluZGV4LnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoekluZGV4ID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlckNsdXN0ZXJlciAmJiB6SW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5zZXRaSW5kZXgoekluZGV4KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yWm9vbU9uQ2xpY2tDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3pvb21PbkNsaWNrLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoem9vbU9uQ2xpY2sgPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2VyQ2x1c3RlcmVyICYmIHpvb21PbkNsaWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuc2V0Wm9vbU9uQ2xpY2soem9vbU9uQ2xpY2spO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JNYXJrZXJDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgY29uc3QgaW5pdGlhbE1hcmtlcnM6IGdvb2dsZS5tYXBzLk1hcmtlcltdID0gW107XG4gICAgZm9yIChjb25zdCBtYXJrZXIgb2YgdGhpcy5fZ2V0SW50ZXJuYWxNYXJrZXJzKHRoaXMuX21hcmtlcnMudG9BcnJheSgpKSkge1xuICAgICAgdGhpcy5fY3VycmVudE1hcmtlcnMuYWRkKG1hcmtlcik7XG4gICAgICBpbml0aWFsTWFya2Vycy5wdXNoKG1hcmtlcik7XG4gICAgfVxuICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLmFkZE1hcmtlcnMoaW5pdGlhbE1hcmtlcnMpO1xuXG4gICAgdGhpcy5fbWFya2Vycy5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoXG4gICAgICAobWFya2VyQ29tcG9uZW50czogTWFwTWFya2VyW10pID0+IHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgY29uc3QgbmV3TWFya2VycyA9IG5ldyBTZXQ8Z29vZ2xlLm1hcHMuTWFya2VyPih0aGlzLl9nZXRJbnRlcm5hbE1hcmtlcnMobWFya2VyQ29tcG9uZW50cykpO1xuICAgICAgICBjb25zdCBtYXJrZXJzVG9BZGQ6IGdvb2dsZS5tYXBzLk1hcmtlcltdID0gW107XG4gICAgICAgIGNvbnN0IG1hcmtlcnNUb1JlbW92ZTogZ29vZ2xlLm1hcHMuTWFya2VyW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBtYXJrZXIgb2YgQXJyYXkuZnJvbShuZXdNYXJrZXJzKSkge1xuICAgICAgICAgIGlmICghdGhpcy5fY3VycmVudE1hcmtlcnMuaGFzKG1hcmtlcikpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRNYXJrZXJzLmFkZChtYXJrZXIpO1xuICAgICAgICAgICAgbWFya2Vyc1RvQWRkLnB1c2gobWFya2VyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBtYXJrZXIgb2YgQXJyYXkuZnJvbSh0aGlzLl9jdXJyZW50TWFya2VycykpIHtcbiAgICAgICAgICBpZiAoIW5ld01hcmtlcnMuaGFzKG1hcmtlcikpIHtcbiAgICAgICAgICAgIG1hcmtlcnNUb1JlbW92ZS5wdXNoKG1hcmtlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLmFkZE1hcmtlcnMobWFya2Vyc1RvQWRkLCB0cnVlKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIucmVtb3ZlTWFya2VycyhtYXJrZXJzVG9SZW1vdmUsIHRydWUpO1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5yZXBhaW50KCk7XG4gICAgICAgIGZvciAoY29uc3QgbWFya2VyIG9mIG1hcmtlcnNUb1JlbW92ZSkge1xuICAgICAgICAgIHRoaXMuX2N1cnJlbnRNYXJrZXJzLmRlbGV0ZShtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRJbnRlcm5hbE1hcmtlcnMobWFya2VyczogTWFwTWFya2VyW10pOiBnb29nbGUubWFwcy5NYXJrZXJbXSB7XG4gICAgcmV0dXJuIG1hcmtlcnMuZmlsdGVyKG1hcmtlckNvbXBvbmVudCA9PiAhIW1hcmtlckNvbXBvbmVudC5tYXJrZXIpXG4gICAgICAgIC5tYXAobWFya2VyQ29tcG9uZW50ID0+IG1hcmtlckNvbXBvbmVudC5tYXJrZXIhKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7bWFya2VyQ2x1c3RlcmVyOiBNYXJrZXJDbHVzdGVyZXJ9IHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXApIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBhY2Nlc3MgR29vZ2xlIE1hcCBpbmZvcm1hdGlvbiBiZWZvcmUgdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgQVBJIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLm1hcmtlckNsdXN0ZXJlcikge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBNYXJrZXJDbHVzdGVyZXIgYmVmb3JlIGl0IGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBNYXJrZXJDbHVzdGVyZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=