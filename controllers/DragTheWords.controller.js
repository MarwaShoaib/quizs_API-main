require("dotenv").config();
const express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let interactiveObjectSchema = require("../models/interactive-object.model").interactiveObjectSchema;
const fs = require("fs")
const path = require("path")

router.get("/objectLabelsDragTheWords", async (req, res) => {
    res.status(200).json(
        [
           
            { _sentence_: "text" },
            { _answer_: "text" },
            { _tip_: "text" },
         
    
        ]
    )
});


router.post("/saveObjectDragTheWords/:id", async (req, res) => {
    const id = req.params.id
    const { objectElements } = req.body
    const newObj = {}
    
    newObj.type = "DragTheWords"
    const parameters = {  textField: [] }
    for (let item of objectElements) {
        let key = Object.keys(item)[0]

        if (key === "_sentence_") {
            parameters.textField.push({_sentence_: item[key]})
            newObj.isAnswered='r'
        } else if (key === "_answer_") {
            parameters.textField[parameters.textField.length-1]["_answer_"]=item[key]
            newObj.isAnswered='g'
        } else if (key === "_tip_") {
          parameters.textField[parameters.textField.length-1]["_tip_"]=item[key]
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