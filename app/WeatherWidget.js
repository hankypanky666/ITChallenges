// a957911186d6957a2a33a1ece83a6056
const apiId = '6dffb76ddbcf7fb1bc31c24d6a23651e';
const url = 'http://api.openweathermap.org/data/2.5/weather?';
const weatherUrlIcon = 'http://openweathermap.org/img/w/';
const template = `<div id="weather-widget" class="weather-widget">
                    <h2 id="weather-widget-city-name" class="weather-widget__city-name"></h2>
                    <h3 id="weather-widget-temperature" class="weather-widget__temperature"></h3>
                    <p id="weather-widget-main" class="weather-widget__main">moderate rain</p>
                    <table class="weather-widget__items table table-striped table-bordered table-condensed">
                        <tbody><tr>
                            <td>Wind</td>
                            <td id="weather-widget-wind"></td>
                        </tr>
                        <tr>
                            <td>Cloudiness</td>
                            <td id="weather-widget-cloudiness"></td>
                        </tr>
                        <tr>
                            <td>Pressure</td>
                            <td id="weather-widget-pressure"></td>
                        </tr>
                        <tr>
                            <td>Humidity</td>
                            <td id="weather-widget-humidity"></td>
                        </tr>
                        <tr id="weather-widget-row-rain">
                            <td>Rain</td>
                            <td id="weather-widget-rain"></td>
                        </tr>
                        <tr>
                            <td>Sunrise</td>
                            <td id="weather-widget-sunrise"></td>
                        </tr>
                        <tr>
                            <td>Sunset</td>
                            <td id="weather-widget-sunset"></td>
                        </tr>
                    </tbody></table>
                </div>`;

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
        const img = weatherUrlIcon + dataWeather.weather[0].icon;

        this._el.innerHTML = template;
        this._el.querySelector('#weather-widget-city-name').innerHTML = dataWeather.name + ', ' + dataWeather.sys.country;
        this._el.querySelector('#weather-widget-temperature').innerHTML = `
        <img src="${img}.png">
        ${dataWeather.main.temp.toFixed(1)} °C`;
        this._el.querySelector('#weather-widget-main').innerHTML = dataWeather.weather[0].main;
        this._el.querySelector('#weather-widget-wind').innerHTML = dataWeather.wind.speed + ' m/s <br>' + this._toTextualDescription(dataWeather.wind.deg) + '(' + dataWeather.wind.deg + ')';
        this._el.querySelector('#weather-widget-cloudiness').innerHTML = dataWeather.clouds.all + ' %';
        this._el.querySelector('#weather-widget-pressure').innerHTML = dataWeather.main.pressure + ' hpa';
        this._el.querySelector('#weather-widget-humidity').innerHTML = dataWeather.main.humidity + ' %';
        this._el.querySelector('#weather-widget-rain').innerHTML = !dataWeather.rain["3h"] ? 0 : dataWeather.rain["3h"];
        this._el.querySelector('#weather-widget-sunrise').innerHTML = this._createDateTime(dataWeather.sys.sunrise);
        this._el.querySelector('#weather-widget-sunset').innerHTML = this._createDateTime(dataWeather.sys.sunset);
    }

    _createDateTime(date) {
        console.log(date);
        let dateTime = new Date(date);
        console.log(dateTime);
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