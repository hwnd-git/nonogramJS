import * as script from './nScript.js';

export function injectEventHandlers() {
    let diagExpander = document.getElementById('expand-diagonal');
    diagExpander.addEventListener("mouseenter", expanderDiaHovered);
    diagExpander.addEventListener("mouseleave", expanderDiaLeft);
    diagExpander.addEventListener('click', expanderDiaClicked)

    let horizExpander = document.getElementById('expand-horizontal');
    horizExpander.addEventListener('click', expanderHoClicked)

    let vertExpander = document.getElementById('expand-vertical');
    vertExpander.addEventListener('click', expanderVeClicked)
}

function expanderDiaHovered() {
    let expandHorizontal = document.getElementById('expand-horizontal');
    let expandVertical = document.getElementById('expand-vertical');

    expandHorizontal.classList.add('expanded');
    expandVertical.classList.add('expanded');
}

function expanderDiaLeft() {
    let expandHorizontal = document.getElementById('expand-horizontal');
    let expandVertical = document.getElementById('expand-vertical');

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