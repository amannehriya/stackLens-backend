const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const companies = require('../models/companyModel');
const isLoggedIn = require('../middleware/isLoggedIn');
const userModel = require('../models/userModel');

router.post("/create/:user_id",isLoggedIn ,upload.single("logo"), async (req, res, next) => {
    try {
        const{user_id} = req.params;
        const { name, languages, salary, jobAvailability, minKnowledge, location, companysize, createdAt, website, } = req.body;
       
       let parsedLanguage = JSON.parse(languages);
       let parsedSalary = JSON.parse(salary)
//  console.log( salary, languages)

        const logo = req.file ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
        } : null;


        if (!name || !languages || !salary) {
            return res.status(400).json({ "note": "please write all this neccessary detail" });
        }

        const company = {
            name,
           languages: parsedLanguage, // must be array
            salary:parsedSalary,
            jobAvailability,
            minKnowledge,
            location,
            companysize,
            website,
            createdAt,
            logo
        }


        const compayCreated = await companies.create(company);

        //adding new company in user company array
        if(compayCreated){
            const user = await userModel.findByIdAndUpdate(
                user_id,
            {$push:{createdCompany:compayCreated._id}},
        {new:true});
         
        }

        res.status(201).json({
            status:true,
            message: "company created successfully",
            data: compayCreated
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({
            status:false,
             error: "Failed to add company :: internal server  error" });
    }
})

router.delete("/delete/:user_id/:company_id", async (req, res, next) => {
    try {
        const {user_id,company_id } = req.params;
        
        const deletedcompany = await companies.findByIdAndDelete(id);
        if (!deletedcompany) return res.status(404).json({ "error": "something wents wrong" });
        //now deleting company id from user companyArray
        const user =   await userModel.findById(user_id)

        const updatedArray = user.createdCompany.filter((e)=>e!==company_id)
          await userModel.findById(user_id,{createdCompany:updatedArray},{ new: true, runValidators: true })
        
        res.json({ message: "company deleted successfully", data: deletedcompany })
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete company" });
    }
})


router.put("/update/:id",isLoggedIn ,upload.single("logo"), async (req, res, next) => {
    try {
        const {id} = req.params;
        const { name, languages, salary, jobAvailability, minKnowledge, location, companysize, website } = req.body;
       
       let parsedLanguage = JSON.parse(languages);
       let parsedSalary = JSON.parse(salary)

        const updatedData = {
            name,
           languages: parsedLanguage, // must be array
            salary:parsedSalary,
            jobAvailability,
            minKnowledge,
            location,
            companysize,
            website,
            createdAt:Date.now(),
        }
        
        if(req.file ) {
           updatedData.logo ={  data: req.file.buffer,
            contentType: req.file.mimetype,}
           }

        const compayUpdated = await companies.findByIdAndUpdate(id,updatedData,{ new: true, runValidators: true });
     console.log("update",compayUpdated)
        res.status(201).json({
            status:true,
            message: "company updated successfully",
            data: compayUpdated
        });


    } catch (err) {
        console.error(err);
      return  res.status(500).json({ status:false, error: "Failed to update company" });
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const company = await companies.findById(id);

        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }

        res.json({ message: "Company find successfully", data: company });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to find company" });
    }


})


router.get('/companyList/:id',async(req,res,next)=>{
try {
    const {id} = req.params;

const user = await userModel.findById(id)
console.log("finding")

if(!user){
  return  res.status(401).json({message:"you are not authorized person"})
}


const companylist = await  Promise.all( user.createdCompany.map(async(company_id) => {
    return await companies.findById(company_id)
  
}))

return res.status(201).json({companylist})
} catch (error) {
    // console.log(error)
    return res.status(500).json({error});
}
})

module.exports = router;