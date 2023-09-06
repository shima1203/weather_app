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
        const apiUrl1 = 'https://api.weather.com/v3/wx/forecast/hourly/15day?geocode=35.65,135.79&format=json&units=m&language=jaJP&apiKey=7698370dea91420198370dea91720199';
        const apiUrl2 = 'https://api.weather.com/v3/wx/hod/r1/direct?geocode=35.65,135.79&startDateTime=2022-11-01T00Z&endDateTime=2022-12-01T00Z&format=json&units=m&apiKey=7698370dea91420198370dea91720199';

        fetch(apiUrl2)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            this.setState({ weatherData: data });
            console.log('Weather Data:', data);
        })
        .catch((error) => {
            this.setState({ error: error });
        });
    }
        
    mkarray = (oneDArray) => {
        const twoDArray = [];
        for (let i = 0; i < oneDArray.length; i+=24) {
            twoDArray.push(oneDArray.slice(i, i +24));
        }
        console.log(twoDArray);
        return twoDArray;
    }

    findMean = (oriArray) => {
        const meanArray = [];
        const numRows = oriArray.length;
        const numCols = oriArray[0].length;
        
        for (let i = 0; i < numRows; i++){
            let columnSum = 0;
            for(let j = 0; j < numCols; j++){
                columnSum += oriArray[i][j];
            }
            const average = columnSum / numCols;
            const roundedAverage = parseFloat(average.toFixed(1));
            meanArray.push(roundedAverage);
        }
        console.log(meanArray);
        return meanArray;
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
                <table>
                    <thead>
                        <tr>
                            <td>temparature</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.findMean(this.mkarray(weatherData.temperature)).map((temp, date) => (
                            <tr key={date}>{date + 1} : {temp}</tr>
                        )
                    )}
                    </tbody>
                </table>

                <p>Humidity: {weatherData.relativeHumidity}</p>
                <p>Weather: {weatherData.iconCode}</p>
            </div>
        );
    }
}
export default Weather;

