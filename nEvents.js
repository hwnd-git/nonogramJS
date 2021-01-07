import * as script from './nScript.js';

export function injectEventHandlers() {
    let diagExpander = document.getElementById('expand-diagonal');
    diagExpander.addEventListener("mouseenter", expanderDiaHovered);
    diagExpander.addEventListener("mouseleave", expanderDiaLeft);

    let horizExpander = document.getElementById('expand-horizontal');
    horizExpander.addEventListener('click', expanderHoClicked)
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
    console.log('click!')
}