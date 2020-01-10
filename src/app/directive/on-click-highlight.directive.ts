import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appOnClickHighlight]'
})
export class OnClickHighlightDirective {

    @Input() appOnClickHighlight: string;

    constructor(private el: ElementRef) { }

    @HostListener('click') onMouseClick() {

        let parent = this.el.nativeElement.parentNode;
        for (var i = 0; i < parent.children.length; i++) {
            parent.children[i].style.backgroundColor='transparent';
          }
        this.el.nativeElement.style.backgroundColor = this.appOnClickHighlight;
      
    }

}
