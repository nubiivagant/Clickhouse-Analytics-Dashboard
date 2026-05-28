const analyticsService = require('./services/analyticsService');

async function test() {
  try {

    console.log('Testing Filters...\n');

    const data =
      await analyticsService.getGenderAnalysis({
        lunch: 'standard'
      });

    console.table(data);

    console.log('\nSUCCESS');

  } catch(error) {

    console.error(error);

  }
}

test();