// This script automates the process of 
// scraping specific information from a list of URLs stored in a CSV file
// from the website www.copyrightable.com

import { parse } from 'csv-parse';

import { chromium } from 'playwright';
import fs from 'fs'
(async () => {
  // Launch a new browser instance
  const browser = await chromium.launch();
  const page = await browser.newPage();


  const urls = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream('mylinks1.csv')
        .pipe(parse({ delimiter: ',', from_line: 2 })) // Start from the second line if there's a header
        .on('data', (row) => {
          urls.push(row[0]); // Assuming URLs are in the first column
        })
        .on('end', () => resolve(urls))
        .on('error', (error) => reject(error));
    });

  // Navigate to your target URL
  console.log("my urls: ", urls)
  let count=0
 
  for (const link of urls)
  {
    
    await page.goto(link, { waitUntil: 'domcontentloaded' });

  // Use the CSS selector to scrape the content
  let content = await page.$eval(
    'body > main > div:nth-child(2) > div > div.flex.gap-8.mt-9.flex-col-reverse.md\\:flex-row',
    el => el.innerText
  );

  

  // Define labels to extract and initialize an object to hold the structured data
  const labels = [
    'Copyright Claimant',
    'Registration Number',
    'Registration Date',
    'Year of Creation',
    'Record Status',
    'Physical Description',
    'Personal Authors',
    'Corporate Authors',
    'Rights Note',
    'Application Title Statement',
    'Author Statement',
    'Authorship'
  ];
  
  // Initialize an object to store each label's corresponding value
  const scrapedData = {};
//Regular expression to match an email pattern after the last comma




  // Iterate over each label to extract and format corresponding values from the content
  labels.forEach(label => {
    const regex = new RegExp(`${label}:?\\s*([\\s\\S]*?)(?=\\n\\s*${labels.join('|')}|$)`, 'i');
    const match = content.match(regex);
    if (match) {
      scrapedData[label] = match[1].trim();
      
    }
  });

  
  const shortValues = {};
  Object.entries(scrapedData).forEach(([key, value]) => {
    shortValues[key] = value.split('\n')[0].trim();
  });
  
  
  Object.entries(shortValues).forEach(([key, value]) => {
     if (key === 'Registration Number') {
      // Extract the text until the first comma
      const valueUntilComma = value.split(',')[0].trim();
    
       shortValues['Registration Number']=valueUntilComma
    }
    if(key==='Rights Note')
      {
        
        const emailMatch = value.match(/[^,]*@[^,]*$/);
        const email = emailMatch ? emailMatch[0].trim() : "N/A";
      
        // Log the extracted email
        shortValues['Email']=email

        // Remove the email from the value string
        if (emailMatch) {
          value= value.replace(emailMatch[0], '').trim();
          // Remove any trailing comma and whitespace
          value = value.replace(/,\s*$/, '');
          shortValues['Rights Note']=value
         }
      }
      if(!value)
        shortValues[key]='N/A'
  });
   // for (const [key, value] of Object.entries(scrapedData)) {
  //   console.log(`${key}: ${value}`);
  // }
  

   for (const [key, value] of Object.entries(shortValues)) {
       if(value=='')
        shortValues[key]= 'N/A'
      shortValues[key]= value.replace(/,/g, "");
  }

   
  // Optionally, prepare this data for CSV export
  const headersOrder = [
    'Copyright Claimant',
    'Application Title Statement',
    'Email',
    'Registration Number',
    'Registration Date',
    'Year of Creation',
    'Record Status',
    'Physical Description',
    'Personal Authors',
    'Corporate Authors',
    'Rights Note',
    'Author Statement',
    'Authorship'
  ];

  // Create CSV rows
  const csvRows = [];
  //csvRows.push(headersOrder.join(',')); // Add shuffled headers
  const values = headersOrder.map(header => shortValues[header] || ''); // Map values based on new header order
  csvRows.push(values.join(',')); // Add values

  // Write the CSV data to a file
  const csvData = csvRows.join('\n') + '\n';
  fs.appendFileSync('updated_data1.csv', csvData);

  
  console.log('record no- ',++count);
}
  // Close the browser
  await browser.close();
})();

