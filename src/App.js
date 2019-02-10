import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Signin from './components/SignIn/Signin';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'c4e7395741fd49039ee69d3fb4eb928a'
});

const particlesOptions = {
  particles:{
    value: 150,
    density:{
      enable:true,
      value_area: 800
    }
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box: {},
      route: 'signin'
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const inputedImage = document.getElementById('inputedimage');
    const imgwidth = Number(inputedImage.width);
    const imgheight = Number(inputedImage.height);
    return {
      leftCol: clarifaiFace.left_col * imgwidth,
      topRow: clarifaiFace.top_row * imgheight,
      rightCol: imgwidth - (clarifaiFace.right_col * imgwidth),
      bottomRow: imgheight - (clarifaiFace.bottom_row * imgheight)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box:box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    this.setState({route:route});
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params= {particlesOptions} />
        {this.state.route === 'signin' ? <Signin onRouteChange={this.onRouteChange}/> :
           <div>
              <Navigation onRouteChange={this.onRouteChange} />
              <Logo />
              <Rank />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
           </div>  
        }
      </div>
    );
  }
}

export default App;
