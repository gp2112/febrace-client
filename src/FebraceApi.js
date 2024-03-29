
const axios = require('axios');

const URL = 'https://api.febrace.guip.dev/'



async function getTableColumns(tablename) {
    const r = await axios.get(URL+tablename+'/cols');
    console.log(await r.data);

    return await r.data;
}

async function tableRequest(tableName, fields, filters, limit) {

    const r = await axios.get(
          URL+tableName, {
          params: { 
              fields: fields.join(','),
              filters: JSON.stringify(filters),
              limit: limit
          },
              headers: {
                  "Content-Type" : "application/x-www-form-urlencoded"
              }
       });

    console.log(r);
    return r.data;
}

export {tableRequest, getTableColumns};
