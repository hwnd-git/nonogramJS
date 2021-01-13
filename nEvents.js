import * as script from './nScript.js';
import * as utils from './nUtils.js'

//TODO: podczas manipulacji jednym manipulatorem ukryć pozostałe

//TODO: zwiększyć zakres chwytania manipulatorów

//TODO: przerobić resizowanie tak żeby nie zmieniało się o inkrement przesunięcia (bo powoduje lagi), tylko żeby
// dopasowywało się do położenia myszki.

const wholeWrapper = document.getElementById('wrapper-whole');
const wholeGrid = document.getElementById('whole-grid');
const gameGrid = document.getElementById('game-grid');
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
    mHeight.addEventListener('mouseenter', manipulatorHeightHovered);
    mHeight.addEventListener('mouseleave', manipulatorHeightExit);
    mDiag.addEventListener('mouseenter', manipulatorDiagonalHovered);
    mDiag.addEventListener('mouseleave', manipulatorDiagonalExit);

    setDraggables();

}

function setDraggables() {
    //destroy() - niszczy dragabla

    let manipulators = $('.manipulator');
    console.log(manipulators);

    manipulators.each(function () {
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

        let identify = man.id.replace('manipulator-', '');

        switch (identify) {
            case 'height':
                cursorOffset = { top: yOffset };
                dragDirection = 'y';
                break;

            case 'width':
                cursorOffset = { left: xOffset };
                dragDirection = 'x';
                break;

            case 'diag':
                yOffset *= manWidthIncreaseMultiplicator;
                xOffset *= manWidthIncreaseMultiplicator;
                cursorOffset = { top: yOffset, left: xOffset };
                break;

            default:
                break;
        }

        $(man).draggable({
            addClasses: false,
            // grid: [50, 50],
            // classes: {
            //     "ui-draggable": "xxx"
            // },
            cursorAt: cursorOffset,
            // containment: $('.limiter'),
            axis: dragDirection,
            // revert: true,
            cursor: "grabbing",
            // delay: 100,
            start: dragStart,
            stop: dragStop,
            drag: dragDuring,
        });
    })
}

function createDragLimiters(draggingType) {
    createBordersLimiter();
    createManipulatorLimiter(draggingType);
}

function createManipulatorLimiter(draggingType) {
    if (document.getElementById('drag-limiter-manipulators')) return;
    let dragLimit = document.createElement('div');
    dragLimit.id = 'drag-limiter-manipulators';
    dragLimit.classList.add('limiter');
    let separatorSpacing = parseInt(utils.getCSSVariable('--separator-spacing'));
    let gameWidth = parseInt(utils.getCSSVariable('--stage-cols-no'));
    let gameHeight = parseInt(utils.getCSSVariable('--stage-rows-no'));

    //TODO: set maximum bounds for limiter

    gameGrid.appendChild(dragLimit);
    switch (draggingType) {
        case 'height':
            // dragLimit.style.gridArea = `1 / 1 / span ${separatorSpacing} / span ${gameWidth}`;
            dragLimit.style.gridArea = `${separatorSpacing + 1} / 1 / -1 / -1`;
            // dragLimit.style.top = '50px';
            utils.lockAbsolutePosition(dragLimit);
            dragLimit.style.height = '1000px';
            //console.log($('.limiter').get(0));
            break;

        case 'width':
            dragLimit.style.gridArea = `1 / ${separatorSpacing + 1} / -1 / -1`;
            utils.lockAbsolutePosition(dragLimit);
            dragLimit.style.width = '1000px';
            break;

        case 'diag':
            dragLimit.style.gridArea = `${separatorSpacing + 1} / ${separatorSpacing + 1} / -1 / -1`;
            utils.lockAbsolutePosition(dragLimit);
            dragLimit.style.height = '1000px';
            dragLimit.style.width = '1000px';
            break;

        default:
            break;
    }

    //to ustawienie ustawi contanment, ale zakres containmentu jest przeliczany od razu po rozpoczęciu draga
    //czyli w tym przypadku mimo że ustawimy containment, to jego zakres będzie pusty
    $(".ui-draggable-dragging").draggable( "option", "containment", $('.limiter')); 
    //dopiero tutaj wymuszamy na obiekcie uiDraggable, żeby jeszcze raz przeliczył containment box
    $(".ui-draggable-dragging").data('uiDraggable')._setContainment();  
    
}

function createBordersLimiter() {
    if (document.getElementById('drag-limiter-borders')) return;
    let dragLimit = document.createElement('div');
    dragLimit.id = 'drag-limiter-borders';
    let separatorSpacing = parseInt(utils.getCSSVariable('--separator-spacing'));

    dragLimit.style.gridArea = `1 / 1 / span ${separatorSpacing} / span ${separatorSpacing}`;
    gameGrid.appendChild(dragLimit);
}

function deleteDragLimits() {
    document.getElementById('drag-limiter-borders').remove();
}

function dragStart(event, ui) {
    // $(event.target).draggable( "option", "cursorAt", { top: 50 } );

    /** @type {HTMLElement} */
    let draggedElement = event.target;
    draggedElement.style.transition = '0s';
    draggedElement.style.cursor = 'grabbing';
    hideAllManipulatorsExceptDragged();

    let draggingType = draggedElement.id.replace('manipulator-', '');
    createDragLimiters(draggingType);
    switch (draggingType) {
        case 'height':
            draggingHeight = true;
            break;

        case 'width':
            draggingWidth = true;
            break;

        case 'diag':
            draggingHeight = true;
            draggingWidth = true;
            break;

        default:
            break;
    }
}

function dragStop(event, ui) {
    console.log(event);
    console.log(ui);

    // let draggedElement = document.getElementById();
    let draggedElement = event.target;
    draggedElement.removeAttribute('style');    //resetuje wszystkie inline atrybuty

    draggingHeight = false;
    draggingWidth = false;
    showAllManipulators();
    manipulatorDiagonalExit();
    deleteDragLimits();
}

function dragDuring(event, ui) {

    /** @type {HTMLElement} */
    let draggedElement = event.target;
    let borderWidth = parseInt(utils.getCSSVariable('--wrapper-border'));
    const dragLimit = document.getElementById('drag-limiter-borders');
    const limitBounds = dragLimit.getBoundingClientRect();
    const heightLimit = limitBounds.bottom;
    const widthLimit = limitBounds.right;

    let identify = draggedElement.id.replace('manipulator-', '');

    let newHeight = event.clientY - borderWidth / 2;
    let newWidth = event.clientX - borderWidth / 2;

    newHeight = Math.max(newHeight, heightLimit);
    newWidth = Math.max(newWidth, widthLimit)

    switch (identify) {
        case 'height':
            utils.setHeightOfElementInclMainPadding(wholeGrid, newHeight);
            break;

        case 'width':
            utils.setWidthOfElementInclMainPadding(wholeGrid, newWidth);
            break;

        case 'diag':
            utils.setHeightOfElementInclMainPadding(wholeGrid, newHeight);
            utils.setWidthOfElementInclMainPadding(wholeGrid, newWidth);
            break;

        default:
            break;
    }
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
    let manipulators = Array.from(document.querySelectorAll('.manipulator:not(.ui-draggable-dragging)'));

    for (let manipulator of manipulators) {
        manipulator.classList.add('hidden');
    }
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

