function addMinutesToDate(date, minute) {
  return new Date(date.getTime() + minute * 60000);
}

module.exports = { addMinutesToDate };
