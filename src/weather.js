import React, { Component } from 'react';
import Dropdown from './Dropdown';

class Weather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherDataMonth: null,
            weatherDataToday: null,
            weatherDataYesterday: null,
            selectedOption: '',
            longitude:'139.69',
            latitude:'35.68',
            error: null,
        };
    }

    componentDidMount() {
        const todayData = new Date();
        const year = todayData.getFullYear();
        const month = String(todayData.getMonth() + 1).padStart(2, '0');
        const today = String(todayData.getDate()).padStart(2, '0');
        const tomorrow = String(todayData.getDate() + 1).padStart(2, '0');
        const yesterday = String(todayData.getDate() - 1).padStart(2, '0');

        const apiUrlforec = 'https://api.weather.com/v3/wx/forecast/hourly/15day?geocode=35.65,135.79&format=json&units=m&language=jaJP&apiKey=7698370dea91420198370dea91720199';
        const apiUrl11m = `https://api.weather.com/v3/wx/hod/r1/direct?geocode=${this.state.latitude},${this.state.longitude}&startDateTime=2022-11-01T00Z&endDateTime=2022-12-01T00Z&format=json&units=m&apiKey=7698370dea91420198370dea91720199`;
        const apiUrlToday = `https://api.weather.com/v3/wx/hod/r1/direct?geocode=35.65,135.79&startDateTime=${year}-${month}-${today}T00Z&endDateTime=${year}-${month}-${tomorrow}T00Z&format=json&units=m&apiKey=7698370dea91420198370dea91720199`;
        const apiUrlYesyerday = `https://api.weather.com/v3/wx/hod/r1/direct?geocode=35.65,135.79&startDateTime=${year}-${month}-${yesterday}T00Z&endDateTime=${year}-${month}-${today}T00Z&format=json&units=m&apiKey=7698370dea91420198370dea91720199`;

        // 11月のデータ
        fetch(apiUrl11m)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            this.setState({ weatherDataMonth: data });
            console.log('Weather Data Month:', data);
        })
        .catch((error) => {
            this.setState({ error: error });
        });

        // 今日の天気データ
        // fetch(apiUrlToday)
        // .then((response) => {
        //     if (!response.ok) {
        //         throw new Error('Network response was not ok');
        //     }
        //     return response.json();
        // })
        // .then((data) => {
        //     this.setState({ weatherDataToday: data });
        //     console.log('Weather Data Today:', data);
        // })
        // .catch((error) => {
        //     this.setState({ error: error });
        // });

        // 昨日の天気データ
        fetch(apiUrlYesyerday)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            this.setState({ weatherDataYesterday: data });
            console.log('Weather Data Yesterday:', data);
        })
        .catch((error) => {
            this.setState({ error: error });
        });
    }

    handleOptionChange = (selectedOption) => {
        let newLongitude = '';
        let newLatitude = '';

        if (selectedOption === '東京') {
            newLongitude = '139.69';
            newLatitude = '35.68';
        } else if (selectedOption === '大阪') {
            newLongitude = '135.31';
            newLatitude = '34.41';
        } else if (selectedOption === '名古屋') {
            newLongitude = '136.54';
            newLatitude = '35.10';
        }

        this.setState({
            selectedOption,
            longitude: newLongitude,
            latitude: newLatitude,
        });

        this.componentDidMount();
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

    // ウェザーコードを変換
    changeWeatherCode = (weatherArr) => {
        const changedWeatherArr = [];
        for(const weather of weatherArr){
            if((weather >= 0 && weather <= 12) || (weather >= 37 && weather <= 40) || (weather === 35 || weather === 45 || weather === 47)){
                changedWeatherArr.push("rainy");
            }
            else if((weather >= 19 && weather <= 24) || (weather >= 26 && weather <= 30)){
                changedWeatherArr.push("cloudy");
            }
            else if((weather >= 31 && weather <= 34) || (weather == 36)){
                changedWeatherArr.push("sunny");
            }
            else if((weather >= 13 && weather <= 18) || (weather >= 41 && weather <= 43) || (weather === 25 || weather === 46)){
                changedWeatherArr.push("snowy");
            }
            else{
                changedWeatherArr.push("error");
            }
        }
        return changedWeatherArr;
    }

    // 天気の数を数え上げる
    countWeather = (weatherArr) => {
        const countedWeatherArr = {};
        for(const weather of weatherArr){
            if(countedWeatherArr[weather]){
                countedWeatherArr[weather] += 1;
            }
            else{
                countedWeatherArr[weather] = 1;
            }
        }
        return countedWeatherArr;
    }


    render() {
        const { weatherDataMonth, error } = this.state;

        const options1 = ['東京', '大阪', '名古屋'];

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        if (!weatherDataMonth) {
            return <div>Loading...</div>;
        }

        const temperatureData = this.findMean(this.mkarray(weatherDataMonth.temperature));
        const humidityData = this.findMean(this.mkarray(weatherDataMonth.relativeHumidity));
        const weathericData = this.changeWeatherCode(this.findMost(this.mkarray(weatherDataMonth.iconCode)));
        const weatherCount = this.countWeather(weathericData);
        
        return (
            <div>
                <div>
                    <Dropdown
                        options = {options1}
                        selectedOption = {this.state.selectedOption}
                        onOptionChange = {this.handleOptionChange}
                    />
                    {/* <p>{this.state.selectedOption}</p> */}
                </div>
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
                <div>
                <ul>
                    {Object.keys(weatherCount).map((count, index) => (
                        <li key={index}>
                            {count}: {weatherCount[count]}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        );
    }
}
export default Weather;

