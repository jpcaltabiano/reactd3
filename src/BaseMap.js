//https://medium.com/@Elijah_Meeks/interactive-applications-with-react-d3-f76f7b3ebc71
import React from "react";
import baseMap from "./basemap_d3";
import fillMap from "./maps_d3";

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Slider from '@material-ui/lab/Slider';

class BaseMap extends React.Component {
  constructor(props) {
    super(props);
    this.marks = new Array();
    this.state = {
      type: 'e',
      year: 1960,
    };
  }

  generateMarks() {
    //marks = [];
    for (var i = 1960; i <= 2014; i+=2) {
      this.marks.push({
        key: i,
        label: i.toString()
      })
    }
  }

  componentDidMount() {
    this.generateMarks();
    baseMap(this.state);
    fillMap(this.state);
  }
  componentDidUpdate(prevState) {
    if (prevState.type !== this.state.type) {
      fillMap(this.state);
    }  
  }
  
  radioBtnUpdate = (event) => { this.setState({type: event.target.value}); }

  sliderUpdate = (event, value) => {
    console.log('moved')
    this.setState({year: value});
    //console.log(this.state.year)
  }

  valuetext(value) {
    return `${value}`;
  }

  render() {
    return (
      <div>
        <div className="base_map" />

        <FormControl component="fieldset">
          <RadioGroup
            aria-label="position"
            name="position"
            value={this.state.type}
            onChange={this.radioBtnUpdate}
          >
            <FormControlLabel
              value="e"
              control={<Radio color="primary" />}
              label="e"
              labelPlacement="start"
            />
            <FormControlLabel
              value="p"
              control={<Radio color="primary" />}
              label="p"
              labelPlacement="start"
            />
          </RadioGroup>
        </FormControl>

        <Slider
          defaultValue={1960}
          //value={this.state.year}
          onChange={this.sliderUpdate}
          //spacing={3}
          //debouncing, windowing, throttling
          min={1960}
          max={2014}
          getAriaValueText={this.valuetext}
          aria-labelledby="discrete-slider-always"
          step={1}
          marks={this.marks}
          valueLabelDisplay="on"
        />

      </div>
    )
   
  }
}

export default (BaseMap)


/* const BaseMap = (props) => {
  useEffect(() => {
    draw(props)
  })
} */

