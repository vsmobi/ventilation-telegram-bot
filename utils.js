var merge = require('deepmerge');

/**
 *
 * @param temperature
 * @param wind
 * @returns {number}
 */
function handleWeather(temperature, wind) {
    let timing = 0;
    switch (true) {
        case temperature <= 0 :
            timing = timingCalculator({
                temperature,
                wind,
            });
            break;

        case temperature > 0 :
            timing = timingCalculator({
                temperature,
                wind,
                a: -17,
                b: 50,
                c: 15,
            });
            break;

        default:
            timing = 10;
            break;
    }

    return timing;
}

/**
 * Calculate timing with formula
 * @param options
 * @returns {number}
 */
function timingCalculator(options = {}) {
    const defaultOptions = {
        temperature: 0,
        wind: 0,
        power: 2,
        a: -11,
        b: 100,
        c: 10,
        d: 30
    };

    let opt = merge.all([ defaultOptions, options ]);
    let timeFunction = -Math.pow(opt.temperature + opt.a, opt.power) / opt.b + opt.c;
    let windFunction = -Math.pow(opt.wind - opt.a, opt.power) / opt.d;

    return Math.round(timeFunction);

}

module.exports.handleWeather = handleWeather;