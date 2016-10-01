class GeolocationWidget {
    constructor(options) {
    }

    getUserPosition() {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }
}

module.exports = GeolocationWidget;