import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const ICONS = {
  heart: 'M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.8 3.9 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.7 1.1-1.6 2.7-2.7 4.7-2.7 3.4 0 5.7 3.3 4.5 6.7-1.7 4.7-9.2 9.3-9.2 9.3z',
  bed: 'M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 14h18M3 18v2M21 18v2M6 9V6.5A1.5 1.5 0 0 1 7.5 5h9A1.5 1.5 0 0 1 18 6.5V9',
  bath: 'M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2zM6 12V6a2 2 0 0 1 3.6-1.2M7 19l-1 2M17 19l1 2',
  area: 'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5',
  pin: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11zM14.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  list: 'M3 5h6v5H3zM12 6h9M12 9h6M3 14h6v5H3zM12 15h9M12 18h6',
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14',
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM20 20l-4.8-4.8',
  close: 'M6 6l12 12M18 6 6 18',
  'chevron-left': 'M15 5l-7 7 7 7',
  'chevron-right': 'M9 5l7 7-7 7',
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
  filter: 'M3 5h18l-7 8v6l-4 2v-8L3 5z',
  check: 'M5 12.5l4.5 4.5L19 7',
  share: 'M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5',
  calendar: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zM4 10h16M8 2v4M16 2v4',
  car: 'M4 16v-4l2-5h12l2 5v4zM4 16v3M20 16v3M7.5 13h.01M16.5 13h.01',
  sofa: 'M5 10V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2M4 10a2 2 0 0 0-2 2v5h20v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-2-2zM5 17v2M19 17v2',
  home: 'M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-6h4v6',
  tag: 'M3 12V4h8l10 10-8 8-10-10zM7.5 8h.01',
  photo: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9h.01',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  building: 'M5 21V4h10v17M15 9h4v12M3 21h18M8 8h1M11 8h1M8 12h1M11 12h1M8 16h1M11 16h1',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z',
  focus: 'M12 3v3M12 18v3M3 12h3M18 12h3M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
} as const;

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon', 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" [attr.fill]="filled() ? 'currentColor' : 'none'"
      stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path [attr.d]="path()" />
    </svg>
  `,
  styles: `
    :host { display: inline-flex; flex-shrink: 0; }
    svg { display: block; }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(20);
  readonly filled = input(false);
  protected readonly path = computed(() => ICONS[this.name()]);
}
