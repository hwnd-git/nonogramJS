import * as utils from './nUtils.js';

export let settings = {
    width: {value: 0, cssName: '--stage-cols-no'},
    height: {value: 0, cssName: '--stage-rows-no'},
    topLegendHeight: {value: 0, cssName: '--top-rows-no'},
    sideLegendWidth: {value: 0, cssName: '--side-cols-no'},
    cellSize: {value: 0, cssName: '--cell-size'},
    cellSizeReduced: {value: 0, cssName: '--cell-size-reduced'},
    borderWidth: {value: 0, cssName: '--cell-border'},
    separatorWidth: {value: 0, cssName: '--separator-width'},
    separatorSpacing: {value: 0, cssName: '--separator-spacing'},
};

function loadSetting(setting) {
    setting.value = utils.getCSSVariable(setting.cssName);
}

export function loadSettings() {
    Object.keys(settings).forEach(settingKey => loadSetting(settings[settingKey]));
}

export function updateSetting(setting, newVal) {
    setting.value = newVal;
    utils.setCSSVariable(setting.cssName, newVal);
}