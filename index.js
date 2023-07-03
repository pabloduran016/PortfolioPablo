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
    card.style.setProperty('--translate', `${translate_new}% 0`)
    card.style.setProperty('--opacity', `${opacity_new}`)
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
        console.log(height, WINDOW_HEIGHT - nav_height, offset)
        sec.style.setProperty('--offset', `${offset}px`)
        if (i - 1 < 0 || i - 1 >= separators.length) continue
        const sep = separators[i-1]
        const sep_style = getComputedStyle(sep)
        const sep_height = parseFloat(sep_style.height.split('px')[0])
        console.log(sep, offset)
        sep?.style.setProperty('--offset', `${offset + sep_height}px`)
    }
}
let boards
const addBoardIndicators = () => {
    const boardIndicator = document.querySelector('.board-indicator')
    if (boardIndicator === null) return
    boards = boardIndicator.parentElement.querySelector('.boards').children
    boards.forEach((e, i) => {
        boardIndicator.innerHTML += `
            <div class="indicator-${i}"></div>
        `
    })
}


window.onload = () => {
    updateScroll()
    adjustOffsets()
    addBoardIndicators()
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
