import * as utils from './nUtils.js';
import * as config from './nConfig.js';
import * as events from './nEvents.js';
import * as top from './nTopLegend.js';
import * as side from './nSideLegend.js';
import * as main from './nGameGrid.js'

//TODO: row/column-templates ustawić na auto i niech się dopasowują do kontentu? Powinno być bardziej responsywnie.
// Najpierw sprawdzić to na separatorach.

const param = config.settings;

if (document.readyState == "loading") {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}

function ready() {
    config.loadSettings();
    events.injectEventHandlers();
    populateGrids();
}

function populateGrids() {
    top.populateLegend();
    side.populateLegend();
    main.populateGrid();
}

//TODO: zamiast funkcji update, wydajniej byłoby używać funkcji która
// nie generuje całego stringa od nowa, tylko bierze istniejący i tylko
// go modyfikuje

export function expandWidth() {
    const widthSetting = param.width;
    config.updateSetting(widthSetting, `${parseInt(widthSetting.value) + 1}`);

    top.update();
    main.update();

    console.log('New width: ', widthSetting.value);
}

export function expandHeight() {
    const heightSetting = param.height;
    config.updateSetting(heightSetting, `${parseInt(heightSetting.value) + 1}`);
    
    side.update();
    main.update();

    console.log('New height: ', heightSetting.value);
}

export function expandSize() {
    const widthSetting = param.width;
    config.updateSetting(widthSetting, `${parseInt(widthSetting.value) + 1}`);

    const heightSetting = param.height;
    config.updateSetting(heightSetting, `${parseInt(heightSetting.value) + 1}`);

    top.update();
    side.update();
    main.update();
}

export function reduceWidth() {
    const widthSetting = param.width;
    if (parseInt(widthSetting.value) > 0) {
        config.updateSetting(widthSetting, `${parseInt(widthSetting.value) - 1}`);
    }

    top.update();
    // main.update();
}

export function reduceHeight() {
    const heightSetting = param.height;
    if (parseInt(heightSetting.value) > 0) {
        config.updateSetting(heightSetting, `${parseInt(heightSetting.value) - 1}`);
    }

    side.update();
    // main.update();
}
































