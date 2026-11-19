import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  action?: { label: string; run: () => void };
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  readonly toasts = signal<Toast[]>([]);

  show(message: string, action?: Toast['action'], duration = 3500): void {
    const toast: Toast = { id: this.nextId++, message, action };
    // keep at most three on screen
    this.toasts.update((list) => [...list.slice(-2), toast]);
    setTimeout(() => this.dismiss(toast.id), duration);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
