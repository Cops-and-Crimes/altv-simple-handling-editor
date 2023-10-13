import * as alt from 'alt-client';
import * as native from 'natives';
import { Enums } from './enums.js';

alt.on('keyup', (key) => {
    if (alt.isConsoleOpen()) return;

    switch (key) {
        case Enums.keyboard.F4:
            openHandlingEditor();
            break;
        case Enums.keyboard.ESCAPE:
            closeHandlingEditor();
            break;
        case Enums.keyboard.ALT:
            changeFocus();
            break;
    }
});

let handlingEditorBrowser;
let handlingEditorBrowserReady = false;

let handlingNames = [
    'acceleration',
    'antiRollBarBiasFront',
    'antiRollBarBiasRear',
    'antiRollBarForce',
    'brakeBiasFront',
    'brakeBiasRear',
    'brakeForce',
    'camberStiffness',
    'centreOfMassOffset',
    'clutchChangeRateScaleDownShift',
    'clutchChangeRateScaleUpShift',
    'collisionDamageMult',
    'damageFlags',
    'deformationDamageMult',
    'downforceModifier',
    'driveBiasFront',
    'driveInertia',
    'driveMaxFlatVel',
    'engineDamageMult',
    'handBrakeForce',
    'handlingFlags',
    'inertiaMultiplier',
    'initialDragCoeff',
    'initialDriveForce',
    'initialDriveGears',
    'initialDriveMaxFlatVel',
    'lowSpeedTractionLossMult',
    'mass',
    'modelFlags',
    'monetaryValue',
    'oilVolume',
    'percentSubmerged',
    'percentSubmergedRatio',
    'petrolTankVolume',
    'rollCentreHeightFront',
    'rollCentreHeightRear',
    'seatOffsetDistX',
    'seatOffsetDistY',
    'seatOffsetDistZ',
    'steeringLock',
    'steeringLockRatio',
    'suspensionBiasFront',
    'suspensionBiasRear',
    'suspensionCompDamp',
    'suspensionForce',
    'suspensionLowerLimit',
    'suspensionRaise',
    'suspensionReboundDamp',
    'suspensionUpperLimit',
    'tractionBiasFront',
    'tractionBiasRear',
    'tractionCurveLateral',
    'tractionCurveLateralRatio',
    'tractionCurveMax',
    'tractionCurveMaxRatio',
    'tractionCurveMin',
    'tractionCurveMinRatio',
    'tractionLossMult',
    'tractionSpringDeltaMax',
    'tractionSpringDeltaMaxRatio',
    'unkFloat1',
    'unkFloat2',
    'unkFloat4',
    'unkFloat5',
    'weaponDamageMult',
];

function handlingEditorReady() {
    handlingEditorBrowserReady = true;

    if (!alt.Player.local.vehicle) {
        closeHandlingEditor();
        return;
    }

    let vehicle = alt.Player.local.vehicle;

    handlingEditorBrowser.emit('CEF:HandlingEditor:Init', getVehicleData(vehicle));
}

function getVehicleData(vehicle) {
    let data = [];

    handlingNames.forEach((key) => {
        let value = vehicle.handling[key];
        if (value == null) {
            return;
        }

        switch (key) {
            case 'centreOfMassOffset':
            case 'inertiaMultiplier':
                data.push({ key: key + 'x', value: value.x.toFixed(2) });
                data.push({ key: key + 'y', value: value.y.toFixed(2) });
                data.push({ key: key + 'z', value: value.z.toFixed(2) });
                return;
            default:
                value = value.toFixed(2);
                break;
        }

        data.push({ key: key, value: value });
    });

    return data;
}

function openHandlingEditor() {
    if (handlingEditorBrowser) return;

    handlingEditorBrowser = new alt.WebView('http://resource/client/cef/handlingEditor.html');

    handlingEditorBrowser.on('Client:HandlingEditor:Ready', handlingEditorReady);
    handlingEditorBrowser.on('Client:HandlingEditor:Sync', (key, value) => {
        sync(alt.Player.local.vehicle, key, value);
    });
}

function sync(vehicle, key, value) {
    if (!vehicle) {
        closeHandlingEditor();
        return;
    }

    if (key.startsWith('centreOfMassOffset')) {
        switch (key.slice(-1)) {
            case 'x':
                vehicle.handling['centreOfMassOffset'] = new alt.Vector3(
                    parseFloat(value),
                    vehicle.handling['centreOfMassOffset'].y,
                    vehicle.handling['centreOfMassOffset'].z
                );
                return;
            case 'y':
                vehicle.handling['centreOfMassOffset'] = new alt.Vector3(
                    vehicle.handling['centreOfMassOffset'].x,
                    parseFloat(value),
                    vehicle.handling['centreOfMassOffset'].z
                );
                return;
            case 'z':
                vehicle.handling['centreOfMassOffset'] = new alt.Vector3(
                    vehicle.handling['centreOfMassOffset'].x,
                    vehicle.handling['centreOfMassOffset'].y,
                    parseFloat(value)
                );
                return;
        }
    }
    if (key.startsWith('inertiaMultiplier')) {
        switch (key.slice(-1)) {
            case 'x':
                vehicle.handling['inertiaMultiplier'] = new alt.Vector3(
                    parseFloat(value),
                    vehicle.handling['inertiaMultiplier'].y,
                    vehicle.handling['inertiaMultiplier'].z
                );
                return;
            case 'y':
                vehicle.handling['inertiaMultiplier'] = new alt.Vector3(
                    vehicle.handling['inertiaMultiplier'].x,
                    parseFloat(value),
                    vehicle.handling['inertiaMultiplier'].z
                );
                return;
            case 'z':
                vehicle.handling['inertiaMultiplier'] = new alt.Vector3(
                    vehicle.handling['inertiaMultiplier'].x,
                    vehicle.handling['inertiaMultiplier'].y,
                    parseFloat(value)
                );
                return;
        }
    }
    vehicle.handling[key] = value;
}

function closeHandlingEditor() {
    if (!handlingEditorBrowser) return;

    handlingEditorBrowser.destroy();
    handlingEditorBrowser = null;

    if (alt.isCursorVisible()) {
        alt.showCursor(false);
        alt.toggleGameControls(true);
    }
}

function changeFocus() {
    if (!handlingEditorBrowser) return;

    if (alt.isCursorVisible()) {
        alt.showCursor(false);
        alt.toggleGameControls(true);
        handlingEditorBrowser.unfocus();
    } else {
        alt.showCursor(true);
        alt.toggleGameControls(false);
        handlingEditorBrowser.focus();
    }
}

alt.on('leftVehicle', (vehicle, seat) => {
    closeHandlingEditor();
});
