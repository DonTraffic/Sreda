// Инициализируем все слайдеры
document.querySelectorAll('.slider').forEach(slider => {

    // достаём важные блоки
    const items = slider.querySelectorAll('.slider__line-item')
    const sliderLine = slider.querySelector('.slider__line')
    const sliderWrap = slider.querySelector('.slider__line-wrap')
    const btnPrev = slider.querySelector('.slider__btn-prev')
    const btnNext = slider.querySelector('.slider__btn-next')

    // достаём настройки
    const itemsCount = slider.getAttribute('items-count') ?
        JSON.parse(slider.getAttribute('items-count')) : {0: 1} ;
    const itemsWidth = slider.getAttribute('items-width') ?
        JSON.parse(slider.getAttribute('items-width')) : false ;
    const widthWrap = slider.getAttribute('width-wrap') ? 
        slider.getAttribute('width-wrap') : 1024 ;
    const drag = slider.getAttribute('drag') ? 
        slider.getAttribute('drag') : 'true' ;
        if (drag != 'false') sliderLine.classList.add('slider__line--dragable')
    const gap = slider.getAttribute('gap') ?
        JSON.parse(slider.getAttribute('gap')) : {0: 1} ;
    const padding = slider.getAttribute('padding') ?
        JSON.parse(slider.getAttribute('padding')) : '0' ;

    let countMax = 0
    let widthMax = 0

    let width = 0
    let widthItem = 0
    let matrix = new WebKitCSSMatrix(window.getComputedStyle(sliderLine).transform).m41;

    function rollSlider() {
        if( matrix > 0 ) matrix = 0

        let maxWidth = -( 
            (items.length*items[0].offsetWidth) - width + 
            (window.innerWidth < widthWrap ? padding*2 : 0) + 
            gap * (items.length-1) 
        ) 

        if( matrix < maxWidth) matrix = maxWidth

        sliderLine.style.transform = `translate(${matrix}px)`
    }

    function countItems() {
        let count

        for (const key in itemsCount) {
            if (!count && window.innerWidth <= key) {
                count = itemsCount[key]
            }
        }

        return count ? count : itemsCount[0]
    }

    function widthItems() {
        let width

        for (const key in itemsWidth) {
            if (!width && window.innerWidth <= key) {
                width = itemsWidth[key]
            }
        }

        return width ? width : itemsWidth[0]
    }

    function init () {
        countMax = countItems()
        widthMax = widthItems()

        if (window.innerWidth < widthWrap) sliderLine.style.padding = `0 ${padding}px`
        sliderLine.style.gap = `${gap}px`

        width = sliderWrap.offsetWidth
        widthItem = widthMax ? widthMax : (width / countMax) - gap + gap/countMax ;

        sliderLine.style.width = `${(width * items.length) / countMax}px`
        items.forEach( item => {
            item.style.width = `${widthItem}px`
            item.style.minWidth = `${widthItem}px`
        })

        sliderLine.classList.add('slider__line--transition')

        rollSlider()
    }

    window.addEventListener('resize', init)
    init()

    if (btnPrev) {btnPrev.addEventListener('click', e => {
        matrix = matrix + widthItem + gap
        rollSlider()
    })}

    if (btnNext) {btnNext.addEventListener('click', e => {
        matrix = matrix - widthItem - gap
        rollSlider()
    })}

    if (drag != 'false') sliderLine.onmousedown = (event) => {
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

            rollSlider()
        }
    }

    if (drag != 'false') sliderLine.ontouchstart = (event) => {
        event.preventDefault()
        sliderLine.classList.remove('slider__line--transition')
        
        matrix = new WebKitCSSMatrix(window.getComputedStyle(sliderLine).transform).m41;

        let shiftX = event.changedTouches[0].clientX - matrix

        document.addEventListener('touchmove', onTouchMove)
        document.addEventListener('touchend', onTouchUp)

        function onTouchMove(e) { 
            let value = e.changedTouches[0].clientX - shiftX
            sliderLine.style.transform = `translate(${value}px)` 
            matrix = value
        }

        function onTouchUp(e) {
            document.removeEventListener('touchmove', onTouchMove)
            document.removeEventListener('touchend', onTouchUp)

            sliderLine.classList.add('slider__line--transition')

            rollSlider()
        }
    }

    sliderLine.ondragstart = () => { return false }

})