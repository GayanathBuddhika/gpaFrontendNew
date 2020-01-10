import {  PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'sentenceCase'
})
export class SentenceCasePipe implements PipeTransform {

  transform(value: string){
    return value.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
  }

}
