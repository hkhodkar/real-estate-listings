import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Toast, ToastService } from '../../core/services/toast.service';
import { Icon } from './icon';

@Component({
  selector: 'app-toast-container',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toasts" role="status" aria-live="polite">
      @for (toast of service.toasts(); track toast.id) {
        <div class="toast">
          <app-icon name="check" [size]="18" />
          <span class="toast__msg">{{ toast.message }}</span>
          @if (toast.action) {
            <button type="button" class="toast__action" (click)="run(toast)">{{ toast.action.label }}</button>
          }
          <button type="button" class="toast__close" aria-label="Dismiss" (click)="service.dismiss(toast.id)">
            <app-icon name="close" [size]="16" />
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toasts {
      position: fixed;
      bottom: 20px;
      left: 50%;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: max-content;
      max-width: calc(100vw - 32px);
      transform: translateX(-50%);
      pointer-events: none;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 10px 10px 16px;
      border-radius: 12px;
      background: #1c2430;
      color: #fff;
      box-shadow: 0 10px 30px rgb(15 23 42 / 0.25);
      font-size: 0.9rem;
      pointer-events: auto;
      animation: toast-in 0.2s ease-out;
    }
    .toast__action {
      padding: 6px 10px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: #7fe0cf;
      font-weight: 700;
      cursor: pointer;
    }
    .toast__action:hover { background: rgb(255 255 255 / 0.08); }
    .toast__close {
      display: inline-flex;
      padding: 6px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: rgb(255 255 255 / 0.7);
      cursor: pointer;
    }
    .toast__close:hover { color: #fff; }
    @keyframes toast-in {
      from { opacity: 0; transform: translateY(8px); }
    }
  `,
})
export class ToastContainer {
  protected readonly service = inject(ToastService);

  protected run(toast: Toast): void {
    toast.action?.run();
    this.service.dismiss(toast.id);
  }
}
