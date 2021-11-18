import React, { useState } from 'react';
import Board from '../board/Board';
import './style.css'

let Container = (props) => {
    
    let [color, setColor] = useState('#fff000');
    let [brushSize, setBrushSize] = useState('5');
    

    const changeColor =(params)=>{
        setColor(params.target.value);
        //console.log(color);
    };
    const changeBrushSize = (params) => {
        setBrushSize(params.target.value);
        //console.log(brushSize);
    }

    return (
        <div className='container'>
            <div className='tools-section'>
                <div className='color-picker-container'>
                    Select Brush Color : 
                    <input type='color' value={color} onChange={changeColor}/>
                </div>
                <div className='brush-size-container'>
                    Select Brush Size :
                    <select value={brushSize} onChange={changeBrushSize}>
                        <option>5</option>
                        <option>10</option>
                        <option>15</option>
                        <option>20</option>
                        <option>25</option>
                    </select>
                </div>
            </div>
            <div className='board-container'>
                <Board color ={color} size ={brushSize}/>
            </div>
        </div>
    );
}

export default Container;