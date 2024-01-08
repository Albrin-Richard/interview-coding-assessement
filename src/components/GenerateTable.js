import { useState } from 'react';
import '../App.css';

const GenerateTable = ({ gridData }) => {
 
//console.log("received gridData = ", gridData);
const headers = ['GridL', 'DiodeL', 'UnmaskL', 'RU#L', 'Seat-UUID-1', ' ', 'Seat-UUID-2', 'RU#R', 'UnmaskR', 'DiodeR', 'GridR', 'br', 'I/o']; // Define the column headers

const gridRows = 20; // Number of rows before and after the "MID WAY" row
const totalRows = gridRows * 2; // Total number of rows
const flattenedGridData = gridData.flat();


// Create state to handle cell color
const [diodeCellColor, setDiodeCellColor] = useState('white');
const [unmaskCellColor, setUnmaskCellColor] = useState('white');

const handleDiodeCellClick = (rowIndex) => {
    // Toggle Diode cell color on click for a specific row index
    setDiodeCellColor((prevColors) => {
      const updatedColors = [...prevColors];
      updatedColors[rowIndex] = updatedColors[rowIndex] === 'white' ? 'blue' : 'white';
      return updatedColors;
    });

    console.log("Diode clicked = ", rowIndex);
  };

const handleUnmaskCellClick = (coreNumber) => {
    console.log(`Core selected = Core i${coreNumber}`);
    setUnmaskCellColor((prevColors) => {
        const updatedColors = [...prevColors];
        flattenedGridData.forEach((rowData, index) => {
            //console.log("row data = ", rowData, "index = ", index);
            
            const core = parseInt(rowData.split('Core i')[1]);
            if (core === coreNumber) {
                updatedColors[index] = updatedColors[index] === 'white' ? 'yellow' : 'white';
                }
            });
        return updatedColors;
    });
  };


  function getColorForNumber(number) {
    const r = (number * 70 + 70) % 256;
    const g = (number * 50 + 50) % 256;
    const b = (number * 110 + 110) % 256;
  
    const toHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
  
    const color = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return color.toUpperCase(); // To ensure the color is in uppercase
  }

// Create an array to represent the placeholder rows before and after "MID WAY"
const placeholderRows = Array.from({ length: gridRows }).map((_, index) => {
    

    const rowData = {
        'GridL': '',
        'DiodeL': '',
        'UnmaskL': '',
        'RU#L': index,
        'Seat-UUID-1': '',
        'Seat-UUID-2': '',
        'RU#R': index + gridRows,
        'UnmaskR': '',
        'DiodeR': '',
        'GridR': '',
      };
    return rowData;
  });

const colorMap = {}; // Map to store colors for each core


 return (
    <div className="table-container"> 
      
      <table>
        <colgroup>
          {headers.map((header, index) => (
            <col key={index} style={{ width: header.startsWith('Seat-UUID') ? 'auto' : '1%' }} />
          ))}
        </colgroup>
        <thead>
            <tr>
                <th colSpan={11} className='horizontal-header' >TAPE-IN DB VIEW</th>
            </tr>
            <tr>
                {headers.map((header, index) => { 
                 let columnSpan = 1;
   
                if (header === 'Seat-UUID-1') {
                   columnSpan = 3;
    
                 } else if (header === 'Seat-UUID-2' || header === ' '  || header === 'br'  || header === 'I/o') {
                   // Skip rendering Seat-UUID-2
                   return null;
                 } 
   
                 return (
                   <th
                     key={index}
                     colSpan={columnSpan}
                     className={
                       header.startsWith('Seat-UUID')
                         ? 'horizontal-header'
                         : 'vertical-header'
                     }
                   >
                    {header === 'RU#L' ? 'RU#' : header === 'RU#R' ? 'RU#' : header === 'Seat-UUID-1' ? 'Seat-UUID' : 
                        header === 'GridL' ? 'Grid' : header === 'GridR' ? 'Grid' : 
                        header === 'DiodeL' ? 'Diode' : header === 'DiodeR' ? 'Diode' : 
                        header === 'UnmaskL' ? 'Unmask' : header === 'UnmaskR' ? 'Unmask' : header}
                </th>
                 );
                
                })}
                
            </tr>
            
        </thead>
        <tbody>
          {/* Render 20 rows before "MID WAY" */}
          {placeholderRows.map((row, index) => (  
            
            

            <tr key={index}>
                {headers.map((header, idx) => {
                if (header === 'GridL' && index === 0) {
                    return (
                      <td key={idx} rowSpan={gridRows} style={{ backgroundColor: getColorForNumber(6) }} className="grid-col">{1}</td>
                    );
                } else if (header === 'GridR' && index === 0) {
                    return (
                      <td key={idx} rowSpan={gridRows} style={{ backgroundColor: getColorForNumber(11) }}className="grid-col">{2}</td>
                    );
                } else if (header === 'GridL' || header === 'GridR') {
                    return null; // Skip rendering 'GridL' and 'GridR' in other rows
                } else if (header === 'DiodeL') {
                    return (
                        <td
                          key={idx}
                          onClick={() => handleDiodeCellClick(row['RU#L'])}
                          style={{
                            backgroundColor: diodeCellColor[row['RU#L']] === 'white' ? 'blue' : '',
                          }}
                        >
                        </td>
                      );
                } else if (header === 'DiodeR') {
                    return (
                        <td
                          key={idx}
                          onClick={() => handleDiodeCellClick(row['RU#R'])}
                          style={{
                            backgroundColor: diodeCellColor[row['RU#R']] === 'white' ? 'blue' : '',
                          }}
                        >
                        </td>
                      );
                } else if (header === 'UnmaskL') {
                    const coreNum = parseInt(gridData[0][index].split('Core i')[1]);
                    //console.log("CoreNum data = ", coreNum);
                    return (
                        <td
                          key={idx}
                          onClick={() => handleUnmaskCellClick(coreNum)}
                          style={{
                            backgroundColor: unmaskCellColor[row['RU#L']] === 'white' ? 'Yellow' : '',
                          }}
                        >
                        </td>
                      );
                } else if (header === 'UnmaskR') {
                    const coreNum = parseInt(gridData[1][index].split('Core i')[1]);
                    //console.log("CoreNum data = ", coreNum);
                    return (
                        <td
                          key={idx}
                          onClick={() => handleUnmaskCellClick(coreNum)}
                          style={{
                            backgroundColor: unmaskCellColor[row['RU#R']] === 'white' ? 'Yellow' : '',
                          }}
                        >
                        </td>
                      );
                } else if (header === 'Seat-UUID-1' ) {

                    const core = parseInt(gridData[0][index].split('Core i')[1]);; // Core number from Core i#
                    //console.log(gridData[0][index], "Core is = ", core);

                    const color = colorMap[core] || (colorMap[core] = getColorForNumber(core)); // Get or set color for the core
                    //console.log("Color for row", index, " is = ", color);
            
                    return <td key={idx} style={{ backgroundColor: color }}>{gridData[0][index]}</td>;
                
                } else if (header === 'Seat-UUID-2' ) {

                    const core = parseInt(gridData[1][index].split('Core i')[1]);; // Core number from Core i#
                    //console.log(gridData[1][index], "Core is = ", core);

                    const color = colorMap[core] || (colorMap[core] = getColorForNumber(core)); // Get or set color for the core
                    //console.log("Color for row", index, " is = ", color);
            
                    return <td key={idx} style={{ backgroundColor: color }}>{gridData[1][index]}</td>;
                
                } else if (header === 'I/o' && index === 0) {
                    return <td key={idx} rowSpan={41}  className="mid-way-row">I/Os</td>;
                    
                } else if (header === 'br') {
                    return <th key={idx} style={{ border: 'none' }}></th>; // Hide border for the first 4 columns
                } else if (header === 'I/o') {
                    return null; // Hide border for the first 4 columns
                } else if (header !== 'Grid') {
                    return <td key={idx}>{row[header]}</td>;
                    
                }
                    
                return null;

                
                })}
          </tr>
          ))}
          {/* Row spanning the whole table */}
          <tr>
            <td colSpan={11} className="mid-way-row">MID HALF</td>
          </tr>
          {/* Render 20 rows after "MID WAY" */}
          {placeholderRows.map((row, index) => (
            <tr key={index + totalRows + 1}>
              {headers.map((header, idx) => {
                if (header === 'GridL' && index === 0) {
                    return (
                      <td key={idx} rowSpan={gridRows} style={{ backgroundColor: getColorForNumber(16) }} className="grid-col">{3}</td>
                    );
                } else if (header === 'GridR' && index === 0) {
                    return (
                      <td key={idx} rowSpan={gridRows} style={{ backgroundColor: getColorForNumber(21) }} className="grid-col">{4}</td>
                    );
                } else if (header === 'GridL' || header === 'GridR') {
                    return null; // Skip rendering 'GridL' and 'GridR' in other rows
                } else if (header === 'RU#L') {
                    return <td key={idx}>{row[header] + totalRows}</td>;
                } else if (header === 'RU#R') {
                    return <td key={idx}>{row[header] + totalRows}</td>;
                } else if (header === 'Seat-UUID-1' ) {

                    const core = parseInt(gridData[2][index].split('Core i')[1]);; // Core number from Core i#
                    //console.log(gridData[2][index], "Core is = ", core);

                    const color = colorMap[core] || (colorMap[core] = getColorForNumber(core)); // Get or set color for the core
                    //console.log("Color for row", index, " is = ", color);
            
                    return <td key={idx} style={{ backgroundColor: color }}>{gridData[2][index]}</td>;
                
                } else if (header === 'Seat-UUID-2' ) {

                    const core = parseInt(gridData[3][index].split('Core i')[1]);; // Core number from Core i#
                    //console.log(gridData[3][index], "Core is = ", core);

                    const color = colorMap[core] || (colorMap[core] = getColorForNumber(core)); // Get or set color for the core
                    //console.log("Color for row", index, " is = ", color);
            
                    return <td key={idx} style={{ backgroundColor: color }}>{gridData[3][index]}</td>;
                
                } else if (header === 'DiodeL') {
                    return (
                        <td
                          key={idx}
                          onClick={() => handleDiodeCellClick(row['RU#L'] + totalRows)}
                          style={{
                            backgroundColor: diodeCellColor[row['RU#L'] + totalRows] === 'white' ? 'blue' : '',
                          }}
                        >
                        </td>
                      );
                  } else if (header === 'DiodeR') {
                    return (
                        <td
                          key={idx}
                          onClick={() => handleDiodeCellClick(row['RU#R'] + totalRows)}
                          style={{
                            backgroundColor: diodeCellColor[row['RU#R'] + totalRows] === 'white' ? 'blue' : '',
                          }}
                        >
                        </td>
                      );
                  } else if (header === 'UnmaskL') {
                    const coreNum = parseInt(gridData[2][index].split('Core i')[1]);
                    //console.log("CoreNum data = ", coreNum);
                    return (
                        <td
                          key={idx}
                          onClick={() => handleUnmaskCellClick(coreNum)}
                          style={{
                            backgroundColor: unmaskCellColor[row['RU#L'] + totalRows] === 'white' ? 'Yellow' : '',
                          }}
                        >
                        </td>
                      );
                } else if (header === 'UnmaskR') {
                    const coreNum = parseInt(gridData[3][index].split('Core i')[1]);
                    //console.log("CoreNum data = ", coreNum);
                    return (
                        <td
                          key={idx}
                          onClick={() => handleUnmaskCellClick(coreNum)}
                          style={{
                            backgroundColor: unmaskCellColor[row['RU#R'] + totalRows] === 'white' ? 'Yellow' : '',
                          }}
                        >
                        </td>
                      );
                } else if (header === 'br') {
                    return <th key={idx} style={{ border: 'none' }}></th>; // Hide border for the first 4 columns
                } else if (header === 'I/o') {
                    return null; // Hide border for the first 4 columns
                }else if (header !== 'Grid') {
                    //console.log(colorMap);
                    return <td key={idx}>{row[header]}</td>;
                }

                return null;
                })}
            </tr>

            
          ))}

        {/* MISC BLOCK Row spanning the Seat-UUID */}
        <tr>
            {headers.map((header, index) => {
                if (index === 5 || index === 6) {
                    // Skip rendering 
                    return null;
                } else if (index !== 4) {
                    return <th key={index} style={{ border: 'none' }}></th>; // Hide border for the first 4 columns
                }else {
                    return <th key={index} colSpan={3} className="mid-way-row"> MISC BLOCK </th>; // Hide border for the first 4 columns 
                }
            })}
        </tr>

        </tbody>
      </table>
    </div>
 );
};

export default GenerateTable



