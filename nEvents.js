import * as script from './nScript.js';
import * as utils from './nUtils.js'

//TODO: podczas manipulacji jednym manipulatorem ukryć pozostałe

//TODO: zwiększyć zakres chwytania manipulatorów

//TODO: przerobić resizowanie tak żeby nie zmieniało się o inkrement przesunięcia (bo powoduje lagi), tylko żeby
// dopasowywało się do położenia myszki.

const wholeWrapper = document.getElementById('wrapper-whole');
const wholeGrid = document.getElementById('whole-grid');
const wrapperLeft = document.getElementById('wrapper-left');
const wrapperGame = document.getElementById('wrapper-game');
const wrapperTop = document.getElementById('wrapper-top');
const brdrRightSwitchable = document.getElementById('brdr-right-switchable');
const brdrBottomSwitchable = document.getElementById('brdr-bottom-switchable');
const mHeight = document.getElementById('manipulator-height');
const mHeightPersistent = document.getElementById('manipulator-height-persistent');
const mWidth = document.getElementById('manipulator-width');
const mWidthPersistent = document.getElementById('manipulator-width-persistent');
const mDiag = document.getElementById('manipulator-diag');
const mDiagPersistent = document.getElementById('manipulator-diag-persistent');

const drop = document.getElementById('dropH');

let draggingHeight = false;
let draggingWidth = false;

let dragEl = document.createElement('div');

let prevX = 0;
let prevY = 0;

let posX = 0;
let posY = 0;

$(mHeight).draggable({
    cursor: "crosshair",
    axis: "y" });    //jQuery
mHeight.style.opacity = 1;
mHeight.style.backgroundColor = 'pink'
console.log(document.querySelector('#xxx'));

$('#xxx').droppable({
    cursor: "move",
    drop: function(e, ui) {
        console.log('dropped');
        
    } });


export function injectEventHandlers() {
    let diagExpander = document.getElementById('expand-diag');
    diagExpander.addEventListener("mouseenter", expanderDiaHovered);
    diagExpander.addEventListener("mouseleave", expanderDiaLeft);
    diagExpander.addEventListener('click', expanderDiaClicked)

    let widthExpander = document.getElementById('expand-width');
    widthExpander.addEventListener('click', expanderWidthClicked)

    let heightExpander = document.getElementById('expand-height');
    heightExpander.addEventListener('click', expanderHeightClicked)

    let widthReducer = document.getElementById('reduce-width');
    widthReducer.addEventListener('click', reducerWidthClicked);

    let heightReducer = document.getElementById('reduce-height');
    heightReducer.addEventListener('click', reducerHeightClicked);

    mWidth.addEventListener('mouseenter', manipulatorWidthHovered);
    mWidth.addEventListener('mouseleave', manipulatorWidthExit);
    mWidth.addEventListener('dragstart', manipulatorWidthDragStart);
    mWidth.addEventListener('drag', manipulatorWidthDrag);
    mWidth.addEventListener('dragend', manipulatorWidthDragEnd);

    // mHeight.addEventListener('mouseenter', manipulatorHeightHovered);
    // mHeight.addEventListener('mouseleave', manipulatorHeightExit);
    // mHeight.addEventListener('dragstart', manipulatorHeightDragStart);
    // mHeight.addEventListener('drag', manipulatorHeightDrag);
    // mHeight.addEventListener('dragend', manipulatorHeightDragEnd);

    mDiag.addEventListener('mouseenter', manipulatorDiagonalHovered);
    mDiag.addEventListener('mouseleave', manipulatorDiagonalExit);
    mDiag.addEventListener('dragstart', manipulatorDiagDragStart);
    mDiag.addEventListener('drag', manipulatorDiagDrag);
    mDiag.addEventListener('dragend', manipulatorDiagDragEnd);

    drop.addEventListener('dragenter', dragEnterH);
    drop.addEventListener('dragover', dragOverH);
    drop.addEventListener('dragleave', dragLeaveH);
    drop.addEventListener('drop', dragDropH);
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

//TODO: odnośnie draggingu czytaj tutaj:
// https://developer.mozilla.org/en-US/docs/Web/API/Document/drag_event
// https://jsfiddle.net/radonirinamaminiaina/zfnj5rv4/
// widać że to co jest draggowane można namierzyć poprzez event.target


//TODO: wygląda na to że zmienić kursor podczas drag/drop można tylko z jQuery:
// https://javascriptio.com/view/705644/changing-cursor-while-dragging
// https://api.jqueryui.com/draggable/#option-cursor
// https://jsfiddle.net/wpcbM/3/

function dragEnterH(e) {
    console.log('dragenter');
    e.preventDefault();
    // e.dataTransfer.dropEffect = "copy";
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.effectAllowed = 'move';
    
    drop.classList.add('target');
    mHeightPersistent.classList.add('ontarget', 'reduce');
}

function dragOverH(e) {
    e.preventDefault();
    console.log('dragover');

}

function dragLeaveH() {
    console.log('dragexit');
    drop.classList.remove('target')
    mHeightPersistent.classList.remove('ontarget', 'reduce');
}

function dragDropH() {
    console.log('dropped');
    
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
    brdrBottomSwitchable.classList.add('edit');
}

function manipulatorHeightExit() {
    if (!draggingHeight) brdrBottomSwitchable.classList.remove('edit');
}

function manipulatorWidthHovered() {
    brdrRightSwitchable.classList.add('edit');
}

function manipulatorWidthExit() {
    if (!draggingWidth) {
        brdrRightSwitchable.classList.remove('edit');
    }
}

function manipulatorDiagonalHovered() {
    manipulatorHeightHovered();
    manipulatorWidthHovered();
}

function manipulatorDiagonalExit() {
    manipulatorHeightExit();
    manipulatorWidthExit();
}

function showAllManipulators() {
    const manipulators = document.querySelectorAll('.manipulator');
    for (let manipulator of manipulators) {
        manipulator.classList.remove('hidden');
        manipulator.classList.add('showing');
    }
}

function hideAllManipulatorsExceptDragged() {
    let manipulators = Array.from(document.querySelectorAll('.manipulator:not(.dragging)'));

    for (let manipulator of manipulators) {
        manipulator.classList.add('hidden');
    }
}

function manipulatorHeightDragStart(e) {
    console.log('start height');

    draggingHeight = true;
    mHeight.classList.add('dragging');
    mHeightPersistent.classList.add('dragging');
    hideAllManipulatorsExceptDragged();

    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.mozCursor = 'move';
    console.log('drag start: ', e.dataTransfer);

    // mHeight.style.pointerEvents = 'none';
    // mHeightPersistent.style.pointerEvents = 'none';

    dragEl = mHeight;
    manipulatorHeightHovered();

    // prevX = posX = e.clientX;
    prevY = posY = e.clientY;

    startMouseTracking();
}

function manipulatorWidthDragStart(e) {
    console.log('start width');

    draggingWidth = true;
    mWidth.classList.add('dragging')
    mWidthPersistent.classList.add('dragging')
    hideAllManipulatorsExceptDragged();

    dragEl = mWidth;
    manipulatorWidthHovered();

    prevX = posX = e.clientX;

    startMouseTracking();
}

function manipulatorDiagDragStart(e) {
    console.log('start diag');

    draggingHeight = true;
    draggingWidth = true;
    mDiag.classList.add('dragging')
    mDiagPersistent.classList.add('dragging')
    hideAllManipulatorsExceptDragged();
    
    manipulatorWidthHovered();
    manipulatorHeightHovered();

    dragEl = mDiag;

    prevY = posY = e.clientY;
    prevX = posX = e.clientX;

    startMouseTracking();
}

function manipulatorHeightDrag(e) {
    // let incrementY = posY - prevY;

    
    // utils.changeHeightOfElement(wholeGrid, incrementY);
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.effectAllowed = 'move';
    utils.setHeightOfElementInclMainPadding(wholeGrid, posY);

    // prevY = posY;
}

function manipulatorWidthDrag(e) {
    // let incrementX = posX - prevX;

    // let posDiv = document.getElementById('pos');
    // posDiv.innerText = `x: ${posX}, y: ${posY}`;
    // posDiv.style.top = posY + "px";
    // posDiv.style.left = posX + "px";

    // utils.changeWidthOfElement(wholeGrid, incrementX);
    utils.setWidthOfElementInclMainPadding(wholeGrid, posX)

    // prevX = posX;
}

function manipulatorDiagDrag(e) {
    // let incrementX = posX - prevX;
    // let incrementY = posY - prevY;

    // utils.changeWidthOfElement(wholeGrid, incrementX);
    // utils.changeHeightOfElement(wholeGrid, incrementY);

    utils.setHeightOfElementInclMainPadding(wholeGrid, posY);
    utils.setWidthOfElementInclMainPadding(wholeGrid, posX)

    // prevX = posX;
    // prevY = posY;
    // console.log('tracking: ', posX, posY);
}

function manipulatorHeightDragEnd() {
    draggingHeight = false;
    mHeight.classList.remove('dragging')
    mHeightPersistent.classList.remove('dragging')
    // mWidth.classList.remove('hidden');
    // mWidthPersistent.classList.remove('hidden');
    showAllManipulators();

    manipulatorHeightExit();
    endMouseTracking();

    console.log('end height');
}

function manipulatorWidthDragEnd() {
    draggingWidth = false;
    mWidth.classList.remove('dragging');
    mWidthPersistent.classList.remove('dragging');
    // mHeight.classList.remove('hidden');
    // mHeightPersistent.classList.remove('hidden');
    showAllManipulators();

    manipulatorWidthExit();
    endMouseTracking();

    console.log('end width');
}

function manipulatorDiagDragEnd() {
    draggingWidth = false;
    draggingHeight = false;
    mDiag.classList.remove('dragging');
    mDiagPersistent.classList.remove('dragging');
    showAllManipulators();

    manipulatorWidthExit();
    manipulatorHeightExit();
    endMouseTracking();

    console.log('end diag');
}

function startMouseTracking() {
    document.ondragover = function (event) {
        event = event || window.event;
        posX = event.pageX;
        posY = event.pageY;
    }
}

function endMouseTracking() {
    document.ondragover = null;
}