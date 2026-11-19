import { ChangeDetectionStrategy, Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';
import { ListingImage } from '../../core/models/listing';
import { Icon } from '../../shared/ui/icon';
import { Lightbox } from './lightbox';

@Component({
  selector: 'app-gallery',
  imports: [Icon, Lightbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {
  readonly images = input.required<ListingImage[]>();
  readonly title = input('');

  protected readonly tiles = computed(() => this.images().slice(1, 5));
  protected readonly openIndex = signal<number | null>(null);
  /** Slide shown in the swipeable strip on phones. */
  protected readonly stripIndex = signal(0);

  private readonly strip = viewChild<ElementRef<HTMLElement>>('strip');
  private opener: HTMLElement | null = null;

  protected open(index: number): void {
    this.opener = document.activeElement as HTMLElement | null;
    this.openIndex.set(index);
  }

  protected setIndex(index: number): void {
    this.openIndex.set(index);
  }

  protected close(): void {
    const index = this.openIndex();
    this.openIndex.set(null);
    if (index !== null) this.scrollStripTo(index);
    this.opener?.focus({ preventScroll: true });
  }

  protected onStripScroll(event: Event): void {
    const el = event.target as HTMLElement;
    this.stripIndex.set(Math.round(el.scrollLeft / el.clientWidth));
  }

  private scrollStripTo(index: number): void {
    const el = this.strip()?.nativeElement;
    if (el && el.clientWidth) el.scrollTo({ left: index * el.clientWidth });
  }
}
