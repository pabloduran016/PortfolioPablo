const seps = document.querySelectorAll('.sep')
const sections = document.querySelectorAll('section')
const WINDOW_HEIGHT = window.innerHeight

const lerp = (start, end, t) => start + (end - start) * t
const softing = (x) => x**2/2 - x**4/24 + x**6/720 - x**8/40320  // taylor for cosine

const updateScroll = () => {
    updateSeparatorsScroll()
    updateSectionsScroll()
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
    const SEC_PADDING_TOP = WINDOW_HEIGHT * 0.35
    const SEC_PADDING_BOTTOM = WINDOW_HEIGHT * 0.2
    for (const sec of sections) {
        const cards = sec.querySelectorAll('.card')
        if (cards.length === 0) continue
        const sec_y = sec.getBoundingClientRect().y
        if (sec_y <= SEC_PADDING_TOP) {
            const t = 1
            updateCards(t, cards)
        }
        if (sec_y >= WINDOW_HEIGHT - SEC_PADDING_BOTTOM) {
            const t = 0
            updateCards(t, cards)
        }
        if (sec_y >= SEC_PADDING_TOP && sec_y <= WINDOW_HEIGHT - SEC_PADDING_BOTTOM) {
            const t = softing((WINDOW_HEIGHT - sec_y - SEC_PADDING_BOTTOM) / (WINDOW_HEIGHT - SEC_PADDING_TOP - SEC_PADDING_BOTTOM) * 3) / 2
            updateCards(t, cards)
        }
    }
}
const updateCards = (t, cards) => {
    for (const card of cards) {
        const style = getComputedStyle(card)
        const translate_new = lerp(parseFloat(style.getPropertyValue('--translate0').split('%')[0]), 0, t)
        const opacity_new = lerp(parseFloat(style.getPropertyValue('--opacity0').split('%')[0]), 1, t)
        card.style.setProperty('--translate', `${translate_new}% 0`)
        card.style.setProperty('--opacity', `${opacity_new}`)
    }
}


updateScroll()

document.addEventListener('scroll', updateScroll)


const adjustOffsets  = () => {
    const main_nav = document.querySelector('nav')
    const nav_height = parseFloat(getComputedStyle(main_nav).height.split('px')[0])
    for (const sec of sections) {
        const style = getComputedStyle(sec)
        const height = parseFloat(style.height.split('px')[0])
        const offset = Math.max(0, height - WINDOW_HEIGHT + nav_height)
        console.log(height, WINDOW_HEIGHT - nav_height, offset)
        sec.style.setProperty('--offset', `${offset}px`)
    }
}
adjustOffsets()

//
// document.querySelectorAll('nav a').forEach(a => {
//     const href = a.href.split('#')
//     const sec = document.getElementById(href[href.length - 1])
//     const y0 = sec.getBoundingClientRect().y
//     a.onclick = e => {
//         window.scrollTo(y0)
//     }
// })
