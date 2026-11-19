import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Agent, Listing } from '../../core/models/listing';
import { Icon } from '../../shared/ui/icon';

type Interest = 'viewing' | 'info' | 'offer';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly listing = input.required<Listing>();
  readonly agent = input.required<Agent>();

  protected readonly firstName = computed(() => this.agent().name.split(' ')[0]);
  protected readonly submitted = signal(false);
  protected readonly sending = signal(false);
  protected readonly sentTo = signal<{ name: string; email: string } | null>(null);

  protected readonly interests: { id: Interest; label: string }[] = [
    { id: 'viewing', label: 'Book a viewing' },
    { id: 'info', label: 'Ask for more details' },
    { id: 'offer', label: 'Make an offer' },
  ];

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(EMAIL)] }),
    interest: new FormControl<Interest>('viewing', { nonNullable: true }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
  });

  constructor() {
    effect(() => this.form.controls.message.setValue(this.defaultMessage()));
  }

  protected showError(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.host.nativeElement.querySelector<HTMLElement>('.ng-invalid:not(form)')?.focus();
      return;
    }
    this.sending.set(true);
    const { name, email } = this.form.getRawValue();
    // there is no backend in the demo, so just pretend the request took a moment
    setTimeout(() => {
      this.sending.set(false);
      this.sentTo.set({ name: name.trim().split(' ')[0], email });
    }, 700);
  }

  protected reset(): void {
    this.sentTo.set(null);
    this.submitted.set(false);
    this.form.reset({ interest: 'viewing', message: this.defaultMessage() });
  }

  private defaultMessage(): string {
    return `Hi ${this.firstName()}, I'm interested in "${this.listing().title}" (${this.listing().ref}). Please get in touch.`;
  }
}
