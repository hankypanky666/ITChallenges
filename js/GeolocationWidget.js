"use strict";

class GeolocationWidget {

    getUserPosition() {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

}

module.exports = GeolocationWidget;