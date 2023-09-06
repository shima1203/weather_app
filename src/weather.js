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
        
    // 24ごとに区切って2次元配列にする
    mkarray = (oneDArray) => {
        const twoDArray = [];
        for (let i = 0; i < oneDArray.length; i+=24) {
            twoDArray.push(oneDArray.slice(i, i +24));
        }
        return twoDArray;
    }

    // 2次元配列の各列の平均値をとる
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
        return meanArray;
    }

    // 最も出現頻度が高いものを探す
    findMost = (oriArray) => {
        const mostEleArray = [];
        for (const column of oriArray){
            const elementCount = {};
            for (const value of column) {
                if (elementCount[value]) {
                elementCount[value]++;
                } else {
                elementCount[value] = 1;
                }   
            }
            let mostEle = null;
            let maxCount = 0;
            for (const value in elementCount) {
                if (elementCount[value] > maxCount) {
                maxCount = elementCount[value];
                mostEle = value;
                }
            }
            mostEleArray.push(mostEle);
        }
        
        return mostEleArray;
    }

    changeWeatherCode = (weatherArr) => {

    }


    render() {
        const { weatherData, error } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        if (!weatherData) {
            return <div>Loading...</div>;
        }

        const temperatureData = this.findMean(this.mkarray(weatherData.temperature));
        const humidityData = this.findMean(this.mkarray(weatherData.relativeHumidity));
        const weathericData = this.findMost(this.mkarray(weatherData.iconCode));

        
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>data</th>
                            <th>temparature</th>
                            <th>humidity</th>
                            <th>weather</th>
                        </tr>
                    </thead>
                    <tbody>
                        {temperatureData.map((temp, date) => (
                            <tr key={date + 1}>
                                <td>{date + 1}</td>
                                <td>{temp}</td>
                                <td>{humidityData[date]}</td>
                                <td>{weathericData[date]}</td>
                            </tr>
                        )
                    )}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default Weather;

