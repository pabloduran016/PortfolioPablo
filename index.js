const seps = document.querySelectorAll('.sep')
const WINDOW_HEIGHT = window.innerHeight
const PADDING_TOP = WINDOW_HEIGHT * 0.1
const PADDING_BOTTOM = WINDOW_HEIGHT * 0.05

const lerp = (start, end, t) => start + (end - start) * t
const softing = (x) => x**2/2 - x**4/24 + x**6/720 - x**8/40320

const updateScroll = () => {
    for (const sep of seps) {
        const style = getComputedStyle(sep)
        const sep_y = sep.getBoundingClientRect().y
        const initial_angle = parseFloat(style.getPropertyValue('--angle0').split('deg')[0])
        const final_angle = parseFloat(style.getPropertyValue('--anglef').split('deg')[0])
    if (sep_y >= PADDING_TOP && sep_y <= WINDOW_HEIGHT - PADDING_BOTTOM) {
            console.log({WINDOW_HEIGHT, sep_y, PADDING_BOTTOM, PADDING_TOP})
            const t = softing((WINDOW_HEIGHT - sep_y - PADDING_BOTTOM) / (WINDOW_HEIGHT - PADDING_TOP - PADDING_BOTTOM) * 3) / 2
            const angle = lerp(initial_angle, final_angle, t)
            // console.log(`angle0=${initial_angle}, angle=${angle}, angle_f=${final_angle}`)
            sep.style.setProperty('--angle',  angle.toString() + "deg");
        }
    }
}
updateScroll()

document.addEventListener('scroll', updateScroll)

document.querySelectorAll('nav a').forEach(a => {
    const href = a.href.split('#')
    const sec = document.getElementById(href[href.length - 1])
    const y0 = sec.getBoundingClientRect().y
    a.onclick = e => {
        window.scrollTo(y0)
    }
})
