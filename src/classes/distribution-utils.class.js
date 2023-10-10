export default function DistributionUtils(data) {
    this.data = data;
}

DistributionUtils.prototype.getDistributionsByType = function(type) {
    return this.data.find( fee => fee.order_item_type === type ).distributions
        .map( (distribution) => { return {
            name: distribution.name,
            amount: +distribution.amount,
        }});
}

DistributionUtils.prototype.calculateTotalAmountFromDistributions = function(distributions) {
    return distributions.reduce( (accumulate, distribution) => accumulate + (+distribution.amount), 0 );
}

DistributionUtils.prototype.addOriginalDistributionsToDistributionsResult = function(distributionsResult) {
    const originalDistributions = this.getDistributionsByType( distributionsResult.type );

    return distributionsResult.distributions.map( (distribution, i) => {
        if( distribution.name != 'Others' ) return {
            name: distribution.name,
            amount: +distribution.amount + (+originalDistributions[i].amount)
        };

        return distribution;
    });
}

DistributionUtils.prototype.accumulateDistributionToDistributionsArray = function(distributions, distribution) {
    const dis = distributions.find( (d) => d.name === distribution.name );

    if( dis ) {
        dis.amount += distribution.amount;
        return;
    }

    distributions.push( distribution );
}