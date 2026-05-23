import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _darkMode = signal(
    typeof localStorage !== 'undefined' &&
      (localStorage.getItem('broker_theme') === 'dark' ||
        (!localStorage.getItem('broker_theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches))
  );

  readonly darkMode = this._darkMode.asReadonly();

  constructor() {
    effect(() => {
      const dark = this._darkMode();
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem('broker_theme', dark ? 'dark' : 'light');
    });
  }

  toggle(): void {
    this._darkMode.update((d) => !d);
  }

  setDark(dark: boolean): void {
    this._darkMode.set(dark);
  }
}
