import * as utils from './nUtils.js';

export let params = {
    cellSize: 0,
    cellSizeReduced: 0,
    separatorWidth: 0,
    separatorSpacing: 0
}

export function loadSettings() {
    params.cellSize = utils.getCSSVariable('--cell-size');
    params.cellSizeReduced = utils.getCSSVariable('--cell-size-reduced');
    params.separatorWidth = utils.getCSSVariable('--separator-width');
    params.separatorSpacing = utils.getCSSVariable('--separator-spacing');
}