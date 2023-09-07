import React, { Component } from 'react';

class Dropdown extends Component {
    handleOptionChange = (event) => {
        const selectedOption = event.target.value;
        this.props.onOptionChange(selectedOption);
    }

    render() {
        const { options, selectedOption } = this.props;

        return (
            <div>
                <select value={selectedOption} onChange={this.handleOptionChange}>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
}

export default Dropdown;