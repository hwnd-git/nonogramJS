import * as utils from './nUtils.js';

export let params = {
    width: 0,
    height: 0,
    topLegendHeight: 0,
    sideLegendWidth: 0,
    cellSize: 0,
    cellSizeReduced: 0,
    borderWidth: 0,
    separatorWidth: 0,
    separatorSpacing: 0
}

export function loadSettings() {
    params.width = utils.getCSSVariable('--stage-h-size');
    params.height = utils.getCSSVariable('--stage-v-size');
    params.topLegendHeight = utils.getCSSVariable('--legend-h-size');
    params.sideLegendWidth = utils.getCSSVariable('--legend-v-size');
    params.cellSize = utils.getCSSVariable('--cell-size');
    params.cellSizeReduced = utils.getCSSVariable('--cell-size-reduced');
    params.borderWidth = utils.getCSSVariable('--cell-border')
    params.separatorWidth = utils.getCSSVariable('--separator-width');
    params.separatorSpacing = utils.getCSSVariable('--separator-spacing');
}