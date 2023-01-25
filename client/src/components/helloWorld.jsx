import { Component } from 'react';
import React from 'react';
import axios from 'axios';

class HelloWorld extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isTrue: true,
      message: "Welcome to EcoDrive"
    }
  }

  componentDidMount() {
    if (this.state.isTrue) {
      console.log('this is another test');
      axios.get('/goodbye')
      .then(response => {
        this.setState({
          message: response.data
        }, () => { console.log(this.state.message) })
      })
      .catch(function (error) {
        console.error(error);
      })
    }
  }

  render() {
    return (
      <div>
        <h1>{this.state.message}</h1>
      </div>
    )
  }
}

export default HelloWorld;