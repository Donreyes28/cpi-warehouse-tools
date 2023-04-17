const puppeteer = require('puppeteer');
const ExcelJS = require('exceljs');
const path = require('path');
const CONST = require('./constants/order-details-const')
const {authenticator} = require('otplib');
const {fileURLToPath} = require('url');
const { signIn } = require('../utils/scUtil');
const { getOpenRequest, getImportRequest, updateOpenRequest } = require('../utils/api');
const { updateImportStatus } = require('../services/imports');
const { logger, writeToExcel } = require('../utils/workerUtils');
const { readFileFromS3 } = require('../utils/s3');

const getOrderDetails = async (orderIDs) => {
  let results = [];
  let { browser } = await signIn();

  const page = await browser.newPage()

  // await page.goto('https://sellercentral.amazon.com/orders-v3/order/113-9018679-8840216');
  // await page.goto('https://sellercentral.amazon.com/orders-v3/order/111-0483616-4731439');
  // await page.goto('https://sellercentral.amazon.com/orders-v3/order/114-8929740-8050665');
  
  for (let x in orderIDs) {
    let orderId = orderIDs[x];
    await page.goto(`https://sellercentral.amazon.com/orders-v3/order/${orderId}`);
    const orderDetails = await page.evaluate((orderId, CONST) => {
      let odArr;

      // ! Order summary
      const shipByDate = document.querySelector(CONST.COLUMNLINK1 + 'tr:nth-child(1) > td.a-color-state.a-text-left.a-align-bottom.a-text-bold > span') ? document.querySelector(CONST.COLUMNLINK1 + 'tr:nth-child(1) > td.a-color-state.a-text-left.a-align-bottom.a-text-bold > span').textContent : 'n/a';

      const deliverBy = document.querySelector(CONST.COLUMNLINK1 + 'tr:nth-child(2) > td.a-color-.a-text-left.a-align-bottom') ? document.querySelector(CONST.COLUMNLINK1 + 'tr:nth-child(2) > td.a-color-.a-text-left.a-align-bottom').textContent : 'n/a';

      const purchaseDate = document.querySelector(CONST.COLUMNLINK1 + 'tr:nth-child(3) > td.a-color-.a-text-left.a-align-bottom') ? document.querySelector(CONST.COLUMNLINK1 + 'tr:nth-child(3) > td.a-color-.a-text-left.a-align-bottom').textContent : 'n/a';

      const shippingService = document.querySelector(CONST.COLUMNLINK2 + 'tr:nth-child(1) > td.a-color-.a-text-left.a-align-bottom > span > span > span') ? document.querySelector(CONST.COLUMNLINK2 + 'tr:nth-child(1) > td.a-color-.a-text-left.a-align-bottom > span > span > span').innerHTML : 'n/a';

      const fulfillment = document.querySelector(CONST.COLUMNLINK2 + 'tr:nth-child(2) > td.a-color-.a-text-left.a-align-bottom > span > span') ? document.querySelector(CONST.COLUMNLINK2 + 'tr:nth-child(2) > td.a-color-.a-text-left.a-align-bottom > span > span').textContent : 'n/a';

      const salesChannel = document.querySelector(CONST.COLUMNLINK2 + 'tr:nth-child(3) > td.a-color-.a-text-left.a-align-bottom > span:first-of-type') ? document.querySelector(CONST.COLUMNLINK2 + 'tr:nth-child(3) > td.a-color-.a-text-left.a-align-bottom > span:first-of-type').textContent.trim() : 'n/a';

      // ! Ship to details
      const shipToDetails = document.querySelector(CONST.SHIPTOLINK + 'div.a-column.a-span6 > table > tbody > tr:nth-child(1) > td > span > span:nth-child(3) > div > div').innerText.replace('\n', ' ');
      const formattedShipToDetails = shipToDetails.replace(/(\d+)\s+(\D+)(\w{3})\n(\D+)/, '$1 $2$3 $4');

      const addressType = document.querySelector('[data-test-id="shipping-section-buyer-address-type"]') ? document.querySelector('[data-test-id="shipping-section-buyer-address-type"]').textContent.replace('Address Type:', '').trim() : 'n/a';
      const contactBuyer = document.querySelector(CONST.SHIPTOLINK + 'div:nth-child(2) > div > table > tbody > tr > td.a-color-.a-text-left.a-align-bottom') ? document.querySelector(CONST.SHIPTOLINK + 'div:nth-child(2) > div > table > tbody > tr > td.a-color-.a-text-left.a-align-bottom').textContent : 'n/a';

      const receiverPhone = document.querySelector(CONST.SHIPTOLINK + 'div:nth-child(2) > div > table > tbody > div > tr > td.a-text-left.a-align-bottom > span') ? document.querySelector(CONST.SHIPTOLINK + 'div:nth-child(2) > div > table > tbody > div > tr > td.a-text-left.a-align-bottom > span').textContent : 'n/a';

      // ! Order contents
      let orderContents = [];
      orderDetailLink = '#MYO-app > div > div.a-row.a-spacing-medium > div.a-column.a-span10 > div > div.a-row.a-spacing-large > div > table > tbody >';
      const trLen = document.querySelectorAll(CONST.ORDERDETAILLINK + `tr`).length;

      for (let i = 1; i <= trLen; i++) {
        let ocDetails = [];
        for (let x = 1; x < 8; x++) {
          ocDetails.push(document.querySelector(CONST.ORDERDETAILLINK + `tr:nth-child(${i}) > td:nth-child(${x})`).textContent);
        }
        orderContents.push(ocDetails);
      }

      odArr = [];
      orderContents.map(prod => {
        const orderContent = prod[6];
        const formattedContent = orderContent
          .replace(/(Item subtotal:)\s*\$([\d.]+)/g, '$1 $2,')
          .replace(/(Tax:)\s*\$([\d.]+)/g, '$1 $2,')
          .replace(/(Item total:)\s*\$([\d.]+)/g, '$1 $2');

        const prodName = prod[2];
        const asinIndex = prodName.indexOf("ASIN")
        const productName = prodName.substring(0,asinIndex)

        const asinPattern = /ASIN:\s*([^\s]+)/;
        const match = prodName.match(asinPattern);
        const asin = match[1].replace('SKU:', '');

        const skuPattern = /SKU:\s*([^\s]+)/;
        const skuMatch = prodName.match(skuPattern);
        const sku = skuMatch[1].replace('SKU:','');

        odArr.push({
          orderId: orderId,
          status: prod[0],
          productName: productName,
          ASIN: asin,
          SKU: sku,
          moreInformation: prod[3],
          quantity: prod[4],
          unitPrice: prod[5],
          proceeds: formattedContent,
          shipDate: shipByDate,
          deliveryDate: deliverBy,
          purchaseDate: purchaseDate,
          shippingService: shippingService,
          fulfillment: fulfillment,
          salesChannel: salesChannel,
          shipToDetails: formattedShipToDetails,
          contactBuyer: contactBuyer,
          receiverPhone: receiverPhone,
        });
      });

      return odArr;
    },orderId,CONST);
    results.push(orderDetails);
  }

  await browser.close();
  return results;
};

const main = async () => {
  let rows=[];

  let checkFailedRequest = await getImportRequest('order-details', 'failed')
  if(checkFailedRequest.length > 0) logger('Order Details', 'There are request/s that have failed please review imports')
  
  let getOngoingRequest = await getImportRequest('order-details', 'on-going')
  if(getOngoingRequest.length > 0) return logger('Order Details', 'There is still an ongoing request')
  
  let getOpenRequest = await getImportRequest('order-details', 'open')
  if(getOpenRequest.length === 0) return logger('Order Details', 'No open requests')
  
  const batch = getOpenRequest[0]
  const { id, batchId } = getOpenRequest[0];
  console.log(`Processing Batch ID:${batchId}`)
  batch.newStatus = 'on-going';
  await updateOpenRequest(id, batch)
  
  try {
    const s3OrderData = await readFileFromS3();
    console.log(s3OrderData);

    const orderData = await getOrderDetails(['111-0746347-2825000','113-9018679-8840216','111-0483616-4731439'])
    //* INSERT WRITE EXCEL DATA HERE
    orderData.forEach(item => {
      item.map(prod => {
        rows.push({
          orderId: prod.orderId,
          ASIN: prod.ASIN,
          SKU: prod.SKU,
          status: prod.status,
          productName: prod.productName,
          moreInformation: prod.moreInformation,
          quantity: prod.quantity,
          unitPrice: prod.unitPrice,
          proceeds: prod.proceeds,
          shipDate: prod.shipDate,
          deliveryDate: prod.deliveryDate,
          purchaseDate: prod.purchaseDate,
          shippingService: prod.shippingService,
          fulfillment: prod.fulfillment,
          salesChannel: prod.salesChannel,
          shipToDetails: prod.shipToDetails,
          contactBuyer: prod.contactBuyer,
          receiverPhone: prod.receiverPhone,
        });
      })
    });

    let columns = [
      {key: 'orderId', header: 'Order ID'},
      {key: 'ASIN', header: 'ASIN'},
      {key: 'SKU', header: 'SKU'},
      {key: 'status', header: 'Order Status'},
      {key: 'productName', header: 'Product Name'},
      {key: 'moreInformation', header: 'More Information'},
      {key: 'quantity', header: 'Quantity'},
      {key: 'unitPrice', header: 'Unit Price'},
      {key: 'proceeds', header: 'Proceeds'},
      {key: 'shipDate', header: 'Ship by'},
      {key: 'deliveryDate', header: 'Deliver by'},
      {key: 'purchaseDate', header: 'Purchase Date'},
      {key: 'shippingService', header: 'Shipping Service'},
      {key: 'fulfillment', header: 'Fulfillment'},
      {key: 'salesChannel', header: 'Sales Channel'},
      {key: 'shipToDetails', header: 'Ship to Details'},
      {key: 'contactBuyer', header: 'Contact Buyer'},
      {key: 'receiverPhone', header: 'Phone'},
    ]
    // let excelWriter = await writeToExcel('Order Data', rows, columns)
    batch.newStatus = 'completed';
    await updateOpenRequest(id, batch)
    console.log("Finished")
  } 
  catch (error) {
    console.log(error)
    let getOngoingRequest = await getImportRequest('order-details', 'on-going')
    getOngoingRequest[0].newStatus = 'failed'
    await updateImportStatus(getOngoingRequest[0].id, getOngoingRequest[0])
    logger('Order details', 'Request failed')
  }
}


main();
setInterval(async () => {
  await main();
},6000);

