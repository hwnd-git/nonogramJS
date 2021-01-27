import * as script from './nScript.js';
import * as utils from './nUtils.js'

//TODO: po najechaniu dragiem w obszar, gdzie już nie można bardziej zmienjszyć siatki, rozbłysnąć ten obszar na czerwono

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

function changeCursorOutOfBounds(e) {
    const dragLimit = document.getElementById('drag-limiter');
    const bounds = dragLimit.getBoundingClientRect();
    
    if (e.clientX > bounds.left && e.clientX < bounds.left + bounds.width) {
        console.log ('xxx')
        document.body.style.cursor = 'e-resize';
    } else if (e.clientY > bounds.top && e.clientY < bounds.top + bounds.height) {
        document.body.style.cursor = 'n-resize';
    } else {
        document.body.style.cursor = 'no-drop';
    }
}

function createManipulatorLimiter(draggingType) {
    if (document.getElementById('drag-limiter')) return;
    let dragLimit = document.createElement('div');
    dragLimit.id = 'drag-limiter';
    dragLimit.classList.add('limiter');
    dragLimit.addEventListener('mouseleave', function(event) {
        document.body.style.cursor = 'no-drop';
        if (draggingHeight && draggingWidth) {
            document.body.addEventListener('mousemove', changeCursorOutOfBounds);
        }
    })
    dragLimit.addEventListener('mouseenter', function() {
        document.body.style.cursor = 'grabbing';
        document.body.removeEventListener('mousemove', changeCursorOutOfBounds);
    })

    let firstManipulator = document.querySelector('.manipulator');
    let separatorSpacing = parseInt(utils.getCSSVariable('--separator-spacing'));
    let manipulatorSize = utils.getCSSVariable('--man-width', firstManipulator);
    let manipulatorSizeMultiplier = utils.getCSSVariable('--man-width-multiplicator', firstManipulator);
    let wrapperBorderWidth = utils.getCSSVariable('--wrapper-border');

    const maxSize = utils.getCSSVariable('--max-size');
    const topLegendSize = utils.getCSSVariable('--top-rows-no');
    const sideLegendSize = utils.getCSSVariable('--side-cols-no');

    let dragLimitAreaResize = utils.calcEval(`calc(${manipulatorSize} - ${wrapperBorderWidth})/2`);
    dragLimitAreaResize = parseInt(dragLimitAreaResize);

    let dragLimitAreaResizeDiag = utils.calcEval(`calc(${manipulatorSize} * ${manipulatorSizeMultiplier} - ${wrapperBorderWidth})/2`);
    dragLimitAreaResizeDiag = parseInt(dragLimitAreaResizeDiag);

    const minWidth = utils.evaluateStageSize(sideLegendSize, separatorSpacing);
    const minHeight = utils.evaluateStageSize(topLegendSize, separatorSpacing);
    const maxWidth = utils.evaluateStageSize(sideLegendSize, maxSize);
    const maxHeight = utils.evaluateStageSize(topLegendSize, maxSize);
    const limitAreaHeight = maxHeight - minHeight;
    const limitAreaWidth = maxWidth - minWidth;

    gameGrid.appendChild(dragLimit);
    const maxDragLimitHeight = `${limitAreaHeight + 2 * dragLimitAreaResize + parseInt(wrapperBorderWidth)}px`;
    const maxDragLimitWidth = `${limitAreaWidth + 2 * dragLimitAreaResize + parseInt(wrapperBorderWidth)}px`;
    const maxDragLimitHeightDiag = `${limitAreaHeight + 2 * dragLimitAreaResizeDiag + parseInt(wrapperBorderWidth)}px`;
    const maxDragLimitWidthDiag = `${limitAreaWidth + 2 * dragLimitAreaResizeDiag + parseInt(wrapperBorderWidth)}px`;

    switch (draggingType) {
        case 'height':
            dragLimit.style.gridArea = `${separatorSpacing + 1} / 1 / -1 / -1`;
            utils.lockAbsolutePosition(dragLimit);
      
            dragLimit.style.left = '0px';
            dragLimit.style.width = '100%';
            dragLimit.style.height = maxDragLimitHeight;
            dragLimit.style.transform = `translateY(-${dragLimitAreaResize}px)`;
            break;

        case 'width':
            dragLimit.style.gridArea = `1 / ${separatorSpacing + 1} / -1 / -1`;
            utils.lockAbsolutePosition(dragLimit);

            dragLimit.style.top = '0px';
            dragLimit.style.height = '100%';
            dragLimit.style.width = maxDragLimitWidth;
            dragLimit.style.transform = `translateX(-${dragLimitAreaResize}px)`;
            break;

        case 'diag':
            dragLimit.style.gridArea = `${separatorSpacing + 1} / ${separatorSpacing + 1} / -1 / -1`;
            utils.lockAbsolutePosition(dragLimit);

            dragLimit.style.height = maxDragLimitHeightDiag;
            dragLimit.style.width = maxDragLimitWidthDiag;

            dragLimit.style.transform = `translate(-${dragLimitAreaResizeDiag}px, -${dragLimitAreaResizeDiag}px)`;
            break;

        default:
            break;
    }

    //to ustawienie ustawi contanment, ale zakres containmentu jest przeliczany od razu po rozpoczęciu draga
    //czyli w tym przypadku mimo że ustawimy containment, to jego zakres będzie pusty
    $(".ui-draggable-dragging").draggable("option", "containment", $('.limiter'));
    //dopiero tutaj wymuszamy na obiekcie uiDraggable, żeby jeszcze raz przeliczył containment box
    $(".ui-draggable-dragging").data('uiDraggable')._setContainment();

}

function deleteDragLimits() {
    document.body.removeEventListener('mousemove', changeCursorOutOfBounds);
    document.getElementById('drag-limiter').remove();
}

function dragStart(event, ui) {
    /** @type {HTMLElement} */
    let draggedElement = event.target;
    draggedElement.style.transition = '0s';
    // draggedElement.style.cursor = 'grabbing';
    // document.body.style.cursor = 'grabbing';
    hideAllManipulatorsExceptDragged();

    let draggingType = draggedElement.id.replace('manipulator-', '');
    createManipulatorLimiter(draggingType);
    switch (draggingType) {
        case 'height':
            manipulatorHeightHovered();
            draggingHeight = true;
            break;

        case 'width':
            console.log('dragStart')
            manipulatorWidthHovered();
            draggingWidth = true;
            break;

        case 'diag':
            manipulatorHeightHovered();
            manipulatorWidthHovered();
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
    //TODO: scroll psuje draggowanie, jeśli koordynaty bierzemy z kursora, a nie ghosta

    // console.log('event: ', event);
    // console.log('ui: ', ui);

    /** @type {HTMLElement} */
    let draggedElement = event.target;
    const dragBounds = draggedElement.getBoundingClientRect();
    let borderWidth = parseInt(utils.getCSSVariable('--wrapper-border'));

    let identify = draggedElement.id.replace('manipulator-', '');

    let helperY = ui.position.top + dragBounds.height / 2;
    let helperX = ui.position.left + dragBounds.width / 2;

    let newHeightHelper = helperY - borderWidth / 2;
    let newWidthHelper = helperX - borderWidth / 2;

    switch (identify) {
        case 'height':
            utils.setHeightOfElement(wholeGrid, newHeightHelper, false);
            break;

        case 'width':
            utils.setWidthOfElement(wholeGrid, newWidthHelper, false);
            break;

        case 'diag':
            utils.setHeightOfElement(wholeGrid, newHeightHelper, false);
            utils.setWidthOfElement(wholeGrid, newWidthHelper, false);
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
    console.log('exitCheck')
    if (!draggingWidth) {
        console.log('exit')
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

