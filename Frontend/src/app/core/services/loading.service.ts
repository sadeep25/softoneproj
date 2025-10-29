import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private operationsSubject = new BehaviorSubject<Set<string>>(new Set());

  public loading$ = this.loadingSubject.asObservable();
  public operations$ = this.operationsSubject.asObservable();

  setLoading(loading: boolean, operation?: string): void {
    const operations = this.operationsSubject.value;
    
    if (loading && operation) {
      operations.add(operation);
    } else if (!loading && operation) {
      operations.delete(operation);
    }
    
    this.operationsSubject.next(new Set(operations));
    this.loadingSubject.next(operations.size > 0);
  }

  isLoading(operation?: string): boolean {
    if (operation) {
      return this.operationsSubject.value.has(operation);
    }
    return this.loadingSubject.value;
  }

  clearAll(): void {
    this.operationsSubject.next(new Set());
    this.loadingSubject.next(false);
  }
}