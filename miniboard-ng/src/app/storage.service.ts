import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public setItem(key: string, value: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  public getItem(key: string): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  public removeItems(keys: string[]) {
    if (typeof window !== 'undefined') {
        for(let key of keys){
            localStorage.removeItem(key);
        }
    }
  }
}