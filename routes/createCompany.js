const express = require('express');
const router = express.Router();

const companies = require('../models/companyModel');

router.post("/create", async (req, res, next) => {
    try {
        const { name, languages, salary, jobAvailability, minKnowledge, location, companysize, createdAt, website } = req.body;
        console.log(name)
        if (!name || !languages || !salary || !jobAvailability) {
            return res.status(400).json({ "note": "please write all this neccessary detail" });
        }

        const company = {
            name,
            languages, // must be array
            salary,
            jobAvailability,
            minKnowledge,
            location,
            companysize,
            website,
            createdAt
        }


        const compayCreated = await companies.create(company);
        res.status(201).json({
            message: "company created successfully",
            data: compayCreated
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add company" });
    }
})

router.delete("/delete/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedcompany = await companies.findByIdAndDelete(id);

        if (!deletedcompany) return res.status(404).json({ "error": "something wents wrong" });

        res.json({ message: "company deleted successfully", data: deletedcompany })
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete company" });
    }
})

router.put('/update/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updateCompany = await companies.findByIdAndUpdate(id, updateData,
            { new: true, runValidators: true });

        if (!updateCompany) {
            return res.status(404).json({ error: "Company not found" });
        }

        res.json({ message: "Company updated successfully", data: updateCompany });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update company" });
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

module.exports = router;