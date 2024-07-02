const LoadDragEventListener = (domSelector, unload = false) => {
        var dragSrcEl = null;
    
        function handleDragStart(e) {
            
            console.log('handleDragStart')
            dragSrcEl = this;  
            this.blur()
       
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.textContent);
        }

        function handleDragOver(e) {

            console.log('handleDragOver')
            if (e.preventDefault) {
                e.preventDefault();
            }

            e.dataTransfer.dropEffect = 'move';
        
            return false;
        }

        function handleDragEnter() {

            console.log('handleDragEnter')
            this.classList.add('grey');
            this.classList.add('lighten-2')          
        }

        function handleDragLeave() {

            console.log('handleDragLeave')
            this.classList.remove('grey');
            this.classList.remove('lighten-2');
        }

        function handleDrop(e) {
            
            console.log('handleDrop')
            if (e.stopPropagation) {
                e.stopPropagation(); // stops the browser from redirecting.
            }
            
            if (dragSrcEl != this 
                && this.classList.contains('draggable-drop')
                && !this.classList.contains('ocr-draggable-chip')) {


                const delimiter = this.value === '' ? '' : '\r\n'
                const getTitleContent = dragSrcEl.attributes.title.value
            
                // Need a CustomEvent so we can attach data
                // Check if drop zone is not a chip
                let dropEvent = new CustomEvent('dropchip', {
                    detail:{
                        dropzone_valid: this.classList.contains('draggable-drop'),
                        dropzone_id: this.attributes.id.value,
                        draggedchip_id: dragSrcEl.attributes.id.value
                    }
                })

                dragSrcEl.dispatchEvent(dropEvent)

                this.value = this.value + delimiter + getTitleContent

                // Broadcast input event for textarea
                //const textArea = this.parentElement.firstChild
                console.log("Nearest textarea", this)

                let inputEvent = new CustomEvent('droptext', {
                    detail:{
                        dropped_text: this.value,
                        field_name: this.attributes.id.value
                    }
                })
                this.dispatchEvent(inputEvent)
             
                this.classList.remove('grey')
                this.classList.remove('lighten-2')
            }

            
            return false;
        }
        
        //let items = document.querySelectorAll('.ocr-draggable-chip-group .ocr-draggable-chip, textarea.draggable-drop'); 
        let items = document.querySelectorAll(domSelector);     
        
        // Debug:
        console.log('Initializing listeners...', items)

        // remove listeners if toggled on
        if(unload){
            items.forEach(function(item) {
                try {
                    item.removeEventListener('dragstart', handleDragStart, false)
                    item.removeEventListener('drop', handleDrop, true)
                    item.removeEventListener('dragenter', handleDragEnter, false)
                    item.removeEventListener('dragover', handleDragOver, false)
                    item.removeEventListener('dragleave', handleDragLeave, false)
                } catch (err) {
                    console.log('Events not initiated yet. ', err)
                }
                
            });
        }

        items.forEach(function(item) {
            try {
                item.addEventListener('dragstart', handleDragStart, false)
                item.addEventListener('drop', handleDrop, true)
                item.addEventListener('dragenter', handleDragEnter, false)
                item.addEventListener('dragover', handleDragOver, false)
                item.addEventListener('dragleave', handleDragLeave, false)
            } catch (err) {
                console.log('Events not initiated yet. ', err)
            }
        });
}

export default LoadDragEventListener;