import { Pipe, PipeTransform } from '@angular/core';
import { TimeSince } from '../function/timeSince';

@Pipe({
  name: 'timeSince'
})
export class TimeSincePipe implements PipeTransform {

  transform(value: any): any {
    return TimeSince(value);
  }

}
