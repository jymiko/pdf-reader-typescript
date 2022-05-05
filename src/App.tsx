import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Worker } from '@react-pdf-viewer/core';
import Reader from './Reader';
import HighlightExample from './Highlight';
import Epub from './Epub'

function App() {
  return (
    // <div className="App">
    <div>
      {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js"> */}
        {/* <Reader/> */}
        {/* <HighlightExample fileUrl={"https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"}/> */}
      {/* </Worker> */}
      <Epub/>
    </div>
  );
}

export default App;
