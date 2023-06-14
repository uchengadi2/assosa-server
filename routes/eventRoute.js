const express = require("express");

const eventController = require("../controllers/eventController");
const authController = require("./../controllers/authController");

const router = express.Router();

//protect all the routes below

//router.use(authController.protect);

router.route("/").get(eventController.getAllEvents).post(
  //authController.restrictTo("admin", "set-admin"),
  eventController.uploadEventThumbnailImage,
  eventController.resizeEventThumbnailImage,

  eventController.createEvent
);

router
  .route("/:id")
  .get(eventController.getEvent)
  .patch(
    //authController.restrictTo("admin", "set-admin"),
    eventController.uploadEventThumbnailImage,
    eventController.resizeEventThumbnailImage,

    eventController.updateEvent
  )
  .delete(
    authController.restrictTo("admin", "set-admin"),
    eventController.deleteEvent
  );

module.exports = router;
