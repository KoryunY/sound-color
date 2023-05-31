const TPLSmartDevice = require('tplink-lightbulb')

const device = new TPLSmartDevice("192.168.5.9")


device.power(true, 0, {
    mode: 'normal',
    hue: 120,
    saturation: 100,
    color_temp: 0,
    brightness: 100
})


