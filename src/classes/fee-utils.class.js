import { FEE_TYPES } from '../static/fee.types.js';

export default function FeeUtils(data) {
    this.data = data;
};

FeeUtils.prototype.getFeeByOrderType = function(type) {
    return this.data.find(fee => fee.order_item_type === type).fees;
}

FeeUtils.prototype.calculateTotalAmount = function(feesArray, order) {
    const flatAmount = +feesArray.find( fee => fee.type === FEE_TYPES.FLAT ).amount;
    
    if( order.pages < 1 ) return 0;
    
    if( order.pages === 1 ) return flatAmount;
    
    const perPageAmount = +feesArray.find( fee => fee.type === FEE_TYPES.PER_PAGE ).amount;
    return flatAmount + perPageAmount * (order.pages - 1);
}