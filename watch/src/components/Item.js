import React, { useMemo } from "react";
import "./Item.css";
import del from "../otts/del.svg"
const platformSvgMapping = {
  netflix: "./otts/netflix.svg",
  amazonprime: "./otts/amazon-prime.svg",
  disneyhotstar: "./otts/disneyhotstar.svg",
  hbo: "./otts/hbo.svg",
};

const getRandomColor = () => {
  const colors = ["#EFBE78", "#B8A7F2", "#DBF9C4", "#C7F995", "#95F9ED"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const getRandomColor2 = () => {
  const color2 = ["#A7E990", "#97D2FF", "#F7B1F0", "#F8A78D", "#F88D8D"];
  const randomIndex = Math.floor(Math.random() * color2.length);
  return color2[randomIndex];
};

const getRandomEmoji = () => {
  const emojis = ["🍿", "🎬", "🎥", "🍕", "👻", "🥑", "😎", "😱", "👽", "🦄", "🐬"];
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
};

function Item(props) {
  const color = useMemo(() => getRandomColor(), []);
  const color2 = useMemo(() => getRandomColor(), []);
  const emoji = useMemo(() => getRandomEmoji(), []);
  const { id, title, streaming_service, genre, link, source } = props.movie;

  const handleRedirect = () => {
    if (link) {
      window.location.href = link;
    }
  };

  const posterStyle = {
    background: `linear-gradient(0deg, ${color} 2%, ${color2} 100%)`,
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    props.onDelete();
  };

  return (
    <div className="it" onClick={handleRedirect}>
      <div className="poster" style={posterStyle}>
        <p className="icon">{emoji}</p>
      </div>
      <div className="des">
        <div className="det">
          <p className="tit">{title}</p>
          <div className="plat">
            {streaming_service.map((platformItem, index) => (
              <div style={{ marginRight: '10px' }} key={index}>
                {platformSvgMapping[platformItem.toLowerCase()] ? (
                  <img
                    src={platformSvgMapping[platformItem.toLowerCase()]}
                    alt={`${platformItem} logo`}
                  />
                ) : (
                  <span className="ott">{platformItem}</span>
                )}
              </div>
            ))}
          </div>
          <div className="gen">
            {genre.map((genre, id) => (
              <div className="genre" key={id}>
                {genre}
              </div>
            ))}
          </div>
        </div>
        <img className="image" style={{ marginRight: '10%' }} src={del} onClick={handleDelete} />
      </div>
    </div>
  );
}

export default Item;
