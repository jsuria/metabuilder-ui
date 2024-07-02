
function initPreload(bindingHandler, canvasElement){

    const preload = src => new Promise((resolve, reject) => {
        const img = new Image()
        img.onerror = reject

        const onLoad = () => {
            if(img){
                const ctx = canvasElement.getContext('2d')
                const canvas = canvasElement

                canvas.width = img.naturalWidth
                canvas.height = img.naturalHeight

                const imgWidth = img.naturalWidth
                const imgHeight = img.naturalHeight

                ctx.drawImage(img, 0, 0, imgWidth, imgHeight)

                // Draw the overlays
                // Get length of coords
                const docTextCount = localStorage.getItem('bbox-doctext-count')
                
                for(let i=0; i < docTextCount; i++){
                    const drawBoundingBox = (dimensions) => {
                        const ctx = canvasElement.getContext('2d')
                        ctx.beginPath()
                        
                        const boxWidth = dimensions.x2 - dimensions.x1
                        const boxHeight = dimensions.y2 - dimensions.y1

                        // Somehow we need to offset by 100px
                        const actualX = dimensions.x1 + 100
                        const actualY = dimensions.y1 + 110 

                        ctx.rect(actualX, actualY ,boxWidth, boxHeight)
                        ctx.fillStyle = "yellow"
                        ctx.fillRect(actualX, actualY ,boxWidth, boxHeight)
                        
                        ctx.globalAlpha = 0.4

                        ctx.lineWidth = 2
                        ctx.strokeStyle = "red"
                        
                        ctx.stroke()
                    }

                    // Get stored data
                    const deserialized = JSON.parse(localStorage.getItem(`bbox-token-${i}`))

                    drawBoundingBox(deserialized)
                }
            }                    
        }

        img.onload = onLoad
        img.src = src
    })
    
    const preloadAll = srcs => Promise.all(srcs.map(preload))
    preloadAll([bindingHandler.arg])
}

export default {

    async update(canvasElement, binding, vnode){
        vnode.context.canvas = canvasElement

        console.log("Updating...")
        console.log("Argument:", binding.arg)
        console.log("Element:", canvasElement)

        initPreload(binding, canvasElement)
    },

    async bind(canvasElement, binding, vnode) {
        vnode.context.canvas = canvasElement

        console.log("Binding...")
        console.log("Argument:", binding.arg)
        console.log("Element:", canvasElement)

        initPreload(binding, canvasElement)
    }
}