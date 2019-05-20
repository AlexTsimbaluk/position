import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';


// отключаем варнинги
console.disableYellowBox = true;


const Value = ({name, value}) => (
  <View style={styles.valueContainer}>
    <Text style={styles.valueName}>{name}</Text>
    <Text style={styles.valueValue}>{new String(value).substr(0, 8)}</Text>
  </View>
)

const ChartSpeed = ({speed, time}) => (
  <LineChart
    style={{ height: 200 }}
    data={ time }
    svg={{ stroke: 'rgb(134, 65, 244)' }}
    contentInset={{ top: 20, bottom: 20 }}
  >
    <Grid/>
  </LineChart>
)

class LineChartExample extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      speed: [],
      time: []
    };
  }

  

  componentDidMount() {
    // this.getAxis();
  }

  /*shouldComponentUpdate() {
    this.getAxis();
  }*/

  render() {
    const data = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ];

    // console.log(this.props.speed.map(el => (el + Math.random * 10)));
    console.log(this.props.speed);
    console.log(this.props.time);

    return (
        // data={ this.props.speed.map(el => (el + Math.random * 10)) }
      <LineChart
        style={{ height: 200 }}
        data={ this.props.time }
        svg={{ stroke: 'rgb(134, 65, 244)' }}
        contentInset={{ top: 20, bottom: 20 }}
      >
        <Grid/>
      </LineChart>
    )
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      success: false,
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
      speed: [],
      time: []
    };

    this.gpsWatchSuccess = this.gpsWatchSuccess.bind(this);

    // this.getPosition();
  }

  _setState(name, val) {
    let temp = this.state[name];
    temp.push(val);
    this.setState({name: temp});
  }

  componentDidMount() {
    this.watchPosition();
  }

  componentWillUnmount() {
    this.watchID && this.stopWatchPosition();
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

        <LineChartExample speed={this.state.speed} time={this.state.time} />
        <ChartSpeed speed={this.state.speed} time={this.state.time} />
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

    if(!this.success) {
      this.setState({success: true});
    }

    this.setState({location: {
      coords: crd,
      timestamp: this.dateFromTimestap(position.timestamp)
    }});

    // console.log(crd.speed, this.dateFromTimestap(position.timestamp));
    // this.setSpeedChart(this.getSpeedInKm(crd.speed), this.dateFromTimestap(position.timestamp));

    this._setState('speed', this.getSpeedInKm(crd.speed));
    this._setState('time', this.dateFromTimestap(position.timestamp));
  }

  gpsError(error) {
    console.log('GPS Error!');
    console.log(error);
  }

  dateFromTimestap(timestamp) {
    var d = new Date(timestamp);
    var hours = (d.getHours() < 10) ? ('0' + d.getHours()) : d.getHours();
    var min = (d.getMinutes() < 10) ? ('0' + d.getMinutes()) : d.getMinutes();
    var sec = (d.getSeconds() < 10) ? ('0' + d.getSeconds()) : d.getSeconds();
    // return hours + ':' + min + ':' + sec;
    return d.getHours() + d.getMinutes() + d.getSeconds();
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
