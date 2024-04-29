require("dotenv").config();
const express = require("express");
const path = require("path");
let router = express.Router();
let mongoose = require("mongoose");
let interactiveObjectSchema = require("../models/interactive-object.model").interactiveObjectSchema;
const fs = require("fs")
router.get("/objectLabelsImageChoice", async (req, res) => {
  res.status(200).json(
    [
      { _Question_: "text" },
      { _Picture_: "image" },
      { _AlternativeText_: "text" },
      { _HoverText_: "text" },
      { correct: "Boolean" },
    ]
  )
});
// for (let item of objectElements) {
//   let key = Object.keys(item)[0]
//   //  'image' or whatever the key name
//   if (key === "image") {
//       if (item[key].startsWith("http")) parameters[key] = item[key]
//       else if (item[key].startsWith("data:image/png;base64")) {
//           imgData = item[key].replace(/^data:image\/png;base64,/, "");
//           const fileName = id + "_image.png"
//           const filePath = path.join(__dirname + "/../uploads/"+ fileName)
//           fs.writeFileSync(filePath, imgData, "base64")
//           // APP_URL on local is http://localhost:4000
//           const url = `${process.env.APP_URL}/uploads/${fileName}`
//           parameters[key] = url
//       }
//   }
//   // ...Continue save API
//   }

router.post("/saveObjectImageChoice/:id", async (req, res) => {
  const id = req.params.id
  const { objectElements } = req.body
  const newObj = {}
  newObj.type = "ImageChoice"
  const parameters = { _Question_: "", options: [] }
  for (let item of objectElements) {

    let key = Object.keys(item)[0]
    if (key === "_Question_") {
      parameters['_Question_'] = item[key]
    } else if (key === "_Picture_") {
      if (item[key].startsWith("http"))
        parameters.options.push({ _Picture_: item[key], correct: false })
      else if (item[key].startsWith("data:image/png;base64")) {
        imgData = item[key].replace(/^data:image\/png;base64,/, "");
        const fileName = id + "_image.png"
        const filePath = path.join(__dirname + "/../uploads/" + fileName)
        fs.writeFileSync(filePath, imgData, "base64")
        const url = `${process.env.APP_URL}/uploads/${fileName}`
        parameters.options.push({ _Picture_: url, correct: false })
      }
    } else if (key === "_AlternativeText_") {
      parameters.options[parameters.options.length - 1]['_AlternativeText_'] = item[key]
    } else if (key === "_HoverText_") {
      parameters.options[parameters.options.length - 1]["_HoverText_"] = item[key]
    } else if (key === "correct") {
      parameters.options[parameters.options.length - 1]["correct"] = item[key]
      newObj.isAnswered = 'g'
    }
  }


  newObj.parameters = parameters
  interactiveObjectSchema.updateOne(
    { _id: id },
    {
      $set: newObj,
    },
    { new: false, runValidators: true, returnNewDocument: true, upsert: true },
    (err, doc) => {
      if (!err) {
        res.status(200).json(newObj);
      } else {
        res.status(500).json(err);
      }
    }
  );
});

module.exports = router;