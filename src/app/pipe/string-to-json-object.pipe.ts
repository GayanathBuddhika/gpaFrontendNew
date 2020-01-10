import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringToJsonObject'
})
export class StringToJsonObjectPipe implements PipeTransform {

  transform(value: any){
    return JSON.parse(JSON.stringify(JSON.parse(value))) ;;
  }

}
