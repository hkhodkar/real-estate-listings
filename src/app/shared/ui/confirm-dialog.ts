import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'cancel.emit()' },
  template: `
    <div class="backdrop" (mousedown)="onBackdropDown($event)" (click)="onBackdropClick($event)">
      <div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-text">
        <h2 id="confirm-title">{{ title() }}</h2>
        <p id="confirm-text">{{ message() }}</p>
        <div class="dialog__actions">
          <button #cancelBtn type="button" class="btn btn--ghost" (click)="cancel.emit()">Cancel</button>
          <button type="button" class="btn btn--danger" (click)="confirm.emit()">{{ confirmLabel() }}</button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 1500;
      display: grid;
      place-items: center;
      padding: 16px;
      background: rgb(15 23 42 / 0.45);
      animation: fade 0.15s ease-out;
    }
    .dialog {
      width: min(420px, 100%);
      padding: 24px;
      border-radius: var(--radius);
      background: var(--surface);
      box-shadow: 0 24px 60px rgb(15 23 42 / 0.3);
    }
    h2 { margin: 0 0 8px; font-size: 1.15rem; }
    p { margin: 0; color: var(--text-muted); line-height: 1.5; }
    .dialog__actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
    @keyframes fade { from { opacity: 0; } }
  `,
})
export class ConfirmDialog {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input('Confirm');
  readonly confirm = output<void>();
  readonly cancel = output<void>();

  private readonly cancelBtn = viewChild.required<ElementRef<HTMLButtonElement>>('cancelBtn');
  protected downOnBackdrop = false;

  constructor() {
    afterNextRender(() => this.cancelBtn().nativeElement.focus());
  }

  protected onBackdropDown(event: MouseEvent): void {
    this.downOnBackdrop = event.target === event.currentTarget;
  }

  protected onBackdropClick(event: MouseEvent): void {
    // only close when the press also started on the backdrop
    if (this.downOnBackdrop && event.target === event.currentTarget) this.cancel.emit();
    this.downOnBackdrop = false;
  }
}
