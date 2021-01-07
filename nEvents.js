export function injectEventHandlers() {
    let expander = document.getElementById('expand-diagonal');
    expander.addEventListener("mouseenter", expanderHovered);
    expander.addEventListener("mouseleave", expanderLeft);
}

function expanderHovered() {
    let expandHorizontal = document.getElementById('expand-horizontal');
    let expandVertical = document.getElementById('expand-vertical');

    expandHorizontal.classList.add('expanded');
    expandVertical.classList.add('expanded');
}

function expanderLeft() {
    let expandHorizontal = document.getElementById('expand-horizontal');
    let expandVertical = document.getElementById('expand-vertical');

    expandHorizontal.classList.remove('expanded');
    expandVertical.classList.remove('expanded');
}