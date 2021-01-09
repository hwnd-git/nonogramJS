import * as script from './nScript.js';

const wrapperLeft = document.getElementById('wrapper-left');
const wrapperGame = document.getElementById('wrapper-game');
const wrapperTop = document.getElementById('wrapper-top');
const brdrRight = document.getElementById('brdr-right');
const brdrBottom = document.getElementById('brdr-bottom');
const wholeWrapper = document.getElementById('wrapper-whole');

let draggingHeight = false;
let draggingWidth = false;

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

    let widthManipulator = document.getElementById('manipulator-width');
    widthManipulator.addEventListener('mouseenter', manipulatorWidthHovered);
    widthManipulator.addEventListener('mouseleave', manipulatorWidthExit);

    let heightManipulator = document.getElementById('manipulator-height');
    heightManipulator.addEventListener('mouseenter', manipulatorHeightHovered);
    heightManipulator.addEventListener('mouseleave', manipulatorHeightExit);
    heightManipulator.addEventListener('dragstart', manipulatorHeightDragStart);
    heightManipulator.addEventListener('dragend', manipulatorHeightDragEnd);

    let diagManipulator = document.getElementById('manipulator-diag');
    diagManipulator.addEventListener('mouseenter', manipulatorDiagonalHovered);
    diagManipulator.addEventListener('mouseleave', manipulatorDiagonalExit);
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

function manipulatorHeightHovered() {
    brdrBottom.classList.add('edit');
}

function manipulatorHeightExit() {
    if (!draggingHeight) brdrBottom.classList.remove('edit');
}

function manipulatorWidthHovered() {
    brdrRight.classList.add('edit');
}

function manipulatorWidthExit() {
    if (!draggingWidth) brdrRight.classList.remove('edit');
}

function manipulatorDiagonalHovered() {
    manipulatorHeightHovered();
    manipulatorWidthHovered();
}

function manipulatorDiagonalExit() {
    manipulatorHeightExit();
    manipulatorWidthExit();
}

function manipulatorHeightDragStart() {
    draggingHeight = true;
    manipulatorHeightHovered();
    console.log('start');

    wholeWrapper.style.height = '100px'
}

function manipulatorHeightDragEnd() {
    draggingHeight = false;
    manipulatorHeightExit();
    console.log('end');
}