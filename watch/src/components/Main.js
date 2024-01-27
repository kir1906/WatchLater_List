import React, { useState, useEffect } from 'react';
import './Main.css';
import Item from './Item.js';
import makeAnimated from 'react-select/animated';
import CreatableSelect from 'react-select/creatable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import NULL from '../otts/NULL.svg'
import Loader from "./Loader.js"
// import Loader from '../components/Loader.js';
const animatedComponents = makeAnimated();

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #312651',
    borderRadius: '4px',
    boxShadow: state.isFocused ? '0 0 0 1px #007bff' : 'none',
    '&:hover': {
      border: '1px solid #007bff',
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    // backgroundColor: '#ffff',
    color: '#321651',
    border: '1px solid #312651',
    borderRadius:'15px',

  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#321651',
    ':hover': {
      backgroundColor: '#838383',
      borderRadius:'15px',
    },
  }),
};

function Main() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', streamingService: '', genre: '', link: '', source: '' });
  const genreOption = [
    { value: 'action', label: 'Action' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'drama', label: 'Drama' },
    {value:'thriller',label:'Thriller'},
    {value:'sci-fi',label:'Science Fiction'},
    {value:'romance',label:'Romance'},
    {value:'adventure',label:'Adventure'},
    {value:'horror',label:'Horror'},
    {value:'mystery',label:'Mystery'},
    {value:'fantasy',label:'Fantasy'},
  ];
  const ottoption = [
    { value: 'netflix', label: 'Netflix' },
    { value: 'amazonprime', label: 'Amazon-Prime' },
    {value:'disneyhotstar',label: 'Disney+Hotstar'},
    {value:'sonyliv',label:'Sonyliv'},
    {value:'hbo',label:'HBO'},
  ];
  const logout = () => {
    Cookies.remove('jwt');
    navigate('/');
  };
  const toggleModal = () => {
    setModal(!modal);
    setFormData({
          title: '',
          streamingService: '',
          genre: '',
          link: '',
          source: '',
        });
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('https://watch-later.onrender.com/watchlist',{
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });
      const data = await response.json();

      setWatchlist(data.watchlist);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const getAuthToken = () => {
    return Cookies.get('jwt');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
    const token = getAuthToken();
      const response = await fetch('https://watch-later.onrender.com/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          ...formData,
          genre: formData.genre.map(option => option.value),
          streamingService: formData.streamingService.map(option => option.value),
        }),
      });
  
      if (response.ok) {
        fetchWatchlist();
        toggleModal();
        setFormData({
          title: '',
          streamingService: '',
          genre: '',
          link: '',
          source: '',
        });
      } else {
        console.error('Error adding watchlist item:', response.statusText);
        toast.error('Error adding watchlist item');
      }
    } catch (error) {
      console.error('Error adding watchlist item:', error);
      toast.error('Error adding watchlist item');
    }
  };
  const handleDelete = async (id) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`https://watch-later.onrender.com/watchlist/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${token}`,
        },
      });
  
      if (response.ok) {
        fetchWatchlist();
      } else {
        console.error('Error deleting watchlist item:', response.statusText);
        toast.error('Error deleting watchlist item');
      }
    } catch (error) {
      console.error('Error deleting watchlist item:', error);
      toast.error('Error deleting watchlist item');
    }
  };
    

  const cards = watchlist && watchlist.length > 0 ? (
    watchlist.map((item) => <Item key={item.id} movie={item} onDelete={() => handleDelete(item.id)} />)
  ) : (
    <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
    <img style={{width:'20%',marginTop:'20vh'}}src={NULL}/>
    <p className='emp'>List is Empty!!</p>
    </div>
  );
  
  return (
    <div className='main'>
      <div className='he'>
        <p className='ti'>Watch List</p>
        <div className='butt'>
        <button className='bu' onClick={toggleModal}>
          Add
        </button>
        <button className='lo' onClick={logout}>
          Logout
        </button>
        </div>
      </div>

      {modal && (
        <div className="modal"  onClick={toggleModal}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleFormChange} />
              <label>Streaming Service:</label>
              <CreatableSelect name="streamingService" value={formData.streamingService} options={ottoption} components={animatedComponents}
              onChange={(selectedOptions) => handleFormChange({ target: { name: 'streamingService', value: selectedOptions } })}
             isMulti styles={customStyles}/>
              <label>Genre</label>
              <CreatableSelect name="genre" value={formData.genre} options={genreOption} components={animatedComponents}
              onChange={(selectedOptions) => handleFormChange({ target: { name: 'genre', value: selectedOptions } })}
             isMulti styles={customStyles}/>
              <label>Link</label>
              <input type="text" name="link" value={formData.link} onChange={handleFormChange} />
              <label>Source</label>
              <input type="text" name="source" value={formData.source} onChange={handleFormChange} />
              <button className='sub' type="submit">Submit</button>
              <button className="close" onClick={toggleModal}>Close</button>
            </form>
          </div>
        </div>
      )}
      {loading ? (
        
        <Loader/>
      ) : (
        <section className='arr'>{cards}</section>
      )}
      <ToastContainer/>
    </div>
  );
}

export default Main;
