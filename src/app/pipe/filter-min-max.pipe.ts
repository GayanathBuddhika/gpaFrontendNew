import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterMinMax"
})

// ---------------Note -------------------
// ---  DO USE FilterMinMaxPipe only for NamePhoneEmailVisits converter

export class FilterMinMaxPipe implements PipeTransform {
  transform(list: any, min?: number, max?: number): any {
    if (min) {
      min = min;
    } else {
      min = Number.MIN_VALUE;
    }
    if (max) {
      max = max;
    } else {
      max = Number.MAX_VALUE;
    }

    return list.filter(
      data => parseInt(data.visit) >= min && parseInt(data.visit) <= max
    );
  }
}
