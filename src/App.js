import React from "react";
import ReactDOM from "react-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {

  const [searchTerm, setSearchTerm] = React.useState("");
  const [imageArray, setImageArray] = React.useState([]);
  const [suggestions, setSuggestions] = React.useState([]);
  const [displaySuggestions, setDisplaySuggestions] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const loadImages = (value) => {
    let imageId = 0;
    const API_KEY = 'dfaa04119e63e9cd6a4649f2824add0d';
    const API_ENDPOINT = searchTerm === "" ?
      `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&text=nature&format=json&nojsoncallback=1`
      : `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&text=${value}&format=json&nojsoncallback=1`

    fetch(API_ENDPOINT).then((response) => {
      return response.json().then((json) => {
        let images = [];
        json.photos.photo.map((item) => {
          let srcPath = `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`;
          imageId += 1;
          images.push({ 'id': imageId, 'src': srcPath });
        });
        setImageArray(images);
      });
    });
  };

  const handleChange = (event) => {
    let value = event.target.value;
    if (value.toString().trim()) {
      setSearchTerm(event.target.value);
    } else {
      setSearchTerm("");
    }
  };

  const handleSuggestioninLocal = (value) => {
    setOpen(true);
    let temp = [];
    let uniqueArray = [];
    if (value) {
      if (searchTerm.trim() !== "") {
        suggestions.push(searchTerm);
        sessionStorage.setItem("suggestions", JSON.stringify(suggestions));
        temp = JSON.parse(sessionStorage.getItem("suggestions"));
        uniqueArray = [...new Set(temp)];
        setDisplaySuggestions(uniqueArray);
        setSuggestions(suggestions);
      }
    } else {
      setDisplaySuggestions([]);
      setSuggestions([]);
      setSearchTerm("");
      setOpen(false);
      loadImages("nature");
    }
  };

  React.useEffect(() => {
    loadImages("nature");
  }, []);

  return (
    <>
      <div class="inputControls">
        <label class="labelText">Search Photos</label>
        <div class="containerClass">
          <input class="inputLabel" type="text" value={searchTerm} onChange={handleChange} onClick={() => handleSuggestioninLocal(true)} />
          <div class="icon" onClick={() => loadImages(searchTerm)}>🔍</div>
        </div>
        {open ?
          <div class="suggestionBox">
            {displaySuggestions.map(item => {
              return (
                <div class="eachSuggestion" onClick={() => loadImages(item)}>🕑 {item}</div>
              )
            })}
            <button type="button" class="btn btn-warning" style={{display: 'flex', float: 'right', marginTop: '5px', outline: 'none'}}
              onClick={() => handleSuggestioninLocal(false)}>Clear</button>
          </div> : ""}
      </div>
      {imageArray.length > 0 ?
      <div class="imageContainer">
        {imageArray.map(item => {
          return (
            <div class="col-lg-4 col-sm-6 mb-4" style={{ textAlign: 'center' }}>
              <div class="card h-100" style={{ padding: '30px' }}>
                <img class="img" alt="Couldn't load Pic" src={item.src} width="320" height="240"></img>
              </div>
            </div>
          )
        })}</div> :
        searchTerm.trim().length > 0 ? <div class="invalidInput">Sorry, couldn't find any image.</div> :
          <div class="invalidInput">Loading Images...</div>}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));


export default App;
