import logo from './logo.svg';
import './App.css';
import io from "socket.io-client";
import { useState, useEffect } from 'react';

let symbol = '';

function App() {
  
  const socket = io('http://192.168.0.15:4001' , {transports: ['websocket']});
  let gameSample = {game:['','','','','','','','',''], id:'', nextPlayer:'', xtaken:'' , winner:''};
  let [game, setGame] = useState(gameSample);
  let [connected, setConnected]= useState(false);
  
  socket.on('configGame', res => {
    setGame(res);
    setConnected(true);
  });
  socket.on('novajogada', res => {setGame(res)});

function conectjogo(){
  setConnected(true);      
  socket.emit('criarJogo', game);
        
}
const decideGetConnect = () => {
    if(game.id==''){
        return('Start Game')
    }
    if(game.winner!=''){return "New Game"}
    if(game.id&&connected){return "Connected"}
    return('Connect');
}
const handleChange = (evento) =>{
    let jog = game;
    jog.id= evento.target.value;
    setGame(jog);
}


useEffect(() => {
  if (connected) {
    // navigator comentado pra não breakar
    copyTextToClipboard(game.id)
      //alert("successfully copied");
    }},[game.id]);

const jogar = (i) =>{
  if(game.nextPlayer==symbol){
  let tempgame = game;
  if(tempgame.game[i]==''){
  tempgame.game[i] = symbol;
  setGame(tempgame);
  socket.emit('oneplay', game);}
  }
}
function clipboardBanner(){
  if(symbol=='X'){
  return (
    <div className='copytoclipboard'>Coppied to ClipBoard</div>
  )}
}
function winnerBanner(){
  if(game.winner!==''){
    return (
      <div className='winnerBanner'>{game.winner+' is the Winner'}</div>
    )}
}
//lógica pra decidir quem é X e quem é O
if(symbol===''){
  if(game.xtaken==='yes'){symbol='O'}if(game.xtaken==='no'){symbol='X'}
}
  return (
    <>
    <div className='myname'><label><h2>Developed by Alezi Bezerra</h2></label></div>
    <div className='board'>
            {game.game.map((value, index) => <div key={index} onClick={()=>{jogar(index)}}   className='cell'><label className='valor'>{value}</label></div>)}    
    </div> 
    <div>
        <label>
        <input className='gameId' autoComplete="off" 
        disabled={connected} onChange={handleChange}  
        placeholder='Game ID ' type="text" name="name" 
        defaultValue={game.id} 
        onKeyDown={event => {
          if (event.key === 'Enter') {
            conectjogo();
          }
        }}/>
        </label>
        {connected&&clipboardBanner()} 
        {game.winner&&winnerBanner()}       
        <button className={cssChange()} 
        onClick={conectjogo} 
        type="button">{decideGetConnect()}</button>
    </div>
    </>  
  ); 
  
  function cssChange(){
    if(game.winner!==''){
      return 'connectteste';
    }
    if(connected){return 'connected'}
    if(game.winner==''&&!connected){return 'connect';}
  }
}
export async function copyTextToClipboard(text) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}

export default App;
