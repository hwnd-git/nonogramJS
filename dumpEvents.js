mWidth.addEventListener('mouseenter', manipulatorWidthHovered);
mWidth.addEventListener('mouseleave', manipulatorWidthExit);
mWidth.addEventListener('dragstart', manipulatorWidthDragStart);
mWidth.addEventListener('drag', manipulatorWidthDrag);
mWidth.addEventListener('dragend', manipulatorWidthDragEnd);

mHeight.addEventListener('mouseenter', manipulatorHeightHovered);
mHeight.addEventListener('mouseleave', manipulatorHeightExit);
mHeight.addEventListener('dragstart', manipulatorHeightDragStart);
mHeight.addEventListener('drag', manipulatorHeightDrag);
mHeight.addEventListener('dragend', manipulatorHeightDragEnd);

mDiag.addEventListener('mouseenter', manipulatorDiagonalHovered);
mDiag.addEventListener('mouseleave', manipulatorDiagonalExit);
mDiag.addEventListener('dragstart', manipulatorDiagDragStart);
mDiag.addEventListener('drag', manipulatorDiagDrag);
mDiag.addEventListener('dragend', manipulatorDiagDragEnd);

drop.addEventListener('dragenter', dragEnterH);
drop.addEventListener('dragover', dragOverH);
drop.addEventListener('dragleave', dragLeaveH);
drop.addEventListener('drop', dragDropH);

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