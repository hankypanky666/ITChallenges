// a957911186d6957a2a33a1ece83a6056
"use strict";

const url = 'http://api.openweathermap.org/data/2.5/weather?';
const weatherUrlIcon = 'http://openweathermap.org/img/w/';

const celsius = '&deg; C';
const fahrenheit = '&deg; F';

const template = require('../templates/weather-widget.hbs');
const reloader = require('../templates/reload.hbs');
const errortpl = require('../templates/error.hbs');

//add styles
require('../static/loader.css');
require('../static/style.css');

let HTTPService = require('./HTTPService');
let GeolocationWidget = require('./GeolocationWidget');

class WeatherWidget {
    constructor(options) {
        this._el = options.element;
        this._appId = options.apiId;
        this._styles = options.styles;
        this._weatherType = options.type || 'metric';

        this._setWeatherType(this._weatherType);

        this._el.style.width = this._styles.width + '%' || '100%';
        this._el.style.margin = this._styles.margin || 'auto';
        this._el.className = this._styles.cssClass || '';

        this._el.innerHTML = reloader();

        if (!navigator.geolocation) {
            this._el.innerHTML = '<p>Geolocation is not supported by your browser</p>';
            return;
        }
        this.position = new GeolocationWidget();

        this.http = new HTTPService();

        document.addEventListener("DOMContentLoaded", this._ready.bind(this));

        this._el.addEventListener('click', this._refreshData.bind(this));
    }

    _ready(e, city) {
        if (!city) {
            this.position.getUserPosition().then((position) => this._loadData(position));
        } else {
            this._loadData(null, city);
        }

    }

    // loading data from Weather
    _loadData(position, city) {
        if (!city) {
            let lastUpdate = this._createDateTime(position.timestamp);

            this.http.httpGet(`${url}lat=${position.coords.latitude.toFixed(2)}&lon=${position.coords.longitude.toFixed(2)}&units=${this._getWeatherType()}&appid=${this._appId}`)
                .then((response) => this._render(response, lastUpdate));
        } else {
            this.http.httpGet(`${url}q=${city}&units=${this._getWeatherType()}&appid=${this._appId}`)
                .then((response) => this._render(response, this._createDateTime(Date.now())));
        }

    }

    // render template
    _render(data, lastUpdate) {
        const dataWeather = JSON.parse(data);
        if (dataWeather.coord) {
            dataWeather.cityName = dataWeather.name;
            dataWeather.countryId = dataWeather.sys.country;
            dataWeather.img = weatherUrlIcon + dataWeather.weather[0].icon;
            dataWeather.temperature = dataWeather.main.temp.toFixed(1);
            dataWeather.weatherDescription = dataWeather.weather[0].description;
            dataWeather.windSpeed = dataWeather.wind.speed.toFixed(1);
            dataWeather.windDeg = dataWeather.wind.deg ? dataWeather.wind.deg.toFixed() : 0;
            dataWeather.windDescription = this._toTextualDescription(dataWeather.wind.deg);
            dataWeather.cloudsPercent = dataWeather.clouds.all;
            dataWeather.pressure = dataWeather.main.pressure;
            dataWeather.humidity = dataWeather.main.humidity;
            dataWeather.rainDescription = !dataWeather.rain ? 0 : dataWeather.rain["3h"];
            dataWeather.sign = this._getSign(this._getWeatherType());

            dataWeather.cel = this._getWeatherType() === 'metric' ? 'metric' : null;
            dataWeather.far = this._getWeatherType() === 'imperial' ? 'imperial' : null;

            dataWeather.sunrise = this._createDateTime(dataWeather.sys.sunrise);
            dataWeather.sunset = this._createDateTime(dataWeather.sys.sunset);

            // generate handlebars template
            this._el.innerHTML = template({
                dataWeather: dataWeather,
                lastUpdate: lastUpdate
            });
        } else {
            this._el.innerHTML = errortpl({
                message: dataWeather.message
            });
        }

    }

    _createDateTime(date) {
        let dateTime = new Date(date);
        return dateTime.getHours() + ':' + (dateTime.getMinutes() < 10 ? '0' : '') + dateTime.getMinutes();
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

    _refreshData(e) {
        if (e.target.hasAttribute('data-refresh')) {
            // refresh data
            this._el.innerHTML = reloader();
            this._ready(e, this._getCity());
        }
        else if (e.target.getAttribute('name') === 'weatherType') {
            this._setWeatherType(e.target.getAttribute('data-type'));
            this._el.innerHTML = reloader();
            this._ready(e, this._getCity());
        }
        else if (e.target.hasAttribute('data-city-submit')) {
            let form = document.forms.changeCity;
            if (form.elements.cityName.value.length < 3) {
                form.elements.cityName.parentElement.classList.add('has-danger');
                document.querySelector('.form-control-feedback').classList.remove('hidden');
            }
            this._setCity(form.elements.cityName.value);
            this._ready(e, this._getCity());
        }
        else if (e.target.hasAttribute('data-city-refresh')) {
            this._setCity(false);
            this._el.innerHTML = reloader();
            this._ready();
        }
    }

    _setWeatherType(type) {
        if (type !== sessionStorage.getItem('sign')) {
            sessionStorage.setItem('sign', type);
        }
    }

    _getWeatherType() {
        return sessionStorage.getItem('sign');
    }

    _getSign(type) {
        return type === 'metric' ? celsius : fahrenheit;
    }

    _setCity(city) {
        if (!city) {
            sessionStorage.removeItem('city');
        } else {
            sessionStorage.setItem('city', city);
        }
    }

    _getCity() {
        return sessionStorage.getItem('city');
    }

}

module.exports = WeatherWidget;