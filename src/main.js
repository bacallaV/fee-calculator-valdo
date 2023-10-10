import feesData from './data/fees.json' assert { type: "json" };
import ordersData from './data/orders.json' assert { type: "json" };
import FeeUtils from './classes/fee-utils.class.js';
import DistributionUtils from './classes/distribution-utils.class.js';

/* Part 1: Fees */
console.log('\n\n*** Part 1: Fees ***\n');

const feeUtils = new FeeUtils( feesData );

let orderTotalAmount;
for (let i = 0; i < ordersData.length; i++) {
    const order = ordersData[i];
    orderTotalAmount = 0;

    console.log(`Order ID: ${order.order_number}`);

    for (let j = 0; j < order.order_items.length; j++) {
        const fees = feeUtils.getFeeByOrderType( order.order_items[j].type );
        const price = feeUtils.calculateTotalAmount( fees, order.order_items[j] );

        orderTotalAmount += price;

        console.log(`\tOrder item ${j + 1}: $${price}`);
    }

    console.log(`\n\tOrder total: $${orderTotalAmount}\n`);
}



/* Part 2: Distributions */
console.log('\n\n*** Part 2: Distributions ***');

const distributionUtils = new DistributionUtils(feesData);

let finalDistributions;
finalDistributions = [];

for (let i = 0; i < ordersData.length; i++) {
    const order = ordersData[i];

    console.log(`\nOrder ID: ${order.order_number}`);

    let distributionsResult;
    distributionsResult = [];
    for (let j = 0; j < order.order_items.length; j++) {
        const fees = feeUtils.getFeeByOrderType( order.order_items[j].type );
        const distributions = distributionUtils.getDistributionsByType( order.order_items[j].type );

        const totalAmountFromDistributions = distributionUtils.calculateTotalAmountFromDistributions( distributions );
        const price = feeUtils.calculateTotalAmount( fees, order.order_items[j] );
        const otherFundAmount = price - totalAmountFromDistributions;

        const distributionResult = distributionsResult.find( (distributionResult) => distributionResult.type === order.order_items[j].type );

        if( !distributionResult ) {
            let distributionsToAdd = JSON.parse( JSON.stringify(distributions) );

            if( otherFundAmount > 0 ) {
                distributionsToAdd.push({
                    name: 'Others',
                    amount: otherFundAmount,
                });
            }

            distributionsResult.push({
                type: order.order_items[j].type,
                distributions: distributionsToAdd,
            });
        } else {
            distributionResult.distributions = distributionUtils.addOriginalDistributionsToDistributionsResult( distributionResult );

            if( otherFundAmount > 0 ) distributionResult.distributions[distributionResult.distributions.length - 1].amount += otherFundAmount;
        }
    }

    for (const distributionResult of distributionsResult) {
        for (const distribution of distributionResult.distributions) {
            distributionUtils.accumulateDistributionToDistributionsArray( finalDistributions, distribution );

            console.log(`\tFund - ${distribution.name}: $${distribution.amount}`);
        }
    }
}

console.log('\nTotal distributions:');

for (const finalDistribution of finalDistributions) {
    console.log(`\tFund - ${finalDistribution.name}: $${finalDistribution.amount}`);
}