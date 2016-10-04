### INDEX
    /app
        -index.html

### INSTALLATION

    npm install

### BUILD

    webpack

### ADD WIDGET

    <div id="app"></div>

    <script>
        var options = {
            element: document.querySelector('#app'),
            apiId: '6dffb76ddbcf7fb1bc31c24d6a23651e',
            styles: {
                width: 35, // in percents,
                margin: 'auto',
            },
            type: 'metric' // metric or imperial
        };
        new WeatherWidget(options);
    </script>
    
### STRUCTURE

    /app
        -bundle.js // compiled with webpack 
        -index.html
    /code
        /js
            -GeolocationWidget.js // BOM
            -HTTPService.js // for requests
            -WeatherWidget.js // main widget
        /static // styles
        /templates // templates handlebars