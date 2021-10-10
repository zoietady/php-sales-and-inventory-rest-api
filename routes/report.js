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

router.get('/product',[authMiddleware.authenticateTokenCookie],(req, res)=>{
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

            res.json(result)
        };
    });
});


router.get('/productcategory',[authMiddleware.authenticateTokenCookie],(req, res)=>{
    Report.getProductCategorySalesData((err, data) => {
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
                if (result.findIndex(x => x.product_group==i.product_group) === -1){
                    product = { 
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
                index = result.findIndex(x => x.product_group=== i.product_group)
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

            res.json(result)
        };
    });
});

router.get('/summary',[authMiddleware.authenticateTokenCookie],(req, res)=>{
    Report.getSalesData((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Sales."
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

            var summary_data = {
                "previous_month_sales" : monthly[0].sales_revenue,
                "current_month_sales" : monthly[1].sales_revenue,
                "monthly_sales_change" : monthly[1].sales_revenue - monthly[0].sales_revenue,
                "percent_monthly_sales_change" : (monthly[1].sales_revenue - monthly[0].sales_revenue)/monthly[0].sales_revenue,
                "previous_week_sales" : weekly[0].sales_revenue,
                "current_week_sales" : weekly[1].sales_revenue,
                "weekly_sales_change" : weekly[1].sales_revenue - weekly[0].sales_revenue,
                "percent_weekly_sales_change" : (weekly[1].sales_revenue - weekly[0].sales_revenue)/weekly[0].sales_revenue
            }

            var summary = `It is currently week ${weekly[1].week}, which started on ${weekly[1].start_of_week}. `

            if (summary_data.weekly_sales_change > 0){
                summary += `Sales have increased by ${summary_data.weekly_sales_change.toFixed(2)} or ${summary_data.percent_weekly_sales_change.toFixed(2) * 100}% from last week, increasing from ${weekly[0].sales_revenue.toFixed(2)} to ${weekly[1].sales_revenue.toFixed(2)}. `
            } else if (summary_data.weekly_sales_change < 0){
                summary += `Sales have decreased by A$${summary_data.weekly_sales_change.toFixed(2)*-1} or ${summary_data.percent_weekly_sales_change.toFixed(2) * -100}% from last week, dropping from A$${weekly[0].sales_revenue.toFixed(2)} to A$${weekly[1].sales_revenue.toFixed(2)}. `
            } else{
                summary += `Sales were the same from last week. `
            }

            const monthNames = ["January", "February", "March", "April", "May", "June","July","August", "September", "October", "November", "December"]

            summary += `As for monthly sales,`

            if (summary_data.monthly_sales_change > 0){
                summary += ` sales have increased by A$${summary_data.monthly_sales_change.toFixed(2)} or ${summary_data.percent_monthly_sales_change.toFixed(2) * 100}% from last month, increasing from A$${monthly[0].sales_revenue} back in ${monthNames[monthly[0].month-1]} to A$${monthly[1].sales_revenue.toFixed(2)} this month of ${monthNames[monthly[1].month-1]}. `
            } else if (summary_data.monthly_sales_change < 0){
                summary += ` sales have decreased by A$${summary_data.monthly_sales_change.toFixed(2)*-1} or ${summary_data.percent_monthly_sales_change.toFixed(2) * -100}% from last month, dropping from A$${monthly[0].sales_revenue} back in ${monthNames[monthly[0].month-1]} to A$${monthly[1].sales_revenue.toFixed(2)} this month of ${monthNames[monthly[1].month-1]}. `
            } else{
                summary += ` sales were the same from last month. `
            }

            console.log(summary);

            res.json({"summary": summary});
        };
    });
});



module.exports = router;
