const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const getAllPhotos = async (client, photoNum) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Photo" p
    WHERE is_deleted = FALSE
      ORDER BY created_at DESC
      LIMIT 10 OFFSET $1
    `,
    [photoNum],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getPhotosByStyle = async (client, styleId, photoNum) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      LEFT JOIN "User" u ON p.user_id = u.id
      WHERE f.style_id = $1
      AND p.is_deleted = FALSE
      ORDER BY p.created_at DESC
      LIMIT 10 OFFSET $2
    `,
    [styleId, photoNum],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getPhotosByFilm = async (client, filmId, photoNum) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Photo" p
    WHERE film_id = $1
      AND is_deleted = FALSE
      ORDER BY created_at DESC
      LIMIT 10 OFFSET $2
    `,
    [filmId, photoNum],
  );
  return convertSnakeToCamel.keysToCamel(rows);
}

const getPhotosByUser = async (client, userId, photoNum) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Photo" p
    WHERE user_id = $1
      AND is_deleted = FALSE
      ORDER BY created_at DESC
      LIMIT 10 OFFSET $2
    `,
    [userId, photoNum],
  );
  return convertSnakeToCamel.keysToCamel(rows);
}


const getPhotoByStudio = async (client, studioId, photoNum) => {
  const { rows } = await client.query(
    `
    SELECT id, image_url FROM "Photo" p
    WHERE studio_id = $1
      AND is_deleted = FALSE
      ORDER BY created_at DESC
      LIMIT 10 OFFSET $2
    `,
    [studioId, photoNum],
  );
  return convertSnakeToCamel.keysToCamel(rows);
}

module.exports = { getAllPhotos, getPhotosByStyle, getPhotosByFilm, getPhotoByStudio, getPhotosByUser };
