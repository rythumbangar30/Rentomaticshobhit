const {
  test,
  expect
} = require('@playwright/test');
const fs = require('fs');
const { text } = require('stream/consumers');

test.use({
  testTimeout: 60000 * 10
});

test('Zillow', async ({
  page
}) => {

  //Inputs User want to Change
  var CityName = "South Jordan, Utah";


  //if user doesn't want to filterate

//   var Min = null;
//   var Max = null;
  var Propertytype=[];
  var BedRooms=[];
  var Baths=[];
  var moreFilters=[];
  var propertiesSort=null;
  var squareFootage=null;
  var Acreage=null;


 // when user want to give filter

   var Min="$2,000";
   var Max="$3,000";
  // var Propertytype = ['Apartment'];
  // var BedRooms = ['Studio','4'];
  // var Baths=['4'];
  // var moreFilters=['Small Dogs Allowed'];
  // var propertiesSort='Price: Low - High';
   //var squareFootage='2,000+ Sqft';
  // var Acreage='10+ Acres';




  await page.setDefaultTimeout(60000 * 10);
  await page.goto('https://www.rentler.com/', {
     timeout: 60000 * 2
  });
  await page.locator('id=Location').fill(CityName);
  await page.getByRole('button', {
     name: 'Search'
  }).click();

  const csvHeader = 'Rent,Address,Bed,Bath,Apartment Type\n';

  //If User is giving value
  if (Min != null) {
      await page.waitForSelector('#minprice');
     await page.locator('#minprice').click();
     await page.getByText(Min).nth(0).click();
  }

  //if user want to give max value
  if (Max != null) {
     await page.locator('#maxprice').click();
     await page.getByText(Max).nth(1).click();
  }

  console.log("Propertytype lenght", Propertytype.length);
  //if user want to give property type
  if (Propertytype.length > 0) {

     await page.locator('#property-fake').getByText('Property Type').click();

     for (let i = 0; i < Propertytype.length; i++) {

        await page.locator('form').getByText(Propertytype[i]).click();
     }

     await page.getByText('Show Results').first().click();
     await page.waitForNavigation({
        timeout: 60000,
        waitUntil: 'domcontentloaded'
     });

  }
  


  //user wants to give Bedrooms

  if (BedRooms.length > 0) {
     await page.locator('#bed-fake').click();

     for (let i = 0; i < BedRooms.length; i++) {

        await page.locator("div[class='custom-room-select']").getByText(BedRooms[i]).first().click();

     }
     await page.locator("div[class='custom-room-select']").nth(0).getByText('Show Results').click();
     await page.waitForNavigation({
        timeout: 60000,
        waitUntil: 'domcontentloaded'
     });
  }


   //user wants to give Bath Values

   if (Baths.length > 0) {
    await page.locator('#bath-fake').click();

    for (let i = 0; i < Baths.length; i++) {

       await page.locator("div[class='custom-room-select']").getByText(Baths[i],{ exact: true }).nth(1).click();

    }
   // await page.locator("div[class='custom-room-select']").nth(1).getByText('Show Results').click();
   await page.getByText('Show Results').nth(2).click();
    await page.waitForNavigation({
       timeout: 60000,
       waitUntil: 'domcontentloaded'
    });
 }

  //user wants to add more filters
  if (moreFilters.length > 0) {
    await page.getByText('More Filters',{ exact: true }).click();

    for (let i = 0; i < moreFilters.length; i++) {

       await page.getByText(moreFilters[i],{ exact: true }).click();

    }
   // await page.locator("div[class='custom-room-select']").nth(1).getByText('Show Results').click();
   await page.getByText('Show Results').nth(3).click();
    await page.waitForNavigation({
       timeout: 60000,
       waitUntil: 'domcontentloaded'
    });
 }


 if (squareFootage != null) {
  await page.getByText('More Filters',{ exact: true }).click();
 
    await page.getByRole('combobox').first().selectOption({label:squareFootage});
    await page.getByText('Show Results').nth(3).click();
   await page.waitForNavigation({
     timeout: 60000,
     waitUntil: 'domcontentloaded'
  });
}


if (Acreage != null) {
    await page.getByText('More Filters',).click();
 
    await page.getByRole('combobox').nth(1).selectOption({label:Acreage});
    await page.getByText('Show Results').nth(3).click();
   await page.waitForNavigation({
     timeout: 60000,
     waitUntil: 'domcontentloaded'
  });
}

  await page.waitForTimeout(10000);

  fs.writeFileSync(`City/${CityName}.csv`, csvHeader);
  var propertyCount = await page.locator("p[class='zeta search-result-text']").innerText();
  var TotalProperties = parseInt(propertyCount.replace(/[^\d]/g, ''), 10);
  console.log("Total Properties ", TotalProperties);


  if (!isNaN(TotalProperties)) { //condition check wether there is any listing or not
           
     if (propertiesSort!=null){
      //await page.locator("div[class='control-orderby select-wrap']").click();
      await page.getByRole('combobox').selectOption({label:propertiesSort});
      await page.waitForNavigation({
        timeout: 60000,
        waitUntil: 'domcontentloaded'
     });

     }
     var count = 0;
     try {
        do { //first it will check how many listing are there on single page

           await page.waitForSelector("div[class='col-12 col-lg-6']");
           const TotalListing = await page.$$("div[class='col-12 col-lg-6']");
           const CountListing = TotalListing.length;

           console.log("Total Number of Listing ", CountListing);


           for (let i = 0; i < CountListing; i++) { //for loop will run according to total listing on single page

              await page.waitForSelector("h3[class='price']:visible");
              await page.waitForSelector("div[class='address']:visible");
              await page.waitForSelector("div[class='bed-bath']:visible");

              var rent = await page.locator("h3[class='price']").nth(i).innerText();
              var Address = await page.locator("div[class='address']").nth(i).innerText();
              var Bedbath = await page.locator("div[class='bed-bath']").nth(i).innerText();

              // Convert the rent string to a number
              //const rentNumber = rent.replace(/[^\d]/g, ' '); // Remove non-digit characters
               const rentNumber = rent.replace(/[^\d$,]/g, '');

              // Remove line breaks from the address
              const address = Address.replace(/[\n\r]+/g, ' ');

              // Extract Bed, Bath, and Apartment using regular expressions
              const match = Bedbath.match(/(?:(\d+)\s*Bed\s*•\s*)?(\d+(?:\.\d+)?)\s*Bath\s*([^<]*)/);

              // If the match is successful, extract the values
              if (match) {
                 const bed = match[1] || 'Studio';
                 const bath = match[2];
                 const apartmentType = match[3].trim(); // Remove leading and trailing spaces

                 const csvData = `"${rentNumber}","${address}",${bed},${bath},"${apartmentType}"\n`;
                 await fs.appendFileSync(`City/${CityName}.csv`, csvData);

              }
              count++;
              if (count == TotalProperties) {
                 break;
              }
           }
           console.log(count);
           var nextPage = "a[class='next-page is-active']";
           var test = page.locator("a[class='next-page is-active']");

           if (count < TotalProperties) {
              await page.waitForTimeout(3000);  
              await page.reload();
              await test.click();
              await page.waitForNavigation({
                 timeout: 60000,
                 waitUntil: 'domcontentloaded'
              });
           }

        } while (count < TotalProperties);


     } finally {
        console.log("Total Listing ", count);
     }
  }

})