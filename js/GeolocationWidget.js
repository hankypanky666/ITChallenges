class GeolocationWidget {
    constructor(options) {
        // this._el = options.element;
        //
        // navigator.geolocation.getCurrentPosition(this._success.bind(this), this._error.bind(this));
    }

    getUserPosition() {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }
    //
    // _success(position) {
    //     let latitude = position.coords.latitude;
    //     let longitude = position.coords.longitude;
    //
    //     this._el.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';
    // }
    //
    // _error() {
    //     this._el.innerHTML = "Unable to retrieve your location";
    // }
}

module.exports = GeolocationWidget;