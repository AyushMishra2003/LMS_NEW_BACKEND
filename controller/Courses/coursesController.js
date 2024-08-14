import Courses from "../../model/course.model.js";
import AppError from "../../utils/error.utlis.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const addCourse = async (req, res, next) => {
  try {
    const { title, description, category, level, aboutCourse } = req.body;

    if (!title || !description || !category || !level || !aboutCourse) {
      return next(new AppError("All Field are Required", 400));
    }

    const course = await Courses({
      title,
      description,
      category,
      level,
      aboutCourse,
    });

    if (!course) {
      return next(new AppError("Course Not Created Succesfully", 400));
    }

    if (req.file) {
      console.log(req.file);
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });
      if (result) {
        (course.photo.public_id = result.public_id),
          (course.photo.secure_url = result.secure_url);
      }
      fs.rm(`uploads/${req.file.filename}`);
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course Created Succesfully",
      data: course,
    });
  } catch (error) {
    return next(error.message, 500);
  }
};

const addMeterial = async (req, res, next) => {
  try {
    const { materail } = req.body;
    const { id } = req.params;

    const course = await Courses.findById(id);

    if (!course) {
      return next(new AppError("Course not Exist", 402));
    }

    course.MaterialIncludes.push(materail);

    await course.save();

    res.status(200).json({
      success: true,
      message: "Meterail Added",
      data: course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const addRequirements = async (req, res, next) => {
  try {
    const { requirement } = req.body;

    console.log(requirement);
    const { id } = req.params;

    const course = await Courses.findById(id);

    if (!course) {
      return next(new AppError("Coursed Not Found", 404));
    }

    course.Requirements.push(requirement);

    await course.save();

    res.status(200).json({
      success: true,
      message: "Coursed Added Succesfully",
      data: course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const addAudience = async (req, res, next) => {
  try {
    const { audience } = req.body;
    const { id } = req.params;

    const course = await Courses.findById(id);

    if (!course) {
      return next(new AppError("Course Not Found", 404));
    }

    if (!audience) {
      return next(new AppError("Audience Required", 400));
    }

    course.Audience.push(audience);

    await course.save();

    res.status(200).json({
      success: true,
      message: "Audience Added Succesfully",
      data: course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const addWhatLearn = async (req, res, next) => {
  try {
    const { learn } = req.body;
    const { id } = req.params;

    const course = await Courses.findById(id);

    if (!course) {
      return next(new AppError("Course Not Found", 404));
    }

    if (!learn) {
      return next(new AppError("What We Learn Required", 400));
    }

    course.whatWeLearn.push(learn);

    await course.save();

    res.status(200).json({
      success: true,
      message: "WhatWe Learn Added Succesfully",
      data: course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const getCourse = async (req, res, next) => {
  try {
    const allCourse = await Courses.find({});

    if (!allCourse) {
      return next(new AppError("Course Not Found", 400));
    }

    res.status(200).json({
      success: true,
      message: "All Courses are:-",
      data: allCourse,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const getSingleCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const singleCourse = await Courses.findById(id);

    if (!singleCourse) {
      return next(new AppError("Courses Not Found", 404));
    }

    res.status(200).json({
      success: true,
      message: "All Single Course are:-",
      data: singleCourse,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Courses.findById(id);

    if (!course) {
      return next(new AppError("Course Not Found", 400));
    }

    await Courses.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Delete Course Succesfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Courses.findById(id);

    if (!course) {
      return next(new AppError("Course Not Found", 400));
    }

    const updatedCourse = await Courses.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        runValidators: true,
      }
    );

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });
      if (result) {
        (course.photo.public_id = result.public_id),
          (course.photo.secure_url = result.secure_url);
      }
      fs.rm(`uploads/${req.file.filename}`);
    }

    //   await updateBasicInfo.save()

    res.status(200).json({
      success: true,
      message: "Course Updated Succesfully",
      data: course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const addLecture = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, lecture } = req.body;

    const course = await Courses.findById(id);

    if (!course) {
      return next(new AppError("No Course Found", 400));
    }

    if (!title || !description) {
      return next(new AppError("All fields are required", 400));
    }

    const lectureData = {
      title,
      description,
      lecture: {
        public_id: "",
        secure_url: "",
      },
    };

    if (!lectureData) {
      return next(new AppError("Failed to save lecture", 400));
    }

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        resource_type: "video",
      });

      if (result) {
        lectureData.lecture.public_id = result.public_id;
        lectureData.lecture.secure_url = result.secure_url;
      }
      fs.rm(`uploads/${req.file.filename}`);
    }

    course.lectures.push(lectureData);
    course.numberOfLecture = course.lectures.length;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lectures successfully added to the course",
      course,
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};

const deleteLecture = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lectureId } = req.params;
    const course = await Courses.findById(id);

    if (!course) {
      return next(new AppError("No Course Found", 400));
    }

    const lectureIndex = course.lectures.findIndex(
      (lecture) => lecture._id.toString() === lectureId.toString()
    );

    if (lectureIndex === -1) {
      return next(new AppError("No Lecture Found", 400));
    }

    // Delete the lecture video from Cloudinary
    await cloudinary.v2.uploader.destroy(
      course.lectures[lectureIndex].lecture.public_id,
      {
        resource_type: "video",
      }
    );
    course.lectures.splice(lectureIndex, 1);

    course.numberOfLecture = course.lectures.length;

    await course.save();

    res.status(200).json({
      status: true,
      message: "Lecture deleted successfully",
      course,
    });
  } catch (e) {
    // Handle unexpected errors
    return next(new AppError(e.message, 500));
  }
};

export {
  addCourse,
  addMeterial,
  addRequirements,
  addAudience,
  getCourse,
  getSingleCourse,
  deleteCourse,
  updateCourse,
  addLecture,
  deleteLecture,
  addWhatLearn,
};
