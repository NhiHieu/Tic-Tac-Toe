import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    render() {
        let value = this.props.value;
        return (
            <button className="square" onClick={this.props.onClick}>
                {value}
            </button>
        )
    }
}

class Board extends React.Component {
    renderSquare(i, j){
        return (
            <Square
                key={i*10+j}
                value={this.props.squares[i][j]}
                onClick={() =>this.props.onClick(i,j)}
            />
        )
    }

    renderBoard() {
        let col_board = [];
        let board = [];
        for(let i = 0; i < 10; i++){
            col_board = [];
            for(let j = 0; j < 10; j++){
                col_board.push(<Square
                key={i*10+j}
                value={this.props.squares[i][j]}
                onClick={() =>this.props.onClick(i,j)}
            />);
            }
            board.push(<div className="board-row">{col_board}</div>)
        }
        
        return board;
    }
    
    render() {
        let col_board = [];
        const board = [];
        const squares = this.props.squares.map(arr => arr.slice())
        for(let i = 0; i < 10; i++){
            col_board = [];
            for(let j = 0; j < 10; j++){
                col_board.push(<Square
                    key={i*10+j}
                    value={squares[i][j]}
                    onClick={() =>this.props.onClick(i,j)}
                />);
            }
            board.push(<div className="board-row">{col_board}</div>)
        }
        return(
            <div>
                {board}
            </div>
        )
    }
}

function checkRow(squares, i, j, current_value){
    let left = j - 1, right =j + 1;
    while(right < 10 && squares[i][right] === current_value)
        right++;
    while(left >= 0 && squares[i][left] === current_value)
        left--;
    
    if(
        right-left >= 6 &&
        (
            right > 9 || left < 0 || 
            squares[i][right] === null ||
            squares[i][left] === null
        ))
            return true;
    return false;
}

function checkColumn(squares, i, j, current_value){
    let up = i + 1, down = i - 1;
    while(up < 10 && squares[up][j] === current_value)
        up++;
    while(down >= 0 && squares[down][j] === current_value)
        down--;

    if(
        up-down >= 6 &&
        (
            up > 9 || down < 0 ||
            squares[up][j] === null ||
            squares[down][j] === null
        ))
        return true;
    return false;
}

function checkMainDiagonal(squares, i, j, current_value){
    let up = i +1, down = i -1, right = j +1, left = j -1;
    while(up < 10 && right < 10 && squares[up][right] === current_value){
        up++;
        right++;
    }
    while(down >= 0 && left >= 0 && squares[down][left] === current_value){
        down--;
        left--;
    }

    if(
        up-down >= 6 &&
        (
            up > 9 || down < 0 || squares[up][right] === null || squares[down][left] === null
        )
    )
        return true;
    return false;
}

function checkSubDiagonal(squares, i ,j , current_value){
    let up = i +1, down = i -1, right = j +1, left = j -1;
    while(down >= 0 && right < 10 && squares[down][right] === current_value){
        down--;
        right++;
    }
    while(up < 10 && left >= 0 && squares[up][left] === current_value){
        up++;
        left--;
    }

    if(
        up-down >= 6 &&
        (
            up > 9 || down < 0 || squares[up][left] === null || squares[down][right] === null
        )
    )
            return true;
    return false;
}

function calculateWinter(squares, i ,j , current_value){
    /* 
    description
    */
    //check call?
    console.log("Check calculate");
    if(
        checkRow(squares, i ,j , current_value) ||
        checkColumn(squares, i ,j , current_value) ||
        checkMainDiagonal(squares, i ,j , current_value) ||
        checkSubDiagonal(squares, i ,j , current_value))
        return true;
    return false;
    
}


function Restart(props){
    return(
        <button className="restart" onClick={props.onClick}>Restart</button>
    )
}
class Game extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            squares: Array(10).fill(Array(10).fill(null)),
            xIsNext: true,
            flag: false
        }
    }

    
    clickRestart(){
        const squares = Array(10).fill(Array(10).fill(null))
        this.setState({
            squares: squares,
            xIsNext: true,
            flag: false
        })
        return;
    }
    

    handleClick(i, j) {
        const squares = this.state.squares.map((arr) => arr.slice())
        const current_value = this.state.xIsNext ? 'X' : 'O';
        let flag = false;
        if(this.state.flag || squares[i][j])
            return;
        if(calculateWinter(squares, i ,j , current_value))   //If click in a value cell -> do nothing
            flag = true;
        
        //Calculate winner
        // if(calculateWinter(squares, i ,j , current_value))
        //     const winner = 

        const status = this.state.xIsNext ? 'X' : 'O';
        squares[i][j] = status;
        this.setState({
            squares: squares.map((arr) => arr.slice()),
            xIsNext: !this.state.xIsNext,
            flag: flag
        })
    }

    render() {
        const squares = this.state.squares.map(arr => arr.slice())
        const flag = this.state.flag;
        let status;

        //If had winner
        if (flag) {
            status = "Winner: " + (this.state.xIsNext ? "O" : "X");
          } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
          }
        return (
            <div className="game">
                <div className="player">{status}</div>
                <div className="game-board">
                    <Board
                        squares={squares}
                        onClick={(i,j) => this.handleClick(i,j)}
                    />
                </div>
                <Restart onClick={() => this.clickRestart()}/>
            </div>
          );
    }
}



// ReactDOM.render(
//     <Calculation />,
//     document.getElementById('root3')
// )
ReactDOM.render(
    <Game />,
    document.getElementById('root')
)
// ReactDOM.render(
//     <NameForm />,
//     document.getElementById('root2')
// )
