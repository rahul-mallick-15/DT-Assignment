const router = require("express").Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");

router.route("/").get(getEvents).get(getEventById).post(createEvent);
router.route("/:id").put(updateEvent).delete(deleteEvent);

module.exports = router;
