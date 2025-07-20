const isTimeExpired = (createdAt, durationInMili) => {
  const now = Date.now();
  const createdAtMili = new Date(createdAt).getTime();

  return createdAtMili + durationInMili < now;
};

module.exports = { isTimeExpired };
