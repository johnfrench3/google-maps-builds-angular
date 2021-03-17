/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
import { Input, NgZone, Directive, } from '@angular/core';
import { GoogleMap } from '../google-map/google-map';
/**
 * Angular directive that renders a Google Maps heatmap via the Google Maps JavaScript API.
 *
 * See: https://developers.google.com/maps/documentation/javascript/reference/visualization
 */
export class MapHeatmapLayer {
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
    }
    /**
     * Data shown on the heatmap.
     * See: https://developers.google.com/maps/documentation/javascript/reference/visualization
     */
    set data(data) {
        this._data = data;
    }
    /**
     * Options used to configure the heatmap. See:
     * developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayerOptions
     */
    set options(options) {
        this._options = options;
    }
    ngOnInit() {
        var _a, _b;
        if (this._googleMap._isBrowser) {
            if (!((_b = (_a = window.google) === null || _a === void 0 ? void 0 : _a.maps) === null || _b === void 0 ? void 0 : _b.visualization) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('Namespace `google.maps.visualization` not found, cannot construct heatmap. ' +
                    'Please install the Google Maps JavaScript API with the "visualization" library: ' +
                    'https://developers.google.com/maps/documentation/javascript/visualization');
            }
            // Create the object outside the zone so its events don't trigger change detection.
            // We'll bring it back in inside the `MapEventManager` only for the events that the
            // user has subscribed to.
            this._ngZone.runOutsideAngular(() => {
                this.heatmap = new google.maps.visualization.HeatmapLayer(this._combineOptions());
            });
            this._assertInitialized();
            this.heatmap.setMap(this._googleMap.googleMap);
        }
    }
    ngOnChanges(changes) {
        const { _data, heatmap } = this;
        if (heatmap) {
            if (changes['options']) {
                heatmap.setOptions(this._combineOptions());
            }
            if (changes['data'] && _data !== undefined) {
                heatmap.setData(this._normalizeData(_data));
            }
        }
    }
    ngOnDestroy() {
        if (this.heatmap) {
            this.heatmap.setMap(null);
        }
    }
    /**
     * Gets the data that is currently shown on the heatmap.
     * See: developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayer
     */
    getData() {
        this._assertInitialized();
        return this.heatmap.getData();
    }
    /** Creates a combined options object using the passed-in options and the individual inputs. */
    _combineOptions() {
        const options = this._options || {};
        return Object.assign(Object.assign({}, options), { data: this._normalizeData(this._data || options.data || []), map: this._googleMap.googleMap });
    }
    /**
     * Most Google Maps APIs support both `LatLng` objects and `LatLngLiteral`. The latter is more
     * convenient to write out, because the Google Maps API doesn't have to have been loaded in order
     * to construct them. The `HeatmapLayer` appears to be an exception that only allows a `LatLng`
     * object, or it throws a runtime error. Since it's more convenient and we expect that Angular
     * users will load the API asynchronously, we allow them to pass in a `LatLngLiteral` and we
     * convert it to a `LatLng` object before passing it off to Google Maps.
     */
    _normalizeData(data) {
        const result = [];
        data.forEach(item => {
            result.push(isLatLngLiteral(item) ? new google.maps.LatLng(item.lat, item.lng) : item);
        });
        return result;
    }
    /** Asserts that the heatmap object has been initialized. */
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this._googleMap.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.heatmap) {
                throw Error('Cannot interact with a Google Map HeatmapLayer before it has been ' +
                    'initialized. Please wait for the heatmap to load before trying to interact with it.');
            }
        }
    }
}
MapHeatmapLayer.decorators = [
    { type: Directive, args: [{
                selector: 'map-heatmap-layer',
                exportAs: 'mapHeatmapLayer',
            },] }
];
MapHeatmapLayer.ctorParameters = () => [
    { type: GoogleMap },
    { type: NgZone }
];
MapHeatmapLayer.propDecorators = {
    data: [{ type: Input }],
    options: [{ type: Input }]
};
/** Asserts that an object is a `LatLngLiteral`. */
function isLatLngLiteral(value) {
    return value && typeof value.lat === 'number' && typeof value.lng === 'number';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWhlYXRtYXAtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWhlYXRtYXAtbGF5ZXIvbWFwLWhlYXRtYXAtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUVwQyxPQUFPLEVBQ0wsS0FBSyxFQUdMLE1BQU0sRUFDTixTQUFTLEdBR1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBU25EOzs7O0dBSUc7QUFLSCxNQUFNLE9BQU8sZUFBZTtJQTRCMUIsWUFDbUIsVUFBcUIsRUFDOUIsT0FBZTtRQUROLGVBQVUsR0FBVixVQUFVLENBQVc7UUFDOUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtJQUFHLENBQUM7SUE3QjdCOzs7T0FHRztJQUNILElBQ0ksSUFBSSxDQUFDLElBQWlCO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLE9BQU8sQ0FBQyxPQUErRDtRQUN6RSxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0lBY0QsUUFBUTs7UUFDTixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFO1lBQzlCLElBQUksQ0FBQyxDQUFBLE1BQUEsTUFBQSxNQUFNLENBQUMsTUFBTSwwQ0FBRSxJQUFJLDBDQUFFLGFBQWEsQ0FBQSxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUFFO2dCQUMxRixNQUFNLEtBQUssQ0FDUCw2RUFBNkU7b0JBQzdFLGtGQUFrRjtvQkFDbEYsMkVBQTJFLENBQUMsQ0FBQzthQUNsRjtZQUVELG1GQUFtRjtZQUNuRixtRkFBbUY7WUFDbkYsMEJBQTBCO1lBQzFC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Szs7QUErR1IsbURBQW1EO0FBQ25ELFNBQVMsZUFBZSxDQUFDLEtBQVU7SUFDakMsT0FBTyxLQUFLLElBQUksT0FBTyxLQUFLLENBQUMsR0FBRyxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssQ0FBQyxHQUFHLEtBQUssUUFBUSxDQUFDO0FBQ2pGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGVtYXBzXCIgLz5cblxuaW1wb3J0IHtcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBOZ1pvbmUsXG4gIERpcmVjdGl2ZSxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5cbi8qKiBQb3NzaWJsZSBkYXRhIHRoYXQgY2FuIGJlIHNob3duIG9uIGEgaGVhdG1hcCBsYXllci4gKi9cbmV4cG9ydCB0eXBlIEhlYXRtYXBEYXRhID1cbiAgZ29vZ2xlLm1hcHMuTVZDQXJyYXk8XG4gICAgZ29vZ2xlLm1hcHMuTGF0TG5nIHwgZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5XZWlnaHRlZExvY2F0aW9uIHwgZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbD4gfFxuICAoZ29vZ2xlLm1hcHMuTGF0TG5nIHwgZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5XZWlnaHRlZExvY2F0aW9uIHwgZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbClbXTtcblxuXG4vKipcbiAqIEFuZ3VsYXIgZGlyZWN0aXZlIHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIGhlYXRtYXAgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqXG4gKiBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS92aXN1YWxpemF0aW9uXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC1oZWF0bWFwLWxheWVyJyxcbiAgZXhwb3J0QXM6ICdtYXBIZWF0bWFwTGF5ZXInLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBIZWF0bWFwTGF5ZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIERhdGEgc2hvd24gb24gdGhlIGhlYXRtYXAuXG4gICAqIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3Zpc3VhbGl6YXRpb25cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBkYXRhKGRhdGE6IEhlYXRtYXBEYXRhKSB7XG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gIH1cbiAgcHJpdmF0ZSBfZGF0YTogSGVhdG1hcERhdGE7XG5cbiAgLyoqXG4gICAqIE9wdGlvbnMgdXNlZCB0byBjb25maWd1cmUgdGhlIGhlYXRtYXAuIFNlZTpcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS92aXN1YWxpemF0aW9uI0hlYXRtYXBMYXllck9wdGlvbnNcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IFBhcnRpYWw8Z29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXJPcHRpb25zPikge1xuICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICB9XG4gIHByaXZhdGUgX29wdGlvbnM6IFBhcnRpYWw8Z29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXJPcHRpb25zPjtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXIgb2JqZWN0LlxuICAgKlxuICAgKiBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS92aXN1YWxpemF0aW9uXG4gICAqL1xuICBoZWF0bWFwPzogZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZ29vZ2xlTWFwOiBHb29nbGVNYXAsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2dvb2dsZU1hcC5faXNCcm93c2VyKSB7XG4gICAgICBpZiAoIXdpbmRvdy5nb29nbGU/Lm1hcHM/LnZpc3VhbGl6YXRpb24gJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAnTmFtZXNwYWNlIGBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uYCBub3QgZm91bmQsIGNhbm5vdCBjb25zdHJ1Y3QgaGVhdG1hcC4gJyArXG4gICAgICAgICAgICAnUGxlYXNlIGluc3RhbGwgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJIHdpdGggdGhlIFwidmlzdWFsaXphdGlvblwiIGxpYnJhcnk6ICcgK1xuICAgICAgICAgICAgJ2h0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5oZWF0bWFwID0gbmV3IGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5oZWF0bWFwLnNldE1hcCh0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwISk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHtfZGF0YSwgaGVhdG1hcH0gPSB0aGlzO1xuXG4gICAgaWYgKGhlYXRtYXApIHtcbiAgICAgIGlmIChjaGFuZ2VzWydvcHRpb25zJ10pIHtcbiAgICAgICAgaGVhdG1hcC5zZXRPcHRpb25zKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snZGF0YSddICYmIF9kYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaGVhdG1hcC5zZXREYXRhKHRoaXMuX25vcm1hbGl6ZURhdGEoX2RhdGEpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5oZWF0bWFwKSB7XG4gICAgICB0aGlzLmhlYXRtYXAuc2V0TWFwKG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBkYXRhIHRoYXQgaXMgY3VycmVudGx5IHNob3duIG9uIHRoZSBoZWF0bWFwLlxuICAgKiBTZWU6IGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvdmlzdWFsaXphdGlvbiNIZWF0bWFwTGF5ZXJcbiAgICovXG4gIGdldERhdGEoKTogSGVhdG1hcERhdGEge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuaGVhdG1hcC5nZXREYXRhKCk7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIGNvbWJpbmVkIG9wdGlvbnMgb2JqZWN0IHVzaW5nIHRoZSBwYXNzZWQtaW4gb3B0aW9ucyBhbmQgdGhlIGluZGl2aWR1YWwgaW5wdXRzLiAqL1xuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllck9wdGlvbnMge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zIHx8IHt9O1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgZGF0YTogdGhpcy5fbm9ybWFsaXplRGF0YSh0aGlzLl9kYXRhIHx8IG9wdGlvbnMuZGF0YSB8fCBbXSksXG4gICAgICBtYXA6IHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3N0IEdvb2dsZSBNYXBzIEFQSXMgc3VwcG9ydCBib3RoIGBMYXRMbmdgIG9iamVjdHMgYW5kIGBMYXRMbmdMaXRlcmFsYC4gVGhlIGxhdHRlciBpcyBtb3JlXG4gICAqIGNvbnZlbmllbnQgdG8gd3JpdGUgb3V0LCBiZWNhdXNlIHRoZSBHb29nbGUgTWFwcyBBUEkgZG9lc24ndCBoYXZlIHRvIGhhdmUgYmVlbiBsb2FkZWQgaW4gb3JkZXJcbiAgICogdG8gY29uc3RydWN0IHRoZW0uIFRoZSBgSGVhdG1hcExheWVyYCBhcHBlYXJzIHRvIGJlIGFuIGV4Y2VwdGlvbiB0aGF0IG9ubHkgYWxsb3dzIGEgYExhdExuZ2BcbiAgICogb2JqZWN0LCBvciBpdCB0aHJvd3MgYSBydW50aW1lIGVycm9yLiBTaW5jZSBpdCdzIG1vcmUgY29udmVuaWVudCBhbmQgd2UgZXhwZWN0IHRoYXQgQW5ndWxhclxuICAgKiB1c2VycyB3aWxsIGxvYWQgdGhlIEFQSSBhc3luY2hyb25vdXNseSwgd2UgYWxsb3cgdGhlbSB0byBwYXNzIGluIGEgYExhdExuZ0xpdGVyYWxgIGFuZCB3ZVxuICAgKiBjb252ZXJ0IGl0IHRvIGEgYExhdExuZ2Agb2JqZWN0IGJlZm9yZSBwYXNzaW5nIGl0IG9mZiB0byBHb29nbGUgTWFwcy5cbiAgICovXG4gIHByaXZhdGUgX25vcm1hbGl6ZURhdGEoZGF0YTogSGVhdG1hcERhdGEpIHtcbiAgICBjb25zdCByZXN1bHQ6IChnb29nbGUubWFwcy5MYXRMbmd8Z29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5XZWlnaHRlZExvY2F0aW9uKVtdID0gW107XG5cbiAgICBkYXRhLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICByZXN1bHQucHVzaChpc0xhdExuZ0xpdGVyYWwoaXRlbSkgPyBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGl0ZW0ubGF0LCBpdGVtLmxuZykgOiBpdGVtKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQXNzZXJ0cyB0aGF0IHRoZSBoZWF0bWFwIG9iamVjdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gKi9cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtoZWF0bWFwOiBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllcn0ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAgICdDYW5ub3QgYWNjZXNzIEdvb2dsZSBNYXAgaW5mb3JtYXRpb24gYmVmb3JlIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgQVBJIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmhlYXRtYXApIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIEhlYXRtYXBMYXllciBiZWZvcmUgaXQgaGFzIGJlZW4gJyArXG4gICAgICAgICAgICAnaW5pdGlhbGl6ZWQuIFBsZWFzZSB3YWl0IGZvciB0aGUgaGVhdG1hcCB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqIEFzc2VydHMgdGhhdCBhbiBvYmplY3QgaXMgYSBgTGF0TG5nTGl0ZXJhbGAuICovXG5mdW5jdGlvbiBpc0xhdExuZ0xpdGVyYWwodmFsdWU6IGFueSk6IHZhbHVlIGlzIGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLmxhdCA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHZhbHVlLmxuZyA9PT0gJ251bWJlcic7XG59XG4iXX0=