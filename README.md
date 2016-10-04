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