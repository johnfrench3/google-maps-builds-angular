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
import { Input, NgZone, Directive } from '@angular/core';
import { GoogleMap } from '../google-map/google-map';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Angular directive that renders a Google Maps heatmap via the Google Maps JavaScript API.
 *
 * See: https://developers.google.com/maps/documentation/javascript/reference/visualization
 */
export class MapHeatmapLayer {
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
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
    }
    ngOnInit() {
        if (this._googleMap._isBrowser) {
            if (!window.google?.maps?.visualization && (typeof ngDevMode === 'undefined' || ngDevMode)) {
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
        return {
            ...options,
            data: this._normalizeData(this._data || options.data || []),
            map: this._googleMap.googleMap,
        };
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
MapHeatmapLayer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MapHeatmapLayer, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
MapHeatmapLayer.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.0-rc.0", type: MapHeatmapLayer, selector: "map-heatmap-layer", inputs: { data: "data", options: "options" }, exportAs: ["mapHeatmapLayer"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MapHeatmapLayer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-heatmap-layer',
                    exportAs: 'mapHeatmapLayer',
                }]
        }], ctorParameters: function () { return [{ type: i1.GoogleMap }, { type: i0.NgZone }]; }, propDecorators: { data: [{
                type: Input
            }], options: [{
                type: Input
            }] } });
/** Asserts that an object is a `LatLngLiteral`. */
function isLatLngLiteral(value) {
    return value && typeof value.lat === 'number' && typeof value.lng === 'number';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWhlYXRtYXAtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWhlYXRtYXAtbGF5ZXIvbWFwLWhlYXRtYXAtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLEtBQUssRUFBcUIsTUFBTSxFQUFFLFNBQVMsRUFBMkIsTUFBTSxlQUFlLENBQUM7QUFFcEcsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDOzs7QUFTbkQ7Ozs7R0FJRztBQUtILE1BQU0sT0FBTyxlQUFlO0lBQzFCOzs7T0FHRztJQUNILElBQ0ksSUFBSSxDQUFDLElBQWlCO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLE9BQU8sQ0FBQyxPQUErRDtRQUN6RSxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0lBVUQsWUFBNkIsVUFBcUIsRUFBVSxPQUFlO1FBQTlDLGVBQVUsR0FBVixVQUFVLENBQVc7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFRO0lBQUcsQ0FBQztJQUUvRSxRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRTtZQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsYUFBYSxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUFFO2dCQUMxRixNQUFNLEtBQUssQ0FDVCw2RUFBNkU7b0JBQzNFLGtGQUFrRjtvQkFDbEYsMkVBQTJFLENBQzlFLENBQUM7YUFDSDtZQUVELG1GQUFtRjtZQUNuRixtRkFBbUY7WUFDbkYsMEJBQTBCO1lBQzFCLElBQUksQ0FB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LElBQUk7c0JBRFAsS0FBSztnQkFXRixPQUFPO3NCQURWLEtBQUs7O0FBZ0hSLG1EQUFtRDtBQUNuRCxTQUFTLGVBQWUsQ0FBQyxLQUFVO0lBQ2pDLE9BQU8sS0FBSyxJQUFJLE9BQU8sS0FBSyxDQUFDLEdBQUcsS0FBSyxRQUFRLElBQUksT0FBTyxLQUFLLENBQUMsR0FBRyxLQUFLLFFBQVEsQ0FBQztBQUNqRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge0lucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgTmdab25lLCBEaXJlY3RpdmUsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuXG4vKiogUG9zc2libGUgZGF0YSB0aGF0IGNhbiBiZSBzaG93biBvbiBhIGhlYXRtYXAgbGF5ZXIuICovXG5leHBvcnQgdHlwZSBIZWF0bWFwRGF0YSA9XG4gIHwgZ29vZ2xlLm1hcHMuTVZDQXJyYXk8XG4gICAgICBnb29nbGUubWFwcy5MYXRMbmcgfCBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLldlaWdodGVkTG9jYXRpb24gfCBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsXG4gICAgPlxuICB8IChnb29nbGUubWFwcy5MYXRMbmcgfCBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLldlaWdodGVkTG9jYXRpb24gfCBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsKVtdO1xuXG4vKipcbiAqIEFuZ3VsYXIgZGlyZWN0aXZlIHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIGhlYXRtYXAgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqXG4gKiBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS92aXN1YWxpemF0aW9uXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC1oZWF0bWFwLWxheWVyJyxcbiAgZXhwb3J0QXM6ICdtYXBIZWF0bWFwTGF5ZXInLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBIZWF0bWFwTGF5ZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIERhdGEgc2hvd24gb24gdGhlIGhlYXRtYXAuXG4gICAqIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3Zpc3VhbGl6YXRpb25cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBkYXRhKGRhdGE6IEhlYXRtYXBEYXRhKSB7XG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gIH1cbiAgcHJpdmF0ZSBfZGF0YTogSGVhdG1hcERhdGE7XG5cbiAgLyoqXG4gICAqIE9wdGlvbnMgdXNlZCB0byBjb25maWd1cmUgdGhlIGhlYXRtYXAuIFNlZTpcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS92aXN1YWxpemF0aW9uI0hlYXRtYXBMYXllck9wdGlvbnNcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IFBhcnRpYWw8Z29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXJPcHRpb25zPikge1xuICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICB9XG4gIHByaXZhdGUgX29wdGlvbnM6IFBhcnRpYWw8Z29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXJPcHRpb25zPjtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXIgb2JqZWN0LlxuICAgKlxuICAgKiBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS92aXN1YWxpemF0aW9uXG4gICAqL1xuICBoZWF0bWFwPzogZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXI7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfZ29vZ2xlTWFwOiBHb29nbGVNYXAsIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9nb29nbGVNYXAuX2lzQnJvd3Nlcikge1xuICAgICAgaWYgKCF3aW5kb3cuZ29vZ2xlPy5tYXBzPy52aXN1YWxpemF0aW9uICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdOYW1lc3BhY2UgYGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb25gIG5vdCBmb3VuZCwgY2Fubm90IGNvbnN0cnVjdCBoZWF0bWFwLiAnICtcbiAgICAgICAgICAgICdQbGVhc2UgaW5zdGFsbCB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkgd2l0aCB0aGUgXCJ2aXN1YWxpemF0aW9uXCIgbGlicmFyeTogJyArXG4gICAgICAgICAgICAnaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvdmlzdWFsaXphdGlvbicsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMuaGVhdG1hcCA9IG5ldyBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllcih0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMuaGVhdG1hcC5zZXRNYXAodGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCEpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCB7X2RhdGEsIGhlYXRtYXB9ID0gdGhpcztcblxuICAgIGlmIChoZWF0bWFwKSB7XG4gICAgICBpZiAoY2hhbmdlc1snb3B0aW9ucyddKSB7XG4gICAgICAgIGhlYXRtYXAuc2V0T3B0aW9ucyh0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2RhdGEnXSAmJiBfZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGhlYXRtYXAuc2V0RGF0YSh0aGlzLl9ub3JtYWxpemVEYXRhKF9kYXRhKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuaGVhdG1hcCkge1xuICAgICAgdGhpcy5oZWF0bWFwLnNldE1hcChudWxsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZGF0YSB0aGF0IGlzIGN1cnJlbnRseSBzaG93biBvbiB0aGUgaGVhdG1hcC5cbiAgICogU2VlOiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3Zpc3VhbGl6YXRpb24jSGVhdG1hcExheWVyXG4gICAqL1xuICBnZXREYXRhKCk6IEhlYXRtYXBEYXRhIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmhlYXRtYXAuZ2V0RGF0YSgpO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBjb21iaW5lZCBvcHRpb25zIG9iamVjdCB1c2luZyB0aGUgcGFzc2VkLWluIG9wdGlvbnMgYW5kIHRoZSBpbmRpdmlkdWFsIGlucHV0cy4gKi9cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXJPcHRpb25zIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCB7fTtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGRhdGE6IHRoaXMuX25vcm1hbGl6ZURhdGEodGhpcy5fZGF0YSB8fCBvcHRpb25zLmRhdGEgfHwgW10pLFxuICAgICAgbWFwOiB0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTW9zdCBHb29nbGUgTWFwcyBBUElzIHN1cHBvcnQgYm90aCBgTGF0TG5nYCBvYmplY3RzIGFuZCBgTGF0TG5nTGl0ZXJhbGAuIFRoZSBsYXR0ZXIgaXMgbW9yZVxuICAgKiBjb252ZW5pZW50IHRvIHdyaXRlIG91dCwgYmVjYXVzZSB0aGUgR29vZ2xlIE1hcHMgQVBJIGRvZXNuJ3QgaGF2ZSB0byBoYXZlIGJlZW4gbG9hZGVkIGluIG9yZGVyXG4gICAqIHRvIGNvbnN0cnVjdCB0aGVtLiBUaGUgYEhlYXRtYXBMYXllcmAgYXBwZWFycyB0byBiZSBhbiBleGNlcHRpb24gdGhhdCBvbmx5IGFsbG93cyBhIGBMYXRMbmdgXG4gICAqIG9iamVjdCwgb3IgaXQgdGhyb3dzIGEgcnVudGltZSBlcnJvci4gU2luY2UgaXQncyBtb3JlIGNvbnZlbmllbnQgYW5kIHdlIGV4cGVjdCB0aGF0IEFuZ3VsYXJcbiAgICogdXNlcnMgd2lsbCBsb2FkIHRoZSBBUEkgYXN5bmNocm9ub3VzbHksIHdlIGFsbG93IHRoZW0gdG8gcGFzcyBpbiBhIGBMYXRMbmdMaXRlcmFsYCBhbmQgd2VcbiAgICogY29udmVydCBpdCB0byBhIGBMYXRMbmdgIG9iamVjdCBiZWZvcmUgcGFzc2luZyBpdCBvZmYgdG8gR29vZ2xlIE1hcHMuXG4gICAqL1xuICBwcml2YXRlIF9ub3JtYWxpemVEYXRhKGRhdGE6IEhlYXRtYXBEYXRhKSB7XG4gICAgY29uc3QgcmVzdWx0OiAoZ29vZ2xlLm1hcHMuTGF0TG5nIHwgZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5XZWlnaHRlZExvY2F0aW9uKVtdID0gW107XG5cbiAgICBkYXRhLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICByZXN1bHQucHVzaChpc0xhdExuZ0xpdGVyYWwoaXRlbSkgPyBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGl0ZW0ubGF0LCBpdGVtLmxuZykgOiBpdGVtKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQXNzZXJ0cyB0aGF0IHRoZSBoZWF0bWFwIG9iamVjdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gKi9cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtoZWF0bWFwOiBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllcn0ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmhlYXRtYXApIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBIZWF0bWFwTGF5ZXIgYmVmb3JlIGl0IGhhcyBiZWVuICcgK1xuICAgICAgICAgICAgJ2luaXRpYWxpemVkLiBQbGVhc2Ugd2FpdCBmb3IgdGhlIGhlYXRtYXAgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqIEFzc2VydHMgdGhhdCBhbiBvYmplY3QgaXMgYSBgTGF0TG5nTGl0ZXJhbGAuICovXG5mdW5jdGlvbiBpc0xhdExuZ0xpdGVyYWwodmFsdWU6IGFueSk6IHZhbHVlIGlzIGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLmxhdCA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHZhbHVlLmxuZyA9PT0gJ251bWJlcic7XG59XG4iXX0=