import * as script from './nScript.js';


const wholeWrapper = document.getElementById('wrapper-whole');
const wrapperLeft = document.getElementById('wrapper-left');
const wrapperGame = document.getElementById('wrapper-game');
const wrapperTop = document.getElementById('wrapper-top');
const brdrRight = document.getElementById('brdr-right');
const brdrBottom = document.getElementById('brdr-bottom');

const mHeight = document.getElementById('manipulator-height');

let draggingHeight = false;
let draggingWidth = false;

let dragEl = document.createElement('div');

let prevX = 0;
let prevY = 0;

let posX = 0;
let posY = 0;

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

    // let widthManipulator = document.getElementById('manipulator-width');
    // widthManipulator.addEventListener('mouseenter', manipulatorWidthHovered);
    // widthManipulator.addEventListener('mouseleave', manipulatorWidthExit);

    mHeight.addEventListener('mouseenter', manipulatorHeightHovered);
    mHeight.addEventListener('mouseleave', manipulatorHeightExit);
    mHeight.addEventListener('dragstart', manipulatorHeightDragStart);
    mHeight.addEventListener('drag', manipulatorHeightDrag);
    mHeight.addEventListener('dragend', manipulatorHeightDragEnd);

    // let diagManipulator = document.getElementById('manipulator-diag');
    // diagManipulator.addEventListener('mouseenter', manipulatorDiagonalHovered);
    // diagManipulator.addEventListener('mouseleave', manipulatorDiagonalExit);
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

function manipulatorHeightDragStart(e) {
    mHeight.classList.add('test')
    draggingHeight = true;
    mHeight.classList.add('dragging')

    // setTimeout(() => (mHeight.classList.remove('invisible')), 1000)

    manipulatorHeightHovered();
    console.log('start');

    dragEl = document.getElementById('manipulator-height');

    prevX = posX = e.clientX;
    prevY = posY = e.clientY;

    startMouseTracking();

    const startingHeight = wholeWrapper.getBoundingClientRect().height;
    console.log('height: ', startingHeight);
    

    // let bounds = wholeWrapper.getBoundingClientRect();
    // wholeWrapper.style.height = `${bounds.height + 10}px`

    // bounds = wrapperGame.getBoundingClientRect();
    // console.log(bounds.height);
    
    // wrapperGame.style.height = `${bounds.height + 10}px`

    // window.addEventListener('mousemove', trackMouseMovement)
    // window.addEventListener('mouseup', mouseup)

    //wholeWrapper.style.height = '100px'
}

function manipulatorHeightDrag(e) {
    //console.log('drag');
    console.log('posY: ', posY);
    
    let incrementY = posY - prevY;
    console.log('inc: ', incrementY)

    wholeWrapper.style.height = wholeWrapper.getBoundingClientRect().height + incrementY + "px";

    prevY = posY;
}

function manipulatorHeightDragEnd() {
    draggingHeight = false;
    mHeight.classList.remove('dragging')

    manipulatorHeightExit();
    console.log('end');

    endMouseTracking();
}

function startMouseTracking() {
    document.ondragover = function (event) {
        event = event || window.event;
        posX = event.pageX;
        posY = event.pageY;
    };
}

function endMouseTracking() {
    document.ondragover = null;
}