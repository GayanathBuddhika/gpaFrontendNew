// --- show the preview of uploaded image
export function imagePreview(event: FileList){
    const files = event.item(0);
    if (event.length === 0)
        {return;}    

    var mimeType = files.type;

    if (mimeType.match(/image\/*/) == null) {
        this.toastr.errorToastr("Only images are supported.", "Cannot upload image",{position: "bottom-right",animate: "slideFromBottom"});           
        return;
    }

    var reader = new FileReader();   
    reader.readAsDataURL(files); 
    reader.onload = (_event) => { 
        this.imgURL = reader.result; 
    }

    // first image
    return  event.item(0);
}
