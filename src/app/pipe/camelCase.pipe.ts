import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'camelcase'
})
export class CamelCasePipe implements PipeTransform{
    transform(value: string) {
      return value.replace('_', ' ').replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ));
    }

}