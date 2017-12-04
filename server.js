const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');
const port = process.argv[2] || 8000;

//set my api key
const apiKey = 'c5806e7acb5635dc19890e09b140bb0e';
//set default time zone
moment.locale('fr');

/**======================================
 * Default parameters css, rendering engine
 ========================================*/

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');

/*=============== End ======================*/

//render my index page
app.get('/', function (req, res) {
    // res.send('hello');
    res.render('index');
})

/**===========================================
 * get my input search and all the traitments
 ============================================*/
app.post('/', function (req, res) {
    let city = req.body.city;
    console.log('city is :' + city);
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    request({
        url: url
    }, (Error, response, body) => {
        if (Error) {
            console.log('Whatttttt');
            res.render('index', {weather: null, error: 'Error, please try again'});
            console.log('Unable to feth data');
        } else {

            let weather = JSON.parse(body);
            console.log(weather);
            console.log(weather.main.humidity);
            console.log(weather.wind.speed);

            if (weather === undefined) {
                //if it's don' t 
                res.render('index', {
                    weather: null,
                    error: 'Error!!! , Can not fetch location'
                });

            } else {

                //set date
                let dateDay = (moment().format('LLLL'));
                let weatherTemp = weather.main.temp;
                let weatherName = weather.name;
                let weatherImg = weather.weather;
                let weatherHumidity = weather.main.humidity;
                let weatherSpeed = weather.wind.speed;

                res.render('index', {
                    //send data to my index view
                    weatherTemp: weatherTemp,
                    weatherName: weatherName,
                    weatherSpeed: weatherSpeed,
                    weatherHumidity: weatherHumidity,
                    dateDay: dateDay,
                    weatherImg: weatherImg,
                    error: null
                });
            }

        }
    })
})


//load server on my default port
app.listen(port, function () {
    console.log(`server running on port ${port}`)
})