import { Directive, OnDestroy } from '@angular/core';
import { Observable, PartialObserver, Subscription } from 'rxjs';

/**
 * This is a wrapper for your component, in which you can call *this.subscribe(...)*, in order to let the base class handle the sinking. **Make sure to call super() in the constructor of the inherit class.**
 */
@Directive()
export abstract class SubscriptionWrapper implements OnDestroy {
  private subSink = new Subscription();

  /**
   * Use this function to register your subscription to the list of subscriptions which then automatically will be sinked.
   */
  protected subscribe<T>(
    observable: Observable<T>,
    observerOrNext?: PartialObserver<T> | ((value: T) => void),
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    return this.subSink.add(
      observable.subscribe(observerOrNext as any, error, complete)
    );
  }

  /**
   * Unsubscribe a subscription of the list of subscriptions. This will not sink the subscription on **ngOnDestroy()**
   * @param innerSub The subscription which will be removed from the list.
   */
  protected unsubscribe(innerSub: Subscription) {
    this.subSink.remove(innerSub);
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
