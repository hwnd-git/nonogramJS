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

// $(mHeight).draggable({
//     cursor: "crosshair",
//     axis: "y" });    //jQuery
// mHeight.style.opacity = 1;
// mHeight.style.backgroundColor = 'pink'
// console.log(document.querySelector('#xxx'));

// $('#xxx').droppable({
//     cursor: "move",
//     drop: function(e, ui) {
//         console.log('dropped');
        
//     } });


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

    setDraggables();
   
}

function setDraggables() {
    //destroy() - niszczy dragabla

    
    let manipulators = $('.manipulator');
    console.log(manipulators);
    
    manipulators.each(function() {
        let man = this;
        let manWidthIncreaseMultiplicator = parseInt(utils.getCSSVariable('--man-width-multiplicator', man));
        console.log(manWidthIncreaseMultiplicator);
        let bounds = man.getBoundingClientRect();
        let yMid = (bounds.bottom - bounds.top) / 2;
        let xMid = (bounds.right - bounds.left) / 2;
        let borderWidth = parseInt(utils.getCSSVariable('--wrapper-border'));
        // let yOffset = (bounds.height - borderWidth) / 2;
        let yOffset = bounds.height / 2;
        // let xOffset = (bounds.width + borderWidth) / 2;
        let xOffset = bounds.width / 2;

        let cursorOffset = {};
        let dragDirection = '';

        if (bounds.width > bounds.height) { //height manipulator
            console.log('height');
            cursorOffset = { top: yOffset };
            dragDirection = 'y';
        } else if (bounds.width < bounds.height) { //width manipulator
            console.log('width');
            cursorOffset = { left: xOffset };
            dragDirection = 'x';
        } else {    //diag manipulator
            console.log('diag');
            yOffset *= manWidthIncreaseMultiplicator;
            xOffset *= manWidthIncreaseMultiplicator;
            cursorOffset = { top: yOffset, left: xOffset };
        }

        console.log(cursorOffset);
        

        $(man).draggable({
            addClasses: false,
            // grid: [50, 50],
            // classes: {
            //     "ui-draggable": "xxx"
            // },
            cursorAt: cursorOffset,
            // containment: wrapperGame,
            axis: dragDirection,
            // revert: true,
            // cursor: "grabbing",
            // delay: 100,
            start: dragStart,
            stop: dragStop,
            drag: dragDuring,
        });
    })

    // manipulators.draggable({
    //     addClasses: false,
    //     // grid: [50, 50],
    //     classes: {
    //         "ui-draggable": "xxx"
    //     },
    //     // cursorAt: { top: 50 },
    //     // containment: wrapperGame,
    //     axis: "y",
    //     // revert: true,
    //     cursor: "grabbing",
    //     // delay: 100,
    //     start: dragStart,
    //     stop: dragStop,
    //     drag: dragDuring,
    // });
}

function dragStart(event, ui) {
    // $(event.target).draggable( "option", "cursorAt", { top: 50 } );
}

function dragStop(event, ui) {
    console.log(event);
    console.log(ui);

    // let draggedElement = document.getElementById();
    let draggedElement = event.target;
    draggedElement.removeAttribute('style');
}

function dragDuring(event, ui) {
    
    /** @type {HTMLElement} */
    let draggedElement = event.target;
    let bounds = draggedElement.getBoundingClientRect();
    let midPos = bounds.top + (bounds.bottom - bounds.top) / 2;
    let borderWidth = parseInt(utils.getCSSVariable('--wrapper-border'));

    let yOriginal = ui.originalPosition.top;
    let yCurrent = ui.position.top;
    let yChange = yOriginal - yCurrent;

    console.log(yChange);
    console.log(ui);
    
    
    // utils.setHeightOfElementInclMainPadding(wholeGrid, midPos - borderWidth/2); //ramka nie nadąża za manipulatorem
    utils.setHeightOfElementInclMainPadding(wholeGrid, event.clientY - borderWidth / 2);  //manipulator zoffsetowany od ramki, jeśli nierówno chwycony

    //place dragged element in the middle of the mouse
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



