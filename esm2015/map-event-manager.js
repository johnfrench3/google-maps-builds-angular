/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Observable } from 'rxjs';
/** Manages event on a Google Maps object, ensuring that events are added only when necessary. */
export class MapEventManager {
    constructor(_ngZone) {
        this._ngZone = _ngZone;
        /** Pending listeners that were added before the target was set. */
        this._pending = [];
        this._listeners = [];
    }
    /** Clears all currently-registered event listeners. */
    _clearListeners() {
        for (let listener of this._listeners) {
            listener.remove();
        }
        this._listeners = [];
    }
    /** Gets an observable that adds an event listener to the map when a consumer subscribes to it. */
    getLazyEmitter(name) {
        const observable = new Observable(observer => {
            // If the target hasn't been initialized yet, cache the observer so it can be added later.
            if (!this._target) {
                this._pending.push({ observable, observer });
                return undefined;
            }
            const listener = this._target.addListener(name, (event) => {
                this._ngZone.run(() => observer.next(event));
            });
            this._listeners.push(listener);
            return () => listener.remove();
        });
        return observable;
    }
    /** Sets the current target that the manager should bind events to. */
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
        this._pending.forEach(subscriber => subscriber.observable.subscribe(subscriber.observer));
        this._pending = [];
    }
    /** Destroys the manager and clears the event listeners. */
    destroy() {
        this._clearListeners();
        this._pending = [];
        this._target = undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWV2ZW50LW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWV2ZW50LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUFDLFVBQVUsRUFBYSxNQUFNLE1BQU0sQ0FBQztBQU01QyxpR0FBaUc7QUFDakcsTUFBTSxPQUFPLGVBQWU7SUFlMUIsWUFBb0IsT0FBZTtRQUFmLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFkbkMsbUVBQW1FO1FBQzNELGFBQVEsR0FBK0QsRUFBRSxDQUFDO1FBQzFFLGVBQVUsR0FBb0MsRUFBRSxDQUFDO0lBWW5CLENBQUM7SUFUdkMsdURBQXVEO0lBQy9DLGVBQWU7UUFDckIsS0FBSyxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNuQjtRQUVELElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFJRCxrR0FBa0c7SUFDbEcsY0FBYyxDQUFJLElBQVk7UUFDNUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUksUUFBUSxDQUFDLEVBQUU7WUFDOUMsMEZBQTBGO1lBQzFGLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO2dCQUMzQyxPQUFPLFNBQVMsQ0FBQzthQUNsQjtZQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQVEsRUFBRSxFQUFFO2dCQUMzRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQixPQUFPLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxzRUFBc0U7SUFDdEUsU0FBUyxDQUFDLE1BQTZCO1FBQ3JDLElBQUksTUFBTSxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDM0IsT0FBTztTQUNSO1FBRUQsb0RBQW9EO1FBQ3BELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7U0FDcEI7UUFFRCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUV0QixvRUFBb0U7UUFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMxRixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsMkRBQTJEO0lBQzNELE9BQU87UUFDTCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7SUFDM0IsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Tmdab25lfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3Vic2NyaWJlcn0gZnJvbSAncnhqcyc7XG5cbnR5cGUgTWFwRXZlbnRNYW5hZ2VyVGFyZ2V0ID0ge1xuICBhZGRMaXN0ZW5lcjogKG5hbWU6IHN0cmluZywgY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCkgPT4gZ29vZ2xlLm1hcHMuTWFwc0V2ZW50TGlzdGVuZXI7XG59IHwgdW5kZWZpbmVkO1xuXG4vKiogTWFuYWdlcyBldmVudCBvbiBhIEdvb2dsZSBNYXBzIG9iamVjdCwgZW5zdXJpbmcgdGhhdCBldmVudHMgYXJlIGFkZGVkIG9ubHkgd2hlbiBuZWNlc3NhcnkuICovXG5leHBvcnQgY2xhc3MgTWFwRXZlbnRNYW5hZ2VyIHtcbiAgLyoqIFBlbmRpbmcgbGlzdGVuZXJzIHRoYXQgd2VyZSBhZGRlZCBiZWZvcmUgdGhlIHRhcmdldCB3YXMgc2V0LiAqL1xuICBwcml2YXRlIF9wZW5kaW5nOiB7b2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxhbnk+LCBvYnNlcnZlcjogU3Vic2NyaWJlcjxhbnk+fVtdID0gW107XG4gIHByaXZhdGUgX2xpc3RlbmVyczogZ29vZ2xlLm1hcHMuTWFwc0V2ZW50TGlzdGVuZXJbXSA9IFtdO1xuICBwcml2YXRlIF90YXJnZXQ6IE1hcEV2ZW50TWFuYWdlclRhcmdldDtcblxuICAvKiogQ2xlYXJzIGFsbCBjdXJyZW50bHktcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMuICovXG4gIHByaXZhdGUgX2NsZWFyTGlzdGVuZXJzKCkge1xuICAgIGZvciAobGV0IGxpc3RlbmVyIG9mIHRoaXMuX2xpc3RlbmVycykge1xuICAgICAgbGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgYWRkcyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgbWFwIHdoZW4gYSBjb25zdW1lciBzdWJzY3JpYmVzIHRvIGl0LiAqL1xuICBnZXRMYXp5RW1pdHRlcjxUPihuYW1lOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGU8VD4ob2JzZXJ2ZXIgPT4ge1xuICAgICAgLy8gSWYgdGhlIHRhcmdldCBoYXNuJ3QgYmVlbiBpbml0aWFsaXplZCB5ZXQsIGNhY2hlIHRoZSBvYnNlcnZlciBzbyBpdCBjYW4gYmUgYWRkZWQgbGF0ZXIuXG4gICAgICBpZiAoIXRoaXMuX3RhcmdldCkge1xuICAgICAgICB0aGlzLl9wZW5kaW5nLnB1c2goe29ic2VydmFibGUsIG9ic2VydmVyfSk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5fdGFyZ2V0LmFkZExpc3RlbmVyKG5hbWUsIChldmVudDogVCkgPT4ge1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IG9ic2VydmVyLm5leHQoZXZlbnQpKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgICAgcmV0dXJuICgpID0+IGxpc3RlbmVyLnJlbW92ZSgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9ic2VydmFibGU7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgY3VycmVudCB0YXJnZXQgdGhhdCB0aGUgbWFuYWdlciBzaG91bGQgYmluZCBldmVudHMgdG8uICovXG4gIHNldFRhcmdldCh0YXJnZXQ6IE1hcEV2ZW50TWFuYWdlclRhcmdldCkge1xuICAgIGlmICh0YXJnZXQgPT09IHRoaXMuX3RhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENsZWFyIHRoZSBsaXN0ZW5lcnMgZnJvbSB0aGUgcHJlLWV4aXN0aW5nIHRhcmdldC5cbiAgICBpZiAodGhpcy5fdGFyZ2V0KSB7XG4gICAgICB0aGlzLl9jbGVhckxpc3RlbmVycygpO1xuICAgICAgdGhpcy5fcGVuZGluZyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuX3RhcmdldCA9IHRhcmdldDtcblxuICAgIC8vIEFkZCB0aGUgbGlzdGVuZXJzIHRoYXQgd2VyZSBib3VuZCBiZWZvcmUgdGhlIG1hcCB3YXMgaW5pdGlhbGl6ZWQuXG4gICAgdGhpcy5fcGVuZGluZy5mb3JFYWNoKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlci5vYnNlcnZhYmxlLnN1YnNjcmliZShzdWJzY3JpYmVyLm9ic2VydmVyKSk7XG4gICAgdGhpcy5fcGVuZGluZyA9IFtdO1xuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBtYW5hZ2VyIGFuZCBjbGVhcnMgdGhlIGV2ZW50IGxpc3RlbmVycy4gKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9jbGVhckxpc3RlbmVycygpO1xuICAgIHRoaXMuX3BlbmRpbmcgPSBbXTtcbiAgICB0aGlzLl90YXJnZXQgPSB1bmRlZmluZWQ7XG4gIH1cbn1cbiJdfQ==