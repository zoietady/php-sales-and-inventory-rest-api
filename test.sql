SELECT productinventorytable.product_id, productinventorytable.current_stock, productinventorytable.date_time from productinventorytable,
    (
    SELECT product_id, current_stock, max(date_time) 
    as latestUpdateDate 
    from productinventorytable
    GROUP BY product_id
    ) max_product
    WHERE productinventorytable.product_id = max_product.product_id
    AND productinventorytable.date_time = max_product.latestUpdateDate;

-- sales and volume of each product aggregated by month
select productinformationtable.product_id, productinformationtable.product_name, productinformationtable.product_group,date_format(date_time, '%M %Y') as "month_year",sum(ROUND(quantity_sold * productinformationtable.product_price, 2)) as "sales_revenue", sum(quantity_sold) as "volume_sold"
from productinformationtable, salesordertable 
where productinformationtable.product_id = salesordertable.product_id
group by productinformationtable.product_id,month(date_time),year(date_time)
order by productinformationtable.product_id,year(date_time),month(date_time);

-- sales and colume of each product aggregated by week
select productinformationtable.product_id, productinformationtable.product_name, productinformationtable.product_group,MIN(date_time) as "start_of_week",WEEK(date_time) as "week", sum(ROUND(quantity_sold * productinformationtable.product_price, 2)) as "sales_revenue", sum(quantity_sold) as "volume_sold"
from productinformationtable, salesordertable 
where productinformationtable.product_id = salesordertable.product_id
group by productinformationtable.product_id,WEEK(date_time),year(date_time) 
order by productinformationtable.product_id,start_of_week;

-- sales and volume of each product category aggregated by month
select productinformationtable.product_group,date_format(date_time, '%M %Y') as "month_year",sum(ROUND(quantity_sold * productinformationtable.product_price, 2)) as "sales_revenue", sum(quantity_sold) as "volume_sold"
from productinformationtable, salesordertable 
where productinformationtable.product_id = salesordertable.product_id
group by productinformationtable.product_group,month(date_time),year(date_time)
order by productinformationtable.product_group,year(date_time),month(date_time);

-- sales and colume of each product category aggregated by week
select productinformationtable.product_group,MIN(date_time) as "start_of_week",WEEK(date_time) as "week", sum(ROUND(quantity_sold * productinformationtable.product_price, 2)) as "sales_revenue", sum(quantity_sold) as "volume_sold"
from productinformationtable, salesordertable 
where productinformationtable.product_id = salesordertable.product_id
group by productinformationtable.product_group,WEEK(date_time),year(date_time) 
order by productinformationtable.product_group,start_of_week;

-- sales and volume of each product aggregated by month
select date_format(date_time, '%M %Y') as "month_year",sum(ROUND(quantity_sold * productinformationtable.product_price, 2)) as "sales_revenue", sum(quantity_sold) as "volume_sold"
from productinformationtable, salesordertable 
where productinformationtable.product_id = salesordertable.product_id
group by month(date_time),year(date_time)
order by year(date_time),month(date_time);

-- sales and volume of each product aggregated by month
select MIN(date_time) as "start_of_week",WEEK(date_time) as "week",sum(ROUND(quantity_sold * productinformationtable.product_price, 2)) as "sales_revenue", sum(quantity_sold) as "volume_sold"
from productinformationtable, salesordertable 
where productinformationtable.product_id = salesordertable.product_id
group by week(date_time),year(date_time)
order by start_of_week;


SELECT productinventorytable.product_id, productinventorytable.current_stock, date_format(productinventorytable.date_time, "%d-%m-%y") as "date_time" from productinventorytable,(SELECT product_id, current_stock, max(date_time) as latestUpdateDate from productinventorytable GROUP BY product_id) max_product WHERE productinventorytable.product_id = max_product.product_id AND productinventorytable.date_time = max_product.latestUpdateDate;

SELECT sales_id,productinformationtable.*,quantity_sold,date_format(date_time, "%d-%m-%y") as date_time,dispatched, ROUND(quantity_sold * product_price, 2) AS 'total_revenue' FROM productinformationtable, salesordertable WHERE productinformationtable.product_id = salesordertable.product_id ORDER BY sales_id;