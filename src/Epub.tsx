import { useRef } from 'react'
import {
  ReactEpubViewer
} from 'react-epub-viewer'

const Epub = () => {
  const viewerRef = useRef(null);
  
  return (
    <div style={{ position: "relative", height: "100%" }}>

      <ReactEpubViewer 
        url={'https://altmshfkgudtjr.github.io/react-epub-viewer/files/Alices%20Adventures%20in%20Wonderland.epub'}
        ref={viewerRef}
        // viewerLayout={600}
      />
    </div>
  );
}

export default Epub