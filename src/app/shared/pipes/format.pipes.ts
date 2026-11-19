import { Pipe, PipeTransform } from '@angular/core';
import { bathsLabel, bedsLabel, formatArea, formatDate, formatPrice } from '../../core/utils/format';

@Pipe({ name: 'price' })
export class PricePipe implements PipeTransform {
  transform(value: number): string {
    return formatPrice(value);
  }
}

@Pipe({ name: 'area' })
export class AreaPipe implements PipeTransform {
  transform(value: number): string {
    return formatArea(value);
  }
}

@Pipe({ name: 'beds' })
export class BedsPipe implements PipeTransform {
  transform(value: number): string {
    return bedsLabel(value);
  }
}

@Pipe({ name: 'baths' })
export class BathsPipe implements PipeTransform {
  transform(value: number): string {
    return bathsLabel(value);
  }
}

@Pipe({ name: 'shortDate' })
export class ShortDatePipe implements PipeTransform {
  transform(value: string): string {
    return formatDate(value);
  }
}
