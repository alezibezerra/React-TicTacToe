import React from 'react';

class Cell extends React.Component {
    state = {};
    render() { 
        return <div className='cell'>{this.props.value}</div>;
    }
}
 
export default Cell;