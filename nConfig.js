import * as utils from './nUtils.js';

export let settings = {
    width: {value: 0, cssName: '--stage-h-size'},
    height: {value: 0, cssName: '--stage-v-size'},
    topLegendHeight: {value: 0, cssName: '--legend-h-size'},
    sideLegendWidth: {value: 0, cssName: '--legend-v-size'},
    cellSize: {value: 0, cssName: '--cell-size'},
    cellSizeReduced: {value: 0, cssName: '--cell-size-reduced'},
    borderWidth: {value: 0, cssName: '--cell-border'},
    separatorWidth: {value: 0, cssName: '---separator-width'},
    separatorSpacing: {value: 0, cssName: '--separator-spacing'},
};

function loadSetting(setting) {
    setting.value = utils.getCSSVariable(setting.cssName);
}

export function loadSettings() {
    Object.keys(settings).forEach(settingKey => loadSetting(settings[settingKey]));
}

export function getSetting(setting) {
    return setting.value;
}

export function updateSetting() {

}