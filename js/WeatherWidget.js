// a957911186d6957a2a33a1ece83a6056
const apiId = '6dffb76ddbcf7fb1bc31c24d6a23651e';
const url = 'http://api.openweathermap.org/data/2.5/weather?';
const weatherUrlIcon = 'http://openweathermap.org/img/w/';

const template = require('../templates/weather-widget.hbs');

let HTTPService = require('./HTTPService');
let GeolocationWidget = require('./GeolocationWidget');

class WeatherWidget {
    constructor(options) {
        this._el = options.element;

        if (!navigator.geolocation) {
            this._el.innerHTML = '<p>Geolocation is not supported by your browser</p>';
            return;
        }
        this.position = new GeolocationWidget();

        this.http = new HTTPService();

        this.position.getUserPosition()
            .then((position) => this._loadData(position))
            .catch(function (error) {
                // uhoh, something went wrong
            });
    }

    // loading data from Weather
    _loadData(position) {
        console.log(position);
        this.http.httpGet(url + 'lat=' + position.coords.latitude.toFixed(2) + '&lon=' + position.coords.longitude.toFixed(2) + '&units=metric' + '&appid=' + apiId)
            .then(
                response => {
                    this._render(response);
                },
                error => console.log(`Rejected: ${error}`)
            );
    }

    // render template
    _render(data) {
        const dataWeather = JSON.parse(data);
        dataWeather.img = weatherUrlIcon + dataWeather.weather[0].icon;
        dataWeather.wind.desc = this._toTextualDescription(dataWeather.wind.deg);
        dataWeather.rain.desc = !dataWeather.rain["3h"] ? 0 : dataWeather.rain["3h"];
        dataWeather.weather.desc = dataWeather.weather[0].main;
        dataWeather.sunrise = this._createDateTime(dataWeather.sys.sunrise);
        dataWeather.sunset = this._createDateTime(dataWeather.sys.sunset);

        this._el.innerHTML = template({
            dataWeather: dataWeather
        });
    }

    _createDateTime(date) {
        let dateTime = new Date(date);
        return dateTime.getHours() + ':' + dateTime.getMinutes();
    }

    _toTextualDescription(degree) {
        if (degree > 337.5) return 'Northerly';
        if (degree > 292.5) return 'North Westerly';
        if (degree > 247.5) return 'Westerly';
        if (degree > 202.5) return 'South Westerly';
        if (degree > 157.5) return 'Southerly';
        if (degree > 122.5) return 'South Easterly';
        if (degree > 67.5) return 'Easterly';
        if (degree > 22.5) {
            return 'North Easterly';
        }
        return 'Northerly';
    }
}

module.exports = WeatherWidget;