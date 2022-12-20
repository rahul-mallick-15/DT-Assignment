const asyncWrapper = require("../middleware/async");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-error");
const { get } = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getEventById = asyncWrapper(async (req, res, next) => {
  const { id: eventId } = req.query;
  const db = get();
  const event = await db
    .collection("events")
    .findOne({ _id: ObjectId(eventId) });
  // db.collection("Event").insertOne({})
  if (event === null) {
    throw new CustomAPIError(
      `No Event found with id ${eventId}`,
      StatusCodes.NOT_FOUND
    );
  }
  res.status(StatusCodes.OK).json(event);
});

const getEvents = asyncWrapper(async (req, res, next) => {
  if (req.query.id) {
    return next();
  }
  const { type, limit, page } = req.query;
  const db = get();
  if (type === "latest") {
    let result = await db
      .collection("events")
      .find({})
      .sort({ schedule: -1 })
      .toArray();
    let start = limit * (page - 1);
    result = result.splice(start, start + limit);
    return res.status(StatusCodes.OK).send(result);
  }
  res.send("Done.");
});

const createEvent = asyncWrapper(async (req, res, next) => {
  // name, files[image], tagline, schedule, description, moderator, category, sub_category, rigor_rank
  const {
    uid,
    name,
    tagline,
    schedule,
    description,
    moderator,
    category,
    sub_category,
    rigor_rank,
    attendees,
  } = req.body;
  const image = req.file;
  const db = get();
  const event = await db.collection("events").insertOne({
    type: "event",
    uid,
    name,
    tagline,
    schedule: new Date(schedule),
    description,
    image,
    moderator,
    category,
    sub_category,
    rigor_rank: Number(rigor_rank),
    attendees: attendees.split(","),
  });
  res.status(StatusCodes.CREATED).json(event);
});

const updateEvent = asyncWrapper(async (req, res, next) => {
  const { id: eventId } = req.params;
  const {
    uid,
    name,
    tagline,
    schedule,
    description,
    moderator,
    category,
    sub_category,
    rigor_rank,
    attendees,
  } = req.body;
  const image = req.file;
  const db = get();
  const event = await db.collection("events").findOneAndUpdate(
    { _id: ObjectId(eventId) },
    {
      $set: {
        type: "event",
        uid,
        name,
        tagline,
        schedule: new Date(schedule),
        description,
        image,
        moderator,
        category,
        sub_category,
        rigor_rank: Number(rigor_rank),
        attendees: attendees.split(","),
      },
    }
  );
  res.status(StatusCodes.OK).send(event.value);
});

const deleteEvent = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const db = get();
  const event = await db.collection("events").deleteOne({ _id: ObjectId(id) });
  if (event.deletedCount === 0)
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(`No event found with id ${id}`);
  res.status(StatusCodes.OK).send("Successfully deleted event.");
});

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
