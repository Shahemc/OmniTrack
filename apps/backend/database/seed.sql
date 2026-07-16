INSERT INTO users (username) VALUES ('demo');

INSERT INTO entries (user_id, mal_id, media_type, title, image_url, total_units, progress, status, prestige_count)
VALUES
  (1, 20, 'anime', 'Naruto', 'https://cdn.myanimelist.net/images/anime/1141/142503.jpg', 220, 220, 'completed', 1),
  (1, 21, 'anime', 'One Piece', 'https://cdn.myanimelist.net/images/anime/1244/138851.jpg', NULL, 1090, 'in_progress', 0),
  (1, 13, 'manga', 'One Piece', 'https://cdn.myanimelist.net/images/manga/2/253146.jpg', NULL, 1100, 'in_progress', 0);