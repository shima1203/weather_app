import React, { Component } from 'react';
class Weather extends Component {
    constructor(props) {
        super(props);
        this.state = {
        weatherData: null,
        error: null,
        };
    }

    componentDidMount() {
        // APIエンドポイントのURL
        const apiUrl1 = 'https://api.weather.com/v3/wx/forecast/hourly/15day?geocode=35.65,135.79&format=json&units=m&language=jaJP&apiKey=7698370dea91420198370dea91720199';
        const apiUrl2 = 'https://api.weather.com/v3/wx/hod/r1/direct?geocode=35.65,135.79&startDateTime=2022-11-01T00Z&endDateTime=2022-11-10T00Z&format=json&units=m&apiKey=7698370dea91420198370dea91720199';

        // APIを呼び出す
        fetch(apiUrl2)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // 取得したデータをstateにセット
            this.setState({ weatherData: data });
            console.log('Weather Data:', data);
        })
        .catch((error) => {
            // エラーハンドリング
            this.setState({ error: error });
        });
    }

    render() {
        const { weatherData, error } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        if (!weatherData) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                <h1>Weather Information</h1>
                <p>Temperature: {weatherData.temperature}</p>
                <p>Humidity: {weatherData.temperature}</p>
                <p>Weather: {weatherData.conditions}</p>
            </div>
        );
    }
}
export default Weather;

