/* Report MODEL */

/* import connection instance */
const connection = require("./db.js");

/* instantiate user model */
const Report = function(Report) {
  this.update_index = Report.update_index;
  this.product_id = Report.product_id;
  this.current_stock = Report.current_stock;
  this.max_stock_capacity = Report.max_stock_capacity;
  this.date_time = Report.date_time;
};

Report.getProductSalesData = result => {
  let query1 = `select productinformationtable.product_id, productinformationtable.product_name, productinformationtable.product_group,month(date_time) as "month",year(date_time) as "year",sum(ROUND(quantity_sold * productinformationtable.product_price, 2)) as "sales_revenue", sum(quantity_sold) as "volume_sold"
  from productinformationtable, salesordertable 
  where productinformationtable.product_id = salesordertable.product_id
  group by productinformationtable.product_id,month(date_time),year(date_time)
  order by productinformationtable.product_id,year(date_time),month(date_time)`

  let query2 = `select productinformationtable.product_id, productinformationtable.product_name, productinformationtable.product_group,date_format(MIN(date_time),"%d-%m-%y") as "start_of_week",WEEK(date_time) as "week", sum(ROUND(quantity_sold * productinformationtable.product_price, 2)) as "sales_revenue", sum(quantity_sold) as "volume_sold"
  from productinformationtable, salesordertable 
  where productinformationtable.product_id = salesordertable.product_id
  group by productinformationtable.product_id,WEEK(date_time),year(date_time) 
  order by productinformationtable.product_id,start_of_week`

  let query3 = `SELECT productinventorytable.product_id, productinventorytable.current_stock, date_format(productinventorytable.date_time,"%d-%m-%y") as "date_time" from productinventorytable,(SELECT product_id, current_stock, max(date_time) as latestUpdateDate from productinventorytable GROUP BY product_id) max_product WHERE productinventorytable.product_id = max_product.product_id AND productinventorytable.date_time = max_product.latestUpdateDate;`

  let queryString = query1.concat(";", query2, ";",query3)
  connection.query(queryString, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
};

Report.getProductCategorySalesData = result => {
  let query1 = `select productinformationtable.product_group,month(date_time) as "month",year(date_time) as "year",sum(ROUND(quantity_sold * productinformationtable.product_price, 2)) as "sales_revenue", sum(quantity_sold) as "volume_sold"
  from productinformationtable, salesordertable 
  where productinformationtable.product_id = salesordertable.product_id
  group by productinformationtable.product_group,month(date_time),year(date_time)
  order by productinformationtable.product_group,year(date_time),month(date_time)`

  let query2 = `select productinformationtable.product_group,MIN(date_time) as "start_of_week",WEEK(date_time) as "week", sum(ROUND(quantity_sold * productinformationtable.product_price, 2)) as "sales_revenue", sum(quantity_sold) as "volume_sold"
  from productinformationtable, salesordertable 
  where productinformationtable.product_id = salesordertable.product_id
  group by productinformationtable.product_group,WEEK(date_time),year(date_time) 
  order by productinformationtable.product_group,start_of_week`

  let queryString = query1.concat(";", query2)
  connection.query(queryString, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
};

Report.getSalesData = result => {
  let query1 = `select month(date_time) as "month",year(date_time) as "year",sum(ROUND(quantity_sold * productinformationtable.product_price, 2)) as "sales_revenue", sum(quantity_sold) as "volume_sold"
  from productinformationtable, salesordertable 
  where productinformationtable.product_id = salesordertable.product_id
  group by month(date_time),year(date_time)
  order by year(date_time),month(date_time)`

  let query2 = `select date_format(MIN(date_time), "%d-%m-%y") as "start_of_week",WEEK(date_time) as "week",sum(ROUND(quantity_sold * productinformationtable.product_price, 2)) as "sales_revenue", sum(quantity_sold) as "volume_sold"
  from productinformationtable, salesordertable 
  where productinformationtable.product_id = salesordertable.product_id
  group by week(date_time),year(date_time)
  order by date_time`

  let queryString = query1.concat(";", query2)
  connection.query(queryString, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
};


module.exports = Report;