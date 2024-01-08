/**
 * Function that distributes cores among grids according to specific constraints.
 * 
 * @param {object[]} data - Parsed JSON object containing core information.
 * @returns {string[][]} gridData - Grid arrays containing distributed cores.
 */

function gridDistribution(data) {

    const gridData = [[], [], [], []];

    // Structure to hold Cores and repeat for specific grid
    let grid1 = {};
    let grid2 = {};
    let grid3 = {};
    let grid4 = {};

    /**  
     * Function to calculate core split number among 4 Grids if repeat is > 4 
    */
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

    /**
     * Calculates the total count of repeat in the grid.
     * 
     * Used in Function distributeCount(product, count)
     */
    function getGridCount(grid) {
        return Object.values(grid).reduce((total, count) => total + count, 0);
    }

    /**
     * Function to distribute core among 4 Grids if repeat is < 4 
    */
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

    /**
     * Loop through the JSON data for each Core
    */ 
    for (const row of data) {

        if (row.product === 'Core i4' ) { // Constraints: Core i4 products can only be placed in grids 1 and 2.
            let count = row.repeat;
            
            grid1[row.product] = Math.min(Math.ceil(count / 2), count);
            count -= grid1[row.product];

            grid2[row.product] = count;

        } else if (row.product === 'Core i5') { // Constraints: Core i5 products can only be placed in grids 1 and 2.
            let count = row.repeat;
            
            grid2[row.product] = Math.min(Math.ceil(count / 2), count);
            count -= grid2[row.product];

            grid1[row.product] = count;
            
        } else if (row.repeat >= 4) { // For cores with repeat > 4
            const count = gridSplit(row.repeat);
            grid1[row.product] = count[0];
            grid2[row.product] = count[1];
            grid3[row.product] = count[2];
            grid4[row.product] = count[3];
        
        } else if (row.repeat > 0) { // For cores with repeat < 4
            distributeCount(row.product, row.repeat);
        }
    }

    /**
     * Function to process Grid structures and create gridData which is sent to Table
    */ 
    function processGrid(grid, index) {
        
        // Fill grids with cores based on grid structure data
        while (Object.values(grid).some(count => count > 0) && gridData[index].length < 20) {
            for (const [product, count] of Object.entries(grid)) {
                if (count > 0) {
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
        
        // Add dummy 'None' slots if total is less than 80
        if (gridData[index].length !== 20) { 
            const blankRUs = 20 - gridData[index].length;
            gridData[index].push(...Array(blankRUs).fill('None'));
        }

    }

    /**
     * Function call - to Process all grids and fill gridData
    */ 
    [grid1, grid2, grid3, grid4].forEach((grid, index) => processGrid(grid, index));

    //console.log("Grids = ",gridData);
    return gridData;

}

export default gridDistribution;