import * as script from './nScript.js';

export function injectEventHandlers() {
    let diagExpander = document.getElementById('expand-diag');
    diagExpander.addEventListener("mouseenter", expanderDiaHovered);
    diagExpander.addEventListener("mouseleave", expanderDiaLeft);
    diagExpander.addEventListener('click', expanderDiaClicked)

    let widthExpander = document.getElementById('expand-width');
    widthExpander.addEventListener('click', expanderWidthClicked)
    //widthExpander.addEventListener(dr)

    let heightExpander = document.getElementById('expand-height');
    heightExpander.addEventListener('click', expanderHeightClicked)

    let widthReducer = document.getElementById('reduce-width');
    widthReducer.addEventListener('click', reducerWidthClicked);
    
    let heightReducer = document.getElementById('reduce-height');
    heightReducer.addEventListener('click', reducerHeightClicked);
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

function expanderWidthClicked() {
    script.expandWidth();
}

function expanderHeightClicked() {
    script.expandHeight();
}

function expanderDiaClicked() {
    script.expandSize();
}

function reducerWidthClicked() {
    console.log('reduce w')
    script.reduceWidth();
}

function reducerHeightClicked() {
    console.log('reduce h')
    script.reduceHeight();
}