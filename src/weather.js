import React, { Component } from 'react';
import Dropdown from './Dropdown';

class Weather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherDataMonth: null,
            weatherDataToday: null,
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
        const yesterday = String(todayData.getDate() - 1).padStart(2, '0');

        const apiUrl11m = `https://api.weather.com/v3/wx/hod/r1/direct?geocode=${this.state.latitude},${this.state.longitude}&startDateTime=2022-10-31T15Z&endDateTime=2022-11-31T15Z&format=json&units=m&apiKey=7698370dea91420198370dea91720199`;
        const apiUrlToday = `https://api.weather.com/v3/wx/hod/r1/direct?geocode=${this.state.latitude},${this.state.longitude}&startDateTime=${year}-${month}-${yesterday}T15Z&endDateTime=${year}-${month}-${today}T15Z&format=json&units=m&apiKey=7698370dea91420198370dea91720199`;
        
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
        fetch(apiUrlToday)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            this.setState({ weatherDataToday: data });
            console.log('Weather Data Today:', data);
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
        // 【要修正】一回遅れになってる
    }
        
    // 24ごとに区切って2次元配列にする
    mkarray24 = (oneDArray) => {
        const twoDArray = [];
        for (let i = 0; i < oneDArray.length; i+=24) {
            twoDArray.push(oneDArray.slice(i, i +24));
        }
        return twoDArray;
    }

    // 10ごとに区切って2次元配列にする
    mkarray10 = (oneDArray) => {
        const twoDArray = [];
        for (let i = 0; i < 3; i+=1) {
            twoDArray.push(oneDArray.slice(i*10, i*10 +10));
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
        const { weatherDataMonth, weatherDataToday, error } = this.state;

        const options1 = ['東京', '大阪', '名古屋'];

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        if (!weatherDataMonth) {
            return <div>Loading...</div>;
        }

        const temperatureMonth = this.findMean(this.mkarray24(weatherDataMonth.temperature));
        const humidityMonth = this.findMean(this.mkarray24(weatherDataMonth.relativeHumidity));
        const weatherMonth = this.changeWeatherCode(this.findMost(this.mkarray24(weatherDataMonth.iconCode)));
        const weatherCountMonth = this.countWeather(weatherMonth);
        const temperatureToday = weatherDataToday.temperature;
        const humidityToday = weatherDataToday.relativeHumidity;
        const weatherToday =  this.changeWeatherCode(weatherDataToday.iconCode);
        const temperature10d = this.findMean(this.mkarray10(temperatureMonth));

        return (
            <div>
                <div>
                    <Dropdown
                        options = {options1}
                        selectedOption = {this.state.selectedOption}
                        onOptionChange = {this.handleOptionChange}
                    />
                </div>
                <div>
                    <table>
                        <caption>本日の天気</caption>
                        <thead>
                            <tr>
                                <th>time</th>
                                <th>temparature</th>
                                <th>humidity</th>
                                <th>weather</th>
                            </tr>
                        </thead>
                        <tbody>
                            {temperatureToday.map((temp, time) => (
                                <tr key={time}>
                                    <td>{time}</td>
                                    <td>{temp}</td>
                                    <td>{humidityToday[time]}</td>
                                    <td>{weatherToday[time]}</td>
                                </tr>
                            )
                        )}
                        </tbody>
                    </table>
                    <br></br>
                </div>
                <div>
                    <table>
                        <caption>2022年11月の平均気温</caption>
                        <thead>
                            <tr>
                                <th>上旬</th>
                                <th>中旬</th>
                                <th>下旬</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{temperature10d[0]}</td>
                                <td>{temperature10d[1]}</td>
                                <td>{temperature10d[2]}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br></br>
                </div>
                <div>
                    <table>
                        <caption>2022年11月の天気</caption>
                        <thead>
                            <tr>
                                <th>data</th>
                                <th>temparature</th>
                                <th>humidity</th>
                                <th>weather</th>
                            </tr>
                        </thead>
                        <tbody>
                            {temperatureMonth.map((temp, date) => (
                                <tr key={date + 1}>
                                    <td>{date + 1}</td>
                                    <td>{temp}</td>
                                    <td>{humidityMonth[date]}</td>
                                    <td>{weatherMonth[date]}</td>
                                </tr>
                            )
                        )}
                        </tbody>
                    </table>
                </div>
                <div>
                <ul>
                    {Object.keys(weatherCountMonth).map((count, index) => (
                        <li key={index}>
                            {count}: {weatherCountMonth[count]}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        );
    }
}
export default Weather;

