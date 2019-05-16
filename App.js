/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';


// отключаем варнинги
console.disableYellowBox = true;


const Value = ({name, value}) => (
  <View style={styles.valueContainer}>
    <Text style={styles.valueName}>{name}</Text>
    <Text style={styles.valueValue}>{new String(value).substr(0, 8)}</Text>
  </View>
)

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gpsOptions: {
        enableHighAccuracy: true,
        timeout: 15000,
        distanceFilter: 0
      },
      watchID: null,
      location: {
        coords: {},
        timestamp: null
      },
      speedChart: []
    };

    this.gpsWatchSuccess = this.gpsWatchSuccess.bind(this);

    // this.getPosition();
    this.watchPosition();
  }

  render() {
    return (
      <View style={styles.container}>
        <Value name="Широта: " value={this.state.location.coords.latitude} />
        <Value name="Долгота: " value={this.state.location.coords.longitude} />
        <Value name="Высота: " value={this.state.location.coords.altitude} />
        <Value name="Точность: " value={this.state.location.coords.accuracy} />
        <Value name="Точность высоты: " value={this.state.location.coords.altitudeAccuracy} />
        <Value name="Направление: " value={this.state.location.coords.heading} />
        <Value name="Скорость: " value={this.getSpeedInKm(this.state.location.coords.speed)} />
        <Value name="Время: " value={this.state.location.timestamp} />
      </View>
    );
  }

  getPosition() {
    navigator.geolocation.getCurrentPosition(this.gpsWatchSuccess, this.gpsError, this.state.gpsOptions);
  }

  watchPosition() {
    this.watchID = navigator.geolocation.watchPosition(this.gpsWatchSuccess, this.gpsError, this.state.gpsOptions);
  }

  stopWatchPosition() {
    navigator.geolocation.clearWatch(this.watchID);
    this.setState({watchID: null});
  }

  gpsWatchSuccess(position) {
    let crd = position.coords;

    this.setState({location: {
      coords: crd,
      timestamp: this.dateFromTimestap(position.timestamp)
    }});

    // console.log(crd.speed, this.dateFromTimestap(position.timestamp));
    this.setSpeedChart(crd.speed, this.dateFromTimestap(position.timestamp));
  }

  gpsError(error) {
    console.log('GPS Error!');
    console.log(error);
  }

  dateFromTimestap(timestamp) {
    var d = new Date(timestamp);
    var sec = (d.getSeconds() < 10) ? ('0' + d.getSeconds()) : d.getSeconds()
    return d.getHours() + ':' + d.getMinutes() + ':' + sec;
  }

  getSpeedInKm(speedInM) {
    return speedInM * 3600 / 1000;
  }

  setSpeedChart(speed, timestamp) {
    let _speedChart = this.state.speedChart;
    _speedChart.push({speed: speed, timestamp: timestamp});
    this.setState({speedChart: _speedChart});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  headline: {
    fontSize: 26,
    // textAlign: 'center',
    margin: 10,
  },
  valueContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  valueValue: {
    // width: 200,
    fontSize: 20
  },
  valueName: {
    // width: 50,
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: 10,
    // marginLeft: 10,
  }
});
