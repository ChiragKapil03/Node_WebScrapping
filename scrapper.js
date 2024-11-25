const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');

const URL = "https://www.amazon.in";
async function scrapeData() {
    try {

        const { data: html } = await axios.get(URL);

        const $ = cheerio.load(html);

        const products = [];
        $(".product-card").each((index, element) => {
            const productName = $(element).find(".product-name").text().trim();
            const price = $(element).find(".product-price").text().trim();
            const availability = $(element).find(".availability").text().trim();
            const rating = $(element).find(".product-rating").text().trim() || "No rating";
            products.push({ productName, price, availability, rating });
        });


        saveToExcel(products);

    } catch (error) {
        console.error("Error scraping data:", error.message);
    }
}

function saveToExcel(data) {
    const worksheet = xlsx.utils.json_to_sheet(data); 
    const workbook = xlsx.utils.book_new();          
    xlsx.utils.book_append_sheet(workbook, worksheet, "Products");

    xlsx.writeFile(workbook, "products.xlsx");
    console.log("Data saved to products.xlsx");
}

scrapeData();
