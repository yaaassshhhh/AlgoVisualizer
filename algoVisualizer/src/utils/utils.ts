//for some utility functions and constants
export const ROWS = 30;
export const COLS = 50;

//the following function will create a 2D array of 30 rows and 50 columns and fill it with 0s
export const createEmptyGrid = () => {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
};

//directions for checking alive neighbours , moving in a clock wise direction
export const DIRECTIONS =[
    [0,1],//right
    [1,1],//right-diagonal-down
    [1,0],//down
    [1,-1],//left-diagonal-down
    [0,-1],//left
    [-1,-1],//left-diagonal-up
    [-1,0],//up
    [-1,1]//right-diagonal-up
]