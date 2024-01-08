import Header from './components/Header';
import GenerateTable from './components/GenerateTable';
import gridDistribution from './algorithm/GridDistribution';
import './App.css';

function App() {

const jsonData = require('./dataset.json'); // JSON filename
//console.log("data from JSON = ", jsonData);

/**  
 * Get the Grid distributed data from Algorithm  
*/
const gridData = gridDistribution(jsonData);
//console.log("gridData = ", gridData);

  return (
    <div >
      <Header />
      <GenerateTable gridData={gridData} />
    </div>
  );
}

export default App;
