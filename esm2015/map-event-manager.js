/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-event-manager.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Observable } from 'rxjs';
/**
 * Manages event on a Google Maps object, ensuring that events are added only when necessary.
 */
export class MapEventManager {
    /**
     * @param {?} _ngZone
     */
    constructor(_ngZone) {
        this._ngZone = _ngZone;
        /**
         * Pending listeners that were added before the target was set.
         */
        this._pending = [];
        this._listeners = [];
    }
    /**
     * Clears all currently-registered event listeners.
     * @private
     * @return {?}
     */
    _clearListeners() {
        for (let listener of this._listeners) {
            listener.remove();
        }
        this._listeners = [];
    }
    /**
     * Gets an observable that adds an event listener to the map when a consumer subscribes to it.
     * @template T
     * @param {?} name
     * @return {?}
     */
    getLazyEmitter(name) {
        /** @type {?} */
        const observable = new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        observer => {
            // If the target hasn't been initialized yet, cache the observer so it can be added later.
            if (!this._target) {
                this._pending.push({ observable, observer });
                return undefined;
            }
            /** @type {?} */
            const listener = this._target.addListener(name, (/**
             * @param {?} event
             * @return {?}
             */
            (event) => {
                this._ngZone.run((/**
                 * @return {?}
                 */
                () => observer.next(event)));
            }));
            this._listeners.push(listener);
            return (/**
             * @return {?}
             */
            () => listener.remove());
        }));
        return observable;
    }
    /**
     * Sets the current target that the manager should bind events to.
     * @param {?} target
     * @return {?}
     */
    setTarget(target) {
        if (target === this._target) {
            return;
        }
        // Clear the listeners from the pre-existing target.
        if (this._target) {
            this._clearListeners();
            this._pending = [];
        }
        this._target = target;
        // Add the listeners that were bound before the map was initialized.
        this._pending.forEach((/**
         * @param {?} subscriber
         * @return {?}
         */
        subscriber => subscriber.observable.subscribe(subscriber.observer)));
        this._pending = [];
    }
    /**
     * Destroys the manager and clears the event listeners.
     * @return {?}
     */
    destroy() {
        this._clearListeners();
        this._pending = [];
        this._target = undefined;
    }
}
if (false) {
    /**
     * Pending listeners that were added before the target was set.
     * @type {?}
     * @private
     */
    MapEventManager.prototype._pending;
    /**
     * @type {?}
     * @private
     */
    MapEventManager.prototype._listeners;
    /**
     * @type {?}
     * @private
     */
    MapEventManager.prototype._target;
    /**
     * @type {?}
     * @private
     */
    MapEventManager.prototype._ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWV2ZW50LW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWV2ZW50LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBU0EsT0FBTyxFQUFDLFVBQVUsRUFBYSxNQUFNLE1BQU0sQ0FBQzs7OztBQU81QyxNQUFNLE9BQU8sZUFBZTs7OztJQWUxQixZQUFvQixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTs7OztRQWIzQixhQUFRLEdBQStELEVBQUUsQ0FBQztRQUMxRSxlQUFVLEdBQW9DLEVBQUUsQ0FBQztJQVluQixDQUFDOzs7Ozs7SUFSL0IsZUFBZTtRQUNyQixLQUFLLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ25CO1FBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDdkIsQ0FBQzs7Ozs7OztJQUtELGNBQWMsQ0FBSSxJQUFZOztjQUN0QixVQUFVLEdBQUcsSUFBSSxVQUFVOzs7O1FBQUksUUFBUSxDQUFDLEVBQUU7WUFDOUMsMEZBQTBGO1lBQzFGLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO2dCQUMzQyxPQUFPLFNBQVMsQ0FBQzthQUNsQjs7a0JBRUssUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUk7Ozs7WUFBRSxDQUFDLEtBQVEsRUFBRSxFQUFFO2dCQUMzRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7OztnQkFBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUM7WUFDL0MsQ0FBQyxFQUFDO1lBQ0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0I7OztZQUFPLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBQztRQUNqQyxDQUFDLEVBQUM7UUFFRixPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDOzs7Ozs7SUFHRCxTQUFTLENBQUMsTUFBNkI7UUFDckMsSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMzQixPQUFPO1NBQ1I7UUFFRCxvREFBb0Q7UUFDcEQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztTQUNwQjtRQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBRXRCLG9FQUFvRTtRQUNwRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU87Ozs7UUFBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7Ozs7O0lBR0QsT0FBTztRQUNMLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztJQUMzQixDQUFDO0NBQ0Y7Ozs7Ozs7SUEzREMsbUNBQWtGOzs7OztJQUNsRixxQ0FBeUQ7Ozs7O0lBQ3pELGtDQUF1Qzs7Ozs7SUFXM0Isa0NBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Tmdab25lfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3Vic2NyaWJlcn0gZnJvbSAncnhqcyc7XG5cbnR5cGUgTWFwRXZlbnRNYW5hZ2VyVGFyZ2V0ID0ge1xuICBhZGRMaXN0ZW5lcjogKG5hbWU6IHN0cmluZywgY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCkgPT4gZ29vZ2xlLm1hcHMuTWFwc0V2ZW50TGlzdGVuZXI7XG59IHwgdW5kZWZpbmVkO1xuXG4vKiogTWFuYWdlcyBldmVudCBvbiBhIEdvb2dsZSBNYXBzIG9iamVjdCwgZW5zdXJpbmcgdGhhdCBldmVudHMgYXJlIGFkZGVkIG9ubHkgd2hlbiBuZWNlc3NhcnkuICovXG5leHBvcnQgY2xhc3MgTWFwRXZlbnRNYW5hZ2VyIHtcbiAgLyoqIFBlbmRpbmcgbGlzdGVuZXJzIHRoYXQgd2VyZSBhZGRlZCBiZWZvcmUgdGhlIHRhcmdldCB3YXMgc2V0LiAqL1xuICBwcml2YXRlIF9wZW5kaW5nOiB7b2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxhbnk+LCBvYnNlcnZlcjogU3Vic2NyaWJlcjxhbnk+fVtdID0gW107XG4gIHByaXZhdGUgX2xpc3RlbmVyczogZ29vZ2xlLm1hcHMuTWFwc0V2ZW50TGlzdGVuZXJbXSA9IFtdO1xuICBwcml2YXRlIF90YXJnZXQ6IE1hcEV2ZW50TWFuYWdlclRhcmdldDtcblxuICAvKiogQ2xlYXJzIGFsbCBjdXJyZW50bHktcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMuICovXG4gIHByaXZhdGUgX2NsZWFyTGlzdGVuZXJzKCkge1xuICAgIGZvciAobGV0IGxpc3RlbmVyIG9mIHRoaXMuX2xpc3RlbmVycykge1xuICAgICAgbGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgYWRkcyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgbWFwIHdoZW4gYSBjb25zdW1lciBzdWJzY3JpYmVzIHRvIGl0LiAqL1xuICBnZXRMYXp5RW1pdHRlcjxUPihuYW1lOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGU8VD4ob2JzZXJ2ZXIgPT4ge1xuICAgICAgLy8gSWYgdGhlIHRhcmdldCBoYXNuJ3QgYmVlbiBpbml0aWFsaXplZCB5ZXQsIGNhY2hlIHRoZSBvYnNlcnZlciBzbyBpdCBjYW4gYmUgYWRkZWQgbGF0ZXIuXG4gICAgICBpZiAoIXRoaXMuX3RhcmdldCkge1xuICAgICAgICB0aGlzLl9wZW5kaW5nLnB1c2goe29ic2VydmFibGUsIG9ic2VydmVyfSk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5fdGFyZ2V0LmFkZExpc3RlbmVyKG5hbWUsIChldmVudDogVCkgPT4ge1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IG9ic2VydmVyLm5leHQoZXZlbnQpKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgICAgcmV0dXJuICgpID0+IGxpc3RlbmVyLnJlbW92ZSgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9ic2VydmFibGU7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgY3VycmVudCB0YXJnZXQgdGhhdCB0aGUgbWFuYWdlciBzaG91bGQgYmluZCBldmVudHMgdG8uICovXG4gIHNldFRhcmdldCh0YXJnZXQ6IE1hcEV2ZW50TWFuYWdlclRhcmdldCkge1xuICAgIGlmICh0YXJnZXQgPT09IHRoaXMuX3RhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENsZWFyIHRoZSBsaXN0ZW5lcnMgZnJvbSB0aGUgcHJlLWV4aXN0aW5nIHRhcmdldC5cbiAgICBpZiAodGhpcy5fdGFyZ2V0KSB7XG4gICAgICB0aGlzLl9jbGVhckxpc3RlbmVycygpO1xuICAgICAgdGhpcy5fcGVuZGluZyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuX3RhcmdldCA9IHRhcmdldDtcblxuICAgIC8vIEFkZCB0aGUgbGlzdGVuZXJzIHRoYXQgd2VyZSBib3VuZCBiZWZvcmUgdGhlIG1hcCB3YXMgaW5pdGlhbGl6ZWQuXG4gICAgdGhpcy5fcGVuZGluZy5mb3JFYWNoKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlci5vYnNlcnZhYmxlLnN1YnNjcmliZShzdWJzY3JpYmVyLm9ic2VydmVyKSk7XG4gICAgdGhpcy5fcGVuZGluZyA9IFtdO1xuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBtYW5hZ2VyIGFuZCBjbGVhcnMgdGhlIGV2ZW50IGxpc3RlbmVycy4gKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9jbGVhckxpc3RlbmVycygpO1xuICAgIHRoaXMuX3BlbmRpbmcgPSBbXTtcbiAgICB0aGlzLl90YXJnZXQgPSB1bmRlZmluZWQ7XG4gIH1cbn1cbiJdfQ==