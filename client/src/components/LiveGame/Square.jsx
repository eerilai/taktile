import React from 'react';
import { convertCoord } from './gameUtil';

const Square = ({ game, row, col, handleSquareClick }) => {
  const squareSize = 599 / game.size;
  const color = (row % 2 !== col % 2) ? '#DEE3E6' : '#8CA2AD';
  const coord = convertCoord([col, row]);
  const stack = game.board[col][row];
  const valid = stack.validMove ? 'valid' : '';
  const origin = stack === stack.game.moveFrom ? 'origin' : '';

  const squareStyle = {
    width: squareSize,
    height: squareSize,
    'background-color': color,
  };
  const stoneSize = `${squareSize - (squareSize * 0.4)}px`;
  const stoneStyle = {
    width: stoneSize,
    height: stoneSize,
  };
  const topStyle = {
    ...stoneStyle,
    'min-height': stoneSize,
  };
  const captiveStyle = {
    ...stoneStyle,
  };
  // const selectedSize = `${stoneSize - (stoneSize * 0.5)}px`;
  // const selectedStone = {
  //   width: `${selectedSize}`,
  //   height: `${selectedSize}`,
  // };
  const selectedStyle = {
    'max-height': squareSize,
  };
  const leftMargin = squareSize - (squareSize * 0.12);
  const stackOverflowStyle = {
    'margin-left': `${leftMargin}px`,
  };

  const renderSelected = () => {
    if (coord === game.toMove.coord && game.toMove.stack) {
      return (
        <div className="selected" style={selectedStyle}>
          {game.toMove.stack.map((x, i) =>
             (i === 0 ?
               <div className={`p${x} stone top`} style={{ ...stoneStyle, ...topStyle }} /> :
               <div className={`p${x} stone captive`} style={{ ...stoneStyle, 'z-index': `${999 - i}` }} />))
          }
        </div>
      );
    }
  };

  const renderStones = () => {
    if (stack.stack.length <= game.size) {
      return (
        <div
          className={`square ${coord} ${valid} ${origin}`}
          style={squareStyle}
          onClick={() => { handleSquareClick(col, row); }}
        >
          <p className="non-flat">{` ${stack.stone} `}</p>
          {renderSelected()}
          {stack.stack.map((x, i) =>
             (i === 0 ?
               <div className={`p${x} stone top`} style={topStyle} /> :
               <div className={`p${x} stone captive`} style={{ ...captiveStyle, 'z-index': `${999 - i}` }} />))
          }
        </div>
      );
    } else if (stack.stack.length > game.size) {
      const top = stack.stack.slice(0, game.size);
      const rest = stack.stack.slice(game.size);
      return (
        <div
          className={`square ${coord} ${valid}`}
          style={squareStyle}
          onClick={() => { handleSquareClick(col, row); }}
        >
          <p className="non-flat">{` ${stack.stone} `}</p>
          {renderSelected()}
          {top.map((x, i) =>
             (i === 0 ?
               <div className={`p${x} stone top`} style={topStyle} /> :
               <div className={`p${x} stone captive`} style={{ ...captiveStyle, 'z-index': `${999 - i}` }} />))
          }
          <div className="stack-overflow" style={stackOverflowStyle}>
            {rest.map(x => <div className={`p${x} stone overflow-stone`} />)}
          </div>
        </div>
      );
    }
    return <div>Error rendering stones</div>;
  };

  return (
    renderStones()
  );
};

export default Square;
