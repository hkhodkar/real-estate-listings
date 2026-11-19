import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { ListingImage } from '../../core/models/listing';
import { Icon } from '../../shared/ui/icon';

@Component({
  selector: 'app-lightbox',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown)': 'onKey($event)' },
  templateUrl: './lightbox.html',
  styleUrl: './lightbox.scss',
})
export class Lightbox {
  readonly images = input.required<ListingImage[]>();
  readonly title = input('');
  readonly index = model(0);
  readonly closed = output<void>();

  protected readonly current = computed(() => this.images()[this.index()]);
  private readonly closeBtn = viewChild.required<ElementRef<HTMLButtonElement>>('closeBtn');
  private readonly thumbs = viewChild<ElementRef<HTMLElement>>('thumbs');
  private startX: number | null = null;
  private swiped = false;

  constructor() {
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    inject(DestroyRef).onDestroy(() => (body.style.overflow = previousOverflow));
    afterNextRender(() => {
      this.closeBtn().nativeElement.focus();
      this.scrollThumbIntoView();
    });
  }

  protected prev(): void {
    this.go(this.index() - 1);
  }

  protected next(): void {
    this.go(this.index() + 1);
  }

  protected go(i: number): void {
    const count = this.images().length;
    this.index.set((i + count) % count);
    this.scrollThumbIntoView();
  }

  protected close(): void {
    this.closed.emit();
  }

  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.close();
    else if (event.key === 'ArrowLeft') this.prev();
    else if (event.key === 'ArrowRight') this.next();
    else if (event.key === 'Tab') this.trapFocus(event);
  }

  protected onPointerDown(event: PointerEvent): void {
    this.startX = event.clientX;
  }

  protected onPointerUp(event: PointerEvent): void {
    if (this.startX === null) return;
    const dx = event.clientX - this.startX;
    this.startX = null;
    this.swiped = Math.abs(dx) > 50;
    if (this.swiped) {
      if (dx < 0) this.next();
      else this.prev();
    }
  }

  /** Clicks on the dark area around the photo close the viewer. */
  protected onStageClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.swiped) this.close();
    this.swiped = false;
  }

  private scrollThumbIntoView(): void {
    setTimeout(() => {
      this.thumbs()?.nativeElement.querySelector('.is-active')?.scrollIntoView({ block: 'nearest', inline: 'center' });
    });
  }

  private trapFocus(event: KeyboardEvent): void {
    const root = this.closeBtn().nativeElement.closest('.lightbox');
    const focusable = root ? [...root.querySelectorAll<HTMLElement>('button')] : [];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
