import * as script from './nScript.js';

export function injectEventHandlers() {
    let diagExpander = document.getElementById('expand-diagonal');
    diagExpander.addEventListener("mouseenter", expanderDiaHovered);
    diagExpander.addEventListener("mouseleave", expanderDiaLeft);
    diagExpander.addEventListener('click', expanderDiaClicked)

    let widthExpander = document.getElementById('expand-width');
    widthExpander.addEventListener('click', expanderHoClicked)
    //widthExpander.addEventListener(dr)

    let heightExpander = document.getElementById('expand-height');
    heightExpander.addEventListener('click', expanderVeClicked)
}

function expanderDiaHovered() {
    let expandHorizontal = document.getElementById('expand-width');
    let expandVertical = document.getElementById('expand-height');

    expandHorizontal.classList.add('expanded');
    expandVertical.classList.add('expanded');
}

function expanderDiaLeft() {
    let expandHorizontal = document.getElementById('expand-width');
    let expandVertical = document.getElementById('expand-height');

    expandHorizontal.classList.remove('expanded');
    expandVertical.classList.remove('expanded');
}

function expanderHoClicked() {
    script.expandWidth();
}

function expanderVeClicked() {
    script.expandHeight();
}

function expanderDiaClicked() {
    script.expandSize();
}