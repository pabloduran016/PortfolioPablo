const seps = document.querySelectorAll('.sep')
const sections = document.querySelectorAll('section')
const separators = document.querySelectorAll('.sep')
const WINDOW_HEIGHT = window.innerHeight

const lerp = (start, end, t) => start + (end - start) * t
const softing = (x) => x**2/2 - x**4/24 + x**6/720 - x**8/40320  // taylor for cosine

const updateScroll = () => {
    updateSeparatorsScroll()
    updateSectionsScroll()
    updateScrollSign()
}
const updateScrollSign = () => {
    const scrollSign = document.querySelector('.scroll-sign')
    scrollSign.style.setProperty('animation-name', 'none')
    void scrollSign.offsetWidth;
    scrollSign.style.setProperty('animation-name', 'appear')
    const link = document.querySelector('.scroll-sign a')
    for (const sec of sections) {
        const sec_y = sec.getBoundingClientRect().y
        const style = getComputedStyle(sec)
        const height = parseFloat(style.height.split('px')[0])
        if (sec_y + height > WINDOW_HEIGHT && sec_y > WINDOW_HEIGHT * 0.5) {
            const new_ref = `#start--${sec.id.split('sec--')[1]}`
            link.setAttribute('href', new_ref)
            link.style.removeProperty('display')
            return
        }
        link.style.display = 'none'
    }
}
const updateSeparatorsScroll = () => {
    // Change angle of separator
    const SEP_PADDING_TOP = WINDOW_HEIGHT * 0.1
    const SEP_PADDING_BOTTOM = WINDOW_HEIGHT * 0.05
    for (const sep of seps) {
        const style = getComputedStyle(sep)
        const sep_y = sep.getBoundingClientRect().y
        const initial_angle = parseFloat(style.getPropertyValue('--angle0').split('deg')[0])
        const final_angle = parseFloat(style.getPropertyValue('--anglef').split('deg')[0])
        if (sep_y >= SEP_PADDING_TOP && sep_y <= WINDOW_HEIGHT - SEP_PADDING_BOTTOM) {
            const t = softing((WINDOW_HEIGHT - sep_y - SEP_PADDING_BOTTOM) / (WINDOW_HEIGHT - SEP_PADDING_TOP - SEP_PADDING_BOTTOM) * 3) / 2
            const angle = lerp(initial_angle, final_angle, t)
            // console.log(`angle0=${initial_angle}, angle=${angle}, angle_f=${final_angle}`)
            sep.style.setProperty('--angle',  angle.toString() + "deg");
        }
    }
}
const updateSectionsScroll = () => {
    const SEC_PADDING_TOP = 0.35
    const SEC_PADDING_BOTTOM = 0.2
    for (const sec of sections) {
        const cards = sec.querySelectorAll('.card')
        if (cards.length === 0) continue
        for (const card of cards) {
            const padding_top = Math.max(0, WINDOW_HEIGHT - card.clientHeight) + card.clientHeight * SEC_PADDING_TOP
            const padding_bottom = card.clientHeight * SEC_PADDING_BOTTOM
            const card_y = card.getBoundingClientRect().y
            if (card_y <= padding_top) {
                const t = 1
                updateCard(t, card)
            }
            if (card_y >= WINDOW_HEIGHT - padding_bottom) {
                const t = 0
                updateCard(t, card)
            }
            if (card_y >= padding_top && card_y <= WINDOW_HEIGHT - padding_bottom) {
                const t = softing((WINDOW_HEIGHT - card_y - padding_bottom) / (WINDOW_HEIGHT - padding_top - padding_bottom) * 3) / 2
                updateCard(t, card)
            }
        }
    }
}
const updateCard = (t, card) => {
    const style = getComputedStyle(card)
    const translate_new = lerp(parseFloat(style.getPropertyValue('--translate0').split('%')[0]), 0, t)
    const opacity_new = lerp(parseFloat(style.getPropertyValue('--opacity0').split('%')[0]), 1, t)
    const text_opacity_new = lerp(parseFloat(style.getPropertyValue('--text-opacity0').split('%')[0]), 1, t**5)
    card.style.setProperty('--translate', `${translate_new}% 0`)
    card.style.setProperty('--opacity', `${opacity_new}`)
    card.style.setProperty('--text-opacity', `${text_opacity_new}`)
}



document.addEventListener('scroll', updateScroll)


const adjustOffsets  = () => {
    const main_nav = document.querySelector('nav')
    const nav_height = parseFloat(getComputedStyle(main_nav).height.split('px')[0])
    const offsets = []
    for (const [i, sec] of sections.entries()) {
        const style = getComputedStyle(sec)
        const height = parseFloat(style.height.split('px')[0])
        const offset = Math.max(0, height - WINDOW_HEIGHT + nav_height)
        // console.log(height, WINDOW_HEIGHT - nav_height, offset)
        sec.style.setProperty('--offset', `${offset}px`)
        if (i - 1 < 0 || i - 1 >= separators.length) continue
        const sep = separators[i-1]
        const sep_style = getComputedStyle(sep)
        const sep_height = parseFloat(sep_style.height.split('px')[0])
        // console.log(sep, offset)
        sep?.style.setProperty('--offset', `${offset + sep_height}px`)
    }
}

const addBoardIndicators = (slider) => {
    const boardIndicator = slider.querySelector('[data-board-arrows] > .board-indicator')
    if (boardIndicator === null) return
    const boards = slider.querySelectorAll('.boards > .board')
    for (const e of boards) {
        boardIndicator.innerHTML += `
            <div class="indicator"></div>
        `
    }
    const current_board = parseInt(slider.querySelector('.boards').dataset['currentBoard'])
    const next_board = changeBoard(slider, current_board, 0, boards)
    slider.querySelector('.boards').dataset['currentBoard'] = next_board
    updateArrowColor(current_board, boards)
}

const configureSliderArrows = (slider) => {
    const left_arrow = slider.querySelector('[data-board-arrows] .arrow-left')
    if (left_arrow === null) return
    const right_arrow = slider.querySelector('[data-board-arrows] .arrow-right')
    if (right_arrow === null) return
    const boards = slider.querySelectorAll('.boards > .board')
    if (boards === null) return
    left_arrow.onclick = () => {
        const current_board = parseInt(slider.querySelector('.boards').dataset['currentBoard'])
        const next_board = changeBoard(slider, current_board, -1, boards)
        slider.querySelector('.boards').dataset['currentBoard'] = next_board
        updateArrowColor(current_board, boards)
    }
    right_arrow.onclick = () => {
        const current_board = parseInt(slider.querySelector('.boards').dataset['currentBoard'])
        const next_board = changeBoard(slider, current_board, 1, boards)
        slider.querySelector('.boards').dataset['currentBoard'] = next_board
        updateArrowColor(current_board, boards)
    }
}
const changeBoard = (slider, board0, amount, boards) => {
    let next_board = board0 + amount
    if (next_board < 0) next_board = boards.length - 1
    if (next_board >= boards.length) next_board = 0
    console.log(boards, board0)
    boards[board0].classList.remove('current')
    boards[next_board].classList.add('current')
    slider.querySelectorAll('.board-indicator > .indicator')[board0].classList.remove('active')
    slider.querySelectorAll('.board-indicator > .indicator')[next_board].classList.add('active')
    return next_board
}
const updateArrowColor = (current_board, boards) => {
    // document.querySelector('#sec--gallery .arrow-right').classList.remove('disabled')
    // document.querySelector('#sec--gallery .arrow-left').classList.remove('disabled')
    // if (current_board === 0) {
    //     document.querySelector('#sec--gallery .arrow-left').classList.add('disabled')
    // } else if (current_board === boards.length - 1) {
    //     document.querySelector('#sec--gallery .arrow-right').classList.add('disabled')
    // }
}
const changeCurrentImage = (images, amount) => {
    const current_image = parseInt(images.dataset['currentImage'])
    // console.log(images, amount, current_image)
    let next_image = current_image + amount
    if (next_image < 0) next_image = images.children.length - 1
    if (next_image >= images.children.length.length) next_image = 0
    images.dataset['currentImage'] = next_image
    images.children[current_image].classList.remove('current')
    images.children[next_image].classList.add('current')
}

const initiateCurrentImages = () => {
    for (const images of document.querySelectorAll('.image-carousel > .images')) {
        console.log(images)
        images.children[parseInt(images.dataset['currentImage'])].classList.add('current')
    }
}

window.onload = () => {
    updateScroll()
    adjustOffsets()
    for (const slider of  document.querySelectorAll('#sec--gallery .sliders')) {
        console.log(slider)
        addBoardIndicators(slider)
        configureSliderArrows(slider)
    }
    initiateCurrentImages()
}

//
// document.querySelectorAll('nav a').forEach(a => {
//     const href = a.href.split('#')
//     const sec = document.getElementById(href[href.length - 1])
//     const y0 = sec.getBoundingClientRect().y
//     a.onclick = e => {
//         window.scrollTo(y0)
//     }
// })
