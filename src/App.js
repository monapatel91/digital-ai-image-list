import './imageList.css'
import { ImageList, ImageListItem, Container, Paper, Zoom, Button } from '@material-ui/core';
import { useState,useEffect } from 'react';


function App() {
  
  let [imgList,setImgList] = useState([]);
  let [bottomScrolled,setBottomScrolled] = useState(false);
  let [displayImg, setDisplayImg] = useState('');
  let [imgId, setImgId] = useState(0);
  
  useEffect(() => {
    fetch("https://picsum.photos/v2/list")
      .then(res => res.json())
      .then(
        (result) => {
          setImgList(result);
        },
        (error) => {
          console.log('apiError', error);
        }
      )
  },[]);
  
  function getImg(e) {
    setDisplayImg(e.target.src);
  }
  function clearImg() {
    setDisplayImg('');
  }
  function addNewImg(e){
    setImgId(++imgId);
    let reader = new FileReader();
    let file  = e.target.files[0];
    file && reader.readAsDataURL(file);
    reader.onloadend = () => {
        const addNewUrl = {"id": `selfUploaded${imgId}` , "download_url" : reader.result}
        setImgList(imgList => imgList.concat(addNewUrl));
    }
  }
  function handelOnCroll(e){
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !bottomScrolled) {
      fetch("https://picsum.photos/v2/list?page=2&limit=30")
        .then(res => res.json())
        .then(
          (result) => {
          setImgList(imgList => imgList.concat(result));
        },
        (error) => {
          console.log('apiError', error);
        }
      )
      setBottomScrolled(true)
    }
  } 
  return (
    <Container>
      <h1>Image list</h1>
      {!displayImg && <div className="uploadBtnWrapper">
        <input
          accept="image/*"
          id="contained-button-file"
          multiple
          type="file"
          onChange={(e) => addNewImg(e)}        
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span">
            Upload
          </Button>
        </label>
      </div>}
      <ImageList  tabIndex="0" className={`imageList ${displayImg ? 'imgListOpacity' : ''}`} rowHeight={160} cols={4} onScroll={(e) => handelOnCroll(e)}>
        {imgList.map((item) => (
          <ImageListItem key={item.id}>
            <img src={item.download_url} alt={item.author} onClick={(e) => getImg(e)} />
          </ImageListItem>
        ))}
      </ImageList>
      { /* only display the comp when img is clicked */}
      {displayImg && <Zoom in={true}>
          <Paper elevation={4} className="imgDetailsWrapper">
            <Button variant="contained" color="primary" onClick={() => clearImg()}>Close</Button>
            <img className="fullImg" src={displayImg} alt="" />
          </Paper>
        </Zoom>}
    </Container>
  );
}

export default App;
