/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-marker/map-marker.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/// <reference types="googlemaps" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
import { ChangeDetectionStrategy, Component, Input, Output, ViewEncapsulation, NgZone } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
/**
 * Default options for the Google Maps marker component. Displays a marker
 * at the Googleplex.
 * @type {?}
 */
export const DEFAULT_MARKER_OPTIONS = {
    position: { lat: 37.421995, lng: -122.084092 },
};
/**
 * Angular component that renders a Google Maps marker via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/marker
 */
export class MapMarker {
    /**
     * @param {?} _googleMap
     * @param {?} _ngZone
     */
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(this._ngZone);
        this._options = new BehaviorSubject(DEFAULT_MARKER_OPTIONS);
        this._title = new BehaviorSubject(undefined);
        this._position = new BehaviorSubject(undefined);
        this._label = new BehaviorSubject(undefined);
        this._clickable = new BehaviorSubject(undefined);
        this._destroy = new Subject();
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.animation_changed
         */
        this.animationChanged = this._eventManager.getLazyEmitter('animation_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.click
         */
        this.mapClick = this._eventManager.getLazyEmitter('click');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.clickable_changed
         */
        this.clickableChanged = this._eventManager.getLazyEmitter('clickable_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.cursor_changed
         */
        this.cursorChanged = this._eventManager.getLazyEmitter('cursor_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dblclick
         */
        this.mapDblclick = this._eventManager.getLazyEmitter('dblclick');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.drag
         */
        this.mapDrag = this._eventManager.getLazyEmitter('drag');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragend
         */
        this.mapDragend = this._eventManager.getLazyEmitter('dragend');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.draggable_changed
         */
        this.draggableChanged = this._eventManager.getLazyEmitter('draggable_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragstart
         */
        this.mapDragstart = this._eventManager.getLazyEmitter('dragstart');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.flat_changed
         */
        this.flatChanged = this._eventManager.getLazyEmitter('flat_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.icon_changed
         */
        this.iconChanged = this._eventManager.getLazyEmitter('icon_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mousedown
         */
        this.mapMousedown = this._eventManager.getLazyEmitter('mousedown');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseout
         */
        this.mapMouseout = this._eventManager.getLazyEmitter('mouseout');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseover
         */
        this.mapMouseover = this._eventManager.getLazyEmitter('mouseover');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseup
         */
        this.mapMouseup = this._eventManager.getLazyEmitter('mouseup');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.position_changed
         */
        this.positionChanged = this._eventManager.getLazyEmitter('position_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.rightclick
         */
        this.mapRightclick = this._eventManager.getLazyEmitter('rightclick');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.shape_changed
         */
        this.shapeChanged = this._eventManager.getLazyEmitter('shape_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.title_changed
         */
        this.titleChanged = this._eventManager.getLazyEmitter('title_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.visible_changed
         */
        this.visibleChanged = this._eventManager.getLazyEmitter('visible_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.zindex_changed
         */
        this.zindexChanged = this._eventManager.getLazyEmitter('zindex_changed');
    }
    /**
     * @param {?} options
     * @return {?}
     */
    set options(options) {
        this._options.next(options || DEFAULT_MARKER_OPTIONS);
    }
    /**
     * @param {?} title
     * @return {?}
     */
    set title(title) {
        this._title.next(title);
    }
    /**
     * @param {?} position
     * @return {?}
     */
    set position(position) {
        this._position.next(position);
    }
    /**
     * @param {?} label
     * @return {?}
     */
    set label(label) {
        this._label.next(label);
    }
    /**
     * @param {?} clickable
     * @return {?}
     */
    set clickable(clickable) {
        this._clickable.next(clickable);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this._googleMap._isBrowser) {
            this._combineOptions().pipe(take(1)).subscribe((/**
             * @param {?} options
             * @return {?}
             */
            options => {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                this._ngZone.runOutsideAngular((/**
                 * @return {?}
                 */
                () => this._marker = new google.maps.Marker(options)));
                (/** @type {?} */ (this._marker)).setMap(this._googleMap._googleMap);
                this._eventManager.setTarget(this._marker);
            }));
            this._watchForOptionsChanges();
            this._watchForTitleChanges();
            this._watchForPositionChanges();
            this._watchForLabelChanges();
            this._watchForClickableChanges();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._destroy.next();
        this._destroy.complete();
        this._eventManager.destroy();
        if (this._marker) {
            this._marker.setMap(null);
        }
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getAnimation
     * @return {?}
     */
    getAnimation() {
        return (this._marker && this._marker.getAnimation()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getClickable
     * @return {?}
     */
    getClickable() {
        return this._marker ? this._marker.getClickable() : false;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getCursor
     * @return {?}
     */
    getCursor() {
        return (this._marker && this._marker.getCursor()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getDraggable
     * @return {?}
     */
    getDraggable() {
        return this._marker ? !!this._marker.getDraggable() : false;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getIcon
     * @return {?}
     */
    getIcon() {
        return (this._marker && this._marker.getIcon()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getLabel
     * @return {?}
     */
    getLabel() {
        return (this._marker && this._marker.getLabel()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getOpacity
     * @return {?}
     */
    getOpacity() {
        return (this._marker && this._marker.getOpacity()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getPosition
     * @return {?}
     */
    getPosition() {
        return (this._marker && this._marker.getPosition()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getShape
     * @return {?}
     */
    getShape() {
        return (this._marker && this._marker.getShape()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getTitle
     * @return {?}
     */
    getTitle() {
        return (this._marker && this._marker.getTitle()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getVisible
     * @return {?}
     */
    getVisible() {
        return this._marker ? this._marker.getVisible() : false;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getZIndex
     * @return {?}
     */
    getZIndex() {
        return (this._marker && this._marker.getZIndex()) || null;
    }
    /**
     * @private
     * @return {?}
     */
    _combineOptions() {
        return combineLatest([this._options, this._title, this._position, this._label, this._clickable])
            .pipe(map((/**
         * @param {?} __0
         * @return {?}
         */
        ([options, title, position, label, clickable]) => {
            /** @type {?} */
            const combinedOptions = Object.assign(Object.assign({}, options), { title: title || options.title, position: position || options.position, label: label || options.label, clickable: clickable !== undefined ? clickable : options.clickable, map: this._googleMap._googleMap || null });
            return combinedOptions;
        })));
    }
    /**
     * @private
     * @return {?}
     */
    _watchForOptionsChanges() {
        this._options.pipe(takeUntil(this._destroy)).subscribe((/**
         * @param {?} options
         * @return {?}
         */
        options => {
            if (this._marker) {
                this._marker.setOptions(options);
            }
        }));
    }
    /**
     * @private
     * @return {?}
     */
    _watchForTitleChanges() {
        this._title.pipe(takeUntil(this._destroy)).subscribe((/**
         * @param {?} title
         * @return {?}
         */
        title => {
            if (this._marker && title !== undefined) {
                this._marker.setTitle(title);
            }
        }));
    }
    /**
     * @private
     * @return {?}
     */
    _watchForPositionChanges() {
        this._position.pipe(takeUntil(this._destroy)).subscribe((/**
         * @param {?} position
         * @return {?}
         */
        position => {
            if (this._marker && position) {
                this._marker.setPosition(position);
            }
        }));
    }
    /**
     * @private
     * @return {?}
     */
    _watchForLabelChanges() {
        this._label.pipe(takeUntil(this._destroy)).subscribe((/**
         * @param {?} label
         * @return {?}
         */
        label => {
            if (this._marker && label !== undefined) {
                this._marker.setLabel(label);
            }
        }));
    }
    /**
     * @private
     * @return {?}
     */
    _watchForClickableChanges() {
        this._clickable.pipe(takeUntil(this._destroy)).subscribe((/**
         * @param {?} clickable
         * @return {?}
         */
        clickable => {
            if (this._marker && clickable !== undefined) {
                this._marker.setClickable(clickable);
            }
        }));
    }
}
MapMarker.decorators = [
    { type: Component, args: [{
                selector: 'map-marker',
                template: '<ng-content></ng-content>',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None
            }] }
];
/** @nocollapse */
MapMarker.ctorParameters = () => [
    { type: GoogleMap },
    { type: NgZone }
];
MapMarker.propDecorators = {
    options: [{ type: Input }],
    title: [{ type: Input }],
    position: [{ type: Input }],
    label: [{ type: Input }],
    clickable: [{ type: Input }],
    animationChanged: [{ type: Output }],
    mapClick: [{ type: Output }],
    clickableChanged: [{ type: Output }],
    cursorChanged: [{ type: Output }],
    mapDblclick: [{ type: Output }],
    mapDrag: [{ type: Output }],
    mapDragend: [{ type: Output }],
    draggableChanged: [{ type: Output }],
    mapDragstart: [{ type: Output }],
    flatChanged: [{ type: Output }],
    iconChanged: [{ type: Output }],
    mapMousedown: [{ type: Output }],
    mapMouseout: [{ type: Output }],
    mapMouseover: [{ type: Output }],
    mapMouseup: [{ type: Output }],
    positionChanged: [{ type: Output }],
    mapRightclick: [{ type: Output }],
    shapeChanged: [{ type: Output }],
    titleChanged: [{ type: Output }],
    visibleChanged: [{ type: Output }],
    zindexChanged: [{ type: Output }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._eventManager;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._options;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._title;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._position;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._label;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._clickable;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._destroy;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.animation_changed
     * @type {?}
     */
    MapMarker.prototype.animationChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.click
     * @type {?}
     */
    MapMarker.prototype.mapClick;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.clickable_changed
     * @type {?}
     */
    MapMarker.prototype.clickableChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.cursor_changed
     * @type {?}
     */
    MapMarker.prototype.cursorChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dblclick
     * @type {?}
     */
    MapMarker.prototype.mapDblclick;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.drag
     * @type {?}
     */
    MapMarker.prototype.mapDrag;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragend
     * @type {?}
     */
    MapMarker.prototype.mapDragend;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.draggable_changed
     * @type {?}
     */
    MapMarker.prototype.draggableChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragstart
     * @type {?}
     */
    MapMarker.prototype.mapDragstart;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.flat_changed
     * @type {?}
     */
    MapMarker.prototype.flatChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.icon_changed
     * @type {?}
     */
    MapMarker.prototype.iconChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mousedown
     * @type {?}
     */
    MapMarker.prototype.mapMousedown;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseout
     * @type {?}
     */
    MapMarker.prototype.mapMouseout;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseover
     * @type {?}
     */
    MapMarker.prototype.mapMouseover;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseup
     * @type {?}
     */
    MapMarker.prototype.mapMouseup;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.position_changed
     * @type {?}
     */
    MapMarker.prototype.positionChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.rightclick
     * @type {?}
     */
    MapMarker.prototype.mapRightclick;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.shape_changed
     * @type {?}
     */
    MapMarker.prototype.shapeChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.title_changed
     * @type {?}
     */
    MapMarker.prototype.titleChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.visible_changed
     * @type {?}
     */
    MapMarker.prototype.visibleChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.zindex_changed
     * @type {?}
     */
    MapMarker.prototype.zindexChanged;
    /** @type {?} */
    MapMarker.prototype._marker;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._googleMap;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtbWFya2VyL21hcC1tYXJrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFTQSxvQ0FBb0M7Ozs7Ozs7Ozs7QUFFcEMsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsS0FBSyxFQUdMLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsTUFBTSxFQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekUsT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7Ozs7O0FBTXJELE1BQU0sT0FBTyxzQkFBc0IsR0FBRztJQUNwQyxRQUFRLEVBQUUsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBQztDQUM3Qzs7Ozs7QUFZRCxNQUFNLE9BQU8sU0FBUzs7Ozs7SUFrTXBCLFlBQ21CLFVBQXFCLEVBQzlCLE9BQWU7UUFETixlQUFVLEdBQVYsVUFBVSxDQUFXO1FBQzlCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFuTWpCLGtCQUFhLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLGFBQVEsR0FDckIsSUFBSSxlQUFlLENBQTRCLHNCQUFzQixDQUFDLENBQUM7UUFDMUQsV0FBTSxHQUFHLElBQUksZUFBZSxDQUFtQixTQUFTLENBQUMsQ0FBQztRQUMxRCxjQUFTLEdBQ3RCLElBQUksZUFBZSxDQUF5RCxTQUFTLENB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QUFDLFFBQVEsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDO0lBQzNELENBQUM7Ozs7OztJQU1ELFVBQVU7UUFDUixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDO0lBQzdELENBQUM7Ozs7OztJQU1ELFdBQVc7UUFDVCxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDO0lBQzlELENBQUM7Ozs7OztJQU1ELFFBQVE7UUFDTixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDO0lBQzNELENBQUM7Ozs7OztJQU1ELFFBQVE7UUFDTixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDO0lBQzNELENBQUM7Ozs7OztJQU1ELFVBQVU7UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUMxRCxDQUFDOzs7Ozs7SUFNRCxTQUFTO1FBQ1AsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQztJQUM1RCxDQUFDOzs7OztJQUVPLGVBQWU7UUFDckIsT0FBTyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUMzRixJQUFJLENBQUMsR0FBRzs7OztRQUFDLENBQUMs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Y2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZW1hcHNcIiAvPlxuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE5nWm9uZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG4vKipcbiAqIERlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIEdvb2dsZSBNYXBzIG1hcmtlciBjb21wb25lbnQuIERpc3BsYXlzIGEgbWFya2VyXG4gKiBhdCB0aGUgR29vZ2xlcGxleC5cbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTUFSS0VSX09QVElPTlMgPSB7XG4gIHBvc2l0aW9uOiB7bGF0OiAzNy40MjE5OTUsIGxuZzogLTEyMi4wODQwOTJ9LFxufTtcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBtYXJrZXIgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXJcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWFwLW1hcmtlcicsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBNYXJrZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIodGhpcy5fbmdab25lKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfb3B0aW9ucyA9XG4gICAgICBuZXcgQmVoYXZpb3JTdWJqZWN0PGdvb2dsZS5tYXBzLk1hcmtlck9wdGlvbnM+KERFRkFVTFRfTUFSS0VSX09QVElPTlMpO1xuICBwcml2YXRlIHJlYWRvbmx5IF90aXRsZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nfHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfcG9zaXRpb24gPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsfGdvb2dsZS5tYXBzLkxhdExuZ3x1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2xhYmVsID1cbiAgICAgIG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nfGdvb2dsZS5tYXBzLk1hcmtlckxhYmVsfHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfY2xpY2thYmxlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFufHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogZ29vZ2xlLm1hcHMuTWFya2VyT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMubmV4dChvcHRpb25zIHx8IERFRkFVTFRfTUFSS0VSX09QVElPTlMpO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHRpdGxlKHRpdGxlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90aXRsZS5uZXh0KHRpdGxlKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBwb3NpdGlvbihwb3NpdGlvbjogZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbHxnb29nbGUubWFwcy5MYXRMbmcpIHtcbiAgICB0aGlzLl9wb3NpdGlvbi5uZXh0KHBvc2l0aW9uKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBsYWJlbChsYWJlbDogc3RyaW5nfGdvb2dsZS5tYXBzLk1hcmtlckxhYmVsKSB7XG4gICAgdGhpcy5fbGFiZWwubmV4dChsYWJlbCk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgY2xpY2thYmxlKGNsaWNrYWJsZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2NsaWNrYWJsZS5uZXh0KGNsaWNrYWJsZSk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5hbmltYXRpb25fY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGFuaW1hdGlvbkNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2FuaW1hdGlvbl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBDbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuY2xpY2thYmxlX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjbGlja2FibGVDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjbGlja2FibGVfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmN1cnNvcl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY3Vyc29yQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY3Vyc29yX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5kYmxjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcERibGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZGJsY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5kcmFnXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwRHJhZzogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5kcmFnZW5kXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwRHJhZ2VuZDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWdlbmQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5kcmFnZ2FibGVfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGRyYWdnYWJsZUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWdnYWJsZV9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZHJhZ3N0YXJ0XG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwRHJhZ3N0YXJ0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZHJhZ3N0YXJ0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZmxhdF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgZmxhdENoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2ZsYXRfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmljb25fY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIGljb25DaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdpY29uX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5tb3VzZWRvd25cbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBNb3VzZWRvd246IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdtb3VzZWRvd24nKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5tb3VzZW91dFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcE1vdXNlb3V0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignbW91c2VvdXQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5tb3VzZW92ZXJcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBNb3VzZW92ZXI6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdtb3VzZW92ZXInKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5tb3VzZXVwXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwTW91c2V1cDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNldXAnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5wb3NpdGlvbl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9zaXRpb25DaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdwb3NpdGlvbl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIucmlnaHRjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcFJpZ2h0Y2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdyaWdodGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuc2hhcGVfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHNoYXBlQ2hhbmdlZDpcbiAgT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignc2hhcGVfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnRpdGxlX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICB0aXRsZUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3RpdGxlX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci52aXNpYmxlX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICB2aXNpYmxlQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigndmlzaWJsZV9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuemluZGV4X2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICB6aW5kZXhDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd6aW5kZXhfY2hhbmdlZCcpO1xuXG4gIF9tYXJrZXI/OiBnb29nbGUubWFwcy5NYXJrZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZ29vZ2xlTWFwOiBHb29nbGVNYXAsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2dvb2dsZU1hcC5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb21iaW5lT3B0aW9ucygpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gdGhpcy5fbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcihvcHRpb25zKSk7XG4gICAgICAgIHRoaXMuX21hcmtlciEuc2V0TWFwKHRoaXMuX2dvb2dsZU1hcC5fZ29vZ2xlTWFwKTtcbiAgICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLl9tYXJrZXIpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yVGl0bGVDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclBvc2l0aW9uQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JMYWJlbENoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yQ2xpY2thYmxlQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3kubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3kuY29tcGxldGUoKTtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIGlmICh0aGlzLl9tYXJrZXIpIHtcbiAgICAgIHRoaXMuX21hcmtlci5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0QW5pbWF0aW9uXG4gICAqL1xuICBnZXRBbmltYXRpb24oKTogZ29vZ2xlLm1hcHMuQW5pbWF0aW9ufG51bGwge1xuICAgIHJldHVybiAodGhpcy5fbWFya2VyICYmIHRoaXMuX21hcmtlci5nZXRBbmltYXRpb24oKSkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldENsaWNrYWJsZVxuICAgKi9cbiAgZ2V0Q2xpY2thYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9tYXJrZXIgPyB0aGlzLl9tYXJrZXIuZ2V0Q2xpY2thYmxlKCkgOiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldEN1cnNvclxuICAgKi9cbiAgZ2V0Q3Vyc29yKCk6IHN0cmluZ3xudWxsIHtcbiAgICByZXR1cm4gKHRoaXMuX21hcmtlciAmJiB0aGlzLl9tYXJrZXIuZ2V0Q3Vyc29yKCkpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXREcmFnZ2FibGVcbiAgICovXG4gIGdldERyYWdnYWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbWFya2VyID8gISF0aGlzLl9tYXJrZXIuZ2V0RHJhZ2dhYmxlKCkgOiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldEljb25cbiAgICovXG4gIGdldEljb24oKTogc3RyaW5nfGdvb2dsZS5tYXBzLkljb258Z29vZ2xlLm1hcHMuU3ltYm9sfG51bGwge1xuICAgIHJldHVybiAodGhpcy5fbWFya2VyICYmIHRoaXMuX21hcmtlci5nZXRJY29uKCkpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRMYWJlbFxuICAgKi9cbiAgZ2V0TGFiZWwoKTogZ29vZ2xlLm1hcHMuTWFya2VyTGFiZWx8bnVsbCB7XG4gICAgcmV0dXJuICh0aGlzLl9tYXJrZXIgJiYgdGhpcy5fbWFya2VyLmdldExhYmVsKCkpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRPcGFjaXR5XG4gICAqL1xuICBnZXRPcGFjaXR5KCk6IG51bWJlcnxudWxsIHtcbiAgICByZXR1cm4gKHRoaXMuX21hcmtlciAmJiB0aGlzLl9tYXJrZXIuZ2V0T3BhY2l0eSgpKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0UG9zaXRpb25cbiAgICovXG4gIGdldFBvc2l0aW9uKCk6IGdvb2dsZS5tYXBzLkxhdExuZ3xudWxsIHtcbiAgICByZXR1cm4gKHRoaXMuX21hcmtlciAmJiB0aGlzLl9tYXJrZXIuZ2V0UG9zaXRpb24oKSkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFNoYXBlXG4gICAqL1xuICBnZXRTaGFwZSgpOiBnb29nbGUubWFwcy5NYXJrZXJTaGFwZXxudWxsIHtcbiAgICByZXR1cm4gKHRoaXMuX21hcmtlciAmJiB0aGlzLl9tYXJrZXIuZ2V0U2hhcGUoKSkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFRpdGxlXG4gICAqL1xuICBnZXRUaXRsZSgpOiBzdHJpbmd8bnVsbCB7XG4gICAgcmV0dXJuICh0aGlzLl9tYXJrZXIgJiYgdGhpcy5fbWFya2VyLmdldFRpdGxlKCkpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRWaXNpYmxlXG4gICAqL1xuICBnZXRWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9tYXJrZXIgPyB0aGlzLl9tYXJrZXIuZ2V0VmlzaWJsZSgpIDogZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRaSW5kZXhcbiAgICovXG4gIGdldFpJbmRleCgpOiBudW1iZXJ8bnVsbCB7XG4gICAgcmV0dXJuICh0aGlzLl9tYXJrZXIgJiYgdGhpcy5fbWFya2VyLmdldFpJbmRleCgpKSB8fCBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXJrZXJPcHRpb25zPiB7XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoW3RoaXMuX29wdGlvbnMsIHRoaXMuX3RpdGxlLCB0aGlzLl9wb3NpdGlvbiwgdGhpcy5fbGFiZWwsIHRoaXMuX2NsaWNrYWJsZV0pXG4gICAgICAgIC5waXBlKG1hcCgoW29wdGlvbnMsIHRpdGxlLCBwb3NpdGlvbiwgbGFiZWwsIGNsaWNrYWJsZV0pID0+IHtcbiAgICAgICAgICBjb25zdCBjb21iaW5lZE9wdGlvbnM6IGdvb2dsZS5tYXBzLk1hcmtlck9wdGlvbnMgPSB7XG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgdGl0bGU6IHRpdGxlIHx8IG9wdGlvbnMudGl0bGUsXG4gICAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24gfHwgb3B0aW9ucy5wb3NpdGlvbixcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbCB8fCBvcHRpb25zLmxhYmVsLFxuICAgICAgICAgICAgY2xpY2thYmxlOiBjbGlja2FibGUgIT09IHVuZGVmaW5lZCA/IGNsaWNrYWJsZSA6IG9wdGlvbnMuY2xpY2thYmxlLFxuICAgICAgICAgICAgbWFwOiB0aGlzLl9nb29nbGVNYXAuX2dvb2dsZU1hcCB8fCBudWxsLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIGNvbWJpbmVkT3B0aW9ucztcbiAgICAgICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9vcHRpb25zLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICBpZiAodGhpcy5fbWFya2VyKSB7XG4gICAgICAgIHRoaXMuX21hcmtlci5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JUaXRsZUNoYW5nZXMoKSB7XG4gICAgdGhpcy5fdGl0bGUucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZSh0aXRsZSA9PiB7XG4gICAgICBpZiAodGhpcy5fbWFya2VyICYmIHRpdGxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fbWFya2VyLnNldFRpdGxlKHRpdGxlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yUG9zaXRpb25DaGFuZ2VzKCkge1xuICAgIHRoaXMuX3Bvc2l0aW9uLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUocG9zaXRpb24gPT4ge1xuICAgICAgaWYgKHRoaXMuX21hcmtlciAmJiBwb3NpdGlvbikge1xuICAgICAgICB0aGlzLl9tYXJrZXIuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JMYWJlbENoYW5nZXMoKSB7XG4gICAgdGhpcy5fbGFiZWwucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShsYWJlbCA9PiB7XG4gICAgICBpZiAodGhpcy5fbWFya2VyICYmIGxhYmVsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fbWFya2VyLnNldExhYmVsKGxhYmVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yQ2xpY2thYmxlQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9jbGlja2FibGUucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShjbGlja2FibGUgPT4ge1xuICAgICAgaWYgKHRoaXMuX21hcmtlciAmJiBjbGlja2FibGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9tYXJrZXIuc2V0Q2xpY2thYmxlKGNsaWNrYWJsZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==