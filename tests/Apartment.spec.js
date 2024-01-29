
// const { test, expect } = require('@playwright/test');


// test('Apartment.com', async ({ page }) => {
  
//   var City='Utah';
//   await page.setDefaultTimeout(60000*3);
//   await page.goto('https://www.apartments.com/',{ 
//     timeout: 60000 * 2
//  });

//  await page.getByPlaceholder('Search by Location or Point').click();
//  await page.getByPlaceholder('Search by Location or Point').fill('Utah');
//  await page.getByRole('button', { name: 'Search', exact: true }).click();

//  // await page.locator('#quickSearchLookup').fill(City);
//  // await page.getByRole('button', { name: 'Search', exact: true }).click();
//   await page.waitForNavigation({
//     timeout: 60000,
//     waitUntil: 'domcontentloaded'
//  });

//   var Count=0;

//   do{
    
//     var listingOnPage=await page.$$("li[class='mortar-wrapper']");
//     Count=Count+listingOnPage.length;
//    // console.log("Total Listing on single page ", listingOnPage.length);
//     console.log(Count)
//     var nextBtn=await page.getByLabel('Next Page');
    
//     for(let i=0;i<listingOnPage.length;i++){
//      await page.waitForSelector("div[class='property-title']");
//      var propertytitle=  await page.locator("div[class='property-title']").nth(i).innerText();
//      console.log(propertytitle);

//     }
 
//    var nextBtnisVisible = await nextBtn.isVisible();
//    var isTrue=Boolean(nextBtnisVisible);
//    if(isTrue==false){
//     break;
//    }
//    nextBtn.click();
//    await page.waitForNavigation({
//     timeout: 60000,
//     waitUntil: 'domcontentloaded'
//  });
     
//   }while(isTrue);


 
  
// });
