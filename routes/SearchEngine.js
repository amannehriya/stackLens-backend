const express = require('express');
const router = express.Router();

const companies = require('../models/companyModel');


router.get("/", async (req, res, nest) => {
    try {
        const { query } = req.query;

        if (!query) return res.json([]);


        const result = await companies.find({
            $or:
                [
                    { name: { $regex: query, $options: "i" } },
                    { languages: { $elemMatch: { $regex: query, $options: "i" } } }
                ]
        }, { name: 1 }).limit(10);


        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "server error" });
    }
})

router.get('/filter', async (req, res, next) => {
    try {
        const { language, location, minSalary, maxSalary, jobAvailability } = req.query;
        let query = {};

        if (language) {
            query.languages = { $elemMatch: { $regex: language, $options: "i" } };
        }

        if (location) {
            query.location = { $regex: location, $options: "i" };
        }
        if (minSalary || maxSalary) {
            if (minSalary) query["salary.freshser"].$gte = Number(minSalary);
            if (maxSalary) query["salary.freshser"].$lte = Number(maxSalary);
        }

        if (jobAvailability !== undefined) {
            query.jobAvailability = jobAvailability === "true"
        }
        const company = await companies.find(query).limit(50);

        res.json(company);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch companies" });
    }
})


module.exports = router;