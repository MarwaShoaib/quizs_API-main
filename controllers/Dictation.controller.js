require("dotenv").config();
const express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let interactiveObjectSchema = require("../models/interactive-object.model").interactiveObjectSchema;
const fs = require("fs")
const path = require("path")
router.get("/objectLabelsDictation", async (req, res) => {
    res.status(200).json(
      [
        // { _Taskdescription_ : "text" },
                {_Text_:"text"},
                {_Path_: "text"}
              ]
    )
});


router.post("/saveObjectDictation/:id", async (req, res) => {
    const id = req.params.id
    const { objectElements } = req.body
    const newObj = {}
    
    newObj.type = "Dictation"
    const parameters = {  }
    // const h5pString = { sentences:[] }
    for (let item of objectElements) {
        let key = Object.keys(item)[0]
      parameters[key]=item[key]
      
      //   if (key === "_Taskdescription_") {
      //     parameters._Taskdescription_ = item[key]
      //     h5pString._Taskdescription_ = `<h3>${item[key]}</h3>`
      //     newObj.isAnswered = 'r'
      // }else
      //  if (key === "_Text_") {
        // parameters.sentences.push({})
        // parameters.sentences[0][_Text_]=item[key]
        // h5pString.sentences[0]["_Text_"]=`\"${item[key]}\"`
        
        // parameters.sentences.push({text:item[key]})
          // h5pString.sentences.push({_Text_:`\"${item[key]}\"`})
      //     newObj.isAnswered = 'r'
      //   } 
      //    else if (key === "_Path_") {
      //     parameters.sentences[0]["sample"]=[{path:item[key]}]
      //     // h5pString.sentences[0]["sample"]=[{_Path_:`\"${item[key]}\"`}]
      //     // parameters.sentences.push({sample:[{_Path_:item[key]}]})
      //     // h5pString.sentences.push({sample:[{_Path_:`\"${item[key]}\"`}]})
      //     newObj.isAnswered = 'g'
      // } 
    }
    // h5pString.sentences = JSON.stringify(h5pString.sentences).replace(/\\\\/g, "\\")

    newObj.parameters = parameters
    // newObj.h5pString = h5pString
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

//------------------------------------------------------------
// require("dotenv").config();
// const express = require("express");
// let router = express.Router();
// let mongoose = require("mongoose");
// let interactiveObjectSchema = require("../models/interactive-object.model").interactiveObjectSchema;
// // const fs = require("fs")

// router.get("/objectLabelsDictation", async (req, res) => {
//   //  const labels=[{TaskDescription:'text'},{sentence:[{voice:'voice'},{text}]}]
//     res.status(200).json(
        
//         [
//         { taskdescription : "text" },
//         {sentence : [
//          {voice:'voice',text:'text'},
         
//         ]}
        
//       ]
        
        
//     )
// });
// router.post("/saveObjectDictation/:id?", async (req, res) => {
//         const id = req.params.id
//         const { objectElements, ...objectData } = req.body
//         const newObj = new interactiveObjectSchema({ _id: false });
//         if (!id) newObj.objId = new mongoose.Types.ObjectId();
    
//         newObj.type = "Dictation"
//         newObj.questionOrExplanation = "Q"
//         newObj.isAnswered = "r"
//         const parameters = { taskdescription:'',sentence:[] }
//         const h5pString =  { taskdescription:'',sentence:[] }
//         for (let item of objectElements) {
//             let key = Object.keys(item)[0]
//             if (key === "sentence") {
//                 parameters.sentence.push({ voice:'voice' ,text:'text' })
//             }
//         }
//         for (let key in objectData) {
//             if (Object.hasOwnProperty.bind(req.body)(key)) {
//                 newObj[key] = req.body[key];
//             }
//         }
    
//         newObj.parameters = parameters
    
//         // update object if id is given as API parameter
//         if (id) interactiveObjectSchema.updateOne(
//             { _id: id },
//             {
//               $set: newObj,
//             },
//             { new: false, runValidators: true, returnNewDocument: true, upsert: true },
//             (err, doc) => {
//               if (!err) {
//                 res.status(200).json(newObj);
//               } else {
//                 res.status(500).json(err);
//               }
//             }
//           );
    
//         // if id is not given then create new object
//         else newObj.save((err, doc) => {
//             if (!err) {
//                 res.status(200).json(newObj);
//             } else {
//                 console.log(err);
//                 res.status(406).json(`Not Acceptable: ${err}`);
//             }
//         });
    
//     });
    
//     module.exports = router;
    


