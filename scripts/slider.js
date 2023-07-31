document.querySelectorAll('.slider').forEach(slider => {

    const items = slider.querySelectorAll('.slider__line-item')
    const sliderLine = slider.querySelector('.slider__line')
    const sliderWrap = slider.querySelector('.slider__line-wrap')
    const btnPrev = slider.querySelector('.slider__btn-prev')
    const btnNext = slider.querySelector('.slider__btn-next')

    const setting = slider.getAttribute('items-count') ?
        JSON.parse(slider.getAttribute('items-count')) : {0: 1} ;
    const drag = slider.getAttribute('drag') ? 
        slider.getAttribute('drag') : true ;
    const gap = slider.getAttribute('gap') ?
        JSON.parse(slider.getAttribute('gap')) : {0: 1} ;
        sliderLine.style.gap = `${gap}px`
    const padding = slider.getAttribute('padding') ?
        JSON.parse(slider.getAttribute('padding')) : '0' ;
        if (window.innerWidth < 1296) sliderLine.style.padding = `0 ${padding}px`

    let countMax = sliderCount()
    let width = 0
    let widthItem = 0
    let matrix = new WebKitCSSMatrix(window.getComputedStyle(sliderLine).transform).m41;

    function normalaceSlider() {
        if (window.innerWidth > 1296) return rollSlider()

        console.log(`matrix: ${matrix}`);
        if( matrix > 0 ) matrix = 0

        let maxWidth = -( sliderLine.offsetWidth - width + padding*2)
        if( matrix < maxWidth) matrix = maxWidth

        rollSlider()
    }
    
    function rollSlider() {
        sliderLine.style.transform = `translate(${matrix}px)`
    }

    function sliderCount() {
        let count

        for (const key in setting) {
            if (!count && window.innerWidth <= key) {
                count = setting[key]
            }
        }

        return count ? count : setting[0]
    }

    function init () {
        countMax = sliderCount()

        width = sliderWrap.offsetWidth
        widthItem = (width / countMax) - gap + gap/countMax

        sliderLine.style.width = `${(width * items.length) / countMax}px`
        items.forEach( item => {
            item.style.width = `${widthItem}px`
            item.style.minWidth = `${widthItem}px`
        })

        sliderLine.classList.add('slider__line--transition')

        normalaceSlider()
    }

    window.addEventListener('resize', init)
    init()

    if (btnPrev) {btnPrev.addEventListener('click', e => {
        matrix = matrix + widthItem
        normalaceSlider()
    })}

    if (btnNext) {btnNext.addEventListener('click', e => {
        matrix = matrix - widthItem
        normalaceSlider()
    })}

    sliderLine.onmousedown = (event) => sliderTouch(event)

    function sliderTouch(event) {
        if (window.innerWidth > 1296) return false
        
        event.preventDefault()
        sliderLine.classList.remove('slider__line--transition')

        matrix = new WebKitCSSMatrix(window.getComputedStyle(sliderLine).transform).m41;

        let shiftX = event.clientX - matrix

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)

        function onMouseMove(e) { 
            let value = e.clientX - shiftX
            sliderLine.style.transform = `translate(${value}px)` 
            matrix = value
        }

        function onMouseUp(e) {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)

            sliderLine.classList.add('slider__line--transition')

            normalaceSlider()
        }
    }

    sliderLine.ondragstart = () => { return false }

})