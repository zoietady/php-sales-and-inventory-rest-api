const express = require('express');
const router = express.Router();

/* import auth middlewares */
const authMiddleware = require("../middlewares/authMiddleware");

/* import user model */
// const Sales = require("../models/SalesModel.js");

const Report = require("../models/ReportModel.js");

/* in memory data storage */
let data = require("../data.js");
const e = require('express');
let report = data.report;

// [authMiddleware.authenticateTokenCookie]
/* get all sales*/
router.get('/',[authMiddleware.authenticateTokenCookie],(req, res)=>{
    res.json(report);
});

router.get('/product',(req, res)=>{
    Report.getProductSalesData((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Saless."
          });
        else {

            let monthly = []
            let weekly = []
            let result = []

            var today = new Date();
            var month = today.getMonth();
            var year = today.getFullYear();

            var oneJan = new Date(today.getFullYear(),0,1);
            var numberOfDays = Math.floor((today - oneJan) / (24 * 60 * 60 * 1000));
            var week = Math.ceil(( today.getDay() + 1 + numberOfDays) / 7);

            monthly = data[0].filter(e => (e.month === month+1 && e.year === year) || (e.month === month && e.year === year))

            weekly = data[1].filter(e => (e.week === week && (new Date(e.start_of_week)).getFullYear() === year) || (e.week === week-1 && (new Date(e.start_of_week)).getFullYear() === year))

            var product

            monthly.forEach((i) =>{
                if (result.findIndex(x => x.product_id==i.product_id) === -1){
                    product = { 
                        "product_id": i.product_id,
                        "product_name": i.product_name,
                        "product_group": i.product_group,
                        "previous_month_revenue" : i.sales_revenue,
                        "previous_month_volume" : i.volume_sold,
                    }
                    result.push(product);
                } else {
                    product["current_month_revenue"] =  i.sales_revenue,
                    product["current_month_volume"] =  i.volume_sold
                }
            })

            var index
            weekly.forEach((i) =>{
                index = result.findIndex(x => x.product_id=== i.product_id)
                if (index !== -1){
                    if ( !result[index].hasOwnProperty('previous_week_revenue')) {
                        result[index].previous_week_revenue =  i.sales_revenue,
                        result[index].previous_week_volume =  i.volume_sold
                    } else{
                        result[index].current_week_revenue =  i.sales_revenue,
                        result[index].current_week_volume =  i.volume_sold
                    }
                } 
            }) 

            var second_rate_change = 0.5
            var revenue_change,volume_change
            result.forEach((i) => {
                revenue_change = {
                    "1w": (i.current_week_revenue - i.previous_week_revenue)/i.previous_week_revenue,
                    "1m": (i.current_month_revenue - i.previous_month_revenue)/i.previous_month_revenue
                }

                volume_change = {
                    "1w": (i.current_week_volume - i.previous_week_volume)/i.previous_week_volume,
                    "1m": (i.current_month_volume - i.previous_month_volume)/i.previous_month_volume
                }

                forecasted_revenue_change = {
                    "1w": ((i.current_week_revenue - i.previous_week_revenue)/i.previous_week_revenue)*second_rate_change,
                    "1m": ((i.current_month_revenue - i.previous_month_revenue)/i.previous_month_revenue)*second_rate_change
                }

                forecasted_revenue = {
                    "1w": ((((i.current_week_revenue - i.previous_week_revenue)/i.previous_week_revenue)*second_rate_change)+1)*i.current_week_revenue,
                    "1m": ((((i.current_month_revenue - i.previous_month_revenue)/i.previous_month_revenue)*second_rate_change)+1)*i.current_month_revenue
                }

                forecasted_volume_change = {
                    "1w": ((i.current_week_volume - i.previous_week_volume)/i.previous_week_volume)*second_rate_change,
                    "1m": ((i.current_month_volume - i.previous_month_volume)/i.previous_month_volume)*second_rate_change
                }

                forecasted_volume = {
                    "1w": ((((i.current_week_volume - i.previous_week_volume)/i.previous_week_volume)*second_rate_change)+1)*i.current_week_volume,
                    "1m": ((((i.current_month_volume - i.previous_month_volume)/i.previous_month_volume)*second_rate_change)+1)*i.current_month_volume
                }

                i.revenue_change = revenue_change
                i.volume_change = volume_change
                i.forecasted_revenue_change = forecasted_revenue_change
                i.forecasted_revenue = forecasted_revenue
                i.forecasted_volume_change = forecasted_revenue_change
                i.forecasted_volume = forecasted_volume
            });

            var inventory = data[2]

            
            var inventory_comparison
            result.forEach((i) => {
                index = inventory.findIndex(x => x.product_id=== i.product_id)

                if (index !== -1){
                    inventory_comparison = {
                        "last_update":inventory[index].date_time,
                        "current_stock":inventory[index].current_stock,
                        "1w_deficit": inventory[index].current_stock - i.forecasted_volume["1w"],
                        "1m_deficit":  inventory[index].current_stock - i.forecasted_volume["1w"]
                    }

                    i.inventory_comparison = inventory_comparison
                } else{
                    inventory_comparison = {
                        "last_update": "",
                        "current_stock": 0,
                        "1w_deficit": 0 - i.forecasted_volume["1w"],
                        "1m_deficit":  0 - i.forecasted_volume["1m"]
                    }
                    i.inventory_comparison = inventory_comparison
                }
            })

            console.log(result)

            res.json(result)
        };
    });
});

router.get('/summary',[authMiddleware.authenticateTokenCookie],(req, res)=>{
    res.json({"summary": "This is a sample summary report of roughly the same length: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse "});
});



module.exports = router;
