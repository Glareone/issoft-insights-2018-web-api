import React, {Component} from 'react';
import routesConfiguration from '../../../routing/routesConfiguration';
import './SpeechColorChanger.less';

const {speechColorChanger} = routesConfiguration;

class SpeechColorChanger extends Component {

  constructor(props) {
    super(props);

    this.colors = ['aqua', 'azure', 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
    this.state = {
      result: ''
    };
  }

  componentDidMount() {
    const grammar = `#JSGF V1.0; grammar colors; public <color> = ${this.colors.join(' | ')};`;
    const recognition = new webkitSpeechRecognition();
    const speechRecognitionList = new webkitSpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    function stopRecognition() {
      recognition.stop();
      console.log('Stopped recognition.');
    }

    function startRecognition() {
      recognition.start();
      console.log('Ready to receive a color command.');
    }

    document.querySelector('#start').addEventListener('click', startRecognition);
    document.querySelector('#stop').addEventListener('click', stopRecognition);

    recognition.onresult = ({results}) => {
      this.setState({result: results[0][0].transcript});
      stopRecognition();
    };
  }

  render() {
    return (
      <div id="color-changer" className="pageWrapper colorChanger">
        <h2>{speechColorChanger.title}</h2>
        <div className="controls">
          <button id="start">Start</button>
          <button id="stop">Stop</button>
        </div>
        <div id="palette" className="palette">
          {
            this.colors.map(color => <span key={color} className="color" style={{backgroundColor: color}}>{color}</span>)
          }
        </div>
        <div id="output" className="output" style={{backgroundColor: this.state.result.toLowerCase()}}>
          <p>
            <strong>{this.state.result.toUpperCase()}</strong>
          </p>
        </div>
      </div>
    );
  }
}

export default SpeechColorChanger;
