import React, { useEffect, useState } from 'react';
import Parser from 'rss-parser';

const RSS_URL = 'https://www.zythopedia.eu/feed';

function App() {
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const parser = new Parser();
    (async () => {
      try {
        const feed = await parser.parseURL(RSS_URL);
        setItems(feed.items || []);
      } catch (err) {
        console.error('RSS Fetch error:', err);
      }
    })();
  }, []);

  const toggleFavorite = (item) => {
    const exists = favorites.find(f => f.link === item.link);
    const updated = exists
      ? favorites.filter(f => f.link !== item.link)
      : [...favorites, item];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Zythopedia RSS Feed</h1>
      <h2>Αγαπημένα</h2>
      {favorites.map((item, idx) => (
        <div key={idx}>
          <a href={item.link} target="_blank" rel="noreferrer">{item.title}</a>
          <button onClick={() => toggleFavorite(item)}>Αφαίρεση</button>
        </div>
      ))}
      <h2>Όλα τα άρθρα</h2>
      {items.map((item, idx) => (
        <div key={idx}>
          <a href={item.link} target="_blank" rel="noreferrer">{item.title}</a>
          <button onClick={() => toggleFavorite(item)}>
            {favorites.find(f => f.link === item.link) ? 'Αφαίρεση' : 'Αγαπημένο'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;