
function gridDistribution(data) {

    //const data = [ ...Data ]; // Create a copy of the original row object

    //console.log("JSON data = ", data);
    const gridData = [[], [], [], []];

    // Structure to hold Cores and repet for specific grid
    let grid1 = {};
    let grid2 = {};
    let grid3 = {};
    let grid4 = {};

    function gridSplit(count) {
    const gridCountList = [];

    gridCountList.push(Math.min(Math.ceil(count / 4), count));
    gridCountList.push(Math.min(Math.ceil(count / 4), count));

    count -= gridCountList[0];
    count -= gridCountList[1];

    gridCountList.push(Math.min(Math.ceil(count / 2), count));
    count -= gridCountList[2];

    gridCountList.push(count);

    //console.log("The List is =", gridCountList);
    return gridCountList;
    }



    function getGridCount(grid) {
    return Object.values(grid).reduce((total, count) => total + count, 0);
    }

    function distributeCount(product, count) {
    if (getGridCount(grid1) < 20 && count > 0) {
        grid1[product] = 1;
        count -= 1;
    }
    if (getGridCount(grid2) < 20 && count > 0) {
        grid2[product] = 1;
        count -= 1;
    }
    if (getGridCount(grid3) < 20 && count > 0) {
        grid3[product] = 1;
        count -= 1;
    }
    if (getGridCount(grid4) < 20 && count > 0) {
        grid4[product] = count;
    }
    }

    // Loop through the data
    for (const row of data) {

        if (row.product === 'Core i4' ) {
            let count = row.repeat;
            
            grid1[row.product] = Math.min(Math.ceil(count / 2), count);
            count -= grid1[row.product];

            grid2[row.product] = count;
            
        } else if (row.product === 'Core i5') {
            let count = row.repeat;
            
            grid2[row.product] = Math.min(Math.ceil(count / 2), count);
            count -= grid2[row.product];

            grid1[row.product] = count;
            
        } else if (row.repeat >= 4) {
            const count = gridSplit(row.repeat);
            grid1[row.product] = count[0];
            grid2[row.product] = count[1];
            grid3[row.product] = count[2];
            grid4[row.product] = count[3];
        
        } else if (row.repeat > 0) {
            distributeCount(row.product, row.repeat);
            //row.repeat -= 1;
        }
    }

    function processGrid(grid, index) {
        while (Object.values(grid).some(count => count > 0) && gridData[index].length < 20) {
            for (const [product, count] of Object.entries(grid)) {
                if (count > 0) {
                    //console.log(product);

                    // Check if previous RU is same as current to prevent continious placement
                    if (gridData[index].length > 0 && gridData[index][gridData[index].length - 1] === product) {
                        gridData[index].push('None');
                      }
              
                    if (gridData[index].length < 20) {
                        gridData[index].push(product);
                        grid[product] -= 1;
                    }
                      
                    } else {
                      grid[product] = 0;
                    }

                    
                }
            }
        
        
        // Add None slots if total is less than 80
        if (gridData[index].length !== 20) { // 

            const blankRUs = 20 - gridData[index].length;
            gridData[index].push(...Array(blankRUs).fill('None'));
        }

    }

    // Process all grids
    [grid1, grid2, grid3, grid4].forEach((grid, index) => processGrid(grid, index));

    //console.log("Grids = ",gridData);

    return gridData;

}

export default gridDistribution;