const multer = require("multer");
const sharp = require("sharp");
const Project = require("../models/ProjectModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

const multerStorage = multer.memoryStorage();

//create a multer filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError("this file is not an image, Please upload only images", 404),
      false
    );
  }
};

//const upload = multer({ dest: "public/images/users" });

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

//when uploading a single file
//exports.uploadEventThumbnailImage = upload.single("thumbnail");

//for multiple images in a field that is an array, use the following
//exports.uploadImages = upload.array('images',3)

//for more than one file(multiple files)
exports.uploadProjectImages = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 12 },
]);

exports.resizeProjectImages = catchAsync(async (req, res, next) => {
  if (!req.files.thumbnail || !req.files.images) return next();
  //if (!req.files.thumbnail) return next();

  //processing the thumbnail

  req.body.thumbnail = `projects-${req.body.createdBy}-${
    req.files.thumbnail[0].originalname
  }-${Date.now()}-thumbnail.jpeg`;

  await sharp(req.files.thumbnail[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/projects/${req.body.thumbnail}`);

  //processing other images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, index) => {
      const filename = `project-${req.body.createdBy}-${
        file.originalname
      }-${Date.now()}-${index + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/projects/${filename}`);
      req.body.images.push(filename);
    })
  );

  next();
});

//get all Projects
exports.getAllProjects = factory.getAll(Project);
//create a Project
exports.createProject = factory.createOne(Project);

//get a Project
exports.getProject = factory.getOne(Project);

//deleting a Project
exports.deleteProject = factory.deleteOne(Project);

//updating a Project
exports.updateProject = factory.updateOne(Project);
