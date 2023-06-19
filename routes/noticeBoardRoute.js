const express = require("express");

const noticeBoardController = require("../controllers/noticeBoardController");
const authController = require("./../controllers/authController");

const router = express.Router();

//protect all the routes below

//router.use(authController.protect);

router.route("/").get(noticeBoardController.getAllNoticeBoards).post(
  //authController.restrictTo("admin", "old-student", "set-admin"),
  noticeBoardController.uploadNoticeboardImages,
  noticeBoardController.resizeNoticeboardImages,

  noticeBoardController.createNoticeBoard
);

router
  .route("/:id")
  .get(noticeBoardController.getNoticeBoard)
  .patch(
    //authController.restrictTo("admin", "old-student", "set-admin"),

    noticeBoardController.uploadNoticeboardImages,
    noticeBoardController.resizeNoticeboardImages
  )
  .delete(
    authController.restrictTo("admin", "set-admin"),
    noticeBoardController.deleteNoticeBoard
  );

module.exports = router;
