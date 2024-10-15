import { useCallback, useEffect, useRef, useState } from "react";
import { COLS, createEmptyGrid, DIRECTIONS, ROWS } from "./utils/utils";
import { twMerge } from "tailwind-merge";
import PlayPauseBtn from "./components/PlayPauseBtn";
import Button from "./components/Button";
import SelectDropDown from "./components/SelectDropDown";

function App() {
  // in the following grid state if the cell is alive, it will be 1, if it is dead, it will be 0
  // instead of intializing the frid with nothing we provide a 2d array made with the help of a custom utilty function that return a 2D grid , the grid will be a 2D array of 30 rows and 50 columns

  const [grid, setGrid] = useState<number[][]>(createEmptyGrid());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMouseDown , setIsMouseDown] = useState(false);
  const [speed , setSpeed] = useState(100);
  
  const getGridSize = () => {
    const size = Math.min(
      (window.innerWidth - 32) / COLS,
      (window.innerHeight - 200) / ROWS,
      25
    )
    return size;
  }
  const[cellSize , setCellSize] = useState(getGridSize());
  useEffect(() => {
    const handleResize =() => {
      setCellSize(getGridSize());
    }

    window.addEventListener('resize' , handleResize);

    return () => {
      window.removeEventListener('resize' , handleResize);
    }
  } , [])
  // playingRef is a ref object with an initial value of isPlaying.
  // playingRef.current will be set to the current value of isPlaying.
  // We can update playingRef.current without causing the component to re-render.
  
  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;
  const speedRef = useRef(speed);
  speedRef.current = speed;
  //we are using useCallback to memoize the function so that it does not get recreated on every render and will obviously will only be re-created when the dependencies change
  const runGameOfLife = useCallback(() => {
    if(!playingRef.current){
      return;
    }

    setGrid((currGrid) => {
      //deep copying the current grid, so that the modifications to the new grid do not affect the original grid's data and this is essential for mutable data handling in react stae updates
      const newGrid = currGrid.map((arr) => [...arr]);

      for(let rows = 0 ; rows < ROWS ; rows++){
        for(let cols = 0 ; cols < COLS ; cols++){
          let livingNeighbours = 0;

          DIRECTIONS.forEach(([x,y]) => {
            const neighbourRow = rows + x;
            const neighbourCol = cols + y;
//neighbours should be inside the grid
            if(neighbourRow >= 0 && neighbourRow < ROWS && neighbourCol >=0 && neighbourCol < COLS){
              livingNeighbours += currGrid[neighbourRow][neighbourCol];
            }
          })
//conway's game rules
          if(livingNeighbours < 2 || livingNeighbours > 3){
            newGrid[rows][cols] = 0;
          } else if(currGrid[rows][cols] === 0 && livingNeighbours === 3){
            newGrid[rows][cols] = 1;
          }
        }
      }
      return newGrid;
    })

    setTimeout(runGameOfLife, speedRef.current);
  } , [setGrid]);

  const handleMouseDown = () => {
    setIsMouseDown(true);
  }

  const handleMouseUp = () => {
    setIsMouseDown(false);
  }

  const toggleCellState = (row : number , col : number) => {

    const newGrid = grid.map((rows , rowIndex) =>
    rows.map((cell , colIndex) => 
      rowIndex === row && colIndex === col ? (cell ? 0 : 1) : cell
    )
    )
    setGrid(newGrid);
  }

  const handleMouseEnter = (row : number , col : number) => {
    if(isMouseDown){
      toggleCellState(row , col);
    }
  }

  return (
    <div className="h-screen w-screen flex items-center p-4 flex-col gap-4 relative ">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
      <h1 className="md:text-2xl text-xl text-white">Conway's Game of Life</h1>
      <div className="flex gap-4 items-center">
        <PlayPauseBtn
          isPlaying = {isPlaying} 
          onClick={() => {
            setIsPlaying(!isPlaying);
            if (!isPlaying) {
              playingRef.current = true;
              //we will run our simulation
              runGameOfLife();
            }
          }}
        />
        <Button
        onClick = {() => {
          const rows = [];
          for(let i = 0 ;  i < ROWS ; i++){
            rows.push(Array.from(Array(COLS), () => (Math.random() > 0.75 ? 1 : 0)));
          }
          setGrid(rows);
        }}
        >
          Seed
        </Button>
        <Button
        onClick={() => {
          setGrid(createEmptyGrid());
          setIsPlaying(false);
        }}
        >
          Clear
        </Button>
        <SelectDropDown
        label="Speed Selector"
        value = {speed}
        onChange={(e) => setSpeed(parseInt(e.target.value))}
        >
          <option className="rounded-full" value={1000}> Slow </option>
          <option className="rounded-full" value={500}> Medium </option>
          <option className="rounded-full" value={100}> Fast </option>
          <option className="rounded-full" value={25}> Lightning </option>
        </SelectDropDown>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`,
        }}
      >
        {grid.map((rows, originalRowIdx) =>
          rows.map((col, originalColIdx) => (
            <button
            onClick = {() => toggleCellState(originalRowIdx , originalColIdx)}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={() => handleMouseEnter(originalRowIdx , originalColIdx)}
              key={`${originalRowIdx}-${originalColIdx}`}
              className={twMerge(
                "border border-[#9050e9]",
                col
                  ? "bg-[#ad7bee]"
                  : "bg-[#240643]"
              )}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;

//in the return statement we are mapping over the grid state and for each cell we are creating a button element
//rows is the current row Array of the grid and originalRowIdx is the index of the row in the grid
//col is the value stored in that cell of the grid and originalColIdx is the index of the column in the grid

//in the 2nd div we are using style instead of className because we want the grid spacing to be dynamic  depending upon the screen size , Now tailwind generates its CSS classes at build time i.e, all the utily classes and predefined and we can not include dynamic and thus we cannot use tailwind classes to make the grid dynamic in run time , so we use style prop to make the grid dynamic
