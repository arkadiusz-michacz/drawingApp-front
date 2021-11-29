import React, { useEffect } from "react";
import './style.css';
import io from 'socket.io-client';

let timeout;
let socket= io.connect('http://192.168.0.31:5000');
let rememberImg;

socket.on('canvas-data',(data)=>{
    console.log("Trying to execute canvas-data");
    let image = new Image();
    let canvas = document.getElementById('board');
    let ctx = canvas.getContext('2d')
    image.onload = () => {
        ctx.drawImage(image,0,0);
    }
    image.src = data;
    rememberImg = data;
})

function restoreImg(){
    if(rememberImg !== undefined)
    {
        let image = new Image();
        let canvas = document.getElementById('board');
        let ctx = canvas.getContext('2d')
        image.onload = () => {
            ctx.drawImage(image,0,0);
        }
        image.src = rememberImg;

    }
}

function drawOnCanvas(color,size){
    //var canvas = document.querySelector('#board');
    var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');

    var sketch = document.querySelector('#sketch');
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));

    var mouse = {x: 0, y: 0};
    var last_mouse = {x: 0, y: 0};

    /* Mouse Capturing Work */
    canvas.addEventListener('mousemove', function(e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
    }, false);

    canvas.addEventListener('touchmove', function(e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        let touch = e.touches[0]

        mouse.x = touch.pageX - this.offsetLeft;
        mouse.y = touch.pageY - this.offsetTop;
    }, false);


    /* Drawing on Paint App */
    ctx.lineWidth = size;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    canvas.addEventListener('mousedown', function(e) {
        canvas.addEventListener('mousemove', onPaint, false);
    }, false);

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', onPaint, false);
    }, false);

    canvas.addEventListener('touchstart', function(e) {
        let touch = e.touches[0]

        last_mouse.x = touch.pageX - this.offsetLeft;
        last_mouse.y = touch.pageY - this.offsetTop;

        mouse.x = touch.pageX - this.offsetLeft;
        mouse.y = touch.pageY - this.offsetTop;
        canvas.addEventListener('touchmove', onPaint, false);
    }, false);

    canvas.addEventListener('touchend', function() {
        canvas.removeEventListener('touchmove', onPaint, false);
    }, false);

    //let root = this;

    

    var onPaint = function() {
        ctx.beginPath();
        ctx.moveTo(last_mouse.x, last_mouse.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.closePath();
        ctx.stroke();

        

        if(timeout != undefined) clearTimeout(timeout);
        timeout = setTimeout(()=>{
            let base64ImageData= canvas.toDataURL('image/png');
            socket.emit('canvas-data', base64ImageData);
            rememberImg = base64ImageData;
        },500)
    };

};

let Board = (props) => {

    let {color,size} = props;
    useEffect(()=>{
        drawOnCanvas(color,size);
        restoreImg();
        
    });

    /*useEffect(()=>{
        console.log("Reload image")

        restoreImg();

        
    });*/

    

    console.log("Board render!")

    return (
        <div className='sketch' id='sketch'>
            <canvas className='board' id='board'></canvas>
        </div>
    );

}

export default Board;