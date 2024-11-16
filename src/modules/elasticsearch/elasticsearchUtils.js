const client = require('./elasticsearch');
const cron = require('node-cron');
const fs = require('fs');
const moment = require('moment');
const { writeDebug, writeError, writeInfo } = require('../../modules/logs');


async function addDocument(document, indexPattern) {
  const aliasName = `${indexPattern}_write`; 

  try {
    await client.index({
      index: aliasName, 
      body: document,
      refresh: true 
    });
  } catch (error) {
    console.log(error)
  }
}

async function checkWriteAlias(indexPattern) {
  const aliasName = `${indexPattern}_write`;
  try {
    const response = await client.indices.getAlias({ name: aliasName });
    const indices = Object.keys(response);
    
    if (indices.length > 1) {
        indices.forEach(async (index) => {
          if (index !==  `${indexPattern}_${moment().format('YYYYMMDD')}`) {
            await client.indices.updateAliases({
              body: {
                actions: [
                  {
                    remove: {
                      index: index,
                      alias: aliasName
                    }
                  }
                ]
              }
            });
          }
        })
    }
  } catch (error) {
    writeError({message: 'ErrorDeletingWriteAlias', extra: error});
  } 
}

async function createIndex(indexPattern, indexSetting) {
  const indexName = `${indexPattern}_${moment().format('YYYYMMDD')}`;
  const indexConfig = JSON.parse(fs.readFileSync(indexSetting, 'utf8'));

  try {
    await client.indices.create({
      index: indexName,
      body: indexConfig
    });

    writeInfo('IndexCreated' + indexName);

    await client.indices.putAlias({
      index: indexName,
      name: `${indexPattern}_read`
    });

   
    await client.indices.putAlias({
      index: indexName,
      name: `${indexPattern}_write`
    });
  

    writeDebug('IndexAliasAssigned');

  } catch (error) {
    writeError({message: 'ErrorCreatingIndices', extra: error});
  }
}

async function deleteOldIndices(indexPattern) {
  try {
    const indices = await client.cat.indices({ format: 'json' });
    const cleanDate = new Date();
    
    cleanDate.setDate(cleanDate.getDate() - process.env.INDEX_LOG_MAX_DAYS);
    for (const index of indices) {
        if (index.index.startsWith(indexPattern)) {
            const indexDate = new Date(index.index.split('_').pop());
            if (indexDate < cleanDate) {
              await client.indices.delete({ index: index.index });
              writeInfo('IndexDeleted' + index.index);
            }
        }
    }
  } catch (error) {
    writeError('ErrorDeleteOldIndices', error);
  }
}

async function init(indexPattern, indexSetting) {
  const indexName = `${indexPattern}_${moment().format('YYYYMMDD')}`;
  const indexExists = await client.indices.exists({ index: indexName });
  
  writeInfo('CheckingElasticSearchStatus' + indexPattern);
  
  if (!indexExists) {
    await createIndex(indexPattern, indexSetting);
  }
  await deleteOldIndices(indexPattern);
  await checkWriteAlias(indexPattern);
 
}

function schedule(indexPattern, indexSetting) {
  writeInfo('StartingElasticsearchSchedule' + indexPattern);
  init(indexPattern, indexSetting);
  cron.schedule( '0 */10 * * * *', () => {
    init(indexPattern, indexSetting);
  });
}

module.exports = {
  addDocument,
  schedule
};